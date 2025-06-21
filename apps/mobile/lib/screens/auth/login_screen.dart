import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:predictive_health_monitoring/services/auth_service.dart';
import 'package:predictive_health_monitoring/screens/auth/signup_screen.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';
import 'package:predictive_health_monitoring/widgets/common/gradient_button.dart';
import 'package:predictive_health_monitoring/widgets/common/social_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;
  bool _showPassword = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _loginWithEmail(BuildContext context) async {
    final authService = Provider.of<AuthService>(context, listen: false);
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await authService.signInWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      // AuthGate will handle navigation
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _signInWithGoogle(BuildContext context) async {
    final authService = Provider.of<AuthService>(context, listen: false);
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      await authService.signInWithGoogle();
      // AuthGate will handle navigation
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to sign in with Google. Please try again.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _resetPassword(BuildContext context) async {
    final authService = Provider.of<AuthService>(context, listen: false);
    final emailController = TextEditingController();

    return showDialog<void>(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          title: const Text('Reset Password'),
          content: TextField(
            controller: emailController,
            decoration: const InputDecoration(hintText: "Enter your email"),
            keyboardType: TextInputType.emailAddress,
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(dialogContext).pop();
              },
            ),
            TextButton(
              child: const Text('Send Link'),
              onPressed: () async {
                if (emailController.text.trim().isEmpty) {
                  // Optionally show an error in the dialog
                  return;
                }
                try {
                  await authService.sendPasswordResetEmail(
                      email: emailController.text.trim());
                  Navigator.of(dialogContext).pop();
                  // Show a confirmation snackbar
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Password reset link sent to your email.')),
                  );
                } catch (e) {
                  Navigator.of(dialogContext).pop();
                  setState(() {
                    _errorMessage = e.toString();
                  });
                }
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              const SizedBox(height: 60),
              Text(
                'Welcome Back',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onBackground,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                'Log in to access your dashboard.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
              const SizedBox(height: 48.0),
              if (_errorMessage != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: Text(
                    _errorMessage!,
                    style: TextStyle(
                        color: Theme.of(context).colorScheme.error,
                        fontSize: 14),
                    textAlign: TextAlign.center,
                  ),
                ),
              _buildEmailField(),
              const SizedBox(height: 16.0),
              _buildPasswordField(),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => _resetPassword(context),
                  child: Text(
                    'Forgot password?',
                    style: TextStyle(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 24.0),
              GradientButton(
                text: 'Log In with Email',
                onPressed: _isLoading ? () {} : () => _loginWithEmail(context),
                gradient: AppTheme.secondaryGradient,
                icon: Icons.email,
              ),
              const SizedBox(height: 24.0),
              const Row(
                children: [
                  Expanded(child: Divider()),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child: Text('OR'),
                  ),
                  Expanded(child: Divider()),
                ],
              ),
              const SizedBox(height: 24.0),
              SocialButton(
                text: 'Sign in with Google',
                onPressed: () => _signInWithGoogle(context),
                // Add Google icon
              ),
              const SizedBox(height: 48.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Don't have an account?",
                      style: Theme.of(context).textTheme.bodyMedium),
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) => const SignupScreen()));
                    },
                    child: Text('Sign Up',
                        style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmailField() {
    return TextFormField(
      controller: _emailController,
      decoration: InputDecoration(
        labelText: 'Email Address',
        prefixIcon: Icon(Icons.mail_outline,
            color: Theme.of(context).colorScheme.onSurfaceVariant),
      ),
      keyboardType: TextInputType.emailAddress,
    );
  }

  Widget _buildPasswordField() {
    return TextFormField(
      controller: _passwordController,
      decoration: InputDecoration(
        labelText: 'Password',
        prefixIcon: Icon(Icons.lock_outline,
            color: Theme.of(context).colorScheme.onSurfaceVariant),
        suffixIcon: IconButton(
          icon: Icon(
            _showPassword ? Icons.visibility_off : Icons.visibility,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          onPressed: () {
            setState(() {
              _showPassword = !_showPassword;
            });
          },
        ),
      ),
      obscureText: !_showPassword,
    );
  }
} 