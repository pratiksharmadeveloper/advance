import { AppDataSource } from '../config/database';
import { AdminSeeder } from './AdminSeeder';

export class SeederRunner {
  private adminSeeder = new AdminSeeder();

  async runAllSeeders() {
    try {
      console.log('🚀 Starting database seeding...');

      // Initialize database connection
      await AppDataSource.initialize();
      console.log('✅ Database connection established');

      // Run admin seeder
      await this.adminSeeder.seed();

      console.log('🎉 All seeders completed successfully!');
      
      // List all admins
      await this.adminSeeder.listAdmins();

    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    } finally {
      // Close database connection
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log('🔌 Database connection closed');
      }
    }
  }

  async runAdminSeeder() {
    try {
      console.log('🚀 Starting admin seeder...');

      // Initialize database connection
      await AppDataSource.initialize();
      console.log('✅ Database connection established');

      // Run admin seeder
      await this.adminSeeder.seed();

      console.log('🎉 Admin seeder completed successfully!');
      
      // List all admins
      await this.adminSeeder.listAdmins();

    } catch (error) {
      console.error('❌ Admin seeding failed:', error);
      throw error;
    } finally {
      // Close database connection
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log('🔌 Database connection closed');
      }
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
      console.log('🚀 Creating custom admin...');

      // Initialize database connection
      await AppDataSource.initialize();
      console.log('✅ Database connection established');

      // Create custom admin
      const admin = await this.adminSeeder.createCustomAdmin(adminData);

      console.log('🎉 Custom admin created successfully!');
      
      // List all admins
      await this.adminSeeder.listAdmins();

      return admin;

    } catch (error) {
      console.error('❌ Custom admin creation failed:', error);
      throw error;
    } finally {
      // Close database connection
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log('🔌 Database connection closed');
      }
    }
  }
} 