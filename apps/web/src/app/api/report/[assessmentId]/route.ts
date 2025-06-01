import { NextResponse } from 'next/server';

// Mock data - replace with actual database query later
const mockReportData = {
  id: 'mockReportId123',
  assessmentId: 'mockAssessmentId123',
  date: '2024-03-20',
  riskFactors: {
    diabetes: {
      score: 65,
      level: 'medium',
      factors: [
        { name: 'BMI', value: 28, impact: 'high' },
        { name: 'Family History', value: 'present', impact: 'high' },
        { name: 'Physical Activity', value: 'low', impact: 'medium' }
      ]
    },
    heartDisease: {
      score: 30,
      level: 'low',
      factors: [
        { name: 'Blood Pressure', value: '120/80', impact: 'low' },
        { name: 'Cholesterol', value: 'normal', impact: 'low' },
        { name: 'Smoking', value: 'none', impact: 'low' }
      ]
    }
  },
  recommendations: [
    'Maintain a healthy diet rich in fruits and vegetables',
    'Increase physical activity to at least 30 minutes per day',
    'Schedule regular check-ups with your healthcare provider'
  ],
  detailedReport: {
    summary: {
      overallRisk: 'medium',
      keyFindings: [
        'Elevated BMI indicates increased diabetes risk',
        'Good heart health indicators',
        'Family history of diabetes requires monitoring'
      ]
    },
    chartsData: {
      categoryBreakdown: [
        { category: 'Lifestyle', score: 65 },
        { category: 'Genetics', score: 80 },
        { category: 'Medical History', score: 45 },
        { category: 'Environmental', score: 30 }
      ],
      riskTrends: [
        { month: 'Jan', diabetes: 60, heartDisease: 25 },
        { month: 'Feb', diabetes: 62, heartDisease: 28 },
        { month: 'Mar', diabetes: 65, heartDisease: 30 }
      ],
      factorImpact: [
        { factor: 'BMI', impact: 0.8 },
        { factor: 'Family History', impact: 0.7 },
        { factor: 'Physical Activity', impact: 0.5 },
        { factor: 'Diet', impact: 0.6 }
      ]
    },
    detailedAnalysis: {
      diabetes: {
        riskLevel: 'medium',
        contributingFactors: [
          { name: 'BMI', impact: 'high', details: 'Current BMI of 28 indicates overweight status' },
          { name: 'Family History', impact: 'high', details: 'First-degree relative with type 2 diabetes' },
          { name: 'Physical Activity', impact: 'medium', details: 'Less than 150 minutes of moderate activity per week' }
        ],
        recommendations: [
          'Reduce BMI to below 25',
          'Increase physical activity to 150 minutes per week',
          'Regular blood glucose monitoring'
        ]
      },
      heartDisease: {
        riskLevel: 'low',
        contributingFactors: [
          { name: 'Blood Pressure', impact: 'low', details: 'Normal blood pressure readings' },
          { name: 'Cholesterol', impact: 'low', details: 'Normal cholesterol levels' },
          { name: 'Smoking', impact: 'low', details: 'No smoking history' }
        ],
        recommendations: [
          'Maintain current healthy lifestyle',
          'Regular cardiovascular check-ups',
          'Continue monitoring blood pressure'
        ]
      }
    }
  }
};

export async function GET(
  request: Request,
  { params }: { params: { assessmentId: string } }
) {
  try {
    // In a real application, you would fetch this data from your database
    // For now, we'll return mock data
    const reportData = {
      ...mockReportData,
      assessmentId: params.assessmentId
    };

    return NextResponse.json({ 
      success: true, 
      data: reportData 
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch report data' 
      },
      { status: 500 }
    );
  }
} 