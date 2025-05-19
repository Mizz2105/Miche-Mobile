-- Create auth schema if it doesn't exist (supabase schema)
CREATE SCHEMA IF NOT EXISTS auth;

-- Create tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('client', 'professional'))
);

CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  service_area TEXT NOT NULL,
  service_radius INTEGER NOT NULL DEFAULT 10,
  travel_fee DECIMAL(10, 2),
  years_experience TEXT NOT NULL,
  bio TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(profile_id)
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  client_id UUID NOT NULL REFERENCES profiles(id),
  professional_id UUID NOT NULL REFERENCES professionals(id),
  service_id UUID NOT NULL REFERENCES services(id),
  booking_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  location TEXT NOT NULL,
  notes TEXT,
  total_amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE professional_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  certification_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  notes TEXT
);

-- Create stored procedure for creating a professional with profile in one transaction
CREATE OR REPLACE FUNCTION create_professional(
  profile_data JSONB,
  professional_data JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_profile_id UUID;
  new_professional_id UUID;
  result JSONB;
BEGIN
  -- Insert profile first
  INSERT INTO profiles (
    first_name,
    last_name,
    email,
    phone,
    username,
    type
  )
  VALUES (
    profile_data->>'first_name',
    profile_data->>'last_name',
    profile_data->>'email',
    profile_data->>'phone',
    profile_data->>'username',
    profile_data->>'type'
  )
  RETURNING id INTO new_profile_id;
  
  -- Insert professional with the profile ID
  INSERT INTO professionals (
    profile_id,
    service_area,
    service_radius,
    travel_fee,
    years_experience,
    bio,
    verified
  )
  VALUES (
    new_profile_id,
    professional_data->>'service_area',
    (professional_data->>'service_radius')::INTEGER,
    (professional_data->>'travel_fee')::DECIMAL,
    professional_data->>'years_experience',
    professional_data->>'bio',
    false
  )
  RETURNING id INTO new_professional_id;
  
  -- Create the result object
  SELECT jsonb_build_object(
    'profile_id', new_profile_id,
    'professional_id', new_professional_id
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Row Level Security (RLS) setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for profiles" ON profiles
  FOR SELECT USING (true);
  
CREATE POLICY "Public read access for professionals" ON professionals
  FOR SELECT USING (true);
  
CREATE POLICY "Public read access for services" ON services
  FOR SELECT USING (true);

-- Booking policies
CREATE POLICY "Clients can see their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = client_id);
  
CREATE POLICY "Professionals can see bookings assigned to them" ON bookings
  FOR SELECT USING (auth.uid() IN (
    SELECT p.profile_id FROM professionals p WHERE p.id = professional_id
  ));

-- Create indexes for performance
CREATE INDEX idx_profiles_type ON profiles(type);
CREATE INDEX idx_professionals_service_area ON professionals(service_area);
CREATE INDEX idx_services_professional_id ON services(professional_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_professional_id ON bookings(professional_id);
CREATE INDEX idx_bookings_status ON bookings(status); 