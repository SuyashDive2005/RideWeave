-- =====================================================
-- Dynamic Cab-Sharing System (PostgreSQL)
-- Final Version
-- Includes:
-- Ride Sharing + Wallet + Payments + Transactions
-- No Commission Handling
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE ride_request_status AS ENUM (
    'CREATED',
    'WAITING',
    'MATCHED',
    'EXPIRED',
    'CANCELLED'
);

CREATE TYPE shared_ride_status AS ENUM (
    'ASSIGNED',
    'ONGOING',
    'COMPLETED',
    'FAILED'
);

CREATE TYPE participant_role AS ENUM (
    'PASSENGER',
    'PROVIDER'
);

CREATE TYPE wallet_transaction_type AS ENUM (
    'CREDIT',
    'DEBIT'
);

CREATE TYPE wallet_transaction_reason AS ENUM (
    'RIDE_PAYMENT',
    'RIDE_EARNING',
    'WALLET_TOPUP',
    'REFUND',
    'CANCELLATION_PENALTY'
);

CREATE TYPE payment_status AS ENUM (
    'INITIATED',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);

CREATE TYPE payment_method AS ENUM (
    'WALLET',
    'UPI',
    'CARD',
    'NET_BANKING'
);

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    service_active BOOLEAN DEFAULT FALSE,
    last_lat NUMERIC(10,8),
    last_lng NUMERIC(11,8),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_service_active
ON users(service_active);

-- =====================================================
-- VEHICLES
-- =====================================================

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    capacity INT NOT NULL DEFAULT 2,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- WALLETS (One per User)
-- =====================================================

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SHARED RIDES
-- =====================================================

CREATE TABLE shared_rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status shared_ride_status NOT NULL DEFAULT 'ASSIGNED',
    total_distance NUMERIC(10,2),
    total_fare NUMERIC(14,2),
    route_polyline TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Provider can only have ONE active ride
CREATE UNIQUE INDEX idx_provider_active_ride
ON shared_rides(provider_id)
WHERE status IN ('ASSIGNED', 'ONGOING');

-- =====================================================
-- RIDE REQUESTS
-- =====================================================

CREATE TABLE ride_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pickup_lat NUMERIC(10,8) NOT NULL,
    pickup_lng NUMERIC(11,8) NOT NULL,
    destination_lat NUMERIC(10,8) NOT NULL,
    destination_lng NUMERIC(11,8) NOT NULL,
    search_radius NUMERIC(5,2) DEFAULT 5.0,
    status ride_request_status NOT NULL DEFAULT 'CREATED',
    pre_consent BOOLEAN DEFAULT TRUE,
    shared_ride_id UUID REFERENCES shared_rides(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_matching_query
ON ride_requests(status, created_at);

-- =====================================================
-- RIDE PARTICIPANTS
-- =====================================================

CREATE TABLE ride_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shared_ride_id UUID NOT NULL REFERENCES shared_rides(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role participant_role NOT NULL,
    individual_distance NUMERIC(10,2),
    fare_share NUMERIC(14,2),
    earning NUMERIC(14,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(shared_ride_id, user_id)
);

CREATE INDEX idx_participants_user
ON ride_participants(user_id);

-- =====================================================
-- WALLET TRANSACTIONS (Ledger)
-- =====================================================

CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shared_ride_id UUID REFERENCES shared_rides(id) ON DELETE SET NULL,
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    transaction_type wallet_transaction_type NOT NULL,
    reason wallet_transaction_reason NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_transactions_user
ON wallet_transactions(user_id);

-- =====================================================
-- PAYMENTS
-- =====================================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shared_ride_id UUID NOT NULL REFERENCES shared_rides(id) ON DELETE CASCADE,
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    payment_method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'INITIATED',
    transaction_reference VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user
ON payments(user_id);

CREATE INDEX idx_payments_ride
ON payments(shared_ride_id);

-- =====================================================
-- END OF FINAL POSTGRESQL SCHEMA
-- =====================================================
