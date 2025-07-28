/*
  # Create Admin User

  1. Admin User Setup
    - Creates an admin user profile for testing
    - Email: admin@lensprorentals.com
    - Role: admin
  
  2. Security
    - Uses proper user profile structure
    - Maintains RLS policies
*/

-- Insert admin user profile (this assumes the auth user already exists)
-- You'll need to sign up with this email first, then this will set the role to admin
INSERT INTO user_profiles (id, name, email, role)
SELECT 
  id,
  'Admin User',
  'admin@lensprorentals.com',
  'admin'
FROM auth.users 
WHERE email = 'admin@lensprorentals.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';

-- If no user exists with that email, we'll create a placeholder that will be updated when they sign up
-- This is just for reference - the actual user creation happens through Supabase Auth