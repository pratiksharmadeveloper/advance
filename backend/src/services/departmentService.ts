import { AppDataSource } from '../config/database';
import { Department } from '../entities/Department';
import { IDepartmentService, IDepartment } from '../interfaces/IDepartment';

export class DepartmentService implements IDepartmentService {
  private departmentRepository = AppDataSource.getRepository(Department);

  async createDepartment(departmentData: Partial<IDepartment>): Promise<IDepartment> {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name: departmentData.name! }
    });

    if (existingDepartment) {
      throw new Error('Department with this name already exists');
    }

    const department = this.departmentRepository.create(departmentData);
    return this.departmentRepository.save(department);
  }

  async getDepartmentById(id: string): Promise<IDepartment | null> {
    return this.departmentRepository.findOne({
      where: { id }
    });
  }

  async getAllDepartments(): Promise<IDepartment[]> {
    return this.departmentRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async updateDepartment(id: string, departmentData: Partial<IDepartment>): Promise<IDepartment | null> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      return null;
    }

    // Check if name is being updated and if it conflicts with existing department
    if (departmentData.name && departmentData.name !== department.name) {
      const existingDepartment = await this.departmentRepository.findOne({
        where: { name: departmentData.name }
      });

      if (existingDepartment) {
        throw new Error('Department with this name already exists');
      }
    }

    Object.assign(department, departmentData);
    return this.departmentRepository.save(department);
  }

  async deleteDepartment(id: string): Promise<boolean> {
    const result = await this.departmentRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async getActiveDepartments(): Promise<IDepartment[]> {
    return this.departmentRepository.find({
      where: { status: 'active' },
      order: { name: 'ASC' }
    });
  }

  async updateDoctorCount(id: string, count: number): Promise<IDepartment | null> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      return null;
    }

    department.doctorCount = count;
    return this.departmentRepository.save(department);
  }
} 