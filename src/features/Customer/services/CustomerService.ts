// Customer/Customer/services/CustomerService.ts
import { Platform } from 'react-native';
import { Customer } from '../types/customer';

// iOS simulator: dùng http://localhost
// Android emulator: dùng http://10.0.2.2
const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'
    : 'http://localhost:8080/api';

class CustomerService {
  private customersUrl = `${API_BASE_URL}/customers`;

  private mapCustomer(apiCustomer: any): Customer {
    return {
      id: apiCustomer.id ?? apiCustomer._id ?? '',
      name: apiCustomer.name ?? '',
      phone: apiCustomer.phone ?? '',
      // backend hiện chưa có field "code" thì sẽ trả rỗng
      code: apiCustomer.code ?? '',
      createdAt: apiCustomer.createdAt ?? '',
    };
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch(this.customersUrl);

      if (!res.ok) {
        console.error('Get customers failed', res.status, res.statusText);
        throw new Error('Get customers failed');
      }

      const json = await res.json();

      let items: any[] = [];

      // Backend hiện trả dạng: { success, message, data: [...] }
      if (Array.isArray(json)) {
        items = json;
      } else if (Array.isArray(json.data)) {
        items = json.data;
      } else if (Array.isArray(json.customers)) {
        items = json.customers;
      } else if (Array.isArray(json.items)) {
        items = json.items;
      } else if (Array.isArray(json.results)) {
        items = json.results;
      } else {
        console.warn('Unexpected customers response format', json);
      }

      return items.map(item => this.mapCustomer(item));
    } catch (error) {
      console.error('Error fetching customers', error);
      throw error;
    }
  }
}

export const customerService = new CustomerService();
