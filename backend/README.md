# Configuração Local de Desenvolvimento

## Pré-requisitos

### 1. PostgreSQL
```bash
# Windows (usando Chocolatey)
choco install postgresql

# Ou baixar do site oficial
# https://www.postgresql.org/download/windows/
```

### 2. Configuração do Banco
```sql
-- Conectar como superuser e criar banco
CREATE DATABASE agrichain_db;
CREATE USER agrichain_user WITH PASSWORD 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE agrichain_db TO agrichain_user;
```

### 3. Configuração do Environment
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agrichain_db
DB_USER=agrichain_user
DB_PASSWORD=sua_senha_aqui
```

## Comandos de Desenvolvimento

### Instalar dependências
```bash
npm install
```

### Executar em modo desenvolvimento
```bash
npm run dev
```

### Executar testes
```bash
npm test
```

## Endpoints da API

### Produtos
- `GET /api/v1/products` - Listar produtos
- `POST /api/v1/products` - Criar produto
- `GET /api/v1/products/:id` - Buscar produto
- `PUT /api/v1/products/:id` - Atualizar produto
- `DELETE /api/v1/products/:id` - Desativar produto

### Usuários
- `POST /api/v1/users/register` - Registrar usuário
- `POST /api/v1/users/login` - Login
- `GET /api/v1/users` - Listar usuários
- `GET /api/v1/users/:id` - Buscar usuário

### Cadeia de Suprimentos
- `GET /api/v1/supply-chain/events` - Listar eventos
- `POST /api/v1/supply-chain/events` - Criar evento
- `GET /api/v1/supply-chain/product/:id/timeline` - Timeline do produto
- `POST /api/v1/supply-chain/transfer` - Transferir produto

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard geral
- `GET /api/v1/analytics/products` - Analytics de produtos
- `GET /api/v1/analytics/supply-chain` - Analytics da cadeia
- `GET /api/v1/analytics/users` - Analytics de usuários

## Exemplo de Uso

### Criar Usuário
```bash
curl -X POST http://localhost:3001/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@fazenda.com",
    "password": "123456",
    "role": "producer",
    "company_name": "Fazenda Silva"
  }'
```

### Criar Produto
```bash
curl -X POST http://localhost:3001/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tomate Orgânico",
    "category": "vegetables",
    "producer_id": "uuid-do-produtor",
    "harvest_date": "2025-08-19",
    "quantity": 100,
    "unit": "kg",
    "growing_method": "organic"
  }'
```
