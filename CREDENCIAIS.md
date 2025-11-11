# 👥 Credenciais dos Usuários - AgriChain

## 🔐 Usuários Pré-configurados

O sistema já vem com **4 usuários** pré-cadastrados para teste:

### 1. 🌾 **Produtor** 
- **Nome:** Maria Silva
- **Email:** `maria@producer.com`
- **Senha:** `producer123`
- **Função:** Registro e rastreamento de produtos agrícolas

### 2. 🚚 **Distribuidor**
- **Nome:** João Santos  
- **Email:** `joao@distributor.com`
- **Senha:** `distributor123`
- **Função:** Logística e transporte na cadeia de suprimentos

### 3. 🏪 **Varejista**
- **Nome:** Ana Costa
- **Email:** `ana@retailer.com` 
- **Senha:** `retailer123`
- **Função:** Venda final e atendimento ao consumidor

### 4. 👤 **Consumidor**
- **Nome:** Carlos Consumidor
- **Email:** `carlos@consumer.com`
- **Senha:** `consumer123`
- **Função:** Rastreamento de produtos e verificação de origem

## 🐳 Como usar com Docker

1. **Iniciar o banco de dados:**
```bash
docker-compose up postgres -d
```

2. **Os usuários são criados automaticamente** quando o PostgreSQL inicia pela primeira vez

3. **Verificar se os usuários foram criados:**
```bash
# Conectar ao banco via pgAdmin em http://localhost:8080
# Ou via terminal:
docker exec -it agrichain-postgres psql -U postgres -d agrichain_db -c "SELECT name, email, role FROM users;"
```

## 🔧 Senha Padrão

**Todas as senhas estão hasheadas** com bcrypt e correspondem ao padrão:
- `producer123`, `distributor123`, `retailer123`, `consumer123`

## 🚀 Teste Rápido

1. Abra http://localhost:5173
2. Clique em "Entrar"  
3. Use qualquer uma das credenciais acima
4. Teste o registro de produtos e blockchain!

---
*Os usuários são criados apenas na primeira inicialização do banco. Para recriar, delete o volume do Docker: `docker-compose down -v`*