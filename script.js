/* ============================================================
   BRAÇO ROBÓTICO INDUSTRIAL — script.js
   Toda a interatividade: boot, partículas, cursor, menu,
   hotspots, simulação, contadores, galeria, tema, etc.
   ============================================================ */

/* ---------- Ano no rodapé ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============================================================
   1) TELA DE BOOT — simula inicialização de sistema industrial
   ============================================================ */
(function bootSequence() {
  const screen = document.getElementById("boot-screen");
  const fill = document.getElementById("boot-bar-fill");
  const log = document.getElementById("boot-log");
  const steps = [
    "Bem-vindo ao nosso projeto! Conheça nosso braço robótico e descubra como ele funciona.",
  ];
  let i = 0;
  const total = steps.length;

  const timer = setInterval(() => {
    if (i < total) {
      log.innerHTML += steps[i] + "<br/>";
      fill.style.width = Math.round(((i + 1) / total) * 100) + "%";
      i++;
    } else {
      clearInterval(timer);
      setTimeout(() => {
        screen.classList.add("hidden");
        
        // Inicia animações AOS após o boot
        if (window.AOS) AOS.init({ duration: 800, once: true, offset: 80 });
      }, 4000);
    }
  }, 820);
})();

/* ============================================================
   2) FUNDO ANIMADO — partículas + linhas conectadas (circuito)
   ============================================================ */
(function particles() {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, dots;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(90, Math.floor((w * h) / 16000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let a = 0; a < dots.length; a++) {
      const p = dots[a];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // ponto
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,191,255,0.8)";
      ctx.fill();

      // linhas de conexão (efeito circuito)
      for (let b = a + 1; b < dots.length; b++) {
        const q = dots[b];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,255,255,${(1 - dist / 130) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
})();

/* ============================================================
   3) CURSOR PERSONALIZADO
   ============================================================ */
(function customCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let rx = 0, ry = 0, mx = 0, my = 0;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });
  (function follow() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll("a, button, .hotspot, .card3d, .gallery-item").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("grow"));
    el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
  });
})();

/* ============================================================
   4) NAVBAR — scroll, menu mobile, link ativo, progresso
   ============================================================ */
(function navigation() {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const progress = document.getElementById("scroll-progress");
  const toTop = document.getElementById("to-top");
  const links = navLinks.querySelectorAll("a");
  const sections = [...links].map((a) => document.querySelector(a.getAttribute("href")));

  // menu mobile
  menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  links.forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 500);

    // barra de progresso
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (y / docH) * 100 + "%";

    // link ativo
    let current = "";
    sections.forEach((sec) => {
      if (sec && y >= sec.offsetTop - 120) current = "#" + sec.id;
    });
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === current));
  });

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ============================================================
   5) TEMA CLARO / ESCURO
   ============================================================ */
(function themeToggle() {
  const btn = document.getElementById("theme-toggle");
  const icon = btn.querySelector("i");
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
  updateIcon();

  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    updateIcon();
  });

  function updateIcon() {
    const dark = document.documentElement.dataset.theme !== "light";
    icon.className = dark ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }
})();

/* ============================================================
   6) HERO PARALLAX
   ============================================================ */
(function parallax() {
  const el = document.getElementById("hero-parallax");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y < window.innerHeight) el.style.transform = `translateY(${y * 0.35}px)`;
  });
})();

/* ============================================================

  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = content[btn.dataset.modal];
      title.textContent = c.t;
      text.textContent = c.d;
      modal.classList.add("open");
    });
  });

  close.addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
})();

/* ============================================================
   8) BRAÇO ROBÓTICO — efeito 3D + hotspots interativos
   ============================================================ */
(function roboticArm() {
  const frame = document.getElementById("arm-frame");
  const infoTitle = document.getElementById("arm-info-title");
  const infoText = document.getElementById("arm-info-text");

  // efeito 3D ao mover o mouse
  frame.addEventListener("mousemove", (e) => {
    const r = frame.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    frame.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
  });
  frame.addEventListener("mouseleave", () => {
    frame.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
  });

  // hotspots
  const spots = frame.querySelectorAll(".hotspot");
  spots.forEach((s) => {
    s.addEventListener("click", (e) => {
      e.stopPropagation();
      spots.forEach((o) => o.classList.remove("active"));
      s.classList.add("active");
      infoTitle.textContent = s.dataset.title;
      infoText.textContent = s.dataset.info;
    });
  });
})();

/* ============================================================
   9) SIMULAÇÃO — animação do ciclo do braço (SVG)
   ============================================================ */
(function simulation() {
  const seg1 = document.getElementById("seg1");
  const seg2 = document.getElementById("seg2");
  const gripper = document.getElementById("gripper");
  const payload = document.getElementById("payload");
  const status = document.getElementById("sim-status");
  const startBtn = document.getElementById("sim-start");
  const pauseBtn = document.getElementById("sim-pause");
  const resetBtn = document.getElementById("sim-reset");

  const BASE = { x: 250, y: 285 };
  // Posições-alvo da ponta da garra (x, y)
  const POS = {
    home: { x: 250, y: 130 },
    pickup: { x: 75, y: 245 },   // sobre a caixa
    drop: { x: 425, y: 245 },    // sobre a área
  };

  let running = false, paused = false, holding = false;
  let current = { ...POS.home };

  // Cinemática simples: desenha 2 segmentos até o alvo com um "cotovelo"
  function render(tip) {
    const midX = (BASE.x + tip.x) / 2;
    const midY = Math.min(BASE.y, tip.y) - 40; // cotovelo levantado
    seg1.setAttribute("x1", BASE.x); seg1.setAttribute("y1", BASE.y);
    seg1.setAttribute("x2", midX); seg1.setAttribute("y2", midY);
    seg2.setAttribute("x1", midX); seg2.setAttribute("y1", midY);
    seg2.setAttribute("x2", tip.x); seg2.setAttribute("y2", tip.y);
    gripper.setAttribute("cx", tip.x); gripper.setAttribute("cy", tip.y);
    if (holding) {
      payload.setAttribute("x", tip.x - 8);
      payload.setAttribute("y", tip.y + 6);
    }
  }

  // Anima o deslocamento da ponta entre dois pontos
  function moveTo(target, duration) {
    return new Promise((resolve) => {
      const start = { ...current };
      const t0 = performance.now();
      function step(now) {
        if (paused) { requestAnimationFrame(step); return; }
        if (!running) return resolve();
        const k = Math.min((now - t0) / duration, 1);
        const ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // easeInOutQuad
        current.x = start.x + (target.x - start.x) * ease;
        current.y = start.y + (target.y - start.y) * ease;
        render(current);
        if (k < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  const wait = (ms) => new Promise((r) => {
    const t0 = performance.now();
    (function w(now) {
      if (paused) return requestAnimationFrame(w);
      if (!running) return r();
      if (now - t0 >= ms) return r();
      requestAnimationFrame(w);
    })(performance.now());
  });

  function setStatus(msg) { status.textContent = msg; }

  async function cycle() {
    setStatus("Sistema inicializado");
    await wait(600);
    while (running) {
      setStatus("Buscando peça...");
      await moveTo(POS.pickup, 1200);
      setStatus("Abrindo garra...");
      gripper.setAttribute("r", 12); await wait(500);
      setStatus("Capturando peça...");
      holding = true; payload.style.opacity = 1;
      gripper.setAttribute("r", 9); render(current); await wait(500);
      setStatus("Transportando...");
      await moveTo(POS.drop, 1600);
      setStatus("Posicionando...");
      await wait(400);
      holding = false; payload.style.opacity = 0;
      setStatus("Processo finalizado");
      await moveTo(POS.home, 1200);
      await wait(700);
    }
  }

  startBtn.addEventListener("click", () => {
    if (running && paused) { paused = false; setStatus("Retomando..."); return; }
    if (running) return;
    running = true; paused = false;
    cycle();
  });
  pauseBtn.addEventListener("click", () => {
    if (running) { paused = true; setStatus("Pausado"); }
  });
  resetBtn.addEventListener("click", () => {
    running = false; paused = false; holding = false;
    payload.style.opacity = 0;
    current = { ...POS.home };
    render(current);
    setStatus("Aguardando início...");
  });

  render(current); // estado inicial
})();

/* ============================================================
   10) CONTADORES ANIMADOS (estatísticas + painel)
   ============================================================ */
(function counters() {
  const els = document.querySelectorAll("[data-count]");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const dur = 1600;
      const t0 = performance.now();
      function step(now) {
        const k = Math.min((now - t0) / dur, 1);
        el.textContent = Math.floor(k * target) + suffix;
        if (k < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach((el) => obs.observe(el));
})();

/* ============================================================
   11) UPTIME do painel
   ============================================================ */
(function uptime() {
  const el = document.getElementById("uptime");
  if (!el) return;
  const start = Date.now();
  setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000);
    const hh = String(Math.floor(s / 3600)).padStart(2, "0");
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    el.textContent = `${hh}:${mm}:${ss}`;
  }, 1000);
})();

/* ============================================================
   12) GALERIA — filtros + lightbox
   ============================================================ */
(function gallery() {
  const filters = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbClose = document.getElementById("lightbox-close");

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      items.forEach((it) => {
        it.classList.toggle("hide", f !== "all" && it.dataset.cat !== f);
      });
    });
  });

  items.forEach((it) => {
    it.addEventListener("click", () => {
      lbImg.src = it.querySelector("img").src;
      lbImg.alt = it.querySelector("img").alt;
      lightbox.classList.add("open");
    });
  });
  lbClose.addEventListener("click", () => lightbox.classList.remove("open"));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
})();

/* ============================================================
   13) FORMULÁRIO DE CONTATO (validação simples)
   ============================================================ */
(function contact() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      msg.style.color = "#ff6b6b";
      msg.textContent = "Por favor, preencha todos os campos corretamente.";
      return;
    }
    msg.style.color = "var(--green)";
    msg.textContent = "Mensagem enviada com sucesso! Obrigado pelo contato.";
    form.reset();
    setTimeout(() => (msg.textContent = ""), 5000);
  });
})();

/* Fecha modal/lightbox com a tecla ESC */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("modal").classList.remove("open");
    document.getElementById("lightbox").classList.remove("open");
  }
});
