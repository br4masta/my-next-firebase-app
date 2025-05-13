// API route for experiences
import { NextResponse } from 'next/server';
import { getExperiences } from '@/lib/firebase-service';

/**
 * GET handler for experiences API
 * Returns all experience items from the database
 */
export async function GET() {
  try {
    // Fetch all experiences from Firestore
    const experiences = await getExperiences();
    
    // Return the experiences as JSON
    return NextResponse.json({ experiences }, { status: 200 });
  } catch (error) {
    console.error('Error in experiences API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}