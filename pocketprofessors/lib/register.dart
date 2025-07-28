import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'cardPage.dart';
import 'verifyEmail.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

Future<void> doLogin(
  BuildContext context,
  String login,
  String password,
) async {
  // Basic blank check
  if (login.trim().isEmpty || password.trim().isEmpty) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text("Missing Fields"),
        content: Text("Please fill in both login and password."),
      ),
    );
    return;
  }

  final obj = {'login': login, 'password': password};

  try {
    final res = await http.post(
      Uri.parse(
        'http://www.pocketprofessors.com/api/login',
      ), // change to buildPath
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(obj),
    );

    final body = jsonDecode(res.body);
    debugPrint("🟢 Login response: $body");

    final jwtToken = body['jwtToken'];
    if (jwtToken == null) {
      debugPrint("❌ No jwtToken in response.");
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: Text("Login Failed"),
          content: Text("User/Password combination incorrect"),
        ),
      );
      return;
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', jwtToken);
    debugPrint("✅ Stored token: $jwtToken");

    final decoded = JwtDecoder.decode(jwtToken);
    final userId = decoded['userId'];
    final firstName = decoded['firstName'];
    final lastName = decoded['lastName'];

    if (userId == "") {
      // change later
      // WE ARE CRASHING HERE
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: Text("Login Failed"),
          content: Text("User/Password combination incorrect"),
        ),
      );
    } else {
      final userData = {
        'firstName': firstName,
        'lastName': lastName,
        'id': userId,
      };
      await prefs.setString('user_data', jsonEncode(userData));
      debugPrint("🔍 Stored user: $userData");

      // Navigate to pack page
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => CardPage()),
      );
    }
  } catch (e) {
    debugPrint("❗ Login error: $e");
    showDialog(
      context: context,
      builder: (_) =>
          AlertDialog(title: Text("Error"), content: Text(e.toString())),
    );
  }
}

bool passwordComplexity({
  required String value,
  required FocusNode inputFocusNode,
  required GlobalKey<FormFieldState> fieldKey,
  required BuildContext context,
}) {
  final length = value.length;

  if (length < 8 || length > 20) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Password Error"),
        content: const Text("Make sure password is 8 to 20 characters"),
      ),
    );
    inputFocusNode.requestFocus();
    return false;
  }

  final specialCharacters = ['!', '@', '#', '\$', '%', '&', '*', '(', ')'];
  final hasSpecial = specialCharacters.any((char) => value.contains(char));

  if (!hasSpecial) {
    showDialog(
      context: context,
      builder: (_) => const AlertDialog(
        title: Text("Password Error"),
        content: Text(
          "Make sure password contains a special character, ex: !, @, &",
        ),
      ),
    );
    inputFocusNode.requestFocus();
    return false;
  }

  return true;
}

Future<void> doRegister(
  BuildContext context, {
  required String login,
  required String password,
  required String email,
  required String firstName,
  required String lastName,
}) async {
  // Basic blank check (you can expand this like your checkBlank function)
  if (login.isEmpty ||
      password.isEmpty ||
      email.isEmpty ||
      firstName.isEmpty ||
      lastName.isEmpty) {
    print("Please fill in all fields.");
    return;
  }

  final uri = Uri.parse('http://pocketprofessors.com/api/register');
  final body = jsonEncode({
    "login": login,
    "firstName": firstName,
    "lastName": lastName,
    "password": password,
    "email": email,
  });

  try {
    final response = await http.post(
      uri,
      headers: {"Content-Type": "application/json"},
      body: body,
    );

    print("Response Code: ${response.statusCode}");
    print("Response Body: ${response.body}");

    final res = jsonDecode(response.body);

    if (res["error"] != "") {
      print("Registration Error: ${res["error"]}");
    } else {
      // Save data to local storage
      final userData = {
        "firstName": res["firstName"],
        "lastName": res["lastName"],
        "id": res["id"],
      };

      // Use shared_preferences for persistent storage
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("user_data", jsonEncode(userData));
      await prefs.setString("verify_email", email);

      // Navigate to the verify screen
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => VerifyEmailPage()),
      );
    }
  } catch (e) {
    print("Exception during registration: $e");
  }
}

class _RegisterPageState extends State<RegisterPage> {
  bool showSignup = false;
  bool showPassword = false;

  final _loginController = TextEditingController();
  final _passwordController = TextEditingController();
  final _emailController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final FocusNode _passwordFocus = FocusNode();
  final GlobalKey<FormFieldState> _passwordKey = GlobalKey<FormFieldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF030303),
      body: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight),
              child: Center(
                child: Container(
                  width: 600,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A1A1A),
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: const [
                      BoxShadow(color: Colors.grey, blurRadius: 5),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'WELCOME',
                        style: TextStyle(color: Colors.white, fontSize: 24),
                      ),
                      const SizedBox(height: 20),
                      // Toggle Switch
                      Container(
                        width: 250,
                        height: 50,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(34),
                          color: Colors.white,
                        ),
                        child: Stack(
                          children: [
                            AnimatedAlign(
                              alignment: showSignup
                                  ? Alignment.centerRight
                                  : Alignment.centerLeft,
                              duration: const Duration(milliseconds: 300),
                              child: Container(
                                width: 125,
                                height: 50,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(34),
                                  color: const Color(0xFFFFD700),
                                ),
                              ),
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: TextButton(
                                    onPressed: () =>
                                        setState(() => showSignup = false),
                                    child: const Text(
                                      "Login",
                                      style: TextStyle(color: Colors.black),
                                    ),
                                  ),
                                ),
                                Expanded(
                                  child: TextButton(
                                    onPressed: () =>
                                        setState(() => showSignup = true),
                                    child: const Text(
                                      "Signup",
                                      style: TextStyle(color: Colors.black),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      showSignup ? _buildSignupForm() : _buildLoginForm(),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    bool isPassword = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextField(
        controller: controller,
        obscureText: isPassword && !showPassword,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: Colors.white),
          fillColor: const Color(0xFF000000),
          filled: true,
          suffixIcon: isPassword
              ? IconButton(
                  icon: Icon(
                    showPassword ? Icons.visibility : Icons.visibility_off,
                    color: Colors.white,
                  ),
                  onPressed: () => setState(() => showPassword = !showPassword),
                )
              : null,
          border: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.white),
            borderRadius: BorderRadius.circular(5),
          ),
        ),
        style: const TextStyle(color: Colors.white),
      ),
    );
  }

  Widget _buildLoginForm() {
    return Column(
      children: [
        _buildTextField('Username', _loginController),
        _buildTextField('Password', _passwordController, isPassword: true),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {
            doLogin(context, _loginController.text, _passwordController.text);
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFFFD700), // --primary
            foregroundColor: Colors.black,
          ),
          child: const Text('Submit'),
        ),
      ],
    );
  }

  Widget _buildSignupForm() {
    return Column(
      children: [
        _buildTextField('Username', _loginController),
        _buildTextField('Password', _passwordController, isPassword: true),
        _buildTextField('Email', _emailController),
        _buildTextField('First Name', _firstNameController),
        _buildTextField('Last Name', _lastNameController),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {
            if (!passwordComplexity(
              value: _passwordController.text,
              inputFocusNode: _passwordFocus,
              fieldKey: _passwordKey,
              context: context,
            )) {
              return;
            }
            doRegister(
              context,
              login: _loginController.text,
              password: _passwordController.text,
              email: _emailController.text,
              firstName: _firstNameController.text,
              lastName: _lastNameController.text,
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFFFD700),
            foregroundColor: Colors.black,
          ),
          child: const Text('Submit'),
        ),
      ],
    );
  }
}
