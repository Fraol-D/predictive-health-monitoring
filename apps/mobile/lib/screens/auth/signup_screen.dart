import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:predictive_health_monitoring/services/auth_service.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';
import 'package:predictive_health_monitoring/widgets/common/gradient_button.dart';
import 'package:predictive_health_monitoring/widgets/common/social_button.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;
  bool _showPassword = false;
  String _uiState = 'register'; // register, verifyEmail, verifyPhone

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _signupWithEmail() async {
    if (_passwordController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _nameController.text.isEmpty) {
        setState(() {
            _errorMessage = "Please fill all fields.";
        });
        return;
    }

    final authService = Provider.of<AuthService>(context, listen: false);

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final credential = await authService.createUserWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      // We are not using the credential directly, but you could if needed
      // For example, to link accounts or save user data to Firestore
      // For now, AuthGate will handle navigation after state change.
      
      setState(() {
        // This is a placeholder for email verification UI.
        // In a real app, you might navigate to a dedicated "please verify" screen
        // or handle it within the AuthGate.
          _uiState = 'verifyEmail';
          _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _signUpWithGoogle() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final userCredential = await authService.signInWithGoogle();
      if (userCredential != null) {
        // After Google sign-in, proceed to phone verification step
        setState(() {
          _uiState = 'verifyPhone';
          _isLoading = false;
        });
      } else {
        // User cancelled Google sign-in
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to sign up with Google. Please try again.';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: _buildCurrentUI(),
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentUI() {
    switch (_uiState) {
      case 'verifyEmail':
        return _buildVerifyEmailUI();
      case 'verifyPhone':
        return _buildVerifyPhoneUI();
      case 'register':
      default:
        return _buildRegisterUI();
    }
  }

  Widget _buildRegisterUI() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        const SizedBox(height: 60),
        Text(
          'Create Your Account',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.displaySmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.onBackground,
              ),
        ),
        const SizedBox(height: 8),
        Text(
          'Join to start your health journey.',
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
                  color: Theme.of(context).colorScheme.error, fontSize: 14),
              textAlign: TextAlign.center,
            ),
          ),
        _buildNameField(),
        const SizedBox(height: 16.0),
        _buildEmailField(),
        const SizedBox(height: 16.0),
        _buildPasswordField(),
        const SizedBox(height: 32.0),
        GradientButton(
          text: 'Register with Email',
          onPressed: _isLoading ? () {} : _signupWithEmail,
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
          text: 'Sign up with Google',
          onPressed: _isLoading ? null : () { _signUpWithGoogle(); },
        ),
        const SizedBox(height: 48.0),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("Already have an account?",
                style: Theme.of(context).textTheme.bodyMedium),
            TextButton(
              onPressed: () {
                 Navigator.of(context).pop();
              },
              child: Text('Log In',
                  style: TextStyle(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ],
    );
  }

    Widget _buildVerifyEmailUI() {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
        Icon(Icons.email_outlined,
            size: 80, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 24),
            Text(
                'Verify Your Email',
                textAlign: TextAlign.center,
          style: Theme.of(context)
              .textTheme
              .headlineMedium
              ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text(
                'A verification link has been sent to your email address. Please check your inbox and click the link to continue.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge,
            ),
             const SizedBox(height: 32),
            GradientButton(
                text: 'Back to Login',
          gradient: AppTheme.secondaryGradient,
          icon: Icons.arrow_back,
                onPressed: () {
                    Navigator.of(context).pop();
                },
            ),
        ],
    );
  }

  Widget _buildVerifyPhoneUI() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Icon(Icons.phone_android_outlined,
            size: 80, color: Theme.of(context).colorScheme.primary),
        const SizedBox(height: 24),
        Text(
          'Add Your Phone Number',
          textAlign: TextAlign.center,
          style: Theme.of(context)
              .textTheme
              .headlineMedium
              ?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        Text(
          'For your security, please add and verify your phone number for Multi-Factor Authentication (MFA).',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: 32.0),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Phone Number',
            prefixIcon: Icon(Icons.phone),
          ),
          keyboardType: TextInputType.phone,
        ),
        const SizedBox(height: 24.0),
        GradientButton(
          text: 'Send Verification Code',
          gradient: AppTheme.primaryGradient,
          icon: Icons.send,
          onPressed: () {
            // TODO: Implement phone number verification logic
            // This would involve calling a Firebase function or service
            // For now, we'll just simulate success and go back to login
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                content: Text(
                    'Phone verification not implemented yet. Returning to login.')));
            Navigator.of(context).pop();
          },
        ),
      ],
    );
  }

  Widget _buildNameField() {
    return TextFormField(
      controller: _nameController,
      decoration: InputDecoration(
        labelText: 'Full Name',
        prefixIcon: Icon(Icons.person_outline,
            color: Theme.of(context).colorScheme.onSurfaceVariant),
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