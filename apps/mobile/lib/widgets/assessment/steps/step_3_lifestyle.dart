import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/screens/assessment/assessment_screen.dart'; // For AssessmentFormData

class Step3Lifestyle extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final AssessmentFormData formData;

  const Step3Lifestyle({
    super.key,
    required this.formKey,
    required this.formData,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    const List<DropdownMenuItem<String>> activityFrequencyOptions = [
      DropdownMenuItem(value: 'daily', child: Text('Daily')),
      DropdownMenuItem(value: 'multiple_times_week', child: Text('Multiple times a week')),
      DropdownMenuItem(value: 'once_week', child: Text('Once a week')),
      DropdownMenuItem(value: 'rarely', child: Text('Rarely')),
      DropdownMenuItem(value: 'never', child: Text('Never / Sedentary')),
    ];

    const List<DropdownMenuItem<String>> alcoholOptions = [
      DropdownMenuItem(value: 'none', child: Text('None')),
      DropdownMenuItem(value: 'occasional', child: Text('Occasional (e.g., 1-2 times/month)')),
      DropdownMenuItem(value: 'moderate', child: Text('Moderate (e.g., 1-2 times/week)')),
      DropdownMenuItem(value: 'heavy', child: Text('Heavy (e.g., 3+ times/week)')),
      DropdownMenuItem(value: 'very_heavy', child: Text('Very Heavy (Daily or almost daily)')),
    ];

    const List<DropdownMenuItem<String>> stressOptions = [
      DropdownMenuItem(value: 'low', child: Text('Low')),
      DropdownMenuItem(value: 'moderate', child: Text('Moderate')),
      DropdownMenuItem(value: 'high', child: Text('High')),
      DropdownMenuItem(value: 'very_high', child: Text('Very High')),
    ];

    return Form(
      key: formKey,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
              'Step 3: Lifestyle Habits',
              style: theme.textTheme.headlineMedium?.copyWith(color: theme.colorScheme.primary),
            ),
            const SizedBox(height: 24),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: 'Physical Activity Frequency',
                hintText: 'How often do you engage in physical activity?',
                prefixIcon: Icon(Icons.fitness_center_outlined),
              ),
              value: formData.physicalActivityFrequency,
              items: activityFrequencyOptions,
              validator: (value) => value == null || value.isEmpty ? 'Please select activity frequency' : null,
              onSaved: (value) => formData.physicalActivityFrequency = value,
              onChanged: (value) { formData.physicalActivityFrequency = value; },
            ),
            const SizedBox(height: 20),
            SwitchListTile(
              title: const Text('Current Smoking Status'),
              subtitle: Text(formData.smokingStatus ? 'Currently smoke' : 'Do not currently smoke'),
              value: formData.smokingStatus,
              onChanged: (bool value) {
                formData.smokingStatus = value;
                (context as Element).markNeedsBuild();
              },
              secondary: Icon(formData.smokingStatus ? Icons.smoking_rooms : Icons.smoke_free),
              activeColor: theme.colorScheme.primary,
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 20),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: 'Alcohol Consumption',
                hintText: 'How often do you consume alcohol?',
                prefixIcon: Icon(Icons.local_bar_outlined),
              ),
              value: formData.alcoholConsumption,
              items: alcoholOptions,
              validator: (value) => value == null || value.isEmpty ? 'Please select alcohol consumption frequency' : null,
              onSaved: (value) => formData.alcoholConsumption = value,
              onChanged: (value) { formData.alcoholConsumption = value; },
            ),
            const SizedBox(height: 20),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: 'Perceived Stress Level',
                hintText: 'How would you rate your average stress level?',
                prefixIcon: Icon(Icons.sentiment_very_dissatisfied_outlined),
              ),
              value: formData.stressLevel,
              items: stressOptions,
              validator: (value) => value == null || value.isEmpty ? 'Please select your stress level' : null,
              onSaved: (value) => formData.stressLevel = value,
              onChanged: (value) { formData.stressLevel = value; },
            ),
            // TODO: Add more fields as per shared/src/types/assessment.ts LifestyleData
            // e.g., sleepHoursPerNight (TextFormField), notes (TextFormField)
          ],
        ),
      ),
    );
  }
} 