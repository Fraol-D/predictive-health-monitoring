import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/models/user_profile.dart';
import 'package:predictive_health_monitoring/screens/data_sharing_screen.dart';
import 'package:predictive_health_monitoring/screens/edit_profile_screen.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';
import 'package:provider/provider.dart';
import 'package:predictive_health_monitoring/services/auth_service.dart';
import 'package:predictive_health_monitoring/screens/notifications_screen.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Future<UserProfile?> _userProfileFuture;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _userProfileFuture = _fetchUserProfile();
      setState(() {});
    });
  }

  Future<UserProfile?> _fetchUserProfile() async {
    final user = Provider.of<AuthService>(context, listen: false).currentUser;
    if (user == null) return null;

    try {
      final response = await http.get(
          Uri.parse('http://10.0.2.2:3001/api/users/firebase/${user.uid}'));
      if (response.statusCode == 200) {
        return UserProfile.fromJson(jsonDecode(response.body));
      } else if (response.statusCode == 404) {
        return UserProfile(
          firebaseUID: user.uid,
          name: user.displayName ?? 'New User',
          email: user.email!,
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load profile: ${e.toString()}')));
    }
    return null;
  }

  void _navigateToEditProfile() async {
    final result = await Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => const EditProfileScreen()),
    );

    if (result == true) {
      setState(() {
        _userProfileFuture = _fetchUserProfile();
      });
    }
  }

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
                  onTap: _navigateToEditProfile,
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
                    await Provider.of<AuthService>(context, listen: false)
                        .signOut();
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

    return FutureBuilder<UserProfile?>(
      future: _userProfileFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError || !snapshot.hasData) {
          return const Center(child: Text('Could not load profile.'));
        }

        final profile = snapshot.data!;
        final initials = profile.name.isNotEmpty
            ? profile.name.split(' ').map((e) => e[0]).take(2).join()
            : 'NU';

        return Column(
          children: [
            CircleAvatar(
              radius: 50,
              backgroundColor: colorScheme.primaryContainer,
              backgroundImage: (profile.profileImage != null &&
                      profile.profileImage!.isNotEmpty)
                  ? NetworkImage(profile.profileImage!)
                  : null,
              child: (profile.profileImage == null ||
                      profile.profileImage!.isEmpty)
                  ? Text(
                      initials.toUpperCase(),
                      style: textTheme.displaySmall
                          ?.copyWith(color: colorScheme.onPrimaryContainer),
                    )
                  : null,
            ),
            const SizedBox(height: 16),
            Text(
              profile.name,
              style: textTheme.headlineSmall,
            ),
            Text(
              profile.email,
              style: textTheme.bodyMedium,
            ),
          ],
        );
      },
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
