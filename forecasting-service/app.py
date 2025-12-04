from flask import Flask, request, jsonify
from flask_cors import CORS
from prophet import Prophet
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[os.getenv('CLIENT_URL', 'http://localhost:5173')])

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'forecasting'})

@app.route('/api/forecast/spending', methods=['POST'])
def forecast_spending():
    try:
        data = request.json
        transactions = data.get('transactions', [])
        months = data.get('months', 6)
        
        if len(transactions) < 3:
            return jsonify({
                'success': False,
                'message': 'Need at least 3 months of data'
            }), 400

        df = prepare_transaction_data(transactions)

        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            seasonality_mode='multiplicative'
        )
        
        # Add custom seasonalities
        model.add_seasonality(name='monthly', period=30.5, fourier_order=5)
        
        model.fit(df)
        
        # Make future predictions
        future = model.make_future_dataframe(periods=months, freq='M')
        forecast = model.predict(future)
        
        # Extract predictions
        predictions = extract_predictions(forecast, months)
        
        # Analyze patterns
        patterns = analyze_patterns(df, forecast)
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'patterns': patterns,
            'confidence': calculate_confidence(forecast, df)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/forecast/goal-probability', methods=['POST'])
def goal_probability():
    """Calculate probability of achieving a goal"""
    try:
        data = request.json
        goal = data.get('goal')
        transactions = data.get('transactions', [])
        
        # Get spending forecast
        df = prepare_transaction_data(transactions)
        model = Prophet()
        model.fit(df)
        
        # Calculate months to deadline
        deadline = datetime.fromisoformat(goal['deadline'])
        months_remaining = (deadline.year - datetime.now().year) * 12 + \
                          (deadline.month - datetime.now().month)
        
        if months_remaining <= 0:
            months_remaining = 1
        
        # Predict future spending
        future = model.make_future_dataframe(periods=months_remaining, freq='M')
        forecast = model.predict(future)
        
        # Calculate expected savings
        monthly_income = goal.get('monthlyIncome', 0)
        predicted_expenses = forecast['yhat'].tail(months_remaining).values
        predicted_savings = sum(monthly_income - exp for exp in predicted_expenses)
        
        # Calculate probability
        remaining = goal['targetAmount'] - goal['currentAmount']
        probability = min(predicted_savings / remaining, 1.0) if remaining > 0 else 1.0
        
        return jsonify({
            'success': True,
            'probability': round(probability * 100, 1),
            'predictedSavings': round(predicted_savings, 2),
            'requiredSavings': remaining,
            'monthsRemaining': months_remaining,
            'recommendation': generate_recommendation(probability)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

def prepare_transaction_data(transactions):
    """Convert transactions to Prophet format"""
    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    
    # Group by month and sum expenses
    monthly = df[df['type'] == 'expense'].groupby(
        df['date'].dt.to_period('M')
    )['amount'].sum()
    
    # Prophet requires 'ds' and 'y' columns
    prophet_df = pd.DataFrame({
        'ds': monthly.index.to_timestamp(),
        'y': monthly.values
    })
    
    return prophet_df

def extract_predictions(forecast, months):
    """Extract prediction data"""
    predictions = []
    future_data = forecast.tail(months)
    
    for _, row in future_data.iterrows():
        predictions.append({
            'month': row['ds'].strftime('%Y-%m'),
            'date': row['ds'].isoformat(),
            'spending': round(row['yhat'], 2),
            'lower': round(row['yhat_lower'], 2),
            'upper': round(row['yhat_upper'], 2),
            'trend': round(row['trend'], 2)
        })
    
    return predictions

def analyze_patterns(df, forecast):
    """Analyze spending patterns"""
    # Calculate trend
    trend_values = forecast['trend'].values
    trend_change = trend_values[-1] - trend_values[0]
    trend_direction = 'increasing' if trend_change > 0 else 'decreasing' if trend_change < 0 else 'stable'
    
    # Calculate average spending
    avg_spending = df['y'].mean()
    
    return {
        'trend': {
            'direction': trend_direction,
            'change': round(trend_change, 2),
            'percentage': round((trend_change / avg_spending) * 100, 2) if avg_spending > 0 else 0
        },
        'average': round(avg_spending, 2),
        'volatility': round(df['y'].std(), 2)
    }

def calculate_confidence(forecast, df):
    """Calculate prediction confidence"""
    # Based on prediction interval width
    recent_forecast = forecast.tail(1)
    interval_width = recent_forecast['yhat_upper'].values[0] - recent_forecast['yhat_lower'].values[0]
    avg_value = df['y'].mean()
    
    # Narrower interval = higher confidence
    confidence = max(0.5, 1 - (interval_width / (2 * avg_value))) if avg_value > 0 else 0.5
    return round(min(confidence, 0.95), 2)

def generate_recommendation(probability):
    """Generate recommendation based on probability"""
    if probability >= 0.8:
        return {
            'status': 'excellent',
            'message': 'You\'re on track to achieve your goal!',
            'action': 'Keep up the great work'
        }
    elif probability >= 0.6:
        return {
            'status': 'good',
            'message': 'You\'re likely to achieve your goal',
            'action': 'Stay consistent with your savings'
        }
    elif probability >= 0.4:
        return {
            'status': 'warning',
            'message': 'You might fall short of your goal',
            'action': 'Consider reducing expenses or extending deadline'
        }
    else:
        return {
            'status': 'critical',
            'message': 'Unlikely to achieve goal at current rate',
            'action': 'Significant changes needed to reach goal'
        }

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
