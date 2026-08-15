import os
from PIL import Image, ImageDraw, ImageFont

def create_abstract_image(output_path):
    # Image dimensions
    width = 1600
    height = 1100
    
    # Create image with dark background
    bg_color = (15, 23, 42)      # Slate 900 #0F172A
    card_bg = (30, 41, 59)        # Slate 800 #1E293B
    card_border = (51, 65, 85)    # Slate 700 #334155
    accent_blue = (59, 130, 246)  # Blue 500 #3B82F6
    text_white = (248, 250, 252)  # Slate 50 #F8FAFC
    text_light = (226, 232, 240)  # Slate 200 #E2E8F0
    text_muted = (148, 163, 184)  # Slate 400 #94A3B8
    tag_bg = (30, 58, 138)        # Blue 900 #1E3A8A
    tag_border = (37, 99, 235)    # Blue 600 #2563EB

    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Load Fonts
    font_path_reg = "C:/Windows/Fonts/segoeui.ttf"
    font_path_bold = "C:/Windows/Fonts/segoeuib.ttf"
    font_path_italic = "C:/Windows/Fonts/segoeuii.ttf" if os.path.exists("C:/Windows/Fonts/segoeuii.ttf") else font_path_reg

    title_font = ImageFont.truetype(font_path_bold, 44)
    subtitle_font = ImageFont.truetype(font_path_bold, 20)
    section_font = ImageFont.truetype(font_path_bold, 26)
    body_font = ImageFont.truetype(font_path_reg, 19)
    body_bold = ImageFont.truetype(font_path_bold, 19)
    tag_font = ImageFont.truetype(font_path_bold, 15)
    meta_font = ImageFont.truetype(font_path_reg, 15)

    # Draw Outer Glow/Card Container
    margin_x = 60
    margin_y = 50
    card_rect = [margin_x, margin_y, width - margin_x, height - margin_y]
    
    # Draw Card Background with rounded corners
    draw.rounded_rectangle(card_rect, radius=20, fill=card_bg, outline=card_border, width=2)

    # Top Accent Line
    draw.rounded_rectangle([margin_x, margin_y, width - margin_x, margin_y + 8], radius=4, fill=accent_blue)

    curr_y = margin_y + 40
    content_x = margin_x + 50
    content_w = (width - margin_x * 2) - 100

    # Header Tag / Badge
    tag_text = "OFFICIAL PROJECT ABSTRACT  |  FINAL YEAR ARTIFICIAL INTELLIGENCE PROJECT"
    draw.rounded_rectangle([content_x, curr_y, content_x + 620, curr_y + 32], radius=6, fill=tag_bg, outline=tag_border, width=1)
    draw.text((content_x + 16, curr_y + 6), tag_text, font=tag_font, fill=text_light)
    curr_y += 50

    # Title: PRAGMA
    draw.text((content_x, curr_y), "PRAGMA", font=title_font, fill=text_white)
    curr_y += 55

    # Subtitle
    draw.text((content_x, curr_y), "Predictive Risk Analysis & Governance Management Assistant", font=subtitle_font, fill=accent_blue)
    curr_y += 35

    # Divider
    draw.line([(content_x, curr_y), (content_x + content_w, curr_y)], fill=card_border, width=1)
    curr_y += 25

    # Section Heading
    draw.text((content_x, curr_y), "Abstract", font=section_font, fill=text_white)
    curr_y += 42

    # Abstract Text Paragraphs (Tokens with formatting)
    paragraph1_tokens = [
        ("Modern urban governance and emergency management face severe challenges in anticipating infrastructure failures, resource shortages, and environmental hazards due to fragmented data and static decision-making tools. This project introduces ", False),
        ("PRAGMA (Predictive Risk Analysis & Governance Management Assistant)", True),
        (", an advanced AI-powered governance simulation platform designed to model city infrastructure, predict potential crises, and evaluate policies using Multi-Agent Systems, Machine Learning, and Explainable AI (XAI). PRAGMA integrates a spatial ", False),
        ("City Digital Twin", True),
        (" allowing administrators to model urban assets (Hospitals, Roads, Schools, Utilities) alongside a ", False),
        ("Multi-Agent Simulation (Mesa ABM)", True),
        (" engine that simulates citizen mobility, resource consumption, and contagion dynamics in real time. A predictive machine learning core built on ", False),
        ("XGBoost", True),
        (" and ", False),
        ("Scikit-Learn", True),
        (" evaluates environmental and infrastructure telemetry vectors to forecast the probability and estimated occurrence windows for 10 distinct crisis categories, such as hospital overload, water shortages, and power grid failures.", False)
    ]

    paragraph2_tokens = [
        ("To bridge the gap between complex AI predictions and actionable governance, PRAGMA incorporates ", False),
        ("SHAP (SHapley Additive exPlanations)", True),
        (" feature attribution graphs, making risk drivers fully transparent. Furthermore, an integrated ", False),
        ("Resource Optimizer", True),
        (" solves linear constraint distribution problems for emergency personnel and supplies, while an ", False),
        ("AI Executive Advisor (Gemini/Llama 3.1 LLM)", True),
        (" generates natural language policy briefs and voice-assisted briefings. Implemented with a FastAPI backend and a Next.js/React frontend with WebSocket telemetry streaming, PRAGMA provides a scalable, data-driven sandbox for proactive urban risk management and policy evaluation.", False)
    ]

    def render_paragraph(tokens, start_x, start_y, max_width, line_height=32):
        x = start_x
        y = start_y

        for text_chunk, is_bold in tokens:
            f = body_bold if is_bold else body_font
            color = text_white if is_bold else text_light

            # Split text by words
            words = text_chunk.split(" ")
            for i, word in enumerate(words):
                # Add trailing space except for last word
                word_to_draw = word + (" " if i < len(words) - 1 else "")
                bbox = f.getbbox(word_to_draw)
                word_w = bbox[2] - bbox[0]

                if x + word_w > start_x + max_width:
                    x = start_x
                    y += line_height

                draw.text((x, y), word_to_draw, font=f, fill=color)
                x += word_w

        return y + line_height + 15

    curr_y = render_paragraph(paragraph1_tokens, content_x, curr_y, content_w, line_height=30)
    curr_y = render_paragraph(paragraph2_tokens, content_x, curr_y, content_w, line_height=30)

    # Technology Pill Tags Footer
    curr_y += 10
    draw.line([(content_x, curr_y), (content_x + content_w, curr_y)], fill=card_border, width=1)
    curr_y += 20

    draw.text((content_x, curr_y), "Key Tech Stack & Modules:", font=meta_font, fill=text_muted)
    curr_y += 28

    tags = [
        "City Digital Twin", "Mesa ABM", "XGBoost", "Scikit-Learn", 
        "SHAP (XAI)", "Resource Optimizer", "Gemini / Llama 3.1", "FastAPI", "React / Next.js"
    ]

    tx = content_x
    ty = curr_y
    for tag in tags:
        bbox = tag_font.getbbox(tag)
        tw = bbox[2] - bbox[0] + 24
        th = 28
        if tx + tw > content_x + content_w:
            tx = content_x
            ty += 36

        draw.rounded_rectangle([tx, ty, tx + tw, ty + th], radius=6, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
        draw.text((tx + 12, ty + 5), tag, font=tag_font, fill=accent_blue)
        tx += tw + 12

    # Save output
    img.save(output_path, "PNG", quality=95)
    print(f"Abstract image successfully saved to: {output_path}")

if __name__ == "__main__":
    out_png = os.path.join("c:\\Users\\aakas\\OneDrive\\Desktop\\PRAGMA", "PRAGMA_Project_Abstract.png")
    create_abstract_image(out_png)
