import { NextRequest, NextResponse } from 'next/server';
import { validateApiParams } from '@/lib/validation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourType = searchParams.get('tourType');
    const state = searchParams.get('state');
    const limit = searchParams.get('limit');
    
    // Validate parameters
    const validation = validateApiParams({ tourType, state, limit });
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          message: 'Invalid parameters', 
          errors: validation.errors 
        }, 
        { status: 400 }
      );
    }
    
    // Clean and normalize state parameter
    let normalizedState = state;
    if (state) {
      // Decode URL encoding and normalize common variations
      normalizedState = decodeURIComponent(state)
        .replace(/&/g, 'and') // Replace & with 'and'
        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
        .trim(); // Remove leading/trailing spaces
    }
    
    // Build query string with filters
    const queryParams = new URLSearchParams();
    if (tourType) queryParams.append('tourType', tourType);
    if (normalizedState) queryParams.append('state', normalizedState);
    if (limit) queryParams.append('limit', limit);
    
    const queryString = queryParams.toString();
    const apiUrl = queryString ? `${BACKEND_URL}/api/destinations?${queryString}` : `${BACKEND_URL}/api/destinations`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Failed to fetch destinations' }, { status: response.status });
    }
    
    // The backend returns { destinations: [...], pagination: {...} }
    // Return the data as-is to maintain consistency with backend format
    return NextResponse.json(data);
  } catch (error) {
    console.error('Destinations API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/destinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Failed to create destination' }, { status: response.status });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Destinations API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}