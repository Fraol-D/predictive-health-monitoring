import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/widgets/common/gradient_button.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildProfileHeader(context),
            const SizedBox(height: 32),
            _buildSection(
              context,
              title: 'Assessment History',
              children: [
                _buildListTile(
                  context,
                  icon: Icons.bar_chart_outlined,
                  title: 'View All Reports',
                  onTap: () {},
                ),
                _buildListTile(
                  context,
                  icon: Icons.calendar_today_outlined,
                  title: 'Schedule New Assessment',
                  onTap: () {},
                ),
              ],
            ),
            const SizedBox(height: 24),
            _buildSection(
              context,
              title: 'Settings',
              children: [
                _buildListTile(
                  context,
                  icon: Icons.person_outline,
                  title: 'Account Details',
                  onTap: () {},
                ),
                _buildSwitchTile(
                  context,
                  icon: Icons.share_outlined,
                  title: 'Anonymous Data Sharing',
                  subtitle: 'Help improve our prediction models',
                  value: true, // Mock value
                  onChanged: (value) {},
                ),
              ],
            ),
            const SizedBox(height: 40),
            GradientButton(
              text: 'Sign Out',
              onPressed: () {
                // TODO: Implement sign out logic
              },
              gradient: LinearGradient(
                colors: [
                  Colors.grey.shade600,
                  Colors.grey.shade800,
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return Column(
      children: [
        const CircleAvatar(
          radius: 50,
          // backgroundImage: NetworkImage('URL_TO_USER_IMAGE'), // Placeholder
          backgroundColor: Colors.grey,
          child: Icon(Icons.person, size: 50, color: Colors.white),
        ),
        const SizedBox(height: 16),
        Text(
          'John Doe', // Placeholder name
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        Text(
          'john.doe@example.com', // Placeholder email
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    );
  }

  Widget _buildSection(BuildContext context, {required String title, required List<Widget> children}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title.toUpperCase(),
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
              ),
        ),
        const SizedBox(height: 8),
        Card(
          clipBehavior: Clip.antiAlias,
          child: Column(
            children: children,
          ),
        ),
      ],
    );
  }

  Widget _buildListTile(BuildContext context, {required IconData icon, required String title, VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: Theme.of(context).colorScheme.primary),
      title: Text(title, style: Theme.of(context).textTheme.titleMedium),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }

  Widget _buildSwitchTile(BuildContext context, {required IconData icon, required String title, required String subtitle, required bool value, required ValueChanged<bool> onChanged}) {
    return SwitchListTile(
      secondary: Icon(icon, color: Theme.of(context).colorScheme.primary),
      title: Text(title, style: Theme.of(context).textTheme.titleMedium),
      subtitle: Text(subtitle, style: Theme.of(context).textTheme.bodySmall),
      value: value,
      onChanged: onChanged,
      activeColor: Theme.of(context).colorScheme.primary,
    );
  }
} 