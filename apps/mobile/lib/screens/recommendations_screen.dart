import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';

class RecommendationsScreen extends StatelessWidget {
  const RecommendationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data for recommendations
    final List<Map<String, dynamic>> recommendations = [
      {
        'title': 'Increase Daily Steps',
        'description': 'Aim for at least 10,000 steps per day to improve cardiovascular health and manage weight. Try taking the stairs or going for a walk during your lunch break.',
        'priority': 'High',
        'priorityColor': Colors.red.shade400,
      },
      {
        'title': 'Incorporate More Leafy Greens',
        'description': 'Add spinach, kale, or other leafy greens to at least one meal daily to boost your intake of vitamins K, A, and C.',
        'priority': 'Medium',
        'priorityColor': Colors.orange.shade400,
      },
      {
        'title': 'Practice Mindful Eating',
        'description': 'Pay attention to your body\'s hunger cues. Eat slowly and savor your food to improve digestion and prevent overeating.',
        'priority': 'Medium',
        'priorityColor': Colors.orange.shade400,
      },
      {
        'title': 'Establish a Consistent Sleep Schedule',
        'description': 'Go to bed and wake up around the same time every day, even on weekends, to regulate your body\'s internal clock. Aim for 7-9 hours of sleep.',
        'priority': 'High',
        'priorityColor': Colors.red.shade400,
      },
      {
        'title': 'Reduce Processed Sugar Intake',
        'description': 'Limit sugary drinks, desserts, and processed snacks. Opt for whole fruits to satisfy your sweet cravings.',
        'priority': 'Low',
        'priorityColor': Colors.green.shade400,
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Recommendations'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: recommendations.length,
        itemBuilder: (context, index) {
          final item = recommendations[index];
          return _RecommendationCard(
            title: item['title'],
            description: item['description'],
            priority: item['priority'],
            priorityColor: item['priorityColor'],
          );
        },
      ),
    );
  }
}

class _RecommendationCard extends StatelessWidget {
  final String title;
  final String description;
  final String priority;
  final Color priorityColor;

  const _RecommendationCard({
    required this.title,
    required this.description,
    required this.priority,
    required this.priorityColor,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: priorityColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    priority,
                    style: Theme.of(context).textTheme.labelMedium?.copyWith(
                          color: priorityColor,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              description,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
} 