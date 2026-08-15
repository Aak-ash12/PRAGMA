import subprocess
import os
from PIL import Image

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PRAGMA — Project Abstract</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    width: 2400px;
    background: #F1F5F9;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0F172A;
    padding: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card {
    width: 100%;
    background: #FFFFFF;
    border: 2px solid #CBD5E1;
    border-top: 6px solid #2563EB;
    border-radius: 28px;
    padding: 72px 80px;
    box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 30px rgba(37, 99, 235, 0.08);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 32px;
    border-bottom: 2px solid #E2E8F0;
    margin-bottom: 44px;
  }

  .title-container {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .brand-badge {
    background: linear-gradient(135deg, #1E40AF, #2563EB);
    color: #FFFFFF;
    font-weight: 800;
    font-size: 26px;
    padding: 10px 22px;
    border-radius: 12px;
    letter-spacing: 1px;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  }

  .main-title {
    font-size: 32px;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.5px;
    line-height: 1.3;
  }

  .sub-title {
    font-size: 20px;
    font-weight: 700;
    color: #2563EB;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: #EFF6FF;
    padding: 10px 24px;
    border-radius: 30px;
    border: 1px solid #BFDBFE;
    white-space: nowrap;
  }

  .abstract-section {
    margin-bottom: 40px;
  }

  .section-label {
    font-size: 32px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .section-label::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 34px;
    background: #2563EB;
    border-radius: 4px;
  }

  .paragraph {
    font-size: 28px;
    line-height: 1.75;
    color: #334155;
    font-weight: 400;
    margin-bottom: 32px;
    text-align: justify;
  }

  .bold-txt {
    font-weight: 700;
    color: #0F172A;
  }

  .bold-highlight {
    font-weight: 700;
    color: #1D4ED8;
  }

  .keywords-box {
    margin-top: 48px;
    background: #F8FAFC;
    border: 2px solid #E2E8F0;
    border-radius: 20px;
    padding: 32px 40px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .keywords-title {
    font-size: 26px;
    font-weight: 700;
    color: #1D4ED8;
    white-space: nowrap;
  }

  .keywords-body {
    font-size: 25px;
    line-height: 1.6;
    color: #475569;
    font-style: italic;
  }
</style>
</head>
<body>

  <div class="card">
    <div class="header">
      <div class="title-container">
        <div class="brand-badge">PRAGMA</div>
        <div class="main-title">Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin</div>
      </div>
      <div class="sub-title">Project Abstract</div>
    </div>

    <div class="abstract-section">
      <div class="section-label">Abstract</div>

      <p class="paragraph">
        Modern urban governance and emergency management face severe challenges in anticipating infrastructure failures, resource shortages, and environmental hazards due to fragmented data and static decision-making tools. This project introduces <span class="bold-txt">Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin (PRAGMA)</span>, an advanced AI-powered governance simulation platform designed to model city infrastructure, predict potential crises, and evaluate policies using Multi-Agent Systems, Machine Learning, and Explainable AI (XAI). PRAGMA integrates a spatial <span class="bold-highlight">City Digital Twin</span> allowing administrators to model urban assets (Hospitals, Roads, Schools, Utilities) alongside a <span class="bold-highlight">Multi-Agent Simulation (Mesa ABM)</span> engine that simulates citizen mobility, resource consumption, and contagion dynamics in real time. A predictive machine learning core built on <span class="bold-txt">XGBoost</span> and <span class="bold-txt">Scikit-Learn</span> evaluates environmental and infrastructure telemetry vectors to forecast the probability and estimated occurrence windows for 10 distinct crisis categories, such as hospital overload, water shortages, and power grid failures.
      </p>

      <p class="paragraph">
        To bridge the gap between complex AI predictions and actionable governance, PRAGMA incorporates <span class="bold-highlight">SHAP (SHapley Additive exPlanations)</span> feature attribution graphs, making risk drivers fully transparent. Furthermore, an integrated <span class="bold-highlight">Resource Optimizer</span> solves linear constraint distribution problems for emergency personnel and supplies, while an <span class="bold-highlight">AI Executive Advisor (Gemini/Llama 3.1 LLM)</span> generates natural language policy briefs and voice-assisted briefings. Implemented with a FastAPI backend and a Next.js/React frontend with WebSocket telemetry streaming, PRAGMA provides a scalable, data-driven sandbox for proactive urban risk management and policy evaluation.
      </p>
    </div>

    <div class="keywords-box">
      <div class="keywords-title">Keywords:</div>
      <div class="keywords-body">
        Urban Digital Twin, Multi-Agent Systems (Mesa ABM), Crisis Prediction (XGBoost), Explainable AI (SHAP), Policy Sandbox, Resource Optimization, AI Governance.
      </div>
    </div>
  </div>

</body>
</html>
"""

html_path = r"c:\Users\aakas\OneDrive\Desktop\PRAGMA\abstract_hd_light.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
output_png = r"c:\Users\aakas\OneDrive\Desktop\PRAGMA\pragma_abstract_hd_light.png"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=2560,1850",
    "--force-device-scale-factor=2",
    f"--screenshot={output_png}",
    f"file:///{html_path.replace('\\', '/')}"
]

subprocess.run(cmd, capture_output=True, text=True)

img = Image.open(output_png)
w, h = img.size
rgb_img = img.convert('RGB')
mid_x = w // 2
last_content_y = h
for y in range(h - 1, 0, -1):
    r, g, b = rgb_img.getpixel((mid_x, y))
    # background is around #F1F5F9 -> rgb(241, 245, 249)
    if r < 235 or g < 240 or b < 245:
        last_content_y = min(h, y + 160)
        break

if last_content_y < h:
    cropped = img.crop((0, 0, w, last_content_y))
    cropped.save(output_png)

print("Light mode PNG generated:", output_png, "Size:", cropped.size if last_content_y < h else img.size)
