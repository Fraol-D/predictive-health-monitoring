import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:predictive_health_monitoring/providers/theme_provider.dart';
import 'package:predictive_health_monitoring/screens/assessment/assessment_screen.dart';
import 'package:predictive_health_monitoring/screens/reports_screen.dart';
import 'package:predictive_health_monitoring/widgets/common/gradient_button.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: themeProvider.isDarkMode
                ? [Colors.black, Colors.grey[850]!]
                : [Colors.white, Colors.grey[200]!],
          ),
      ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
                Align(
                  alignment: Alignment.topRight,
                  child: IconButton(
                    icon: Icon(
                      themeProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    onPressed: () => themeProvider.toggleTheme(),
                  ),
                ),
                const Spacer(),
                Text(
                  'Predictive Health',
                  textAlign: TextAlign.center,
                  style: textTheme.headlineLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Your personal AI health assistant',
                  textAlign: TextAlign.center,
                  style: textTheme.titleMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
                ),
                const Spacer(flex: 2),
                GradientButton(
                  text: 'Start Health Assessment',
                  gradient: AppTheme.primaryGradient,
              onPressed: () {
                Navigator.pushNamed(context, AssessmentScreen.routeName);
              },
                  icon: Icons.assignment_turned_in_outlined,
                ),
                const SizedBox(height: 20),
                OutlinedButton.icon(
                  icon: const Icon(Icons.bar_chart_outlined),
                  label: const Text('View Full Report'),
                  onPressed: () {
                     Navigator.of(context).push(MaterialPageRoute(builder: (context) => const ReportsScreen()));
                  },
                   style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const Spacer(flex: 3),
          ],
            ),
          ),
        ),
      ),
    );
  }
} 