import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: NextRequest) {
  try {
    const { projectId, name, files } = await request.json();

    // Get authenticated user
    const supabase = createClientComponentClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's Vercel token from their profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('vercel_token')
      .eq('user_id', user.id)
      .single();

    if (!profile?.vercel_token) {
      return NextResponse.json(
        { error: 'Vercel token not found. Please connect your Vercel account first.' },
        { status: 400 }
      );
    }

    const vercelToken = profile.vercel_token;

    // Prepare deployment files for Vercel
    const deploymentFiles = Object.entries(files).map(([filePath, content]) => ({
      file: filePath,
      data: content,
    }));

    // Add package.json if not present (required for Node.js deployments)
    const hasPackageJson = files['package.json'];
    if (!hasPackageJson) {
      const packageJson = {
        name: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        version: '1.0.0',
        description: `AI-generated ${name} project`,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint'
        },
        dependencies: {
          'next': '^14.0.0',
          'react': '^18.0.0',
          'react-dom': '^18.0.0',
          'typescript': '^5.0.0',
          '@types/node': '^20.0.0',
          '@types/react': '^18.0.0',
          '@types/react-dom': '^18.0.0',
          'tailwindcss': '^3.3.0',
          'autoprefixer': '^10.4.0',
          'postcss': '^8.4.0',
          'eslint': '^8.0.0',
          'eslint-config-next': '^14.0.0'
        }
      };

      deploymentFiles.push({
        file: 'package.json',
        data: JSON.stringify(packageJson, null, 2),
      });
    }

    // Add vercel.json configuration
    const vercelConfig = {
      version: 2,
      name: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      builds: [
        {
          src: 'package.json',
          use: '@vercel/next'
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: '/'
        }
      ],
      env: {
        NODE_ENV: 'production'
      },
      functions: {
        'app/api/**/*.ts': {
          maxDuration: 30
        }
      }
    };

    deploymentFiles.push({
      file: 'vercel.json',
      data: JSON.stringify(vercelConfig, null, 2),
    });

    // Create deployment on Vercel
    const deploymentResponse = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        files: deploymentFiles,
        projectSettings: {
          framework: 'nextjs',
          buildCommand: 'npm run build',
          devCommand: 'npm run dev',
          installCommand: 'npm install',
          outputDirectory: '.next',
        },
        meta: {
          generator: 'ecosyz-ai-code-generator',
          projectId: projectId,
          createdBy: user.id,
          createdAt: new Date().toISOString(),
        },
      }),
    });

    if (!deploymentResponse.ok) {
      const errorData = await deploymentResponse.json();
      console.error('Vercel deployment error:', errorData);
      
      if (deploymentResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid Vercel token. Please reconnect your Vercel account.' },
          { status: 401 }
        );
      }

      if (deploymentResponse.status === 429) {
        return NextResponse.json(
          { error: 'Vercel API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: errorData.error?.message || 'Deployment failed' },
        { status: deploymentResponse.status }
      );
    }

    const deployment = await deploymentResponse.json();
    
    // Poll deployment status
    const deploymentUrl = `https://${deployment.url}`;
    let deploymentStatus = 'BUILDING';
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max

    while (deploymentStatus === 'BUILDING' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      const statusResponse = await fetch(`https://api.vercel.com/v13/deployments/${deployment.uid}`, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        deploymentStatus = statusData.readyState;
      }
      
      attempts++;
    }

    // Log deployment details
    console.log(`✅ Vercel deployment created: ${deploymentUrl}`);
    console.log(`📁 Files deployed: ${deploymentFiles.length}`);
    console.log(`📊 Status: ${deploymentStatus}`);
    console.log(`🆔 Deployment ID: ${deployment.uid}`);

    return NextResponse.json({
      deploymentUrl,
      deploymentId: deployment.uid,
      status: deploymentStatus,
      filesDeployed: deploymentFiles.length,
      projectName: name,
    });

  } catch (error: any) {
    console.error('Vercel deployment error:', error);

    return NextResponse.json(
      { error: 'Failed to deploy to Vercel' },
      { status: 500 }
    );
  }
}

// Vercel OAuth connection endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code not provided' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.vercel.com/v2/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.VERCEL_CLIENT_ID!,
        client_secret: process.env.VERCEL_CLIENT_SECRET!,
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/deploy/vercel`,
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to exchange code for token' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user information from Vercel
    const userResponse = await fetch('https://api.vercel.com/v2/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user information' },
        { status: 400 }
      );
    }

    const vercelUser = await userResponse.json();

    // Get authenticated user from Supabase
    const supabase = createClientComponentClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Store Vercel token in user profile
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        vercel_token: accessToken,
        vercel_username: vercelUser.username,
        vercel_avatar: vercelUser.avatar,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to save Vercel connection' },
        { status: 500 }
      );
    }

    // Redirect back to the application
    return NextResponse.redirect(new URL('/workspace?vercel=connected', request.url));

  } catch (error) {
    console.error('Vercel OAuth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect Vercel account' },
      { status: 500 }
    );
  }
}

// Get deployment status endpoint
export async function PUT(request: NextRequest) {
  try {
    const { deploymentId } = await request.json();

    const supabase = createClientComponentClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('vercel_token')
      .eq('user_id', user.id)
      .single();

    if (!profile?.vercel_token) {
      return NextResponse.json(
        { error: 'Vercel token not found' },
        { status: 400 }
      );
    }

    const statusResponse = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
      headers: {
        'Authorization': `Bearer ${profile.vercel_token}`,
      },
    });

    if (!statusResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get deployment status' },
        { status: 500 }
      );
    }

    const deployment = await statusResponse.json();

    return NextResponse.json({
      status: deployment.readyState,
      url: `https://${deployment.url}`,
      createdAt: deployment.createdAt,
      updatedAt: deployment.updatedAt,
    });

  } catch (error) {
    console.error('Deployment status error:', error);
    return NextResponse.json(
      { error: 'Failed to check deployment status' },
      { status: 500 }
    );
  }
}