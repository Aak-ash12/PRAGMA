import subprocess
import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PRAGMA — Module Workflow (Dark)</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    width: 1000px;
    height: 1100px;
    background: #090D16;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #F1F5F9;
    position: relative;
    overflow: hidden;
  }

  .canvas {
    width: 1000px;
    height: 1100px;
    position: relative;
    background: #090D16;
  }

  /* Node Styles */
  .node {
    position: absolute;
    display: flex;
    align-items: center;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px 16px;
    z-index: 10;
  }

  .node-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    margin-left: 14px;
  }

  .node-title {
    font-weight: 700;
  }

  .node-desc {
    font-weight: 500;
    font-size: 12px;
    color: #94A3B8;
    margin-top: 1px;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Dark theme node color states */
  .color-blue {
    background-color: #1E293B;
    border: 1.5px solid #3B82F6;
    color: #E0F2FE;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }
  .color-blue .node-desc { color: #93C5FD; }

  .color-green {
    background-color: #14532D;
    border: 1.5px solid #10B981;
    color: #D1FAE5;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  }
  .color-green .node-desc { color: #A7F3D0; }

  .color-yellow {
    background-color: #3F2C0B;
    border: 1.5px solid #F59E0B;
    color: #FEF3C7;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
  }
  .color-yellow .node-desc { color: #FDE68A; }

  .color-purple {
    background-color: #2E1065;
    border: 1.5px solid #A855F7;
    color: #F3E8FF;
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
  }
  .color-purple .node-desc { color: #E9D5FF; }

  .color-pink {
    background-color: #500724;
    border: 1.5px solid #EC4899;
    color: #FCE7F3;
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
  }
  .color-pink .node-desc { color: #FBCFE8; }

  .color-orange {
    background-color: #431407;
    border: 1.5px solid #F97316;
    color: #FFEDD5;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
  }
  .color-orange .node-desc { color: #FED7AA; }

  /* SVG Line Styles */
  .arrow-line {
    fill: none;
    stroke: #64748B;
    stroke-width: 1.5px;
  }

  /* Connection Labels */
  .conn-label {
    position: absolute;
    font-size: 11px;
    font-weight: 700;
    background: #090D16;
    padding: 2px 6px;
    border-radius: 4px;
    z-index: 15;
  }

  /* Caption Styles */
  .captions-container {
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    font-family: 'Inter', 'Segoe UI', sans-serif;
  }

  .caption-fig {
    font-style: italic;
    font-size: 13px;
    color: #64748B;
  }

  .caption-title {
    font-weight: 700;
    font-size: 17px;
    color: #F8FAFC;
  }
</style>
</head>
<body>
  <div class="canvas">
    
    <!-- SVG ARROWS -->
    <svg width="1000" height="1100" style="position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1;">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#64748B" />
        </marker>
      </defs>

      <!-- Row 1 -> Row 2 -->
      <path d="M 500,90 L 500,118" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 2 -> Row 3 -->
      <path d="M 500,170 L 500,198" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 3 -> Row 4 -->
      <path d="M 500,250 L 500,278" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 4 -> Row 5 -->
      <path d="M 500,330 L 500,358" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 5 -> Row 6 -->
      <path d="M 500,410 L 500,438" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 6 -> Row 6.1 - 6.4 (Fork) -->
      <path d="M 500,490 L 140,518" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 500,490 L 380,518" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 500,490 L 620,518" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 500,490 L 860,518" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 6.1 - 6.4 -> Row 7 (Merge) -->
      <path d="M 140,580 L 498,608" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 380,580 L 499,608" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 620,580 L 501,608" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 860,580 L 502,608" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 7 -> Row 8.1 & 8.2 (Fork) -->
      <path d="M 500,660 L 290,718" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 500,660 L 710,718" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 8.1 & 8.2 -> Row 9 (Merge) -->
      <path d="M 290,780 L 498,808" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 710,780 L 502,808" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 9 -> Row 10 -->
      <path d="M 500,860 L 500,898" class="arrow-line" marker-end="url(#arrow)" />
    </svg>

    <!-- NODES -->

    <!-- Row 1 -->
    <div class="node color-blue" style="left: 280px; top: 40px; width: 440px; height: 50px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">1. User Authentication (RBAC)</div>
        <div class="node-desc">User logs in and authenticates with specific role permissions</div>
      </div>
    </div>

    <!-- Row 2 -->
    <div class="node color-green" style="left: 280px; top: 120px; width: 440px; height: 50px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">2. Sandbox Config / Data Upload</div>
        <div class="node-desc">User modifies digital twin assets or uploads telemetry CSV</div>
      </div>
    </div>

    <!-- Row 3 -->
    <div class="node color-yellow" style="left: 280px; top: 200px; width: 440px; height: 50px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">3. Telemetry Validation</div>
        <div class="node-desc">Data Ingest engine sanitizes telemetry and validates data models</div>
      </div>
    </div>

    <!-- Row 4 -->
    <div class="node color-purple" style="left: 280px; top: 280px; width: 440px; height: 50px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 9l6 6M12 15l6-3M6 9h12"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">4. Agent-Based Simulation (Mesa)</div>
        <div class="node-desc">Models citizens commuting, consuming resources, and contagions</div>
      </div>
    </div>

    <!-- Row 5 -->
    <div class="node color-pink" style="left: 280px; top: 360px; width: 440px; height: 50px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">5. Crisis Prediction Engine (XGBoost)</div>
        <div class="node-desc">Evaluates telemetry to forecast risk probabilities across 10 categories</div>
      </div>
    </div>

    <!-- Row 6 -->
    <div class="node color-blue" style="left: 280px; top: 440px; width: 440px; height: 50px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M9 12h3a6 6 0 0 0 6-6V5M12 12a6 6 0 0 1 6 6v1"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">6. Policy Sandbox & Optimizer</div>
        <div class="node-desc">Triggers resource scheduler and evaluates baseline vs policy scores</div>
      </div>
    </div>

    <!-- Row 6 sub-columns -->
    <div class="node color-green" style="left: 40px; top: 520px; width: 200px; height: 60px; padding: 8px 12px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      </div>
      <div class="node-content" style="margin-left: 10px;">
        <div class="node-title" style="font-size: 13px;">6.1 Healthcare</div>
        <div class="node-desc" style="font-size: 11px;">Doctor schedules & ICU allocations</div>
      </div>
    </div>

    <div class="node color-yellow" style="left: 280px; top: 520px; width: 200px; height: 60px; padding: 8px 12px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div class="node-content" style="margin-left: 10px;">
        <div class="node-title" style="font-size: 13px;">6.2 Police & Emergency</div>
        <div class="node-desc" style="font-size: 11px;">Forces dispatcher & routing pathing</div>
      </div>
    </div>

    <div class="node color-purple" style="left: 520px; top: 520px; width: 200px; height: 60px; padding: 8px 12px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>
      <div class="node-content" style="margin-left: 10px;">
        <div class="node-title" style="font-size: 13px;">6.3 Public Utilities</div>
        <div class="node-desc" style="font-size: 11px;">Solar & hydro grids backup deployment</div>
      </div>
    </div>

    <div class="node color-orange" style="left: 760px; top: 520px; width: 200px; height: 60px; padding: 8px 12px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </div>
      <div class="node-content" style="margin-left: 10px;">
        <div class="node-title" style="font-size: 13px;">6.4 Traffic Signals</div>
        <div class="node-desc" style="font-size: 11px;">Signal overriding and dynamic timings</div>
      </div>
    </div>

    <!-- Row 7 -->
    <div class="node color-blue" style="left: 280px; top: 610px; width: 440px; height: 50px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 2.22-.73 4.27-1.96 5.93M2 12a10 10 0 0 0 10 10c2.22 0 4.27-.73 5.93-1.96M12 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">7. Gateway Connection Monitor</div>
        <div class="node-desc">FastAPI monitors socket latency and transmission channels</div>
      </div>
    </div>

    <!-- Connection Labels -->
    <div class="conn-label" style="left: 310px; top: 672px; color: #34D399;">Websocket Active</div>
    <div class="conn-label" style="left: 560px; top: 672px; color: #F87171;">Websocket Offline / Poor</div>

    <!-- Row 8.1 & 8.2 -->
    <div class="node color-green" style="left: 140px; top: 720px; width: 300px; height: 60px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">8.1 Live WebSockets</div>
        <div class="node-desc">Streams real-time updates directly to dashboard screens</div>
      </div>
    </div>

    <div class="node color-pink" style="left: 560px; top: 720px; width: 300px; height: 60px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">8.2 CSV Fallback Ingestion</div>
        <div class="node-desc">Processes manual file uploads if WebSockets are offline</div>
      </div>
    </div>

    <!-- Row 9 -->
    <div class="node color-blue" style="left: 280px; top: 810px; width: 440px; height: 50px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">9. Database Management Module</div>
        <div class="node-desc">Stores user credentials, telemetry logs, and FAISS vectors</div>
      </div>
    </div>

    <!-- Row 10 -->
    <div class="node color-purple" style="left: 280px; top: 900px; width: 440px; height: 50px;">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      </div>
      <div class="node-content">
        <div class="node-title">10. Explainable AI & Advisor Reports</div>
        <div class="node-desc">Generates SHAP values, LLM advisory briefs, and exports PDFs</div>
      </div>
    </div>

    <!-- CAPTIONS -->
    <div class="captions-container">
      <div class="caption-fig">Fig. 3. Module Workflow of the Proposed PRAGMA System</div>
      <div class="caption-title">Fig 4.3: Module Workflow Diagram</div>
    </div>

  </div>
</body>
</html>
"""

html_path = r"c:\Users\aakas\OneDrive\Desktop\PRAGMA\workflow_hd.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written to {html_path}")

# Run headless chrome to capture ultra HD screenshot
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
output_png = r"c:\Users\aakas\OneDrive\Desktop\PRAGMA\pragma_workflow_hd.png"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1000,1070",
    "--force-device-scale-factor=2",
    f"--screenshot={output_png}",
    f"file:///{html_path.replace('\\\\', '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome execution result:", res.returncode)
print("Saved PNG to:", output_png)
