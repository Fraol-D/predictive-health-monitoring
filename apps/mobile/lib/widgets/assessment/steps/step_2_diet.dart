import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:predictive_health_monitoring/screens/assessment/assessment_screen.dart'; // For AssessmentFormData

class Step2Diet extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final AssessmentFormData formData;

  const Step2Diet({
    super.key,
    required this.formKey,
    required this.formData,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Define options for dropdowns to avoid repetition and ensure consistency
    const List<DropdownMenuItem<String>> frequencyOptions = [
      DropdownMenuItem(value: 'daily', child: Text('Daily')),
      DropdownMenuItem(value: 'multiple_times_week', child: Text('Multiple times a week')),
      DropdownMenuItem(value: 'once_week', child: Text('Once a week')),
      DropdownMenuItem(value: 'rarely', child: Text('Rarely')),
      DropdownMenuItem(value: 'never', child: Text('Never')),
    ];

    return Form(
      key: formKey,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Step 2: Dietary Habits',
              style: theme.textTheme.headlineMedium?.copyWith(color: theme.colorScheme.primary),
            ),
            const SizedBox(height: 24),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: 'Fruit and Vegetable Consumption',
                hintText: 'How often do you eat fruits/vegetables?',
                prefixIcon: Icon(Icons.local_florist_outlined),
              ),
              value: formData.fruitVegFrequency,
              items: frequencyOptions,
              validator: (value) => value == null || value.isEmpty ? 'Please select a frequency' : null,
              onSaved: (value) => formData.fruitVegFrequency = value,
              onChanged: (value) { /* formData is updated onSave */ },
            ),
            const SizedBox(height: 20),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: 'Processed Food Consumption',
                hintText: 'How often do you eat processed foods?',
                prefixIcon: Icon(Icons.fastfood_outlined),
              ),
              value: formData.processedFoodFrequency,
              items: frequencyOptions,
              validator: (value) => value == null || value.isEmpty ? 'Please select a frequency' : null,
              onSaved: (value) => formData.processedFoodFrequency = value,
              onChanged: (value) { /* formData is updated onSave */ },
            ),
            const SizedBox(height: 20),
            // Example: Water Intake (Could be more complex, e.g., with units)
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Average Daily Water Intake (Liters)',
                hintText: 'e.g., 2.5',
                prefixIcon: Icon(Icons.water_drop_outlined),
              ),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^[0-9]+\.?[0-9]*'))],
              // initialValue: formData.waterIntakeLiters, // Assuming this field exists in AssessmentFormData
              validator: (value) {
                if (value == null || value.isEmpty) return 'Please enter your water intake.';
                final liters = double.tryParse(value);
                if (liters == null || liters < 0 || liters > 15) return 'Please enter a valid amount in liters.';
                return null;
              },
              // onSaved: (value) => formData.waterIntakeLiters = value, // Assuming this field exists
            ),
            // TODO: Add more fields as per shared/src/types/assessment.ts DietData
            // e.g., dietaryRestrictions, notes
          ],
        ),
      ),
    );
  }
} 