// Category definitions and rules for transaction categorization
export const CATEGORIES = {
  FOOD_DINING: 'Food & Dining',
  SHOPPING: 'Shopping',
  TRANSPORTATION: 'Transportation',
  UTILITIES: 'Utilities',
  ENTERTAINMENT: 'Entertainment',
  HEALTHCARE: 'Healthcare',
  INVESTMENT: 'Investment',
  INCOME: 'Income',
  EDUCATION: 'Education',
  TRAVEL: 'Travel',
  OTHER: 'Other',
};

// Comprehensive merchant patterns for categorization
export const MERCHANT_PATTERNS = {
  [CATEGORIES.FOOD_DINING]: [
    // Coffee shops
    'starbucks', 'dunkin', 'costa', 'cafe', 'coffee',
    // Fast food
    'mcdonalds', 'burger king', 'kfc', 'subway', 'taco bell', 'wendys',
    'pizza hut', 'dominos', 'papa johns', 'chipotle', 'panera',
    // Restaurants
    'restaurant', 'diner', 'bistro', 'grill', 'kitchen', 'eatery',
    'bar', 'pub', 'tavern', 'dining', 'food court',
    // Delivery
    'uber eats', 'doordash', 'grubhub', 'postmates', 'deliveroo',
    'zomato', 'swiggy', 'foodpanda',
    // Groceries
    'grocery', 'supermarket', 'whole foods', 'trader joes', 'safeway',
    'kroger', 'albertsons', 'publix', 'aldi', 'lidl', 'tesco',
  ],

  [CATEGORIES.SHOPPING]: [
    // Online retail
    'amazon', 'ebay', 'etsy', 'alibaba', 'aliexpress',
    // Department stores
    'walmart', 'target', 'costco', 'sams club', 'macys', 'nordstrom',
    'kohls', 'jcpenney', 'dillards',
    // Fashion
    'zara', 'h&m', 'gap', 'old navy', 'forever 21', 'uniqlo',
    'nike', 'adidas', 'footlocker',
    // Electronics
    'best buy', 'apple store', 'microsoft store', 'gamestop',
    // General
    'store', 'shop', 'mall', 'boutique', 'outlet', 'market',
  ],

  [CATEGORIES.TRANSPORTATION]: [
    // Ride sharing
    'uber', 'lyft', 'ola', 'grab', 'bolt', 'didi',
    // Fuel
    'shell', 'chevron', 'exxon', 'bp', 'mobil', 'texaco',
    'gas station', 'fuel', 'petrol',
    // Parking
    'parking', 'park', 'garage',
    // Public transit
    'metro', 'subway', 'bus', 'train', 'transit', 'railway',
    // Auto services
    'auto', 'car wash', 'oil change', 'tire', 'mechanic',
  ],

  [CATEGORIES.UTILITIES]: [
    'electric', 'electricity', 'power', 'energy',
    'water', 'gas', 'heating', 'cooling',
    'internet', 'wifi', 'broadband', 'cable',
    'phone', 'mobile', 'cellular', 'verizon', 'at&t', 't-mobile',
    'utility', 'bill payment',
  ],

  [CATEGORIES.ENTERTAINMENT]: [
    // Streaming
    'netflix', 'hulu', 'disney+', 'hbo', 'prime video', 'spotify',
    'apple music', 'youtube premium', 'twitch',
    // Gaming
    'steam', 'playstation', 'xbox', 'nintendo', 'epic games',
    // Movies & Events
    'cinema', 'theater', 'movie', 'concert', 'tickets', 'ticketmaster',
    // Sports & Recreation
    'gym', 'fitness', 'yoga', 'sports', 'recreation',
  ],

  [CATEGORIES.HEALTHCARE]: [
    'hospital', 'clinic', 'doctor', 'physician', 'medical',
    'pharmacy', 'cvs', 'walgreens', 'rite aid', 'medicine',
    'dental', 'dentist', 'vision', 'optometry', 'health',
    'insurance', 'medicare', 'medicaid',
  ],

  [CATEGORIES.INVESTMENT]: [
    'robinhood', 'etrade', 'fidelity', 'charles schwab', 'vanguard',
    'td ameritrade', 'webull', 'coinbase', 'binance', 'kraken',
    'stock', 'crypto', 'bitcoin', 'ethereum', 'investment',
    'mutual fund', 'etf', 'bond', 'securities',
  ],

  [CATEGORIES.INCOME]: [
    'salary', 'payroll', 'wage', 'income', 'payment received',
    'deposit', 'transfer in', 'reimbursement', 'refund',
    'dividend', 'interest', 'bonus', 'commission',
  ],

  [CATEGORIES.EDUCATION]: [
    'university', 'college', 'school', 'tuition', 'education',
    'coursera', 'udemy', 'skillshare', 'masterclass',
    'books', 'textbook', 'library', 'student',
  ],

  [CATEGORIES.TRAVEL]: [
    'airline', 'flight', 'airport', 'airways', 'delta', 'united',
    'american airlines', 'southwest', 'jetblue',
    'hotel', 'motel', 'airbnb', 'booking.com', 'expedia',
    'travel', 'vacation', 'trip', 'tour',
  ],
};

// Keywords that indicate transaction type
export const TYPE_INDICATORS = {
  income: [
    'salary', 'paycheck', 'deposit', 'payment received',
    'transfer in', 'refund', 'reimbursement', 'dividend',
    'interest', 'bonus', 'commission', 'income',
  ],
  expense: [
    'purchase', 'payment', 'withdrawal', 'debit', 'charge',
  ],
  investment: [
    'investment', 'stock purchase', 'crypto buy', 'fund',
  ],
};

// Confidence levels
export const CONFIDENCE = {
  HIGH: 0.95,      // Exact match
  MEDIUM: 0.75,    // Partial match
  LOW: 0.50,       // Weak match
  FALLBACK: 0.30,  // Default category
};
