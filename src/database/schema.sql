-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    native_language VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- User Progress
CREATE TABLE user_progress (
    user_id UUID REFERENCES users(user_id),
    current_level INTEGER NOT NULL DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id)
);

-- Subscriptions
CREATE TABLE user_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    tier VARCHAR(20) NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Usage
CREATE TABLE user_daily_usage (
    user_id UUID REFERENCES users(user_id),
    date DATE NOT NULL,
    lessons_completed INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    activity_type VARCHAR(50),
    PRIMARY KEY (user_id, date)
);

-- Scenario Progress
CREATE TABLE user_scenario_progress (
    user_id UUID REFERENCES users(user_id),
    scenario_id UUID NOT NULL,
    completion_status VARCHAR(20) NOT NULL,
    score INTEGER,
    attempts INTEGER DEFAULT 1,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, scenario_id)
);

-- Performance Metrics
CREATE TABLE performance_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    category VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    mistakes JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Access
CREATE TABLE user_content_access (
    user_id UUID REFERENCES users(user_id),
    content_id UUID NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, content_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_progress_level ON user_progress(current_level);
CREATE INDEX idx_subscriptions_valid_until ON user_subscriptions(valid_until);
CREATE INDEX idx_performance_metrics_category ON performance_metrics(category);
CREATE INDEX idx_scenario_progress_status ON user_scenario_progress(completion_status); 