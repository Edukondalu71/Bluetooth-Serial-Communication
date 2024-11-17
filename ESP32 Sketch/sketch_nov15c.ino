#include <BluetoothSerial.h>

#define LED_PIN 2
#define SWITCH_1 4
#define SWITCH_2 13
#define SWITCH_3 14
#define SWITCH_4 16

BluetoothSerial SerialBT;

void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);
  Serial.println("Starting Bluetooth...");

  // Initialize Bluetooth
  if (!SerialBT.begin("ESP32_Switch")) { // Device name
    Serial.println("An error occurred during Bluetooth initialization");
  } else {
    Serial.println("Bluetooth initialized. Waiting for commands...");
  }

  // Initialize GPIO pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(SWITCH_1, OUTPUT);
  pinMode(SWITCH_2, OUTPUT);
  pinMode(SWITCH_3, OUTPUT);
  pinMode(SWITCH_4, OUTPUT);

  // Set initial states
  digitalWrite(LED_PIN, LOW);
  digitalWrite(SWITCH_1, LOW);
  digitalWrite(SWITCH_2, LOW);
  digitalWrite(SWITCH_3, LOW);
  digitalWrite(SWITCH_4, LOW);
}

void loop() {
  // Check for Bluetooth data
  if (SerialBT.available()) {
    String command = SerialBT.readStringUntil('\n'); // Read command until newline
    command.trim(); // Remove any trailing newline or spaces
    //Serial.println(command);

    // Process the command
    switch (command.charAt(0)) { // Check the first character of the command
      case '1': // Turn on the LED
        digitalWrite(LED_PIN, HIGH);
        SerialBT.println("LED is ON");
        break;

      case '0': // Turn off the LED
        digitalWrite(LED_PIN, LOW);
        SerialBT.println("LED is OFF");
        break;

      case 'S': // Handle SWITCH commands
        if (command == "SWITCH_1_ON") {
          digitalWrite(SWITCH_1, HIGH);
          SerialBT.println("SWITCH 1 is ON");
        } else if (command == "SWITCH_1_OFF") {
          digitalWrite(SWITCH_1, LOW);
          SerialBT.println("SWITCH 1 is OFF");
        } else if (command == "SWITCH_2_ON") {
          digitalWrite(SWITCH_2, HIGH);
          SerialBT.println("SWITCH 2 is ON");
        } else if (command == "SWITCH_2_OFF") {
          digitalWrite(SWITCH_2, LOW);
          SerialBT.println("SWITCH 2 is OFF");
        } else if (command == "SWITCH_3_ON") {
          digitalWrite(SWITCH_3, HIGH);
          SerialBT.println("SWITCH 3 is ON");
        } else if (command == "SWITCH_3_OFF") {
          digitalWrite(SWITCH_3, LOW);
          SerialBT.println("SWITCH 3 is OFF");
        } else if (command == "SWITCH_4_ON") {
          digitalWrite(SWITCH_4, HIGH);
          SerialBT.println("SWITCH 4 is ON");
        } else if (command == "SWITCH_4_OFF") {
          digitalWrite(SWITCH_4, LOW);
          SerialBT.println("SWITCH 4 is OFF");
        } else {
          SerialBT.println("Invalid SWITCH command");
        }
        break;

      default: // Invalid command
        SerialBT.println("Invalid command. Use 1, 0, or SWITCH_X_ON/OFF");
        break;
    }
  }

  delay(20); // Small delay to prevent overloading
}
