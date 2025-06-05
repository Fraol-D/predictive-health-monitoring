import 'package:flutter/material.dart';
import 'package:predictive_health_monitoring/screens/assessment/assessment_screen.dart'; // For AssessmentFormData

class Step4MedicalHistoryAndSymptoms extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final AssessmentFormData formData;

  const Step4MedicalHistoryAndSymptoms({
    super.key,
    required this.formKey,
    required this.formData,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Predefined common symptoms for checkboxes
    const List<String> commonSymptoms = [
      'Chest pain or discomfort',
      'Shortness of breath',
      'Persistent fatigue',
      'Dizziness or lightheadedness',
      'Unexplained weight loss/gain',
      'Frequent headaches',
    ];

    return Form(
      key: formKey,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Step 4: Medical History & Symptoms',
              style: theme.textTheme.headlineMedium?.copyWith(color: theme.colorScheme.primary),
            ),
            const SizedBox(height: 24),

            Text('Family Medical History', style: theme.textTheme.titleLarge),
            const SizedBox(height: 8),
            SwitchListTile(
              title: const Text('Diabetes'),
              value: formData.familyHistoryDiabetes,
              onChanged: (value) {
                formData.familyHistoryDiabetes = value;
                (context as Element).markNeedsBuild(); // Request rebuild for subtitle or visual feedback
              },
              contentPadding: EdgeInsets.zero,
            ),
            SwitchListTile(
              title: const Text('Heart Disease'),
              value: formData.familyHistoryHeartDisease,
              onChanged: (value) {
                formData.familyHistoryHeartDisease = value;
                (context as Element).markNeedsBuild();
              },
              contentPadding: EdgeInsets.zero,
            ),
            SwitchListTile(
              title: const Text('Hypertension (High Blood Pressure)'),
              value: formData.familyHistoryHypertension,
              onChanged: (value) {
                formData.familyHistoryHypertension = value;
                (context as Element).markNeedsBuild();
              },
              contentPadding: EdgeInsets.zero,
            ),
            SwitchListTile(
              title: const Text('Cancer'),
              value: formData.familyHistoryCancer,
              onChanged: (value) {
                formData.familyHistoryCancer = value;
                (context as Element).markNeedsBuild();
              },
              contentPadding: EdgeInsets.zero,
            ),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Other relevant family history (optional)'),
              initialValue: formData.familyHistoryOther,
              onSaved: (value) => formData.familyHistoryOther = value,
              maxLines: 2,
            ),
            const SizedBox(height: 20),

            Text('Personal Medical History', style: theme.textTheme.titleLarge),
            const SizedBox(height: 8),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Existing medical conditions (e.g., Asthma, Thyroid issues)', hintText: 'Separate with commas if multiple'),
              initialValue: formData.existingConditions,
              onSaved: (value) => formData.existingConditions = value,
              maxLines: 2,
              // validator: (value) => value == null || value.isEmpty ? 'Please list any conditions or type \'None\'' : null, // Make it optional or required
            ),
            const SizedBox(height: 16),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Current medications (including supplements)', hintText: 'Separate with commas if multiple'),
              initialValue: formData.medications,
              onSaved: (value) => formData.medications = value,
              maxLines: 2,
            ),
            const SizedBox(height: 16),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Known allergies (medications, food, etc.)', hintText: 'Separate with commas if multiple'),
              initialValue: formData.allergies,
              onSaved: (value) => formData.allergies = value,
              maxLines: 2,
            ),
            const SizedBox(height: 16),
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Date of Last Medical Checkup (approximate)',
                hintText: "e.g., YYYY-MM-DD or '6 months ago'"
              ),
              initialValue: formData.lastCheckupDate,
              onSaved: (value) => formData.lastCheckupDate = value,
              // TODO: Consider adding a Date Picker widget here
            ),
            const SizedBox(height: 24),

            Text('Current Symptoms (select if experienced recently/persistently)', style: theme.textTheme.titleLarge),
            const SizedBox(height: 8),
            ...commonSymptoms.map((symptom) {
              return CheckboxListTile(
                title: Text(symptom),
                value: formData.symptoms.contains(symptom),
                onChanged: (bool? value) {
                  if (value == true) {
                    if (!formData.symptoms.contains(symptom)) {
                      formData.symptoms.add(symptom);
                    }
                  } else {
                    formData.symptoms.remove(symptom);
                  }
                  (context as Element).markNeedsBuild(); // Request rebuild
                },
                controlAffinity: ListTileControlAffinity.leading,
                contentPadding: EdgeInsets.zero,
              );
            }).toList(),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Other symptoms not listed above (optional)'),
              onChanged: (value) {
                // If we want this to be the only way to add "other" symptoms, 
                // we might need to handle it differently, perhaps a dedicated 'otherSymptoms' field.
                // For now, this just captures text, but doesn't add to the formData.symptoms list directly.
                // Or, onSaved, parse this and add if not blank.
              },
              // onSaved: (value) { // Example: if (value != null && value.isNotEmpty) formData.symptoms.add("Other: $value"); }
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }
} 