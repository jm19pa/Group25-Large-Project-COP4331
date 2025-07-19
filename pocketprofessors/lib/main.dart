import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Replace with your real IP if testing on a physical device
const String baseUrl = 'http://www.pocketprofessors.com:5000/api';

// a lot of the comments on this page will be for me trying to understand it - T
void main() {
  // oo a main function
  runApp(const PocketProfessorsApp());
}

// stateless widget is a built-in class for dart?
class PocketProfessorsApp extends StatelessWidget {
  const PocketProfessorsApp({super.key});

  @override
  Widget build(BuildContext context) {
    // i guess this is made to build a thing
    return const MaterialApp(
      // material app is also a built-in thingy
      debugShowCheckedModeBanner: false, // ???
      home: AuthScreen(),
    );
  }
}

// the class for our register/login page
class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  // i have no clue what this is doing

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool showSignup = false;
  bool isLoading = false;
  String message = '';

  // register logic?
  final TextEditingController loginController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();

  // login function when a user attempts to login w/ an existing account
  Future<void> login() async {
    setState(() {
      isLoading = true;
      message = '';
    });

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'login': loginController.text,
          'password': passwordController.text,
        }),
      );

      final res = jsonDecode(response.body);
      if (res['id'] != null && res['id'].toString().isNotEmpty) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => HomePage(
              firstName: res['firstName'],
              lastName: res['lastName'],
              id: res['id'].toString(),
            ),
          ),
        );
      } else {
        setState(() {
          message = "❌ Login failed: ${res['error'] ?? 'Invalid credentials'}";
        });
      }
    } catch (e) {
      setState(() {
        message = '❌ Network error: $e';
      });
    } finally {
      setState(() => isLoading = false);
    }
  }

  // function to register a user that does not exist
  Future<void> register() async {
    setState(() {
      isLoading = true;
      message = '';
    });

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'login': loginController.text,
          'password': passwordController.text,
          'email': emailController.text,
          'firstName': firstNameController.text,
          'lastName': lastNameController.text,
        }),
      );

      final res = jsonDecode(response.body);
      if (res['id'] != null && res['id'].toString().isNotEmpty) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => HomePage(
              firstName: res['firstName'],
              lastName: res['lastName'],
              id: res['id'],
            ),
          ),
        );
      } else {
        setState(() {
          message = "❌ Registration failed: ${res['error'] ?? 'Unknown error'}";
        });
      }
    } catch (e) {
      setState(() {
        message = '❌ Network error: $e';
      });
    } finally {
      setState(() => isLoading = false);
    }
  }

  // the actual thing for a user to input something?
  Widget buildLoginForm() {
    return Column(
      children: [
        TextField(
          controller: loginController,
          decoration: const InputDecoration(labelText: 'Username'),
        ),
        TextField(
          controller: passwordController,
          decoration: const InputDecoration(labelText: 'Password'),
          obscureText: true, // as name implies, hides the text as a user inputs
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: isLoading ? null : login,
          child: isLoading
              ? const CircularProgressIndicator()
              : const Text('Login'),
        ),
      ],
    );
  }

  // i can only imagine this builds the signup form
  Widget buildSignupForm() {
    return Column(
      children: [
        TextField(
          controller: loginController,
          decoration: const InputDecoration(labelText: 'Username'),
        ),
        TextField(
          controller: passwordController,
          decoration: const InputDecoration(labelText: 'Password'),
          obscureText: true,
        ),
        TextField(
          controller: emailController,
          decoration: const InputDecoration(labelText: 'Email'),
        ),
        TextField(
          controller: firstNameController,
          decoration: const InputDecoration(labelText: 'First Name'),
        ),
        TextField(
          controller: lastNameController,
          decoration: const InputDecoration(labelText: 'Last Name'),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: isLoading ? null : register,
          child: isLoading
              ? const CircularProgressIndicator()
              : const Text('Register'),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pocket Professors')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            SwitchListTile(
              title: Text(
                showSignup ? 'Switch to Login' : 'Switch to Register',
              ),
              value: showSignup,
              onChanged: (val) => setState(() => showSignup = val),
            ),
            if (message.isNotEmpty)
              Text(message, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 10),
            Expanded(
              child: SingleChildScrollView(
                child: showSignup ? buildSignupForm() : buildLoginForm(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// we get here IF there is a valid user
class HomePage extends StatelessWidget {
  final String firstName;
  final String lastName;
  final String id;

  const HomePage({
    super.key,
    required this.firstName,
    required this.lastName,
    required this.id,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Home")),
      body: Center(child: Text('Welcome, $firstName $lastName (ID: $id)')),
    );
  }
}
