import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;

class CardPage extends StatefulWidget {
  const CardPage({super.key});

  @override
  State<CardPage> createState() => _CardPageState();
}

class _CardPageState extends State<CardPage> with TickerProviderStateMixin {
  bool shaking = false;
  bool showPoof = false;
  bool showCards = false;
  List<String> cardImages = [];

  Future<List<String>> openCardPack() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataRaw = prefs.getString('user_data');
    final tokenRaw = prefs.getString('token');

    if (userDataRaw == null || tokenRaw == null) {
      print('Missing user_data or token_data');
      print("Prefs = " + prefs.toString());
      print("User Data Raw = " + userDataRaw.toString());
      print("Token Data Raw = " + tokenRaw.toString());
      return [];
    }

    final userData = json.decode(userDataRaw);
    final userId = userData['id'];
    final jwtToken = tokenRaw;
    const packName = "BaseSet";

    final url = Uri.parse("http://pocketprofessors.com/api/openPack");

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: json.encode({
          "userId": userId,
          "jwtToken": jwtToken,
          "packName": packName,
        }),
      );

      if (response.statusCode != 200 || response.body.isEmpty) {
        print('Bad response: ${response.statusCode}');
        return [];
      }

      final result = json.decode(response.body);
      if (result['error'] == null) {
        print("Pack error: ${result['error'].toString()}");
        return [];
      }

      // Save new token
      prefs.setString("token_data", result["jwtToken"]["accessToken"]);

      // Extract card names
      List<String> cards = (result["addedCards"] as List)
          .map((c) => c["Card"] as String)
          .toList();
      print("Cards received: $cards");
      return cards;
    } catch (e) {
      print("Network error: $e");
      return [];
    }
  }

  void handleClick() async {
    setState(() {
      shaking = true;
      showCards = false;
    });

    await Future.delayed(const Duration(milliseconds: 600));

    setState(() {
      shaking = false;
      showPoof = true;
    });

    List<String> cards = await openCardPack();

    // Simulate preloading
    await Future.delayed(const Duration(milliseconds: 300));

    setState(() {
      cardImages = cards;
      showCards = true;
    });

    await Future.delayed(const Duration(milliseconds: 800));
    setState(() {
      showPoof = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF030303),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Stack(
              alignment: Alignment.center,
              children: [
                GestureDetector(
                  onTap: handleClick,
                  child: AnimatedRotation(
                    duration: const Duration(milliseconds: 100),
                    turns: shaking ? 0.02 : 0.0,
                    child: Image.asset(
                      'assets/images/card.jpg',
                      width: 200,
                      height: 282,
                    ),
                  ),
                ),

                if (showPoof)
                  Positioned(
                    top: -50,
                    child: Image.asset(
                      'assets/images/poof.png',
                      width: 500,
                      height: 500,
                    ),
                  ),

                if (showCards)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(cardImages.length, (i) {
                      double rotation = i == 0
                          ? -0.2
                          : i == 1
                          ? 0.0
                          : 0.2;
                      return Transform.rotate(
                        angle: rotation,
                        child: Image.asset(
                          'assets/images/${cardImages[i]}.png',
                          width: 100,
                          height: 140,
                        ),
                      );
                    }),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
