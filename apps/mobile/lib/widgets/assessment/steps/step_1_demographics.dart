import 'package:flutter/material.dart';

// Define a data class or use a Map for step data if more complex typing is needed later
// typedef Step1Data = Map<String, dynamic>; 

class Step1Demographics extends StatefulWidget {
  final Function(Map<String, dynamic> data) onNext;
  final Map<String, dynamic>? initialData;

  const Step1Demographics({super.key, required this.onNext, this.initialData});

  @override
  State<Step1Demographics> createState() => _Step1DemographicsState();
}

class _Step1DemographicsState extends State<Step1Demographics> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _ageController;
  String? _selectedSex;
  late TextEditingController _weightController;
  String _selectedWeightUnit = 'kg';

  final List<String> _sexOptions = ['Male', 'Female']; // Add more as needed
  final List<String> _weightUnitOptions = ['kg', 'lbs'];

  @override
  void initState() {
    super.initState();
    _ageController = TextEditingController(text: widget.initialData?['age']?.toString() ?? '');
    _selectedSex = widget.initialData?['sex'] as String?;
    _weightController = TextEditingController(text: widget.initialData?['weight']?.toString() ?? '');
    _selectedWeightUnit = widget.initialData?['weightUnit'] as String? ?? 'kg';
  }

  @override
  void dispose() {
    _ageController.dispose();
    _weightController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save(); // Important to trigger onSaved for FormFields if used
      widget.onNext({
        'age': _ageController.text,
        'sex': _selectedSex,
        'weight': _weightController.text,
        'weightUnit': _selectedWeightUnit,
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final colorScheme = Theme.of(context).colorScheme;

    return Form(
      key: _formKey,
      child: ListView( // Use ListView for scrollability if content might overflow
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        children: <Widget>[
          Text(
            'Step 1: Basic Information',
            style: textTheme.headlineSmall?.copyWith(color: colorScheme.primary, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Let\'s start with some basic details to build your health profile.',
            style: textTheme.bodyMedium?.copyWith(color: colorScheme.onSurfaceVariant),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24.0),
          TextFormField(
            controller: _ageController,
            decoration: const InputDecoration(labelText: 'Age (Years)', prefixIcon: Icon(Icons.cake_outlined)),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value == null || value.isEmpty) return 'Please enter your age.';
              if (int.tryParse(value) == null || int.parse(value) <= 0) return 'Please enter a valid age.';
              return null;
            },
          ),
          const SizedBox(height: 16.0),
          DropdownButtonFormField<String>(
            value: _selectedSex,
            decoration: const InputDecoration(labelText: 'Sex Assigned at Birth', prefixIcon: Icon(Icons.wc_outlined)),
            items: _sexOptions.map((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
            onChanged: (String? newValue) {
              setState(() {
                _selectedSex = newValue;
              });
            },
            validator: (value) => value == null ? 'Please select your sex.' : null,
          ),
          const SizedBox(height: 16.0),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start, // Align items to the top for validator message
            children: [
              Expanded(
                flex: 2,
                child: TextFormField(
                  controller: _weightController,
                  decoration: const InputDecoration(labelText: 'Current Weight', prefixIcon: Icon(Icons.monitor_weight_outlined)),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  validator: (value) {
                    if (value == null || value.isEmpty) return 'Please enter your weight.';
                    if (double.tryParse(value) == null || double.parse(value) <= 0) return 'Please enter a valid weight.';
                    return null;
                  },
                ),
              ),
              const SizedBox(width: 8.0),
              Expanded(
                flex: 1,
                child: DropdownButtonFormField<String>(
                  value: _selectedWeightUnit,
                  decoration: const InputDecoration(labelText: 'Unit'),
                  items: _weightUnitOptions.map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedWeightUnit = newValue!;
                    });
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 32.0),
          FilledButton.icon(
            icon: const Icon(Icons.arrow_forward_ios_rounded),
            label: const Text('Next: Lifestyle'),
            onPressed: _submit,
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              textStyle: textTheme.labelLarge,
            ),
          ),
        ],
      ),
    );
  }
} 