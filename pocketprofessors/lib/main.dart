import 'package:flutter/material.dart';
import 'register.dart';

void main() {
  runApp(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LandingPage(
        onTap: () {
          print("Tapped landing!");
          // You can navigate here later
        },
      ),
    ),
  );
}

class LandingPage extends StatelessWidget {
  final VoidCallback onTap;

  const LandingPage({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const RegisterPage()),
        );
      },
      child: Scaffold(
        body: Container(
          width: double.infinity,
          height: double.infinity,
          decoration: BoxDecoration(
            color: Color(0xFF030303), // solid dark background
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Pocket',
                    style: TextStyle(
                      fontFamily: 'Georgia',
                      fontSize: MediaQuery.of(context).size.width * 0.15,
                      foreground: Paint()
                        ..style = PaintingStyle.stroke
                        ..strokeWidth = 2
                        ..color = Color(0xFFFFD700),
                      shadows: [
                        Shadow(color: Color(0x99FFD700), blurRadius: 4),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 28.0),
                    child: Text(
                      'Professors',
                      style: TextStyle(
                        fontFamily: 'Georgia',
                        fontSize: MediaQuery.of(context).size.width * 0.15,
                        foreground: Paint()
                          ..style = PaintingStyle.stroke
                          ..strokeWidth = 2
                          ..color = Color(0xFFFFD700),
                        shadows: [
                          Shadow(color: Color(0x99FFD700), blurRadius: 4),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 20),
              Text(
                'NOW YOU CAN TEACH CLASS THE WAY YOU WANT TO',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white,
                  fontFamily: 'Times New Roman',
                  fontSize: 18,
                ),
              ),
              SizedBox(height: 40),
              TweenAnimationBuilder(
                tween: Tween<double>(begin: 0.1, end: 1),
                duration: Duration(seconds: 1),
                curve: Curves.easeInOut,
                builder: (context, value, child) => Opacity(
                  opacity: value,
                  child: Text(
                    'tap anywhere to log in',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                  ),
                ),
                onEnd: () {},
              ),
            ],
          ),
        ),
      ),
    );
  }
}
