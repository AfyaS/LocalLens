const sql = require('mssql');

const config = {
  server: 'civic-sql-server-1759040339.database.windows.net',
  database: 'community-clarity-db',
  user: 'civicadmin',
  password: 'CivicEngagement2024!@#',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function createImpactTable() {
  try {
    console.log('🔗 Connecting to Azure SQL Database...');
    await sql.connect(config);
    console.log('✅ Connected successfully!');

    // Create the user_impact_tracking table
    console.log('📝 Creating user_impact_tracking table...');
    await sql.query`
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
      )
    `;
    console.log('✅ user_impact_tracking table created successfully!');

    // Create indexes
    console.log('📝 Creating indexes...');
    await sql.query`CREATE INDEX IX_user_impact_tracking_user_id ON user_impact_tracking(user_id)`;
    await sql.query`CREATE INDEX IX_user_impact_tracking_date ON user_impact_tracking(date)`;
    await sql.query`CREATE INDEX IX_user_impact_tracking_category ON user_impact_tracking(category)`;
    console.log('✅ Indexes created successfully!');

    // Insert sample data
    console.log('📝 Inserting sample data...');
    await sql.query`
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
      )
    `;
    console.log('✅ Sample data inserted successfully!');

    // Verify the table was created
    console.log('🔍 Verifying table creation...');
    const tablesResult = await sql.query`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'user_impact_tracking'
    `;
    
    if (tablesResult.recordset.length > 0) {
      console.log('✅ user_impact_tracking table verified!');
    } else {
      console.log('❌ user_impact_tracking table not found');
    }

  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  } finally {
    await sql.close();
    console.log('🔐 Database connection closed');
  }
}

// Run the table creation
createImpactTable()
  .then(() => {
    console.log('🎉 Impact tracking table creation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Table creation failed:', error);
    process.exit(1);
  });
