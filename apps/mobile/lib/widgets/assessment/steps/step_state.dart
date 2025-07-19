import 'package:flutter/material.dart';

abstract class AssessmentStepState<T extends StatefulWidget> extends State<T> {
  bool validateAndSave();
} 