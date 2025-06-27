import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/widgets/common/gradient_button.dart';
import 'package:provider/provider.dart';
import 'package:badges/badges.dart' as badges;
import '../providers/theme_provider.dart';
import '../theme/app_theme.dart';
import 'assessment/assessment_screen.dart';
import 'notifications_screen.dart';
import 'reports_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200.0,
            floating: false,
            pinned: true,
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
              Consumer<ThemeProvider>(
                builder: (context, themeProvider, child) {
                  return Switch(
                    value: themeProvider.isDarkMode,
                    onChanged: (value) {
                      themeProvider.toggleTheme();
                    },
                    activeColor: theme.colorScheme.onPrimary,
                  );
                },
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              title: Text('Dashboard', style: textTheme.titleLarge?.copyWith(fontSize: 20)),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.titleHeaderGradient,
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildListDelegate(
              [
                Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        'Welcome Back!',
                        style: textTheme.headlineMedium
                            ?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Ready to check in on your health?',
                        style: textTheme.bodyLarge,
                      ),
                      const SizedBox(height: 32),
                      GradientButton(
                        onPressed: () {
                          Navigator.pushNamed(
                              context, AssessmentScreen.routeName);
                        },
                        text: 'Start New Health Assessment',
                        gradient: AppTheme.titleHeaderGradient,
                      ),
                      const SizedBox(height: 24),
                      _buildHealthSummaryCard(context, textTheme),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHealthSummaryCard(BuildContext context, TextTheme textTheme) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Your Health At a Glance', style: textTheme.titleLarge),
            const SizedBox(height: 16),
            const ListTile(
              leading: Icon(Icons.favorite_border),
              title: Text('Overall Risk'),
              trailing: Text('Low',
                  style: TextStyle(
                      color: AppTheme.actionGreen,
                      fontWeight: FontWeight.bold)),
            ),
            const ListTile(
              leading: Icon(Icons.trending_up),
              title: Text('Recent Trend'),
              trailing: Text('Stable'),
            ),
          ],
        ),
      ),
    );
  }
} 