import { CATEGORIES, MERCHANT_PATTERNS, TYPE_INDICATORS, CONFIDENCE } from '../../config/categories.js';
import MerchantMapping from '../../models/MerchantMapping.js';

/**
 * Rule-based categorization service
 * Intelligently categorizes transactions based on merchant names and patterns
 */
class CategorizationService {
  /**
   * Normalize merchant name for matching
   */
  normalizeMerchant(merchant) {
    return merchant
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' '); // Normalize spaces
  }

  /**
   * Check if merchant matches any pattern in a category
   */
  matchPattern(normalizedMerchant, patterns) {
    for (const pattern of patterns) {
      if (normalizedMerchant.includes(pattern)) {
        // Exact word match gets higher confidence
        const words = normalizedMerchant.split(' ');
        if (words.includes(pattern)) {
          return { matched: true, confidence: CONFIDENCE.HIGH };
        }
        // Partial match gets medium confidence
        return { matched: true, confidence: CONFIDENCE.MEDIUM };
      }
    }
    return { matched: false, confidence: 0 };
  }

  /**
   * Categorize transaction using rule-based matching
   */
  async categorizeTransaction(merchant, amount, type, userId) {
    const normalizedMerchant = this.normalizeMerchant(merchant);

    // Step 1: Check user's learned mappings first (highest priority)
    if (userId) {
      const userMapping = await MerchantMapping.findOne({
        userId,
        normalizedMerchant,
      });

      if (userMapping) {
        await userMapping.recordUsage();
        return {
          category: userMapping.category,
          confidence: CONFIDENCE.HIGH,
          source: 'user',
          reasoning: 'Based on your previous categorization',
        };
      }
    }

    // Step 2: Check against merchant patterns
    let bestMatch = {
      category: CATEGORIES.OTHER,
      confidence: CONFIDENCE.FALLBACK,
      source: 'rule',
      reasoning: 'Default category',
    };

    for (const [category, patterns] of Object.entries(MERCHANT_PATTERNS)) {
      const match = this.matchPattern(normalizedMerchant, patterns);
      
      if (match.matched && match.confidence > bestMatch.confidence) {
        bestMatch = {
          category,
          confidence: match.confidence,
          source: 'rule',
          reasoning: `Matched merchant pattern for ${category}`,
        };
      }
    }

    // Step 3: Check transaction type indicators
    if (type) {
      const typePatterns = TYPE_INDICATORS[type] || [];
      const typeMatch = this.matchPattern(normalizedMerchant, typePatterns);
      
      if (typeMatch.matched) {
        // If we found a type-specific match, use it
        if (type === 'income') {
          bestMatch = {
            category: CATEGORIES.INCOME,
            confidence: CONFIDENCE.HIGH,
            source: 'rule',
            reasoning: 'Detected as income transaction',
          };
        } else if (type === 'investment') {
          bestMatch = {
            category: CATEGORIES.INVESTMENT,
            confidence: CONFIDENCE.HIGH,
            source: 'rule',
            reasoning: 'Detected as investment transaction',
          };
        }
      }
    }

    // Step 4: Amount-based heuristics (optional enhancement)
    if (amount && bestMatch.confidence < CONFIDENCE.MEDIUM) {
      // Large amounts might be rent/utilities
      if (amount > 1000) {
        const utilityMatch = this.matchPattern(normalizedMerchant, ['rent', 'mortgage', 'lease']);
        if (utilityMatch.matched) {
          bestMatch = {
            category: CATEGORIES.UTILITIES,
            confidence: CONFIDENCE.MEDIUM,
            source: 'rule',
            reasoning: 'Large recurring payment detected',
          };
        }
      }
    }

    return bestMatch;
  }

  /**
   * Learn from user correction
   */
  async learnFromCorrection(userId, merchant, suggestedCategory, correctCategory) {
    const normalizedMerchant = this.normalizeMerchant(merchant);

    // Check if mapping already exists
    let mapping = await MerchantMapping.findOne({
      userId,
      normalizedMerchant,
    });

    if (mapping) {
      // Update existing mapping
      mapping.category = correctCategory;
      mapping.source = 'user';
      mapping.confidence = CONFIDENCE.HIGH;
      mapping.timesUsed += 1;
      mapping.lastUsed = Date.now();
      await mapping.save();
    } else {
      // Create new mapping
      mapping = await MerchantMapping.create({
        userId,
        merchant,
        normalizedMerchant,
        category: correctCategory,
        source: 'user',
        confidence: CONFIDENCE.HIGH,
      });
    }

    return {
      success: true,
      message: `Learned: "${merchant}" → "${correctCategory}"`,
      mapping,
    };
  }

  /**
   * Get alternative category suggestions
   */
  async getSuggestions(merchant, amount, type, userId, limit = 3) {
    const normalizedMerchant = this.normalizeMerchant(merchant);
    const suggestions = [];

    // Get matches for all categories
    for (const [category, patterns] of Object.entries(MERCHANT_PATTERNS)) {
      const match = this.matchPattern(normalizedMerchant, patterns);
      
      if (match.matched) {
        suggestions.push({
          category,
          confidence: match.confidence,
        });
      }
    }

    // Sort by confidence and return top suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  /**
   * Batch categorize multiple transactions
   */
  async batchCategorize(transactions, userId) {
    const results = [];

    for (const transaction of transactions) {
      const result = await this.categorizeTransaction(
        transaction.merchant,
        transaction.amount,
        transaction.type,
        userId
      );
      
      results.push({
        merchant: transaction.merchant,
        ...result,
      });
    }

    return results;
  }

  /**
   * Get user's learned mappings
   */
  async getUserMappings(userId) {
    const mappings = await MerchantMapping.find({ userId })
      .sort({ timesUsed: -1, lastUsed: -1 })
      .limit(50);

    return mappings;
  }
}

export default new CategorizationService();
