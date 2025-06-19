import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';
import 'package:predictive_health_monitoring/widgets/common/gradient_button.dart';
import 'package:predictive_health_monitoring/widgets/common/social_button.dart';
import 'package:predictive_health_monitoring/screens/auth/login_screen.dart';

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
    if (_passwordController.text.isEmpty || _emailController.text.isEmpty || _nameController.text.isEmpty) {
        setState(() {
            _errorMessage = "Please fill all fields.";
        });
        return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final credential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      await credential.user?.updateDisplayName(_nameController.text.trim());
      await credential.user?.sendEmailVerification();
      
      setState(() {
          _uiState = 'verifyEmail';
          _isLoading = false;
      });

    } on FirebaseAuthException catch (e) {
      setState(() {
        _errorMessage = e.message ?? 'An unknown error occurred.';
        _isLoading = false;
      });
    }
  }

  Future<void> _signUpWithGoogle() async {
    // Implement Google Sign-In logic here later
    // This should lead to the phone verification step.
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
              style: TextStyle(color: Theme.of(context).colorScheme.error, fontSize: 14),
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
          onPressed: _signupWithEmail,
          isLoading: _isLoading,
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
          onPressed: _signUpWithGoogle,
          // Add Google icon
        ),
        const SizedBox(height: 48.0),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("Already have an account?", style: Theme.of(context).textTheme.bodyMedium),
            TextButton(
              onPressed: () {
                 Navigator.of(context).pop();
              },
              child: Text('Log In', style: TextStyle(color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.bold)),
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
            Icon(Icons.email_outlined, size: 80, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 24),
            Text(
                'Verify Your Email',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
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
                onPressed: () {
                    Navigator.of(context).pop();
                },
            ),
        ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: _uiState == 'register' ? _buildRegisterUI() : _buildVerifyEmailUI(),
        ),
      ),
    );
  }

  Widget _buildNameField() {
    return TextFormField(
      controller: _nameController,
      decoration: InputDecoration(
        labelText: 'Full Name',
        prefixIcon: Icon(Icons.person_outline, color: Theme.of(context).colorScheme.onSurfaceVariant),
      ),
    );
  }

  Widget _buildEmailField() {
    return TextFormField(
      controller: _emailController,
      decoration: InputDecoration(
        labelText: 'Email Address',
        prefixIcon: Icon(Icons.mail_outline, color: Theme.of(context).colorScheme.onSurfaceVariant),
      ),
      keyboardType: TextInputType.emailAddress,
    );
  }

  Widget _buildPasswordField() {
    return TextFormField(
      controller: _passwordController,
      decoration: InputDecoration(
        labelText: 'Password',
        prefixIcon: Icon(Icons.lock_outline, color: Theme.of(context).colorScheme.onSurfaceVariant),
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