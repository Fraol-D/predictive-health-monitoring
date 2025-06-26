import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Health Reports'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildRiskScoreCard(context),
            const SizedBox(height: 24),
            _buildHealthTrendsCard(context),
          ],
        ),
      ),
    );
  }

  Widget _buildRiskScoreCard(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text('Overall Risk Score', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: PieChart(
                PieChartData(
                  sections: [
                    PieChartSectionData(value: 40, color: Colors.red, title: '40%', radius: 50),
                    PieChartSectionData(value: 30, color: Colors.amber, title: '30%', radius: 50),
                    PieChartSectionData(value: 30, color: Colors.green, title: '30%', radius: 50),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHealthTrendsCard(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text('Health Trends', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  barGroups: [
                    BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 8, color: AppTheme.lightPrimary)]),
                    BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 10, color: AppTheme.lightPrimary)]),
                    BarChartGroupData(x: 2, barRods: [BarChartRodData(toY: 14, color: AppTheme.lightPrimary)]),
                    BarChartGroupData(x: 3, barRods: [BarChartRodData(toY: 15, color: AppTheme.lightPrimary)]),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
} 