import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: NextRequest) {
  try {
    const { url, projectId } = await request.json();
    
    const supabase = createClientComponentClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await importFigmaFile({ url, projectId }, user);
    return result;

  } catch (error) {
    console.error('Figma import error:', error);
    return NextResponse.json(
      { error: 'Failed to import Figma design' },
      { status: 500 }
    );
  }
}

async function importFigmaFile(data: any, user: any) {
  const { url, projectId } = data;
  
  // Extract file ID from Figma URL
  const fileIdMatch = url.match(/file\/([a-zA-Z0-9]+)/);
  if (!fileIdMatch) {
    return NextResponse.json(
      { error: 'Invalid Figma URL. Please provide a valid Figma file URL.' },
      { status: 400 }
    );
  }

  const fileId = fileIdMatch[1];

  try {
    // Get user's Figma token from profile or use system token
    const supabase = createClientComponentClient();
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('figma_token')
      .eq('user_id', user.id)
      .single();

    const figmaToken = profile?.figma_token || process.env.FIGMA_ACCESS_TOKEN;

    if (!figmaToken) {
      return NextResponse.json(
        { error: 'Figma access token not found. Please connect your Figma account.' },
        { status: 400 }
      );
    }

    // Get file information with enhanced error handling
    const fileResponse = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
      headers: {
        'X-Figma-Token': figmaToken,
      },
    });

    if (!fileResponse.ok) {
      if (fileResponse.status === 403) {
        return NextResponse.json(
          { error: 'Access denied. Please check file permissions or Figma token.' },
          { status: 403 }
        );
      }
      if (fileResponse.status === 404) {
        return NextResponse.json(
          { error: 'Figma file not found. Please check the URL.' },
          { status: 404 }
        );
      }
      throw new Error(`Figma API error: ${fileResponse.status}`);
    }

    const fileData = await fileResponse.json();
    
    // Get all node IDs for image export
    const nodeIds: string[] = [];
    function collectNodeIds(node: any) {
      if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'GROUP') {
        nodeIds.push(node.id);
      }
      if (node.children) {
        node.children.forEach(collectNodeIds);
      }
    }

    fileData.document.children.forEach((page: any) => {
      page.children?.forEach(collectNodeIds);
    });

    // Get file images in batches (Figma API limit)
    const batchSize = 100;
    const imageData: any = { images: {} };
    
    for (let i = 0; i < nodeIds.length; i += batchSize) {
      const batch = nodeIds.slice(i, i + batchSize);
      const imageResponse = await fetch(
        `https://api.figma.com/v1/images/${fileId}?ids=${batch.join(',')}&format=png&scale=2`,
        {
          headers: {
            'X-Figma-Token': figmaToken,
          },
        }
      );

      if (imageResponse.ok) {
        const batchData = await imageResponse.json();
        Object.assign(imageData.images, batchData.images);
      }
    }

    // Process frames and components with enhanced data extraction
    const frames: any[] = [];
    const components: any[] = [];

    function processNode(node: any, parentFrame?: any) {
      if (node.type === 'FRAME') {
        const frame = {
          id: node.id,
          name: node.name,
          width: node.absoluteBoundingBox?.width || 0,
          height: node.absoluteBoundingBox?.height || 0,
          image: imageData.images[node.id] || '',
          components: [],
          backgroundColor: node.backgroundColor,
          cornerRadius: node.cornerRadius,
          layoutMode: node.layoutMode,
          primaryAxisSizingMode: node.primaryAxisSizingMode,
          counterAxisSizingMode: node.counterAxisSizingMode,
          paddingLeft: node.paddingLeft,
          paddingRight: node.paddingRight,
          paddingTop: node.paddingTop,
          paddingBottom: node.paddingBottom,
          itemSpacing: node.itemSpacing,
        };
        frames.push(frame);
        parentFrame = frame;
      }

      if (node.type === 'COMPONENT' || node.type === 'INSTANCE' || node.type === 'TEXT' || node.type === 'RECTANGLE' || node.type === 'ELLIPSE') {
        const component = {
          id: node.id,
          name: node.name,
          type: node.type,
          frameId: parentFrame?.id,
          properties: {
            width: node.absoluteBoundingBox?.width,
            height: node.absoluteBoundingBox?.height,
            x: node.absoluteBoundingBox?.x,
            y: node.absoluteBoundingBox?.y,
            backgroundColor: node.backgroundColor,
            cornerRadius: node.cornerRadius,
            effects: node.effects,
            fills: node.fills,
            strokes: node.strokes,
            strokeWeight: node.strokeWeight,
            opacity: node.opacity,
            blendMode: node.blendMode,
            layoutMode: node.layoutMode,
            primaryAxisSizingMode: node.primaryAxisSizingMode,
            counterAxisSizingMode: node.counterAxisSizingMode,
            paddingLeft: node.paddingLeft,
            paddingRight: node.paddingRight,
            paddingTop: node.paddingTop,
            paddingBottom: node.paddingBottom,
            itemSpacing: node.itemSpacing,
            // Text-specific properties
            characters: node.characters,
            style: node.style,
            characterStyleOverrides: node.characterStyleOverrides,
            styleOverrideTable: node.styleOverrideTable,
          }
        };
        
        components.push(component);
        
        if (parentFrame) {
          parentFrame.components.push(component);
        }
      }

      if (node.children) {
        node.children.forEach((child: any) => processNode(child, parentFrame));
      }
    }

    fileData.document.children.forEach((page: any) => {
      if (page.children) {
        page.children.forEach((child: any) => processNode(child));
      }
    });

    // Extract design system styles with enhanced data
    const styles = await extractDesignStyles(fileData, fileId, figmaToken);

    const designData = {
      id: fileId,
      name: fileData.name,
      thumbnail: imageData.images[fileData.document.children[0]?.children?.[0]?.id] || '',
      url: url,
      frames: frames,
      components: components,
      styles: styles,
      metadata: {
        version: fileData.version,
        lastModified: fileData.lastModified,
        thumbnailUrl: fileData.thumbnailUrl,
        role: fileData.role,
      },
      created_at: new Date().toISOString(),
    };

    // Save design to database if projectId is provided
    if (projectId) {
      const supabase = createClientComponentClient();
      const { error } = await supabase
        .from('figma_designs')
        .insert({
          project_id: projectId,
          user_id: user.id,
          figma_file_id: fileId,
          design_data: designData,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving design to database:', error);
      }
    }

    return NextResponse.json(designData);

  } catch (error: any) {
    console.error('Figma import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import Figma file' },
      { status: 500 }
    );
  }
}

async function extractDesignStyles(fileData: any, fileId: string, figmaToken: string) {
  const styles: any[] = [];
  
  try {
    // Get local styles from file
    if (fileData.styles) {
      Object.values(fileData.styles).forEach((style: any) => {
        styles.push({
          id: style.key,
          name: style.name,
          type: style.styleType?.toLowerCase() || 'unknown',
          value: style.description,
          cssCode: generateCSSFromLocalStyle(style),
        });
      });
    }

    // Get published styles
    const publishedStylesResponse = await fetch(`https://api.figma.com/v1/files/${fileId}/styles`, {
      headers: {
        'X-Figma-Token': figmaToken,
      },
    });

    if (publishedStylesResponse.ok) {
      const publishedStyles = await publishedStylesResponse.json();
      publishedStyles.meta.styles?.forEach((style: any) => {
        styles.push({
          id: style.key,
          name: style.name,
          type: style.style_type?.toLowerCase() || 'unknown',
          value: style.description,
          cssCode: generateCSSFromStyle(style),
          isPublished: true,
        });
      });
    }
  } catch (error) {
    console.error('Error extracting design styles:', error);
  }
  
  return styles;
}

function generateCSSFromStyle(style: any): string {
  return `/* ${style.name} */\n.${style.name.toLowerCase().replace(/[^a-z0-9]/g, '-')} {\n  /* Generated from Figma */\n}`;
}

function generateCSSFromLocalStyle(style: any): string {
  return `/* Local style: ${style.name} */\n.${style.name.toLowerCase().replace(/[^a-z0-9]/g, '-')} {\n  /* Add CSS properties */\n}`;
}