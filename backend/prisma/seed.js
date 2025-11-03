import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Read sample products from JSON file
  const sampleDataPath = path.join(__dirname, 'sampleProducts.json');
  const sampleProducts = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

  console.log(`📦 Found ${sampleProducts.length} products to seed`);

  // Create or update products
  for (const product of sampleProducts) {
    const existing = await prisma.product.findFirst({
      where: { productUrl: product.productUrl },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          title: product.title,
          price: product.price,
          rating: product.rating,
          reviewsCount: product.reviewsCount,
          imageUrl: product.imageUrl,
          priceHistory: product.priceHistory,
        },
      });
      console.log(`✅ Updated: ${product.title.substring(0, 50)}...`);
    } else {
      await prisma.product.create({
        data: product,
      });
      console.log(`✨ Created: ${product.title.substring(0, 50)}...`);
    }
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
