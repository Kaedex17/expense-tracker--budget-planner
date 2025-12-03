import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';

async function main() {
    const hashedPassword = bcrypt.hashSync('demo123', 10);
    
    const sampleUser = [
        {
            name: 'Demo User',
            email: 'demo@example.com',
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(users).values(sampleUser);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});