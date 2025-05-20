import 'package:flutter/material.dart';

class Step3Lifestyle extends StatefulWidget {
  final Function(Map<String, dynamic> data) onNext;
  final VoidCallback onPrev;
  final Map<String, dynamic>? initialData;

  const Step3Lifestyle({
    super.key,
    required this.onNext,
    required this.onPrev,
    this.initialData,
  });

  @override
  State<Step3Lifestyle> createState() => _Step3LifestyleState();
}

class _Step3LifestyleState extends State<Step3Lifestyle> {
  final _formKey = GlobalKey<FormState>();

  String? _physicalActivityFrequency;
  late TextEditingController _physicalActivityDurationController;
  late TextEditingController _sleepHoursController;
  String? _stressLevel;
  String? _smokingStatus;
  String? _alcoholConsumption;
  late TextEditingController _notesController;

  final List<String> _frequencyOptions = ['Daily', 'Multiple times a week', 'Once a week', 'Rarely', 'Never'];
  final List<String> _stressOptions = ['Low', 'Moderate', 'High', 'Very High'];
  final List<String> _smokingOptions = ['Never Smoked', 'Former Smoker', 'Current Light Smoker', 'Current Heavy Smoker'];
  final List<String> _alcoholOptions = ['None / Rarely', 'Occasional', 'Moderate', 'Heavy'];

  // For mapping display values to data values if needed (like web version)
  final Map<String, String> _frequencyValueMap = {
    'Daily': 'daily', 'Multiple times a week': 'multiple_times_week', 'Once a week': 'once_week', 'Rarely': 'rarely', 'Never': 'never'
  };
  final Map<String, String> _stressValueMap = {
    'Low': 'low', 'Moderate': 'moderate', 'High': 'high', 'Very High': 'very_high'
  };
  final Map<String, String> _smokingValueMap = {
    'Never Smoked': 'never', 'Former Smoker': 'former', 'Current Light Smoker': 'current_light', 'Current Heavy Smoker': 'current_heavy'
  };
  final Map<String, String> _alcoholValueMap = {
    'None / Rarely': 'none', 'Occasional': 'occasional', 'Moderate': 'moderate', 'Heavy': 'heavy'
  };


  @override
  void initState() {
    super.initState();
    _physicalActivityFrequency = widget.initialData?['physicalActivityFrequency'] != null ? _frequencyValueMap.entries.firstWhere((e) => e.value == widget.initialData!['physicalActivityFrequency'], orElse: () => const MapEntry('', '')).key : null;
    _physicalActivityDurationController = TextEditingController(text: widget.initialData?['physicalActivityDurationMinutes']?.toString() ?? '');
    _sleepHoursController = TextEditingController(text: widget.initialData?['sleepHoursPerNight']?.toString() ?? '');
    _stressLevel = widget.initialData?['stressLevel'] != null ? _stressValueMap.entries.firstWhere((e) => e.value == widget.initialData!['stressLevel'], orElse: () => const MapEntry('', '')).key : null;
    _smokingStatus = widget.initialData?['smokingStatus'] != null ? _smokingValueMap.entries.firstWhere((e) => e.value == widget.initialData!['smokingStatus'], orElse: () => const MapEntry('', '')).key : null;
    _alcoholConsumption = widget.initialData?['alcoholConsumption'] != null ? _alcoholValueMap.entries.firstWhere((e) => e.value == widget.initialData!['alcoholConsumption'], orElse: () => const MapEntry('', '')).key : null;
    _notesController = TextEditingController(text: widget.initialData?['notes'] ?? '');
  }

  @override
  void dispose() {
    _physicalActivityDurationController.dispose();
    _sleepHoursController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      widget.onNext({
        'physicalActivityFrequency': _physicalActivityFrequency != null ? _frequencyValueMap[_physicalActivityFrequency!] : null,
        'physicalActivityDurationMinutes': _physicalActivityDurationController.text,
        'sleepHoursPerNight': _sleepHoursController.text,
        'stressLevel': _stressLevel != null ? _stressValueMap[_stressLevel!] : null,
        'smokingStatus': _smokingStatus != null ? _smokingValueMap[_smokingStatus!] : null,
        'alcoholConsumption': _alcoholConsumption != null ? _alcoholValueMap[_alcoholConsumption!] : null,
        'notes': _notesController.text,
      });
    }
  }

  Widget _buildDropdown(String? currentValue, String label, IconData icon, List<String> options, Function(String?) onChanged, String? Function(String?) validator) {
    return DropdownButtonFormField<String>(
      value: currentValue,
      decoration: InputDecoration(labelText: label, prefixIcon: Icon(icon)),
      items: options.map((String value) {
        return DropdownMenuItem<String>(value: value, child: Text(value));
      }).toList(),
      onChanged: onChanged,
      validator: validator,
    );
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
            'Step 3: Lifestyle Factors',
            style: textTheme.headlineSmall?.copyWith(color: colorScheme.primary, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Your daily habits and lifestyle choices are important indicators.',
            style: textTheme.bodyMedium?.copyWith(color: colorScheme.onSurfaceVariant),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24.0),

          _buildDropdown(_physicalActivityFrequency, 'Physical Activity Frequency', Icons.fitness_center_outlined, _frequencyOptions, 
            (val) => setState(() => _physicalActivityFrequency = val), 
            (val) => val == null ? 'Please select frequency.' : null
          ),
          const SizedBox(height: 16.0),
          TextFormField(
            controller: _physicalActivityDurationController,
            decoration: const InputDecoration(labelText: 'Avg. Duration per Session (minutes, optional)', prefixIcon: Icon(Icons.timer_outlined)),
            keyboardType: TextInputType.text, // Allows for ranges like "30-60"
          ),
          const SizedBox(height: 16.0),
          TextFormField(
            controller: _sleepHoursController,
            decoration: const InputDecoration(labelText: 'Avg. Sleep per Night (hours)', prefixIcon: Icon(Icons.bedtime_outlined)),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            validator: (value) {
              if (value == null || value.isEmpty) return 'Please enter sleep hours.';
              final num sleep = num.tryParse(value) ?? -1;
              if (sleep <= 0 || sleep > 20) return 'Enter valid sleep hours (1-20).';
              return null;
            },
          ),
          const SizedBox(height: 16.0),
          _buildDropdown(_stressLevel, 'General Stress Level', Icons.sentiment_very_dissatisfied_outlined, _stressOptions, 
            (val) => setState(() => _stressLevel = val), 
            (val) => val == null ? 'Please select stress level.' : null
          ),
          const SizedBox(height: 16.0),
           _buildDropdown(_smokingStatus, 'Smoking Status', Icons.smoking_rooms_outlined, _smokingOptions, 
            (val) => setState(() => _smokingStatus = val), 
            (val) => val == null ? 'Please select smoking status.' : null
          ),
          const SizedBox(height: 16.0),
          _buildDropdown(_alcoholConsumption, 'Alcohol Consumption', Icons.local_bar_outlined, _alcoholOptions, 
            (val) => setState(() => _alcoholConsumption = val), 
            (val) => val == null ? 'Please select alcohol consumption.' : null
          ),
          const SizedBox(height: 24.0),
          TextFormField(
            controller: _notesController,
            decoration: const InputDecoration(labelText: 'Additional Lifestyle Notes (Optional)', prefixIcon: Icon(Icons.notes_outlined), border: OutlineInputBorder()),
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
                label: const Text('Next: Symptoms'), // Or 'Finish' if it's the last step
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