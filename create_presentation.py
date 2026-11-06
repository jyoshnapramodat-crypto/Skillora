import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_PPTX = os.path.join(os.path.dirname(__file__), 'Skillora_Project_Presentation.pptx')
SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), 'screenshots')

# Color Palette (Skillora Editorial Lavender & Cream)
BG_CREAM = RGBColor(250, 247, 242)       # #FAF7F2
BG_WHITE = RGBColor(255, 255, 255)       # #FFFFFF
LAVENDER_PRIMARY = RGBColor(112, 83, 184) # #7053B8
LAVENDER_LIGHT = RGBColor(234, 228, 247)  # #EAE4F7
TEXT_PRIMARY = RGBColor(38, 35, 48)       # #262330
TEXT_SECONDARY = RGBColor(105, 98, 120)   # #696278
BORDER_COLOR = RGBColor(225, 218, 235)   # #E1DAEB
ACCENT_GREEN = RGBColor(46, 160, 67)     # #2EA043
ACCENT_ROSE = RGBColor(207, 85, 113)     # #CF5571

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def add_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_CREAM
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="SKILLORA • PROJECT PRESENTATION"):
        # Category pill/eyebrow
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.4))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        p_c = tf_c.paragraphs[0]
        p_c.text = category_text.upper()
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = LAVENDER_PRIMARY

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.5), Inches(0.65))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_PRIMARY

        # Header underline accent
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.42), Inches(11.73), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = BORDER_COLOR
        line.line.fill.background()

    def add_card(slide, left, top, width, height, bg_color=BG_WHITE, border_color=BORDER_COLOR):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        return card

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide1)

    # Decorative purple bar on left
    dec_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(0.2), Inches(5.1))
    dec_bar.fill.solid()
    dec_bar.fill.fore_color.rgb = LAVENDER_PRIMARY
    dec_bar.line.fill.background()

    # Title Box
    t_box = slide1.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(11.0), Inches(2.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "SKILLORA"
    p1.font.size = Pt(46)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_PRIMARY

    p2 = tf1.add_paragraph()
    p2.text = "A Smart Skill Progress Portfolio Platform"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = LAVENDER_PRIMARY
    p2.space_before = Pt(8)

    p3 = tf1.add_paragraph()
    p3.text = "Verified Milestone Tracking, Authentic Consistency Engine & Dynamic Full-Stack Showcase"
    p3.font.size = Pt(14)
    p3.font.color.rgb = TEXT_SECONDARY
    p3.space_before = Pt(6)

    # Info Cards at bottom of Title
    card_w = Inches(3.6)
    card_h = Inches(1.8)
    tops = Inches(4.5)

    c1 = add_card(slide1, Inches(1.2), tops, card_w, card_h)
    tf_c1 = c1.text_frame
    tf_c1.margin_left = tf_c1.margin_right = tf_c1.margin_top = Inches(0.25)
    p = tf_c1.paragraphs[0]
    p.text = "TECHNOLOGY STACK"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = LAVENDER_PRIMARY
    p = tf_c1.add_paragraph()
    p.text = "Full-Stack MERN Architecture\n• React.js 18 & Vite Bundler\n• Node.js & Express REST API\n• MongoDB & Mongoose ODM\n• JWT & Bcrypt Authentication"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_PRIMARY
    p.space_before = Pt(4)

    c2 = add_card(slide1, Inches(5.0), tops, card_w, card_h)
    tf_c2 = c2.text_frame
    tf_c2.margin_left = tf_c2.margin_right = tf_c2.margin_top = Inches(0.25)
    p = tf_c2.paragraphs[0]
    p.text = "CORE FORMULA & VALUE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN
    p = tf_c2.add_paragraph()
    p.text = "Task-Based Calculation\nProgress = (Completed / Total) × 100\n• 0% Vanity Sliders\n• 100% Proven Deliverables\n• Real-Time Recalculation"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_PRIMARY
    p.space_before = Pt(4)

    c3 = add_card(slide1, Inches(8.8), tops, card_w, card_h)
    tf_c3 = c3.text_frame
    tf_c3.margin_left = tf_c3.margin_right = tf_c3.margin_top = Inches(0.25)
    p = tf_c3.paragraphs[0]
    p.text = "ACADEMIC SCOPE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ROSE
    p = tf_c3.add_paragraph()
    p.text = "B.Tech Mini Project Defense\n• Clean Component-Driven Design\n• 1-Click Demo Workspace\n• Shareable Public Portfolio\n• PDF & CSV Client-Side Export"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_PRIMARY
    p.space_before = Pt(4)

    # ==========================================
    # SLIDE 2: PROBLEM STATEMENT
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide2)
    add_header(slide2, "Problem Statement: Why Skillora Was Created")

    # 3 Column Cards for the Problem
    pw = Inches(3.64)
    ph = Inches(5.1)
    ptop = Inches(1.7)

    # Card 1: Vanity Metrics
    card1 = add_card(slide2, Inches(0.8), ptop, pw, ph)
    tf = card1.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.3)
    p = tf.paragraphs[0]
    p.text = "1. Vanity & Unverified Ratings"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ROSE

    items1 = [
        "Traditional portfolios rely on decorative sliders (e.g., 'React - 90%', 'Python - 85%').",
        "These ratings have ZERO proof or measurable deliverables behind them.",
        "Recruiters, mentors, and viva examiners cannot verify whether the candidate actually mastered core concepts.",
        "Students lack a standard benchmark to self-assess genuine technical competency."
    ]
    for it in items1:
        p = tf.add_paragraph()
        p.text = "• " + it
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(10)

    # Card 2: Fragmented Tracking
    card2 = add_card(slide2, Inches(4.84), ptop, pw, ph)
    tf = card2.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.3)
    p = tf.paragraphs[0]
    p.text = "2. Fragmented Learning Management"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = LAVENDER_PRIMARY

    items2 = [
        "Tasks, milestones, and deadlines are scattered across notes, spreadsheets, and bookmark folders.",
        "No integrated system correlates individual learning steps with overarching skill progression.",
        "Lack of streak tracking leads to inconsistency and study procrastination.",
        "Deadlines easily slip past without proactive in-app reminder thresholds."
    ]
    for it in items2:
        p = tf.add_paragraph()
        p.text = "• " + it
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(10)

    # Card 3: The Showcase Gap
    card3 = add_card(slide2, Inches(8.88), ptop, pw, ph)
    tf = card3.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.3)
    p = tf.paragraphs[0]
    p.text = "3. The Showcase & Export Barrier"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    items3 = [
        "Bridging private daily study notes into a professional public portfolio requires manual formatting.",
        "Generating formatted PDF resumes with real percentage charts typically requires paid third-party tools.",
        "Need for a unified platform providing both a private developer workspace and a verified public showcase link."
    ]
    for it in items3:
        p = tf.add_paragraph()
        p.text = "• " + it
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(10)

    # ==========================================
    # SLIDE 3: WHAT WE USED TILL NOW (TECH STACK)
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide3)
    add_header(slide3, "Technology Stack: What We Used Till Now")

    col_w = Inches(5.67)
    col_h = Inches(5.1)

    # Left: Frontend Stack
    f_card = add_card(slide3, Inches(0.8), Inches(1.7), col_w, col_h)
    tf_f = f_card.text_frame
    tf_f.margin_left = tf_f.margin_right = tf_f.margin_top = Inches(0.35)
    p = tf_f.paragraphs[0]
    p.text = "FRONTEND ARCHITECTURE (Client)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = LAVENDER_PRIMARY

    f_items = [
        ("React.js 18.3", "Component-driven user interface with hooks (useState, useEffect, useMemo, useCallback)."),
        ("Vite 6.4", "Next-gen lightning bundler with Hot Module Replacement & production chunk splitting."),
        ("Pure CSS3 Tokens", "Handcrafted lavender-and-cream editorial design system without heavy framework bloat."),
        ("Recharts", "Interactive SVG Bar Charts, Donut Charts, and 7-day consistency activity trends."),
        ("jsPDF & html2canvas", "Client-side verified multi-page PDF generation with progress bar rendering."),
        ("Axios HTTP Client", "Modular REST API client with automatic JWT Bearer token request interceptors.")
    ]
    for title, desc in f_items:
        p = tf_f.add_paragraph()
        p.text = f"• {title}: "
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.size = Pt(11)
        run.font.color.rgb = TEXT_SECONDARY

    # Right: Backend Stack
    b_card = add_card(slide3, Inches(6.86), Inches(1.7), col_w, col_h)
    tf_b = b_card.text_frame
    tf_b.margin_left = tf_b.margin_right = tf_b.margin_top = Inches(0.35)
    p = tf_b.paragraphs[0]
    p.text = "BACKEND & PERSISTENCE (Server)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    b_items = [
        ("Node.js Runtime", "Scalable, non-blocking asynchronous event loop with modern ESM module syntax."),
        ("Express.js 4.21", "Lightweight REST API framework organizing modular controllers, routes, and middleware."),
        ("MongoDB Database", "High-performance NoSQL document store with persistent local storage engine."),
        ("Mongoose 8.9 ODM", "Strict schemas, validation, and pre-save lifecycle calculation hooks."),
        ("JWT Authentication", "Stateless JSON Web Tokens with 30-day expiry and protected route guards."),
        ("Bcryptjs Encryption", "One-way cryptographic password hashing using 10 salt rounds (zero plain-text).")
    ]
    for title, desc in b_items:
        p = tf_b.add_paragraph()
        p.text = f"• {title}: "
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.size = Pt(11)
        run.font.color.rgb = TEXT_SECONDARY

    # ==========================================
    # SLIDE 4: WHY ONLY WE USE THAT? (JUSTIFICATION)
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide4)
    add_header(slide4, "Technology Justification: Why Only We Use That?")

    # 4 Cards comparing chosen vs alternative
    jw = Inches(5.67)
    jh = Inches(2.4)

    # 1. React vs Vanilla/Angular
    j1 = add_card(slide4, Inches(0.8), Inches(1.7), jw, jh)
    tf1 = j1.text_frame
    tf1.margin_left = tf1.margin_right = tf1.margin_top = Inches(0.25)
    p = tf1.paragraphs[0]
    p.text = "React.js + Vite  (vs. Angular / Vue / Plain JS)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = LAVENDER_PRIMARY
    pts1 = [
        "Component-Driven UI: Isolated, reusable components (SkillCard, GoalCard, StatCard).",
        "Vite HMR: Instant build updates (<100ms) compared to slow legacy Webpack builds.",
        "Unidirectional Data Flow: Predictable state changes via useState and custom handlers."
    ]
    for it in pts1:
        p = tf1.add_paragraph()
        p.text = "✓ " + it
        p.font.size = Pt(10.5)
        p.space_before = Pt(3)

    # 2. Node + Express vs Django/Spring
    j2 = add_card(slide4, Inches(6.86), Inches(1.7), jw, jh)
    tf2 = j2.text_frame
    tf2.margin_left = tf2.margin_right = tf2.margin_top = Inches(0.25)
    p = tf2.paragraphs[0]
    p.text = "Node.js + Express  (vs. Django / Spring Boot)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN
    pts2 = [
        "Unified Language: JavaScript across both client and server eliminates context switching.",
        "Non-Blocking I/O: High concurrency for handling simultaneous REST requests effortlessly.",
        "Lightweight: No monolithic overhead; minimal boilerplate for academic viva demonstration."
    ]
    for it in pts2:
        p = tf2.add_paragraph()
        p.text = "✓ " + it
        p.font.size = Pt(10.5)
        p.space_before = Pt(3)

    # 3. MongoDB vs SQL (PostgreSQL/MySQL)
    j3 = add_card(slide4, Inches(0.8), Inches(4.35), jw, jh)
    tf3 = j3.text_frame
    tf3.margin_left = tf3.margin_right = tf3.margin_top = Inches(0.25)
    p = tf3.paragraphs[0]
    p.text = "MongoDB + Mongoose  (vs. Relational SQL)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ROSE
    pts3 = [
        "Nested Task Hierarchies: Skills natively embed sub-tasks as JSON-like documents.",
        "Pre-Save Hooks: Backend automatically recalculates progress % before saving to disk.",
        "Schema Flexibility: Seamlessly allows custom categories, tags, and dynamic goal structures."
    ]
    for it in pts3:
        p = tf3.add_paragraph()
        p.text = "✓ " + it
        p.font.size = Pt(10.5)
        p.space_before = Pt(3)

    # 4. JWT + Bcrypt vs Session Cookies
    j4 = add_card(slide4, Inches(6.86), Inches(4.35), jw, jh)
    tf4 = j4.text_frame
    tf4.margin_left = tf4.margin_right = tf4.margin_top = Inches(0.25)
    p = tf4.paragraphs[0]
    p.text = "JWT + Bcrypt  (vs. State-heavy Session Cookies)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEXT_PRIMARY
    pts4 = [
        "Stateless Auth: Server does not store active sessions in memory, maximizing scalability.",
        "One-Way Bcrypt Hashing: Passwords never stored in plain-text; select:false protects queries.",
        "Client Interceptor: Token automatically passed in Authorization: Bearer headers."
    ]
    for it in pts4:
        p = tf4.add_paragraph()
        p.text = "✓ " + it
        p.font.size = Pt(10.5)
        p.space_before = Pt(3)

    # ==========================================
    # SLIDE 5: WHAT WE HAVE DONE TILL NOW
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide5)
    add_header(slide5, "What We Have Done Till Now: Core Implemented Modules")

    # 6 feature mini cards in 2x3 grid
    mw = Inches(3.64)
    mh = Inches(2.4)

    modules = [
        ("1. Auth & Demo System", LAVENDER_PRIMARY, [
            "Dual Registration & Login with bcrypt hashing.",
            "1-Click Demo Workspace (Ananya Sharma).",
            "JWT protected routes & automatic session rehydration."
        ]),
        ("2. Task-Based Skill Engine", ACCENT_GREEN, [
            "Granular task checklists per skill.",
            "Backend Mongoose pre-save progress formula.",
            "Status transitions: Not Started → In Progress → Completed."
        ]),
        ("3. Strategic Learning Goals", ACCENT_ROSE, [
            "Target deadlines with Priority tags (High/Med/Low).",
            "Links goals to specific skills or independent targets.",
            "Real-time countdown and overdue milestone tracking."
        ]),
        ("4. Streaks & Notifications", TEXT_PRIMARY, [
            "Activity logger captures task completion timestamps.",
            "Calculates current & peak consecutive study streaks.",
            "In-app deadline alert banners with configurable days."
        ]),
        ("5. Public Shareable Portfolio", LAVENDER_PRIMARY, [
            "Dedicated public endpoint (/api/portfolio/public/:id).",
            "Sanitizes output (excludes emails, hashes & internal IDs).",
            "Customizable visibility flags (Bio, Streaks, Skills)."
        ]),
        ("6. Cloud Sync & Export Hub", ACCENT_GREEN, [
            "1-Click LocalStorage to MongoDB cloud migration.",
            "Client-side styled PDF generation via jsPDF.",
            "RFC 4180-compliant CSV spreadsheet exports."
        ])
    ]

    coords = [
        (Inches(0.8), Inches(1.7)), (Inches(4.84), Inches(1.7)), (Inches(8.88), Inches(1.7)),
        (Inches(0.8), Inches(4.35)), (Inches(4.84), Inches(4.35)), (Inches(8.88), Inches(4.35))
    ]

    for (m_title, m_color, m_pts), (x, y) in zip(modules, coords):
        mc = add_card(slide5, x, y, mw, mh)
        tf_m = mc.text_frame
        tf_m.margin_left = tf_m.margin_right = tf_m.margin_top = Inches(0.2)
        p = tf_m.paragraphs[0]
        p.text = m_title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = m_color
        for pt in m_pts:
            p = tf_m.add_paragraph()
            p.text = "• " + pt
            p.font.size = Pt(10.5)
            p.font.color.rgb = TEXT_PRIMARY
            p.space_before = Pt(3)

    # ==========================================
    # SLIDE 6: SCREENSHOT SHOWCASE 1 - LANDING & DASHBOARD
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide6)
    add_header(slide6, "UI Showcase: Landing Page & Central Dashboard")

    img_w = Inches(5.6)
    img_h = Inches(3.5)

    # Left: Landing Page
    landing_img = os.path.join(SCREENSHOTS_DIR, "landing.png")
    if os.path.exists(landing_img):
        add_card(slide6, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2))
        slide6.shapes.add_picture(landing_img, Inches(0.85), Inches(1.7), img_w, img_h)
        cap_box = slide6.shapes.add_textbox(Inches(0.95), Inches(5.35), Inches(5.4), Inches(1.3))
        tf = cap_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "Landing Page & Brand Aesthetic"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = LAVENDER_PRIMARY
        p = tf.add_paragraph()
        p.text = "• Editorial lavender-and-cream visual identity with hero typography.\n• 1-Click 'Explore Demo' and 'Create Account' conversion points.\n• How It Works, Features breakdown, and responsive navigation."
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_PRIMARY

    # Right: Dashboard
    dash_img = os.path.join(SCREENSHOTS_DIR, "dashboard.png")
    if os.path.exists(dash_img):
        add_card(slide6, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2))
        slide6.shapes.add_picture(dash_img, Inches(6.85), Inches(1.7), img_w, img_h)
        cap_box = slide6.shapes.add_textbox(Inches(6.95), Inches(5.35), Inches(5.4), Inches(1.3))
        tf = cap_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "Workspace Dashboard"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = ACCENT_GREEN
        p = tf.add_paragraph()
        p.text = "• Top Stat Cards: Total Skills, Completed Tasks, and Overall Progress %.\n• Interactive Recharts Bar Chart benchmarks skill progress.\n• In-app reminder strips for upcoming deadlines and overdue milestones."
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_PRIMARY

    # ==========================================
    # SLIDE 7: SCREENSHOT SHOWCASE 2 - SKILLS & GOALS
    # ==========================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide7)
    add_header(slide7, "UI Showcase: Skill Engine & Learning Goals Planner")

    # Left: Skills Page
    skills_img = os.path.join(SCREENSHOTS_DIR, "skills.png")
    if os.path.exists(skills_img):
        add_card(slide7, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2))
        slide7.shapes.add_picture(skills_img, Inches(0.85), Inches(1.7), img_w, img_h)
        cap_box = slide7.shapes.add_textbox(Inches(0.95), Inches(5.35), Inches(5.4), Inches(1.3))
        tf = cap_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "Skills & Task Management Engine"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = LAVENDER_PRIMARY
        p = tf.add_paragraph()
        p.text = "• Real-time search query and dynamic category filter chips.\n• Sort by name, progress, or recently updated.\n• Task Checklist Drawer with inline add, toggle, edit, and deletion."
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_PRIMARY

    # Right: Goals Page
    goals_img = os.path.join(SCREENSHOTS_DIR, "goals.png")
    if os.path.exists(goals_img):
        add_card(slide7, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2))
        slide7.shapes.add_picture(goals_img, Inches(6.85), Inches(1.7), img_w, img_h)
        cap_box = slide7.shapes.add_textbox(Inches(6.95), Inches(5.35), Inches(5.4), Inches(1.3))
        tf = cap_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "Strategic Learning Goals"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = ACCENT_ROSE
        p = tf.add_paragraph()
        p.text = "• Tab filtering: All, In Progress, Completed, and Overdue.\n• Priority indicators: High, Medium, and Low with target countdowns.\n• One-click milestone completion toggle with activity logging."
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_PRIMARY

    # ==========================================
    # SLIDE 8: SCREENSHOT SHOWCASE 3 - ANALYTICS & PORTFOLIO
    # ==========================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide8)
    add_header(slide8, "UI Showcase: Quantitative Analytics & Public Portfolio")

    # Left: Analytics
    analytics_img = os.path.join(SCREENSHOTS_DIR, "analytics.png")
    if os.path.exists(analytics_img):
        add_card(slide8, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2))
        slide8.shapes.add_picture(analytics_img, Inches(0.85), Inches(1.7), img_w, img_h)
        cap_box = slide8.shapes.add_textbox(Inches(0.95), Inches(5.35), Inches(5.4), Inches(1.3))
        tf = cap_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "Quantitative Analytics & Charts"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = LAVENDER_PRIMARY
        p = tf.add_paragraph()
        p.text = "• Category breakdown pie charts & task completion ratios.\n• 7-day activity consistency matrix tracking actual study sessions.\n• Comprehensive metrics summary for academic review."
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_PRIMARY

    # Right: Portfolio
    portfolio_img = os.path.join(SCREENSHOTS_DIR, "portfolio.png")
    if os.path.exists(portfolio_img):
        add_card(slide8, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2))
        slide8.shapes.add_picture(portfolio_img, Inches(6.85), Inches(1.7), img_w, img_h)
        cap_box = slide8.shapes.add_textbox(Inches(6.95), Inches(5.35), Inches(5.4), Inches(1.3))
        tf = cap_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "Public Shareable Portfolio & Export"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = ACCENT_GREEN
        p = tf.add_paragraph()
        p.text = "• Standalone public URL (?portfolio=ananya-sharma) with privacy controls.\n• Verified PDF resume download with styled headers & progress bars.\n• RFC 4180 CSV spreadsheet export for offline analysis."
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_PRIMARY

    # ==========================================
    # SLIDE 9: ADVANTAGES OF SKILLORA
    # ==========================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide9)
    add_header(slide9, "Key Advantages & Academic Value")

    aw = Inches(5.67)
    ah = Inches(2.4)

    advs = [
        ("Authentic & Verifiable Progress", LAVENDER_PRIMARY, [
            "Replaces fake sliders with mathematical calculation based on proven tasks.",
            "Eliminates division-by-zero or NaN edge cases with defensive logic.",
            "Recruiters can inspect exact deliverables behind any claimed competency."
        ]),
        ("Zero-Barrier Onboarding", ACCENT_GREEN, [
            "1-Click Demo Workspace allows examiners/users to test instantly.",
            "No mandatory registration or email validation required to explore.",
            "Realistic preloaded academic dataset (B.Tech student Ananya Sharma)."
        ]),
        ("Dual Storage & Cloud Sync", ACCENT_ROSE, [
            "Browser LocalStorage cache allows offline responsiveness.",
            "MongoDB persistence saves records across devices and user accounts.",
            "1-Click Cloud Migration imports offline progress into database seamlessly."
        ]),
        ("Production-Grade Security & Standards", TEXT_PRIMARY, [
            "Bcrypt password hashing with salt rounds (passwords never stored plain).",
            "Stateless JWT Bearer tokens with client Axios auto-interceptors.",
            "Public portfolio API sanitizes payloads, completely excluding private data."
        ])
    ]

    adv_coords = [
        (Inches(0.8), Inches(1.7)), (Inches(6.86), Inches(1.7)),
        (Inches(0.8), Inches(4.35)), (Inches(6.86), Inches(4.35))
    ]

    for (a_title, a_color, a_pts), (x, y) in zip(advs, adv_coords):
        ac = add_card(slide9, x, y, aw, ah)
        tf_a = ac.text_frame
        tf_a.margin_left = tf_a.margin_right = tf_a.margin_top = Inches(0.25)
        p = tf_a.paragraphs[0]
        p.text = a_title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = a_color
        for pt in a_pts:
            p = tf_a.add_paragraph()
            p.text = "✓ " + pt
            p.font.size = Pt(10.5)
            p.font.color.rgb = TEXT_PRIMARY
            p.space_before = Pt(3)

    # ==========================================
    # SLIDE 10: FUTURE SCOPE
    # ==========================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide10)
    add_header(slide10, "Future Scope: If There Are Another Things To Do")

    fw = Inches(3.64)
    fh = Inches(5.1)
    ftop = Inches(1.7)

    # Card 1: AI Integration
    fc1 = add_card(slide10, Inches(0.8), ftop, fw, fh)
    tf1 = fc1.text_frame
    tf1.margin_left = tf1.margin_right = tf1.margin_top = Inches(0.3)
    p = tf1.paragraphs[0]
    p.text = "1. AI Learning Roadmaps"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = LAVENDER_PRIMARY

    f_pts1 = [
        "Gemini API Integration: Auto-generate step-by-step learning task checklists for any user-entered skill.",
        "Adaptive Milestones: Recommend next practice tasks when progress plateaus.",
        "Smart Skill Gap Analysis: Compare student portfolio against live job postings to highlight missing competencies."
    ]
    for it in f_pts1:
        p = tf1.add_paragraph()
        p.text = "• " + it
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(10)

    # Card 2: GitHub & LeetCode Sync
    fc2 = add_card(slide10, Inches(4.84), ftop, fw, fh)
    tf2 = fc2.text_frame
    tf2.margin_left = tf2.margin_right = tf2.margin_top = Inches(0.3)
    p = tf2.paragraphs[0]
    p.text = "2. Automated Live Sync"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    f_pts2 = [
        "GitHub Webhook Integration: Automatically mark coding tasks completed upon commits to designated repositories.",
        "LeetCode / Codeforces API Sync: Auto-update problem-solving goal targets as online judge scores increase.",
        "Continuous Proof: Direct links from completed tasks to specific git commit SHAs."
    ]
    for it in f_pts2:
        p = tf2.add_paragraph()
        p.text = "• " + it
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(10)

    # Card 3: Social & Peer Verification
    fc3 = add_card(slide10, Inches(8.88), ftop, fw, fh)
    tf3 = fc3.text_frame
    tf3.margin_left = tf3.margin_right = tf3.margin_top = Inches(0.3)
    p = tf3.paragraphs[0]
    p.text = "3. Peer & Mentor Endorsements"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ROSE

    f_pts3 = [
        "Faculty / Mentor Sign-Off: Allow university professors to sign cryptographic verification hashes on milestones.",
        "Custom Domain Hosting: Allow students to bind their portfolio to custom domains (e.g., student.dev).",
        "Interactive Viva Defense Mode: Preset presentation view tailored for practical exam evaluators."
    ]
    for it in f_pts3:
        p = tf3.add_paragraph()
        p.text = "• " + it
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(10)

    # ==========================================
    # SLIDE 11: CONCLUSION & REPO SUMMARY
    # ==========================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_slide_background(slide11)

    # Large Center Card
    cc = add_card(slide11, Inches(1.5), Inches(1.2), Inches(10.33), Inches(5.1))
    tf_c = cc.text_frame
    tf_c.margin_left = tf_c.margin_right = tf_c.margin_top = Inches(0.5)

    p = tf_c.paragraphs[0]
    p.text = "SKILLORA • PROJECT SUMMARY & DEFENSE"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = LAVENDER_PRIMARY

    p = tf_c.add_paragraph()
    p.text = "A Complete, Verified Full-Stack MERN Portfolio"
    p.font.size = Pt(26)
    p.font.bold = True
    p.font.color.rgb = TEXT_PRIMARY
    p.space_before = Pt(6)

    p = tf_c.add_paragraph()
    p.text = "Skillora successfully replaces deceptive portfolio percentages with rigorous, task-verified learning progress. Combining an editorial frontend with an Express/MongoDB REST backend, it provides an authentic, high-impact demonstration of full-stack engineering principles."
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_SECONDARY
    p.space_before = Pt(12)

    # Key highlights grid inside conclusion
    p = tf_c.add_paragraph()
    p.text = "Key Achievements:"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_PRIMARY
    p.space_before = Pt(16)

    concl_items = [
        "✓ 100% Full-Stack MERN Architecture: Connected React + Node + Express + MongoDB REST API.",
        "✓ Zero Mock Calculations: All percentages derived strictly from verified completed tasks.",
        "✓ Clean Academic Viva Defense: Ready with VIVA_QUESTIONS.md covering Props, Hooks, Mongoose & JWT.",
        "✓ Live GitHub Repository: https://github.com/jyoshnapramodat-crypto/Skillora.git"
    ]
    for it in concl_items:
        p = tf_c.add_paragraph()
        p.text = it
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(4)

    # Save Presentation
    prs.save(OUTPUT_PPTX)
    print(f"✓ PowerPoint presentation generated successfully: {OUTPUT_PPTX}")

if __name__ == '__main__':
    create_deck()
