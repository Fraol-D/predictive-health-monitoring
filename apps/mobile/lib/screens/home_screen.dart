import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/theme_provider.dart';
import 'assessment/assessment_screen.dart';
import '../theme/app_theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Predictive Health',
                      style: theme.textTheme.displaySmall?.copyWith(
                        foreground: Paint()
                          ..shader = LinearGradient(
                            colors: [
                              AppTheme.primaryPurple,
                              AppTheme.primaryPink,
                            ],
                          ).createShader(const Rect.fromLTWH(0.0, 0.0, 200.0, 70.0)),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.person_outline),
                      onPressed: () {
                        // TODO: Navigate to profile
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Hero Section
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: theme.shadowColor.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Text(
                        'Take Control of Your Health',
                        style: theme.textTheme.displayMedium,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Assess your chronic disease risks and get personalized insights.',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.7),
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pushNamed(context, AssessmentScreen.routeName);
                        },
                        child: const Text('Start Assessment'),
                      ),
                    ],
                  ),
            ),
                const SizedBox(height: 32),

                // Recent Assessments
            Text(
                  'Recent Assessments',
                  style: theme.textTheme.displaySmall,
            ),
                const SizedBox(height: 16),
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 0.8,
              children: [
                    _buildAssessmentCard(
                      context,
                      'Diabetes Risk',
                      'Medium Risk (65%)',
                      AppTheme.warning,
                      '2 days ago',
                    ),
                    _buildAssessmentCard(
                    context,
                      'Heart Disease Risk',
                      'Low Risk (30%)',
                      AppTheme.success,
                      '1 week ago',
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // Explore Section
                Text(
                  'Explore',
                  style: theme.textTheme.displaySmall,
                ),
                const SizedBox(height: 16),
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 1.2,
                  children: [
                    _buildExploreCard(
                      context,
                      'View Full History',
                      'Track your progress over time',
                      AppTheme.accentIndigo,
                      Icons.history,
                    ),
                    _buildExploreCard(
                      context,
                      'Get Recommendations',
                      'Personalized advice for a healthier you',
                      AppTheme.accentTeal,
                      Icons.health_and_safety,
                    ),
                    _buildExploreCard(
                    context,
                      'AI Health Assistant',
                      'Chat directly with our AI',
                      AppTheme.accentGreen,
                      Icons.chat,
              ),
                  ],
            ),
          ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAssessmentCard(
    BuildContext context,
    String title,
    String risk,
    Color riskColor,
    String timeAgo,
  ) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: theme.shadowColor.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
          Text(
            title,
            style: theme.textTheme.titleLarge,
            ),
          const SizedBox(height: 8),
          Text(
            timeAgo,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.6),
            ),
          ),
          const Spacer(),
          Text(
            risk,
            style: theme.textTheme.titleLarge?.copyWith(
              color: riskColor,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
            child: ElevatedButton(
                onPressed: () {
                // TODO: Navigate to report
                },
              child: const Text('View Report'),
              ),
            ),
          ],
      ),
    );
  }

  Widget _buildExploreCard(
    BuildContext context,
    String title,
    String subtitle,
    Color color,
    IconData icon,
  ) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: theme.shadowColor.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
          Icon(
            icon,
            size: 32,
            color: color,
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: theme.textTheme.titleMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.6),
            ),
            textAlign: TextAlign.center,
          ),
            ],
      ),
    );
  }
} 