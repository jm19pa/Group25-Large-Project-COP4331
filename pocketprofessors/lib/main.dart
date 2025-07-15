// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';
// void main() {
// runApp(const MyApp());
// }
// class MyApp extends StatelessWidget {
// const MyApp({super.key});
// @override
// Widget build(BuildContext context) {
// return MaterialApp(
// title: 'Card Manager',
// theme: ThemeData(
// primarySwatch: Colors.blue,
// useMaterial3: true,
// ),
// home: const LoginPage(),
// );
// }
// }
// class LoginPage extends StatefulWidget {
// const LoginPage({super.key});
// @override
// State<LoginPage> createState() => _LoginPageState();
// }
// class _LoginPageState extends State<LoginPage> {
// final TextEditingController _loginController = TextEditingController();
// final TextEditingController _passwordController = TextEditingController();
// String _errorMessage = '';
// bool _isLoading = false;
// Future<void> _login() async {
// setState(() {
// _isLoading = true;
// _errorMessage = '';
// });
// try {
// final response = await http.post(
// Uri.parse('http://cop4331-5.com:5000/api/login'),
// headers: {'Content-Type': 'application/json'},
// body: jsonEncode({
// 'login': _loginController.text,
// 'password': _passwordController.text,
// }),
// );
// if (response.statusCode == 200) {
// final data = jsonDecode(response.body);
// if (data['error'] == null || data['error'].isEmpty) {
// // Login successful, navigate to second page
// if (mounted) {
// Navigator.pushReplacement(
// context,
// MaterialPageRoute(
// builder: (context) => CardManagerPage(
// userId: data['id'],
// firstName: data['firstName'],
// lastName: data['lastName'],
// ),
// ),
// );
// }
// } else {
// setState(() {
// _errorMessage = data['error'];
// });
// }
// } else {
// setState(() {
// _errorMessage = 'Login failed. Please try again.';
// });
// }
// } catch (e) {
// setState(() {
// _errorMessage = 'Network error. Please check your connection.';
// });
// } finally {
// setState(() {
// _isLoading = false;
// });
// }
// }
// @override
// Widget build(BuildContext context) {
// return Scaffold(
// body: Center(
// child: Padding(
// padding: const EdgeInsets.all(32.0),
// child: Column(
// mainAxisAlignment: MainAxisAlignment.center,
// crossAxisAlignment: CrossAxisAlignment.stretch,
// children: [
// const Text(
// 'Login',
// style: TextStyle(
// fontSize: 32,
// fontWeight: FontWeight.bold,
// ),
// textAlign: TextAlign.center,
// ),
// const SizedBox(height: 40),
// TextField(
// controller: _loginController,
// decoration: const InputDecoration(
// labelText: 'Login Name',
// border: OutlineInputBorder(),
// ),
// ),
// const SizedBox(height: 16),
// TextField(
// controller: _passwordController,
// obscureText: true,
// decoration: const InputDecoration(
// labelText: 'Password',
// border: OutlineInputBorder(),
// ),
// ),
// const SizedBox(height: 24),
// ElevatedButton(
// onPressed: _isLoading ? null : _login,
// style: ElevatedButton.styleFrom(
// padding: const EdgeInsets.symmetric(vertical: 16),
// ),
// child: _isLoading
// ? const CircularProgressIndicator()
// : const Text(
// 'Login',
// style: TextStyle(fontSize: 16),
// ),
// ),
// const SizedBox(height: 16),
// if (_errorMessage.isNotEmpty)
// Text(
// _errorMessage,
// style: const TextStyle(
// color: Colors.red,
// fontSize: 14,
// ),
// textAlign: TextAlign.center,
// ),
// ],
// ),
// ),
// ),
// );
// }
// @override
// void dispose() {
// _loginController.dispose();
// _passwordController.dispose();
// super.dispose();
// }
// }
// class CardManagerPage extends StatefulWidget {
// final int userId;
// final String firstName;
// final String lastName;
// const CardManagerPage({
// super.key,
// required this.userId,
// required this.firstName,
// required this.lastName,
// });
// @override
// State<CardManagerPage> createState() => _CardManagerPageState();
// }
// class _CardManagerPageState extends State<CardManagerPage> {
// final TextEditingController _searchController = TextEditingController();
// final TextEditingController _addCardController = TextEditingController();
// List<String> _searchResults = [];
// String _searchError = '';
// String _addCardError = '';
// String _addCardSuccess = '';
// bool _isSearching = false;
// bool _isAddingCard = false;
// Future<void> _searchCards() async {
// setState(() {
// _isSearching = true;
// _searchError = '';
// _searchResults = [];
// });
// try {
// final response = await http.post(
// Uri.parse('http://cop4331-5.com:5000/api/searchcards'),
// headers: {'Content-Type': 'application/json'},
// body: jsonEncode({
// 'userId': widget.userId.toString(),
// 'search': _searchController.text,
// }),
// );
// if (response.statusCode == 200) {
// final data = jsonDecode(response.body);
// if (data['error'] == null || data['error'].isEmpty) {
// setState(() {
// _searchResults = List<String>.from(data['results'] ?? []);
// });
// } else {
// setState(() {
// _searchError = data['error'];
// });
// }
// } else {
// setState(() {
// _searchError = 'Search failed. Please try again.';
// });
// }
// } catch (e) {
// setState(() {
// _searchError = 'Network error. Please check your connection.';
// });
// } finally {
// setState(() {
// _isSearching = false;
// });
// }
// }
// Future<void> _addCard() async {
// setState(() {
// _isAddingCard = true;
// _addCardError = '';
// _addCardSuccess = '';
// });
// try {
// final response = await http.post(
// Uri.parse('http://cop4331-5.com:5000/api/addcard'),
// headers: {'Content-Type': 'application/json'},
// body: jsonEncode({
// 'userId': widget.userId,
// 'card': _addCardController.text,
// }),
// );
// if (response.statusCode == 200) {
// final data = jsonDecode(response.body);
// if (data['error'] == null || data['error'].isEmpty) {
// setState(() {
// _addCardSuccess = 'Card added successfully!';
// _addCardController.clear();
// });
// } else {
// setState(() {
// _addCardError = data['error'];
// });
// }
// } else {
// setState(() {
// _addCardError = 'Failed to add card. Please try again.';
// });
// }
// } catch (e) {
// setState(() {
// _addCardError = 'Network error. Please check your connection.';
// });
// } finally {
// setState(() {
// _isAddingCard = false;
// });
// }
// }
// @override
// Widget build(BuildContext context) {
// return Scaffold(
// appBar: AppBar(
// title: Text('Welcome, ${widget.firstName} ${widget.lastName}'),
// automaticallyImplyLeading: false,
// ),
// body: Padding(
// padding: const EdgeInsets.all(16.0),
// child: Column(
// crossAxisAlignment: CrossAxisAlignment.stretch,
// children: [
// // Search Section
// Card(
// child: Padding(
// padding: const EdgeInsets.all(16.0),
// child: Column(
// crossAxisAlignment: CrossAxisAlignment.stretch,
// children: [
// const Text(
// 'Search Cards',
// style: TextStyle(
// fontSize: 18,
// fontWeight: FontWeight.bold,
// ),
// ),
// const SizedBox(height: 12),
// Row(
// children: [
// Expanded(
// child: TextField(
// controller: _searchController,
// decoration: const InputDecoration(
// labelText: 'Search term',
// border: OutlineInputBorder(),
// ),
// ),
// ),
// const SizedBox(width: 12),
// ElevatedButton(
// onPressed: _isSearching ? null : _searchCards,
// child: _isSearching
// ? const SizedBox(
// width: 20,
// height: 20,
// child: CircularProgressIndicator(strokeWidth: 2),
// )
// : const Text('Search'),
// ),
// ],
// ),
// if (_searchError.isNotEmpty) ...[
// const SizedBox(height: 8),
// Text(
// _searchError,
// style: const TextStyle(color: Colors.red),
// ),
// ],
// ],
// ),
// ),
// ),
// // Search Results
// if (_searchResults.isNotEmpty) ...[
// const SizedBox(height: 16),
// const Text(
// 'Search Results:',
// style: TextStyle(
// fontSize: 16,
// fontWeight: FontWeight.bold,
// ),
// ),
// const SizedBox(height: 8),
// Expanded(
// child: ListView.builder(
// itemCount: _searchResults.length,
// itemBuilder: (context, index) {
// return Card(
// child: ListTile(
// title: Text(_searchResults[index]),
// ),
// );
// },
// ),
// ),
// ] else ...[
// // Add Card Section
// const SizedBox(height: 16),
// Card(
// child: Padding(
// padding: const EdgeInsets.all(16.0),
// child: Column(
// crossAxisAlignment: CrossAxisAlignment.stretch,
// children: [
// const Text(
// 'Add Card',
// style: TextStyle(
// fontSize: 18,
// fontWeight: FontWeight.bold,
// ),
// ),
// const SizedBox(height: 12),
// Row(
// children: [
// Expanded(
// child: TextField(
// controller: _addCardController,
// decoration: const InputDecoration(
// labelText: 'Card name',
// border: OutlineInputBorder(),
// ),
// ),
// ),
// const SizedBox(width: 12),
// ElevatedButton(
// onPressed: _isAddingCard ? null : _addCard,
// child: _isAddingCard
// ? const SizedBox(
// width: 20,
// height: 20,
// child: CircularProgressIndicator(strokeWidth: 2),
// )
// : const Text('Add Card'),
// ),
// ],
// ),
// if (_addCardError.isNotEmpty) ...[
// const SizedBox(height: 8),
// Text(
// _addCardError,
// style: const TextStyle(color: Colors.red),
// ),
// ],
// if (_addCardSuccess.isNotEmpty) ...[
// const SizedBox(height: 8),
// Text(
// _addCardSuccess,
// style: const TextStyle(color: Colors.green),
// ),
// ],
// ],
// ),
// ),
// ),
// const Spacer(),
// ],
// ],
// ),
// ),
// );
// }
// @override
// void dispose() {
// _searchController.dispose();
// _addCardController.dispose();
// super.dispose();
// }
// }
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Replace with your real IP if testing on a physical device
const String baseUrl = 'http://www.pocketprofessors.com:5000/api';

void main() { 
  runApp(const PocketProfessorsApp());
}

class PocketProfessorsApp extends StatelessWidget {
  const PocketProfessorsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: AuthScreen(),
    );
  }
}

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool showSignup = false;
  bool isLoading = false;
  String message = '';

  final TextEditingController loginController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();

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
          obscureText: true,
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
              title: Text(showSignup ? 'Switch to Login' : 'Switch to Register'),
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
      body: Center(
        child: Text('Welcome, $firstName $lastName (ID: $id)'),
      ),
    );
  }
}
