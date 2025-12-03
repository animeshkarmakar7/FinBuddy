import PaymentMethod from '../models/PaymentMethod.js';

// @desc    Get all payment methods for user
// @route   GET /api/payment-methods
// @access  Private
export const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ userId: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: paymentMethods.length,
      data: paymentMethods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment methods',
      error: error.message,
    });
  }
};

// @desc    Create payment method
// @route   POST /api/payment-methods
// @access  Private
export const createPaymentMethod = async (req, res) => {
  try {
    const paymentMethodData = {
      ...req.body,
      userId: req.user.id,
    };

    const paymentMethod = await PaymentMethod.create(paymentMethodData);

    res.status(201).json({
      success: true,
      data: paymentMethod,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment method',
      error: error.message,
    });
  }
};

// @desc    Update payment method
// @route   PUT /api/payment-methods/:id
// @access  Private
export const updatePaymentMethod = async (req, res) => {
  try {
    let paymentMethod = await PaymentMethod.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found',
      });
    }

    paymentMethod = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: paymentMethod,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment method',
      error: error.message,
    });
  }
};

// @desc    Delete payment method
// @route   DELETE /api/payment-methods/:id
// @access  Private
export const deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found',
      });
    }

    await paymentMethod.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting payment method',
      error: error.message,
    });
  }
};
