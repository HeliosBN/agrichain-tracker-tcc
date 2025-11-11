const bcrypt = require('bcryptjs');

async function createHashes() {
    const users = [
        { email: 'maria@producer.com', password: 'producer123', name: 'Maria Silva', role: 'producer' },
        { email: 'joao@distributor.com', password: 'distributor123', name: 'João Santos', role: 'distributor' },
        { email: 'ana@retailer.com', password: 'retailer123', name: 'Ana Costa', role: 'retailer' },
        { email: 'carlos@consumer.com', password: 'consumer123', name: 'Carlos Consumidor', role: 'consumer' }
    ];

    for (const user of users) {
        const hash = await bcrypt.hash(user.password, 12);
        console.log(`INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES (gen_random_uuid(), '${user.name}', '${user.email}', '${hash}', '${user.role}', NOW(), NOW());`);
    }
}

createHashes();