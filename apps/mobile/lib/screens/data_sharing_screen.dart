import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';
import 'package:predictive_health_monitoring/widgets/common/gradient_button.dart';

class DataSharingScreen extends StatefulWidget {
  const DataSharingScreen({super.key});

  @override
  State<DataSharingScreen> createState() => _DataSharingScreenState();
}

class _DataSharingScreenState extends State<DataSharingScreen> {
  bool _shareDemographics = true;
  bool _shareDiet = true;
  bool _shareLifestyle = true;
  bool _shareMedicalHistory = true;
  bool _consentGiven = false;

  void _shareData() {
    if (!_consentGiven) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please provide consent to share your data.')),
      );
      return;
    }

    // Simulate data sharing
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Data shared successfully with your healthcare provider.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Share Health Data'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Select Data to Share',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            _buildShareToggle(
              title: 'Demographics',
              value: _shareDemographics,
              onChanged: (value) => setState(() => _shareDemographics = value),
            ),
            _buildShareToggle(
              title: 'Diet Information',
              value: _shareDiet,
              onChanged: (value) => setState(() => _shareDiet = value),
            ),
            _buildShareToggle(
              title: 'Lifestyle Habits',
              value: _shareLifestyle,
              onChanged: (value) => setState(() => _shareLifestyle = value),
            ),
            _buildShareToggle(
              title: 'Medical History',
              value: _shareMedicalHistory,
              onChanged: (value) => setState(() => _shareMedicalHistory = value),
            ),
            const SizedBox(height: 32),
            _buildConsentToggle(),
            const SizedBox(height: 32),
            GradientButton(
              text: 'Save Preferences',
              onPressed: () {
                // TODO: Implement save logic
              },
              gradient: AppTheme.actionButtonGradient,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShareToggle({required String title, required bool value, required ValueChanged<bool> onChanged}) {
    return SwitchListTile.adaptive(
      title: Text(title),
      value: value,
      onChanged: onChanged,
      activeColor: Theme.of(context).colorScheme.primary,
    );
  }

  Widget _buildConsentToggle() {
    return CheckboxListTile(
      title: const Text('I consent to share the selected health data with my healthcare provider.'),
      value: _consentGiven,
      onChanged: (value) {
        if (value != null) {
          setState(() => _consentGiven = value);
        }
      },
      controlAffinity: ListTileControlAffinity.leading,
    );
  }
} 