import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';
import 'package:predictive_health_monitoring/providers/theme_provider.dart';
import 'package:predictive_health_monitoring/screens/home_screen.dart';
import 'package:predictive_health_monitoring/widgets/auth_gate.dart';
import 'screens/assessment/assessment_screen.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:predictive_health_monitoring/services/auth_service.dart';
import 'package:predictive_health_monitoring/widgets/auth/auth_wrapper.dart';
import 'package:predictive_health_monitoring/firebase_options.dart';

// The firebase_options.dart file is no longer used, we will use .env for secrets.
// import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load environment variables from the .env file
  await dotenv.load(fileName: ".env");

  // Initialize Firebase with options from environment variables
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Create and initialize the provider
  final themeProvider = ThemeProvider();
  // The constructor now handles loading, but let's ensure it's ready if needed,
  // although constructor cannot be async. The loading is "fire and forget".
  // The UI will update once `_loadThemeMode` completes.

  // Set up providers
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: themeProvider), // Use .value for existing instance
        Provider<AuthService>(create: (_) => AuthService()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      title: 'Predictive Health Monitoring',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeProvider.themeMode,
      debugShowCheckedModeBanner: false,
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''), // English, no country code
      ],
      home: const AuthGate(), // Use AuthGate to handle auth state
    );
  }
}

// The MyHomePage and _MyHomePageState classes have been removed as they are replaced by HomeScreen.
