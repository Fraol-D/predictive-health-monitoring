import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/services/auth_service.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context, listen: false);
    final textTheme = Theme.of(context).textTheme;
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              colorScheme.surface,
              colorScheme.surface.withOpacity(0.8),
            ],
          ),
        ),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(
                  Icons.health_and_safety_outlined,
                  size: 80,
                  color: colorScheme.primary,
                )
                    .animate()
                    .fade(duration: 500.ms)
                    .scale(delay: 200.ms),
                const SizedBox(height: 24),
                Text(
                  'Welcome to',
                  style: textTheme.headlineSmall?.copyWith(
                    color: colorScheme.onSurface.withOpacity(0.8),
                  ),
                ).animate().fade(delay: 400.ms).slideY(begin: 0.5, duration: 600.ms),
                Text(
                  'Predictive Health Monitoring',
                  textAlign: TextAlign.center,
                  style: textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: colorScheme.primary,
                  ),
                ).animate().fade(delay: 600.ms).slideY(begin: 0.5, duration: 600.ms),
                const SizedBox(height: 16),
                Text(
                  'Take control of your health with personalized insights and predictions.',
                  textAlign: TextAlign.center,
                  style: textTheme.bodyLarge?.copyWith(
                    color: colorScheme.onSurface.withOpacity(0.7),
                  ),
                ).animate().fade(delay: 800.ms),
                const SizedBox(height: 48),
                ElevatedButton.icon(
                  onPressed: () async {
                    await authService.signInWithGoogle();
                  },
                  icon: Image.asset('assets/icons/google_logo.png', height: 24.0),
                  label: const Text('Sign in with Google'),
                  style: ElevatedButton.styleFrom(
                    foregroundColor: colorScheme.onPrimary, 
                    backgroundColor: colorScheme.primary,
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    textStyle: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                )
                    .animate()
                    .fade(delay: 1000.ms)
                    .scale(duration: 400.ms, curve: Curves.elasticOut),
              ],
            ),
          ),
        ),
      ),
    );
  }
} 