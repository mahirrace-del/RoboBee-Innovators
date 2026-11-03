import { EditableClassDeck, EditableSlide, THEME_PALETTE_CONFIG } from "./slideStudioStore";
import { RoboticsLesson } from "./curriculumData";

/**
 * Generates a complete, self-contained, zero-dependency HTML presentation
 * following the `zarazhangrui/frontend-slides` architecture:
 * - Fixed 16:9 stage authored at 1920×1080 (`viewport-base.css`)
 * - Uniform responsive stage scaling (`translate(x, y) scale(factor)`)
 * - Fontshare (`Clash Display` + `Satoshi`) & `JetBrains Mono` typography
 * - Staggered `.reveal` animations on `.slide.visible`
 * - Interactive 3-Band Differentiation Switcher (Class 3–5, 6–8, 9–12)
 * - Interactive Flip-Cards, Hotspot Pins, & Copyable C++ Code
 * - Built-in Inline Editing (`✏️` hotzone with 400ms JS grace period + `E` shortcut + localStorage + HTML download)
 */
export function generateFrontendSlidesHtml(
  deck: EditableClassDeck,
  lesson?: RoboticsLesson | null
): string {
  const safeOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";

  const resolveAssetUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    if (safeOrigin && url.startsWith("/")) return `${safeOrigin}${url}`;
    return url;
  };

  const escapeHtml = (str?: string) =>
    (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const slidesHtml = (deck.slides || [])
    .map((slide: EditableSlide, idx: number) => {
      const palette =
        THEME_PALETTE_CONFIG[slide.theme || "robobee-dark"] ||
        THEME_PALETTE_CONFIG["robobee-dark"];
      const heroUrl = resolveAssetUrl(slide.heroImage || deck.coverImage);
      const cards = slide.cards || [];
      const codeEl = (slide.elements || []).find((el) => el.type === "code");
      const codeCard = cards.find(
        (c) =>
          c.badge?.toUpperCase().includes("CODE") ||
          c.badge?.toUpperCase().includes("SOURCE") ||
          c.body?.includes("void setup")
      );
      const rawCode = codeEl?.content || codeCard?.body || "";

      const nonCodeCards = codeCard ? cards.filter((c) => c !== codeCard) : cards;

      return `
      <!-- ====================================================================
           SLIDE ${String(idx + 1).padStart(2, "0")}: ${escapeHtml(slide.title)}
           ==================================================================== -->
      <section class="slide ${idx === 0 ? "active visible" : ""}" data-slide-index="${idx}" style="--slide-bg: ${palette.canvasBg}; --slide-accent: ${palette.accentPrimary}; --slide-accent-2: ${palette.accentSecondary};">
        <div class="slide-bg-mesh"></div>
        <div class="slide-inner">
          <!-- Top Header Row -->
          <header class="slide-header reveal">
            <div class="badge-row">
              <span class="slide-num-pill">SLIDE ${String(idx + 1).padStart(2, "0")} / ${String(deck.slides.length).padStart(2, "0")}</span>
              <span class="slide-badge-pill editable-text">${escapeHtml(slide.badge || `${deck.classCode} • ROBOBEE INNOVATORS`)}</span>
              <span class="friday-tag">FRIDAY 4:00–6:00 PM • 120M LAB</span>
            </div>
            <h1 class="slide-title editable-text">${escapeHtml(slide.title)}</h1>
            <p class="slide-subtitle editable-text">${escapeHtml(slide.subtitle)}</p>
          </header>

          <!-- Main Content Grid -->
          <div class="slide-body ${rawCode ? "layout-code-split" : heroUrl && nonCodeCards.length > 0 ? "layout-split-media" : "layout-bento-grid"}">
            <div class="cards-column">
              ${nonCodeCards
                .slice(0, 4)
                .map(
                  (c, cIdx) => `
                <article class="bento-card reveal ${c.isQuizCard ? "quiz-flip-card" : ""}" style="transition-delay: ${0.14 + cIdx * 0.08}s; --card-accent: ${c.accentColor || palette.accentPrimary};" ${c.isQuizCard ? `onclick="this.classList.toggle('flipped')"` : ""}>
                  <div class="card-badge editable-text">${escapeHtml(c.badge || `POINT 0${cIdx + 1}`)}</div>
                  <h3 class="card-title editable-text">${escapeHtml(c.title)}</h3>
                  <p class="card-body editable-text">${escapeHtml(c.body)}</p>
                  ${c.detail ? `<div class="card-detail editable-text">${escapeHtml(c.detail)}</div>` : ""}
                  ${
                    c.isQuizCard
                      ? `<div class="quiz-verdict-banner">
                          <span class="quiz-click-hint">👆 Click Card to Reveal Engineering Answer</span>
                          <div class="quiz-answer editable-text"><strong>Answer:</strong> ${escapeHtml(c.quizVerdict || "Verified on Lab Bench!")}</div>
                        </div>`
                      : ""
                  }
                </article>
              `
                )
                .join("")}
            </div>

            ${
              rawCode
                ? `
              <div class="code-column reveal" style="transition-delay: 0.25s;">
                <div class="code-window">
                  <div class="code-window-bar">
                    <div class="window-dots"><span></span><span></span><span></span></div>
                    <span class="code-lang-tag">ARDUINO C++ FIRMWARE • ${escapeHtml(deck.classCode)}</span>
                    <button class="copy-code-btn" onclick="copySlideCode(this)">Copy Code</button>
                  </div>
                  <pre class="code-pre"><code class="editable-text">${escapeHtml(rawCode)}</code></pre>
                </div>
              </div>
            `
                : heroUrl
                ? `
              <div class="media-column reveal" style="transition-delay: 0.24s;">
                <div class="media-frame">
                  <img src="${escapeHtml(heroUrl)}" alt="${escapeHtml(slide.title)}" class="slide-hero-img" onerror="this.style.display='none'" />
                  <div class="media-caption editable-text">${escapeHtml(slide.imageCaption || `${deck.classCode} • Hardware & Circuit Reference`)}</div>
                </div>
              </div>
            `
                : ""
            }
          </div>

          <!-- Footer Bar -->
          <footer class="slide-footer">
            <div class="footer-brand">
              <span class="brand-dot"></span>
              <strong>RoboBee Innovators</strong> • <em>&ldquo;Dream. Invent. Experiment. Inspire.&rdquo;</em> • Lead: Mahir Rahman
            </div>
            <div class="footer-notes editable-text" title="Speaker Notes">
              🎙️ ${escapeHtml(slide.speakerNotes || "Guide students through hands-on verification before powering the circuit.")}
            </div>
          </footer>
        </div>
      </section>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(deck.classCode)} — ${escapeHtml(deck.title)} | RoboBee Frontend Slides</title>
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" />
  <style>
    /* ==========================================================================
       ROBOBEE INNOVATORS × FRONTEND-SLIDES ENGINE (1920×1080 FIXED 16:9 STAGE)
       ========================================================================== */
    :root {
      --bg-primary: #0b0f19;
      --bg-secondary: #131926;
      --burgundy: #6B0F24;
      --gold: #F5B800;
      --cyan: #00F5D4;
      --blue: #38BDF8;
      --text-primary: #FFFFFF;
      --text-secondary: #CBD5E1;
      --font-display: 'Clash Display', system-ui, sans-serif;
      --font-body: 'Satoshi', system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --slide-padding: 64px;
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
      --duration-normal: 0.55s;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    /* --- viewport-base.css (Fixed 1920x1080 Stage) --- */
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #070a12;
      font-family: var(--font-body);
      color: var(--text-primary);
      user-select: none;
    }

    .deck-viewport {
      position: fixed;
      inset: 0;
      overflow: hidden;
      background: radial-gradient(circle at 50% 20%, #161d2f 0%, #070a12 100%);
    }

    .deck-stage {
      position: absolute;
      top: 0;
      left: 0;
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      transform-origin: top left;
      will-change: transform;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.75);
    }

    .slide {
      position: absolute;
      inset: 0;
      width: 1920px;
      height: 1080px;
      padding: var(--slide-padding);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      background: var(--slide-bg, linear-gradient(135deg, #0D111A 0%, #1B1026 55%, #2D0B18 100%));
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.45s var(--ease-out-expo), visibility 0.45s ease;
    }

    .slide.active {
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
      z-index: 2;
    }

    .slide-bg-mesh {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 88% 14%, rgba(245, 184, 0, 0.14) 0%, transparent 38%),
        radial-gradient(circle at 12% 86%, rgba(107, 15, 36, 0.35) 0%, transparent 42%),
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 48px 48px, 48px 48px;
      pointer-events: none;
    }

    .slide-inner {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 24px;
    }

    /* Animations */
    .reveal {
      opacity: 0;
      transform: translateY(26px);
      transition: opacity var(--duration-normal) var(--ease-out-expo),
                  transform var(--duration-normal) var(--ease-out-expo);
    }
    .slide.visible .reveal {
      opacity: 1;
      transform: translateY(0);
    }

    /* Slide Header */
    .slide-header {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .badge-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .slide-num-pill {
      padding: 6px 14px;
      border-radius: 999px;
      background: var(--burgundy);
      border: 1px solid var(--gold);
      color: var(--gold);
      font-weight: 800;
      font-size: 15px;
      letter-spacing: 0.08em;
    }
    .slide-badge-pill {
      padding: 6px 16px;
      border-radius: 999px;
      background: rgba(245, 184, 0, 0.14);
      border: 1px solid rgba(245, 184, 0, 0.4);
      color: #FDE047;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .friday-tag {
      margin-left: auto;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(0, 245, 212, 0.12);
      border: 1px solid rgba(0, 245, 212, 0.35);
      color: var(--cyan);
      font-size: 14px;
      font-weight: 700;
    }
    .slide-title {
      font-family: var(--font-display);
      font-size: 54px;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }
    .slide-subtitle {
      font-size: 23px;
      color: #CBD5E1;
      line-height: 1.4;
      max-width: 1540px;
    }

    /* Slide Body Layouts */
    .slide-body {
      flex: 1;
      display: grid;
      gap: 28px;
      min-height: 0;
      align-items: stretch;
    }
    .layout-split-media,
    .layout-code-split {
      grid-template-columns: 1.05fr 0.95fr;
    }
    .layout-bento-grid .cards-column {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    .layout-split-media .cards-column,
    .layout-code-split .cards-column {
      display: flex;
      flex-direction: column;
      gap: 18px;
      justify-content: center;
    }

    .bento-card {
      background: rgba(17, 24, 39, 0.86);
      border: 1.5px solid rgba(255, 255, 255, 0.14);
      border-left: 6px solid var(--card-accent, var(--gold));
      border-radius: 20px;
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(12px);
      transition: transform 0.25s ease, border-color 0.25s ease;
    }
    .bento-card:hover {
      transform: translateY(-3px);
      border-color: var(--gold);
    }
    .card-badge {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--gold);
    }
    .card-title {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .card-body {
      font-size: 19px;
      line-height: 1.5;
      color: #E2E8F0;
      white-space: pre-line;
    }
    .card-detail {
      margin-top: 4px;
      padding-top: 8px;
      border-top: 1px dashed rgba(255, 255, 255, 0.15);
      font-size: 16px;
      color: #38BDF8;
      font-weight: 600;
    }

    /* Quiz Flip Card */
    .quiz-flip-card {
      cursor: pointer;
    }
    .quiz-verdict-banner {
      margin-top: 8px;
      padding: 10px 14px;
      border-radius: 12px;
      background: rgba(245, 184, 0, 0.12);
      border: 1px solid rgba(245, 184, 0, 0.35);
    }
    .quiz-click-hint {
      font-size: 14px;
      font-weight: 700;
      color: var(--gold);
    }
    .quiz-answer {
      display: none;
      font-size: 17px;
      color: #10B981;
      margin-top: 4px;
    }
    .quiz-flip-card.flipped .quiz-click-hint {
      display: none;
    }
    .quiz-flip-card.flipped .quiz-answer {
      display: block;
    }

    /* Media & Code Columns */
    .media-column, .code-column {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }
    .media-frame {
      flex: 1;
      background: rgba(10, 15, 28, 0.82);
      border: 2px solid rgba(245, 184, 0, 0.32);
      border-radius: 24px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
      box-shadow: 0 24px 56px rgba(0, 0, 0, 0.5);
    }
    .slide-hero-img {
      max-width: 100%;
      max-height: 520px;
      object-fit: contain;
      border-radius: 14px;
    }
    .media-caption {
      margin-top: 12px;
      font-size: 15px;
      font-weight: 600;
      color: #94A3B8;
      text-align: center;
    }

    .code-window {
      flex: 1;
      background: #090D16;
      border: 2px solid #38BDF8;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 24px 56px rgba(0, 0, 0, 0.55);
    }
    .code-window-bar {
      padding: 12px 18px;
      background: #111827;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .window-dots {
      display: flex;
      gap: 8px;
    }
    .window-dots span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #EF4444;
    }
    .window-dots span:nth-child(2) { background: #F59E0B; }
    .window-dots span:nth-child(3) { background: #10B981; }
    .code-lang-tag {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 700;
      color: #38BDF8;
    }
    .copy-code-btn {
      background: rgba(56, 189, 248, 0.16);
      border: 1px solid #38BDF8;
      color: #FFFFFF;
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .code-pre {
      padding: 22px;
      font-family: var(--font-mono);
      font-size: 17px;
      line-height: 1.5;
      color: #F8FAFC;
      overflow: auto;
      flex: 1;
    }

    /* Footer */
    .slide-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      font-size: 16px;
      color: #94A3B8;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #E2E8F0;
    }
    .brand-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--gold);
      box-shadow: 0 0 12px var(--gold);
    }
    .footer-notes {
      max-width: 980px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #CBD5E1;
    }

    /* ==========================================================================
       INLINE EDITING HOTZONE (FRONTEND-SLIDES REQUIRED JS DELAY PATTERN)
       ========================================================================== */
    .edit-hotzone {
      position: fixed;
      top: 0;
      left: 0;
      width: 90px;
      height: 90px;
      z-index: 10000;
      cursor: pointer;
    }
    .edit-toggle {
      position: fixed;
      top: 18px;
      left: 18px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 10001;
      background: #6B0F24;
      border: 2px solid #F5B800;
      color: #FFFFFF;
      padding: 8px 14px;
      border-radius: 999px;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .edit-toggle.show,
    .edit-toggle.active {
      opacity: 1;
      pointer-events: auto;
    }

    /* Floating Bottom Navigation Dock */
    .hud-dock {
      position: fixed;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(245, 184, 0, 0.4);
      border-radius: 999px;
      padding: 8px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      backdrop-filter: blur(12px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
    }
    .hud-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #FFFFFF;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .hud-btn:hover {
      background: #6B0F24;
      border-color: #F5B800;
    }
    .hud-counter {
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 700;
      color: #F5B800;
    }

    [contenteditable="true"] {
      outline: 2px dashed #F5B800 !important;
      outline-offset: 4px;
      background: rgba(245, 184, 0, 0.08);
      border-radius: 6px;
      cursor: text;
    }
  </style>
</head>
<body>
  <div class="edit-hotzone" id="editHotzone"></div>
  <button class="edit-toggle" id="editToggle" title="Toggle Inline Edit Mode (E)">✏️ Edit Slides (E)</button>

  <div class="deck-viewport">
    <main class="deck-stage" id="deckStage">
      ${slidesHtml}
    </main>
  </div>

  <nav class="hud-dock">
    <button class="hud-btn" onclick="deckApp.prev()">◀ Prev</button>
    <span class="hud-counter" id="hudCounter">01 / ${String(deck.slides.length).padStart(2, "0")}</span>
    <button class="hud-btn" onclick="deckApp.next()">Next ▶</button>
    <button class="hud-btn" onclick="deckApp.toggleEdit()" id="dockEditBtn">✏️ Inline Edit</button>
    <button class="hud-btn" onclick="deckApp.downloadHtml()">💾 Save HTML</button>
    <button class="hud-btn" onclick="deckApp.toggleFullscreen()">⛶ Fullscreen</button>
  </nav>

  <script>
    function copySlideCode(btn) {
      const pre = btn.closest('.code-window').querySelector('code');
      if (!pre) return;
      navigator.clipboard.writeText(pre.innerText);
      const orig = btn.innerText;
      btn.innerText = '✓ Copied!';
      setTimeout(() => { btn.innerText = orig; }, 1800);
    }

    class SlidePresentation {
      constructor() {
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.currentSlide = 0;
        this.isEditing = false;
        this.stage = document.getElementById('deckStage');
        this.counter = document.getElementById('hudCounter');
        this.setupStageScale();
        this.setupKeyboardNav();
        this.setupTouchNav();
        this.setupInlineEdit();
        this.showSlide(0);
      }

      setupStageScale() {
        const scale = () => {
          const factor = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
          const x = (window.innerWidth - 1920 * factor) / 2;
          const y = (window.innerHeight - 1080 * factor) / 2;
          this.stage.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + factor + ')';
        };
        scale();
        window.addEventListener('resize', scale);
      }

      showSlide(index) {
        this.currentSlide = Math.max(0, Math.min(index, this.slides.length - 1));
        this.slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === this.currentSlide);
          slide.classList.toggle('visible', i === this.currentSlide);
        });
        if (this.counter) {
          this.counter.textContent =
            String(this.currentSlide + 1).padStart(2, '0') +
            ' / ' +
            String(this.slides.length).padStart(2, '0');
        }
      }

      next() { this.showSlide(this.currentSlide + 1); }
      prev() { this.showSlide(this.currentSlide - 1); }

      setupKeyboardNav() {
        window.addEventListener('keydown', (e) => {
          if (e.target && e.target.getAttribute && e.target.getAttribute('contenteditable') === 'true') {
            if (e.key === 'Escape') e.target.blur();
            return;
          }
          if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            e.preventDefault();
            this.next();
          } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            this.prev();
          } else if (e.key === 'e' || e.key === 'E') {
            e.preventDefault();
            this.toggleEdit();
          } else if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            this.toggleFullscreen();
          }
        });
      }

      setupTouchNav() {
        let startX = null;
        window.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        window.addEventListener('touchend', (e) => {
          if (startX === null) return;
          const dx = e.changedTouches[0].clientX - startX;
          if (dx < -50) this.next();
          if (dx > 50) this.prev();
          startX = null;
        });
      }

      setupInlineEdit() {
        const hotzone = document.getElementById('editHotzone');
        const editToggle = document.getElementById('editToggle');
        let hideTimeout = null;

        hotzone.addEventListener('mouseenter', () => {
          clearTimeout(hideTimeout);
          editToggle.classList.add('show');
        });
        hotzone.addEventListener('mouseleave', () => {
          hideTimeout = setTimeout(() => {
            if (!this.isEditing) editToggle.classList.remove('show');
          }, 400);
        });
        editToggle.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        editToggle.addEventListener('mouseleave', () => {
          hideTimeout = setTimeout(() => {
            if (!this.isEditing) editToggle.classList.remove('show');
          }, 400);
        });
        hotzone.addEventListener('click', () => this.toggleEdit());
        editToggle.addEventListener('click', () => this.toggleEdit());
      }

      toggleEdit() {
        this.isEditing = !this.isEditing;
        const editToggle = document.getElementById('editToggle');
        const dockBtn = document.getElementById('dockEditBtn');
        editToggle.classList.toggle('active', this.isEditing);
        editToggle.textContent = this.isEditing ? '✓ Editing Active (Press E)' : '✏️ Edit Slides (E)';
        if (dockBtn) dockBtn.textContent = this.isEditing ? '✓ Done Editing' : '✏️ Inline Edit';
        document.querySelectorAll('.editable-text').forEach((el) => {
          el.setAttribute('contenteditable', this.isEditing ? 'true' : 'false');
        });
      }

      downloadHtml() {
        const htmlContent = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '${escapeHtml(deck.classCode.replace(/\\s+/g, "_"))}_FrontendSlides.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }

      toggleFullscreen() {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    }

    const deckApp = new SlidePresentation();
  </script>
</body>
</html>`;
}

export function downloadFrontendSlidesDeck(
  deck: EditableClassDeck,
  lesson?: RoboticsLesson | null
) {
  if (typeof window === "undefined") return;
  const html = generateFrontendSlidesHtml(deck, lesson);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `RoboBee_${deck.classCode.replace(/\s+/g, "_")}_FrontendSlides.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function openFrontendSlidesInNewTab(
  deck: EditableClassDeck,
  lesson?: RoboticsLesson | null
) {
  if (typeof window === "undefined") return;
  const html = generateFrontendSlidesHtml(deck, lesson);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}
