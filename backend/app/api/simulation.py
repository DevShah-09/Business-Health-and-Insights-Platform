"""
app/api/simulation.py — Interactive Scenario Simulation Routes
"""
import uuid
from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.transaction import Transaction
from app.services.financial_engine import compute_financial_summary

router = APIRouter()

@router.post("/businesses/{business_id}/simulation/run")
async def execute_simulation(
    business_id: uuid.UUID,
    params: dict = Body(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Run a simulation based on percentage changes to income and expenses.
    """
    income_change_pct = params.get("income_change_pct", 0)
    expense_change_pct = params.get("expense_change_pct", 0)

    # 1. Fetch current transaction summary
    result = await db.execute(select(Transaction).where(Transaction.business_id == business_id))
    transactions = result.scalars().all()
    current_summary = compute_financial_summary(transactions)

    # 2. Apply deltas
    # (Simplified: apply percentages to the totals)
    proj_income = current_summary.total_income * (1 + (income_change_pct / 100))
    proj_expense = current_summary.total_expenses * (1 + (expense_change_pct / 100))
    proj_profit = proj_income - proj_expense
    proj_margin = (proj_profit / proj_income * 100) if proj_income > 0 else 0

    return {
        "current": {
            "total_income": current_summary.total_income,
            "total_expenses": current_summary.total_expenses,
            "net_profit": current_summary.net_profit,
            "profit_margin": current_summary.profit_margin,
        },
        "projected": {
            "total_income": round(proj_income, 2),
            "total_expenses": round(proj_expense, 2),
            "net_profit": round(proj_profit, 2),
            "profit_margin": round(proj_margin, 2),
        },
        "impact": {
            "income_delta": round(proj_income - current_summary.total_income, 2),
            "expense_delta": round(proj_expense - current_summary.total_expenses, 2),
            "profit_delta": round(proj_profit - current_summary.net_profit, 2),
        }
    }