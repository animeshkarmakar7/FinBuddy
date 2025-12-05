import Groq from 'groq-sdk';
import Transaction from '../models/Transaction.js';
import Goal from '../models/Goal.js';

class GroqCoachService {
  constructor() {
    // Validate API key when service is first used
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY is not set in environment variables');
      throw new Error('GROQ_API_KEY is required. Please add it to your .env file.');
    }

    console.log('✅ Groq API Key loaded:', process.env.GROQ_API_KEY.substring(0, 10) + '...');
    
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    this.model = 'llama-3.1-8b-instant';
    
    console.log('✅ Groq initialized with model:', this.model);
    
    // Define available functions for AI
    this.availableFunctions = this.defineAvailableFunctions();
  }
  
  /**
   * Define functions that AI can call
   */
  defineAvailableFunctions() {
    return {
      create_goal: {
        name: 'create_goal',
        description: 'Create a new financial goal for the user',
        parameters: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the goal (e.g., "Pune Trip", "New Bike")'
            },
            targetAmount: {
              type: 'number',
              description: 'Target amount in rupees'
            },
            deadline: {
              type: 'string',
              description: 'Deadline date in YYYY-MM-DD format'
            },
            category: {
              type: 'string',
              enum: ['vehicle', 'education', 'travel', 'emergency', 'home', 'investment', 'wedding', 'health', 'gadget', 'other'],
              description: 'Category of the goal'
            }
          },
          required: ['title', 'targetAmount', 'deadline']
        }
      },
      
      add_transaction: {
        name: 'add_transaction',
        description: 'Add a new income or expense transaction',
        parameters: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['income', 'expense'],
              description: 'Type of transaction'
            },
            amount: {
              type: 'number',
              description: 'Transaction amount in rupees'
            },
            category: {
              type: 'string',
              description: 'Category (e.g., Food, Transport, Salary)'
            },
            merchant: {
              type: 'string',
              description: 'Merchant or source name'
            },
            description: {
              type: 'string',
              description: 'Optional description'
            }
          },
          required: ['type', 'amount', 'category', 'merchant']
        }
      },
      
      update_goal_progress: {
        name: 'update_goal_progress',
        description: 'Add money to a goal',
        parameters: {
          type: 'object',
          properties: {
            goalTitle: {
              type: 'string',
              description: 'Title of the goal to update'
            },
            amount: {
              type: 'number',
              description: 'Amount to add in rupees'
            },
            note: {
              type: 'string',
              description: 'Optional note about the contribution'
            }
          },
          required: ['goalTitle', 'amount']
        }
      }
    };
  }

  /**
   * Enhanced chat with function calling
   */
  async chat(userId, message, conversationHistory = []) {
    try {
      const financialData = await this.gatherFinancialData(userId);
      const systemPrompt = this.createChatSystemPrompt(financialData);
      
      // Add function calling instructions to system prompt
      const enhancedSystemPrompt = `${systemPrompt}

IMPORTANT: You can perform actions for the user! When they ask you to:
- Create a goal → Use create_goal function
- Add a transaction → Use add_transaction function  
- Update goal progress → Use update_goal_progress function

Always confirm the action with the user after executing it.`;

      const messages = [
        { role: 'system', content: enhancedSystemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : msg.role,
          content: msg.content,
        })),
        { role: 'user', content: message },
      ];

      // First API call - AI decides if it needs to call a function
      const completion = await this.groq.chat.completions.create({
        messages,
        model: this.model,
        temperature: 0.7,
        max_tokens: 500,
        tools: Object.values(this.availableFunctions),
        tool_choice: 'auto'
      });

      const responseMessage = completion.choices[0]?.message;
      
      // Check if AI wants to call a function
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        const toolCall = responseMessage.tool_calls[0];
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        console.log('🤖 AI calling function:', functionName, functionArgs);
        
        // Execute the function
        const functionResult = await this.executeFunction(functionName, functionArgs, userId);
        
        // Send function result back to AI for final response
        const finalMessages = [
          ...messages,
          responseMessage,
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(functionResult)
          }
        ];
        
        const finalCompletion = await this.groq.chat.completions.create({
          messages: finalMessages,
          model: this.model,
          temperature: 0.7,
          max_tokens: 500
        });
        
        return {
          success: true,
          message: finalCompletion.choices[0]?.message?.content || 'Action completed',
          context: financialData,
          actionTaken: {
            function: functionName,
            parameters: functionArgs,
            result: functionResult
          }
        };
      }
      
      // No function call - return normal response
      return {
        success: true,
        message: responseMessage.content || 'No response generated',
        context: financialData,
      };
      
    } catch (error) {
      console.error('Chat error details:', {
        message: error.message,
        stack: error.stack,
      });
      
      if (error.message && error.message.includes('API key')) {
        throw new Error('Invalid Groq API key. Please check your .env file.');
      }
      
      throw new Error(error.message || 'Failed to process chat message');
    }
  }
  
  /**
   * Execute function called by AI
   */
  async executeFunction(functionName, parameters, userId) {
    try {
      switch(functionName) {
        case 'create_goal':
          return await this.createGoalFunction(userId, parameters);
          
        case 'add_transaction':
          return await this.addTransactionFunction(userId, parameters);
          
        case 'update_goal_progress':
          return await this.updateGoalProgressFunction(userId, parameters);
          
        default:
          return { success: false, error: `Unknown function: ${functionName}` };
      }
    } catch (error) {
      console.error(`Error executing ${functionName}:`, error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Function: Create a new goal
   */
  async createGoalFunction(userId, params) {
    const goal = await Goal.create({
      userId,
      title: params.title,
      targetAmount: params.targetAmount,
      currentAmount: 0,
      deadline: new Date(params.deadline),
      category: params.category || 'other',
      status: 'active'
    });
    
    return {
      success: true,
      message: `Created goal: ${params.title}`,
      goalId: goal._id,
      goal: {
        title: goal.title,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline,
        milestones: goal.milestones
      }
    };
  }
  
  /**
   * Function: Add a transaction
   */
  async addTransactionFunction(userId, params) {
    const transaction = await Transaction.create({
      userId,
      type: params.type,
      amount: params.amount,
      category: params.category,
      merchant: params.merchant,
      description: params.description || '',
      date: new Date()
    });
    
    return {
      success: true,
      message: `Added ${params.type} transaction: ₹${params.amount}`,
      transactionId: transaction._id,
      transaction: {
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        merchant: transaction.merchant
      }
    };
  }
  
  /**
   * Function: Update goal progress
   */
  async updateGoalProgressFunction(userId, params) {
    // Find goal by title
    const goal = await Goal.findOne({ 
      userId, 
      title: { $regex: new RegExp(params.goalTitle, 'i') },
      status: 'active'
    });
    
    if (!goal) {
      return {
        success: false,
        error: `Goal "${params.goalTitle}" not found`
      };
    }
    
    // Add contribution
    await goal.addContribution(params.amount, params.note || 'AI-assisted contribution', 'ai_suggested');
    
    // Check for newly achieved milestones
    const newlyAchieved = goal.milestones.filter(m => 
      m.achieved && 
      m.achievedDate && 
      new Date(m.achievedDate).getTime() > Date.now() - 5000 // Last 5 seconds
    );
    
    return {
      success: true,
      message: `Added ₹${params.amount} to ${goal.title}`,
      goalId: goal._id,
      progress: {
        current: goal.currentAmount,
        target: goal.targetAmount,
        percentage: ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1),
        remaining: goal.targetAmount - goal.currentAmount
      },
      milestonesAchieved: newlyAchieved.map(m => ({
        percentage: m.percentage,
        reward: m.reward
      }))
    };
  }

  // ... rest of the existing methods (getFinancialInsights, analyzeSpending, etc.)
  // Keep all existing methods unchanged
}

export default GroqCoachService;
