import 'package:flutter/material.dart';

class AppTheme {
  // Common Font Family
  // Using a system-safe font stack is often better than a single named font unless bundled.
  static const String fontSans = 'Inter'; // Assuming 'Inter' is bundled with the app

  // --- DARK THEME COLORS (from web globals.css) ---
  static const Color darkBackground = Color.fromRGBO(26, 32, 44, 1);       // Rich Dark Blue
  static const Color darkCard = Color.fromRGBO(45, 55, 72, 1);           // Darker Gray-Blue
  static const Color darkForeground = Color.fromRGBO(226, 232, 240, 1); // Light Gray/Off-White
  static const Color darkMutedForeground = Color.fromRGBO(156, 163, 175, 1); // gray-400
  static const Color darkBorder = Color.fromRGBO(75, 85, 99, 1);           // gray-600
  static const Color darkPrimary = Color.fromRGBO(0, 188, 212, 1);         // Bright Cyan
  static const Color darkAccent = Color.fromRGBO(167, 139, 250, 1);      // Soft Purple

  // --- LIGHT THEME COLORS (from web globals.css) ---
  static const Color lightBackground = Color.fromRGBO(249, 250, 251, 1); // Very Light Gray
  static const Color lightCard = Color.fromRGBO(255, 255, 255, 1);       // Pure White
  static const Color lightForeground = Color.fromRGBO(51, 51, 51, 1);      // Dark Charcoal
  static const Color lightMutedForeground = Color.fromRGBO(107, 114, 128, 1); // gray-500
  static const Color lightBorder = Color.fromRGBO(229, 231, 235, 1);     // gray-200
  static const Color lightPrimary = Color.fromRGBO(0, 167, 157, 1);       // Vibrant Teal
  static const Color lightAccent = Color.fromRGBO(255, 140, 66, 1);      // Warm Orange

  // --- GRADIENTS (from web globals.css .btn-gradient-*) ---
  // Note: Tailwind colors (e.g., purple-500) need to be mapped to hex.
  // These are standard Tailwind CSS color values.
  static const Color gradientPurple500 = Color(0xFF8B5CF6);
  static const Color gradientPink500 = Color(0xFFEC4899);
  static const Color gradientGreen500 = Color(0xFF22C55E);
  static const Color gradientBlue600 = Color(0xFF2563EB);

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [gradientGreen500, gradientBlue600],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  static const LinearGradient secondaryGradient = LinearGradient(
    colors: [gradientPurple500, gradientPink500],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  // Consistent Border Radius (from web globals.css --radius)
  static final BorderRadius _borderRadius = BorderRadius.circular(8.0); // 0.5rem is often 8px

  // Base theme builder
  static ThemeData _buildTheme({
    required Brightness brightness,
    required Color backgroundColor,
    required Color cardColor,
    required Color foregroundColor,
    required Color mutedColor,
    required Color borderColor,
    required Color primaryColor,
    required Color accentColor,
    required Color onPrimaryColor,
  }) {
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      scaffoldBackgroundColor: backgroundColor,
      fontFamily: fontSans,
      colorScheme: brightness == Brightness.dark
          ? ColorScheme.dark(
              primary: primaryColor,
              secondary: accentColor,
              surface: cardColor,
              background: backgroundColor,
              onPrimary: onPrimaryColor,
              onSecondary: darkBackground,
              onSurface: foregroundColor,
              onBackground: foregroundColor,
              error: Colors.redAccent,
              onError: Colors.white,
              outline: borderColor,
            )
          : ColorScheme.light(
              primary: primaryColor,
              secondary: accentColor,
              surface: cardColor,
              background: backgroundColor,
              onPrimary: onPrimaryColor,
              onSecondary: Colors.white,
              onSurface: foregroundColor,
              onBackground: foregroundColor,
              error: Colors.red.shade700,
              onError: Colors.white,
              outline: borderColor,
            ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: cardColor,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: _borderRadius,
          side: BorderSide(color: borderColor, width: 1.5),
        ),
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontFamily: fontSans,
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: foregroundColor,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: cardColor,
        hintStyle: TextStyle(color: mutedColor),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: BorderSide(color: primaryColor, width: 2),
        ),
      ),
      textTheme: _buildTextTheme(baseFontColor: foregroundColor, mutedFontColor: mutedColor),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          // This will be overridden by custom gradient buttons, but provides a fallback
          backgroundColor: primaryColor,
          foregroundColor: onPrimaryColor,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: _borderRadius),
          textStyle: const TextStyle(fontFamily: fontSans, fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
    );
  }

  // --- PUBLIC THEME GETTERS ---
  static ThemeData get lightTheme {
    return _buildTheme(
      brightness: Brightness.light,
      backgroundColor: lightBackground,
      cardColor: lightCard,
      foregroundColor: lightForeground,
      mutedColor: lightMutedForeground,
      borderColor: lightBorder,
      primaryColor: lightPrimary,
      accentColor: lightAccent,
      onPrimaryColor: Colors.white,
    );
  }

  static ThemeData get darkTheme {
    return _buildTheme(
      brightness: Brightness.dark,
      backgroundColor: darkBackground,
      cardColor: darkCard,
      foregroundColor: darkForeground,
      mutedColor: darkMutedForeground,
      borderColor: darkBorder,
      primaryColor: darkPrimary,
      accentColor: darkAccent,
      onPrimaryColor: darkBackground,
    );
  }

  static TextTheme _buildTextTheme({required Color baseFontColor, required Color mutedFontColor}) {
    return TextTheme(
      // For large headlines
      displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: baseFontColor),
      // For screen titles
      headlineLarge: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: baseFontColor),
      // For card titles
      titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: baseFontColor),
      titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: baseFontColor),
      // For body text
      bodyLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.normal, color: baseFontColor, height: 1.5),
      bodyMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.normal, color: mutedFontColor, height: 1.4),
      // For button labels
      labelLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: baseFontColor),
    );
  }
}
