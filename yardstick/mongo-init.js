// MongoDB initialization script
db = db.getSiblingDB('yardstick');

// Create collections
db.createCollection('transactions');
db.createCollection('budgets');

// Create indexes for better performance
db.transactions.createIndex({ "date": 1 });
db.transactions.createIndex({ "category": 1 });
db.budgets.createIndex({ "month": 1, "category": 1 });

print('MongoDB initialized successfully'); 