/* ==========================================================================
   Slide Atelier Engine — deck.js
   功能：1280×720 等比縮放、翻頁、data-step、總覽(O)、備忘(N)、全螢幕(F)、現場編輯(E)、下載HTML、匯出PDF
   ========================================================================== */
(() => {
  const deck = document.querySelector(".deck");
  if (!deck) return;

  const slides = Array.from(deck.querySelectorAll(".slide"));
  if (!slides.length) return;

  const viewport = document.createElement("div");
  viewport.className = "stage-viewport";
  deck.parentNode.insertBefore(viewport, deck);
  viewport.appendChild(deck);

  const deckTitle = deck.dataset.deckTitle || document.title;
  let current = 0;
  let notesOpen = false;
  let editMode = false;

  const progress = document.createElement("div");
  progress.className = "hud-progress";

  const notesDrawer = document.createElement("div");
  notesDrawer.className = "notes-drawer";
  notesDrawer.innerHTML = `<div class="notes-drawer-label">SPEAKER NOTES (PRESS N TO CLOSE)</div><div class="notes-body"></div>`;

  const hud = document.createElement("nav");
  hud.className = "hud";
  hud.setAttribute("aria-label", "簡報控制列");
  hud.innerHTML = `
    <div class="hud-group">
      <a href="../index.html" title="返回設計工作室">← 工作室</a>
      <span class="hud-title">${escapeHtml(deckTitle)}</span>
    </div>
    <div class="hud-group">
      <button type="button" data-action="prev" title="上一步 / 上一頁 (←)">←</button>
      <span class="hud-counter" aria-live="polite">01 / ${pad(slides.length)}</span>
      <button type="button" data-action="next" title="下一步 / 下一頁 (→)">→</button>
      <button type="button" data-action="overview" title="總覽模式 (O)">總覽</button>
      <button type="button" data-action="notes" title="講者備忘 (N)">備忘</button>
      <button type="button" data-action="edit" title="點字現場編輯 (E)">編輯文字</button>
      <button type="button" data-action="download" title="下載修改後的獨立 HTML 檔">下載 HTML</button>
      <button type="button" data-action="pptx" title="匯出 PowerPoint / Google 簡報 (.pptx)">下載 PPT</button>
      <button type="button" data-action="pdf" title="匯出 16:9 橫式 PDF">匯出 PDF</button>
      <button type="button" data-action="fullscreen" title="全螢幕 (F)">全螢幕</button>
    </div>
  `;

  document.body.append(progress, notesDrawer, hud);

  const counterEl = hud.querySelector(".hud-counter");
  const notesBody = notesDrawer.querySelector(".notes-body");
  const editBtn = hud.querySelector('button[data-action="edit"]');

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function fitStage() {
    if (document.body.classList.contains("is-overview")) {
      deck.style.transform = "";
      return;
    }
    const vw = viewport.clientWidth - 24;
    const vh = viewport.clientHeight - 20;
    const scale = Math.min(vw / 1280, vh / 720, 1.5);
    deck.style.transform = `scale(${Math.max(0.2, scale)})`;
  }

  function getSteps(slide) {
    return Array.from(slide.querySelectorAll("[data-step]")).sort(
      (a, b) => Number(a.dataset.step || 1) - Number(b.dataset.step || 1)
    );
  }

  function revealAll(slide) {
    getSteps(slide).forEach((el) => el.classList.add("is-revealed"));
  }

  function resetSteps(slide) {
    getSteps(slide).forEach((el) => el.classList.remove("is-revealed"));
  }

  function nextStepOrSlide() {
    const active = slides[current];
    const hidden = getSteps(active).filter((el) => !el.classList.contains("is-revealed"));
    if (hidden.length > 0) {
      hidden[0].classList.add("is-revealed");
      return;
    }
    if (current < slides.length - 1) {
      go(current + 1);
    }
  }

  function prevStepOrSlide() {
    const active = slides[current];
    const revealed = getSteps(active).filter((el) => el.classList.contains("is-revealed"));
    if (revealed.length > 0) {
      revealed[revealed.length - 1].classList.remove("is-revealed");
      return;
    }
    if (current > 0) {
      go(current - 1, true);
    }
  }

  function readHash() {
    const num = parseInt(window.location.hash.replace("#", ""), 10);
    if (!Number.isNaN(num) && num >= 1 && num <= slides.length) {
      return num - 1;
    }
    return 0;
  }

  function render(revealEnd = false) {
    slides.forEach((slide, idx) => {
      const isCurrent = idx === current;
      slide.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        if (revealEnd || editMode) revealAll(slide);
        else resetSteps(slide);
      }
    });

    counterEl.textContent = `${pad(current + 1)} / ${pad(slides.length)}`;
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    window.history.replaceState(null, "", `#${current + 1}`);

    const noteEl = slides[current].querySelector(".notes");
    notesBody.textContent = noteEl
      ? noteEl.textContent.trim()
      : "（這一頁沒有設定講者備忘）";
  }

  function go(index, revealEnd = false) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    render(revealEnd);
  }

  function toggleOverview(force) {
    const next = typeof force === "boolean" ? force : !document.body.classList.contains("is-overview");
    document.body.classList.toggle("is-overview", next);
    fitStage();
  }

  function toggleNotes() {
    notesOpen = !notesOpen;
    notesDrawer.classList.toggle("is-open", notesOpen);
  }

  function toggleEdit(force) {
    editMode = typeof force === "boolean" ? force : !editMode;
    document.body.classList.toggle("is-editing", editMode);
    editBtn.classList.toggle("is-on", editMode);
    editBtn.textContent = editMode ? "完成編輯" : "編輯文字";

    const editableSelector = "h1, h2, h3, p, span, div.kicker, li, blockquote";
    slides.forEach((slide) => {
      slide.querySelectorAll(editableSelector).forEach((el) => {
        if (el.closest("svg") || el.querySelector("canvas, svg")) return;
        if (el.children.length > 2) return;
        if (editMode) el.setAttribute("contenteditable", "true");
        else el.removeAttribute("contenteditable");
      });
    });
    if (editMode) revealAll(slides[current]);
  }

  function downloadEditedHtml() {
    if (editMode) toggleEdit(false);
    // 收集當前頁面的 style 標籤與 deck 內容，匯出為可編輯 HTML
    const cloneDoc = document.documentElement.cloneNode(true);
    cloneDoc.querySelectorAll(".hud, .hud-progress, .notes-drawer").forEach((n) => n.remove());
    const vp = cloneDoc.querySelector(".stage-viewport");
    if (vp) {
      const d = vp.querySelector(".deck");
      if (d) {
        d.style.transform = "";
        vp.parentNode.insertBefore(d, vp);
      }
      vp.remove();
    }
    const html = "<!DOCTYPE html>\n" + cloneDoc.outerHTML;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(deckTitle || "presentation").replace(/[^\w\u4e00-\u9fff-]+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportPdf() {
    if (editMode) toggleEdit(false);
    window.print();
  }

  async function exportPptx() {
    if (editMode) toggleEdit(false);
    const btn = hud.querySelector('button[data-action="pptx"]');
    const orig = btn.textContent;
    btn.textContent = "產生可編輯 PPT 中...";
    try {
      if (window.SlidePptxExporter && typeof window.SlidePptxExporter.exportDeck === "function") {
        await window.SlidePptxExporter.exportDeck({
          slideElements: slides,
          deckTitle
        });
      } else {
        throw new Error("找不到 pptx-exporter.js 模組");
      }
    } catch (err) {
      alert(err.message || "匯出 PPT 失敗");
    } finally {
      btn.textContent = orig;
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  hud.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "prev") prevStepOrSlide();
    if (action === "next") nextStepOrSlide();
    if (action === "overview") toggleOverview();
    if (action === "notes") toggleNotes();
    if (action === "edit") toggleEdit();
    if (action === "download") downloadEditedHtml();
    if (action === "pptx") exportPptx();
    if (action === "pdf") exportPdf();
    if (action === "fullscreen") toggleFullscreen();
  });

  slides.forEach((slide, idx) => {
    slide.addEventListener("click", () => {
      if (!document.body.classList.contains("is-overview")) return;
      toggleOverview(false);
      go(idx);
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea") || e.target.isContentEditable) return;
    const key = e.key;
    if (key === "ArrowRight" || key === "PageDown" || key === " ") {
      if (document.body.classList.contains("is-overview")) return;
      e.preventDefault();
      nextStepOrSlide();
    } else if (key === "ArrowLeft" || key === "PageUp") {
      if (document.body.classList.contains("is-overview")) return;
      e.preventDefault();
      prevStepOrSlide();
    } else if (key === "Home") {
      go(0);
    } else if (key === "End") {
      go(slides.length - 1, true);
    } else if (key.toLowerCase() === "o") {
      toggleOverview();
    } else if (key.toLowerCase() === "n") {
      toggleNotes();
    } else if (key.toLowerCase() === "e") {
      toggleEdit();
    } else if (key.toLowerCase() === "f") {
      toggleFullscreen();
    } else if (key === "Escape" && document.body.classList.contains("is-overview")) {
      toggleOverview(false);
    }
  });

  window.addEventListener("resize", fitStage);
  window.addEventListener("hashchange", () => go(readHash()));

  current = readHash();
  render();
  fitStage();
})();
