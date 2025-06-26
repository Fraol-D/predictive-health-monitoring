import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

// Mock data structure based on the web app's ReportData interface
class ReportData {
  final String assessmentId;
  final String userId;
  final DateTime submittedAt;
  final String riskLevel;
  final int riskScore;
  final String summary;
  final Map<String, dynamic> detailedReport;
  final bool isSharedWithProfessional;

  ReportData({
    required this.assessmentId,
    required this.userId,
    required this.submittedAt,
    required this.riskLevel,
    required this.riskScore,
    required this.summary,
    required this.detailedReport,
    required this.isSharedWithProfessional,
  });
}

class ReportDetailsScreen extends StatelessWidget {
  final String assessmentId;

  const ReportDetailsScreen({super.key, required this.assessmentId});

  // TODO: Replace with actual data fetching logic
  Future<ReportData> _fetchReportData() async {
    // Simulate a network call
    await Future.delayed(const Duration(seconds: 1));
    // Mock data mirroring the web app structure
    return ReportData(
      assessmentId: assessmentId,
      userId: 'mock_user_123',
      submittedAt: DateTime.now().subtract(const Duration(days: 5)),
      riskLevel: 'Medium',
      riskScore: 68,
      summary: 'Based on the provided data, there is a medium risk profile, primarily driven by lifestyle factors and cholesterol levels. Immediate attention to diet and exercise is recommended.',
      detailedReport: {
        'bloodPressure': {'value': '135/85 mmHg', 'status': 'Elevated'},
        'cholesterol': {'value': '210 mg/dL', 'status': 'High'},
        'lifestyleFactors': [
          {'factor': 'Physical Activity', 'status': 'Low', 'impact': 'High'},
          {'factor': 'Diet Quality', 'status': 'Fair', 'impact': 'Medium'},
        ],
        'chartsData': {
          'categoryBreakdown': [
            {'name': 'Diet', 'score': 75, 'color': Colors.orange},
            {'name': 'Lifestyle', 'score': 85, 'color': Colors.red},
            {'name': 'Genetics', 'score': 40, 'color': Colors.blue},
            {'name': 'Vitals', 'score': 60, 'color': Colors.yellow},
          ]
        }
      },
      isSharedWithProfessional: false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Health Report'),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: FutureBuilder<ReportData>(
        future: _fetchReportData(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          if (!snapshot.hasData) {
            return const Center(child: Text('Report not found.'));
          }

          final report = snapshot.data!;
          final textTheme = Theme.of(context).textTheme;

          return ListView(
            padding: const EdgeInsets.all(16.0),
            children: [
              // Header Card
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    children: [
                      Text('Overall Risk', style: textTheme.titleMedium),
                      const SizedBox(height: 10),
                      Text(
                        '${report.riskLevel} (${report.riskScore}%)',
                        style: textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: _getRiskColor(report.riskLevel),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        report.summary,
                        textAlign: TextAlign.center,
                        style: textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Bar Chart for Risk Categories
              Text('Risk Factor Breakdown', style: textTheme.titleLarge),
              const SizedBox(height: 16),
              SizedBox(
                height: 250,
                child: BarChart(
                  BarChartData(
                    alignment: BarChartAlignment.spaceAround,
                    maxY: 100,
                    barTouchData: BarTouchData(
                      enabled: false,
                    ),
                    titlesData: FlTitlesData(
                      show: true,
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (double value, TitleMeta meta) {
                            final categories = report.detailedReport['chartsData']['categoryBreakdown'] as List;
                            return Padding(
                              padding: const EdgeInsets.only(top: 8.0),
                              child: Text(categories[value.toInt()]['name'], style: const TextStyle(fontSize: 10)),
                            );
                          },
                          reservedSize: 38,
                        ),
                      ),
                      leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    ),
                    borderData: FlBorderData(show: false),
                    barGroups: (report.detailedReport['chartsData']['categoryBreakdown'] as List<dynamic>).asMap().entries.map((entry) {
                      final index = entry.key;
                      final item = entry.value;
                      return BarChartGroupData(
                        x: index,
                        barRods: [
                          BarChartRodData(
                            toY: (item['score'] as int).toDouble(),
                            color: item['color'] as Color,
                            width: 22,
                            borderRadius: BorderRadius.circular(6)
                          )
                        ],
                      );
                    }).toList(),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Color _getRiskColor(String riskLevel) {
    switch (riskLevel) {
      case 'High':
        return Colors.red;
      case 'Medium':
        return Colors.orange;
      case 'Low':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
} 