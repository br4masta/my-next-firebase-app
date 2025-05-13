// API route for portfolio items
import { NextResponse } from 'next/server';
import { getPortfolioItems, getPortfolioItemById } from '@/lib/firebase-service';

/**
 * GET handler for portfolio API
 * Returns all portfolio items or a specific item if ID is provided
 */
export async function GET(request) {
  try {
    // Get the URL from the request
    const { searchParams } = new URL(request.url);
    
    // Check if an ID is provided for a specific portfolio item
    const id = searchParams.get('id');
    
    if (id) {
      // Fetch a specific portfolio item by ID
      const portfolioItem = await getPortfolioItemById(id);
      return NextResponse.json({ portfolioItem }, { status: 200 });
    } else {
      // Fetch all portfolio items
      const portfolioItems = await getPortfolioItems();
      return NextResponse.json({ portfolioItems }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in portfolio API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}