// ignore_for_file: sort_child_properties_last

import 'package:flutter/material.dart';
import 'package:flutter_speed_dial/flutter_speed_dial.dart';
import 'package:predictive_health_monitoring/screens/assessment/assessment_screen.dart';
import 'package:predictive_health_monitoring/screens/chat_screen.dart';
import 'package:predictive_health_monitoring/screens/data_sharing_screen.dart';
import 'package:predictive_health_monitoring/screens/home_screen.dart';
import 'package:predictive_health_monitoring/screens/notifications_screen.dart';
import 'package:predictive_health_monitoring/screens/profile_screen.dart';
import 'package:predictive_health_monitoring/screens/recommendations_screen.dart';
import 'package:predictive_health_monitoring/screens/reports_screen.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  static final List<Widget> _widgetOptions = <Widget>[
    const HomeScreen(),
    const ReportsScreen(),
    const ChatScreen(),
    const RecommendationsScreen(),
    const ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Hide FAB on the chat screen (index 2)
    final bool showFab = _selectedIndex != 2;

    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _widgetOptions,
      ),
      floatingActionButton: showFab ? _buildFab() : null,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: Theme.of(context).colorScheme.surface,
        selectedItemColor: Theme.of(context).colorScheme.primary,
        unselectedItemColor: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
        elevation: 4.0,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.analytics_outlined),
            activeIcon: Icon(Icons.analytics),
            label: 'Reports',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline),
            activeIcon: Icon(Icons.chat_bubble),
            label: 'Chat',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.lightbulb_outline),
            activeIcon: Icon(Icons.lightbulb),
            label: 'Advice',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }

  Widget _buildFab() {
    return SpeedDial(
      buttonSize: const Size(56.0, 56.0),
      visible: true,
      curve: Curves.bounceIn,
      overlayColor: Colors.black,
      overlayOpacity: 0.5,
      tooltip: 'Quick Actions',
      heroTag: 'speed-dial-hero-tag',
      elevation: 8.0,
      child: Container(
        width: 56.0,
        height: 56.0,
        decoration: const BoxDecoration(
          gradient: AppTheme.titleHeaderGradient,
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.add, color: Colors.white),
      ),
      activeChild: Container(
        width: 56.0,
        height: 56.0,
        decoration: const BoxDecoration(
          gradient: AppTheme.titleHeaderGradient,
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.close, color: Colors.white),
      ),
      children: [
        SpeedDialChild(
          backgroundColor: AppTheme.actionGreen,
          label: 'Start New Assessment',
          labelStyle: const TextStyle(fontSize: 16.0),
          onTap: () => Navigator.of(context).pushNamed(AssessmentScreen.routeName),
          child: const Icon(Icons.health_and_safety_outlined),
        ),
        SpeedDialChild(
           backgroundColor: AppTheme.actionBlue,
          label: 'View Notifications',
          labelStyle: const TextStyle(fontSize: 16.0),
          onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (context) => const NotificationsScreen())),
          child: const Icon(Icons.notifications_outlined),
        ),
        SpeedDialChild(
          backgroundColor: Colors.orange,
          label: 'Share Health Data',
          labelStyle: const TextStyle(fontSize: 16.0),
          onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (context) => const DataSharingScreen())),
          child: const Icon(Icons.share_outlined),
        ),
      ],
    );
  }
} 