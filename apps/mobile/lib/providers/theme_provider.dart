import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider with ChangeNotifier {
  static const String _themePrefsKey = 'themeMode';
  ThemeMode _themeMode = ThemeMode.system; // Default to system

  ThemeProvider() {
    _loadThemeMode();
  }

  ThemeMode get themeMode => _themeMode;

  // This getter reflects the explicit user choice or system default.
  // For actual brightness at runtime when in system mode, UI should use MediaQuery.platformBrightness.
  bool get isDarkMode {
    if (_themeMode == ThemeMode.system) {
      // This is a simplification for the provider. 
      // The actual brightness depends on the system setting if ThemeMode.system is active.
      // UI components should use WidgetsBinding.instance.window.platformBrightness or MediaQuery if they need the current system value.
      return WidgetsBinding.instance.platformDispatcher.platformBrightness == Brightness.dark;
    }
    return _themeMode == ThemeMode.dark;
  }

  Future<void> _loadThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    final themeIndex = prefs.getInt(_themePrefsKey);
    if (themeIndex != null && themeIndex >= 0 && themeIndex < ThemeMode.values.length) {
      _themeMode = ThemeMode.values[themeIndex];
    } else {
      _themeMode = ThemeMode.system; // Default if nothing saved or invalid value
    }
    notifyListeners();
  }

  Future<void> _saveThemeMode(ThemeMode mode) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setInt(_themePrefsKey, mode.index);
  }

  void setThemeMode(ThemeMode mode) {
    if (_themeMode != mode) {
      _themeMode = mode;
      _saveThemeMode(mode);
      notifyListeners();
    }
  }

  // Keeps the simple light/dark toggle, but persists the choice.
  // If current is system, it will toggle based on current system brightness to light/dark.
  void toggleTheme() {
    ThemeMode newMode;
    if (_themeMode == ThemeMode.light) {
      newMode = ThemeMode.dark;
    } else if (_themeMode == ThemeMode.dark) {
      newMode = ThemeMode.light;
    } else { // _themeMode == ThemeMode.system
      // When toggling from system, pick the opposite of current system brightness
      final currentSystemBrightness = WidgetsBinding.instance.platformDispatcher.platformBrightness;
      newMode = currentSystemBrightness == Brightness.dark ? ThemeMode.light : ThemeMode.dark;
    }
    setThemeMode(newMode);
  }

  // Keeps the cycle theme logic, useful for a three-way UI switch (Light, Dark, System)
  void cycleThemePreference() {
    ThemeMode newMode;
    if (_themeMode == ThemeMode.light) {
      newMode = ThemeMode.dark;
    } else if (_themeMode == ThemeMode.dark) {
      newMode = ThemeMode.system;
    } else { // _themeMode == ThemeMode.system
      newMode = ThemeMode.light;
    }
    setThemeMode(newMode);
  }
} 