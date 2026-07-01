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

// Quantidade de pessoas na sala
int pessoasNaSala = 0;

// Controle de sequência
int estado = 0;

// Tempo limite para completar a passagem
unsigned long tempoEstado = 0;
const unsigned long timeout = 3000; // 3 segundos

// Função para inicializar e definir cada um
void setup() {

  Serial.begin(9600);

  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);

  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);

  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);

  pinMode(buzzer, OUTPUT);
}

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

  float distancia1 = medirDistancia(trigPin1, echoPin1);
  float distancia2 = medirDistancia(trigPin2, echoPin2);

  // LEDs indicativos
  digitalWrite(ledPin1, distancia1 < 20);
  digitalWrite(ledPin2, distancia2 < 20);

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

  // Dependencia dos sensores 
  // Entrada sendo confirmada (S1 -> S2)
  else if (estado == 1 && distancia2 < 20) {

    pessoasNaSala++;

    Serial.println("ENTRADA");
    Serial.print("Pessoas na sala: ");
    Serial.println(pessoasNaSala);

    estado = 0;

    delay(1000);
  }

  // Saida sendo confirmada (S2 -> S1)
  else if (estado == 2 && distancia1 < 20) {

    if (pessoasNaSala > 0) {
      pessoasNaSala--;
    }

    Serial.println("SAIDA");
    Serial.print("Pessoas na sala: ");
    Serial.println(pessoasNaSala);

    estado = 0;

    delay(1000);
  }


  // Limite máximo
  if (pessoasNaSala > 6) {

    tone(buzzer, 1000);

  } else {

    noTone(buzzer);
  }

  delay(100);
}
