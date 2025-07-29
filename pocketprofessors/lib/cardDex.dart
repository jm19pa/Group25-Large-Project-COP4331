import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class CardDexPage extends StatefulWidget {
  const CardDexPage({super.key});

  @override
  State<CardDexPage> createState() => _CardDexPageState();
}

class _CardDexPageState extends State<CardDexPage> {
  List<String> ownedCards = [];
  List<String> unownedCards = [];

  final List<String> cardFilenames = [
    "TheGorillaEX.png",
    "KnightroEX.png",
    "CitronautEX.png",
    "TouchGrass.png",
    "DavidGusmao.png",
    "JuanoPinero.png",
    "TylerTran.png",
    "TylerTakimoto.png",
    "AndrewChambers.png",
    "MrPappasSHINY.png",
    "GUHAEX.png",
    "BurgerEX.png",
    "GerbEX.png",
    "AhmedEX.png",
    "AlaGazzamEX.png",
    "DuckerEX.png",
    "McalpinEX.png",
    "OnlineOliverEX.png",
    "RecordReggieEX.png",
    "ZacharyCoreEX.png",
    "TextbookTerryEX.png",
    "FinalFrankEX.png",
    "GrettaPAnderson.png",
    "MorrelMiddleson.png",
    "ProfessorPythor.png",
    "LeonardoLeeve.png",
    "OpenOrpheus.png",
    "NedNightly.png",
    "CrazyCarlos.png",
    "TeddTalkerson.png",
    "StuckStan.png",
    "RickleEX.png",
    "LateLenny.png",
    "AshLeep.png",
    "MrPappas.png",
    "RuthMyaProsef.png",
    "WithdrawalDate.png",
    "StudyRoom.png",
    "StudyGroup.png",
    "MyUCF.png",
    "EnergyDrink.png",
    "PiggyBank.png",
    "BadTextbook.png",
    "SpiritSplash.png",
  ];

  @override
  void initState() {
    super.initState();
    fetchCardData();
  }

  Future<void> fetchCardData() async {
    final prefs = await SharedPreferences.getInstance();
    final userRaw = prefs.getString("user_data");
    final token = prefs.getString("token");

    if (userRaw == null || token == null) {
      // print("Missing user_data or token for card dex");
      if (context.mounted) {
        Navigator.pushReplacementNamed(context, '/register');
      }
      return;
    }

    final userID = jsonDecode(userRaw)['id'];

    try {
      // Fetch owned cards
      final ownedRes = await http.post(
        Uri.parse("http://pocketprofessors.com:5000/api/foundCards"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"userID": userID, "jwtToken": token}),
      );

      final ownedData = jsonDecode(ownedRes.body);

      // print("decoded ownedData");
      // print("OwnedData = " + ownedData.toString());

      if (ownedData["error"] != null && ownedData["cards"] is List) {
        // print("Went into first if statement");
        final ownedSet = Set<String>.from(
          (ownedData["cards"] as List).map(
            (c) => c.toString().endsWith(".png") ? c : "$c.png",
          ),
        );

        setState(() {
          ownedCards = cardFilenames
              .where((card) => ownedSet.contains(card))
              .toList();
        });

        final refreshed =
            ownedData["jwtToken"]?["accessToken"] ?? ownedData["jwtToken"];
        if (refreshed != null) {
          prefs.setString("token", refreshed);
        }
      }

      // Fetch unowned cards
      final unownedRes = await http.post(
        Uri.parse("http://pocketprofessors.com:5000/api/unfoundCards"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"userID": userID, "jwtToken": token}),
      );

      final unownedData = jsonDecode(unownedRes.body);

      // print("decoded unownedData");

      if (unownedData["error"] != null && unownedData["missingCards"] is List) {
        // print("Went into second if statement");
        final unownedSet = Set<String>.from(
          (unownedData["missingCards"] as List).map(
            (c) => c.toString().endsWith(".png") ? c : "$c.png",
          ),
        );

        setState(() {
          unownedCards = cardFilenames
              .where((card) => unownedSet.contains(card))
              .toList();
        });

        final refreshed =
            unownedData["jwtToken"]?["accessToken"] ?? unownedData["jwtToken"];
        if (refreshed != null) {
          prefs.setString("token", refreshed);
        }
      }
    } catch (e) {
      // print("API error: $e");
    }
  }

  Widget buildCard(String imageName, bool owned) {
    return Container(
      width: 120,
      height: 160,
      margin: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 4)],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: ColorFiltered(
          colorFilter: owned
              ? const ColorFilter.mode(Colors.transparent, BlendMode.dst)
              : const ColorFilter.mode(Colors.grey, BlendMode.saturation),
          child: Image.asset(
            "assets/images/$imageName",
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              return const Center(child: Icon(Icons.broken_image));
            },
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0A),
      appBar: AppBar(
        title: const Text("Professor Panel"),
        centerTitle: true,
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            const Text(
              "Owned Cards",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: ownedCards
                  .map((card) => buildCard(card, true))
                  .toList(),
            ),
            const SizedBox(height: 24),
            const Text(
              "Not yet Owned",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: unownedCards
                  .map((card) => buildCard(card, false))
                  .toList(),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context); // Go back to the previous page
              },
              child: Text('Back to Pack'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber,
                foregroundColor: Colors.black,
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/aboutUs');
              },
              child: Text('About Us'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber,
                foregroundColor: Colors.black,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
