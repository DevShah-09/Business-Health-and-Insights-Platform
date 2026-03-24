"""
AI Engine Service — Generates deep business insights from financial data.
Detects patterns like poor Marketing ROI, high overheads, and category concentration.
"""
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

    insights = []
    recommendations = []
    health_score = 75
    risk_flags = []
    narrative_points = []

    # 1. Overall Performance Narrative
    if total_income > 0:
        if profit_margin > 20:
            narrative_points.append(f"🎉 Strong performance! {business_name} is operating with a healthy {profit_margin:.1f}% margin.")
        elif profit_margin > 0:
            narrative_points.append(f"📊 {business_name} is currently profitable, but margins are relatively slim at {profit_margin:.1f}%.")
        else:
            narrative_points.append(f"⚠️ Urgent: {business_name} is currently operating at a loss. Expenses are exceeding revenue.")
    else:
        narrative_points.append("📋 Waiting for transaction data to generate deep financial insights.")

    # 2. Category-Specific Insights (The requested logic)
    
    # --- Marketing ROI Analysis ---
    marketing_data = expense_breakdown.get("Marketing")
    if marketing_data:
        m_cost = marketing_data.get("amount", 0)
        m_pct = marketing_data.get("percentage", 0)
        
        # If Marketing is > 15% of revenue but profit is low
        if total_income > 0 and (m_cost / total_income) > 0.15 and profit_margin < 15:
            health_score -= 10
            risk_flags.append("low_marketing_roi")
            insights.append({
                "id": 101,
                "icon": "📢",
                "category": "Marketing",
                "impact": "High",
                "title": "Marketing Spend vs. Revenue Mismatch",
                "description": f"Marketing spend is currently { (m_cost/total_income*100):.1f}% of your total revenue. Net profitability hasn't scaled proportionally. Consider auditing campaign performance or reallocating budget to higher-converting channels.",
                "action": "Reduce non-performing marketing spend"
            })
            recommendations.append("Marketing spend increased but revenue growth didn't follow — consider reducing spend for the next quarter.")

    # --- Overhead Analysis (Rent/Utilities) ---
    rent_data = expense_breakdown.get("Rent") or expense_breakdown.get("Facilities")
    if rent_data:
        r_cost = rent_data.get("amount", 0)
        if total_income > 0 and (r_cost / total_income) > 0.20:
            health_score -= 15
            risk_flags.append("high_rent_overhead")
            insights.append({
                "id": 102,
                "icon": "🏙️",
                "category": "Overheads",
                "impact": "High",
                "title": "High Rent Impacting Profitability",
                "description": f"Rent expenses are consuming {(r_cost/total_income*100):.1f}% of your gross income. In your industry, fixed facilities costs ideally remain below 15%. This is a significant drag on your net profit.",
                "action": "Renegotiate lease or explore co-working options"
            })
            recommendations.append(f"High rent is heavily impacting your overall profitability (₹{r_cost:,.0f}/month).")

    # --- Category Concentration ---
    if expense_breakdown:
        top_cat = list(expense_breakdown.keys())[0]
        top_val = expense_breakdown[top_cat].get("percentage", 0)
        if top_val > 50:
            insights.append({
                "id": 103,
                "icon": "⚖️",
                "category": "Structure",
                "impact": "Medium",
                "title": f"Heavy Concentration in {top_cat}",
                "description": f"Over half of your total spending ({top_val:.1f}%) is concentrated in {top_cat}. This makes your business highly sensitive to price fluctuations in this single area.",
                "action": "Audit and diversify spending"
            })

    # --- Profitability Tiers ---
    if total_income > 0:
        if profit_margin > 30:
            health_score = min(100, health_score + 15)
            insights.append({
                "id": 1,
                "icon": "🚀",
                "category": "Growth",
                "impact": "High",
                "title": "Scale-Ready Profitability",
                "description": f"You're in the top 10% of businesses by margin. This is the perfect time to scale customer acquisition or invest in product R&D.",
                "action": "Invest 5% of profit in new R&D"
            })
        elif profit_margin < 0:
            health_score = max(0, health_score - 20)
            insights.append({
                "id": 1,
                "icon": "🔴",
                "category": "Survival",
                "impact": "High",
                "title": "Immediate Cost Rationalization Needed",
                "description": f"You are losing ₹{abs(net_profit):,.0f}. Without intervention, this burn rate will deplete cash reserves. Review your top 3 categories immediately.",
                "action": "Identify 10% immediate cost reduction"
            })

    # 3. Final Polish
    if not recommendations:
        recommendations = [
            "Maintain current overhead controls",
            "Set a 10% revenue growth target for next month",
            "Weekly cash flow review recommended"
        ]

    # Narrative Summary Construction
    nl_summary = " ".join(narrative_points)
    if insights:
        nl_summary += f" Key finding: {insights[0]['title']} is your primary actionable item."

    return {
        "narrative": nl_summary,
        "insights": insights,
        "recommendations": recommendations,
        "health_score": health_score,
        "risk_flags": risk_flags,
        "generated_at": datetime.utcnow().isoformat()
    }
