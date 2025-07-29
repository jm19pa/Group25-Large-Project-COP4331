import 'package:flutter/material.dart';

class AboutUsPage extends StatelessWidget {
  final List<Map<String, String>> teamMembers = [
    {
      'name': 'David Gusmao',
      'title': 'Project Manager',
      'image': 'assets/images/DavidGusmao.png',
      'contributions':
          'Name & Website Theming, All Cards, All Art, Powerpoint, Gantt Chart, Recourse Allocation, Droplet, Domain',
    },
    {
      'name': 'Tyler Tran',
      'title': 'Database Management',
      'image': 'assets/images/TylerTran.png',
      'contributions':
          'SendGrid implementation, Unit testing, MongoDB Setup, ENV Setup, Yaml Setup',
    },
    {
      'name': 'Tyler Takimoto',
      'title': 'Frontend Development',
      'image': 'assets/images/TylerTakimoto.png',
      'contributions':
          'Website Design, Flutter Setup, Mobile Development, Mobile Design',
    },
    {
      'name': 'Juan Pinero',
      'title': 'Frontend Development',
      'image': 'assets/images/JuanoPinero.png',
      'contributions':
          'Website Design, Mobile Development, API Assistance, PowerPoint Assistance',
    },
    {
      'name': 'Andrew Chambers',
      'title': 'API Development',
      'image': 'assets/images/AndrewChambers.png',
      'contributions':
          'API Design, Sever Setup, API Setup, API Testing, API Documentation',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF030303),
      appBar: AppBar(
        title: const Text("About Us"),
        backgroundColor: const Color(0xFF121212),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          children: [
            for (var person in teamMembers) AboutCard(person: person),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/cardDex');
              },
              child: Text('Dex Page'),
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

class AboutCard extends StatelessWidget {
  final Map<String, String> person;

  const AboutCard({required this.person});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black54, blurRadius: 6, offset: Offset(0, 3)),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: LayoutBuilder(
        builder: (context, constraints) {
          bool isWide = constraints.maxWidth > 600;
          return Flex(
            direction: isWide ? Axis.horizontal : Axis.vertical,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.asset(
                  person['image']!,
                  width: isWide ? 150 : 250,
                  height: isWide ? 150 : null,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 20, height: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${person['name']}: ${person['title']}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Contributions: ${person['contributions']}',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
