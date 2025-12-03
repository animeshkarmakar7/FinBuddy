import Transaction from './models/Transaction.js';
import PaymentMethod from './models/PaymentMethod.js';
import User from './models/User.js';
import connectDB from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Get the first user (or create a test user)
    let user = await User.findOne();
    
    if (!user) {
      console.log('No user found. Please register a user first through the frontend.');
      process.exit(1);
    }

    console.log(`📊 Seeding data for user: ${user.name} (${user.email})`);

    // Clear existing data for this user
    await Transaction.deleteMany({ userId: user._id });
    await PaymentMethod.deleteMany({ userId: user._id });

    // Seed Payment Methods
    const paymentMethods = [
      {
        userId: user._id,
        type: 'credit-card',
        name: 'Visa Platinum',
        number: '**** 4532',
        balance: 5420,
        limit: 10000,
        color: 'from-blue-500 to-cyan-500',
        isDefault: true,
      },
      {
        userId: user._id,
        type: 'debit-card',
        name: 'Mastercard',
        number: '**** 8765',
        balance: 8780,
        color: 'from-violet-500 to-purple-500',
        isDefault: false,
      },
      {
        userId: user._id,
        type: 'digital-wallet',
        name: 'PayPal',
        number: 'user@example.com',
        balance: 2340,
        color: 'from-cyan-500 to-teal-500',
        isDefault: false,
      },
    ];

    await PaymentMethod.insertMany(paymentMethods);
    console.log('✅ Payment methods seeded');

    // Seed Transactions
    const transactions = [
      // Income transactions
      {
        userId: user._id,
        type: 'income',
        category: 'Salary',
        merchant: 'Tech Corp Inc.',
        amount: 5500,
        date: new Date('2025-12-01'),
        time: '09:00',
        status: 'completed',
        icon: 'DollarSign',
        color: 'emerald',
      },
      {
        userId: user._id,
        type: 'income',
        category: 'Freelance',
        merchant: 'Client Project',
        amount: 1200,
        date: new Date('2025-11-29'),
        time: '16:20',
        status: 'pending',
        icon: 'DollarSign',
        color: 'emerald',
      },
      {
        userId: user._id,
        type: 'income',
        category: 'Investment',
        merchant: 'Dividend Payment',
        amount: 320.5,
        date: new Date('2025-11-25'),
        time: '12:00',
        status: 'completed',
        icon: 'TrendingUp',
        color: 'emerald',
      },
      // Expense transactions
      {
        userId: user._id,
        type: 'expense',
        category: 'Shopping',
        merchant: 'Amazon',
        amount: 234.5,
        date: new Date('2025-12-02'),
        time: '14:32',
        status: 'completed',
        icon: 'ShoppingBag',
        color: 'rose',
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Food & Dining',
        merchant: 'Starbucks',
        amount: 12.5,
        date: new Date('2025-12-01'),
        time: '08:15',
        status: 'completed',
        icon: 'Coffee',
        color: 'rose',
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Transportation',
        merchant: 'Uber',
        amount: 28.75,
        date: new Date('2025-11-30'),
        time: '18:45',
        status: 'completed',
        icon: 'Car',
        color: 'rose',
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Utilities',
        merchant: 'Electric Company',
        amount: 145.3,
        date: new Date('2025-11-28'),
        time: '10:00',
        status: 'completed',
        icon: 'Home',
        color: 'rose',
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Shopping',
        merchant: 'Apple Store',
        amount: 899,
        date: new Date('2025-11-27'),
        time: '15:30',
        status: 'completed',
        icon: 'Smartphone',
        color: 'rose',
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Food & Dining',
        merchant: 'Restaurant',
        amount: 85.6,
        date: new Date('2025-11-26'),
        time: '19:45',
        status: 'completed',
        icon: 'Utensils',
        color: 'rose',
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Shopping',
        merchant: 'Target',
        amount: 156.2,
        date: new Date('2025-11-24'),
        time: '11:20',
        status: 'completed',
        icon: 'ShoppingBag',
        color: 'rose',
      },
      // Investment transactions
      {
        userId: user._id,
        type: 'investment',
        category: 'Stocks',
        merchant: 'Apple Inc (AAPL)',
        amount: 2500,
        date: new Date('2025-11-20'),
        time: '10:30',
        status: 'completed',
        icon: 'TrendingUp',
        color: 'violet',
      },
      {
        userId: user._id,
        type: 'investment',
        category: 'Cryptocurrency',
        merchant: 'Bitcoin (BTC)',
        amount: 5000,
        date: new Date('2025-11-15'),
        time: '14:00',
        status: 'completed',
        icon: 'TrendingUp',
        color: 'violet',
      },
      {
        userId: user._id,
        type: 'investment',
        category: 'Mutual Funds',
        merchant: 'Vanguard S&P 500',
        amount: 3000,
        date: new Date('2025-11-10'),
        time: '09:15',
        status: 'completed',
        icon: 'TrendingUp',
        color: 'violet',
      },
    ];

    await Transaction.insertMany(transactions);
    console.log('✅ Transactions seeded');

    console.log('\n🎉 Seed data created successfully!');
    console.log(`📊 Created ${paymentMethods.length} payment methods`);
    console.log(`💰 Created ${transactions.length} transactions`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
