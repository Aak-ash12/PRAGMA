import subprocess
import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PRAGMA — Workflow Summary (Light)</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    width: 1000px;
    height: 250px;
    background: #FFFFFF;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .canvas {
    width: 1000px;
    height: 250px;
    position: relative;
    background: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .outer-box {
    position: absolute;
    top: 15px;
    left: 20px;
    width: 960px;
    height: 220px;
    border: 1.5px dashed #C7D2FE;
    border-radius: 12px;
    background-color: #F8FAFC;
  }

  .title {
    position: absolute;
    top: 12px;
    width: 100%;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    color: #1E3A8A;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* Node Styles */
  .circle-node {
    position: absolute;
    top: 50px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }

  .circle-blue { border: 2px solid #3B82F6; color: #1D4ED8; }
  .circle-purple { border: 2px solid #A855F7; color: #7E22CE; }
  .circle-green { border: 2px solid #10B981; color: #047857; }
  .circle-yellow { border: 2px solid #F59E0B; color: #B45309; }
  .circle-red { border: 2px solid #EF4444; color: #B91C1C; }

  /* Description Styles */
  .desc-box {
    position: absolute;
    top: 125px;
    width: 160px;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
    color: #1E293B;
  }

  /* Arrow Styles */
  .arrow-line {
    fill: none;
    stroke: #475569;
    stroke-width: 1.5px;
  }
</style>
</head>
<body>
  <div class="canvas">
    
    <div class="outer-box">
      <div class="title">Workflow Summary</div>
      
      <!-- SVG Connectors -->
      <svg width="960" height="220" style="position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1;">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#475569" />
          </marker>
        </defs>
        
        <!-- Arrows connecting centers: (100, 80) -> (290, 80) -> (480, 80) -> (670, 80) -> (860, 80) -->
        <!-- Subtract radius (30) from ends: from x1+35 to x2-35 -->
        <path d="M 135,80 L 255,80" class="arrow-line" marker-end="url(#arrow)" />
        <path d="M 325,80 L 445,80" class="arrow-line" marker-end="url(#arrow)" />
        <path d="M 515,80 L 635,80" class="arrow-line" marker-end="url(#arrow)" />
        <path d="M 705,80 L 825,80" class="arrow-line" marker-end="url(#arrow)" />
      </svg>

      <!-- CIRCLES (Center Y: 80px -> top: 50px) -->
      <!-- Step 1 -->
      <div class="circle-node circle-blue" style="left: 70px;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div class="desc-box" style="left: 20px;">
        User configures digital twin & uploads telemetry
      </div>

      <!-- Step 2 -->
      <div class="circle-node circle-purple" style="left: 260px;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 9l6 6M12 15l6-3M6 9h12"/></svg>
      </div>
      <div class="desc-box" style="left: 210px;">
        Mesa ABM simulates resource & citizen dynamics
      </div>

      <!-- Step 3 -->
      <div class="circle-node circle-green" style="left: 450px;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div class="desc-box" style="left: 400px;">
        XGBoost predicts risk across 10 crisis types
      </div>

      <!-- Step 4 -->
      <div class="circle-node circle-yellow" style="left: 640px;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h6"/></svg>
      </div>
      <div class="desc-box" style="left: 590px;">
        Optimizer balances resources under constraints
      </div>

      <!-- Step 5 -->
      <div class="circle-node circle-red" style="left: 830px;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      </div>
      <div class="desc-box" style="left: 780px;">
        AI Advisor generates policy briefs & action alerts
      </div>
      
    </div>

  </div>
</body>
</html>
"""

html_path = r"c:\Users\aakas\OneDrive\Desktop\PRAGMA\workflow_summary_hd_light.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written to {html_path}")

# Run headless chrome to capture ultra HD screenshot
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
output_png = r"c:\Users\aakas\OneDrive\Desktop\PRAGMA\pragma_workflow_summary_hd_light.png"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1000,250",
    "--force-device-scale-factor=2",
    f"--screenshot={output_png}",
    f"file:///{html_path.replace('\\\\', '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome execution result:", res.returncode)
print("Saved PNG to:", output_png)
