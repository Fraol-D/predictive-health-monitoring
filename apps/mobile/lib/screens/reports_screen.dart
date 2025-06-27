import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:badges/badges.dart' as badges;
import 'package:predictive_health_monitoring/screens/notifications_screen.dart';
import '../theme/app_theme.dart';
import '../widgets/common/gradient_button.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  int touchedIndex = -1;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Reports',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 20),
        ),
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: AppTheme.titleHeaderGradient,
          ),
        ),
        actions: [
          IconButton(
            icon: badges.Badge(
              badgeContent: const Text('3', style: TextStyle(color: Colors.white, fontSize: 10)),
              child: const Icon(Icons.notifications_outlined),
            ),
            onPressed: () {
               Navigator.of(context).push(MaterialPageRoute(builder: (context) => const NotificationsScreen()));
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildRiskScoreCard(context, textTheme),
            const SizedBox(height: 24),
            _buildHealthTrendsCard(context, textTheme),
            const SizedBox(height: 32),
            GradientButton(
              text: 'View Full Report Details',
              onPressed: () {
                // TODO: Implement navigation to a detailed report view
              },
              gradient: AppTheme.actionButtonGradient,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRiskScoreCard(BuildContext context, TextTheme textTheme) {
    return Card(
      elevation: 4,
      shadowColor: Colors.black.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            Text(
              'Overall Risk Score',
              style: textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            SizedBox(
              height: 200,
              child: PieChart(
                PieChartData(
                  pieTouchData: PieTouchData(
                    touchCallback: (FlTouchEvent event, pieTouchResponse) {
                      setState(() {
                        if (!event.isInterestedForInteractions ||
                            pieTouchResponse == null ||
                            pieTouchResponse.touchedSection == null) {
                          touchedIndex = -1;
                          return;
                        }
                        touchedIndex = pieTouchResponse
                            .touchedSection!.touchedSectionIndex;
                      });
                    },
                  ),
                  borderData: FlBorderData(show: false),
                  sectionsSpace: 4,
                  centerSpaceRadius: 60,
                  sections: showingSections(),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Wrap(
              alignment: WrapAlignment.center,
              spacing: 16.0,
              runSpacing: 8.0,
              children: const [
                Indicator(color: AppTheme.actionGreen, text: 'Low Risk'),
                Indicator(color: AppTheme.actionBlue, text: 'Medium Risk'),
                Indicator(color: Colors.orange, text: 'High Risk'),
              ],
            )
          ],
        ),
      ),
    );
  }

  List<PieChartSectionData> showingSections() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final titleStyle = Theme.of(context).textTheme.titleMedium?.copyWith(
      fontWeight: FontWeight.bold,
      color: isDarkMode ? Colors.white : Colors.black,
    );

    return List.generate(3, (i) {
      final isTouched = i == touchedIndex;
      final fontSize = isTouched ? 22.0 : 16.0;
      final radius = isTouched ? 65.0 : 55.0;
      final color = AppTheme.chartColors[i % AppTheme.chartColors.length];

      switch (i) {
        case 0:
          return PieChartSectionData(
            color: color,
            value: 45,
            title: '45%',
            radius: radius,
            titleStyle: titleStyle?.copyWith(fontSize: fontSize),
          );
        case 1:
          return PieChartSectionData(
            color: color,
            value: 35,
            title: '35%',
            radius: radius,
            titleStyle: titleStyle?.copyWith(fontSize: fontSize),
          );
        case 2:
          return PieChartSectionData(
            color: color,
            value: 20,
            title: '20%',
            radius: radius,
            titleStyle: titleStyle?.copyWith(fontSize: fontSize),
          );
        default:
          throw Error();
      }
    });
  }

  Widget _buildHealthTrendsCard(BuildContext context, TextTheme textTheme) {
    return Card(
       elevation: 4,
      shadowColor: Colors.black.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
        child: Column(
          children: [
            Text('Health Trends',
                style: textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  barGroups: [
                    BarChartGroupData(x: 0, barRods: [
                      BarChartRodData(toY: 8, color: AppTheme.actionGreen, width: 20, borderRadius: BorderRadius.circular(4))
                    ]),
                    BarChartGroupData(x: 1, barRods: [
                      BarChartRodData(toY: 10, color: AppTheme.actionBlue, width: 20, borderRadius: BorderRadius.circular(4))
                    ]),
                    BarChartGroupData(x: 2, barRods: [
                      BarChartRodData(toY: 14, color: AppTheme.lightPrimary, width: 20, borderRadius: BorderRadius.circular(4))
                    ]),
                     BarChartGroupData(x: 3, barRods: [
                      BarChartRodData(toY: 15, color: AppTheme.lightAccent, width: 20, borderRadius: BorderRadius.circular(4))
                    ]),
                  ],
                   titlesData: FlTitlesData(
                     show: true,
                     rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                     topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                     bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, getTitlesWidget: (value, meta) => Text('Day ${value.toInt()+1}'))),
                     leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 30)),
                   ),
                   borderData: FlBorderData(show: false),
                   gridData: const FlGridData(show: true, drawVerticalLine: false),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class Indicator extends StatelessWidget {
  const Indicator({
    super.key,
    required this.color,
    required this.text,
    this.size = 16,
    this.textColor,
  });
  final Color color;
  final String text;
  final double size;
  final Color? textColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: color,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          text,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
        )
      ],
    );
  }
} 