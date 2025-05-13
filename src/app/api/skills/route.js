// API route for skills
import { NextResponse } from 'next/server';
import { getSkills } from '@/lib/firebase-service';

/**
 * GET handler for skills API
 * Returns all skills or filtered by status if query parameter is provided
 */
export async function GET(request) {
  try {
    // Get the URL from the request
    const { searchParams } = new URL(request.url);
    
    // Check if status filter is provided
    const status = searchParams.get('status');
    
    // Fetch skills from Firestore, optionally filtered by status
    const skills = await getSkills(status);
    
    // Return the skills as JSON
    return NextResponse.json({ skills }, { status: 200 });
  } catch (error) {
    console.error('Error in skills API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}