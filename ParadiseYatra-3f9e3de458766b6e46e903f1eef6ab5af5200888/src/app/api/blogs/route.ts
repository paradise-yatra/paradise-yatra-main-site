import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

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
    const url = featured === 'true'
      ? `${BACKEND_URL}/api/blogs/featured`
      : `${BACKEND_URL}/api/blogs`;

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
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Failed to create blog' }, { status: response.status });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Blogs API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}