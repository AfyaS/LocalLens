-- User Impact Tracking Table
-- This table stores user-tracked civic activities and their impact

CREATE TABLE user_impact_tracking (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    title NVARCHAR(500) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    impact_type NVARCHAR(100) DEFAULT 'Direct Service',
    people_reached INT DEFAULT 0,
    hours_spent INT DEFAULT 0,
    location NVARCHAR(500),
    notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Reputation Table (if not exists)
CREATE TABLE IF NOT EXISTS user_reputation (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    reputation_score INT NOT NULL DEFAULT 0,
    impact_points INT NOT NULL DEFAULT 0,
    badges NVARCHAR(MAX), -- JSON string
    achievements NVARCHAR(MAX), -- JSON string
    level NVARCHAR(50) DEFAULT 'beginner',
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id)
);

-- Create indexes for performance
CREATE INDEX IX_user_impact_tracking_user_id ON user_impact_tracking(user_id);
CREATE INDEX IX_user_impact_tracking_date ON user_impact_tracking(date);
CREATE INDEX IX_user_impact_tracking_category ON user_impact_tracking(category);
CREATE INDEX IX_user_reputation_user_id ON user_reputation(user_id);

-- Insert sample data for testing
INSERT INTO user_impact_tracking (
    user_id, title, description, category, date, impact_type, 
    people_reached, hours_spent, location, notes
) VALUES 
(
    (SELECT TOP 1 id FROM users WHERE email = 'test@example.com'),
    'Volunteered at Food Bank',
    'Helped distribute food to families in need during the holiday season',
    'Community Service',
    '2024-01-15',
    'Direct Service',
    50,
    4,
    'Boston Food Bank',
    'Great experience helping the community'
),
(
    (SELECT TOP 1 id FROM users WHERE email = 'test@example.com'),
    'Organized Neighborhood Cleanup',
    'Led a community cleanup event in the local park',
    'Environmental',
    '2024-01-20',
    'Organizing',
    25,
    6,
    'Riverside Park',
    'Successfully organized 25 volunteers for park cleanup'
);

-- Update user reputation for existing users
INSERT INTO user_reputation (user_id, reputation_score, impact_points, level)
SELECT 
    u.id,
    COALESCE(uit.total_activities * 10, 0) as reputation_score,
    COALESCE(uit.total_people_reached, 0) as impact_points,
    CASE 
        WHEN COALESCE(uit.total_activities, 0) >= 20 THEN 'expert'
        WHEN COALESCE(uit.total_activities, 0) >= 10 THEN 'advanced'
        WHEN COALESCE(uit.total_activities, 0) >= 5 THEN 'intermediate'
        ELSE 'beginner'
    END as level
FROM users u
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_activities,
        SUM(people_reached) as total_people_reached
    FROM user_impact_tracking
    GROUP BY user_id
) uit ON u.id = uit.user_id
ON CONFLICT (user_id) DO NOTHING;
