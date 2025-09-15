import { supabase } from '@/lib/supabase'

// Test account credentials for easy access
export const TEST_ACCOUNTS = {
  landlord: {
    email: 'landlord@test.com',
    password: 'password123',
    fullName: 'Test Landlord',
    userType: 'landlord' as const
  },
  tenant: {
    email: 'tenant@test.com', 
    password: 'password123',
    fullName: 'Test Tenant',
    userType: 'tenant' as const
  }
}

// Function to create test accounts (call this from browser console)
export const createTestAccounts = async () => {
  console.log('Creating test accounts...')
  
  try {
    // Create landlord account
    const { data: landlordAuth, error: landlordAuthError } = await supabase.auth.signUp({
      email: TEST_ACCOUNTS.landlord.email,
      password: TEST_ACCOUNTS.landlord.password,
      options: {
        data: {
          full_name: TEST_ACCOUNTS.landlord.fullName
        }
      }
    })

    if (landlordAuthError) {
      console.error('Landlord auth error:', landlordAuthError)
    } else if (landlordAuth.user) {
      console.log('✅ Landlord account created:', TEST_ACCOUNTS.landlord.email)
      
      // Create profile for landlord
      const { error: landlordProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: landlordAuth.user.id,
          email: TEST_ACCOUNTS.landlord.email,
          full_name: TEST_ACCOUNTS.landlord.fullName,
          user_type: TEST_ACCOUNTS.landlord.userType,
          profile_complete: true,
          phone: '+44 7700 900123'
        })
      
      if (landlordProfileError) {
        console.error('Landlord profile error:', landlordProfileError)
      } else {
        console.log('✅ Landlord profile created')
      }
    }

    // Create tenant account
    const { data: tenantAuth, error: tenantAuthError } = await supabase.auth.signUp({
      email: TEST_ACCOUNTS.tenant.email,
      password: TEST_ACCOUNTS.tenant.password,
      options: {
        data: {
          full_name: TEST_ACCOUNTS.tenant.fullName
        }
      }
    })

    if (tenantAuthError) {
      console.error('Tenant auth error:', tenantAuthError)
    } else if (tenantAuth.user) {
      console.log('✅ Tenant account created:', TEST_ACCOUNTS.tenant.email)
      
      // Create profile for tenant
      const { error: tenantProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: tenantAuth.user.id,
          email: TEST_ACCOUNTS.tenant.email,
          full_name: TEST_ACCOUNTS.tenant.fullName,
          user_type: TEST_ACCOUNTS.tenant.userType,
          profile_complete: true,
          phone: '+44 7700 900456'
        })
      
      if (tenantProfileError) {
        console.error('Tenant profile error:', tenantProfileError)
      } else {
        console.log('✅ Tenant profile created')
      }
    }

    console.log('\n🎉 Test accounts setup complete!')
    console.log('\nLogin credentials:')
    console.log('Landlord:', TEST_ACCOUNTS.landlord.email, '/', TEST_ACCOUNTS.landlord.password)
    console.log('Tenant:', TEST_ACCOUNTS.tenant.email, '/', TEST_ACCOUNTS.tenant.password)

  } catch (error) {
    console.error('Error creating test accounts:', error)
  }
}

// Export function to global scope for easy access in console
if (typeof window !== 'undefined') {
  (window as any).createTestAccounts = createTestAccounts;
  (window as any).TEST_ACCOUNTS = TEST_ACCOUNTS;
}