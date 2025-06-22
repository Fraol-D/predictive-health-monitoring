import 'package:flutter/material.dart';

class DataSharingScreen extends StatefulWidget {
  const DataSharingScreen({super.key});

  @override
  State<DataSharingScreen> createState() => _DataSharingScreenState();
}

class _DataSharingScreenState extends State<DataSharingScreen> {
  // Using a map for easier state management
  final Map<String, bool> _shareOptions = {
    'Demographics': true,
    'Diet Information': true,
    'Lifestyle Habits': true,
    'Medical History & Symptoms': true,
    'Vital Signs': false, // Default to off for more sensitive data
  };
  bool _consentGiven = false;
  bool _isSharing = false;

  void _shareData() async {
    if (!_consentGiven) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Please provide consent to share your data.'),
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
      return;
    }

    setState(() => _isSharing = true);

    // Simulate a network call to share data
    await Future.delayed(const Duration(seconds: 2));

    setState(() => _isSharing = false);

    // Show a confirmation dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sharing Successful'),
        content: const Text('Your selected health data has been securely shared with your registered healthcare provider.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog
              Navigator.of(context).pop(); // Go back from sharing screen
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Share Health Data'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.share_outlined, size: 48, color: theme.colorScheme.primary),
            const SizedBox(height: 16),
            Text(
              'Share with Your Provider',
              style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Select the categories of health data you wish to share. This information will be sent securely to your healthcare provider to help them better understand your health status.',
              style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
            ),
            const SizedBox(height: 24),
            Text(
              'DATA CATEGORIES',
              style: theme.textTheme.labelLarge?.copyWith(color: theme.colorScheme.onSurfaceVariant),
            ),
            const Divider(height: 24),
            ..._shareOptions.keys.map((title) {
              return SwitchListTile.adaptive(
                title: Text(title),
                value: _shareOptions[title]!,
                onChanged: (value) => setState(() => _shareOptions[title] = value),
                activeColor: theme.colorScheme.primary,
                contentPadding: EdgeInsets.zero,
              );
            }).toList(),
            const SizedBox(height: 32),
            _buildConsentToggle(theme),
            const SizedBox(height: 32),
            _buildShareButton(theme),
          ],
        ),
      ),
    );
  }

  Widget _buildConsentToggle(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(12),
      ),
      child: CheckboxListTile(
        title: Text(
          'I consent to share the selected health data with my healthcare provider for medical review.',
          style: theme.textTheme.bodyMedium,
        ),
        value: _consentGiven,
        onChanged: (value) {
          if (value != null) {
            setState(() => _consentGiven = value);
          }
        },
        controlAffinity: ListTileControlAffinity.leading,
        activeColor: theme.colorScheme.primary,
        contentPadding: EdgeInsets.zero,
      ),
    );
  }

  Widget _buildShareButton(ThemeData theme) {
    return SizedBox(
      width: double.infinity,
      child: FilledButton.icon(
        icon: _isSharing
            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
            : const Icon(Icons.shield_outlined),
        label: Text(_isSharing ? 'SHARING...' : 'Share Data Securely'),
        onPressed: _isSharing ? null : _shareData,
        style: FilledButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          backgroundColor: theme.colorScheme.primary,
          disabledBackgroundColor: theme.colorScheme.primary.withOpacity(0.5),
        ),
      ),
    );
  }
} 