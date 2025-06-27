import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/screens/data_sharing_screen.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';
import 'package:provider/provider.dart';
import 'package:predictive_health_monitoring/services/auth_service.dart';
import 'package:predictive_health_monitoring/screens/notifications_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Profile',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 20),
        ),
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: AppTheme.titleHeaderGradient,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildProfileHeader(context),
            const SizedBox(height: 32),
            _buildSection(
              context,
              title: 'Health Management',
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
              title: 'Account & Settings',
              children: [
                _buildListTile(
                  context,
                  icon: Icons.person_outline,
                  title: 'Account Details',
                  onTap: () {},
                ),
                _buildListTile(
                  context,
                  icon: Icons.notifications_outlined,
                  title: 'Notifications',
                  onTap: () {
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => const NotificationsScreen()));
                  },
                ),
                _buildListTile(
                  context,
                  icon: Icons.share_outlined,
                  title: 'Data Sharing & Consent',
                  onTap: () {
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => const DataSharingScreen()));
                  },
                ),
                 _buildListTile(
                  context,
                  icon: Icons.logout,
                  title: 'Sign Out',
                  onTap: () async {
                    await Provider.of<AuthService>(context, listen: false).signOut();
                  },
                ),
              ],
            ),
             const SizedBox(height: 24),
             Padding(
               padding: const EdgeInsets.symmetric(horizontal: 16.0),
               child: Text(
                 'Version 1.0.0',
                 textAlign: TextAlign.center,
                 style: theme.textTheme.bodySmall,
               ),
             )
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      children: [
        CircleAvatar(
          radius: 50,
          backgroundColor: colorScheme.primaryContainer,
          child: Text(
            'JD', // Placeholder initials
            style: textTheme.displaySmall?.copyWith(color: colorScheme.onPrimaryContainer),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'John Doe', // Placeholder name
          style: textTheme.headlineSmall,
        ),
        Text(
          'john.doe@example.com', // Placeholder email
          style: textTheme.bodyMedium,
        ),
      ],
    );
  }

  Widget _buildSection(BuildContext context,
      {required String title, required List<Widget> children}) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title.toUpperCase(),
            style: theme.textTheme.labelLarge?.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.6),
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
      ),
    );
  }

  Widget _buildListTile(BuildContext context,
      {required IconData icon, required String title, VoidCallback? onTap}) {
    final theme = Theme.of(context);
    return ListTile(
      leading: Icon(icon, color: theme.colorScheme.primary),
      title: Text(title, style: theme.textTheme.titleMedium),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
} 