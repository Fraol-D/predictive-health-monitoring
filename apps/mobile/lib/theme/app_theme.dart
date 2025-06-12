import 'package:flutter/material.dart';

class AppTheme {
  // Common Font Family
  static const String fontInter = 'Inter';

  // Light Theme Color Palette (from Web Globals)
  static const Color lightPrimary = Color.fromRGBO(0, 167, 157, 1); // Vibrant Teal
  static const Color lightAccent = Color.fromRGBO(255, 140, 66, 1); // Warm Orange
  static const Color lightBackground = Color.fromRGBO(249, 250, 251, 1); // #F9FAFB
  static const Color lightSurface = Color.fromRGBO(255, 255, 255, 1); // White (for cards)
  static const Color lightOnPrimary = Colors.white;
  static const Color lightOnAccent = Colors.white;
  static const Color lightOnBackground = Color.fromRGBO(51, 51, 51, 1); // Dark Charcoal
  static const Color lightOnSurface = Color.fromRGBO(51, 51, 51, 1); // Dark Charcoal (text on cards)
  static const Color lightBorder = Color.fromRGBO(229, 231, 235, 1); // gray-200
  static const Color lightMutedForeground = Color.fromRGBO(107, 114, 128, 1); // gray-500
  static const Color lightError = Color.fromRGBO(239, 68, 68, 1); // red-500
  static const Color lightSuccess = Color.fromRGBO(76, 175, 80, 1); // Green 500
  static const Color lightOnSuccess = Colors.white;

  // Dark Theme Color Palette (from Web Globals)
  static const Color darkPrimary = Color.fromRGBO(0, 188, 212, 1); // Bright Cyan
  static const Color darkAccent = Color.fromRGBO(167, 139, 250, 1); // Soft Purple
  static const Color darkBackground = Color.fromRGBO(26, 32, 44, 1); // Rich Dark Blue
  static const Color darkSurface = Color.fromRGBO(45, 55, 72, 1); // Darker Gray-Blue (for cards)
  static const Color darkOnPrimary = Color.fromRGBO(26, 32, 44, 1); // Rich Dark Blue (text on primary)
  static const Color darkOnAccent = Color.fromRGBO(26, 32, 44, 1); // Rich Dark Blue (text on accent)
  static const Color darkOnBackground = Color.fromRGBO(226, 232, 240, 1); // Light Gray/Off-White
  static const Color darkOnSurface = Color.fromRGBO(226, 232, 240, 1); // Light Gray (text on cards)
  static const Color darkBorder = Color.fromRGBO(75, 85, 99, 1); // gray-600
  static const Color darkMutedForeground = Color.fromRGBO(156, 163, 175, 1); // gray-400
  static const Color darkError = Color.fromRGBO(185, 28, 28, 1); // red-700
  static const Color darkSuccess = Color.fromRGBO(129, 199, 132, 1); // Green 300
  static const Color darkOnSuccess = Color.fromRGBO(26, 32, 44, 1); // Rich Dark Blue (text on success)
  
  // Consistent Border Radius (based on web's rounded-xl, often 0.75rem or 1rem)
  static final BorderRadius _borderRadius = BorderRadius.circular(12.0); // e.g., 12px

  static ThemeData get lightTheme {
    return ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
      fontFamily: fontInter,
      colorScheme: const ColorScheme.light(
        primary: lightPrimary,
        secondary: lightAccent,
        surface: lightSurface, // For card backgrounds etc.
        onPrimary: lightOnPrimary,
        onSecondary: lightOnAccent,
        onSurface: lightOnSurface, // Text on cards/surfaces
        error: lightError,
        onError: Colors.white,
        tertiary: lightSuccess, 
        onTertiary: lightOnSuccess,
        outline: lightBorder,
        surfaceContainerHighest: Color.fromRGBO(240, 240, 240, 1), // Example: maps to web --secondary
        onSurfaceVariant: lightMutedForeground, // For muted text
    ),
    scaffoldBackgroundColor: lightBackground,
    cardTheme: CardThemeData(
      elevation: 0,
        color: lightSurface, // Solid color for non-glassmorphic cards
        surfaceTintColor: Colors.transparent, // Important for M3 card behavior
        shape: RoundedRectangleBorder(borderRadius: _borderRadius),
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: lightBackground,
        foregroundColor: lightOnBackground,
      elevation: 0,
      centerTitle: true,
        titleTextStyle: TextStyle(fontFamily: fontInter, fontSize: 20, fontWeight: FontWeight.w600, color: lightOnBackground),
      ),
      textTheme: _buildTextTheme(baseFontColor: lightOnBackground, mutedFontColor: lightMutedForeground),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
          backgroundColor: lightPrimary,
          foregroundColor: lightOnPrimary,
        elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16), // Increased vertical padding
          shape: RoundedRectangleBorder(borderRadius: _borderRadius),
          textStyle: const TextStyle(fontFamily: fontInter, fontWeight: FontWeight.w600, fontSize: 16),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: lightPrimary,
          side: const BorderSide(color: lightPrimary, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: _borderRadius),
          textStyle: const TextStyle(fontFamily: fontInter, fontWeight: FontWeight.w600, fontSize: 16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
        fillColor: lightSurface, // Or a slightly different shade like Color.fromRGBO(243, 244, 246, 1) (web --muted)
        hintStyle: TextStyle(color: lightMutedForeground.withOpacity(0.8)),
      border: OutlineInputBorder(
          borderRadius: _borderRadius,
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: BorderSide(color: lightBorder.withOpacity(0.5)), // Subtle border
      ),
      focusedBorder: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: const BorderSide(color: lightPrimary, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    ),
      dividerTheme: DividerThemeData(
        color: lightBorder.withOpacity(0.7),
        thickness: 1,
      ),
      iconTheme: const IconThemeData(color: lightOnSurface),
      primaryIconTheme: const IconThemeData(color: lightPrimary),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
      fontFamily: fontInter,
      colorScheme: const ColorScheme.dark(
        primary: darkPrimary,
        secondary: darkAccent,
        surface: darkSurface,
        onPrimary: darkOnPrimary,
        onSecondary: darkOnAccent,
        onSurface: darkOnSurface,
        error: darkError,
        onError: Colors.black, // Or a light color depending on error bg
        tertiary: darkSuccess,
        onTertiary: darkOnSuccess,
        outline: darkBorder,
        surfaceContainerHighest: Color.fromRGBO(55, 65, 81, 1), // Example: maps to web dark --secondary
        onSurfaceVariant: darkMutedForeground, // For muted text
    ),
    scaffoldBackgroundColor: darkBackground,
    cardTheme: CardThemeData(
      elevation: 0,
        color: darkSurface,
      surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: _borderRadius),
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: darkBackground,
        foregroundColor: darkOnBackground,
      elevation: 0,
      centerTitle: true,
        titleTextStyle: TextStyle(fontFamily: fontInter, fontSize: 20, fontWeight: FontWeight.w600, color: darkOnBackground),
      ),
      textTheme: _buildTextTheme(baseFontColor: darkOnBackground, mutedFontColor: darkMutedForeground),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
          backgroundColor: darkPrimary,
          foregroundColor: darkOnPrimary,
        elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: _borderRadius),
          textStyle: const TextStyle(fontFamily: fontInter, fontWeight: FontWeight.w600, fontSize: 16),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: darkPrimary,
          side: const BorderSide(color: darkPrimary, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: _borderRadius),
          textStyle: const TextStyle(fontFamily: fontInter, fontWeight: FontWeight.w600, fontSize: 16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
        fillColor: darkSurface, // Or a slightly different shade like Color.fromRGBO(55, 65, 81, 1) (web dark --muted)
        hintStyle: TextStyle(color: darkMutedForeground.withOpacity(0.8)),
      border: OutlineInputBorder(
          borderRadius: _borderRadius,
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: BorderSide(color: darkBorder.withOpacity(0.5)), // Subtle border
      ),
      focusedBorder: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: const BorderSide(color: darkPrimary, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    ),
      dividerTheme: DividerThemeData(
        color: darkBorder.withOpacity(0.7),
        thickness: 1,
      ),
      iconTheme: const IconThemeData(color: darkOnSurface),
      primaryIconTheme: const IconThemeData(color: darkPrimary),
    );
  }

  static TextTheme _buildTextTheme({required Color baseFontColor, required Color mutedFontColor}) {
    return TextTheme(
      // Display styles (Headlines)
      displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: baseFontColor, fontFamily: fontInter),
      displayMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: baseFontColor, fontFamily: fontInter),
      displaySmall: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: baseFontColor, fontFamily: fontInter),
      
      // Headline styles (Sub-headlines)
      headlineLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w600, color: baseFontColor, fontFamily: fontInter),
      headlineMedium: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: baseFontColor, fontFamily: fontInter),
      headlineSmall: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: baseFontColor, fontFamily: fontInter),
      
      // Title styles (Used for prominent text like app bar titles)
      titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: baseFontColor, fontFamily: fontInter), // Matches AppBar title
      titleMedium: TextStyle(fontSize: 18, fontWeight: FontWeight.w500, color: baseFontColor, fontFamily: fontInter),
      titleSmall: TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: baseFontColor, fontFamily: fontInter),
      
      // Body styles (Standard paragraph text)
      bodyLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.normal, color: baseFontColor, fontFamily: fontInter, height: 1.5),
      bodyMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.normal, color: baseFontColor, fontFamily: fontInter, height: 1.4),
      bodySmall: TextStyle(fontSize: 12, fontWeight: FontWeight.normal, color: mutedFontColor, fontFamily: fontInter, height: 1.3), // Muted for smaller body text

      // Label styles (Used for button text, captions)
      labelLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: baseFontColor, fontFamily: fontInter), // For main buttons
      labelMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: baseFontColor, fontFamily: fontInter),
      labelSmall: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: mutedFontColor, fontFamily: fontInter), // Muted for smaller labels
    );
  }
} 