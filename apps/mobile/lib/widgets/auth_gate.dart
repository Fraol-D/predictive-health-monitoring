import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:predictive_health_monitoring/screens/auth/login_screen.dart';
import 'package:predictive_health_monitoring/screens/auth/signup_screen.dart';
import 'package:predictive_health_monitoring/screens/home_screen.dart';
import 'package:provider/provider.dart';
import 'package:predictive_health_monitoring/services/auth_service.dart';

class AuthGate extends StatefulWidget {
  const AuthGate({Key? key}) : super(key: key);

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  bool _showLoginPage = true;

  void _toggleScreen() {
    setState(() {
      _showLoginPage = !_showLoginPage;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context, listen: false);

    return StreamBuilder<User?>(
      stream: authService.authStateChanges,
      builder: (context, snapshot) {
        // User is not logged in
        if (!snapshot.hasData) {
          if (_showLoginPage) {
            return LoginScreen(onSignup: _toggleScreen);
          } else {
            return SignupScreen(onLogin: _toggleScreen);
          }
        }

        // User is logged in
        return const HomeScreen();
      },
    );
  }
} 