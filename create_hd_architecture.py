import subprocess
import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PRAGMA — System Architecture (Dark)</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    width: 1000px;
    height: 980px;
    background: #090D16;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #F1F5F9;
    position: relative;
    overflow: hidden;
  }

  .canvas {
    width: 1000px;
    height: 980px;
    position: relative;
    background: #090D16;
  }

  /* Node Styles */
  .node {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 8px;
    font-size: 15px;
    line-height: 1.4;
    padding: 10px;
    z-index: 10;
  }

  /* Blue Nodes (Dark Theme) */
  .node-blue {
    background-color: #1E293B;
    border: 1.5px solid #3B82F6;
    color: #E0F2FE;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  /* Brown Node (Dark Theme) */
  .node-brown {
    background-color: #2D1F1E;
    border: 1.5px solid #D97706;
    color: #FEF3C7;
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);
  }

  .node-title {
    font-weight: 700;
  }

  .node-desc {
    font-weight: 600;
    font-size: 13px;
    color: #94A3B8;
    margin-top: 2px;
  }

  /* SVG Line Styles */
  .arrow-line {
    fill: none;
    stroke: #64748B;
    stroke-width: 1.8px;
  }

  /* Caption Styles */
  .captions-container {
    position: absolute;
    bottom: 40px;
    left: 0;
    width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    font-family: 'Inter', 'Segoe UI', sans-serif;
  }

  .caption-fig {
    font-style: italic;
    font-size: 14px;
    color: #64748B;
  }

  .caption-title {
    font-weight: 700;
    font-size: 18px;
    color: #F8FAFC;
  }
</style>
</head>
<body>
  <div class="canvas">
    
    <!-- SVG ARROWS -->
    <svg width="1000" height="980" style="position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1;">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#64748B" />
        </marker>
      </defs>

      <!-- Row 1 -> Row 2 -->
      <path d="M 500,110 L 500,158" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 2 -> Row 3 -->
      <path d="M 500,210 L 220,258" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 500,210 L 500,258" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 500,210 L 780,258" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 3 -> Row 4 -->
      <path d="M 220,330 L 498,378" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 500,330 L 500,378" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 780,330 L 502,378" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 4 -> Row 5 -->
      <path d="M 500,430 L 290,478" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 500,430 L 710,478" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 5 -> Row 6 -->
      <path d="M 290,550 L 498,598" class="arrow-line" marker-end="url(#arrow)" />
      <path d="M 710,550 L 502,598" class="arrow-line" marker-end="url(#arrow)" />

      <!-- Row 6 -> Row 7 -->
      <path d="M 500,670 L 500,718" class="arrow-line" marker-end="url(#arrow)" />
    </svg>

    <!-- NODES -->

    <!-- Row 1 -->
    <div class="node node-blue" style="left: 280px; top: 40px; width: 440px; height: 70px;">
      <div class="node-title">Interactive Governance Dashboard (React & Vite)</div>
      <div class="node-desc">Digital Twin Input + CSV Upload + AI Speech Advisor</div>
    </div>

    <!-- Row 2 -->
    <div class="node node-blue" style="left: 280px; top: 160px; width: 440px; height: 50px;">
      <div class="node-title">FastAPI Gateway & WebSocket Server</div>
    </div>

    <!-- Row 3 -->
    <div class="node node-blue" style="left: 110px; top: 260px; width: 220px; height: 70px;">
      <div class="node-title">Mesa Simulation Engine</div>
      <div class="node-desc">+ Agent Grid Paths</div>
    </div>
    <div class="node node-blue" style="left: 390px; top: 260px; width: 220px; height: 70px;">
      <div class="node-title">Live Ingestion API</div>
      <div class="node-desc">+ Telemetry Cleaner</div>
    </div>
    <div class="node node-blue" style="left: 670px; top: 260px; width: 220px; height: 70px;">
      <div class="node-title">Resource Optimizer API</div>
      <div class="node-desc">+ SciPy Allocator</div>
    </div>

    <!-- Row 4 -->
    <div class="node node-blue" style="left: 280px; top: 380px; width: 440px; height: 50px;">
      <div class="node-title">Telemetry Ingest Monitor & Vectorizer</div>
    </div>

    <!-- Row 5 -->
    <div class="node node-blue" style="left: 140px; top: 480px; width: 300px; height: 70px;">
      <div class="node-title">Live WebSockets</div>
      <div class="node-desc">(Real-time Stream)</div>
    </div>
    <div class="node node-blue" style="left: 560px; top: 480px; width: 300px; height: 70px;">
      <div class="node-title">CSV Data Ingestion</div>
      <div class="node-desc">(Offline Ingest Fallback)</div>
    </div>

    <!-- Row 6 -->
    <div class="node node-blue" style="left: 280px; top: 600px; width: 440px; height: 70px;">
      <div class="node-title">XGBoost & Scikit-Learn</div>
      <div class="node-desc">Crisis Prediction Core</div>
    </div>

    <!-- Row 7 -->
    <div class="node node-brown" style="left: 250px; top: 720px; width: 500px; height: 50px;">
      <div class="node-title">SQLite Database + FAISS Vector Store + SQLAlchemy</div>
    </div>

    <!-- CAPTIONS -->
    <div class="captions-container">
      <div class="caption-fig">Fig. 1. Proposed System Architecture for PRAGMA</div>
      <div class="caption-title">Fig 4.1: System Architecture</div>
    </div>

  </div>
</body>
</html>
"""

html_path = r"c:\Users\aakas\OneDrive\Desktop\PRAGMA\architecture_hd.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written to {html_path}")

# Run headless chrome to capture ultra HD screenshot
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
output_png = r"c:\Users\aakas\OneDrive\Desktop\PRAGMA\pragma_architecture_hd.png"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1000,950",
    "--force-device-scale-factor=2",
    f"--screenshot={output_png}",
    f"file:///{html_path.replace('\\\\', '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome execution result:", res.returncode)
print("Saved PNG to:", output_png)
