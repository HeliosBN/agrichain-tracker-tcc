// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AgriChainSimple
 * @dev Contrato simples para rastreabilidade de produtos agrícolas
 * @author Seu Nome
 */
contract AgriChainSimple {
    
    // Estrutura do produto
    struct Product {
        string id;              // ID único do produto
        string name;            // Nome do produto
        string category;        // Categoria (vegetables, fruits, etc)
        string producer;        // Nome do produtor
        string location;        // Localização da produção
        address producerAddress; // Endereço da carteira do produtor
        uint256 timestamp;      // Timestamp do registro
    }
    
    // Mapeamento de produtos por ID
    mapping(string => Product) public products;
    
    // Array com todos os IDs de produtos
    string[] public productList;
    
    // Contador total de produtos
    uint256 public totalProducts;
    
    // Evento emitido quando um produto é armazenado
    event ProductStored(
        string indexed productId,
        address indexed producer,
        uint256 timestamp
    );
    
    /**
     * @dev Armazena um novo produto na blockchain
     * @param _id ID único do produto
     * @param _name Nome do produto
     * @param _category Categoria do produto
     * @param _producer Nome do produtor
     * @param _location Localização da produção
     */
    function storeProduct(
        string memory _id,
        string memory _name,
        string memory _category,
        string memory _producer,
        string memory _location
    ) public {
        require(bytes(_id).length > 0, "ID nao pode ser vazio");
        require(bytes(products[_id].id).length == 0, "Produto ja existe");
        
        // Criar o produto
        products[_id] = Product({
            id: _id,
            name: _name,
            category: _category,
            producer: _producer,
            location: _location,
            producerAddress: msg.sender,
            timestamp: block.timestamp
        });
        
        // Adicionar à lista e incrementar contador
        productList.push(_id);
        totalProducts++;
        
        // Emitir evento
        emit ProductStored(_id, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Recupera um produto pelo ID
     * @param _id ID do produto
     * @return Product Dados completos do produto
     */
    function getProduct(string memory _id) public view returns (Product memory) {
        require(bytes(products[_id].id).length > 0, "Produto nao encontrado");
        return products[_id];
    }
    
    /**
     * @dev Retorna o total de produtos registrados
     * @return uint256 Número total de produtos
     */
    function getTotalProducts() public view returns (uint256) {
        return totalProducts;
    }
    
    /**
     * @dev Verifica se um produto existe
     * @param _id ID do produto
     * @return bool True se o produto existe
     */
    function productExists(string memory _id) public view returns (bool) {
        return bytes(products[_id].id).length > 0;
    }
    
    /**
     * @dev Retorna o ID do produto pelo índice
     * @param _index Índice na lista de produtos
     * @return string ID do produto
     */
    function getProductIdByIndex(uint256 _index) public view returns (string memory) {
        require(_index < totalProducts, "Indice fora dos limites");
        return productList[_index];
    }
}