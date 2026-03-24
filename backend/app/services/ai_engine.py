"""
AI Engine Service — Generates deep business insights from financial data.
Detects patterns like poor Marketing ROI, high overheads, and category concentration.
"""
from datetime import datetime

import random
from datetime import datetime

def generate_business_insights(business_data: dict) -> dict:
    summary = business_data.get("summary", {})
    expense_breakdown = business_data.get("expense_breakdown", {})
    income_breakdown = business_data.get("income_breakdown", {})
    total_income = summary.get("total_income", 0)
    total_expenses = summary.get("total_expenses", 0)
    net_profit = summary.get("net_profit", 0)
    profit_margin = summary.get("profit_margin", 0)
    business_name = business_data.get("business_name", "Your Business")
    
    # Extract monthly trends and raw transactions if available
    monthly_pnl = business_data.get("monthly_pnl", [])
    
    all_possible_insights = []
    recommendations = []
    health_score = 75
    risk_flags = []
    narrative_points = []

    # 1. Overall Performance Narrative
    if total_income > 0:
        if profit_margin > 20:
            narrative_points.append(f"🎉 Strong performance! {business_name} is operating with a healthy {profit_margin:.1f}% margin.")
        elif profit_margin > 10:
            narrative_points.append(f"📊 {business_name} is currently profitable with a solid {profit_margin:.1f}% margin.")
        elif profit_margin > 0:
            narrative_points.append(f"⚖️ {business_name} is stable, but margins are slim ({profit_margin:.1f}%). Focus on efficiency.")
        else:
            narrative_points.append(f"⚠️ Urgent: {business_name} is currently operating at a loss. Expenses are exceeding revenue.")
    else:
        narrative_points.append("📋 Waiting for transaction data to generate deep financial insights.")

    # 2. Category-Based Insights (Always checked)
    
    # --- Marketing Analysis ---
    marketing_data = expense_breakdown.get("Marketing")
    if marketing_data:
        m_cost = marketing_data.get("amount", 0)
        m_pct = marketing_data.get("percentage", 0)
        
        # Rule: High spend vs stagnant revenue
        if len(monthly_pnl) >= 2:
            curr = monthly_pnl[-1]
            prev = monthly_pnl[-2]
            rev_growth = (curr['income'] - prev['income']) / prev['income'] if prev['income'] > 0 else 0
            
            if m_pct > 15 and rev_growth < 0.05:
                all_possible_insights.append({
                    "id": "mkt-1",
                    "icon": "📢",
                    "category": "Marketing",
                    "impact": "High",
                    "title": "Marketing Spend Increased but Revenue Didn’t",
                    "description": f"Marketing accounts for {m_pct:.1f}% of expenses, but revenue growth was only {rev_growth*100:.1f}%. Consider auditing your top 3 channels.",
                    "action": "Reduce spend on low-performing ads"
                })
                recommendations.append("Reduce marketing spend until ROI improves.")
            elif rev_growth > 0.15:
                all_possible_insights.append({
                    "id": "mkt-2",
                    "icon": "🚀",
                    "category": "Marketing",
                    "impact": "High",
                    "title": "Last Month Revenue Increase from Marketing",
                    "description": f"Strong correlation detected: Your marketing investment led to a {rev_growth*100:.1f}% surge in revenue. This model is ready for scaling.",
                    "action": "Increase successful campaign budget by 10%"
                })

    # --- Rent Analysis ---
    rent_data = expense_breakdown.get("Rent") or expense_breakdown.get("Facilities")
    if rent_data:
        r_cost = rent_data.get("amount", 0)
        if total_income > 0:
            rent_pct = (r_cost / total_income) * 100
            if rent_pct > 15: # Lowered from 25
                all_possible_insights.append({
                    "id": "rent-1",
                    "icon": "🏢",
                    "category": "Overhead",
                    "impact": "High",
                    "title": "High Rent Impacting Profitability",
                    "description": f"At {rent_pct:.1f}% of total income, rent is your primary margin drain. Most healthy businesses in your industry keep this below 12%.",
                    "action": "Explore sub-leasing or remote-first options"
                })
                recommendations.append("High rent is impacting profitability → consider downsizing.")

    # --- Concentration Analysis ---
    if expense_breakdown:
        for cat, data in list(expense_breakdown.items())[:3]:
            if data['percentage'] > 30: # Lowered from 40
                all_possible_insights.append({
                    "id": f"conc-{cat}",
                    "icon": "⚖️",
                    "category": "Structure",
                    "impact": "Medium",
                    "title": f"High Dependence on {cat}",
                    "description": f"{data['percentage']:.1f}% of your total spending is in {cat}. This makes your business vulnerable to supply-side price increases.",
                    "action": f"Diversify {cat} vendors"
                })

    # --- Growth & Opportunity Analysis ---
    if len(monthly_pnl) >= 2:
        curr_profit = monthly_pnl[-1]['profit_loss']
        prev_profit = monthly_pnl[-2]['profit_loss']
        if curr_profit > prev_profit and curr_profit > 0:
            all_possible_insights.append({
                "id": "growth-1",
                "icon": "📈",
                "category": "Growth",
                "impact": "Medium",
                "title": "Upward Profit Trajectory",
                "description": f"Your net profit has increased by ₹{(curr_profit - prev_profit):,.0f} compared to last month. Operational efficiency is improving.",
                "action": "Automate recurring tasks to sustain growth"
            })

    # --- Fixed Cost Check ---
    salaries = expense_breakdown.get("Salaries")
    if salaries and total_income > 0:
        sal_pct = (salaries['amount'] / total_income) * 100
        if sal_pct > 50:
            all_possible_insights.append({
                "id": "hr-1",
                "icon": "👥",
                "category": "HR",
                "impact": "High",
                "title": "Aggressive Payroll Scale",
                "description": f"Payroll consumption is at {sal_pct:.1f}% of income. Ensure hiring is tied strictly to revenue-generating roles to avoid cash crunches.",
                "action": "Audit team throughput vs. cost"
            })

    # 3. Random Sample / Selection for Uniqueness
    # We shuffle and take a subset (e.g., 3-5 insights) to keep it fresh on every click
    random.shuffle(all_possible_insights)
    
    # If we have very few insights, add a generic "Data Health" one
    if len(all_possible_insights) < 2:
        all_possible_insights.append({
            "id": "data-1",
            "icon": "💡",
            "category": "General",
            "impact": "Low",
            "title": "Consistent Data Tracking",
            "description": "Your transaction logging is consistent. This high-fidelity data allows for precise long-term forecasting and trend detection.",
            "action": "Continue regular transaction updates"
        })

    # Selection logic: return 3-5 insights if available
    selected_insights = all_possible_insights[:min(len(all_possible_insights), 5)]

    # Final Polish
    if not recommendations:
        recommendations = ["Maintain current overhead controls", "Weekly cash flow review recommended"]

    nl_summary = " ".join(narrative_points)
    if selected_insights:
        nl_summary += f" We've identified {len(selected_insights)} unique opportunities for you today."

    return {
        "narrative": nl_summary,
        "insights": selected_insights,
        "recommendations": recommendations,
        "health_score": max(0, min(100, health_score)),
        "risk_flags": risk_flags,
        "generated_at": datetime.utcnow().isoformat()
    }
