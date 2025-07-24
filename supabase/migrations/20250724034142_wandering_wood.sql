/*
  # Initial Schema Setup for LensPro Rentals

  1. New Tables
    - `equipments` - Stores cameras and accessories
      - `id` (uuid, primary key)
      - `name` (text)
      - `image_url` (text)
      - `description` (text)
      - `rate_12hr` (numeric)
      - `rate_24hr` (numeric)
      - `available` (boolean)
      - `category` (text)
      - `created_at` (timestamp)
    
    - `user_profiles` - Extended user information
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `role` (text) - admin, staff, customer
      - `created_at` (timestamp)
    
    - `orders` - Rental orders
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_email` (text)
      - `equipment_id` (uuid, references equipments)
      - `duration` (text) - 12hr or 24hr
      - `rent_date` (date)
      - `return_date` (date)
      - `total_cost` (numeric)
      - `handled_by` (uuid, references users)
      - `status` (text) - pending, confirmed, completed, cancelled
      - `created_at` (timestamp)
    
    - `suggestions` - Customer suggestions
      - `id` (uuid, primary key)
      - `suggestion_text` (text)
      - `suggested_by` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user role
    - Create trigger for automatic user profile creation

  3. Initial Data
    - Insert sample equipment data
    - Create admin user profile
*/

-- Create equipments table
CREATE TABLE IF NOT EXISTS equipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  description text NOT NULL,
  rate_12hr numeric DEFAULT 0 NOT NULL,
  rate_24hr numeric DEFAULT 0 NOT NULL,
  available boolean DEFAULT true,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  equipment_id uuid REFERENCES equipments(id) ON DELETE CASCADE,
  duration text NOT NULL CHECK (duration IN ('12hr', '24hr')),
  rent_date date NOT NULL,
  return_date date NOT NULL,
  total_cost numeric DEFAULT 0 NOT NULL,
  handled_by uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_text text NOT NULL,
  suggested_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Equipments policies
CREATE POLICY "Anyone can view equipments"
  ON equipments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin and staff can manage equipments"
  ON equipments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'staff')
    )
  );

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admin can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles user_profiles_1
      WHERE user_profiles_1.id = auth.uid()
      AND user_profiles_1.role = 'admin'
    )
  );

CREATE POLICY "Admin can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles user_profiles_1
      WHERE user_profiles_1.id = auth.uid()
      AND user_profiles_1.role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    customer_email = (
      SELECT email FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff and admin can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff and admin can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'staff')
    )
  );

-- Suggestions policies
CREATE POLICY "Anyone can create suggestions"
  ON suggestions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff and admin can view suggestions"
  ON suggestions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admin can delete suggestions"
  ON suggestions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Insert sample equipment data
INSERT INTO equipments (name, image_url, description, rate_12hr, rate_24hr, category) VALUES
('Canon EOS R5', 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Professional full-frame mirrorless camera with 8K video capabilities', 120, 200, 'DSLR'),
('Sony A7S III', 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Exceptional low-light performance with 4K 120p video recording', 110, 180, 'Mirrorless'),
('Blackmagic Pocket 6K', 'https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Super 35 cinema camera with 6K resolution and 13 stops of dynamic range', 150, 250, 'Cinema Camera'),
('Nikon Z7 II', 'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '45.7MP full-frame mirrorless camera with excellent dynamic range', 100, 160, 'Mirrorless'),
('RED Komodo 6K', 'https://images.pexels.com/photos/1787235/pexels-photo-1787235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Compact cinema camera with global shutter and 6K recording', 300, 500, 'Cinema Camera'),
('Fujifilm GFX 100S', 'https://images.pexels.com/photos/3497065/pexels-photo-3497065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '102MP medium format sensor in a relatively compact body', 250, 400, 'Medium Format'),
('DJI Ronin-S2', 'https://images.pexels.com/photos/3602258/pexels-photo-3602258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Professional 3-axis gimbal stabilizer for DSLRs and mirrorless cameras', 45, 75, 'Stabilizer'),
('Canon RF 24-70mm f/2.8', 'https://images.pexels.com/photos/16775856/pexels-photo-16775856/free-photo-of-close-up-of-a-camera-lens.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Versatile standard zoom lens with constant f/2.8 aperture', 35, 60, 'Lens'),
('Sachtler Flowtech 75 Tripod', 'https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Professional carbon fiber tripod with innovative leg mechanism', 40, 65, 'Support'),
('RODE NTG5 Shotgun Microphone', 'https://images.pexels.com/photos/164755/pexels-photo-164755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Broadcast-grade shotgun microphone for professional sound recording', 30, 50, 'Audio'),
('Aputure 600D Pro Light', 'https://images.pexels.com/photos/2752899/pexels-photo-2752899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Powerful 600W daylight-balanced LED light with Bowens mount', 55, 90, 'Lighting'),
('SmallHD 5" FOCUS Monitor', 'https://images.pexels.com/photos/12550657/pexels-photo-12550657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Compact 5" on-camera monitor with 800 nits brightness', 25, 40, 'Monitoring')
ON CONFLICT (id) DO NOTHING;