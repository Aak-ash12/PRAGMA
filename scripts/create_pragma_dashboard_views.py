import subprocess
import os

# Views mapping:
# 1. Main Dashboard (pragma_dashboard_hd.png)
# 2. Predictive Simulation (pragma_simulation_hd.png)
# 3. Crisis Prediction Engine (pragma_prediction_hd.png)
# 4. Explainable AI / SHAP (pragma_xai_hd.png)
# 5. Policy Sandbox / Resource Optimizer (pragma_policies_hd.png)

def get_sidebar(active_item):
    menu_items = [
        ("Dashboard", "dashboard", '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>'),
        ("City Digital Twin", "digital-twin", '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'),
        ("Multi-Agent ABM", "abm", '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'),
        ("Crisis Prediction", "prediction", '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/></svg>'),
        ("Policy Sandbox", "sandbox", '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'),
        ("Explainable AI", "xai", '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'),
        ("Advisor & Reports", "reports", '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'),
    ]
    
    html = """
    <div class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-box">P</div>
        <div class="logo-text">PRAGMA</div>
      </div>
      <div class="sidebar-menu">
    """
    for label, name, icon in menu_items:
        active_class = " menu-item-active" if name == active_item else ""
        html += f'<a class="menu-item{active_class}" href="#">{icon}{label}</a>'
    html += """
      </div>
    </div>
    """
    return html

def get_base_css():
    return """
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 2400px; height: 1600px; background: #090D16;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #F1F5F9; position: relative; overflow: hidden; display: flex;
  }
  .sidebar {
    width: 280px; height: 100%; background-color: #0B1120; border-right: 2px solid #1E293B;
    padding: 30px 24px; display: flex; flex-direction: column; position: fixed; left: 0; top: 0; z-index: 100;
  }
  .sidebar-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
  .logo-box {
    background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #FFFFFF; font-weight: 800; font-size: 20px;
    width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
  }
  .logo-text { font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.5px; }
  .sidebar-menu { display: flex; flex-direction: column; gap: 8px; }
  .menu-item {
    display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px;
    font-size: 14px; font-weight: 600; color: #94A3B8; text-decoration: none; transition: all 0.2s ease;
  }
  .menu-item-active {
    background-color: #1E293B; color: #38BDF8; border-left: 3px solid #38BDF8;
    border-radius: 0 10px 10px 0; padding-left: 13px;
  }
  .main-content { flex: 1; margin-left: 280px; padding: 40px 50px; display: flex; flex-direction: column; gap: 24px; }
  .navbar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1E293B; padding-bottom: 20px; }
  .nav-title { font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; }
  .nav-user { display: flex; align-items: center; gap: 14px; }
  .user-badge {
    background-color: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2);
    color: #38BDF8; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 12px; border-radius: 12px;
  }
  .glass-card {
    background: rgba(15, 23, 42, 0.85); border: 1.5px solid #1E293B; border-radius: 20px;
    padding: 24px; box-shadow: 0 10px 15px rgba(0,0,0,0.2); display: flex; flex-direction: column;
  }
  .card-title-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1.5px solid #1E293B; padding-bottom: 12px; }
  .card-title { font-size: 18px; font-weight: 700; color: #FFFFFF; display: flex; align-items: center; gap: 10px; }
  .card-subtitle { font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; }
    """

# Write View 2: Multi-Agent ABM Simulation Page
view_sim_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PRAGMA — Multi-Agent ABM Simulation</title>
<style>
  {get_base_css()}
  .controls-row {{ display: flex; justify-content: space-between; align-items: center; background-color: #0F172A; border: 1.5px solid #1E293B; border-radius: 16px; padding: 16px 24px; }}
  .ctrl-group {{ display: flex; align-items: center; gap: 16px; }}
  .btn {{ background-color: #2563EB; color: #FFFFFF; border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 700; cursor: pointer; }}
  .btn-secondary {{ background-color: #334155; color: #94A3B8; }}
  .btn-success {{ background-color: #10B981; }}
  .sim-status {{ font-family: monospace; font-size: 14px; color: #34D399; font-weight: 700; }}
  
  .layout-grid {{ display: grid; grid-template-columns: 2fr 1fr; gap: 24px; height: 500px; }}
  .grid-map {{ flex: 1; background-color: #0A0E17; border-radius: 12px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; }}
  
  .bottom-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 24px; height: 350px; }}
  .chart-svg {{ width: 100%; height: 100%; }}
</style>
</head>
<body>
  {get_sidebar("abm")}
  <div class="main-content">
    <div class="navbar">
      <h1 class="nav-title">Multi-Agent Simulation Sandbox (Mesa ABM)</h1>
      <div class="nav-user"><span class="user-badge">ABM Engine Layers</span></div>
    </div>

    <!-- Controls Row -->
    <div class="controls-row">
      <div class="ctrl-group">
        <span style="font-weight: 700;">Scenario Selection:</span>
        <button class="btn btn-secondary">Epidemic Contagion</button>
        <button class="btn">Coastal Surge Flood</button>
        <button class="btn btn-secondary">Utilities Load Balancing</button>
      </div>
      <div class="ctrl-group">
        <button class="btn btn-success">▶ Run</button>
        <button class="btn btn-secondary">⏸ Pause</button>
        <button class="btn btn-secondary">⏭ Step</button>
        <button class="btn btn-secondary">↺ Reset</button>
        <span class="sim-status">Step: 142 / 500 [Executing...]</span>
      </div>
    </div>

    <!-- Layout Grid: Map and Stats -->
    <div class="layout-grid">
      <div class="glass-card">
        <div class="card-title-bar">
          <h2 class="card-title">Mesa 50x50 Spatial Grid</h2>
          <span class="card-subtitle">Active Agents mobility</span>
        </div>
        <div class="grid-map">
          <!-- Render stylized grid cells with agent dots -->
          <svg width="600" height="400" viewBox="0 0 600 400" style="background-color: #0F172A;">
            <!-- Grid gridlines -->
            <g stroke="#1E293B" stroke-width="0.5">
              {"".join([f'<line x1="{x}" y1="0" x2="{x}" y2="400" />' for x in range(0, 600, 20)])}
              {"".join([f'<line x1="0" y1="{y}" x2="600" y2="{y}" />' for y in range(0, 400, 20)])}
            </g>
            <!-- Road Paths (Thicker gray lanes) -->
            <rect x="280" y="0" width="40" height="400" fill="#1E293B" opacity="0.6" />
            <rect x="0" y="180" width="600" height="40" fill="#1E293B" opacity="0.6" />
            
            <!-- Agent Dots (Red = Sick/Vulnerable, Green = Healthy, Blue = Doctor, Yellow = Infrastructure workers) -->
            <!-- Healthy -->
            <circle cx="100" cy="100" r="4" fill="#10B981" />
            <circle cx="140" cy="80" r="4" fill="#10B981" />
            <circle cx="220" cy="120" r="4" fill="#10B981" />
            <circle cx="440" cy="90" r="4" fill="#10B981" />
            <circle cx="380" cy="260" r="4" fill="#10B981" />
            <circle cx="120" cy="240" r="4" fill="#10B981" />
            <circle cx="500" cy="300" r="4" fill="#10B981" />
            <!-- Vulnerable / Infected -->
            <circle cx="300" cy="200" r="5" fill="#EF4444" stroke="#FFFFFF" stroke-width="1" />
            <circle cx="290" cy="190" r="5" fill="#EF4444" />
            <circle cx="310" cy="210" r="5" fill="#EF4444" />
            <!-- Emergency Responders (Blue/Yellow) -->
            <polygon points="120,310 128,322 112,322" fill="#3B82F6" />
            <polygon points="450,210 458,222 442,222" fill="#F59E0B" />
          </svg>
        </div>
      </div>
      <div class="glass-card">
        <div class="card-title-bar">
          <h2 class="card-title">Simulation State</h2>
          <span class="card-subtitle">Active Counts</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px; justify-content: center; height: 100%;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <span>Healthy Citizen Agents</span>
            <span style="font-weight: 700; color: #10B981;">8,420</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <span>Infected Citizen Agents</span>
            <span style="font-weight: 700; color: #EF4444;">1,240</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <span>Critical ICU Cases</span>
            <span style="font-weight: 700; color: #EC4899;">140</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <span>Active Ambulances</span>
            <span style="font-weight: 700; color: #38BDF8;">12 / 15</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <span>Water Flow (cusecs)</span>
            <span style="font-weight: 700; color: #F59E0B;">14,000</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom curves -->
    <div class="bottom-grid">
      <div class="glass-card">
        <div class="card-title-bar">
          <h2 class="card-title">SIR Contagion curves</h2>
          <span class="card-subtitle">Telemetry History</span>
        </div>
        <div style="flex: 1;">
          <svg class="chart-svg" viewBox="0 0 300 150">
            <!-- Grid lines -->
            <line x1="30" y1="20" x2="280" y2="20" stroke="#1E293B" stroke-width="0.5" />
            <line x1="30" y1="70" x2="280" y2="70" stroke="#1E293B" stroke-width="0.5" />
            <line x1="30" y1="120" x2="280" y2="120" stroke="#1E293B" stroke-width="1" />
            <!-- S Curve (Susceptible) -->
            <path d="M 30,30 Q 100,40 180,100 T 280,118" fill="none" stroke="#3B82F6" stroke-width="2" />
            <!-- I Curve (Infected) -->
            <path d="M 30,120 Q 100,100 150,40 T 280,110" fill="none" stroke="#EF4444" stroke-width="2" />
            <!-- R Curve (Recovered) -->
            <path d="M 30,120 Q 120,120 180,80 T 280,30" fill="none" stroke="#10B981" stroke-width="2" />
          </svg>
        </div>
      </div>
      <div class="glass-card">
        <div class="card-title-bar">
          <h2 class="card-title">Resource Load Analytics</h2>
          <span class="card-subtitle">Grid Power Consumption</span>
        </div>
        <div style="flex: 1;">
          <svg class="chart-svg" viewBox="0 0 300 150">
            <line x1="30" y1="20" x2="280" y2="20" stroke="#1E293B" stroke-width="0.5" />
            <line x1="30" y1="70" x2="280" y2="70" stroke="#1E293B" stroke-width="0.5" />
            <line x1="30" y1="120" x2="280" y2="120" stroke="#1E293B" stroke-width="1" />
            <path d="M 30,90 L 60,85 L 90,110 L 120,40 L 150,60 L 180,30 L 210,95 L 240,40 L 280,25" fill="none" stroke="#F59E0B" stroke-width="2.5" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

# Write View 3: Crisis Prediction Engine
view_pred_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PRAGMA — Crisis Prediction Engine</title>
<style>
  {get_base_css()}
  .gauge-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }}
  .gauge-card {{ background-color: #0F172A; border: 1.5px solid #1E293B; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; align-items: center; }}
  .gauge-svg {{ width: 120px; height: 120px; margin-top: 10px; }}
  
  .timeline-card {{ height: 360px; }}
  .timeline-item {{ border-left: 2px solid #2563EB; padding-left: 20px; position: relative; margin-bottom: 20px; }}
  .timeline-item::before {{ content: ''; width: 10px; height: 10px; border-radius: 50%; background-color: #2563EB; position: absolute; left: -6px; top: 4px; }}
  .timeline-item-critical::before {{ background-color: #EF4444; }}
  
  .categories-table {{ width: 100%; border-collapse: collapse; margin-top: 12px; }}
  .categories-table th, .categories-table td {{ padding: 12px 16px; border-bottom: 1.5px solid #1E293B; text-align: left; }}
  .categories-table th {{ background-color: rgba(30, 41, 59, 0.4); color: #94A3B8; font-size: 12px; font-weight: 700; text-transform: uppercase; }}
</style>
</head>
<body>
  {get_sidebar("prediction")}
  <div class="main-content">
    <div class="navbar">
      <h1 class="nav-title">Crisis Predictor & Risk Inference</h1>
      <div class="nav-user"><span class="user-badge">Inference Active</span></div>
    </div>

    <!-- 4 Risk Gauges -->
    <div class="gauge-grid">
      <div class="gauge-card">
        <span class="card-subtitle">Coastal Flood Risk</span>
        <svg class="gauge-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1E293B" stroke-width="8" />
          <path d="M50,10 A40,40 0 1,1 10,50" fill="none" stroke="#EF4444" stroke-width="8" />
          <text x="50" y="55" fill="#FFFFFF" font-size="16" font-weight="800" text-anchor="middle">87%</text>
        </svg>
      </div>
      <div class="gauge-card">
        <span class="card-subtitle">ICU Bed Deficit</span>
        <svg class="gauge-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1E293B" stroke-width="8" />
          <path d="M50,10 A40,40 0 1,1 14,30" fill="none" stroke="#EF4444" stroke-width="8" />
          <text x="50" y="55" fill="#FFFFFF" font-size="16" font-weight="800" text-anchor="middle">96%</text>
        </svg>
      </div>
      <div class="gauge-card">
        <span class="card-subtitle">Power Grid Blackout</span>
        <svg class="gauge-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1E293B" stroke-width="8" />
          <path d="M50,10 A40,40 0 1,1 25,18" fill="none" stroke="#F59E0B" stroke-width="8" />
          <text x="50" y="55" fill="#FFFFFF" font-size="16" font-weight="800" text-anchor="middle">81%</text>
        </svg>
      </div>
      <div class="gauge-card">
        <span class="card-subtitle">Traffic Gridlock</span>
        <svg class="gauge-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1E293B" stroke-width="8" />
          <path d="M50,10 A40,40 0 1,1 25,82" fill="none" stroke="#F59E0B" stroke-width="8" />
          <text x="50" y="55" fill="#FFFFFF" font-size="16" font-weight="800" text-anchor="middle">74%</text>
        </svg>
      </div>
    </div>

    <!-- Crisis Timeline -->
    <div class="glass-card timeline-card">
      <div class="card-title-bar">
        <h2 class="card-title">Predicted Crisis Events Timeline</h2>
        <span class="card-subtitle">Occurrence Windows</span>
      </div>
      <div style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
        <div class="timeline-item timeline-item-critical">
          <div style="display: flex; justify-content: space-between; font-weight: 700;">
            <span style="color: #EF4444;">ICU Bed Deficit Spike [Chennai Region]</span>
            <span>Expected in: 48 Hours (T+2 Days)</span>
          </div>
          <p style="font-size: 13px; color: #94A3B8; margin-top: 4px;">Infection R0 drift indicates caseload exceeding available emergency reserves.</p>
        </div>
        <div class="timeline-item timeline-item-critical">
          <div style="display: flex; justify-content: space-between; font-weight: 700;">
            <span style="color: #EF4444;">Buckingham Canal Overfall Inundation [Velachery Zone]</span>
            <span>Expected in: 3 Days (T+3 Days)</span>
          </div>
          <p style="font-size: 13px; color: #94A3B8; margin-top: 4px;">145mm cumulative rainfall inflow exceeds regional outfall pumping capabilities.</p>
        </div>
        <div class="timeline-item">
          <div style="display: flex; justify-content: space-between; font-weight: 700;">
            <span style="color: #F59E0B;">Peak Thermal Grid Load Saturation [Sector 4 Subgrid]</span>
            <span>Expected in: 7 Days (T+7 Days)</span>
          </div>
          <p style="font-size: 13px; color: #94A3B8; margin-top: 4px;">Extreme heatwave projection drives peak gridload to 9,420 MW.</p>
        </div>
      </div>
    </div>

    <!-- Risk Categories Table -->
    <div class="glass-card" style="height: 380px;">
      <div class="card-title-bar">
        <h2 class="card-title">Crisis Risk Classification Vectors</h2>
        <span class="card-subtitle">10 Category Matrix</span>
      </div>
      <div style="overflow-y: auto;">
        <table class="categories-table">
          <thead>
            <tr>
              <th>Disaster Category</th>
              <th>Probability</th>
              <th>Confidence</th>
              <th>Primary Sensor Trigger</th>
              <th>Intervention State</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Coastal Inundation</strong></td>
              <td style="color: #EF4444; font-weight: 700;">87%</td>
              <td>94%</td>
              <td>Chembarambakkam Inflow (14,000 cusecs)</td>
              <td><span class="kpi-badge badge-warning">Pending Alert</span></td>
            </tr>
            <tr>
              <td><strong>ICU Outbreak Shortage</strong></td>
              <td style="color: #EF4444; font-weight: 700;">96%</td>
              <td>98%</td>
              <td>Active Case Caseload Index (12,400)</td>
              <td><span class="kpi-badge badge-warning">Pending Alert</span></td>
            </tr>
            <tr>
              <td><strong>Thermal Grid Failure</strong></td>
              <td style="color: #F59E0B; font-weight: 700;">81%</td>
              <td>89%</td>
              <td>Grid Frequency Drift (49.8 Hz)</td>
              <td><span class="kpi-badge badge-warning">Monitored</span></td>
            </tr>
            <tr>
              <td><strong>Evacuation Gridlock</strong></td>
              <td style="color: #F59E0B; font-weight: 700;">74%</td>
              <td>82%</td>
              <td>GST Road Transit Capacity (94%)</td>
              <td><span class="kpi-badge badge-warning">Monitored</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>
"""

# Write View 4: Explainable AI / SHAP Page
view_xai_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PRAGMA — Explainable AI (SHAP)</title>
<style>
  {get_base_css()}
  .summary-alert {{ background-color: rgba(37, 99, 235, 0.1); border: 1.5px solid rgba(37, 99, 235, 0.3); border-radius: 12px; padding: 16px 20px; font-size: 15px; font-weight: 600; color: #38BDF8; }}
  
  .layout-grid {{ display: grid; grid-template-columns: 2fr 1fr; gap: 24px; height: 500px; }}
  
  .shap-bar {{ display: flex; align-items: center; margin-bottom: 14px; }}
  .shap-label {{ width: 220px; font-size: 13px; font-weight: 700; color: #94A3B8; }}
  .shap-track {{ flex: 1; height: 18px; background-color: #1E293B; border-radius: 4px; position: relative; }}
  .shap-fill {{ height: 100%; border-radius: 4px; position: absolute; }}
  .fill-red {{ background-color: #EF4444; }}
  .fill-blue {{ background-color: #3B82F6; }}
  .shap-val {{ font-family: monospace; font-size: 13px; font-weight: 700; margin-left: 12px; width: 60px; text-align: right; }}
</style>
</head>
<body>
  {get_sidebar("xai")}
  <div class="main-content">
    <div class="navbar">
      <h1 class="nav-title">Explainable AI Sandbox (SHAP Attributions)</h1>
      <div class="nav-user"><span class="user-badge">XAI Engine Active</span></div>
    </div>

    <!-- Summary Alert -->
    <div class="summary-alert">
      💡 SHAP local feature attributions reveal that Rainfall Inflow (+0.42) and Dam Discharge (+0.28) are the primary drivers increasing current Coastal Flood Risk predictions, while high ambient Temperature is the secondary driver.
    </div>

    <!-- Grid: Plots and Weights -->
    <div class="layout-grid">
      <div class="glass-card">
        <div class="card-title-bar">
          <h2 class="card-title">SHAP Global Feature Importance</h2>
          <span class="card-subtitle">Mean Absolute Shapley Values</span>
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
          
          <!-- Feature 1 -->
          <div class="shap-bar">
            <div class="shap-label">Rainfall Inflow (mm)</div>
            <div class="shap-track"><div class="shap-fill fill-red" style="left: 50%; width: 42%;"></div></div>
            <div class="shap-val" style="color: #EF4444;">+0.42</div>
          </div>
          <!-- Feature 2 -->
          <div class="shap-bar">
            <div class="shap-label">Dam Discharge (cusecs)</div>
            <div class="shap-track"><div class="shap-fill fill-red" style="left: 50%; width: 28%;"></div></div>
            <div class="shap-val" style="color: #EF4444;">+0.28</div>
          </div>
          <!-- Feature 3 -->
          <div class="shap-bar">
            <div class="shap-label">River Gauge (m)</div>
            <div class="shap-track"><div class="shap-fill fill-red" style="left: 50%; width: 15%;"></div></div>
            <div class="shap-val" style="color: #EF4444;">+0.15</div>
          </div>
          <!-- Feature 4 -->
          <div class="shap-bar">
            <div class="shap-label">Temperature (°C)</div>
            <div class="shap-track"><div class="shap-fill fill-red" style="left: 50%; width: 4%;"></div></div>
            <div class="shap-val" style="color: #EF4444;">+0.04</div>
          </div>
          <!-- Feature 5 -->
          <div class="shap-bar">
            <div class="shap-label">AQI Index</div>
            <div class="shap-track"><div class="shap-fill fill-blue" style="right: 50%; width: 8%;"></div></div>
            <div class="shap-val" style="color: #3B82F6;">-0.08</div>
          </div>

        </div>
      </div>
      <div class="glass-card">
        <div class="card-title-bar">
          <h2 class="card-title">Attribution Weights</h2>
          <span class="card-subtitle">Prediction Vector</span>
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; gap: 16px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <span>Model Name</span>
            <span style="font-weight: 700;">FloodRisk_RF_v1</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <span>Model R2 Score</span>
            <span style="font-weight: 700; color: #34D399;">0.91</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <span>Dataset Rows</span>
            <span style="font-weight: 700;">14,500</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <span>Explainer Type</span>
            <span style="font-weight: 700;">TreeExplainer</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

# Write View 5: Policy Sandbox & Resource Optimizer
view_policies_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PRAGMA — Policy Sandbox & Optimizer</title>
<style>
  {get_base_css()}
  .metrics-row {{ display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }}
  .metric-card {{ background-color: #0F172A; border: 1.5px solid #1E293B; border-radius: 16px; padding: 20px; display: flex; justify-content: space-between; align-items: center; }}
  
  .layout-grid {{ display: grid; grid-template-columns: 2fr 1fr; gap: 24px; height: 500px; }}
  
  .opt-table {{ width: 100%; border-collapse: collapse; margin-top: 12px; }}
  .opt-table th, .opt-table td {{ padding: 12px 16px; border-bottom: 1.5px solid #1E293B; text-align: left; }}
  .opt-table th {{ background-color: rgba(30, 41, 59, 0.4); color: #94A3B8; font-size: 12px; font-weight: 700; text-transform: uppercase; }}
  
  .form-group {{ display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }}
  .form-label {{ font-size: 13px; font-weight: 700; color: #94A3B8; }}
  .form-input {{ background-color: #0F172A; border: 1.5px solid #1E293B; border-radius: 8px; padding: 10px 14px; color: #FFFFFF; font-size: 14px; }}
  .btn-submit {{ background-color: #2563EB; color: #FFFFFF; border: none; border-radius: 8px; padding: 12px 20px; font-size: 14px; font-weight: 700; cursor: pointer; text-align: center; margin-top: 10px; }}
</style>
</head>
<body>
  {get_sidebar("sandbox")}
  <div class="main-content">
    <div class="navbar">
      <h1 class="nav-title">Policy Sandbox & Resource Optimizer</h1>
      <div class="nav-user"><span class="user-badge">Sandbox Split A/B</span></div>
    </div>

    <!-- Top A/B metrics -->
    <div class="metrics-row">
      <div class="metric-card">
        <div>
          <span class="card-subtitle">Baseline Score (No Intervention)</span>
          <div class="nav-title" style="margin-top: 8px; color: #EF4444;">82.4</div>
        </div>
        <span style="font-size: 12px; color: #64748B;">SLA failure in 48 hours</span>
      </div>
      <div class="metric-card" style="border-color: #10B981;">
        <div>
          <span class="card-subtitle">Proposed Policy Score</span>
          <div class="nav-title" style="margin-top: 8px; color: #10B981;">95.0</div>
        </div>
        <span style="font-size: 12px; color: #10B981;">All parameters nominal</span>
      </div>
    </div>

    <!-- Grid: Optimizer and Form -->
    <div class="layout-grid">
      <div class="glass-card">
        <div class="card-title-bar">
          <h2 class="card-title">SciPy Linear Optimizer Allocation matrix</h2>
          <span class="card-subtitle">Resource Schedules</span>
        </div>
        <div style="overflow-y: auto;">
          <table class="opt-table">
            <thead>
              <tr>
                <th>Resource Category</th>
                <th>Demands</th>
                <th>Allocations</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ICU Doctors shifts</strong></td>
                <td>45 shifts</td>
                <td>45 shifts</td>
                <td><span style="color: #34D399; font-weight: 700;">100% Filled</span></td>
              </tr>
              <tr>
                <td><strong>Ambulance beats</strong></td>
                <td>12 units</td>
                <td>12 units</td>
                <td><span style="color: #34D399; font-weight: 700;">100% Filled</span></td>
              </tr>
              <tr>
                <td><strong>Utilities Repair Crews</strong></td>
                <td>8 teams</td>
                <td>8 teams</td>
                <td><span style="color: #34D399; font-weight: 700;">100% Filled</span></td>
              </tr>
              <tr>
                <td><strong>Mobile Oxygen Tanks</strong></td>
                <td>60 KL</td>
                <td>60 KL</td>
                <td><span style="color: #34D399; font-weight: 700;">100% Filled</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="glass-card">
        <div class="card-title-bar">
          <h2 class="card-title">Configure Sandbox Policies</h2>
          <span class="card-subtitle">Intervention inputs</span>
        </div>
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div class="form-group">
            <span class="form-label">Healthcare ICU Budget boost</span>
            <input class="form-input" type="text" value="+14% ICU reserve" />
          </div>
          <div class="form-group">
            <span class="form-label">Storm pump trigger threshold</span>
            <input class="form-input" type="text" value="87% runoff probability" />
          </div>
          <div class="form-group">
            <span class="form-label">Evacuation corridor pathing override</span>
            <input class="form-input" type="text" value="GST Road evacuation" />
          </div>
          <button class="btn-submit">⚡ Evaluate Policy Action</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

# Write HTML files
dir_path = "c:\\Users\\aakas\\OneDrive\Desktop\\PRAGMA"
with open(os.path.join(dir_path, "dashboard_sim.html"), "w", encoding="utf-8") as f:
    f.write(view_sim_html)
with open(os.path.join(dir_path, "dashboard_pred.html"), "w", encoding="utf-8") as f:
    f.write(view_pred_html)
with open(os.path.join(dir_path, "dashboard_xai.html"), "w", encoding="utf-8") as f:
    f.write(view_xai_html)
with open(os.path.join(dir_path, "dashboard_policies.html"), "w", encoding="utf-8") as f:
    f.write(view_policies_html)

print("HTML pages successfully created.")

# Run headless chrome screenshots
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

views = [
    ("dashboard_sim.html", "pragma_simulation_hd.png"),
    ("dashboard_pred.html", "pragma_prediction_hd.png"),
    ("dashboard_xai.html", "pragma_xai_hd.png"),
    ("dashboard_policies.html", "pragma_policies_hd.png")
]

for html_file, png_file in views:
    html_abs = os.path.join(dir_path, html_file)
    png_abs = os.path.join(dir_path, png_file)
    
    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=2400,1600",
        "--force-device-scale-factor=2",
        f"--screenshot={png_abs}",
        f"file:///{html_abs.replace('\\\\', '/')}"
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"Captured {png_file} with result {res.returncode}")
