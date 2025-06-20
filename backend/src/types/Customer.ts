export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
}

export type CustomerResponse = Customer;
export type CustomersResponse = Customer[]; 