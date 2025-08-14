# CRITICAL FIX PACK - Production Runbook

## OVERVIEW
This runbook addresses critical RLS and data integrity issues:
- **A)** Users table has RLS enabled but no policies  
- **B)** Offers table has duplicate columns with incomplete RLS coverage
- **C)** No synchronization between legacy/new columns

## PRE-FLIGHT CHECKLIST
- [ ] Staging environment ready
- [ ] Production backup scheduled
- [ ] Rollback plan confirmed
- [ ] Team notified of maintenance window

---

## PHASE 1: BACKUP & STAGING

### 1.1 Production Backup
```bash
# Create timestamped backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump "postgresql://postgres:[password]@[host]:5432/postgres" \
  --verbose --clean --if-exists --no-owner --no-privileges \
  > "backup_pre_critical_fix_${TIMESTAMP}.sql"

# Verify backup integrity
echo "Backup size: $(du -h backup_pre_critical_fix_${TIMESTAMP}.sql)"
echo "Backup lines: $(wc -l backup_pre_critical_fix_${TIMESTAMP}.sql)"
```

### 1.2 Apply to Staging
```sql
-- Apply UP migration
\i supabase/migrations/20250814170000_critical_fix_pack_up.sql

-- Verify policies created
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('users', 'offers')
ORDER BY tablename, policyname;

-- Verify trigger created
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'offers';
```

### 1.3 Staging Smoke Tests

#### Test 1: Users RLS
```sql
-- Test user can view their own record
SELECT id, role FROM public.users WHERE id = auth.uid();

-- Test user cannot view other users (should return empty)
SELECT count(*) FROM public.users WHERE id != auth.uid();
```

#### Test 2: Offers Legacy Column Access
```sql
-- Create test data (as tenant)
INSERT INTO public.offers (tenant_id, property_id, offer_price, status)
VALUES (auth.uid(), 'test-property-uuid', 1000, 'pending');

-- Verify can view own offer
SELECT id, tenant_id, property_id FROM public.offers WHERE tenant_id = auth.uid();
```

#### Test 3: Offers New Column Access  
```sql
-- Insert using new columns
INSERT INTO public.offers (renter_id, listing_id, offer_price, status)
VALUES (auth.uid(), 'test-property-uuid', 1100, 'pending');

-- Verify can view own offer via new columns
SELECT id, renter_id, listing_id FROM public.offers WHERE renter_id = auth.uid();
```

#### Test 4: Column Synchronization
```sql
-- Insert with legacy columns, verify new columns populated
INSERT INTO public.offers (tenant_id, property_id, offer_price, status)
VALUES (auth.uid(), 'sync-test-uuid', 1200, 'pending')
RETURNING tenant_id, renter_id, property_id, listing_id;

-- Should show: tenant_id = renter_id AND property_id = listing_id
```

#### Test 5: Cross-User Isolation
```sql
-- As different user, attempt to view first user's offers (should be empty)
SELECT count(*) FROM public.offers 
WHERE tenant_id != auth.uid() OR renter_id != auth.uid();
```

---

## PHASE 2: PRODUCTION DEPLOYMENT

### 2.1 Pre-Production Verification
- [ ] Staging tests passed
- [ ] Application functionality verified
- [ ] Backup completed and verified
- [ ] Rollback plan ready

### 2.2 Production Apply
```sql
-- **HOLD POINT 1** - Execute with team ready
\i supabase/migrations/20250814170000_critical_fix_pack_up.sql

-- **VERIFICATION GATE 1** - Verify policies
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('users', 'offers');
-- Expected: 7 policies total (2 users + 5 offers)

-- **VERIFICATION GATE 2** - Verify trigger
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'offers';
-- Expected: sync_offers_columns_trigger

-- **VERIFICATION GATE 3** - Test basic functionality
SELECT count(*) FROM public.users; -- Should work
SELECT count(*) FROM public.offers; -- Should work
```

### 2.3 Application Health Check
- [ ] Login/logout functionality
- [ ] User profile access
- [ ] Offer creation/viewing
- [ ] Dashboard loading
- [ ] No 403/RLS errors in logs

---

## PHASE 3: GO/NO-GO DECISION

### GO Criteria (ALL must be ✅)
- [ ] All staging smoke tests passed
- [ ] Production backup completed
- [ ] All verification gates passed
- [ ] Application health check passed
- [ ] No critical errors in logs
- [ ] Team confirms functionality

### NO-GO Criteria (ANY triggers rollback)
- ❌ Any smoke test failed
- ❌ Policy creation failed
- ❌ Trigger creation failed
- ❌ Application errors detected
- ❌ Data access issues

---

## PHASE 4: ROLLBACK (If NO-GO)

### 4.1 Emergency Rollback
```sql
-- Apply DOWN migration
\i supabase/migrations/20250814170001_critical_fix_pack_down.sql

-- Verify rollback
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('users', 'offers');
-- Expected: 5 policies (0 users + 5 offers legacy)

SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'offers';
-- Expected: No sync trigger
```

### 4.2 Full Restore (If needed)
```bash
# If rollback migration fails, restore from backup
psql "postgresql://postgres:[password]@[host]:5432/postgres" \
  < "backup_pre_critical_fix_${TIMESTAMP}.sql"
```

---

## MONITORING & VALIDATION

### Post-Deploy Monitoring (First 30 minutes)
- [ ] Monitor error logs for RLS violations
- [ ] Verify user authentication working
- [ ] Check offer creation/viewing functionality
- [ ] Validate no data access bypasses

### Success Metrics
- ✅ Zero RLS policy violations
- ✅ Users can access only their own data
- ✅ Offers accessible via both column sets
- ✅ Column synchronization working
- ✅ Application functionality maintained

---

## CONTACTS & ESCALATION
- **Primary DBA:** [Name/Contact]
- **Application Team:** [Name/Contact]  
- **Incident Response:** [Process/Contact]

---

**FINAL COMMAND SEQUENCE:**
```bash
# 1. Backup
pg_dump [...] > backup_pre_critical_fix_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply
psql [...] < supabase/migrations/20250814170000_critical_fix_pack_up.sql

# 3. Verify
# [Run verification queries above]

# 4. Rollback (if needed)
psql [...] < supabase/migrations/20250814170001_critical_fix_pack_down.sql
```