import 'package:flutter/material.dart';
import 'package:badges/badges.dart' as badges;
import 'package:predictive_health_monitoring/screens/notifications_screen.dart';
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
        'priority': 'High Risk',
      },
      {
        'title': 'Incorporate More Leafy Greens',
        'description': 'Add spinach, kale, or other leafy greens to at least one meal daily to boost your intake of vitamins K, A, and C.',
        'priority': 'Medium',
      },
      {
        'title': 'Practice Mindful Eating',
        'description': 'Pay attention to your body\'s hunger cues. Eat slowly and savor your food to improve digestion and prevent overeating.',
        'priority': 'Medium',
      },
      {
        'title': 'Establish a Consistent Sleep Schedule',
        'description': 'Go to bed and wake up around the same time every day, even on weekends, to regulate your body\'s internal clock. Aim for 7-9 hours of sleep.',
        'priority': 'High',
      },
      {
        'title': 'Reduce Processed Sugar Intake',
        'description': 'Limit sugary drinks, desserts, and processed snacks. Opt for whole fruits to satisfy your sweet cravings.',
        'priority': 'Low',
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Advice',
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
      body: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: recommendations.length,
        itemBuilder: (context, index) {
          final item = recommendations[index];
          return _RecommendationCard(
            title: item['title'],
            description: item['description'],
            priority: item['priority'],
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

  const _RecommendationCard({
    required this.title,
    required this.description,
    required this.priority,
  });

  Color _getPriorityColor(BuildContext context, String priority) {
    final theme = Theme.of(context);
    switch (priority) {
      case 'High Risk':
      case 'High':
        return theme.colorScheme.error;
      case 'Medium':
        return theme.colorScheme.secondary;
      case 'Low':
      default:
        return AppTheme.actionGreen;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final priorityColor = _getPriorityColor(context, priority);

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: theme.textTheme.titleLarge,
                    softWrap: true,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: priorityColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    priority,
                    style: theme.textTheme.labelMedium?.copyWith(
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
              style: theme.textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
} 