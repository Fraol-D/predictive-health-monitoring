import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:predictive_health_monitoring/widgets/assessment/steps/step_state.dart';

class Step4MedicalHistory extends StatefulWidget {
  final Function(Map<String, dynamic>) onCompleted;

  const Step4MedicalHistory({super.key, required this.onCompleted});

  @override
  State<Step4MedicalHistory> createState() => _Step4MedicalHistoryState();
}

class _Step4MedicalHistoryState extends AssessmentStepState<Step4MedicalHistory> {
  final _formKey = GlobalKey<FormState>();
  final _conditionsController = TextEditingController();
  final _medicationsController = TextEditingController();
  final _allergiesController = TextEditingController();
  final Map<String, bool> _familyHistory = {
    'Diabetes': false,
    'Heart Disease': false,
    'Hypertension': false,
    'Cancer': false,
  };
  DateTime? _lastCheckupDate;

  @override
  bool validateAndSave() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      widget.onCompleted({
        'familyHistory': _familyHistory.entries
            .where((e) => e.value)
            .map((e) => e.key)
            .toList(),
        'existingConditions': _conditionsController.text,
        'medications': _medicationsController.text,
        'allergies': _allergiesController.text,
        'lastCheckupDate': _lastCheckupDate?.toIso8601String(),
      });
      return true;
    }
    return false;
  }

  @override
  void dispose() {
    _conditionsController.dispose();
    _medicationsController.dispose();
    _allergiesController.dispose();
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
            "Medical History & Symptoms",
            style: Theme.of(context)
                .textTheme
                .titleLarge
                ?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            "This information is crucial for an accurate assessment.",
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 24),
          Text("Family History", style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8.0,
                runSpacing: 4.0,
                children: _familyHistory.keys.map((String key) {
                  return ChoiceChip(
                    label: Text(key),
                    selected: _familyHistory[key]!,
                    onSelected: (bool selected) {
                setState(() {
                        _familyHistory[key] = selected;
                });
              },
            );
          }).toList(),
              ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _conditionsController,
            decoration: const InputDecoration(
              labelText: 'Your Existing Conditions (comma-separated)',
              hintText: 'e.g., Asthma, Arthritis',
            ),
            onSaved: (value) => _conditionsController.text = value ?? '',
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _medicationsController,
            decoration: const InputDecoration(
              labelText: 'Current Medications (comma-separated)',
              hintText: 'e.g., Aspirin, Metformin',
            ),
            onSaved: (value) => _medicationsController.text = value ?? '',
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _allergiesController,
            decoration: const InputDecoration(
              labelText: 'Allergies (comma-separated)',
              hintText: 'e.g., Peanuts, Penicillin',
            ),
            onSaved: (value) => _allergiesController.text = value ?? '',
          ),
          const SizedBox(height: 16),
          TextFormField(
            readOnly: true,
            decoration: InputDecoration(
              labelText: 'Last Checkup Date',
              suffixIcon: const Icon(Icons.calendar_today),
              hintText: _lastCheckupDate == null
                  ? 'Select a date'
                  : DateFormat.yMMMd().format(_lastCheckupDate!),
            ),
            onTap: () async {
              final pickedDate = await showDatePicker(
                context: context,
                initialDate: _lastCheckupDate ?? DateTime.now(),
                firstDate: DateTime(1900),
                lastDate: DateTime.now(),
              );
              if (pickedDate != null) {
                setState(() {
                  _lastCheckupDate = pickedDate;
                });
              }
            },
          ),
        ],
          ),
        ),
      ),
    );
  }
} 