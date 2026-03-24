"""
app/api/forecast.py — Revenue/expense forecasting route
"""
import uuid
import calendar
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.transaction import Transaction
from app.services.forecasting import forecast_next_n_months

router = APIRouter()

@router.get("/businesses/{business_id}/forecast")
async def forecast(
    business_id: uuid.UUID,
    months: int = Query(default=6, ge=1, le=24, description="Number of months to forecast"),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns a structured forecast with a summary and monthly breakdown.
    Expected by frontend Forecast.jsx and ForecastChart.jsx.
    """
    result = await db.execute(select(Transaction).where(Transaction.business_id == business_id))
    transactions = result.scalars().all()
    
    # 1. Get raw forecast points
    raw_points = forecast_next_n_months(transactions, n=months)
    
    # Generate Historical Data (last 4 months) to prepend to chart
    monthly_data = []
    
    # We want to show a seamless line, so let's get actuals leading up to the forecast.
    # Group past transactions by month.
    import pandas as pd
    df = pd.DataFrame([{"amount": float(t.amount), "type": t.type.value, "date": pd.to_datetime(t.transaction_date)} for t in transactions])
    
    actuals = {}
    if not df.empty:
        df["month"] = df["date"].dt.to_period("M")
        for m in df["month"].unique():
            m_df = df[df["month"] == m]
            inc = m_df[m_df["type"] == "income"]["amount"].sum()
            exp = m_df[m_df["type"] == "expense"]["amount"].sum()
            actuals[str(m)] = {
                "month": m.strftime("%b"),
                "revenue": float(inc),
                "expenses": float(exp),
                "cashflow": float(inc - exp),
                "isPredicted": False
            }
            
    # Sort past actuals and take last 4
    sorted_actuals = [actuals[m] for m in sorted(actuals.keys())]
    monthly_data.extend(sorted_actuals[-4:])
    
    # 2. Format for ForecastChart
    avg_i_conf, avg_e_conf = 0.0, 0.0
    for p in raw_points:
        try:
            dt = datetime.strptime(p.date, "%Y-%m")
            month_label = calendar.month_name[dt.month][:3]
        except Exception:
            month_label = p.date

        monthly_data.append({
            "month": month_label,
            "revenue": p.predicted_income,
            "expenses": p.predicted_expenses,
            "cashflow": round(p.predicted_income - p.predicted_expenses, 2),
            "isPredicted": True
        })
        avg_i_conf = p.income_confidence
        avg_e_conf = p.expense_confidence

    # 3. Compute Summary from FUTURE RAW POINTS ONLY
    total_revenue = sum(p.predicted_income for p in raw_points)
    total_expenses = sum(p.predicted_expenses for p in raw_points)
    
    summary = {
        "predicted_revenue": round(total_revenue, 2),
        "predicted_expenses": round(total_expenses, 2),
        "predicted_cashflow": round(total_revenue - total_expenses, 2),
        "revenue_confidence": round(avg_i_conf) if raw_points else 88,
        "expense_confidence": round(avg_e_conf) if raw_points else 92
    }

    return {
        "summary": summary,
        "monthly": monthly_data
    }
