import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL!);

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users_table WHERE email = 'admin@dental.com'
    `;
    
    if (existingUser.length > 0) {
      console.log('✓ Test user already exists');
      console.log('Email: admin@dental.com');
      console.log('Password: admin123');
      return;
    }
    
    // Create test user
    await sql`
      INSERT INTO users_table (email, password)
      VALUES ('admin@dental.com', 'admin123')
    `;
    
    console.log('✓ Test user created successfully');
    console.log('Email: admin@dental.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
