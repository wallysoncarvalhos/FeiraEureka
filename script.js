/* ============================================================
   BRAÇO ROBÓTICO INDUSTRIAL — script-sincronizado-completo.js
   Toda a interatividade do projeto
   ============================================================ */


/* ============================================================
   ANO NO RODAPÉ
   ============================================================ */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* ============================================================
   1) TELA DE BOOT
   ============================================================ */

(function bootSequence() {

  const screen = document.getElementById("boot-screen");
  const fill = document.getElementById("boot-bar-fill");
  const log = document.getElementById("boot-log");

  if (!screen || !fill || !log) return;

  const steps = [
    "Bem-vindo ao nosso projeto! Conheça nosso braço robótico e descubra como ele funciona."
  ];

  let i = 0;
  const total = steps.length;

  const timer = setInterval(() => {

    if (i < total) {

      log.innerHTML += steps[i] + "<br/>";

      fill.style.width =
        Math.round(((i + 1) / total) * 100) + "%";

      i++;

    } else {

      clearInterval(timer);

      setTimeout(() => {

        screen.classList.add("hidden");

        if (window.AOS) {

          AOS.init({
            duration: 800,
            once: true,
            offset: 80
          });

        }

      }, 4000);

    }

  }, 820);

})();


/* ============================================================
   2) FUNDO ANIMADO — PARTÍCULAS
   ============================================================ */

(function particles() {

  const canvas =
    document.getElementById("bg-canvas");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  let w;
  let h;
  let dots;


  function resize() {

    w = canvas.width =
      window.innerWidth;

    h = canvas.height =
      window.innerHeight;

    const count =
      Math.min(
        90,
        Math.floor((w * h) / 16000)
      );

    dots =
      Array.from(
        { length: count },
        () => ({

          x: Math.random() * w,

          y: Math.random() * h,

          vx:
            (Math.random() - 0.5) * 0.4,

          vy:
            (Math.random() - 0.5) * 0.4

        })
      );

  }


  function draw() {

    ctx.clearRect(
      0,
      0,
      w,
      h
    );


    for (
      let a = 0;
      a < dots.length;
      a++
    ) {

      const p = dots[a];

      p.x += p.vx;
      p.y += p.vy;


      if (
        p.x < 0 ||
        p.x > w
      ) {
        p.vx *= -1;
      }


      if (
        p.y < 0 ||
        p.y > h
      ) {
        p.vy *= -1;
      }


      /* ponto */

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        1.6,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(0,191,255,0.8)";

      ctx.fill();


      /* linhas */

      for (
        let b = a + 1;
        b < dots.length;
        b++
      ) {

        const q = dots[b];

        const dist =
          Math.hypot(
            p.x - q.x,
            p.y - q.y
          );


        if (dist < 130) {

          ctx.beginPath();

          ctx.moveTo(
            p.x,
            p.y
          );

          ctx.lineTo(
            q.x,
            q.y
          );

          ctx.strokeStyle =
            `rgba(0,255,255,${(1 - dist / 130) * 0.18})`;

          ctx.lineWidth = 1;

          ctx.stroke();

        }

      }

    }


    requestAnimationFrame(draw);

  }


  window.addEventListener(
    "resize",
    resize
  );

  resize();

  draw();

})();


/* ============================================================
   3) CURSOR PERSONALIZADO
   ============================================================ */

(function customCursor() {

  const dot =
    document.getElementById(
      "cursor-dot"
    );

  const ring =
    document.getElementById(
      "cursor-ring"
    );


  if (!dot || !ring) return;


  if (
    !matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches
  ) {
    return;
  }


  let rx = 0;
  let ry = 0;

  let mx = 0;
  let my = 0;


  window.addEventListener(
    "mousemove",
    (e) => {

      mx = e.clientX;
      my = e.clientY;

      dot.style.left =
        mx + "px";

      dot.style.top =
        my + "px";

    }
  );


  (function follow() {

    rx +=
      (mx - rx) * 0.18;

    ry +=
      (my - ry) * 0.18;


    ring.style.left =
      rx + "px";

    ring.style.top =
      ry + "px";


    requestAnimationFrame(
      follow
    );

  })();


  document
    .querySelectorAll(
      "a, button, .hotspot, .card3d, .gallery-item"
    )
    .forEach((el) => {

      el.addEventListener(
        "mouseenter",
        () => {

          ring.classList.add(
            "grow"
          );

        }
      );


      el.addEventListener(
        "mouseleave",
        () => {

          ring.classList.remove(
            "grow"
          );

        }
      );

    });

})();


/* ============================================================
   4) NAVBAR
   MENU + SEÇÃO ATIVA + BARRA DE PROGRESSO
   ============================================================ */

(function navigation() {

  const navbar =
    document.getElementById(
      "navbar"
    );

  const menuToggle =
    document.getElementById(
      "menu-toggle"
    );

  const navLinks =
    document.getElementById(
      "nav-links"
    );

  const progress =
    document.getElementById(
      "scroll-progress"
    );

  const toTop =
    document.getElementById(
      "to-top"
    );


  if (
    !navbar ||
    !navLinks ||
    !progress
  ) {
    return;
  }


  /* ==========================================================
     LINKS DO MENU
     ========================================================== */

  const links =
    [
      ...navLinks.querySelectorAll(
        "a[href^='#']"
      )
    ];


  /* ==========================================================
     LOCALIZAR SOMENTE AS SEÇÕES EXISTENTES
     ========================================================== */

  const sections =
    links

      .map((link) => {

        const id =
          link.getAttribute(
            "href"
          );

        const section =
          document.querySelector(
            id
          );

        if (!section) {
          return null;
        }

        return {
          link,
          section
        };

      })

      .filter(Boolean);


  /* ==========================================================
     MENU MOBILE
     ========================================================== */

  if (menuToggle) {

    menuToggle.addEventListener(
      "click",
      () => {

        const isOpen =
          navLinks.classList.toggle(
            "open"
          );

        menuToggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }
    );

  }


  /* Fechar menu ao clicar */

  links.forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          navLinks.classList.remove(
            "open"
          );

          if (menuToggle) {

            menuToggle.setAttribute(
              "aria-expanded",
              "false"
            );

          }

        }
      );

    }
  );


  /* ==========================================================
     ATUALIZAÇÃO DA NAVEGAÇÃO
     ========================================================== */

  function updateNavigation() {

    const y =
      window.scrollY;


    /* --------------------------------------------------------
       NAVBAR
       -------------------------------------------------------- */

    navbar.classList.toggle(
      "scrolled",
      y > 40
    );


    /* --------------------------------------------------------
       BARRA DE PROGRESSO
       -------------------------------------------------------- */

    const docH =
      document.documentElement
        .scrollHeight -
      window.innerHeight;


    let percent = 0;


    if (docH > 0) {

      percent =
        (y / docH) * 100;

    }


    percent =
      Math.min(
        100,
        Math.max(
          0,
          percent
        )
      );


    progress.style.width =
      percent + "%";


    progress.setAttribute(
      "aria-valuenow",
      Math.round(percent)
    );


    /* --------------------------------------------------------
       DESCOBRIR A SEÇÃO ATUAL
       -------------------------------------------------------- */

    const marker =
      y +
      Math.min(
        140,
        navbar.offsetHeight + 70
      );


    let active = null;


    sections.forEach(
      ({
        link,
        section
      }) => {

        if (
          marker >=
          section.offsetTop
        ) {

          active = link;

        }

      }
    );


    /* --------------------------------------------------------
       DESTACAR ITEM ATIVO
       -------------------------------------------------------- */

    links.forEach(
      (link) => {

        const isActive =
          link === active;


        link.classList.toggle(
          "active",
          isActive
        );


        if (isActive) {

          link.setAttribute(
            "aria-current",
            "page"
          );

        } else {

          link.removeAttribute(
            "aria-current"
          );

        }

      }
    );


    /* --------------------------------------------------------
       BOTÃO VOLTAR AO TOPO
       -------------------------------------------------------- */

    if (toTop) {

      toTop.classList.toggle(
        "show",
        y > 500
      );

    }

  }


  /* ==========================================================
     BOTÃO VOLTAR AO TOPO
     ========================================================== */

  if (toTop) {

    toTop.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }


  /* ==========================================================
     EVENTOS
     ========================================================== */

  window.addEventListener(
    "scroll",
    updateNavigation,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    updateNavigation
  );


  /* Executar imediatamente */

  updateNavigation();

})();


/* ============================================================
   5) TEMA CLARO / ESCURO
   ============================================================ */

(function themeToggle() {

  const btn =
    document.getElementById(
      "theme-toggle"
    );


  if (!btn) return;


  const icon =
    btn.querySelector(
      "i"
    );


  const saved =
    localStorage.getItem(
      "theme"
    );


  if (saved) {

    document.documentElement.dataset.theme =
      saved;

  }


  updateIcon();


  btn.addEventListener(
    "click",
    () => {

      const next =
        document.documentElement.dataset.theme ===
        "dark"
          ? "light"
          : "dark";


      document.documentElement.dataset.theme =
        next;


      localStorage.setItem(
        "theme",
        next
      );


      updateIcon();

    }
  );


  function updateIcon() {

    if (!icon) return;


    const dark =
      document.documentElement.dataset.theme !==
      "light";


    icon.className =
      dark
        ? "fa-solid fa-moon"
        : "fa-solid fa-sun";

  }

})();


/* ============================================================
   6) HERO PARALLAX
   ============================================================ */

(function parallax() {

  const el =
    document.getElementById(
      "hero-parallax"
    );


  if (!el) return;


  window.addEventListener(
    "scroll",
    () => {

      const y =
        window.scrollY;


      if (
        y <
        window.innerHeight
      ) {

        el.style.transform =
          `translateY(${y * 0.35}px)`;

      }

    }
  );

})();


/* ============================================================
   7) MODAIS
   ============================================================ */

/*
   O código original possuía aqui um trecho incompleto
   relacionado a modal.

   O trecho estava usando variáveis que não haviam sido
   declaradas, o que poderia interromper o carregamento
   de todo o JavaScript.

   Por isso o bloco incompleto foi removido.
*/


/* ============================================================
   8) BRAÇO ROBÓTICO
   EFEITO 3D + HOTSPOTS
   ============================================================ */

(function roboticArm() {

  const frame =
    document.getElementById(
      "arm-frame"
    );

  const infoTitle =
    document.getElementById(
      "arm-info-title"
    );

  const infoText =
    document.getElementById(
      "arm-info-text"
    );


  if (!frame) return;


  /* ==========================================================
     EFEITO 3D
     ========================================================== */

  frame.addEventListener(
    "mousemove",
    (e) => {

      const r =
        frame.getBoundingClientRect();


      const px =
        (e.clientX - r.left) /
          r.width -
        0.5;


      const py =
        (e.clientY - r.top) /
          r.height -
        0.5;


      frame.style.transform =
        `perspective(900px)
         rotateY(${px * 8}deg)
         rotateX(${-py * 8}deg)`;

    }
  );


  frame.addEventListener(
    "mouseleave",
    () => {

      frame.style.transform =
        "perspective(900px) rotateY(0) rotateX(0)";

    }
  );


  /* ==========================================================
     HOTSPOTS
     ========================================================== */

  const spots =
    frame.querySelectorAll(
      ".hotspot"
    );


  spots.forEach(
    (s) => {

      s.addEventListener(
        "click",
        (e) => {

          e.stopPropagation();


          spots.forEach(
            (o) =>
              o.classList.remove(
                "active"
              )
          );


          s.classList.add(
            "active"
          );


          if (infoTitle) {

            infoTitle.textContent =
              s.dataset.title || "";

          }


          if (infoText) {

            infoText.textContent =
              s.dataset.info || "";

          }

        }
      );

    }
  );

})();


/* ============================================================
   9) SIMULAÇÃO
   ANIMAÇÃO DO CICLO DO BRAÇO
   ============================================================ */

(function simulation() {

  const seg1 =
    document.getElementById(
      "seg1"
    );

  const seg2 =
    document.getElementById(
      "seg2"
    );

  const gripper =
    document.getElementById(
      "gripper"
    );

  const payload =
    document.getElementById(
      "payload"
    );

  const status =
    document.getElementById(
      "sim-status"
    );

  const startBtn =
    document.getElementById(
      "sim-start"
    );

  const pauseBtn =
    document.getElementById(
      "sim-pause"
    );

  const resetBtn =
    document.getElementById(
      "sim-reset"
    );


  if (
    !seg1 ||
    !seg2 ||
    !gripper ||
    !payload ||
    !status ||
    !startBtn ||
    !pauseBtn ||
    !resetBtn
  ) {

    return;

  }


  const BASE = {
    x: 250,
    y: 285
  };


  const POS = {

    home: {
      x: 250,
      y: 130
    },

    pickup: {
      x: 75,
      y: 245
    },

    drop: {
      x: 425,
      y: 245
    }

  };


  let running = false;
  let paused = false;
  let holding = false;


  let current = {
    ...POS.home
  };


  /* ==========================================================
     RENDER
     ========================================================== */

  function render(tip) {

    const midX =
      (BASE.x + tip.x) / 2;


    const midY =
      Math.min(
        BASE.y,
        tip.y
      ) - 40;


    seg1.setAttribute(
      "x1",
      BASE.x
    );

    seg1.setAttribute(
      "y1",
      BASE.y
    );

    seg1.setAttribute(
      "x2",
      midX
    );

    seg1.setAttribute(
      "y2",
      midY
    );


    seg2.setAttribute(
      "x1",
      midX
    );

    seg2.setAttribute(
      "y1",
      midY
    );

    seg2.setAttribute(
      "x2",
      tip.x
    );

    seg2.setAttribute(
      "y2",
      tip.y
    );


    gripper.setAttribute(
      "cx",
      tip.x
    );

    gripper.setAttribute(
      "cy",
      tip.y
    );


    if (holding) {

      payload.setAttribute(
        "x",
        tip.x - 8
      );

      payload.setAttribute(
        "y",
        tip.y + 6
      );

    }

  }


  /* ==========================================================
     MOVIMENTO
     ========================================================== */

  function moveTo(
    target,
    duration
  ) {

    return new Promise(
      (resolve) => {

        const start = {
          ...current
        };


        const t0 =
          performance.now();


        function step(now) {

          if (paused) {

            requestAnimationFrame(
              step
            );

            return;

          }


          if (!running) {

            resolve();

            return;

          }


          const k =
            Math.min(
              (now - t0) /
                duration,
              1
            );


          const ease =
            k < 0.5

              ? 2 * k * k

              : 1 -
                Math.pow(
                  -2 * k + 2,
                  2
                ) / 2;


          current.x =
            start.x +
            (target.x - start.x) *
              ease;


          current.y =
            start.y +
            (target.y - start.y) *
              ease;


          render(current);


          if (k < 1) {

            requestAnimationFrame(
              step
            );

          } else {

            resolve();

          }

        }


        requestAnimationFrame(
          step
        );

      }
    );

  }


  /* ==========================================================
     ESPERA
     ========================================================== */

  const wait =
    (ms) =>
      new Promise(
        (resolve) => {

          const t0 =
            performance.now();


          (
            function w(now) {

              if (paused) {

                requestAnimationFrame(
                  w
                );

                return;

              }


              if (!running) {

                resolve();

                return;

              }


              if (
                now - t0 >= ms
              ) {

                resolve();

                return;

              }


              requestAnimationFrame(
                w
              );

            }
          )(
            performance.now()
          );

        }
      );


  function setStatus(msg) {

    status.textContent =
      msg;

  }


  /* ==========================================================
     CICLO
     ========================================================== */

  async function cycle() {

    setStatus(
      "Sistema inicializado"
    );


    await wait(600);


    while (running) {

      setStatus(
        "Buscando peça..."
      );


      await moveTo(
        POS.pickup,
        1200
      );


      setStatus(
        "Abrindo garra..."
      );


      gripper.setAttribute(
        "r",
        12
      );


      await wait(500);


      setStatus(
        "Capturando peça..."
      );


      holding = true;


      payload.style.opacity = 1;


      gripper.setAttribute(
        "r",
        9
      );


      render(current);


      await wait(500);


      setStatus(
        "Transportando..."
      );


      await moveTo(
        POS.drop,
        1600
      );


      setStatus(
        "Posicionando..."
      );


      await wait(400);


      holding = false;


      payload.style.opacity = 0;


      setStatus(
        "Processo finalizado"
      );


      await moveTo(
        POS.home,
        1200
      );


      await wait(700);

    }

  }


  /* ==========================================================
     BOTÃO INICIAR
     ========================================================== */

  startBtn.addEventListener(
    "click",
    () => {

      if (
        running &&
        paused
      ) {

        paused = false;

        setStatus(
          "Retomando..."
        );

        return;

      }


      if (running) {
        return;
      }


      running = true;

      paused = false;


      cycle();

    }
  );


  /* ==========================================================
     PAUSAR
     ========================================================== */

  pauseBtn.addEventListener(
    "click",
    () => {

      if (running) {

        paused = true;

        setStatus(
          "Pausado"
        );

      }

    }
  );


  /* ==========================================================
     RESET
     ========================================================== */

  resetBtn.addEventListener(
    "click",
    () => {

      running = false;

      paused = false;

      holding = false;


      payload.style.opacity = 0;


      current = {
        ...POS.home
      };


      render(
        current
      );


      setStatus(
        "Aguardando início..."
      );

    }
  );


  render(
    current
  );

})();


/* ============================================================
   10) CONTADORES ANIMADOS
   ============================================================ */

(function counters() {

  const els =
    document.querySelectorAll(
      "[data-count]"
    );


  if (!els.length) return;


  const obs =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            const el =
              entry.target;


            const target =
              +el.dataset.count;


            const suffix =
              el.dataset.suffix ||
              "";


            const dur = 1600;


            const t0 =
              performance.now();


            function step(now) {

              const k =
                Math.min(
                  (now - t0) /
                    dur,
                  1
                );


              el.textContent =
                Math.floor(
                  k * target
                ) + suffix;


              if (k < 1) {

                requestAnimationFrame(
                  step
                );

              } else {

                el.textContent =
                  target + suffix;

              }

            }


            requestAnimationFrame(
              step
            );


            obs.unobserve(
              el
            );

          }
        );

      },
      {
        threshold: 0.5
      }
    );


  els.forEach(
    (el) =>
      obs.observe(el)
  );

})();


/* ============================================================
   11) UPTIME
   ============================================================ */

(function uptime() {

  const el =
    document.getElementById(
      "uptime"
    );


  if (!el) return;


  const start =
    Date.now();


  setInterval(
    () => {

      const s =
        Math.floor(
          (Date.now() - start) /
            1000
        );


      const hh =
        String(
          Math.floor(
            s / 3600
          )
        ).padStart(
          2,
          "0"
        );


      const mm =
        String(
          Math.floor(
            (s % 3600) /
              60
          )
        ).padStart(
          2,
          "0"
        );


      const ss =
        String(
          s % 60
        ).padStart(
          2,
          "0"
        );


      el.textContent =
        `${hh}:${mm}:${ss}`;

    },
    1000
  );

})();


/* ============================================================
   12) GALERIA
   FILTROS + LIGHTBOX
   ============================================================ */

(function gallery() {

  const filters =
    document.querySelectorAll(
      ".filter-btn"
    );

  const items =
    document.querySelectorAll(
      ".gallery-item"
    );

  const lightbox =
    document.getElementById(
      "lightbox"
    );

  const lbImg =
    document.getElementById(
      "lightbox-img"
    );

  const lbClose =
    document.getElementById(
      "lightbox-close"
    );


  if (
    !lightbox ||
    !lbImg ||
    !lbClose
  ) {

    return;

  }


  /* ==========================================================
     FILTROS
     ========================================================== */

  filters.forEach(
    (btn) => {

      btn.addEventListener(
        "click",
        () => {

          filters.forEach(
            (b) =>
              b.classList.remove(
                "active"
              )
          );


          btn.classList.add(
            "active"
          );


          const f =
            btn.dataset.filter;


          items.forEach(
            (it) => {

              it.classList.toggle(
                "hide",
                f !== "all" &&
                it.dataset.cat !== f
              );

            }
          );

        }
      );

    }
  );


  /* ==========================================================
     ABRIR IMAGEM
     ========================================================== */

  items.forEach(
    (it) => {

      it.addEventListener(
        "click",
        () => {

          const img =
            it.querySelector(
              "img"
            );


          if (!img) return;


          lbImg.src =
            img.src;


          lbImg.alt =
            img.alt;


          lightbox.classList.add(
            "open"
          );

        }
      );

    }
  );


  /* ==========================================================
     FECHAR
     ========================================================== */

  lbClose.addEventListener(
    "click",
    () => {

      lightbox.classList.remove(
        "open"
      );

    }
  );


  lightbox.addEventListener(
    "click",
    (e) => {

      if (
        e.target ===
        lightbox
      ) {

        lightbox.classList.remove(
          "open"
        );

      }

    }
  );

})();


/* ============================================================
   13) FORMULÁRIO DE CONTATO
   ============================================================ */

(function contact() {

  const form =
    document.getElementById(
      "contact-form"
    );

  const msg =
    document.getElementById(
      "form-msg"
    );


  if (!form) return;


  form.addEventListener(
    "submit",
    (e) => {

      e.preventDefault();


      if (
        !form.checkValidity()
      ) {

        if (msg) {

          msg.style.color =
            "#ff6b6b";


          msg.textContent =
            "Por favor, preencha todos os campos corretamente.";

        }

        return;

      }


      if (msg) {

        msg.style.color =
          "var(--green)";


        msg.textContent =
          "Mensagem enviada com sucesso! Obrigado pelo contato.";

      }


      form.reset();


      setTimeout(
        () => {

          if (msg) {

            msg.textContent =
              "";

          }

        },
        5000
      );

    }
  );

})();


/* ============================================================
   14) TECLA ESC
   ============================================================ */

document.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key !== "Escape"
    ) {
      return;
    }


    const modal =
      document.getElementById(
        "modal"
      );


    const lightbox =
      document.getElementById(
        "lightbox"
      );


    if (modal) {

      modal.classList.remove(
        "open"
      );

    }


    if (lightbox) {

      lightbox.classList.remove(
        "open"
      );

    }

  }
);
