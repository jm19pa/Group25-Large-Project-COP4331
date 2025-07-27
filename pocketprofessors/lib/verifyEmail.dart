import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class VerifyEmailPage extends StatefulWidget {
  const VerifyEmailPage({super.key});

  @override
  State<VerifyEmailPage> createState() => _VerifyEmailPageState();
}

class _VerifyEmailPageState extends State<VerifyEmailPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController codeController = TextEditingController();

  Future<void> handleSendCode() async {
    final obj = {'email': emailController.text};

    final url = Uri.parse('http://www.pocketprofessors.com/api/Verify');
    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode(obj),
    );

    final jsonRes = json.decode(res.body);
    if (jsonRes['success'] == true) {
      _showAlert('Verification code sent to ${emailController.text}');
    } else {
      _showAlert('Failed to send code: ${jsonRes['error']}');
    }
  }

  Future<void> handleVerify() async {
    final obj = {
      'email': emailController.text,
      'verificationCode': codeController.text,
    };

    final url = Uri.parse('http://www.pocketprofessors.com/api/Confirm');
    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode(obj),
    );

    final jsonRes = json.decode(res.body);
    if (jsonRes['success'] == true) {
      _showAlert('Email verified successfully!');
      Navigator.pushReplacementNamed(context, '/login');
    } else {
      _showAlert('Verification failed: ${jsonRes['error']}');
    }
  }

  void _showAlert(String message) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: Colors.grey[900],
        title: const Text('Info', style: TextStyle(color: Colors.white)),
        content: Text(message, style: const TextStyle(color: Colors.white)),
        actions: [
          TextButton(
            child: const Text("OK", style: TextStyle(color: Colors.amber)),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF030303),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 48.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Verify your Email",
              style: TextStyle(fontSize: 26, color: Colors.white),
            ),
            const SizedBox(height: 8),
            const Text(
              "Re-enter your email for verification",
              style: TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: emailController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: "Email",
                labelStyle: TextStyle(color: Colors.white),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white24),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.amber),
                ),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: handleSendCode,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.amber),
              child: const Text(
                "Send Code",
                style: TextStyle(color: Colors.black),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              "Enter the 6-digit code sent to ${emailController.text}",
              style: const TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: codeController,
              keyboardType: TextInputType.number,
              maxLength: 6,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: "Verification Code",
                labelStyle: TextStyle(color: Colors.white),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white24),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.amber),
                ),
                counterText: '',
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: handleVerify,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.amber),
              child: const Text(
                "Verify Email",
                style: TextStyle(color: Colors.black),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
