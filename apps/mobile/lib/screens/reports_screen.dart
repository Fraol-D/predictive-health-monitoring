import 'package:flutter/material.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data for reports
    final List<Map<String, dynamic>> reports = [
      {
        'title': 'Diabetes Risk',
        'riskLevel': 'Medium',
        'percentage': 65,
        'details': 'Your lifestyle factors and biometrics indicate a medium risk. Key contributors include diet and physical activity levels.',
        'color': Colors.orange.shade400,
      },
      {
        'title': 'Heart Disease Risk',
        'riskLevel': 'Low',
        'percentage': 30,
        'details': 'Your current habits suggest a low risk for heart disease. Continue maintaining a healthy diet and regular exercise.',
        'color': Colors.green.shade400,
      },
      {
        'title': 'Hypertension Risk',
        'riskLevel': 'Low',
        'percentage': 25,
        'details': 'Your blood pressure readings are within the optimal range. Keep monitoring your sodium intake.',
        'color': Colors.green.shade400,
      },
      {
        'title': 'General Wellness Score',
        'riskLevel': 'Good',
        'percentage': 75,
        'details': 'Overall, your health metrics are positive. Focus on consistency in your wellness routine.',
        'color': Colors.blue.shade400,
      }
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Health Reports'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: reports.length,
        itemBuilder: (context, index) {
          final report = reports[index];
          return _RiskReportCard(
            title: report['title'],
            riskLevel: report['riskLevel'],
            percentage: report['percentage'],
            details: report['details'],
            color: report['color'],
          );
        },
      ),
    );
  }
}

class _RiskReportCard extends StatelessWidget {
  final String title;
  final String riskLevel;
  final int percentage;
  final String details;
  final Color color;

  const _RiskReportCard({
    required this.title,
    required this.riskLevel,
    required this.percentage,
    required this.details,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$riskLevel Risk',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: color,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      Text(
                        '$percentage% Score',
                        style: Theme.of(context).textTheme.displaySmall?.copyWith(
                              color: color,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: _buildRiskBar(context, percentage),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 12),
            Text(details, style: Theme.of(context).textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }

  Widget _buildRiskBar(BuildContext context, int value) {
    return SizedBox(
      height: 100, // Fixed height for the bar chart area
      child: Align(
        alignment: Alignment.bottomCenter,
        child: FractionallySizedBox(
          heightFactor: value / 100.0,
          widthFactor: 0.6,
          child: Container(
            decoration: BoxDecoration(
              color: color,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(8),
                topRight: Radius.circular(8),
              ),
            ),
          ),
        ),
      ),
    );
  }
} 