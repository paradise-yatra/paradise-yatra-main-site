import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    // Validate featured parameter if provided
    if (featured && !['true', 'false'].includes(featured)) {
      return NextResponse.json(
        {
          message: 'Invalid featured parameter',
          error: `Featured '${featured}' is not valid. Must be 'true' or 'false'`
        },
        { status: 400 }
      );
    }

    // Use the dedicated featured endpoint if featured=true
    let url = featured === 'true'
      ? `${BACKEND_URL}/api/blogs/featured`
      : `${BACKEND_URL}/api/blogs`;

    // Add query parameters if provided
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit);
    if (page) queryParams.append('page', page);
    if (featured && featured !== 'true') queryParams.append('featured', featured);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Failed to fetch blogs' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Blogs API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check Content-Type to determine how to parse the request
    const contentType = request.headers.get('content-type') || '';
    
    let response;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData requests (file uploads)
      const formData = await request.formData();
      
      response = await fetch(`${BACKEND_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Authorization': request.headers.get('Authorization') || '',
          // Don't set Content-Type header - let fetch set it with boundary
        },
        body: formData,
      });
    } else {
      // Handle JSON requests
      const body = await request.json();
      
      response = await fetch(`${BACKEND_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization') || '',
        },
        body: JSON.stringify(body),
      });
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to create blog' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Blogs API error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}