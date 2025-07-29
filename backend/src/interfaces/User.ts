export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for responses, required for creation
  role: UserRole;
  phoneNumber?: string; 
    address?: string;