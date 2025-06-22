import 'dart:convert';
import 'package:http/http.dart' as http;

class GeminiService {
  // The API key is no longer directly used in the mobile app.
  // The backend will handle Gemini API authentication.
  // final String _apiKey; 
  
  // URL for the local backend. For Android emulator, 10.0.2.2 points to localhost.
  static const String _baseUrl = 'http://10.0.2.2:3001/api';

  // The constructor no longer needs the API key.
  GeminiService();

  Future<String> generateContent(String prompt) async {
    final url = Uri.parse('$_baseUrl/chat');
    
    final requestBody = {
      "message": prompt
    };

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 200) {
        final decodedResponse = jsonDecode(response.body);
        if (decodedResponse.containsKey('reply')) {
          return decodedResponse['reply'] as String;
        } else {
          throw Exception('Backend response did not contain a "reply" field.');
        }
      } else {
        print('Backend API Error: ${response.statusCode}');
        print('Response body: ${response.body}');
        throw Exception('Failed to get response from backend: ${response.statusCode}');
      }
    } catch (e) {
      print('Error communicating with backend: $e');
      throw Exception('Failed to communicate with backend: $e');
    }
  }

  // This method communicates directly with Google's API and should be refactored
  // to use the backend server instead for security and consistency.
  // Commenting it out for now as the immediate task is to fix the main chat feature.
  /*
  Future<Map<String, dynamic>> getHealthRiskAssessment(Map<String, dynamic> userData) async {
    // Construct a detailed prompt based on userData
    // This needs to be carefully designed to get the desired output format (e.g., JSON with risk scores)
    // For example:
    // String prompt = "Analyze the following user data and provide a chronic disease risk assessment. Format the output as a JSON object with keys 'diabetesRisk', 'hypertensionRisk', 'heartDiseaseRisk', each with a numerical score from 0 to 1 and a brief textual explanation for each.\n\nUser Data:\n${jsonEncode(userData)}";
    
    // This is a simplified prompt for now. It needs to be much more specific about desired output format.
    String prompt = "Analyze this health data: ${jsonEncode(userData)}. Provide risk scores for diabetes, hypertension, and heart disease as a JSON object with keys 'diabetes', 'hypertension', 'heartDisease', each with a 'score' (0-1) and 'explanation' (string).";

    final url = Uri.parse('$_baseUrl?key=$_apiKey');
    final requestBody = {
      "contents": [{"parts": [{"text": prompt}]}],
      // Consider adding generationConfig if needed (temperature, topK, topP, maxOutputTokens, etc.)
      // "generationConfig": {
      //   "responseMimeType": "application/json", // Request JSON output if model supports it
      // }
    };

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body) as Map<String, dynamic>;
        // The actual content is often nested, e.g., responseBody['candidates'][0]['content']['parts'][0]['text']
        // This needs to be parsed carefully based on the Gemini API response structure.
        // For now, assuming the API directly returns the JSON string in a specific part:
        if (responseBody.containsKey('candidates') &&
            (responseBody['candidates'] as List).isNotEmpty &&
            responseBody['candidates'][0].containsKey('content') &&
            responseBody['candidates'][0]['content'].containsKey('parts') &&
            (responseBody['candidates'][0]['content']['parts'] as List).isNotEmpty &&
            responseBody['candidates'][0]['content']['parts'][0].containsKey('text')) {
          
          final textOutput = responseBody['candidates'][0]['content']['parts'][0]['text'] as String;
          // Attempt to parse this text as JSON
          try {
            return jsonDecode(textOutput) as Map<String, dynamic>;
          } catch (e) {
            print('Failed to parse Gemini response text as JSON: $textOutput');
            throw Exception('Gemini API returned malformed JSON for health assessment.');
          }
        }
        print('Unexpected Gemini API response structure for health assessment: $responseBody');
        throw Exception('Gemini API returned unexpected structure for health assessment.');
      } else {
        print('Gemini API Error (Health Assessment): ${response.statusCode}');
        print('Response body: ${response.body}');
        throw Exception('Failed to get health risk assessment from Gemini API: ${response.statusCode}');
      }
    } catch (e) {
      print('Error calling Gemini API (Health Assessment): $e');
      throw Exception('Failed to communicate with Gemini API for health assessment: $e');
    }
  }
  */
} 