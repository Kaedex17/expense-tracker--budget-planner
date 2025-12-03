import { db } from '@/db';
import { budgets } from '@/db/schema';

async function main() {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const timestamp = new Date().toISOString();

    const sampleBudgets = [
        {
            userId: 1,
            category: 'Food',
            monthlyLimit: 500,
            month: currentMonth,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
        {
            userId: 1,
            category: 'Transport',
            monthlyLimit: 300,
            month: currentMonth,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
        {
            userId: 1,
            category: 'Entertainment',
            monthlyLimit: 200,
            month: currentMonth,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
        {
            userId: 1,
            category: 'Shopping',
            monthlyLimit: 400,
            month: currentMonth,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
        {
            userId: 1,
            category: 'Bills',
            monthlyLimit: 1000,
            month: currentMonth,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
        {
            userId: 1,
            category: 'Healthcare',
            monthlyLimit: 200,
            month: currentMonth,
            createdAt: timestamp,
            updatedAt: timestamp,
        }
    ];

    await db.insert(budgets).values(sampleBudgets);
    
    console.log('✅ Budgets seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});