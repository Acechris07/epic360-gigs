-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create security policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create security policies for gigs
CREATE POLICY "Anyone can view active gigs" ON gigs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Freelancers can manage their own gigs" ON gigs
  FOR ALL USING (auth.uid() = freelancer_id);

-- Create security policies for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.uid() = client_id OR 
    auth.uid() = freelancer_id
  );

CREATE POLICY "Clients can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Order participants can update orders" ON orders
  FOR UPDATE USING (
    auth.uid() = client_id OR 
    auth.uid() = freelancer_id
  );

-- Create audit log table for security events
CREATE TABLE auth_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to log auth events
CREATE OR REPLACE FUNCTION log_auth_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO auth_audit_log (user_id, event_type, metadata)
  VALUES (
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for audit logging
CREATE TRIGGER auth_users_audit
  AFTER INSERT OR UPDATE OR DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION log_auth_event();

-- Create session management table
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for session lookups
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Create function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions 
  WHERE expires_at < NOW() OR is_active = false;
END;
$$ LANGUAGE plpgsql;

-- Create failed login attempts table
CREATE TABLE failed_login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  ip_address INET NOT NULL,
  user_agent TEXT,
  attempt_count INTEGER DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Create index for failed attempts lookups
CREATE INDEX idx_failed_attempts_email ON failed_login_attempts(email);
CREATE INDEX idx_failed_attempts_ip ON failed_login_attempts(ip_address);
