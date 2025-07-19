import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:predictive_health_monitoring/services/auth_service.dart';
import 'package:predictive_health_monitoring/models/user_profile.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  _EditProfileScreenState createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late Future<UserProfile?> _userProfileFuture;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _ageController = TextEditingController();
  final TextEditingController _genderController = TextEditingController();

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // Use addPostFrameCallback to access the provider safely in initState
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _userProfileFuture = _fetchUserProfile();
      setState(() {});
    });
  }

  Future<UserProfile?> _fetchUserProfile() async {
    final user = Provider.of<AuthService>(context, listen: false).currentUser;
    if (user == null) return null;

    try {
      final response = await http.get(
          Uri.parse('http://10.0.2.2:3001/api/users/firebase/${user.uid}'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final profile = UserProfile.fromJson(data);
        _nameController.text = profile.name;
        _ageController.text = profile.age?.toString() ?? '';
        _genderController.text = profile.gender ?? '';
        return profile;
      } else if (response.statusCode == 404) {
        _nameController.text = user.displayName ?? '';
        return UserProfile(
          firebaseUID: user.uid,
          name: user.displayName ?? '',
          email: user.email!,
        );
      } else {
        throw Exception('Failed to load profile');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to fetch profile: ${e.toString()}')));
      return null;
    }
  }

  Future<void> _saveProfile() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      final user = Provider.of<AuthService>(context, listen: false).currentUser;
      if (user == null) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('No user signed in')));
        setState(() => _isLoading = false);
        return;
      }

      final profile = await _userProfileFuture;

      final profileData = {
        'firebaseUID': user.uid,
        'email': user.email,
        'name': _nameController.text,
        'age': int.tryParse(_ageController.text),
        'gender': _genderController.text,
      };

      try {
        http.Response response;

        if (profile != null && profile.id != null) {
          response = await http.patch(
            Uri.parse('http://10.0.2.2:3001/api/users/${profile.id}'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(profileData),
          );
        } else {
          response = await http.post(
            Uri.parse('http://10.0.2.2:3001/api/users'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(profileData),
          );
        }

        if (response.statusCode == 200 || response.statusCode == 201) {
          ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Profile saved successfully!')));
          Navigator.of(context).pop(true); // Return true to indicate success
        } else {
          throw Exception(
              'Failed to save profile. Status code: ${response.statusCode}');
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error saving profile: ${e.toString()}')));
      } finally {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
      ),
      body: FutureBuilder<UserProfile?>(
        future: _userProfileFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting &&
              _nameController.text.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return const Center(child: Text('Could not load profile data.'));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                        labelText: 'Name', border: OutlineInputBorder()),
                    validator: (value) =>
                        value!.isEmpty ? 'Please enter your name' : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _ageController,
                    decoration: const InputDecoration(
                        labelText: 'Age', border: OutlineInputBorder()),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _genderController,
                    decoration: const InputDecoration(
                        labelText: 'Gender', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 32),
                  _isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          onPressed: _saveProfile,
                          child: const Text('Save Profile'),
                        ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
