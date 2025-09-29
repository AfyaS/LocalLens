-- Azure Database Schema Migration
-- Complete PostgreSQL schema for Community Clarity AI on Azure

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 1. User Management and Authentication
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  full_name text,
  avatar_url text,
  phone text,
  location text,
  timezone text DEFAULT 'America/New_York',
  language text DEFAULT 'en',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- 2. User Profiles and Preferences
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  bio text,
  interests text[] DEFAULT ARRAY[]::text[],
  accessibility_preferences jsonb DEFAULT '{}',
  notification_preferences jsonb DEFAULT '{}',
  privacy_settings jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id)
);

-- 3. Civic Actions (Enhanced)
CREATE TABLE IF NOT EXISTS public.civic_actions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  category text,
  subcategory text,
  location text,
  virtual_location text,
  date_time timestamp with time zone,
  end_time timestamp with time zone,
  organizer text,
  organizer_contact jsonb DEFAULT '{}',
  contact_info jsonb DEFAULT '{}',
  requirements text[] DEFAULT ARRAY[]::text[],
  accessibility_notes text,
  virtual_link text,
  registration_required boolean DEFAULT false,
  registration_url text,
  max_participants integer,
  current_participants integer DEFAULT 0,
  status text DEFAULT 'active', -- active, cancelled, completed, postponed
  priority text DEFAULT 'normal', -- low, normal, high, urgent
  tags text[] DEFAULT ARRAY[]::text[],
  metadata jsonb DEFAULT '{}',
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT civic_actions_pkey PRIMARY KEY (id),
  CONSTRAINT civic_actions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL
);

-- 4. User Engagement and Interactions
CREATE TABLE IF NOT EXISTS public.user_engagement (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  action_id uuid NOT NULL,
  engagement_type text NOT NULL, -- view, interest, rsvp, attend, share, comment, organize
  engagement_data jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_engagement_pkey PRIMARY KEY (id),
  CONSTRAINT user_engagement_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT user_engagement_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.civic_actions(id) ON DELETE CASCADE,
  CONSTRAINT user_engagement_unique UNIQUE (user_id, action_id, engagement_type)
);

-- 5. Comments and Discussions
CREATE TABLE IF NOT EXISTS public.action_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  action_id uuid NOT NULL,
  user_id uuid NOT NULL,
  parent_comment_id uuid,
  content text NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  is_pinned boolean NOT NULL DEFAULT false,
  likes_count integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT action_comments_pkey PRIMARY KEY (id),
  CONSTRAINT action_comments_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.civic_actions(id) ON DELETE CASCADE,
  CONSTRAINT action_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT action_comments_parent_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.action_comments(id) ON DELETE CASCADE
);

-- 6. User Messaging System
CREATE TABLE IF NOT EXISTS public.user_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  subject text,
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'direct', -- direct, action_invite, system, notification
  related_action_id uuid,
  is_read boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone,
  CONSTRAINT user_messages_pkey PRIMARY KEY (id),
  CONSTRAINT user_messages_sender_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT user_messages_recipient_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT user_messages_action_fkey FOREIGN KEY (related_action_id) REFERENCES public.civic_actions(id) ON DELETE SET NULL
);

-- 7. Notifications System
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info', -- info, success, warning, error, action, system
  action_id uuid,
  is_read boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  priority text DEFAULT 'normal', -- low, normal, high, urgent
  channels text[] DEFAULT ARRAY['push'], -- push, email, sms, in_app
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT notifications_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.civic_actions(id) ON DELETE SET NULL
);

-- 8. User Reputation and Impact
CREATE TABLE IF NOT EXISTS public.user_reputation (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  reputation_score integer NOT NULL DEFAULT 0,
  impact_points integer NOT NULL DEFAULT 0,
  badges text[] DEFAULT ARRAY[]::text[],
  achievements jsonb DEFAULT '{}',
  level text DEFAULT 'beginner', -- beginner, intermediate, advanced, expert
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_reputation_pkey PRIMARY KEY (id),
  CONSTRAINT user_reputation_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT user_reputation_user_unique UNIQUE (user_id)
);

-- 9. Categories and Tags
CREATE TABLE IF NOT EXISTS public.action_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  color text,
  icon text,
  parent_category_id uuid,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT action_categories_pkey PRIMARY KEY (id),
  CONSTRAINT action_categories_parent_fkey FOREIGN KEY (parent_category_id) REFERENCES public.action_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.action_tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  color text,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT action_tags_pkey PRIMARY KEY (id)
);

-- 10. Geographic Data
CREATE TABLE IF NOT EXISTS public.locations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text,
  city text,
  state text,
  zip_code text,
  country text DEFAULT 'US',
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  location_type text, -- city_hall, community_center, school, library, etc.
  accessibility_features text[],
  capacity integer,
  is_virtual boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT locations_pkey PRIMARY KEY (id)
);

-- 11. API Integrations and Caching
CREATE TABLE IF NOT EXISTS public.api_integrations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  api_name text NOT NULL,
  endpoint text NOT NULL,
  data jsonb NOT NULL,
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  status text NOT NULL DEFAULT 'active',
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT api_integrations_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.api_cache (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  api_name text NOT NULL,
  endpoint text NOT NULL,
  cache_key text NOT NULL,
  data jsonb NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT api_cache_pkey PRIMARY KEY (id),
  CONSTRAINT api_cache_unique UNIQUE (api_name, cache_key)
);

-- 12. Analytics and Metrics
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  session_id text,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  page_url text,
  referrer text,
  user_agent text,
  ip_address inet,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT analytics_events_pkey PRIMARY KEY (id),
  CONSTRAINT analytics_events_user_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- 13. Event Attendance
CREATE TABLE IF NOT EXISTS public.event_attendance (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  action_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'registered', -- registered, attended, cancelled, no_show
  registration_data jsonb DEFAULT '{}',
  attended_at timestamp with time zone,
  feedback text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT event_attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT event_attendance_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.civic_actions(id) ON DELETE CASCADE,
  CONSTRAINT event_attendance_unique UNIQUE (user_id, action_id)
);

-- 14. Many-to-Many Relationships
CREATE TABLE IF NOT EXISTS public.civic_actions_categories (
  action_id uuid NOT NULL,
  category_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT civic_actions_categories_pkey PRIMARY KEY (action_id, category_id),
  CONSTRAINT civic_actions_categories_action_fkey FOREIGN KEY (action_id) REFERENCES public.civic_actions(id) ON DELETE CASCADE,
  CONSTRAINT civic_actions_categories_category_fkey FOREIGN KEY (category_id) REFERENCES public.action_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.civic_actions_tags (
  action_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT civic_actions_tags_pkey PRIMARY KEY (action_id, tag_id),
  CONSTRAINT civic_actions_tags_action_fkey FOREIGN KEY (action_id) REFERENCES public.civic_actions(id) ON DELETE CASCADE,
  CONSTRAINT civic_actions_tags_tag_fkey FOREIGN KEY (tag_id) REFERENCES public.action_tags(id) ON DELETE CASCADE
);

-- 15. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_civic_actions_date_time ON public.civic_actions(date_time);
CREATE INDEX IF NOT EXISTS idx_civic_actions_category ON public.civic_actions(category);
CREATE INDEX IF NOT EXISTS idx_civic_actions_status ON public.civic_actions(status);
CREATE INDEX IF NOT EXISTS idx_user_engagement_user_id ON public.user_engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_action_id ON public.user_engagement(action_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_type ON public.user_engagement(engagement_type);
CREATE INDEX IF NOT EXISTS idx_action_comments_action_id ON public.action_comments(action_id);
CREATE INDEX IF NOT EXISTS idx_action_comments_user_id ON public.action_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_recipient_id ON public.user_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_sender_id ON public.user_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_read ON public.user_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_event_attendance_user_id ON public.event_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_action_id ON public.event_attendance(action_id);

-- 16. Full-text Search Indexes
CREATE INDEX IF NOT EXISTS idx_civic_actions_search ON public.civic_actions USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_action_comments_search ON public.action_comments USING gin(to_tsvector('english', content));

-- 17. Functions for Real-time Features
CREATE OR REPLACE FUNCTION public.get_user_engagement_stats(user_uuid uuid)
RETURNS TABLE(
  total_actions integer,
  total_views integer,
  total_interests integer,
  total_rsvps integer,
  total_attendance integer,
  reputation_score integer,
  impact_points integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT ue.action_id)::integer as total_actions,
    COUNT(CASE WHEN ue.engagement_type = 'view' THEN 1 END)::integer as total_views,
    COUNT(CASE WHEN ue.engagement_type = 'interest' THEN 1 END)::integer as total_interests,
    COUNT(CASE WHEN ue.engagement_type = 'rsvp' THEN 1 END)::integer as total_rsvps,
    COUNT(CASE WHEN ue.engagement_type = 'attend' THEN 1 END)::integer as total_attendance,
    COALESCE(ur.reputation_score, 0)::integer as reputation_score,
    COALESCE(ur.impact_points, 0)::integer as impact_points
  FROM public.user_engagement ue
  LEFT JOIN public.user_reputation ur ON ur.user_id = user_uuid
  WHERE ue.user_id = user_uuid
  GROUP BY ur.reputation_score, ur.impact_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Triggers for Real-time Updates
CREATE OR REPLACE FUNCTION public.handle_new_engagement()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user reputation when they engage
  INSERT INTO public.user_reputation (user_id, reputation_score, impact_points)
  VALUES (NEW.user_id, 1, 1)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    reputation_score = user_reputation.reputation_score + 1,
    impact_points = user_reputation.impact_points + 1,
    updated_at = now();
  
  -- Update action participant count
  UPDATE public.civic_actions 
  SET current_participants = current_participants + 1
  WHERE id = NEW.action_id AND NEW.engagement_type = 'rsvp';
  
  -- Send real-time notification
  PERFORM pg_notify('engagement_update', json_build_object(
    'user_id', NEW.user_id,
    'action_id', NEW.action_id,
    'engagement_type', NEW.engagement_type
  )::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_new_engagement
  AFTER INSERT ON public.user_engagement
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_engagement();

-- 19. Sample Data
INSERT INTO public.action_categories (name, description, color, icon) VALUES
('Government', 'Official government meetings and hearings', '#3B82F6', 'building'),
('Community', 'Community events and volunteer opportunities', '#10B981', 'users'),
('Education', 'Educational events and workshops', '#8B5CF6', 'book'),
('Environment', 'Environmental and sustainability events', '#059669', 'leaf'),
('Social Justice', 'Social justice and advocacy events', '#DC2626', 'scale'),
('Health', 'Health and wellness events', '#EC4899', 'heart'),
('Technology', 'Technology and innovation events', '#6366F1', 'cpu'),
('Arts & Culture', 'Arts, culture, and creative events', '#F59E0B', 'palette');

INSERT INTO public.action_tags (name, description, color) VALUES
('Urgent', 'Time-sensitive actions requiring immediate attention', '#EF4444'),
('Beginner Friendly', 'Suitable for newcomers to civic engagement', '#10B981'),
('Virtual', 'Online or hybrid events', '#3B82F6'),
('Accessible', 'Wheelchair accessible and inclusive', '#8B5CF6'),
('Family Friendly', 'Suitable for families with children', '#F59E0B'),
('Professional Development', 'Career and skill-building opportunities', '#6366F1'),
('Free', 'No cost to participate', '#059669'),
('Registration Required', 'Must register in advance', '#DC2626');

-- 20. Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_engagement
CREATE POLICY "Users can view their own engagement" ON public.user_engagement
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own engagement" ON public.user_engagement
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own engagement" ON public.user_engagement
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for action_comments
CREATE POLICY "Anyone can view public comments" ON public.action_comments
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own comments" ON public.action_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.action_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_messages
CREATE POLICY "Users can view their own messages" ON public.user_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.user_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own received messages" ON public.user_messages
  FOR UPDATE USING (auth.uid() = recipient_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
