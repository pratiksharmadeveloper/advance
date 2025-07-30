import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { UserRole } from '../interfaces/UserRole';
import * as bcrypt from 'bcryptjs';

export class AdminSeeder {
  private userRepository = AppDataSource.getRepository(User);

  async seed() {
    try {
      console.log('🌱 Starting admin seeder...');

      // Check if admin already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { email: 'admin@hospital.com' }
      });

      if (existingAdmin) {
        console.log('✅ Admin user already exists, skipping...');
        return;
      }

      // Create default admin user
      const adminPassword = await bcrypt.hash('admin123', 12);
      
      const adminUser = this.userRepository.create({
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@hospital.com',
        password: adminPassword,
        role: UserRole.ADMIN,
        isActive: true,
        phoneNumber: '+977-98XXXXXXXX',
        address: 'Hospital Management System'
      });

      await this.userRepository.save(adminUser);

      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@hospital.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the password after first login!');

    } catch (error) {
      console.error('❌ Error seeding admin user:', error);
      throw error;
    }
  }

  async createCustomAdmin(adminData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    address?: string;
  }) {
    try {
      console.log(`🌱 Creating custom admin user: ${adminData.email}`);

      // Check if admin already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { email: adminData.email }
      });

      if (existingAdmin) {
        console.log(`⚠️  Admin user with email ${adminData.email} already exists`);
        return existingAdmin;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      
      // Create admin user
      const adminUser = this.userRepository.create({
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
        phoneNumber: adminData.phoneNumber || null,
        address: adminData.address || null
      });

      const savedAdmin = await this.userRepository.save(adminUser);

      console.log(`✅ Custom admin user created successfully: ${adminData.email}`);
      return savedAdmin;

    } catch (error) {
      console.error('❌ Error creating custom admin user:', error);
      throw error;
    }
  }

  async createMultipleAdmins(adminsData: Array<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    address?: string;
  }>) {
    try {
      console.log(`🌱 Creating ${adminsData.length} admin users...`);

      const createdAdmins = [];

      for (const adminData of adminsData) {
        try {
          const admin = await this.createCustomAdmin(adminData);
          createdAdmins.push(admin);
        } catch (error) {
          console.error(`❌ Failed to create admin ${adminData.email}:`, error);
        }
      }

      console.log(`✅ Successfully created ${createdAdmins.length} admin users`);
      return createdAdmins;

    } catch (error) {
      console.error('❌ Error creating multiple admin users:', error);
      throw error;
    }
  }

  async listAdmins() {
    try {
      const admins = await this.userRepository.find({
        where: { role: UserRole.ADMIN },
        select: ['id', 'firstName', 'lastName', 'email', 'isActive', 'createdAt']
      });

      console.log('📋 Current admin users:');
      admins.forEach(admin => {
        console.log(`  - ${admin.firstName} ${admin.lastName} (${admin.email}) - ${admin.isActive ? 'Active' : 'Inactive'}`);
      });

      return admins;
    } catch (error) {
      console.error('❌ Error listing admin users:', error);
      throw error;
    }
  }

  async deactivateAdmin(adminId: string) {
    try {
      const admin = await this.userRepository.findOne({
        where: { id: adminId, role: UserRole.ADMIN }
      });

      if (!admin) {
        throw new Error('Admin user not found');
      }

      admin.isActive = false;
      await this.userRepository.save(admin);

      console.log(`✅ Admin user ${admin.email} deactivated successfully`);
      return admin;
    } catch (error) {
      console.error('❌ Error deactivating admin user:', error);
      throw error;
    }
  }

  async activateAdmin(adminId: string) {
    try {
      const admin = await this.userRepository.findOne({
        where: { id: adminId, role: UserRole.ADMIN }
      });

      if (!admin) {
        throw new Error('Admin user not found');
      }

      admin.isActive = true;
      await this.userRepository.save(admin);

      console.log(`✅ Admin user ${admin.email} activated successfully`);
      return admin;
    } catch (error) {
      console.error('❌ Error activating admin user:', error);
      throw error;
    }
  }
} 