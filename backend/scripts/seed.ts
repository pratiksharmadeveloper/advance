#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { SeederRunner } from '../src/seeders';

// Load environment variables
config();

const seederRunner = new SeederRunner();

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  try {
    switch (command) {
      case 'admin':
        console.log('🌱 Running admin seeder...');
        await seederRunner.runAdminSeeder();
        break;

      case 'all':
        console.log('🌱 Running all seeders...');
        await seederRunner.runAllSeeders();
        break;

      case 'create-admin':
        if (args.length < 4) {
          console.error('❌ Usage: npm run seed create-admin <firstName> <lastName> <email> <password> [phoneNumber] [address]');
          process.exit(1);
        }
        
        const [firstName, lastName, email, password, phoneNumber, address] = args;
        
        console.log('🌱 Creating custom admin...');
        await seederRunner.createCustomAdmin({
          firstName,
          lastName,
          email,
          password,
          phoneNumber: phoneNumber || undefined,
          address: address || undefined
        });
        break;

      default:
        console.log('🌱 Hospital Management System Seeder');
        console.log('');
        console.log('Usage:');
        console.log('  npm run seed admin                    - Run admin seeder only');
        console.log('  npm run seed all                      - Run all seeders');
        console.log('  npm run seed create-admin <args>      - Create custom admin user');
        console.log('');
        console.log('Examples:');
        console.log('  npm run seed admin');
        console.log('  npm run seed create-admin John Doe john@hospital.com password123 +977-98XXXXXXXX "Kathmandu, Nepal"');
        console.log('');
        process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main(); 