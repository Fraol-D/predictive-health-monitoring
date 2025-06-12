import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:predictive_health_monitoring/services/gemini_service.dart'; // Import GeminiService
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_1_demographics.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_2_diet.dart'; // Import Step2Diet
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_3_lifestyle.dart'; // Import Step3Lifestyle
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_4_medical_history_symptoms.dart'; // Import Step4
// Import other step widgets here as they are created
// e.g., import 'widget/assessment/steps/step_3_lifestyle.dart'; 

// A simple data structure for the multi-step form data
class AssessmentFormData {
  // Step 1: Demographics
  String? age;
  String? sex; // Consider enum: 'male', 'female', 'other';
  String? height;
  String? weight;
  String? weightUnit = 'kg'; // Default or allow selection

  // Step 2: Diet (example fields, align with shared/src/types/assessment.ts)
  String? fruitVegFrequency;
  String? processedFoodFrequency;
  String? waterIntakeLiters; // Added for Step2Diet

  // Step 3: Lifestyle (example fields)
  String? physicalActivityFrequency;
  bool smokingStatus = false;
  String? alcoholConsumption; // Added for Step3Lifestyle
  String? stressLevel; // Added for Step3Lifestyle

  // Step 4: Medical History / Symptoms
  bool familyHistoryDiabetes = false;
  bool familyHistoryHeartDisease = false;
  bool familyHistoryHypertension = false;
  bool familyHistoryCancer = false;
  String? familyHistoryOther;
  String? existingConditions; // For simplicity, string. UI could use chip input for list.
  String? medications;        // For simplicity, string.
  String? allergies;          // For simplicity, string.
  String? lastCheckupDate;    // Could be a DateTime, formatted to string.

  List<String> symptoms = []; // Already exists for a potential 5th step or combined step

  Map<String, dynamic> toMap() {
    // Ensure all current data is included for the API call
    return {
      'demographics': {
        'age': age,
        'sex': sex,
        'heightCm': height, // Assuming cm from Step1Demographics
        'weightKg': weight, // Assuming kg from Step1Demographics
        // 'weightUnit': weightUnit, // API might prefer consistent units
      },
      'diet': {
        'fruitVegFrequency': fruitVegFrequency,
        'processedFoodFrequency': processedFoodFrequency,
        'waterIntakeLiters': waterIntakeLiters,
        // ... add other actual diet fields here
      },
      'lifestyle': {
        'physicalActivityFrequency': physicalActivityFrequency,
        'smokingStatus': smokingStatus,
        'alcoholConsumption': alcoholConsumption,
        'stressLevel': stressLevel,
        // ... add other actual lifestyle fields here
      },
      'medicalHistory': {
        'familyHistoryDiabetes': familyHistoryDiabetes,
        'familyHistoryHeartDisease': familyHistoryHeartDisease,
        'familyHistoryHypertension': familyHistoryHypertension,
        'familyHistoryCancer': familyHistoryCancer,
        'familyHistoryOther': familyHistoryOther,
        'existingConditions': existingConditions,
        'medications': medications,
        'allergies': allergies,
        'lastCheckupDate': lastCheckupDate,
      },
      'symptoms': symptoms,
      // Add other steps to map as needed
    };
  }
}

class AssessmentScreen extends StatefulWidget {
  const AssessmentScreen({super.key});

  static const String routeName = '/assessment';

  @override
  State<AssessmentScreen> createState() => _AssessmentScreenState();
}

class _AssessmentScreenState extends State<AssessmentScreen> {
  final PageController _pageController = PageController();
  int _currentStep = 0;
  final _formKeys = [
    GlobalKey<FormState>(), // Step 1: Demographics
    GlobalKey<FormState>(), // Step 2: Diet
    GlobalKey<FormState>(), // Step 3: Lifestyle
    GlobalKey<FormState>(), // Step 4: Medical History / Symptoms
  ];

  final AssessmentFormData _formData = AssessmentFormData();
  bool _isSubmitting = false; // Loading state for submission

  late List<Widget> _assessmentSteps;
  late GeminiService _geminiService; // Declare GeminiService instance

  @override
  void initState() {
    super.initState();
    _geminiService = GeminiService(); // Initialize GeminiService
  }

  void _nextStep() {
    if (_isSubmitting) return; // Prevent multiple actions if already submitting

    if (_formKeys[_currentStep].currentState?.validate() ?? false) {
      _formKeys[_currentStep].currentState?.save();
      if (_currentStep < _assessmentSteps.length - 1) {
        setState(() {
          _currentStep++;
        });
        _pageController.animateToPage(
          _currentStep,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      } else {
        _submitAssessment();
      }
    }
  }

  void _previousStep() {
    if (_isSubmitting) return;
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _submitAssessment() async {
    if (_isSubmitting) return;

    setState(() {
      _isSubmitting = true;
    });

    // Ensure all steps are validated and saved (though _nextStep does it for current)
    // This is a final check, especially if some steps might not have been visited (not possible with current linear flow)
    bool allFormsValid = true;
    for (var key in _formKeys) {
      if (!(key.currentState?.validate() ?? false)) {
        allFormsValid = false;
        break;
      }
      key.currentState?.save();
    }

    if (!allFormsValid) {
      setState(() {
        _isSubmitting = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please complete all fields correctly before submitting.')),
        );
      }
      return;
    }

    print('Submitting assessment data: ${_formData.toMap()}');

    try {
      // TODO: Show a more prominent loading indicator overlay if possible
      final Map<String, dynamic> assessmentResult = await _geminiService.getHealthRiskAssessment(_formData.toMap());
      
      print('Gemini API Assessment Result: $assessmentResult');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Assessment Submitted & Processed! (Diabetes Risk: ${assessmentResult['diabetes']?['score'] ?? 'N/A'})')),
        );
        // TODO: Navigate to ReportScreen with assessmentResult
        Navigator.pop(context); // For now, just pop
      }
    } catch (e) {
      print('Error submitting assessment to Gemini: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error submitting assessment: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    _assessmentSteps = [
      Step1Demographics(formKey: _formKeys[0], formData: _formData),
      Step2Diet(formKey: _formKeys[1], formData: _formData), // Use Step2Diet
      Step3Lifestyle(formKey: _formKeys[2], formData: _formData), // Use Step3Lifestyle
      Step4MedicalHistoryAndSymptoms(formKey: _formKeys[3], formData: _formData), // Use Step4
    ];
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Health Assessment (${_currentStep + 1}/${_assessmentSteps.length})'),
        leading: _currentStep > 0 && !_isSubmitting ? IconButton(
          icon: const Icon(Icons.arrow_back_ios_new),
          onPressed: _previousStep,
          tooltip: 'Back',
        ) : null,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                LinearProgressIndicator(
                value: (_currentStep + 1) / _assessmentSteps.length,
                backgroundColor: theme.colorScheme.surface.withOpacity(0.5),
                valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
                minHeight: 8,
                borderRadius: BorderRadius.circular(4),
              ).animate().fadeIn(delay: 100.ms).slideY(begin: -0.2, end: 0),
                const SizedBox(height: 24),
                Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: const NeverScrollableScrollPhysics(),
                  children: _assessmentSteps,
                ),
              ),
              const SizedBox(height: 16),
              if (_isSubmitting) ...[
                const CircularProgressIndicator(),
                const SizedBox(height: 16),
                Text('Submitting your assessment...', style: theme.textTheme.bodyLarge)
              ] else ...[
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (_currentStep > 0)
                        OutlinedButton.icon(
                          icon: const Icon(Icons.arrow_back_ios_new, size: 18),
                          label: const Text('Back'),
                          onPressed: _previousStep,
                          style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12)),
                        ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.5)
                      else
                        Opacity(opacity: 0, child: OutlinedButton.icon(icon: const Icon(Icons.arrow_back_ios_new), label: const Text('Back'), onPressed: (){})),
                      
                      ElevatedButton.icon(
                        icon: Icon(_currentStep < _assessmentSteps.length - 1 ? Icons.arrow_forward_ios : Icons.check_circle_outline, size: 18),
                        label: Text(_currentStep < _assessmentSteps.length - 1 ? 'Next' : 'Submit Assessment'),
                        onPressed: _nextStep,
                        style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12)),
                      ).animate().fadeIn(delay: 200.ms).slideX(begin: 0.5),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }
} 