import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // For FilteringTextInputFormatter
import 'package:predictive_health_monitoring/screens/assessment/assessment_screen.dart'; // For AssessmentFormData

// Define a data class or use a Map for step data if more complex typing is needed later
// typedef Step1Data = Map<String, dynamic>; 

class Step1Demographics extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final AssessmentFormData formData;

  const Step1Demographics({
    super.key,
    required this.formKey,
    required this.formData,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Form(
      key: formKey,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Step 1: Personal Information',
              style: theme.textTheme.headlineMedium?.copyWith(color: theme.colorScheme.primary),
            ),
            const SizedBox(height: 24),
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Age',
                hintText: 'Enter your age in years',
                prefixIcon: Icon(Icons.cake_outlined),
              ),
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              initialValue: formData.age,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your age';
                }
                final age = int.tryParse(value);
                if (age == null || age <= 0 || age > 120) {
                  return 'Please enter a valid age';
                }
                return null;
              },
              onSaved: (value) => formData.age = value,
            ),
            const SizedBox(height: 20),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: 'Biological Sex',
                prefixIcon: Icon(Icons.wc_outlined),
              ),
              value: formData.sex,
              items: const [
                DropdownMenuItem(value: 'male', child: Text('Male')),
                DropdownMenuItem(value: 'female', child: Text('Female')),
                // Consider adding 'Prefer not to say' or 'Other' based on requirements
              ],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select your biological sex';
                }
                return null;
              },
              onChanged: (value) {
                // formData.sex is updated by onSaved, but if immediate update is needed elsewhere:
                // setState(() { formData.sex = value; }); 
                // However, this is a StatelessWidget, so state changes are managed by parent.
              },
              onSaved: (value) => formData.sex = value,
            ),
            const SizedBox(height: 20),
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Height (cm)',
                hintText: 'Enter your height in centimeters',
                prefixIcon: Icon(Icons.height_outlined),
              ),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^[0-9]+\.?[0-9]*'))],
              initialValue: formData.height,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your height';
                }
                final height = double.tryParse(value);
                if (height == null || height <= 0 || height > 300) {
                  return 'Please enter a valid height in cm';
                }
                return null;
              },
              onSaved: (value) => formData.height = value,
            ),
            const SizedBox(height: 20),
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Weight (kg)',
                hintText: 'Enter your weight in kilograms',
                prefixIcon: Icon(Icons.scale_outlined),
              ),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^[0-9]+\.?[0-9]*'))],
              initialValue: formData.weight,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your weight';
                }
                final weight = double.tryParse(value);
                if (weight == null || weight <= 0 || weight > 500) {
                  return 'Please enter a valid weight in kg';
                }
                return null;
              },
              onSaved: (value) => formData.weight = value,
            ),
          ],
        ),
      ),
    );
  }
} 