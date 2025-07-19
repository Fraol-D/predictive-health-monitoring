import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_state.dart';

class Step2Diet extends StatefulWidget {
  final Function(Map<String, dynamic>) onCompleted;

  const Step2Diet({super.key, required this.onCompleted});

  @override
  State<Step2Diet> createState() => _Step2DietState();
}

class _Step2DietState extends AssessmentStepState<Step2Diet> {
  final _formKey = GlobalKey<FormState>();
  String? _fruitVegFrequency;
  String? _processedFoodFrequency;
  final _waterIntakeController = TextEditingController();

  @override
  bool validateAndSave() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      widget.onCompleted({
        'fruitVegFrequency': _fruitVegFrequency,
        'processedFoodFrequency': _processedFoodFrequency,
        'waterIntakeLiters': _waterIntakeController.text,
      });
      return true;
    }
    return false;
  }

  @override
  void dispose() {
    _waterIntakeController.dispose();
    super.dispose();
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
                "Your Dietary Habits",
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                "Understanding your diet is key to a holistic health view.",
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
              DropdownButtonFormField<String>(
                value: _fruitVegFrequency,
                decoration: const InputDecoration(
                  labelText: 'How often do you eat fruits and vegetables?',
                ),
                items: ['daily', 'multiple_times_week', 'once_week', 'rarely', 'never']
                    .map((label) => DropdownMenuItem(
                          value: label,
                          child: Text(label.replaceAll('_', ' ')),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _fruitVegFrequency = value;
                  });
                },
                onSaved: (value) {
                    _fruitVegFrequency = value;
                },
                validator: (value) => value == null || value.isEmpty ? 'Please select a frequency' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _processedFoodFrequency,
                decoration: const InputDecoration(
                  labelText: 'How often do you consume processed foods?',
                ),
                items: ['daily', 'multiple_times_week', 'once_week', 'rarely', 'never']
                    .map((label) => DropdownMenuItem(
                          value: label,
                          child: Text(label.replaceAll('_', ' ')),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _processedFoodFrequency = value;
                  });
                },
                onSaved: (value) {
                    _processedFoodFrequency = value;
                },
                validator: (value) => value == null || value.isEmpty ? 'Please select a frequency' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _waterIntakeController,
                decoration: const InputDecoration(
                  labelText: 'Daily Water Intake (in Liters)',
                  prefixIcon: Icon(Icons.local_drink_outlined),
                ),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty || double.tryParse(value) == null) {
                    return 'Please enter a valid number';
                  }
                  return null;
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
} 