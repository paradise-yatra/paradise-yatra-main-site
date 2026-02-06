import { NextRequest, NextResponse } from 'next/server';

const getBackendUrl = () => {
  const nextUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const backUrl = process.env.BACKEND_URL;
  let base = nextUrl || backUrl || 'http://localhost:5001';
  if (base.endsWith('/')) base = base.slice(0, -1);
  return base;
};

const BACKEND_URL = getBackendUrl();

const getApiPath = (path: string) => {
  const hasApiSuffix = BACKEND_URL.endsWith('/api');
  if (hasApiSuffix && path.startsWith('/api/')) {
    return `${BACKEND_URL}${path.substring(4)}`;
  }
  return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(getApiPath(`/api/packages/${id}`), {
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch package' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Packages API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';

    // Check if it's FormData (multipart/form-data)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      const response = await fetch(getApiPath(`/api/packages/${id}`), {
        method: 'PUT',
        headers: {
          'Authorization': request.headers.get('Authorization') || '',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || 'Failed to update package' },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
    } else {
      const body = await request.json();
      const response = await fetch(getApiPath(`/api/packages/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization') || '',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || 'Failed to update package' },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Packages API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(getApiPath(`/api/packages/${id}`), {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to delete package' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Packages API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}