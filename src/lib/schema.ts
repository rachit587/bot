// ==========================================================
// BOUNCERS ON TIPS — Production Database Schema Blueprint
// Relational SQL (PostgreSQL / Supabase / Firebase Compatible)
// ==========================================================

export const SQL_SCHEMA_BLUEPRINT = `
-- 1. USERS & ROLES
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) DEFAULT 'customer' CHECK (role IN ('customer', 'bouncer', 'admin')),
    profile_photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EMERGENCY & SAVED CONTACTS
CREATE TABLE trusted_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(64),
    phone VARCHAR(32) NOT NULL,
    is_sos_recipient BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SAVED CUSTOMER LOCATIONS
CREATE TABLE saved_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(64) NOT NULL, -- e.g. Home, Office, Club
    formatted_address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROFESSIONAL / BOUNCER PROFILES
CREATE TABLE professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bouncer_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. BT-104
    tier_level VARCHAR(32) DEFAULT 'STANDARD' CHECK (tier_level IN ('STANDARD', 'PRO', 'ELITE')),
    gender VARCHAR(16) NOT NULL CHECK (gender IN ('Male', 'Female')),
    experience_years INT DEFAULT 1,
    hourly_rate INT NOT NULL,
    physical_presence VARCHAR(32) DEFAULT 'STANDARD' CHECK (physical_presence IN ('STANDARD', 'LARGE', 'HIGH')),
    verification_status VARCHAR(32) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
    police_clearance_id VARCHAR(128),
    security_license_id VARCHAR(128),
    avg_rating NUMERIC(3, 2) DEFAULT 5.00,
    total_completed_bookings INT DEFAULT 0,
    acceptance_rate NUMERIC(5, 2) DEFAULT 100.00,
    is_online BOOLEAN DEFAULT FALSE,
    availability_status VARCHAR(32) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    last_ping_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SERVICES & CATEGORIES
CREATE TABLE services (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'womens_safety'
    title VARCHAR(128) NOT NULL,
    description TEXT,
    icon_name VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. PRICING RULES & MULTIPLIERS
CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_level VARCHAR(32) NOT NULL,
    base_hourly_rate INT NOT NULL,
    presence_multiplier NUMERIC(4, 2) DEFAULT 1.0,
    platform_fee_percent NUMERIC(4, 2) DEFAULT 8.00,
    surge_multiplier NUMERIC(4, 2) DEFAULT 1.00,
    active_from TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. BOOKINGS MASTER TABLE
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id),
    service_purpose VARCHAR(64) REFERENCES services(id),
    required_bouncers_count INT NOT NULL DEFAULT 1,
    tier_level VARCHAR(32) NOT NULL,
    gender_preference VARCHAR(32) DEFAULT 'ANY' CHECK (gender_preference IN ('ANY', 'MALE', 'FEMALE', 'MIXED')),
    physical_presence_pref VARCHAR(32) DEFAULT 'STANDARD',
    service_address TEXT NOT NULL,
    service_latitude DOUBLE PRECISION NOT NULL,
    service_longitude DOUBLE PRECISION NOT NULL,
    service_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_hours INT NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(32) DEFAULT 'DRAFT' CHECK (status IN (
        'DRAFT', 'REQUESTED', 'SEARCHING', 'PARTIALLY_CONFIRMED', 
        'CONFIRMED', 'ON_THE_WAY', 'ARRIVED', 'ACTIVE', 'COMPLETED', 'CANCELLED'
    )),
    base_amount INT NOT NULL,
    platform_fee INT NOT NULL,
    total_amount INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT
);

-- 8. REAL-TIME BOOKING DISPATCH RESPONSES
CREATE TABLE booking_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professional_profiles(id),
    status VARCHAR(32) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED')),
    distance_km NUMERIC(5, 2),
    estimated_earnings INT NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    response_time_ms INT
);

-- 9. CONFIRMED BOOKING TEAM MEMBERS
CREATE TABLE booking_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professional_profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_in_at TIMESTAMP WITH TIME ZONE,
    check_out_at TIMESTAMP WITH TIME ZONE
);

-- 10. REVIEWS & QUALITY AUDIT RATINGS
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    reviewer_user_id UUID REFERENCES users(id),
    target_user_id UUID REFERENCES users(id),
    is_customer_review BOOLEAN DEFAULT TRUE,
    overall INT CHECK (overall BETWEEN 1 AND 5),
    professionalism INT CHECK (professionalism BETWEEN 1 AND 5),
    punctuality INT CHECK (punctuality BETWEEN 1 AND 5),
    behaviour INT CHECK (behaviour BETWEEN 1 AND 5),
    communication INT CHECK (communication BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. PAYMENTS & SETTLEMENTS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    payer_id UUID REFERENCES users(id),
    amount INT NOT NULL,
    gateway VARCHAR(64) DEFAULT 'RAZORPAY',
    transaction_reference VARCHAR(128),
    payment_status VARCHAR(32) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. DISPATCH INCIDENTS & SOS LOGS
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    triggered_by UUID REFERENCES users(id),
    incident_type VARCHAR(64) NOT NULL, -- SOS_PANIC, MISCONDUCT, LATE_ARRIVAL, MEDICAL
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    description TEXT,
    resolved_status VARCHAR(32) DEFAULT 'OPEN' CHECK (resolved_status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_ALARM')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;
