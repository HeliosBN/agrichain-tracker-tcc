// Teste rápido de produto para verificar se o UUID está funcionando
const productData = {
  product_id: `AGRI-${Date.now()}`,
  name: "Tomate Orgânico",
  category: "vegetables",
  producer_name: "João da Silva",
  farm_location: { address: "Fazenda São José, SP" },
  harvest_date: new Date().toISOString(),
  quantity: 50.0,
  unit: "kg",
  certifications: ["organic"],
  producer_id: 'ab7f4630-afa7-42dc-9ace-63bee8da1476', // UUID da produtora Maria Silva
  expiry_date: null
};

fetch('http://localhost:3001/api/v1/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(productData)
})
.then(response => response.json())
.then(data => {
  console.log('✅ Produto criado:', data);
})
.catch(error => {
  console.error('❌ Erro:', error);
});