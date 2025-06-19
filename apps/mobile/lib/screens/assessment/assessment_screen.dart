import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_1_demographics.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_2_diet.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_3_lifestyle.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_4_medical_history_symptoms.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_state.dart';


class AssessmentScreen extends StatefulWidget {
  static const routeName = '/assessment';
  const AssessmentScreen({super.key});

  @override
  State<AssessmentScreen> createState() => _AssessmentScreenState();
}

class _AssessmentScreenState extends State<AssessmentScreen> {
  int _currentStep = 0;
  final Map<String, dynamic> _assessmentData = {};
  
  // Create a list of GlobalKeys for our custom StepState
  final List<GlobalKey<AssessmentStepState>> _stepKeys = [
    GlobalKey<AssessmentStepState>(),
    GlobalKey<AssessmentStepState>(),
    GlobalKey<AssessmentStepState>(),
    GlobalKey<AssessmentStepState>(),
  ];

  void _updateAssessmentData(Map<String, dynamic> data) {
    setState(() {
      _assessmentData.addAll(data);
    });
  }

  void _onStepContinue() {
    // a boolean that will be true if all is good
    final isStepValid = _stepKeys[_currentStep].currentState?.validateAndSave() ?? false;
    
    if (isStepValid) {
       if (_currentStep < 3) { // 3 is the last index of a 4-step form
        setState(() {
          _currentStep += 1;
        });
      } else {
        _submitAssessment();
      }
    }
  }

  void _onStepCancel() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep -= 1;
      });
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
    // List of step widgets
    final List<Widget> stepContents = [
      Step1Demographics(key: _stepKeys[0], onCompleted: _updateAssessmentData),
      Step2Diet(key: _stepKeys[1], onCompleted: _updateAssessmentData),
      Step3Lifestyle(key: _stepKeys[2], onCompleted: _updateAssessmentData),
      Step4MedicalHistory(key: _stepKeys[3], onCompleted: _updateAssessmentData),
    ];
    
    List<Step> steps = [
      Step(
        title: const Text('Info'),
        content: stepContents[0],
        isActive: _currentStep >= 0,
        state: _currentStep > 0 ? StepState.complete : StepState.indexed,
      ),
      Step(
        title: const Text('Diet'),
        content: stepContents[1],
        isActive: _currentStep >= 1,
        state: _currentStep > 1 ? StepState.complete : StepState.indexed,
      ),
      Step(
        title: const Text('Lifestyle'),
        content: stepContents[2],
        isActive: _currentStep >= 2,
        state: _currentStep > 2 ? StepState.complete : StepState.indexed,
      ),
      Step(
        title: const Text('History'),
        content: stepContents[3],
        isActive: _currentStep >= 3,
        state: _currentStep >= 3 ? StepState.complete : StepState.indexed,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Health Assessment'),
        leading: _currentStep > 0
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: _onStepCancel,
              )
            : null,
      ),
      body: Stepper(
        type: StepperType.horizontal,
        currentStep: _currentStep,
        onStepContinue: _onStepContinue,
        onStepCancel: _onStepCancel,
        controlsBuilder: (BuildContext context, ControlsDetails details) {
          return Padding(
            padding: const EdgeInsets.only(top: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
                if (_currentStep > 0)
                  TextButton(
                    onPressed: details.onStepCancel,
                    child: const Text('BACK'),
                  ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: details.onStepContinue,
                  child: Text(_currentStep == steps.length - 1 ? 'SUBMIT' : 'NEXT'),
                ),
              ],
            ),
          );
        },
        steps: steps,
      ),
    );
  }
}


// Abstract class for Step states to enforce a common interface
abstract class _StepState<T extends StatefulWidget> extends State<T> {
  bool validateAndSave();
} 