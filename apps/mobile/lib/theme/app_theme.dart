import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Common Font Family
  // Using a system-safe font stack is often better than a single named font unless bundled.
  static const String fontSans = 'Inter'; // Assuming 'Inter' is bundled with the app

  // --- OFFICIAL COLOR PALETTE (from web globals.css) ---
  
  // Light Theme Colors
  static const Color lightBackground = Color.fromRGBO(248, 250, 252, 1);
  static const Color lightForeground = Color.fromRGBO(15, 23, 42, 1);
  static const Color lightCard = Color.fromRGBO(255, 255, 255, 1);
  static const Color lightPrimary = Color.fromRGBO(168, 85, 247, 1);
  static const Color lightAccent = Color.fromRGBO(236, 72, 153, 1);
  static const Color lightMutedForeground = Color.fromRGBO(100, 116, 139, 1);
  static const Color lightBorder = Color.fromRGBO(226, 232, 240, 1);

  // Dark Theme Colors
  static const Color darkBackground = Color.fromRGBO(15, 23, 42, 1);
  static const Color darkForeground = Color.fromRGBO(226, 232, 240, 1);
  static const Color darkCard = Color.fromRGBO(30, 41, 59, 1);
  static const Color darkPrimary = Color.fromRGBO(192, 132, 252, 1);
  static const Color darkAccent = Color.fromRGBO(249, 115, 222, 1);
  static const Color darkMutedForeground = Color.fromRGBO(148, 163, 184, 1);
  static const Color darkBorder = Color.fromRGBO(51, 65, 85, 1);
  
  // --- GRADIENTS ---
  
  // Purple-to-Pink for Headers and Important Titles
  static const LinearGradient titleHeaderGradient = LinearGradient(
    colors: [lightPrimary, lightAccent],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  // Green-to-Blue for main call-to-action buttons
  static const Color actionGreen = Color(0xFF10B981); // Emerald 500
  static const Color actionBlue = Color(0xFF3B82F6);  // Blue 500
  static const LinearGradient actionButtonGradient = LinearGradient(
    colors: [actionGreen, actionBlue],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
  
  // High-contrast colors for charts to ensure readability
  static final List<Color> chartColors = [
    const Color(0xFF3B82F6), // Blue 500
    const Color(0xFF10B981), // Emerald 500
    const Color(0xFFF97316), // Orange 500
    const Color(0xFF8B5CF6), // Violet 500
    const Color(0xFFEC4899), // Pink 500
    const Color(0xFFFACC15), // Yellow 400
  ];

  // Consistent Border Radius (from web --radius: 0.5rem)
  static final BorderRadius _borderRadius = BorderRadius.circular(12.0);

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
    required Color onAccentColor,
  }) {
    final textTheme = _buildTextTheme(
        baseFontColor: foregroundColor, mutedFontColor: mutedColor);

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      scaffoldBackgroundColor: backgroundColor,
      colorScheme: brightness == Brightness.dark
          ? ColorScheme.dark(
              primary: primaryColor,
              secondary: accentColor,
              surface: cardColor,
              onPrimary: onPrimaryColor,
              onSecondary: onAccentColor,
              onSurface: foregroundColor,
              error: const Color(0xFFF87171), // Red 400
              onError: darkBackground,
              outline: borderColor,
            )
          : ColorScheme.light(
              primary: primaryColor,
              secondary: accentColor,
              surface: cardColor,
              onPrimary: onPrimaryColor,
              onSecondary: onAccentColor,
              onSurface: foregroundColor,
              error: const Color(0xFFDC2626), // Red 600
              onError: lightCard,
              outline: borderColor,
            ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: cardColor,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: _borderRadius,
          side: BorderSide(color: borderColor, width: 1),
        ),
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.headlineMedium,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: cardColor,
        hintStyle: textTheme.bodyMedium?.copyWith(color: mutedColor),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: BorderSide(color: borderColor, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: _borderRadius,
          borderSide: BorderSide(color: primaryColor, width: 2),
        ),
      ),
      textTheme: textTheme,
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: onPrimaryColor,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: _borderRadius),
          textStyle: textTheme.labelLarge,
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: cardColor,
        selectedItemColor: primaryColor,
        unselectedItemColor: mutedColor,
        elevation: 8,
        type: BottomNavigationBarType.fixed,
        selectedLabelStyle: textTheme.labelSmall,
        unselectedLabelStyle: textTheme.labelSmall,
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
      onAccentColor: Colors.white,
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
      onAccentColor: darkBackground,
    );
  }

  static TextTheme _buildTextTheme(
      {required Color baseFontColor, required Color mutedFontColor}) {
    return TextTheme(
      displayLarge: GoogleFonts.inter(fontSize: 57, fontWeight: FontWeight.w800, color: baseFontColor, letterSpacing: -0.25),
      displayMedium: GoogleFonts.inter(fontSize: 45, fontWeight: FontWeight.w700, color: baseFontColor),
      displaySmall: GoogleFonts.inter(fontSize: 36, fontWeight: FontWeight.w600, color: baseFontColor),

      headlineLarge: GoogleFonts.inter(fontSize: 32, fontWeight: FontWeight.w700, color: baseFontColor),
      headlineMedium: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.w600, color: baseFontColor),
      headlineSmall: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.w500, color: baseFontColor),
      
      titleLarge: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w500, color: baseFontColor),
      titleMedium: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: baseFontColor, letterSpacing: 0.15),
      titleSmall: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: baseFontColor, letterSpacing: 0.1),

      bodyLarge: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.normal, color: baseFontColor, height: 1.5),
      bodyMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.normal, color: mutedFontColor, height: 1.4),
      bodySmall: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.normal, color: mutedFontColor),

      labelLarge: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: baseFontColor, letterSpacing: 0.5),
      labelMedium: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: baseFontColor),
      labelSmall: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w500, color: mutedFontColor),
    );
  }
}
