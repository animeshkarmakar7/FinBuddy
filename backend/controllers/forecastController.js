import forecastService from '../services/forecastService.js';

// @desc    Get spending forecast
// @route   GET /api/forecast/spending/:months
// @access  Private
export const getSpendingForecast = async (req, res) => {
  try {
    const months = parseInt(req.params.months) || 6;
    
    const forecast = await forecastService.predictSpending(req.user.id, months);

    res.status(200).json(forecast);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Check forecasting service health
// @route   GET /api/forecast/health
// @access  Private
export const checkForecastHealth = async (req, res) => {
  try {
    const isHealthy = await forecastService.checkServiceHealth();

    res.status(200).json({
      success: true,
      healthy: isHealthy,
      message: isHealthy 
        ? 'Forecasting service is running' 
        : 'Forecasting service is unavailable',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
