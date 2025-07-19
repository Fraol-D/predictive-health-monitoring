import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data for notifications
    final List<Map<String, dynamic>> notifications = [
      {
        'icon': Icons.calendar_today_outlined,
        'title': 'Upcoming Appointment',
        'description': 'You have a check-up with Dr. Smith tomorrow at 10:00 AM.',
        'time': '1d ago',
        'color': Theme.of(context).colorScheme.primary,
      },
      {
        'icon': Icons.bar_chart_outlined,
        'title': 'New Report Available',
        'description': 'Your diabetes risk assessment from last week is ready to view.',
        'time': '3d ago',
        'color': Colors.green.shade400,
      },
      {
        'icon': Icons.lightbulb_outline,
        'title': 'New Recommendation',
        'description': 'Based on your recent activity, we suggest incorporating more cardio.',
        'time': '5d ago',
        'color': Colors.orange.shade400,
      },
      {
        'icon': Icons.task_alt_outlined,
        'title': 'Medication Reminder',
        'description': 'Don\'t forget to take your daily multivitamin.',
        'time': '7d ago',
        'color': Colors.blue.shade400,
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Notifications',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 20),
        ),
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: AppTheme.titleHeaderGradient,
          ),
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16.0),
        itemCount: notifications.length,
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final notification = notifications[index];
          return _NotificationCard(
            icon: notification['icon'],
            title: notification['title'],
            description: notification['description'],
            time: notification['time'],
            iconColor: notification['color'],
          );
        },
      ),
    );
  }
}

class _NotificationCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final String time;
  final Color iconColor;

  const _NotificationCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.time,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Text(
              time,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
} 