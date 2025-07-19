import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';
import 'package:predictive_health_monitoring/widgets/assessment/custom_stepper.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_1_demographics.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_2_diet.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_3_lifestyle.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_4_medical_history_symptoms.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_state.dart';
import 'package:predictive_health_monitoring/widgets/common/gradient_button.dart';


class AssessmentScreen extends StatefulWidget {
  static const routeName = '/assessment';
  const AssessmentScreen({super.key});

  @override
  State<AssessmentScreen> createState() => _AssessmentScreenState();
}

class _AssessmentScreenState extends State<AssessmentScreen> {
  int _currentStep = 0;
  final PageController _pageController = PageController();
  final Map<String, dynamic> _assessmentData = {};
  
  // Create a list of GlobalKeys for our custom StepState
  final List<GlobalKey<AssessmentStepState>> _stepKeys = [
    GlobalKey<AssessmentStepState>(),
    GlobalKey<AssessmentStepState>(),
    GlobalKey<AssessmentStepState>(),
    GlobalKey<AssessmentStepState>(),
  ];

  final List<String> _stepTitles = ["Info", "Diet", "Lifestyle", "History"];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _updateAssessmentData(Map<String, dynamic> data) {
    setState(() {
      _assessmentData.addAll(data);
    });
  }

  void _onStepContinue() {
    final isStepValid = _stepKeys[_currentStep].currentState?.validateAndSave() ?? false;
    
    if (isStepValid) {
       if (_currentStep < _stepKeys.length - 1) {
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

  void _onStepCancel() {
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
    print('Submitting assessment...');
    print(_assessmentData);
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Assessment Submitted Successfully!')),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> stepPages = [
      Step1Demographics(key: _stepKeys[0], onCompleted: _updateAssessmentData),
      Step2Diet(key: _stepKeys[1], onCompleted: _updateAssessmentData),
      Step3Lifestyle(key: _stepKeys[2], onCompleted: _updateAssessmentData),
      Step4MedicalHistory(key: _stepKeys[3], onCompleted: _updateAssessmentData),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Assessment',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 20),
        ),
        leading: _currentStep > 0
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: _onStepCancel,
              )
            : null,
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: AppTheme.titleHeaderGradient,
          ),
        ),
      ),
      body: Column(
        children: [
          CustomStepper(
            currentStep: _currentStep,
            steps: _stepTitles,
          ),
          Expanded(
            child: PageView(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              children: stepPages,
            ),
          ),
          _buildNavigation(),
        ],
      ),
    );
  }

  Widget _buildNavigation() {
    bool isLastStep = _currentStep == _stepKeys.length - 1;
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          if (_currentStep > 0)
            TextButton(
              onPressed: _onStepCancel,
              child: const Text('BACK'),
            ),
          if (_currentStep == 0)
            const SizedBox(), // To keep spacing consistent
          
          Expanded(
            child: GradientButton(
              onPressed: () {
                if (isLastStep) {
                  _submitAssessment();
                } else {
                  _pageController.nextPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.ease,
                  );
                }
              },
              text: isLastStep ? 'SUBMIT' : 'NEXT',
              gradient: isLastStep ? AppTheme.actionButtonGradient : AppTheme.titleHeaderGradient,
            ),
          ),
        ],
      ),
    );
  }
}

// Abstract class for Step states to enforce a common interface
abstract class _StepState<T extends StatefulWidget> extends State<T> {
  bool validateAndSave();
} 