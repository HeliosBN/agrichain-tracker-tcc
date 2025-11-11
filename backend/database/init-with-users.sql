-- Criação das tabelas (se não existirem)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'producer',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    producer VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    harvest_date DATE,
    expiry_date DATE,
    is_organic BOOLEAN DEFAULT false,
    certifications TEXT[],
    blockchain_hash VARCHAR(255),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supply_chain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    event_type VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    actor VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW(),
    blockchain_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuários iniciais (apenas se não existirem)
DO $$
BEGIN
    -- Usuário 1: Produtor
    INSERT INTO users (name, email, password_hash, role)
    SELECT 'Maria Silva', 'maria@producer.com', '$2a$10$k8Yvp1j4Q2D.wS.aXF8wGuQkOqRZE8FkH5X1Qz9Z4T6.wK8.aXF8w', 'producer'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'maria@producer.com');

    -- Usuário 2: Distribuidor  
    INSERT INTO users (name, email, password_hash, role)
    SELECT 'João Santos', 'joao@distributor.com', '$2a$10$k8Yvp1j4Q2D.wS.aXF8wGuQkOqRZE8FkH5X1Qz9Z4T6.wK8.aXF8w', 'distributor'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'joao@distributor.com');

    -- Usuário 3: Varejista
    INSERT INTO users (name, email, password_hash, role)
    SELECT 'Ana Costa', 'ana@retailer.com', '$2a$10$k8Yvp1j4Q2D.wS.aXF8wGuQkOqRZE8FkH5X1Qz9Z4T6.wK8.aXF8w', 'retailer'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'ana@retailer.com');

    -- Usuário 4: Consumidor
    INSERT INTO users (name, email, password_hash, role)
    SELECT 'Carlos Consumidor', 'carlos@consumer.com', '$2a$10$k8Yvp1j4Q2D.wS.aXF8wGuQkOqRZE8FkH5X1Qz9Z4T6.wK8.aXF8w', 'consumer'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'carlos@consumer.com');

    RAISE NOTICE 'Usuários das 4 roles básicas criados com sucesso!';
END $$;