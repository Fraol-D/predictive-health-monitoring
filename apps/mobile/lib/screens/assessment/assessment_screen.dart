import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class AssessmentScreen extends StatefulWidget {
  const AssessmentScreen({super.key});

  static const String routeName = '/assessment';

  @override
  State<AssessmentScreen> createState() => _AssessmentScreenState();
}

class _AssessmentScreenState extends State<AssessmentScreen> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  
  // Form data
  final Map<String, dynamic> _formData = {
    'age': '',
    'gender': '',
    'height': '',
    'weight': '',
    'smoking': false,
    'exercise': '',
    'familyHistory': false,
    'symptoms': [],
  };

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Health Assessment'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                // Progress indicator
                LinearProgressIndicator(
                  value: (_currentStep + 1) / 4,
                  backgroundColor: theme.colorScheme.surface,
                  valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryPurple),
                ),
                const SizedBox(height: 24),
                
                // Step content
                Expanded(
                  child: _buildStepContent(),
                ),
                
                // Navigation buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (_currentStep > 0)
                      TextButton(
                        onPressed: () {
      setState(() {
        _currentStep--;
      });
                        },
                        child: const Text('Back'),
                      )
                    else
                      const SizedBox.shrink(),
                    ElevatedButton(
                      onPressed: () {
                        if (_currentStep < 3) {
                          setState(() {
                            _currentStep++;
                          });
                        } else {
                          // Submit form
                          if (_formKey.currentState!.validate()) {
                            _formKey.currentState!.save();
                            // TODO: Submit assessment data
                            Navigator.pop(context);
                          }
                        }
                      },
                      child: Text(_currentStep < 3 ? 'Next' : 'Submit'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildPersonalInfoStep();
      case 1:
        return _buildLifestyleStep();
      case 2:
        return _buildFamilyHistoryStep();
      case 3:
        return _buildSymptomsStep();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildPersonalInfoStep() {
    return SingleChildScrollView(
            child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
            'Personal Information',
            style: Theme.of(context).textTheme.displaySmall,
                ),
                const SizedBox(height: 24),
          TextFormField(
            decoration: const InputDecoration(
              labelText: 'Age',
              hintText: 'Enter your age',
            ),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your age';
              }
              if (int.tryParse(value) == null) {
                return 'Please enter a valid number';
              }
              return null;
            },
            onSaved: (value) => _formData['age'] = value,
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            decoration: const InputDecoration(
              labelText: 'Gender',
            ),
            items: const [
              DropdownMenuItem(value: 'male', child: Text('Male')),
              DropdownMenuItem(value: 'female', child: Text('Female')),
              DropdownMenuItem(value: 'other', child: Text('Other')),
            ],
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please select your gender';
              }
              return null;
            },
            onChanged: (value) {
              setState(() {
                _formData['gender'] = value;
              });
            },
            value: _formData['gender'] as String?,
          ),
          const SizedBox(height: 16),
          TextFormField(
            decoration: const InputDecoration(
              labelText: 'Height (cm)',
              hintText: 'Enter your height',
            ),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your height';
              }
              if (double.tryParse(value) == null) {
                return 'Please enter a valid number';
              }
              return null;
            },
            onSaved: (value) => _formData['height'] = value,
          ),
          const SizedBox(height: 16),
          TextFormField(
            decoration: const InputDecoration(
              labelText: 'Weight (kg)',
              hintText: 'Enter your weight',
            ),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your weight';
              }
              if (double.tryParse(value) == null) {
                return 'Please enter a valid number';
              }
              return null;
            },
            onSaved: (value) => _formData['weight'] = value,
          ),
        ],
      ),
    );
  }

  Widget _buildLifestyleStep() {
    return SingleChildScrollView(
            child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
              children: [
          Text(
            'Lifestyle',
            style: Theme.of(context).textTheme.displaySmall,
          ),
          const SizedBox(height: 24),
          SwitchListTile(
            title: const Text('Do you smoke?'),
            value: _formData['smoking'] as bool,
            onChanged: (value) {
              setState(() {
                _formData['smoking'] = value;
              });
            },
                ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            decoration: const InputDecoration(
              labelText: 'Exercise Frequency',
            ),
            items: const [
              DropdownMenuItem(value: 'none', child: Text('No exercise')),
              DropdownMenuItem(value: 'light', child: Text('Light (1-2 times/week)')),
              DropdownMenuItem(value: 'moderate', child: Text('Moderate (3-4 times/week)')),
              DropdownMenuItem(value: 'heavy', child: Text('Heavy (5+ times/week)')),
            ],
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please select your exercise frequency';
              }
              return null;
            },
            onChanged: (value) {
              setState(() {
                _formData['exercise'] = value;
              });
            },
            value: _formData['exercise'] as String?,
                ),
              ],
          ),
    );
  }

  Widget _buildFamilyHistoryStep() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Family History',
            style: Theme.of(context).textTheme.displaySmall,
          ),
          const SizedBox(height: 24),
          SwitchListTile(
            title: const Text('Family history of heart disease'),
            value: _formData['familyHistory'] as bool,
            onChanged: (value) {
              setState(() {
                _formData['familyHistory'] = value;
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSymptomsStep() {
    final List<String> symptoms = [
      'Chest pain',
      'Shortness of breath',
      'Fatigue',
      'Dizziness',
      'Irregular heartbeat',
    ];

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Symptoms',
            style: Theme.of(context).textTheme.displaySmall,
        ),
          const SizedBox(height: 24),
          ...symptoms.map((symptom) => CheckboxListTile(
            title: Text(symptom),
            value: (_formData['symptoms'] as List).contains(symptom),
            onChanged: (bool? value) {
              setState(() {
                if (value == true) {
                  (_formData['symptoms'] as List).add(symptom);
                } else {
                  (_formData['symptoms'] as List).remove(symptom);
                }
              });
            },
          )),
        ],
      ),
    );
  }
} 