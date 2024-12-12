import { seedChineseTranslations } from './translations/chinese';
import { seedVietnameseTranslations } from './translations/vietnamese';
import { seedJapaneseTranslations } from './translations/japanese';
import { seedThaiTranslations } from './translations/thai';
import { DatabaseService } from '../../services/database';

export async function seedAllTranslations(): Promise<void> {
  const db = DatabaseService.getInstance();
  
  try {
    console.log('Starting database seeding...');
    
    // Begin transaction
    await db.pool.query('BEGIN');

    console.log('Seeding Chinese translations...');
    await seedChineseTranslations();
    
    console.log('Seeding Vietnamese translations...');
    await seedVietnameseTranslations();
    
    console.log('Seeding Japanese translations...');
    await seedJapaneseTranslations();
    
    console.log('Seeding Thai translations...');
    await seedThaiTranslations();

    // Commit transaction
    await db.pool.query('COMMIT');
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    // Rollback on error
    await db.pool.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  }
}

// CLI support
if (require.main === module) {
  seedAllTranslations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
} 