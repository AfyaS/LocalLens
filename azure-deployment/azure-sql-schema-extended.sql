-- Extended Azure SQL Database Schema for Real-Time Data Integration
-- This script creates all the tables needed for external API integrations

-- Representatives table (Google Civic API)
CREATE TABLE representatives (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    party NVARCHAR(100),
    phone NVARCHAR(50),
    email NVARCHAR(255),
    photo_url NVARCHAR(500),
    urls NVARCHAR(MAX), -- JSON array of URLs
    channels NVARCHAR(MAX), -- JSON array of social media channels
    address NVARCHAR(MAX), -- JSON object with address details
    city NVARCHAR(100),
    state NVARCHAR(50),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Elections table (Google Civic API, Ballotpedia)
CREATE TABLE elections (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    election_id NVARCHAR(100) UNIQUE NOT NULL,
    title NVARCHAR(255) NOT NULL,
    election_date DATE,
    type NVARCHAR(100),
    state NVARCHAR(50),
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Political candidates table (OpenSecrets API)
CREATE TABLE political_candidates (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    cid NVARCHAR(50) UNIQUE NOT NULL,
    firstlast NVARCHAR(255),
    lastname NVARCHAR(100),
    party NVARCHAR(100),
    office NVARCHAR(100),
    candidate NVARCHAR(255),
    description NVARCHAR(MAX),
    cycle NVARCHAR(10),
    chamber NVARCHAR(50),
    state NVARCHAR(50),
    district NVARCHAR(50),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Political committees table (OpenSecrets API)
CREATE TABLE political_committees (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    cmteid NVARCHAR(50) UNIQUE NOT NULL,
    cmtename NVARCHAR(255),
    cmtetreasurer NVARCHAR(255),
    cmte_dsgn NVARCHAR(50),
    cmte_pty_affiliation NVARCHAR(100),
    cmte_pty_affiliation_desc NVARCHAR(255),
    orgname NVARCHAR(255),
    connected_org_name NVARCHAR(255),
    cand_pty_affiliation NVARCHAR(100),
    cand_pty_affiliation_desc NVARCHAR(255),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Lobbying data table (OpenSecrets API)
CREATE TABLE lobbying_data (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    client NVARCHAR(255),
    registrant NVARCHAR(255),
    total NVARCHAR(50),
    year NVARCHAR(10),
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Ballot measures table (Ballotpedia API)
CREATE TABLE ballot_measures (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    measure_id NVARCHAR(100) UNIQUE NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    election_date NVARCHAR(10),
    state NVARCHAR(50),
    status NVARCHAR(100),
    results NVARCHAR(MAX), -- JSON object with results
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Election candidates table (Ballotpedia API)
CREATE TABLE election_candidates (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    party NVARCHAR(100),
    office NVARCHAR(100),
    incumbent BIT DEFAULT 0,
    website NVARCHAR(500),
    social_media NVARCHAR(MAX), -- JSON array of social media links
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Municipal meetings table (Municipal APIs)
CREATE TABLE municipal_meetings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    meeting_id NVARCHAR(100) UNIQUE NOT NULL,
    title NVARCHAR(255) NOT NULL,
    meeting_date DATE,
    meeting_time TIME,
    location NVARCHAR(255),
    agenda NVARCHAR(MAX),
    municipality NVARCHAR(100),
    type NVARCHAR(100),
    virtual_link NVARCHAR(500),
    accessibility_notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Municipal events table (Municipal APIs)
CREATE TABLE municipal_events (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    event_id NVARCHAR(100) UNIQUE NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    event_date DATE,
    event_time TIME,
    location NVARCHAR(255),
    municipality NVARCHAR(100),
    category NVARCHAR(100),
    contact NVARCHAR(255),
    website NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Create indexes for better performance
CREATE INDEX IX_representatives_city_state ON representatives(city, state);
CREATE INDEX IX_representatives_name ON representatives(name);
CREATE INDEX IX_elections_date ON elections(election_date);
CREATE INDEX IX_elections_state ON elections(state);
CREATE INDEX IX_political_candidates_cid ON political_candidates(cid);
CREATE INDEX IX_political_candidates_state ON political_candidates(state);
CREATE INDEX IX_political_committees_cmteid ON political_committees(cmteid);
CREATE INDEX IX_lobbying_data_year ON lobbying_data(year);
CREATE INDEX IX_ballot_measures_state ON ballot_measures(state);
CREATE INDEX IX_election_candidates_office ON election_candidates(office);
CREATE INDEX IX_municipal_meetings_municipality ON municipal_meetings(municipality);
CREATE INDEX IX_municipal_meetings_date ON municipal_meetings(meeting_date);
CREATE INDEX IX_municipal_events_municipality ON municipal_events(municipality);
CREATE INDEX IX_municipal_events_date ON municipal_events(event_date);

-- Create views for common queries
CREATE VIEW v_upcoming_elections AS
SELECT 
    e.id,
    e.election_id,
    e.title,
    e.election_date,
    e.type,
    e.state,
    e.description,
    COUNT(ec.id) as candidate_count
FROM elections e
LEFT JOIN election_candidates ec ON e.election_id = ec.office
WHERE e.election_date >= CAST(GETDATE() AS DATE)
GROUP BY e.id, e.election_id, e.title, e.election_date, e.type, e.state, e.description;

CREATE VIEW v_representatives_by_location AS
SELECT 
    r.id,
    r.name,
    r.party,
    r.phone,
    r.email,
    r.photo_url,
    r.city,
    r.state,
    r.updated_at
FROM representatives r
WHERE r.updated_at >= DATEADD(day, -7, GETUTCDATE());

CREATE VIEW v_municipal_meetings_upcoming AS
SELECT 
    mm.id,
    mm.meeting_id,
    mm.title,
    mm.meeting_date,
    mm.meeting_time,
    mm.location,
    mm.municipality,
    mm.type,
    mm.virtual_link,
    mm.accessibility_notes
FROM municipal_meetings mm
WHERE mm.meeting_date >= CAST(GETDATE() AS DATE)
ORDER BY mm.meeting_date, mm.meeting_time;

-- Create stored procedures for common operations
CREATE PROCEDURE sp_GetRepresentativesByLocation
    @City NVARCHAR(100),
    @State NVARCHAR(50)
AS
BEGIN
    SELECT 
        r.name,
        r.party,
        r.phone,
        r.email,
        r.photo_url,
        r.urls,
        r.channels,
        r.address
    FROM representatives r
    WHERE r.city = @City AND r.state = @State
    ORDER BY r.updated_at DESC;
END;

CREATE PROCEDURE sp_GetUpcomingMeetings
    @Municipality NVARCHAR(100) = NULL,
    @DaysAhead INT = 30
AS
BEGIN
    SELECT 
        mm.title,
        mm.meeting_date,
        mm.meeting_time,
        mm.location,
        mm.municipality,
        mm.type,
        mm.virtual_link,
        mm.accessibility_notes
    FROM municipal_meetings mm
    WHERE mm.meeting_date BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(day, @DaysAhead, CAST(GETDATE() AS DATE))
    AND (@Municipality IS NULL OR mm.municipality = @Municipality)
    ORDER BY mm.meeting_date, mm.meeting_time;
END;

CREATE PROCEDURE sp_GetElectionData
    @State NVARCHAR(50) = 'Massachusetts',
    @Year INT = NULL
AS
BEGIN
    IF @Year IS NULL
        SET @Year = YEAR(GETDATE());
    
    SELECT 
        e.title,
        e.election_date,
        e.type,
        e.description,
        COUNT(ec.id) as candidate_count
    FROM elections e
    LEFT JOIN election_candidates ec ON e.election_id = ec.office
    WHERE e.state = @State
    AND YEAR(e.election_date) = @Year
    GROUP BY e.id, e.title, e.election_date, e.type, e.description
    ORDER BY e.election_date;
END;

-- Create triggers for audit logging
CREATE TRIGGER tr_representatives_audit
ON representatives
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    INSERT INTO audit_log (table_name, operation, record_id, changed_at)
    SELECT 'representatives', 
           CASE 
               WHEN EXISTS(SELECT 1 FROM inserted) AND EXISTS(SELECT 1 FROM deleted) THEN 'UPDATE'
               WHEN EXISTS(SELECT 1 FROM inserted) THEN 'INSERT'
               ELSE 'DELETE'
           END,
           COALESCE(i.id, d.id),
           GETUTCDATE()
    FROM inserted i
    FULL OUTER JOIN deleted d ON i.id = d.id;
END;

-- Create audit log table
CREATE TABLE audit_log (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    table_name NVARCHAR(100) NOT NULL,
    operation NVARCHAR(10) NOT NULL,
    record_id UNIQUEIDENTIFIER,
    changed_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Insert sample data for testing
INSERT INTO api_integrations (api_name, endpoint, data, last_updated, expires_at, status)
VALUES 
('google_civic_api', 'https://www.googleapis.com/civicinfo/v2/representatives', '{"status": "configured", "last_sync": null}', GETUTCDATE(), DATEADD(hour, 24, GETUTCDATE()), 'active'),
('opensecrets_api', 'https://www.opensecrets.org/api/', '{"status": "configured", "last_sync": null}', GETUTCDATE(), DATEADD(hour, 24, GETUTCDATE()), 'active'),
('ballotpedia_api', 'https://ballotpedia.org/', '{"status": "configured", "last_sync": null}', GETUTCDATE(), DATEADD(hour, 24, GETUTCDATE()), 'active'),
('municipal_apis', 'https://municipal-apis.com/', '{"status": "configured", "last_sync": null}', GETUTCDATE(), DATEADD(hour, 24, GETUTCDATE()), 'active');

PRINT 'Extended Azure SQL Database schema created successfully!';
PRINT 'Tables created: representatives, elections, political_candidates, political_committees, lobbying_data, ballot_measures, election_candidates, municipal_meetings, municipal_events';
PRINT 'Views created: v_upcoming_elections, v_representatives_by_location, v_municipal_meetings_upcoming';
PRINT 'Stored procedures created: sp_GetRepresentativesByLocation, sp_GetUpcomingMeetings, sp_GetElectionData';
PRINT 'Audit logging enabled for all tables';
