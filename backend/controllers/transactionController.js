import Transaction from '../models/Transaction.js';

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      userId: req.user.id,
    };

    const transaction = await Transaction.create(transactionData);

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating transaction',
      error: error.message,
    });
  }
};

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { type, status, startDate, endDate, category } = req.query;
    
    const filter = { userId: req.user.id };

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message,
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
      error: error.message,
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating transaction',
      error: error.message,
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction',
      error: error.message,
    });
  }
};

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats
// @access  Private
export const getTransactionStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions for the user
    const transactions = await Transaction.find({ userId });

    // Calculate totals by type
    const stats = {
      totalIncome: 0,
      totalExpense: 0,
      totalInvestment: 0,
      transactionCount: transactions.length,
      byCategory: {},
      byMonth: {},
      recentTransactions: [],
    };

    transactions.forEach((transaction) => {
      const amount = transaction.amount;

      // Sum by type
      if (transaction.type === 'income') {
        stats.totalIncome += amount;
      } else if (transaction.type === 'expense') {
        stats.totalExpense += amount;
      } else if (transaction.type === 'investment') {
        stats.totalInvestment += amount;
      }

      // Group by category
      if (!stats.byCategory[transaction.category]) {
        stats.byCategory[transaction.category] = {
          total: 0,
          count: 0,
          type: transaction.type,
        };
      }
      stats.byCategory[transaction.category].total += amount;
      stats.byCategory[transaction.category].count += 1;

      // Group by month with actual date for sorting
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
      const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM for sorting
      
      if (!stats.byMonth[sortKey]) {
        stats.byMonth[sortKey] = {
          month: monthKey,
          income: 0,
          expense: 0,
          investment: 0,
          date: new Date(date.getFullYear(), date.getMonth(), 1), // First day of month for sorting
        };
      }
      stats.byMonth[sortKey][transaction.type] += amount;
    });

    // Convert byMonth object to sorted array
    stats.byMonth = Object.values(stats.byMonth)
      .sort((a, b) => a.date - b.date) // Sort chronologically
      .reduce((acc, item) => {
        acc[item.month] = {
          income: item.income,
          expense: item.expense,
          investment: item.investment,
        };
        return acc;
      }, {});

    // Get recent transactions (last 10)
    stats.recentTransactions = transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // Calculate net worth
    stats.netWorth = stats.totalIncome - stats.totalExpense + stats.totalInvestment;
    stats.availableBalance = stats.totalIncome - stats.totalExpense;

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating statistics',
      error: error.message,
    });
  }
};
