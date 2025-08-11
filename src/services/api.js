// API service for AgriChain Tracker
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Product related API calls
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/api/products${queryParams ? `?${queryParams}` : ''}`);
  }

  async getProduct(productId) {
    return this.request(`/api/products/${productId}`);
  }

  async createProduct(productData) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId, updates) {
    return this.request(`/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Supply chain related API calls
  async getSupplyChainHistory(productId) {
    return this.request(`/api/supply-chain/${productId}/history`);
  }

  async updateSupplyChainStatus(productId, statusData) {
    return this.request(`/api/supply-chain/${productId}/status`, {
      method: 'POST',
      body: JSON.stringify(statusData),
    });
  }

  // Producer related API calls
  async getProducerProducts(producerAddress) {
    return this.request(`/api/producers/${producerAddress}/products`);
  }

  async getProducerStats(producerAddress) {
    return this.request(`/api/producers/${producerAddress}/stats`);
  }

  // Distributor related API calls
  async getDistributorShipments(distributorAddress) {
    return this.request(`/api/distributors/${distributorAddress}/shipments`);
  }

  async getDistributorStats(distributorAddress) {
    return this.request(`/api/distributors/${distributorAddress}/stats`);
  }

  // Certification related API calls
  async getCertifications() {
    return this.request('/api/certifications');
  }

  async verifyCertification(certificationId) {
    return this.request(`/api/certifications/${certificationId}/verify`);
  }

  // Search related API calls
  async searchProducts(query, filters = {}) {
    const searchParams = new URLSearchParams({
      q: query,
      ...filters,
    }).toString();
    
    return this.request(`/api/search/products?${searchParams}`);
  }

  // Analytics and reporting
  async getAnalytics(type, dateRange = {}) {
    const params = new URLSearchParams({
      type,
      ...dateRange,
    }).toString();
    
    return this.request(`/api/analytics?${params}`);
  }

  async generateReport(reportType, options = {}) {
    return this.request('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify({
        type: reportType,
        ...options,
      }),
    });
  }

  // File upload utility
  async uploadFile(file, endpoint = '/api/upload') {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
      return response.json();
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
