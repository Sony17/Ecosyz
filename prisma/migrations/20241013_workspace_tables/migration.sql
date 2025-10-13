-- Create user profiles table for storing external API tokens
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    github_token TEXT,
    github_username TEXT,
    github_avatar TEXT,
    vercel_token TEXT,
    vercel_username TEXT,
    vercel_avatar TEXT,
    figma_token TEXT,
    figma_username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create projects table for storing generated projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    framework TEXT NOT NULL,
    app_type TEXT NOT NULL,
    files JSONB NOT NULL,
    figma_designs JSONB DEFAULT '[]',
    deployment_url TEXT,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create figma_designs table for storing Figma design data
CREATE TABLE IF NOT EXISTS figma_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id UUID NOT NULL,
    figma_file_id TEXT NOT NULL,
    design_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_figma_designs_project_id ON figma_designs(project_id);
CREATE INDEX IF NOT EXISTS idx_figma_designs_user_id ON figma_designs(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE figma_designs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view and edit their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and edit their own projects" ON projects
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and edit their own figma designs" ON figma_designs
    FOR ALL USING (auth.uid() = user_id);