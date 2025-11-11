-- Arquivo de inicialização do banco AgriChain
-- Este arquivo será executado automaticamente quando o container PostgreSQL for criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Inserir dados iniciais de exemplo (opcional)
-- Será executado apenas na primeira inicialização

-- Comentário: As tabelas serão criadas automaticamente pelo Sequelize quando o backend iniciar
-- Este arquivo serve para configurações e dados iniciais do PostgreSQL

-- Log de inicialização
DO $$
BEGIN
    RAISE NOTICE 'AgriChain Database initialized successfully!';
    RAISE NOTICE 'Database: agrichain_db';
    RAISE NOTICE 'User: postgres';
    RAISE NOTICE 'Extensions installed: uuid-ossp, pg_trgm';
END $$;