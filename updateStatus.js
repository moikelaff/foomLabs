import { PurchaseRequest } from './src/models/index.js';

async function updateStatus() {
  try {
    await PurchaseRequest.update(
      { status: 'PENDING' },
      { where: { id: 2 } }
    );
    console.log('✅ Updated purchase request 2 to PENDING status');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateStatus();
