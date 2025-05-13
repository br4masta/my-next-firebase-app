import { NextResponse } from 'next/server';
import { addExperience, addSkill, addPortfolioItem } from '@/lib/firebase-service';
import seedData from '../../../../reference/portfolio.json';

export async function POST() {
  try {
    // Using the imported JSON directly since it's already parsed
    const data = seedData;
    
    // Seed experiences
    const workPromises = data.experiences.work.map(exp => 
      addExperience({ ...exp, type: 'work' })
    );
    const educationPromises = data.experiences.education.map(exp => 
      addExperience({ ...exp, type: 'education' })
    );

    // Seed skills
    const currentSkillsPromises = data.skills.current.map(skill => 
      addSkill({ ...skill, status: 'current' })
    );
    const aiSkillsPromises = data.skills.ai.map(skill => 
      addSkill({ ...skill, status: 'ai' })
    );
    const learningSkillsPromises = data.skills.learning.map(skill => 
      addSkill({ ...skill, status: 'learning' })
    );

    // Seed portfolio items
    const portfolioPromises = data.portfolio.map(item => 
      addPortfolioItem(item)
    );

    // Wait for all operations to complete
    await Promise.all([
      ...workPromises,
      ...educationPromises,
      ...currentSkillsPromises,
      ...aiSkillsPromises,
      ...learningSkillsPromises,
      ...portfolioPromises
    ]);

    return NextResponse.json(
      { message: 'Database seeded successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}

// Add GET method to handle incorrect HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to seed the database.' },
    { status: 405 }
  );
}
