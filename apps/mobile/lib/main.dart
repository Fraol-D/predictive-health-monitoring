import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/theme_provider.dart';
import 'screens/home_screen.dart';
import 'screens/assessment/assessment_screen.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const MyAppEntry());
}

class MyAppEntry extends StatelessWidget {
  const MyAppEntry({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ThemeProvider(),
      child: const MyApp(),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      title: 'Predictive Health Monitoring',
      themeMode: themeProvider.themeMode,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      debugShowCheckedModeBanner: false,
      home: const HomeScreen(),
      routes: {
        AssessmentScreen.routeName: (ctx) => const AssessmentScreen(),
      },
    );
  }
}

// The MyHomePage and _MyHomePageState classes have been removed as they are replaced by HomeScreen.
