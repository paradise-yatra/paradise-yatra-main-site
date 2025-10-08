import { NextRequest, NextResponse } from 'next/server';
import { validateLimit } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    
    // Validate limit parameter
    if (!validateLimit(limit)) {
      return NextResponse.json(
        { 
          message: 'Invalid limit parameter', 
          error: `Limit '${limit}' is not valid. Must be a number between 1 and 100`
        }, 
        { status: 400 }
      );
    }
    
    // Validate page parameter
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return NextResponse.json(
        { 
          message: 'Invalid page parameter', 
          error: `Page '${page}' is not valid. Must be a positive number`
        }, 
        { status: 400 }
      );
    }
    
    // Validate status parameter if provided
    if (status && !['active', 'inactive', 'upcoming'].includes(status)) {
      return NextResponse.json(
        { 
          message: 'Invalid status parameter', 
          error: `Status '${status}' is not valid. Must be one of: active, inactive, upcoming`
        }, 
        { status: 400 }
      );
    }
    
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

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/fixed-departures?page=${page}&limit=${limit}`;
    
    if (status) {
      url += `&status=${status}`;
    }
    
    if (featured) {
      url += `&featured=${featured}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching fixed departures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fixed departures' },
      { status: 500 }
    );
  }
}
