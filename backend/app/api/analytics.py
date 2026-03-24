"""app/api/analytics.py — Analytics endpoints"""
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.transaction import Transaction
from app.models.business import Business
from app.services.financial_engine import (
    compute_financial_summary, 
    get_monthly_pnl, 
    get_expense_breakdown,
    compute_profitability_metrics
)
from app.services.alert_engine import detect_all_alerts

router = APIRouter()

@router.get("/businesses/{business_id}/analytics", summary="Get Analytics Dashboard Data")
async def get_analytics(business_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Return real KPIs, trends, and category breakdown from the database"""
    
    # Check if business exists
    biz = await db.get(Business, business_id)
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    # Fetch all transactions for this business
    result = await db.execute(select(Transaction).where(Transaction.business_id == business_id))
    transactions = result.scalars().all()

    if not transactions:
        return {
            "kpis": {
                "total_revenue": 0,
                "total_expenses": 0,
                "net_profit": 0,
                "cash_balance": 0,
                "revenue_delta": 0,
                "expense_delta": 0,
                "profit_delta": 0,
                "cash_delta": 0,
            },
            "trend": [],
            "categories": [],
            "expense_breakdown": [],
            "health_score": 0,
            "profit_margin": 0,
            "growth_rate": 0,
            "expense_ratio": 0,
        }

    summary = compute_financial_summary(transactions)
    monthly_pnl = get_monthly_pnl(transactions)
    expense_breakdown_raw = get_expense_breakdown(transactions)
    profitability = compute_profitability_metrics(transactions)

    # Format trend for the frontend (Jan, Feb, etc.)
    trend = []
    for item in monthly_pnl:
        try:
            # item["month"] is "YYYY-MM"
            dt = datetime.strptime(item["month"], "%Y-%m")
            trend.append({
                "month": dt.strftime("%b"),
                "revenue": item["income"],
                "expenses": item["expenses"]
            })
        except:
            trend.append({
                "month": item["month"],
                "revenue": item["income"],
                "expenses": item["expenses"]
            })

    # Format categories for frontend
    categories = []
    # Combine income and expense categories? Frontend expects {name, revenue, expenses}
    # For now, let's use the top income categories as the primary list
    for cat, amount in summary.top_income_categories.items():
        categories.append({
            "name": cat,
            "revenue": amount,
            "expenses": summary.top_expense_categories.get(cat, 0)
        })
    
    # Add any expense categories not in income
    for cat, amount in summary.top_expense_categories.items():
        if not any(c["name"] == cat for c in categories):
            categories.append({
                "name": cat,
                "revenue": 0,
                "expenses": amount
            })

    # Format expense breakdown for frontend
    expense_breakdown = []
    for cat, data in expense_breakdown_raw.items():
        expense_breakdown.append({
            "name": cat,
            "value": data["amount"]
        })

    return {
        "kpis": {
            "total_revenue": summary.total_income,
            "total_expenses": summary.total_expenses,
            "net_profit": summary.net_profit,
            "cash_balance": summary.net_profit, # Using net profit as proxy for balance if starting from 0
            "revenue_delta": 0, # delta calc would require date range filtering
            "expense_delta": 0,
            "profit_delta": 0,
            "cash_delta": 0,
        },
        "trend": trend,
        "categories": categories,
        "expense_breakdown": expense_breakdown,
        "health_score": 85, # Logic for health score could be more complex
        "profit_margin": summary.profit_margin,
        "growth_rate": 0,
        "expense_ratio": profitability["expense_ratio"],
    }


@router.get("/analytics", summary="Get Analytics Dashboard Data (Legacy Mock)")
async def get_analytics_legacy():
    """Fallback for old frontend calls"""
    return {
        "kpis": {"total_revenue": 0, "total_expenses": 0, "net_profit": 0},
        "trend": [],
        "categories": [],
        "health_score": 0
    }

