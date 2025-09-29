-- Azure SQL Database Schema for LocalLens
-- Creates the essential tables for the civic engagement platform

-- 1. Users table
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) NOT NULL UNIQUE,
    email_verified BIT NOT NULL DEFAULT 0,
    full_name NVARCHAR(255),
    avatar_url NVARCHAR(500),
    phone NVARCHAR(20),
    location NVARCHAR(255),
    timezone NVARCHAR(50) DEFAULT 'America/New_York',
    language NVARCHAR(10) DEFAULT 'en',
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    last_login DATETIME2,
    is_active BIT NOT NULL DEFAULT 1
);

-- 2. User Profiles table
CREATE TABLE user_profiles (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    bio NVARCHAR(MAX),
    interests NVARCHAR(MAX), -- JSON string
    accessibility_preferences NVARCHAR(MAX), -- JSON string
    notification_preferences NVARCHAR(MAX), -- JSON string
    privacy_settings NVARCHAR(MAX), -- JSON string
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Civic Actions table
CREATE TABLE civic_actions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    title NVARCHAR(500) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(100),
    subcategory NVARCHAR(100),
    location NVARCHAR(500),
    virtual_location NVARCHAR(500),
    date_time DATETIME2,
    end_time DATETIME2,
    organizer NVARCHAR(255),
    organizer_contact NVARCHAR(MAX), -- JSON string
    contact_info NVARCHAR(MAX), -- JSON string
    requirements NVARCHAR(MAX), -- JSON string
    accessibility_notes NVARCHAR(MAX),
    virtual_link NVARCHAR(500),
    registration_required BIT DEFAULT 0,
    registration_url NVARCHAR(500),
    max_participants INT,
    current_participants INT DEFAULT 0,
    status NVARCHAR(50) DEFAULT 'active',
    priority NVARCHAR(50) DEFAULT 'normal',
    tags NVARCHAR(MAX), -- JSON string
    metadata NVARCHAR(MAX), -- JSON string
    created_by UNIQUEIDENTIFIER,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. User Engagement table
CREATE TABLE user_engagement (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    action_id UNIQUEIDENTIFIER NOT NULL,
    engagement_type NVARCHAR(50) NOT NULL, -- view, interest, rsvp, attend, share, comment, organize
    engagement_data NVARCHAR(MAX), -- JSON string
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (action_id) REFERENCES civic_actions(id) ON DELETE CASCADE,
    UNIQUE (user_id, action_id, engagement_type)
);

-- 5. Action Comments table
CREATE TABLE action_comments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    action_id UNIQUEIDENTIFIER NOT NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    parent_comment_id UNIQUEIDENTIFIER,
    content NVARCHAR(MAX) NOT NULL,
    is_public BIT NOT NULL DEFAULT 1,
    is_pinned BIT NOT NULL DEFAULT 0,
    likes_count INT DEFAULT 0,
    replies_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (action_id) REFERENCES civic_actions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES action_comments(id) ON DELETE CASCADE
);

-- 6. Notifications table
CREATE TABLE notifications (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    title NVARCHAR(255) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    type NVARCHAR(50) NOT NULL DEFAULT 'info',
    action_id UNIQUEIDENTIFIER,
    is_read BIT NOT NULL DEFAULT 0,
    is_archived BIT NOT NULL DEFAULT 0,
    priority NVARCHAR(50) DEFAULT 'normal',
    channels NVARCHAR(MAX), -- JSON string
    metadata NVARCHAR(MAX), -- JSON string
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    read_at DATETIME2,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (action_id) REFERENCES civic_actions(id) ON DELETE SET NULL
);

-- 7. API Integrations table
CREATE TABLE api_integrations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    api_name NVARCHAR(100) NOT NULL,
    endpoint NVARCHAR(500) NOT NULL,
    data NVARCHAR(MAX), -- JSON string
    last_updated DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    expires_at DATETIME2,
    status NVARCHAR(50) NOT NULL DEFAULT 'active',
    error_message NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE()
);

-- 8. Event Attendance table
CREATE TABLE event_attendance (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    action_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'registered',
    registration_data NVARCHAR(MAX), -- JSON string
    attended_at DATETIME2,
    feedback NVARCHAR(MAX),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (action_id) REFERENCES civic_actions(id) ON DELETE CASCADE,
    UNIQUE (user_id, action_id)
);

-- Create indexes for performance
CREATE INDEX IX_users_email ON users(email);
CREATE INDEX IX_users_created_at ON users(created_at);
CREATE INDEX IX_civic_actions_date_time ON civic_actions(date_time);
CREATE INDEX IX_civic_actions_category ON civic_actions(category);
CREATE INDEX IX_civic_actions_status ON civic_actions(status);
CREATE INDEX IX_user_engagement_user_id ON user_engagement(user_id);
CREATE INDEX IX_user_engagement_action_id ON user_engagement(action_id);
CREATE INDEX IX_user_engagement_type ON user_engagement(engagement_type);
CREATE INDEX IX_action_comments_action_id ON action_comments(action_id);
CREATE INDEX IX_action_comments_user_id ON action_comments(user_id);
CREATE INDEX IX_notifications_user_id ON notifications(user_id);
CREATE INDEX IX_notifications_read ON notifications(is_read);
CREATE INDEX IX_event_attendance_user_id ON event_attendance(user_id);
CREATE INDEX IX_event_attendance_action_id ON event_attendance(action_id);

-- Insert sample data
INSERT INTO users (email, full_name, location) VALUES 
('admin@communityclarity.ai', 'Community Clarity Admin', 'Boston, MA'),
('test@example.com', 'Test User', 'Cambridge, MA');

INSERT INTO civic_actions (title, description, category, location, date_time, organizer) VALUES 
('City Council Meeting', 'Monthly city council meeting to discuss local issues', 'Government', 'City Hall, Boston', DATEADD(day, 7, GETUTCDATE()), 'Boston City Council'),
('Community Cleanup', 'Volunteer cleanup event in the local park', 'Community', 'Central Park, Boston', DATEADD(day, 14, GETUTCDATE()), 'Boston Parks Department'),
('Public Hearing on Housing', 'Public hearing to discuss new housing development', 'Government', 'City Hall, Boston', DATEADD(day, 21, GETUTCDATE()), 'Boston Planning Department');

-- Insert sample API integration
INSERT INTO api_integrations (api_name, endpoint, data, status) VALUES 
('ma_legislature_hearings', 'https://malegislature.gov/api/', '{"hearings": 0, "last_sync": "2024-01-01T00:00:00Z", "source": "azure_function"}', 'active');
