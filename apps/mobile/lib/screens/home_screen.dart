import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';
import 'assessment/assessment_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  Widget _buildThemeToggleButton(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
    // Listen to themeProvider.themeMode to rebuild the icon when the mode changes
    final currentMode = Provider.of<ThemeProvider>(context).themeMode;

    IconData icon;
    String tooltip;

    switch (currentMode) {
      case ThemeMode.light:
        icon = Icons.light_mode;
        tooltip = 'Switch to Dark Mode';
        break;
      case ThemeMode.dark:
        icon = Icons.dark_mode;
        tooltip = 'Switch to System Default';
        break;
      case ThemeMode.system:
      default:
        icon = Icons.brightness_auto;
        tooltip = 'Switch to Light Mode';
        break;
    }

    return IconButton(
      icon: Icon(icon),
      tooltip: tooltip,
      onPressed: () {
        themeProvider.cycleThemePreference();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Predictive Health',
          style: TextStyle( // Ensuring AppBar title uses the theme's foreground color explicitly if needed
            color: theme.colorScheme.onSurface, // Or theme.appBarTheme.titleTextStyle?.color
            fontWeight: theme.appBarTheme.titleTextStyle?.fontWeight ?? FontWeight.w600,
            fontSize: theme.appBarTheme.titleTextStyle?.fontSize ?? 20,
          )
        ),
        actions: [
          _buildThemeToggleButton(context),
          IconButton(
            icon: const Icon(Icons.person_outline),
            tooltip: 'Profile',
            onPressed: () {
              // TODO: Navigate to profile
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Hero Section
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface.withOpacity(0.85), // Slight transparency for glassmorphism
                    borderRadius: BorderRadius.circular(16), // Consistent with AppTheme._borderRadius
                    border: Border.all(color: theme.colorScheme.outline.withOpacity(0.2)), // Subtle border
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
                      theme.colorScheme.error,
                      '2 days ago',
                    ),
                    _buildAssessmentCard(
                    context,
                      'Heart Disease Risk',
                      'Low Risk (30%)',
                      theme.colorScheme.tertiary, // Updated to use the new success color from ColorScheme
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
                      theme.colorScheme.primaryContainer,
                      Icons.history,
                    ),
                    _buildExploreCard(
                      context,
                      'Get Recommendations',
                      'Personalized advice for a healthier you',
                      theme.colorScheme.secondaryContainer,
                      Icons.health_and_safety,
                    ),
                    _buildExploreCard(
                    context,
                      'AI Health Assistant',
                      'Chat directly with our AI',
                      theme.colorScheme.tertiaryContainer,
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
        color: theme.colorScheme.surface.withOpacity(0.85), // Slight transparency
        borderRadius: BorderRadius.circular(16), // Consistent with AppTheme._borderRadius
        border: Border.all(color: theme.colorScheme.outline.withOpacity(0.2)), // Subtle border
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
        color: theme.colorScheme.surface.withOpacity(0.85), // Slight transparency
        borderRadius: BorderRadius.circular(16), // Consistent with AppTheme._borderRadius
        border: Border.all(color: theme.colorScheme.outline.withOpacity(0.2)), // Subtle border
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