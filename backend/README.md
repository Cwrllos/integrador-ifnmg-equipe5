# backend

Aqui ficam os códigos de funcionamento do backend que compõe o sistema completo.
## Como rodar o backend

### 1. Clonar o repositório

```bash
git clone https://github.com/Cwrllos/integrador-ifnmg-equipe5/tree/main
cd integrador-ifnmg-equipe5/backend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar o arquivo `.env`

Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

No Linux/Mac:

```bash
cp .env.example .env
```

Depois confira as variáveis:

```env
PORT=3000

DATABASE_URL="mysql://root:123456@localhost:3306/occupacontrol"

ENABLE_SERIAL=false
ARDUINO_SERIAL_PORT="COM3"
ARDUINO_BAUD_RATE=9600

SENSOR_ENTRADA_ID=1
SENSOR_SAIDA_ID=2
```

### 4. Subir o banco de dados

Se estiver usando Docker:

```bash
docker compose up -d
```

### 5. Gerar o Prisma Client

```bash
npx prisma generate
```

### 6. Rodar as migrations

```bash
npx prisma migrate dev
```

### 7. Popular o banco com dados iniciais

```bash
npm run seed
```

Esse comando cria:

```txt
Administrador: admin@campus.edu.br
Senha: 123456
Ambiente: Laboratório TADS
Sensor ENTRADA ID: 1
Sensor SAIDA ID: 2
```

### 8. Rodar o servidor em modo desenvolvimento

```bash
npm run dev
```

Se tudo estiver certo, aparecerá:

```txt
Servidor rodando na porta 3000
URL local: http://localhost:3000
```

### 9. Testar a API

Abra no navegador:

```txt
http://localhost:3000
```

### 10. Testar uma entrada pelo Insomnia/Postman

Método:

```http
POST http://localhost:3000/leituras
```

Body:

```json
{
  "sensorId": 1
}
```

### 11. Testar uma saída pelo Insomnia/Postman

Método:

```http
POST http://localhost:3000/leituras
```

Body:

```json
{
  "sensorId": 2
}
```

### 12. Testar o dashboard

```http
GET http://localhost:3000/dashboard/diario/1
```

---

## Como testar com Arduino via Serial USB

### 1. Conectar o Arduino no computador

Veja a porta usada pelo Arduino na IDE:

```txt
Ferramentas > Porta
```

Exemplo:

```txt
COM3
```

### 2. Atualizar o `.env`

```env
ENABLE_SERIAL=true
ARDUINO_SERIAL_PORT="COM3"
ARDUINO_BAUD_RATE=9600
```

Se a porta for diferente, altere:

```env
ARDUINO_SERIAL_PORT="COM4"
```

ou:

```env
ARDUINO_SERIAL_PORT="COM5"
```

### 3. Rodar o backend

```bash
npm run dev
```

Se a conexão funcionar, aparecerá algo parecido com:

```txt
Serial conectada em COM3 com baud rate 9600
```

### 4. Dados esperados do Arduino

O Arduino pode enviar:

```txt
ENTRADA
```

ou:

```txt
SAIDA
```

Também pode enviar JSON:

```json
{"sensorId":1}
```

ou:

```json
{"sensorId":2}
```

---

## Comandos úteis

### Rodar o projeto

```bash
npm run dev
```

### Compilar TypeScript

```bash
npm run build
```

### Rodar versão compilada

```bash
npm start
```

### Abrir Prisma Studio

```bash
npx prisma studio
```

### Gerar Prisma Client

```bash
npx prisma generate
```

### Criar migration

```bash
npx prisma migrate dev --name nome-da-migration
```

### Rodar seed

```bash
npm run seed
```

### Resetar banco de dados

Atenção: esse comando apaga os dados do banco.

```bash
npx prisma migrate reset
```
