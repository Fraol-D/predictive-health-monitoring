import 'package:flutter/material.dart';

class Step2Diet extends StatefulWidget {
  final Function(Map<String, dynamic> data) onNext;
  final VoidCallback onPrev;
  final Map<String, dynamic>? initialData;

  const Step2Diet({
    super.key,
    required this.onNext,
    required this.onPrev,
    this.initialData,
  });

  @override
  State<Step2Diet> createState() => _Step2DietState();
}

class _Step2DietState extends State<Step2Diet> {
  final _formKey = GlobalKey<FormState>();

  String? _fruitVegFrequency;
  String? _processedFoodFrequency;
  late TextEditingController _waterIntakeController;
  List<String> _selectedDietaryRestrictions = [];
  late TextEditingController _notesController;

  final List<String> _frequencyOptions = ['Daily', 'Multiple times a week', 'Once a week', 'Rarely', 'Never'];
  final Map<String, String> _frequencyMap = {
    'Daily': 'daily',
    'Multiple times a week': 'multiple_times_week',
    'Once a week': 'once_week',
    'Rarely': 'rarely',
    'Never': 'never',
  };
  final List<String> _restrictionOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low Carb'];

  @override
  void initState() {
    super.initState();
    // Find the display key that matches the stored data value
    String? initialFruitVegDisplayKey;
    if (widget.initialData?['fruitVegFrequency'] != null) {
      initialFruitVegDisplayKey = _frequencyMap.entries.firstWhere((entry) => entry.value == widget.initialData!['fruitVegFrequency'], orElse: () => const MapEntry('', '')).key;
    }
    _fruitVegFrequency = initialFruitVegDisplayKey;

    String? initialProcessedFoodDisplayKey;
    if (widget.initialData?['processedFoodFrequency'] != null) {
      initialProcessedFoodDisplayKey = _frequencyMap.entries.firstWhere((entry) => entry.value == widget.initialData!['processedFoodFrequency'], orElse: () => const MapEntry('', '')).key;
    }
    _processedFoodFrequency = initialProcessedFoodDisplayKey;

    _waterIntakeController = TextEditingController(text: widget.initialData?['waterIntakeLiters']?.toString() ?? '2.0');
    _selectedDietaryRestrictions = List<String>.from(widget.initialData?['dietaryRestrictions'] ?? []);
    _notesController = TextEditingController(text: widget.initialData?['notes'] ?? '');

    // Ensure initial dropdown values are valid (i.e., one of the _frequencyOptions) or null
    if (_fruitVegFrequency != null && !_frequencyOptions.contains(_fruitVegFrequency)) _fruitVegFrequency = null;
    if (_processedFoodFrequency != null && !_frequencyOptions.contains(_processedFoodFrequency)) _processedFoodFrequency = null;
  }

  @override
  void dispose() {
    _waterIntakeController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      widget.onNext({
        'fruitVegFrequency': _fruitVegFrequency != null ? _frequencyMap[_fruitVegFrequency] : null,
        'processedFoodFrequency': _processedFoodFrequency != null ? _frequencyMap[_processedFoodFrequency] : null,
        'waterIntakeLiters': _waterIntakeController.text,
        'dietaryRestrictions': _selectedDietaryRestrictions,
        'notes': _notesController.text,
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final colorScheme = Theme.of(context).colorScheme;

    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        children: <Widget>[
          Text(
            'Step 2: Dietary Habits',
            style: textTheme.headlineSmall?.copyWith(color: colorScheme.primary, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Please tell us about your typical diet.',
            style: textTheme.bodyMedium?.copyWith(color: colorScheme.onSurfaceVariant),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24.0),

          // Fruit and Vegetable Frequency
          DropdownButtonFormField<String>(
            value: _fruitVegFrequency,
            decoration: const InputDecoration(labelText: 'Fruits & Vegetables Frequency', prefixIcon: Icon(Icons.eco_outlined)),
            items: _frequencyOptions.map((String value) {
              return DropdownMenuItem<String>(value: value, child: Text(value));
            }).toList(),
            onChanged: (String? newValue) => setState(() => _fruitVegFrequency = newValue),
            validator: (value) => value == null ? 'Please select a frequency.' : null,
          ),
          const SizedBox(height: 16.0),

          // Processed Food Frequency
          DropdownButtonFormField<String>(
            value: _processedFoodFrequency,
            decoration: const InputDecoration(labelText: 'Processed Foods Frequency', prefixIcon: Icon(Icons.fastfood_outlined)),
            items: _frequencyOptions.map((String value) {
              return DropdownMenuItem<String>(value: value, child: Text(value));
            }).toList(),
            onChanged: (String? newValue) => setState(() => _processedFoodFrequency = newValue),
            validator: (value) => value == null ? 'Please select a frequency.' : null,
          ),
          const SizedBox(height: 16.0),

          // Water Intake
          TextFormField(
            controller: _waterIntakeController,
            decoration: const InputDecoration(labelText: 'Average Daily Water Intake (Liters)', prefixIcon: Icon(Icons.water_drop_outlined)),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            validator: (value) {
              if (value == null || value.isEmpty) return 'Please enter water intake.';
              if (double.tryParse(value) == null || double.parse(value) < 0) return 'Please enter a valid amount.';
              return null;
            },
          ),
          const SizedBox(height: 24.0),

          // Dietary Restrictions
          Text('Dietary Restrictions (select all that apply):', style: textTheme.titleSmall?.copyWith(color: colorScheme.onSurfaceVariant)),
          const SizedBox(height: 8.0),
          Wrap(
            spacing: 8.0,
            runSpacing: 4.0,
            children: _restrictionOptions.map((restriction) {
              final bool isSelected = _selectedDietaryRestrictions.contains(restriction);
              return FilterChip(
                label: Text(restriction),
                selected: isSelected,
                onSelected: (bool selected) {
                  setState(() {
                    if (selected) {
                      _selectedDietaryRestrictions.add(restriction);
                    } else {
                      _selectedDietaryRestrictions.remove(restriction);
                    }
                  });
                },
                checkmarkColor: isSelected ? colorScheme.onPrimaryContainer : null,
                selectedColor: colorScheme.primaryContainer,
                backgroundColor: colorScheme.surfaceVariant.withOpacity(0.5),
                shape: StadiumBorder(side: BorderSide(color: isSelected ? colorScheme.primary : colorScheme.outline, width: 0.8)),
              );
            }).toList(),
          ),
          const SizedBox(height: 24.0),

          // Notes about Diet
          TextFormField(
            controller: _notesController,
            decoration: const InputDecoration(labelText: 'Other Dietary Notes (Optional)', prefixIcon: Icon(Icons.notes_outlined), border: OutlineInputBorder()),
            maxLines: 3,
            textInputAction: TextInputAction.done,
          ),
          const SizedBox(height: 32.0),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              OutlinedButton.icon(
                icon: const Icon(Icons.arrow_back_ios_new_rounded),
                label: const Text('Previous'),
                onPressed: widget.onPrev,
                style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12)),
              ),
              FilledButton.icon(
                icon: const Icon(Icons.arrow_forward_ios_rounded),
                label: const Text('Next: Activity'),
                onPressed: _submit,
                style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16)),
              ),
            ],
          ),
        ],
      ),
    );
  }
} 