import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:predictive_health_monitoring/screens/report_details_screen.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  // Mock data for a list of past assessments
  final List<Map<String, dynamic>> _assessments = const [
    {
      'id': 'assessment_101',
      'date': '2023-10-28T10:00:00Z',
      'riskLevel': 'Medium',
      'riskScore': 68,
    },
    {
      'id': 'assessment_102',
      'date': '2023-09-15T14:30:00Z',
      'riskLevel': 'Low',
      'riskScore': 35,
    },
    {
      'id': 'assessment_103',
      'date': '2023-08-01T09:00:00Z',
      'riskLevel': 'High',
      'riskScore': 82,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Assessment History'),
        centerTitle: true,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
        itemCount: _assessments.length,
        itemBuilder: (context, index) {
          final assessment = _assessments[index];
          final date = DateTime.parse(assessment['date']);
          final formattedDate = DateFormat.yMMMMd().add_jm().format(date);
          final riskColor = _getRiskColor(assessment['riskLevel']);

          return Card(
            elevation: 3,
            margin: const EdgeInsets.symmetric(vertical: 8.0),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: ListTile(
              contentPadding: const EdgeInsets.all(16.0),
              leading: CircleAvatar(
                backgroundColor: riskColor.withOpacity(0.15),
                child: Text(
                  '${assessment['riskScore']}',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: riskColor,
                  ),
                ),
              ),
              title: Text(
                'Risk Level: ${assessment['riskLevel']}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text('Completed on:\n$formattedDate'),
              trailing: const Icon(Icons.chevron_right),
              isThreeLine: true,
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => ReportDetailsScreen(
                      assessmentId: assessment['id'],
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }

  Color _getRiskColor(String riskLevel) {
    switch (riskLevel) {
      case 'High':
        return Colors.red.shade600;
      case 'Medium':
        return Colors.orange.shade600;
      case 'Low':
        return Colors.green.shade600;
      default:
        return Colors.grey;
    }
  }
} 