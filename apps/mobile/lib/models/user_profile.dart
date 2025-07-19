class UserProfile {
  final String? id;
  final String firebaseUID;
  final String name;
  final String email;
  final int? age;
  final String? gender;
  final String? profileImage;
  final DateTime? createdAt;

  UserProfile({
    this.id,
    required this.firebaseUID,
    required this.name,
    required this.email,
    this.age,
    this.gender,
    this.profileImage,
    this.createdAt,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['_id'],
      firebaseUID: json['firebaseUID'],
      name: json['name'],
      email: json['email'],
      age: json['age'],
      gender: json['gender'],
      profileImage: json['profileImage'],
      createdAt:
          json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    );
  }
}
