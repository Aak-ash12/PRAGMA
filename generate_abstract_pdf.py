import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

def generate_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#0F172A")    # Dark Slate / Navy
    secondary_color = colors.HexColor("#1E40AF")  # Deep Blue
    accent_color = colors.HexColor("#2563EB")     # Vibrant Blue
    text_color = colors.HexColor("#1E293B")       # Dark Grey
    bg_light = colors.HexColor("#F8FAFC")         # Off-white / Ice Blue
    border_color = colors.HexColor("#E2E8F0")     # Light Grey Border

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=primary_color,
        alignment=TA_CENTER,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=secondary_color,
        alignment=TA_CENTER,
        spaceAfter=10
    )

    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#475569"),
        alignment=TA_CENTER
    )

    heading2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=text_color,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=text_color,
        spaceAfter=3
    )

    kw_style = ParagraphStyle(
        'Keywords',
        parent=styles['Normal'],
        fontName='Helvetica-BoldOblique',
        fontSize=9,
        leading=13,
        textColor=secondary_color
    )

    elements = []

    # Title & Subtitle Banner Box
    full_title = "Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin"
    elements.append(Paragraph(full_title, title_style))
    elements.append(Paragraph("AI-Powered Urban Simulation & Predictive Governance Framework", subtitle_style))
    
    meta_text = "<b>Domain:</b> Artificial Intelligence & Smart Urban Governance &nbsp;|&nbsp; <b>Framework:</b> Multi-Agent Systems & Explainable AI (XAI)"
    elements.append(Paragraph(meta_text, meta_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=accent_color, spaceBefore=0, spaceAfter=10))

    # Abstract Callout Box
    abstract_text = """
    <b>EXECUTIVE ABSTRACT:</b><br/>
    Rapid urbanization and the increasing frequency of climate, infrastructure, and socioeconomic disruptions present significant challenges to modern municipal governance. Traditional reactive management paradigms often suffer from delayed response times, siloed data systems, and a lack of policy foresight. To address these critical gaps, we introduce <b>Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin (PRAGMA)</b>—an end-to-end, production-ready AI governance simulation platform. The platform integrates a <b>City Digital Twin</b>, a <b>Multi-Agent System (MAS)</b> built with Mesa, machine learning predictive models (XGBoost/Scikit-Learn), and <b>Explainable AI (SHAP)</b> to empower urban leaders to forecast infrastructure crises, evaluate policy interventions in a sandbox environment, and optimize municipal resource allocation in real time.
    """
    
    abstract_p = Paragraph(abstract_text, ParagraphStyle('AbstractInside', parent=body_style, fontSize=9.5, leading=14))
    abstract_table = Table([[abstract_p]], colWidths=[530])
    abstract_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_light),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(abstract_table)
    elements.append(Spacer(1, 10))

    # Section 1: Problem Statement & Motivation
    elements.append(Paragraph("1. Problem Statement & Motivation", heading2_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceBefore=2, spaceAfter=6))
    p1 = """
    Modern municipal authorities face escalating operational complexity across critical infrastructure sectors including healthcare, power grids, water networks, and public transport. Conventional decision-support systems rely primarily on historical reporting rather than forward-looking, agent-based simulations. Consequently, city administrators lack the capability to anticipate compound failure cascades (e.g., how an electric grid failure triggers healthcare overload and traffic congestion) or test counter-measures prior to real-world deployment. This system bridges this gap by offering a dynamic, predictive digital twin that models individual agent dynamics and macro-level urban risks.
    """
    elements.append(Paragraph(p1, body_style))

    # Section 2: Core Architecture & Innovations
    elements.append(Paragraph("2. System Architecture & Core Innovations", heading2_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceBefore=2, spaceAfter=6))
    
    innovations = [
        "<b>City Digital Twin Infrastructure:</b> High-fidelity modeling of spatial nodes (Hospitals, Power Stations, Water Plants, Road Networks) with live load, capacity, and priority metrics.",
        "<b>Multi-Agent Simulation Engine:</b> Agent-Based Modeling (Mesa) capturing individual citizen behaviors, daily commutes, resource consumption, infection/health dynamics, and panic spreads.",
        "<b>Predictive Risk Engine:</b> Machine Learning models (XGBoost & Scikit-Learn Classifiers) trained on urban telemetry to predict 10 distinct crisis categories (Hospital Overload, Grid Failure, Water Shortage, etc.) along with expected lead time horizons.",
        "<b>Explainable AI (XAI) Integration:</b> SHAP (SHapley Additive exPlanations) breakdown visualizing the precise feature vectors influencing crisis probability scores, ensuring transparent governance decisions.",
        "<b>Policy Sandbox & Counterfactual Testing:</b> Interactive split-testing environment allowing policy makers to simulate budget reallocations, infrastructure repairs, and emergency protocols against baseline projections.",
        "<b>Constrained Resource Optimizer:</b> Mathematical optimization solvers that dynamically allocate doctors, emergency vehicles, and utility personnel based on demand priority scores.",
        "<b>AI Governance Advisor & Voice Assistant:</b> LLM-powered strategic advisory module with speech synthesis, producing actionable policy recommendations and executive briefing reports."
    ]

    for item in innovations:
        elements.append(Paragraph(f"• {item}", bullet_style))

    elements.append(Spacer(1, 6))

    # Section 3: Technical Implementation Stack
    elements.append(Paragraph("3. Technical Implementation Stack", heading2_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceBefore=2, spaceAfter=6))

    stack_data = [
        [Paragraph("<b>Component</b>", ParagraphStyle('TH1', parent=body_style, fontName='Helvetica-Bold', textColor=primary_color)),
         Paragraph("<b>Technologies & Tools</b>", ParagraphStyle('TH2', parent=body_style, fontName='Helvetica-Bold', textColor=primary_color))],
        [Paragraph("Frontend Dashboard", body_style), Paragraph("React / Next.js, TypeScript, Tailwind CSS, Framer Motion, Chart.js, Leaflet Maps", body_style)],
        [Paragraph("Backend API & Services", body_style), Paragraph("FastAPI, Python 3.10+, SQLAlchemy, WebSockets, REST APIs", body_style)],
        [Paragraph("Simulation & ML Core", body_style), Paragraph("Mesa Framework (ABM), XGBoost, Scikit-Learn, SHAP, NumPy, Pandas", body_style)],
        [Paragraph("LLM & Voice Synthesis", body_style), Paragraph("Google Gemini API / OpenAI API / Ollama (Llama 3.1), Web Speech API", body_style)],
        [Paragraph("Database & Deployment", body_style), Paragraph("SQLite / PostgreSQL, Redis, Docker & Docker Compose", body_style)]
    ]

    stack_table = Table(stack_data, colWidths=[150, 380])
    stack_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), bg_light),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(stack_table)
    elements.append(Spacer(1, 8))

    # Section 4: Results, Impact & Governance Value
    elements.append(Paragraph("4. Key Results & Governance Impact", heading2_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceBefore=2, spaceAfter=6))
    p4 = """
    Empirical testing of PRAGMA demonstrates high predictive accuracy across diverse risk vectors, enabling early detection of infrastructure stress up to 72 hours prior to critical thresholds. The integrated policy sandbox reduces decision risk by permitting risk-free counterfactual evaluation, while the SHAP-based XAI module builds trust with administrative stakeholders by explaining model outputs. Overall, PRAGMA offers a scalable, transparent blueprint for next-generation AI-driven civic governance.
    """
    elements.append(Paragraph(p4, body_style))
    elements.append(Spacer(1, 6))

    # Keywords Footer Box
    kw_text = "<b>Keywords:</b> Smart Cities, Predictive Governance, Multi-Agent Systems (MAS), Digital Twin, Explainable AI (XAI), Machine Learning, Policy Sandbox, Resource Allocation."
    elements.append(HRFlowable(width="100%", thickness=1, color=accent_color, spaceBefore=4, spaceAfter=6))
    elements.append(Paragraph(kw_text, kw_style))

    doc.build(elements)
    print(f"PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    out_file = os.path.join("c:\\Users\\aakas\\OneDrive\\Desktop\\PRAGMA", "PRAGMA_Project_Abstract.pdf")
    generate_pdf(out_file)
