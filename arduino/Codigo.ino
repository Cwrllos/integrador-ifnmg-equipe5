
// OCCUPACONTROL
// Sistema de controle de entrada e saída de pessoas

// Sensor Entrada (Sensor 1)
const int trigPin1 = 5;
const int echoPin1 = 6;

// Sensor Saída (Sensor 2)
const int trigPin2 = 8;
const int echoPin2 = 9;

// LEDs
const int ledPin1 = 3;
const int ledPin2 = 4;

// Buzzer
const int buzzer = 10;


// Controle de sequência
int estado = 0;

// 0 = aguardando passagem
// 1 = sensor 1 detectou primeiro
// 2 = sensor 2 detectou primeiro
// 3 = aguardando liberação dos sensores

// Tempo limite para completar a passagem
unsigned long tempoEstado = 0;
const unsigned long timeout = 3000; // 3 segundos

void setup() {
  Serial.begin(9600);

  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);

  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);

  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);

  pinMode(buzzer, OUTPUT);

  // Informa ao backend que o Arduino está pronto
  Serial.println("ARDUINO_READY");
}


// Função para medir a distância
float medirDistancia(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duracao = pulseIn(echoPin, HIGH);

  return (duracao * 0.0343) / 2;
}

void loop() {
  // Recebe comandos enviados pelo backend
  if (Serial.available() > 0) {
    String comando = Serial.readStringUntil('\n');
    comando.trim();

  if (comando == "BUZZER_ON") {
    tone(buzzer, 1000);
    Serial.println("Buzzer ligado pelo backend");
  }
  else if (comando == "BUZZER_OFF") {
    noTone(buzzer);
    Serial.println("Buzzer desligado pelo backend");
  }
}
  float distancia1 = medirDistancia(trigPin1, echoPin1);
  float distancia2 = medirDistancia(trigPin2, echoPin2);

  // Cancela uma passagem não concluída em 3 segundos
  if (estado != 0 && estado != 3 &&
      millis() - tempoEstado >= timeout) {
    estado = 0;
  }

  // LEDs indicativos
  digitalWrite(ledPin1, distancia1 < 20);
  digitalWrite(ledPin2, distancia2 < 20);

  // Aguarda os dois sensores ficarem livres
  if (estado == 3) {
    if (distancia1 >= 20 && distancia2 >= 20) {
      estado = 0;
    }
  }

  // Sensor 1 detectou primeiro
  if (estado == 0 && distancia1 < 20) {
    estado = 1;
    tempoEstado = millis();

    Serial.println("Sensor 1 ativado");
  }

  // Sensor 2 detectou primeiro
  else if (estado == 0 && distancia2 < 20) {
    estado = 2;
    tempoEstado = millis();

    Serial.println("Sensor 2 ativado");
  }

  // Entrada confirmada (S1 -> S2)
  else if (estado == 1 && distancia2 < 20) {
  // Informa ao backend que houve uma entrada
  Serial.println("ENTRADA");

  estado = 3;

  delay(1000);
}

  // Saída confirmada (S2 -> S1)
  else if (estado == 2 && distancia1 < 20) {
  // Informa ao backend que houve uma saída
  Serial.println("SAIDA");

  estado = 3;

  delay(1000);
}

  delay(100);
}
