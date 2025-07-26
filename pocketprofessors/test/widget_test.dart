// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
// import 'package:pocketprofessors/main.dart';

void main() {
  testWidgets('Login and Register UI test', (WidgetTester tester) async {
    // Build the app
    // await tester.pumpWidget(const PocketProfessorsApp());

    // Verify input fields exist
    expect(find.byType(TextField), findsNWidgets(4));
    expect(find.widgetWithText(TextField, 'Username'), findsOneWidget);
    expect(find.widgetWithText(TextField, 'Password'), findsOneWidget);
    expect(
      find.widgetWithText(TextField, 'First Name (for Register)'),
      findsOneWidget,
    );
    expect(
      find.widgetWithText(TextField, 'Last Name (for Register)'),
      findsOneWidget,
    );

    // Verify buttons exist
    expect(find.widgetWithText(ElevatedButton, 'Login'), findsOneWidget);
    expect(find.widgetWithText(ElevatedButton, 'Register'), findsOneWidget);

    // Enter dummy login credentials
    await tester.enterText(
      find.widgetWithText(TextField, 'Username'),
      'testuser',
    );
    await tester.enterText(
      find.widgetWithText(TextField, 'Password'),
      'password123',
    );

    // Tap the Login button
    await tester.tap(find.widgetWithText(ElevatedButton, 'Login'));
    await tester.pump(); // Trigger the button callback

    // Wait for async call (simulate loading)
    await tester.pump(const Duration(seconds: 2));

    // Check for result message (either success or error)
    expect(
      find.byType(Text),
      findsWidgets,
    ); // Generic check — optional refinement
  });
}
