export interface IDepartment {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  status: 'active' | 'inactive';
  doctorCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepartmentService {
  createDepartment(departmentData: Partial<IDepartment>): Promise<IDepartment>;
  getDepartmentById(id: string): Promise<IDepartment | null>;
  getAllDepartments(): Promise<IDepartment[]>;
  updateDepartment(id: string, departmentData: Partial<IDepartment>): Promise<IDepartment | null>;
  deleteDepartment(id: string): Promise<boolean>;
  getActiveDepartments(): Promise<IDepartment[]>;
  updateDoctorCount(id: string, count: number): Promise<IDepartment | null>;
} 