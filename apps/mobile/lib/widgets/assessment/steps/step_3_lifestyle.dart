import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_state.dart';

class Step3Lifestyle extends StatefulWidget {
  final Function(Map<String, dynamic>) onCompleted;

  const Step3Lifestyle({super.key, required this.onCompleted});

  @override
  State<Step3Lifestyle> createState() => _Step3LifestyleState();
}

class _Step3LifestyleState extends AssessmentStepState<Step3Lifestyle> {
  final _formKey = GlobalKey<FormState>();
  String? _physicalActivityFrequency;
  String? _stressLevel;
  String? _alcoholConsumption;
  bool _smokingStatus = false;

  @override
  bool validateAndSave() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      widget.onCompleted({
        'physicalActivityFrequency': _physicalActivityFrequency,
        'stressLevel': _stressLevel,
        'alcoholConsumption': _alcoholConsumption,
        'smokingStatus': _smokingStatus,
      });
      return true;
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Your Lifestyle",
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                "Lifestyle choices are strong indicators of health outcomes.",
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
              DropdownButtonFormField<String>(
                value: _physicalActivityFrequency,
                decoration: const InputDecoration(
                  labelText: 'Physical Activity Frequency',
                ),
                items: ['daily', 'multiple_times_week', 'once_week', 'rarely', 'never']
                    .map((label) => DropdownMenuItem(
                          value: label,
                          child: Text(label.replaceAll('_', ' ')),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _physicalActivityFrequency = value;
                  });
                },
                onSaved: (value) => _physicalActivityFrequency = value,
                validator: (value) => value == null || value.isEmpty ? 'Please select a frequency' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _stressLevel,
                decoration: const InputDecoration(
                  labelText: 'Stress Level',
                ),
                items: ['low', 'moderate', 'high', 'very_high']
                    .map((label) => DropdownMenuItem(
                          value: label,
                          child: Text(label.replaceAll('_', ' ')),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _stressLevel = value;
                  });
                },
                onSaved: (value) => _stressLevel = value,
                validator: (value) => value == null || value.isEmpty ? 'Please select a level' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _alcoholConsumption,
                decoration: const InputDecoration(
                  labelText: 'Alcohol Consumption',
                ),
                items: ['none', 'occasional', 'moderate', 'heavy']
                    .map((label) => DropdownMenuItem(
                          value: label,
                          child: Text(label.replaceAll('_', ' ')),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _alcoholConsumption = value;
                  });
                },
                onSaved: (value) => _alcoholConsumption = value,
                validator: (value) => value == null || value.isEmpty ? 'Please select a level' : null,
              ),
              const SizedBox(height: 16),
              SwitchListTile(
                title: const Text('Do you smoke?'),
                value: _smokingStatus,
                onChanged: (bool value) {
                  setState(() {
                    _smokingStatus = value;
                  });
                },
                secondary: const Icon(Icons.smoking_rooms_outlined),
                contentPadding: EdgeInsets.zero,
              ),
            ],
          ),
        ),
      ),
    );
  }
} 