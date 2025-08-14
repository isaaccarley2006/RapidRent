# CRITICAL FIX PACK - DEPLOYMENT RUNBOOK

## ENVIRONMENT SETUP
```bash
# Set environment variables
export SUPABASE_DB_URL="postgresql://postgres:[PASSWORD]@db.jerfstkniwyxnsnimcrv.supabase.co:5432/postgres"
export BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M)
export BACKUP_FILE="backup_${BACKUP_TIMESTAMP}.dump"
```

---

## PHASE 1: BACKUP

### 1.1 Create Production Backup
```bash
# Create custom format backup
pg_dump "$SUPABASE_DB_URL" \
  --format=custom \
  --verbose \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --file="$BACKUP_FILE"

# Verify backup created
ls -lh "$BACKUP_FILE"
echo "Expected: File size > 100KB, created timestamp matches current time"
```

**Expected Result:**
```
-rw-r--r-- 1 user user 245K Dec 14 17:30 backup_20241214_1730.dump
```

---

## PHASE 2: STAGING DEPLOYMENT

### 2.1 Apply Critical Fix Pack UP Migration
```sql
-- Connect to staging database
psql "$SUPABASE_DB_URL"

-- Apply the Critical Fix Pack (this was already applied via migration tool)
-- Verify the migration was applied by checking policies and trigger
\x on

-- Check users policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users' 
ORDER BY policyname;

-- Expected: 2 policies
-- Users can view their own record (SELECT)
-- Users can update their own record (UPDATE)

-- Check offers policies  
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'offers' 
ORDER BY policyname;

-- Expected: 5 policies with "(transitional)" suffix
-- All using COALESCE(tenant_id, renter_id) or COALESCE(property_id, listing_id)

-- Check sync trigger exists
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'offers' 
  AND trigger_name = 'sync_offers_columns_trigger';

-- Expected: 1 row showing BEFORE INSERT OR UPDATE trigger
```

### 2.2 Staging Smoke Tests

#### Test 2.2a: Users RLS Isolation
```sql
-- Create test renter user
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'test-renter@example.com',
  now(),
  now(),
  now()
);

-- Create test landlord user
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222', 
  'test-landlord@example.com',
  now(),
  now(),
  now()
);

-- Set session to renter
SET request.jwt.claims TO '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';

-- Test renter can only see their own record
SELECT id, role FROM public.users WHERE id = '11111111-1111-1111-1111-111111111111'::uuid;
-- Expected: 1 row returned

SELECT count(*) FROM public.users WHERE id != '11111111-1111-1111-1111-111111111111'::uuid;
-- Expected: 0 (RLS blocks access to other users)

-- Switch to landlord session
SET request.jwt.claims TO '{"sub": "22222222-2222-2222-2222-222222222222", "role": "authenticated"}';

-- Test landlord can only see their own record
SELECT id, role FROM public.users WHERE id = '22222222-2222-2222-2222-222222222222'::uuid;
-- Expected: 1 row returned

SELECT count(*) FROM public.users WHERE id != '22222222-2222-2222-2222-222222222222'::uuid;
-- Expected: 0 (RLS blocks access to other users)
```

#### Test 2.2b: Offers Column Synchronization
```sql
-- Create test property for landlord
INSERT INTO public.properties (id, landlord_id, title, price, status)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'Test Property',
  1000,
  'listed'
);

-- Switch to renter session
SET request.jwt.claims TO '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';

-- Insert offer using legacy columns only
INSERT INTO public.offers (tenant_id, property_id, offer_price, status)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  950,
  'pending'
)
RETURNING id, tenant_id, renter_id, property_id, listing_id;

-- Expected: tenant_id = renter_id AND property_id = listing_id (sync trigger worked)

-- Insert another offer using new columns only
INSERT INTO public.offers (renter_id, listing_id, offer_price, status)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  975,
  'pending'
)
RETURNING id, tenant_id, renter_id, property_id, listing_id;

-- Expected: tenant_id = renter_id AND property_id = listing_id (sync trigger worked)

-- Verify renter can read their offers
SELECT id, tenant_id, renter_id, property_id, listing_id, offer_price 
FROM public.offers 
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'::uuid;

-- Expected: 2 rows, all columns properly synchronized
```

#### Test 2.2c: Landlord Access Control
```sql
-- Switch to landlord session (property owner)
SET request.jwt.claims TO '{"sub": "22222222-2222-2222-2222-222222222222", "role": "authenticated"}';

-- Landlord should see offers on their property
SELECT id, tenant_id, renter_id, offer_price 
FROM public.offers 
WHERE property_id = '33333333-3333-3333-3333-333333333333'::uuid;

-- Expected: 2 rows (the offers from renter)

-- Create different landlord
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'test-landlord2@example.com',
  now(),
  now(),
  now()
);

-- Switch to different landlord session
SET request.jwt.claims TO '{"sub": "44444444-4444-4444-4444-444444444444", "role": "authenticated"}';

-- Different landlord should NOT see offers on other's property
SELECT count(*) 
FROM public.offers 
WHERE property_id = '33333333-3333-3333-3333-333333333333'::uuid;

-- Expected: 0 (RLS blocks access to other landlord's property offers)
```

#### Test 2.2d: Foreign Key Constraint Test
```sql
-- Attempt to delete renter who has offers (should fail if FK exists)
DELETE FROM auth.users WHERE id = '11111111-1111-1111-1111-111111111111'::uuid;

-- Expected: Error if FK constraint exists, success if no constraint
-- Note: Check the actual FK setup in your schema
```

### 2.3 Smoke Test Validation
```sql
-- Final verification queries
SELECT 'Users Policies' as test, count(*) as policy_count 
FROM pg_policies 
WHERE tablename = 'users';
-- Expected: 2

SELECT 'Offers Policies' as test, count(*) as policy_count 
FROM pg_policies 
WHERE tablename = 'offers' AND policyname LIKE '%transitional%';
-- Expected: 5

SELECT 'Sync Trigger' as test, count(*) as trigger_count 
FROM information_schema.triggers 
WHERE event_object_table = 'offers' AND trigger_name = 'sync_offers_columns_trigger';
-- Expected: 1

-- Clean up test data
DELETE FROM public.offers WHERE tenant_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
);

DELETE FROM public.properties WHERE id = '33333333-3333-3333-3333-333333333333';

DELETE FROM auth.users WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222', 
  '44444444-4444-4444-4444-444444444444'
);

\q
```

---

## PHASE 3: ROLLBACK PROCEDURES

### 3.1 Apply DOWN Migration (if needed)
```sql
-- Connect to database
psql "$SUPABASE_DB_URL"

-- ROLLBACK SQL (manual execution since migration tool handled UP)
-- Remove sync trigger
DROP TRIGGER IF EXISTS sync_offers_columns_trigger ON public.offers;
DROP FUNCTION IF EXISTS public.sync_offers_columns();

-- Drop transitional policies
DROP POLICY IF EXISTS "Tenants can view their own offers (transitional)" ON public.offers;
DROP POLICY IF EXISTS "Tenants can create their own offers (transitional)" ON public.offers;
DROP POLICY IF EXISTS "Tenants can update their own offers (transitional)" ON public.offers;
DROP POLICY IF EXISTS "Landlords can view offers on their properties (transitional)" ON public.offers;
DROP POLICY IF EXISTS "Landlords can update offers on their properties (transitional)" ON public.offers;

-- Restore original legacy policies
CREATE POLICY "Tenants can view their own offers"
ON public.offers FOR SELECT
TO authenticated
USING ( tenant_id = auth.uid() );

CREATE POLICY "Tenants can create their own offers"
ON public.offers FOR INSERT
TO authenticated
WITH CHECK ( tenant_id = auth.uid() );

CREATE POLICY "Tenants can update their own offers"
ON public.offers FOR UPDATE
TO authenticated
USING ( tenant_id = auth.uid() );

CREATE POLICY "Landlords can view offers on their properties"
ON public.offers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_id
      AND p.landlord_id = auth.uid()
  )
);

CREATE POLICY "Landlords can update offers on their properties"
ON public.offers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_id
      AND p.landlord_id = auth.uid()
  )
);

-- Remove users policies
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own record" ON public.users;

\q
```

### 3.2 Full Database Restore (if rollback fails)
```bash
# Stop application traffic first!
# Then restore from backup
pg_restore \
  --dbname="$SUPABASE_DB_URL" \
  --verbose \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  "$BACKUP_FILE"

# Verify restore
psql "$SUPABASE_DB_URL" -c "SELECT count(*) FROM pg_policies WHERE tablename IN ('users', 'offers');"
# Expected: Original policy count before migration
```

---

## PHASE 4: PRODUCTION DEPLOYMENT

### 4.1 Production Backup
```bash
# Same as staging backup
export PROD_BACKUP_FILE="prod_backup_${BACKUP_TIMESTAMP}.dump"
pg_dump "$SUPABASE_DB_URL" \
  --format=custom \
  --verbose \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --file="$PROD_BACKUP_FILE"

# Verify backup
ls -lh "$PROD_BACKUP_FILE"
```

### 4.2 Production Apply
```bash
# The Critical Fix Pack was already applied via Supabase migration tool
# Verify it's applied in production by checking policies and trigger
psql "$SUPABASE_DB_URL" -c "
SELECT 'Migration Applied' as status, 
       (SELECT count(*) FROM pg_policies WHERE tablename = 'users') as users_policies,
       (SELECT count(*) FROM pg_policies WHERE tablename = 'offers' AND policyname LIKE '%transitional%') as offers_policies,
       (SELECT count(*) FROM information_schema.triggers WHERE event_object_table = 'offers' AND trigger_name = 'sync_offers_columns_trigger') as sync_trigger;
"

# Expected: users_policies=2, offers_policies=5, sync_trigger=1
```

### 4.3 Production Smoke Tests
```bash
# Run same smoke tests as staging (2.2a through 2.2d)
# Use production database URL and test with real application accounts if possible
```

### 4.4 24-Hour Monitoring
```bash
# Monitor Supabase logs for RLS denials or errors
# Check these areas:

# 1. Database logs
echo "Monitor database logs for RLS policy violations"
echo "Look for: 'new row violates row-level security policy'"

# 2. Application logs  
echo "Monitor application logs for:"
echo "- Authentication errors"
echo "- Failed offer operations"
echo "- User access issues"

# 3. Performance metrics
echo "Monitor for:"
echo "- Increased response times on offers/users tables"
echo "- Query execution plan changes"
echo "- Connection pooling issues"

# 4. Success metrics to verify
echo "Verify these work correctly:"
echo "- User registration/login"
echo "- Offer creation by tenants"
echo "- Offer viewing by landlords"
echo "- Profile updates"
```

---

## SUCCESS CRITERIA

### ✅ Deployment Successful If:
- All smoke tests pass
- Users can only access their own records in `public.users`
- Offers table supports both legacy and new column access patterns
- Column synchronization trigger works correctly
- Cross-user data isolation maintained
- No RLS policy violation errors in logs
- Application functionality remains intact

### ❌ Rollback Required If:
- Any smoke test fails
- RLS policy violations detected
- Users can access other users' data
- Offers table access patterns broken
- Application errors increase
- Data corruption detected

---

## EMERGENCY CONTACTS
- **Database Admin:** [Contact Info]
- **Application Team:** [Contact Info]
- **DevOps Team:** [Contact Info]

---

## COMMANDS SUMMARY
```bash
# Backup
pg_dump "$SUPABASE_DB_URL" --format=custom --file="backup_$(date +%Y%m%d_%H%M).dump"

# Apply (already done via migration tool)
# Verify: Check policies and trigger exist

# Rollback (if needed)
# Execute manual DOWN SQL commands

# Restore (if rollback fails)  
pg_restore --dbname="$SUPABASE_DB_URL" --clean backup_file.dump
```