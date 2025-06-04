import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Mock data - replace with actual database query
    const recommendations = [
      {
        id: '1',
        title: 'Increase Physical Activity',
        description: 'Aim for at least 30 minutes of moderate exercise daily.',
        priority: 'high',
        category: 'lifestyle',
      },
      {
        id: '2',
        title: 'Improve Sleep Habits',
        description: 'Maintain a consistent sleep schedule and aim for 7-8 hours of sleep.',
        priority: 'medium',
        category: 'lifestyle',
      },
      {
        id: '3',
        title: 'Reduce Processed Food Intake',
        description: 'Limit consumption of processed foods and increase whole food intake.',
        priority: 'medium',
        category: 'diet',
      },
    ];

    return NextResponse.json({ data: recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
} 