// Data Migration Script: Supabase to Azure
// Migrates all data from Supabase to Azure Database

import { Client } from 'pg';
import axios from 'axios';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

interface AzureConfig {
  connectionString: string;
}

interface MigrationStats {
  users: number;
  profiles: number;
  civicActions: number;
  userEngagement: number;
  comments: number;
  notifications: number;
  errors: string[];
}

class SupabaseToAzureMigration {
  private supabaseConfig: SupabaseConfig;
  private azureConfig: AzureConfig;
  private stats: MigrationStats;

  constructor(supabaseConfig: SupabaseConfig, azureConfig: AzureConfig) {
    this.supabaseConfig = supabaseConfig;
    this.azureConfig = azureConfig;
    this.stats = {
      users: 0,
      profiles: 0,
      civicActions: 0,
      userEngagement: 0,
      comments: 0,
      notifications: 0,
      errors: []
    };
  }

  async migrateAll(): Promise<MigrationStats> {
    console.log('🚀 Starting Supabase to Azure migration...');
    
    try {
      // 1. Migrate users
      await this.migrateUsers();
      
      // 2. Migrate user profiles
      await this.migrateUserProfiles();
      
      // 3. Migrate civic actions
      await this.migrateCivicActions();
      
      // 4. Migrate user engagement
      await this.migrateUserEngagement();
      
      // 5. Migrate comments
      await this.migrateComments();
      
      // 6. Migrate notifications
      await this.migrateNotifications();
      
      // 7. Migrate API integrations
      await this.migrateApiIntegrations();
      
      console.log('✅ Migration completed successfully!');
      console.log('📊 Migration Statistics:', this.stats);
      
      return this.stats;
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      this.stats.errors.push(error.message);
      throw error;
    }
  }

  private async migrateUsers(): Promise<void> {
    console.log('👥 Migrating users...');
    
    try {
      // Get users from Supabase
      const supabaseUsers = await this.fetchFromSupabase('auth.users', {
        select: 'id,email,created_at,updated_at,email_confirmed_at,phone,phone_confirmed_at'
      });
      
      const azureClient = new Client({
        connectionString: this.azureConfig.connectionString
      });
      
      await azureClient.connect();
      
      for (const user of supabaseUsers) {
        try {
          // Get user metadata from profiles table
          const profile = await this.fetchFromSupabase('profiles', {
            select: '*',
            eq: { id: user.id }
          });
          
          const profileData = profile[0] || {};
          
          // Insert into Azure users table
          await azureClient.query(`
            INSERT INTO users (
              id, email, full_name, avatar_url, location, phone,
              email_verified, created_at, updated_at, last_login
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO UPDATE SET
              email = EXCLUDED.email,
              full_name = EXCLUDED.full_name,
              avatar_url = EXCLUDED.avatar_url,
              location = EXCLUDED.location,
              phone = EXCLUDED.phone,
              email_verified = EXCLUDED.email_verified,
              updated_at = EXCLUDED.updated_at
          `, [
            user.id,
            user.email,
            profileData.full_name,
            profileData.avatar_url,
            profileData.location,
            user.phone,
            !!user.email_confirmed_at,
            user.created_at,
            user.updated_at || user.created_at,
            user.last_sign_in_at
          ]);
          
          this.stats.users++;
          
        } catch (error) {
          console.error(`Error migrating user ${user.id}:`, error);
          this.stats.errors.push(`User ${user.id}: ${error.message}`);
        }
      }
      
      await azureClient.end();
      console.log(`✅ Migrated ${this.stats.users} users`);
      
    } catch (error) {
      console.error('Error migrating users:', error);
      throw error;
    }
  }

  private async migrateUserProfiles(): Promise<void> {
    console.log('👤 Migrating user profiles...');
    
    try {
      const supabaseProfiles = await this.fetchFromSupabase('profiles', {
        select: '*'
      });
      
      const azureClient = new Client({
        connectionString: this.azureConfig.connectionString
      });
      
      await azureClient.connect();
      
      for (const profile of supabaseProfiles) {
        try {
          await azureClient.query(`
            INSERT INTO user_profiles (
              user_id, bio, interests, accessibility_preferences,
              notification_preferences, privacy_settings, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (user_id) DO UPDATE SET
              bio = EXCLUDED.bio,
              interests = EXCLUDED.interests,
              accessibility_preferences = EXCLUDED.accessibility_preferences,
              notification_preferences = EXCLUDED.notification_preferences,
              privacy_settings = EXCLUDED.privacy_settings,
              updated_at = EXCLUDED.updated_at
          `, [
            profile.id,
            profile.bio || null,
            profile.interests || [],
            profile.accessibility_preferences || {},
            profile.notification_preferences || {},
            profile.privacy_settings || {},
            profile.created_at,
            profile.updated_at
          ]);
          
          this.stats.profiles++;
          
        } catch (error) {
          console.error(`Error migrating profile ${profile.id}:`, error);
          this.stats.errors.push(`Profile ${profile.id}: ${error.message}`);
        }
      }
      
      await azureClient.end();
      console.log(`✅ Migrated ${this.stats.profiles} profiles`);
      
    } catch (error) {
      console.error('Error migrating profiles:', error);
      throw error;
    }
  }

  private async migrateCivicActions(): Promise<void> {
    console.log('🏛️ Migrating civic actions...');
    
    try {
      const supabaseActions = await this.fetchFromSupabase('civic_actions', {
        select: '*'
      });
      
      const azureClient = new Client({
        connectionString: this.azureConfig.connectionString
      });
      
      await azureClient.connect();
      
      for (const action of supabaseActions) {
        try {
          await azureClient.query(`
            INSERT INTO civic_actions (
              id, title, description, category, location, date_time,
              organizer, contact_info, requirements, accessibility_notes,
              virtual_link, tags, status, priority, created_by,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              category = EXCLUDED.category,
              location = EXCLUDED.location,
              date_time = EXCLUDED.date_time,
              organizer = EXCLUDED.organizer,
              contact_info = EXCLUDED.contact_info,
              requirements = EXCLUDED.requirements,
              accessibility_notes = EXCLUDED.accessibility_notes,
              virtual_link = EXCLUDED.virtual_link,
              tags = EXCLUDED.tags,
              status = EXCLUDED.status,
              priority = EXCLUDED.priority,
              updated_at = EXCLUDED.updated_at
          `, [
            action.id,
            action.title,
            action.description,
            action.category,
            action.location,
            action.date_time,
            action.organizer,
            action.contact_info || {},
            action.requirements || [],
            action.accessibility_notes,
            action.virtual_link,
            action.tags || [],
            action.status || 'active',
            action.priority || 'normal',
            action.created_by,
            action.created_at,
            action.updated_at
          ]);
          
          this.stats.civicActions++;
          
        } catch (error) {
          console.error(`Error migrating action ${action.id}:`, error);
          this.stats.errors.push(`Action ${action.id}: ${error.message}`);
        }
      }
      
      await azureClient.end();
      console.log(`✅ Migrated ${this.stats.civicActions} civic actions`);
      
    } catch (error) {
      console.error('Error migrating civic actions:', error);
      throw error;
    }
  }

  private async migrateUserEngagement(): Promise<void> {
    console.log('💬 Migrating user engagement...');
    
    try {
      const supabaseEngagement = await this.fetchFromSupabase('user_engagement', {
        select: '*'
      });
      
      const azureClient = new Client({
        connectionString: this.azureConfig.connectionString
      });
      
      await azureClient.connect();
      
      for (const engagement of supabaseEngagement) {
        try {
          await azureClient.query(`
            INSERT INTO user_engagement (
              id, user_id, action_id, engagement_type, engagement_data,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
              engagement_type = EXCLUDED.engagement_type,
              engagement_data = EXCLUDED.engagement_data,
              updated_at = EXCLUDED.updated_at
          `, [
            engagement.id,
            engagement.user_id,
            engagement.action_id,
            engagement.engagement_type,
            engagement.engagement_data || {},
            engagement.created_at,
            engagement.updated_at
          ]);
          
          this.stats.userEngagement++;
          
        } catch (error) {
          console.error(`Error migrating engagement ${engagement.id}:`, error);
          this.stats.errors.push(`Engagement ${engagement.id}: ${error.message}`);
        }
      }
      
      await azureClient.end();
      console.log(`✅ Migrated ${this.stats.userEngagement} user engagements`);
      
    } catch (error) {
      console.error('Error migrating user engagement:', error);
      throw error;
    }
  }

  private async migrateComments(): Promise<void> {
    console.log('💭 Migrating comments...');
    
    try {
      const supabaseComments = await this.fetchFromSupabase('action_comments', {
        select: '*'
      });
      
      const azureClient = new Client({
        connectionString: this.azureConfig.connectionString
      });
      
      await azureClient.connect();
      
      for (const comment of supabaseComments) {
        try {
          await azureClient.query(`
            INSERT INTO action_comments (
              id, action_id, user_id, parent_comment_id, content,
              is_public, is_pinned, likes_count, replies_count,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (id) DO UPDATE SET
              content = EXCLUDED.content,
              is_public = EXCLUDED.is_public,
              is_pinned = EXCLUDED.is_pinned,
              likes_count = EXCLUDED.likes_count,
              replies_count = EXCLUDED.replies_count,
              updated_at = EXCLUDED.updated_at
          `, [
            comment.id,
            comment.action_id,
            comment.user_id,
            comment.parent_comment_id,
            comment.content,
            comment.is_public !== false,
            comment.is_pinned === true,
            comment.likes_count || 0,
            comment.replies_count || 0,
            comment.created_at,
            comment.updated_at
          ]);
          
          this.stats.comments++;
          
        } catch (error) {
          console.error(`Error migrating comment ${comment.id}:`, error);
          this.stats.errors.push(`Comment ${comment.id}: ${error.message}`);
        }
      }
      
      await azureClient.end();
      console.log(`✅ Migrated ${this.stats.comments} comments`);
      
    } catch (error) {
      console.error('Error migrating comments:', error);
      throw error;
    }
  }

  private async migrateNotifications(): Promise<void> {
    console.log('🔔 Migrating notifications...');
    
    try {
      const supabaseNotifications = await this.fetchFromSupabase('notifications', {
        select: '*'
      });
      
      const azureClient = new Client({
        connectionString: this.azureConfig.connectionString
      });
      
      await azureClient.connect();
      
      for (const notification of supabaseNotifications) {
        try {
          await azureClient.query(`
            INSERT INTO notifications (
              id, user_id, title, message, type, action_id,
              is_read, is_archived, priority, channels, metadata,
              created_at, read_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              message = EXCLUDED.message,
              type = EXCLUDED.type,
              is_read = EXCLUDED.is_read,
              is_archived = EXCLUDED.is_archived,
              priority = EXCLUDED.priority,
              channels = EXCLUDED.channels,
              metadata = EXCLUDED.metadata,
              read_at = EXCLUDED.read_at
          `, [
            notification.id,
            notification.user_id,
            notification.title,
            notification.message,
            notification.type || 'info',
            notification.action_id,
            notification.is_read === true,
            notification.is_archived === true,
            notification.priority || 'normal',
            notification.channels || ['push'],
            notification.metadata || {},
            notification.created_at,
            notification.read_at
          ]);
          
          this.stats.notifications++;
          
        } catch (error) {
          console.error(`Error migrating notification ${notification.id}:`, error);
          this.stats.errors.push(`Notification ${notification.id}: ${error.message}`);
        }
      }
      
      await azureClient.end();
      console.log(`✅ Migrated ${this.stats.notifications} notifications`);
      
    } catch (error) {
      console.error('Error migrating notifications:', error);
      throw error;
    }
  }

  private async migrateApiIntegrations(): Promise<void> {
    console.log('🔌 Migrating API integrations...');
    
    try {
      const supabaseIntegrations = await this.fetchFromSupabase('api_integrations', {
        select: '*'
      });
      
      const azureClient = new Client({
        connectionString: this.azureConfig.connectionString
      });
      
      await azureClient.connect();
      
      for (const integration of supabaseIntegrations) {
        try {
          await azureClient.query(`
            INSERT INTO api_integrations (
              id, api_name, endpoint, data, last_updated,
              expires_at, status, error_message, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO UPDATE SET
              data = EXCLUDED.data,
              last_updated = EXCLUDED.last_updated,
              expires_at = EXCLUDED.expires_at,
              status = EXCLUDED.status,
              error_message = EXCLUDED.error_message
          `, [
            integration.id,
            integration.api_name,
            integration.endpoint,
            integration.data,
            integration.last_updated,
            integration.expires_at,
            integration.status,
            integration.error_message,
            integration.created_at
          ]);
          
        } catch (error) {
          console.error(`Error migrating integration ${integration.id}:`, error);
          this.stats.errors.push(`Integration ${integration.id}: ${error.message}`);
        }
      }
      
      await azureClient.end();
      console.log(`✅ Migrated API integrations`);
      
    } catch (error) {
      console.error('Error migrating API integrations:', error);
      throw error;
    }
  }

  private async fetchFromSupabase(table: string, options: any = {}): Promise<any[]> {
    const { select = '*', eq, limit } = options;
    
    let url = `${this.supabaseConfig.url}/rest/v1/${table}?select=${select}`;
    
    if (eq) {
      Object.entries(eq).forEach(([key, value]) => {
        url += `&${key}=eq.${value}`;
      });
    }
    
    if (limit) {
      url += `&limit=${limit}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        'apikey': this.supabaseConfig.serviceRoleKey,
        'Authorization': `Bearer ${this.supabaseConfig.serviceRoleKey}`
      }
    });
    
    return response.data;
  }
}

// Export for use in Azure Function
export { SupabaseToAzureMigration };

// Example usage
async function runMigration() {
  const supabaseConfig = {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
  };
  
  const azureConfig = {
    connectionString: process.env.DATABASE_URL!
  };
  
  const migration = new SupabaseToAzureMigration(supabaseConfig, azureConfig);
  
  try {
    const stats = await migration.migrateAll();
    console.log('Migration completed with stats:', stats);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}
