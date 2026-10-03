/* =========================================================
   CVPILOT - APP.JS
========================================================= */


/* =========================================================
   PARTICLES BACKGROUND
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const particlesContainer =
        document.getElementById("particles-background");


    if (!particlesContainer) {
        return;
    }


    /* Make sure tsParticles is loaded */

    if (typeof tsParticles === "undefined") {

        console.error(
            "tsParticles library was not loaded."
        );

        return;
    }


    try {

        await tsParticles.load({

            id: "particles-background",

            options: {

                fullScreen: {
                    enable: false
                },


                background: {
                    color: {
                        value: "#080D16"
                    }
                },


                particles: {

                    number: {
                        value: 45,

                        density: {
                            enable: true,

                            width: 1000,
                            height: 1000
                        }
                    },


                    color: {
                        value: [
                            "#E85D3F",
                            "#F08A4B"
                        ]
                    },


                    opacity: {
                        value: {
                            min: 0.15,
                            max: 0.5
                        },

                        animation: {
                            enable: true,

                            speed: 0.5,

                            minimumValue: 0.1,

                            sync: false
                        }
                    },


                    size: {
                        value: {
                            min: 1,
                            max: 3
                        }
                    },


                    links: {
                        enable: true,

                        distance: 150,

                        color: "#E85D3F",

                        opacity: 0.18,

                        width: 1
                    },


                    move: {

                        enable: true,

                        speed: 0.7,

                        direction: "none",

                        random: true,

                        straight: false,

                        outModes: {
                            default: "bounce"
                        }
                    }

                },


                interactivity: {

                    detectsOn: "window",

                    events: {

                        onHover: {
                            enable: true,

                            mode: "grab"
                        },

                        resize: {
                            enable: true
                        }
                    },


                    modes: {

                        grab: {

                            distance: 180,

                            links: {
                                opacity: 0.35
                            }
                        }
                    }
                },


                detectRetina: true
            }

        });

    } catch (error) {

        console.error(
            "Particles failed to initialize:",
            error
        );

    }

});


/* =========================================================
   NAVBAR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navbar =
        document.getElementById("mainNavbar");

    const toggle =
        document.getElementById("navbarToggle");

    const menu =
        document.getElementById("navbarMenu");


    if (!navbar || !toggle || !menu) {
        return;
    }

    /* Initialize Bootstrap Collapse Instance to avoid native script conflicts */
    const bsCollapse = new bootstrap.Collapse(menu, {
        toggle: false
    });

    const navLinks =
        document.querySelectorAll(
            "#navbarMenu .nav-link"
        );


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    function navbarScroll() {

        if (window.scrollY > 30) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }
    }


    window.addEventListener(
        "scroll",
        navbarScroll,
        { passive: true }
    );


    navbarScroll();


    /* =====================================================
       CLOSE MENU FUNCTION
    ===================================================== */

    function closeMenu() {
        
        /* Safely hide the Bootstrap collapse menu */
        bsCollapse.hide();
        
        toggle.classList.remove("active");
        
        toggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    /* =====================================================
       TOGGLE MOBILE MENU
    ===================================================== */

    toggle.addEventListener("click", () => {

        const isOpen =
            menu.classList.contains("show");


        if (isOpen) {

            closeMenu();

        } else {

            /* Safely show the Bootstrap collapse menu */
            bsCollapse.show();

            toggle.classList.add("active");

            toggle.setAttribute(
                "aria-expanded",
                "true"
            );
        }

    });


    /* =====================================================
       CLOSE MENU AFTER NAV LINK CLICK
    ===================================================== */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => {

                item.classList.remove("active");

            });


            link.classList.add("active");


            closeMenu();

        });

    });


    /* =====================================================
       CLOSE MENU AFTER START BUILDING CLICK
    ===================================================== */

    const startButton =
        document.querySelector(".btn-start");


    if (startButton) {

        startButton.addEventListener(
            "click",
            () => {

                closeMenu();

            }
        );

    }


    /* =====================================================
       CLOSE WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener("click", (event) => {

        const clickedInsideNavbar =
            navbar.contains(event.target);

        const isOpen =
            menu.classList.contains("show");


        if (!clickedInsideNavbar && isOpen) {

            closeMenu();

        }

    });


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );


    /* =====================================================
       CLOSE MENU WHEN RESIZING TO DESKTOP
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 991.98) {

                closeMenu();

            }

        }
    );

});

const cvs = [
  {
    name: "Shakiba Amini",
    role: "Frontend Developer",
    photo: "https://i.pravatar.cc/180?img=47&v=6",
    summary: "Frontend developer focused on creating elegant, accessible and high-performing digital experiences.",
    company: "Frontend Developer",
    date: "2022 — Present",
    experience: "Built responsive interfaces, improved design systems and collaborated with product teams to ship polished user experiences.",
    education: "B.Sc. Computer Science · Kabul University · 2018 — 2022",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    project: "CareerPilot Dashboard · UX & Frontend System"
  },
  {
    name: "Morsal Amini",
    role: "UI/UX Designer",
    photo: "https://i.pravatar.cc/180?img=32&v=6",
    summary: "UI/UX designer translating complex ideas into clean, human-centered interfaces with strong visual systems.",
    company: "Product Designer",
    date: "2021 — Present",
    experience: "Designed product journeys, interactive prototypes and scalable component systems across web and mobile products.",
    education: "B.A. Information Design · Herat University · 2019 — 2023",
    skills: ["Figma", "UX", "UI", "Prototyping", "Research"],
    project: "Finance App · Product Experience"
  },
  {
    name: "Setayesh Amini",
    role: "Software Engineer",
    photo: "https://i.pravatar.cc/180?img=49&v=6",
    summary: "Software engineer building reliable digital products with a strong focus on clean architecture and delightful interfaces.",
    company: "Software Engineer",
    date: "2023 — Present",
    experience: "Developed production features, optimized application performance and worked with cross-functional engineering teams.",
    education: "B.Sc. Software Engineering · Kabul University · 2019 — 2023",
    skills: ["JavaScript", "Node.js", "React", "API", "Git"],
    project: "Smart Campus · Full-Stack Platform"
  }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const cvPaper = $("#cvPaper");
const cvName = $("#cvName");
const cvRole = $("#cvRole");
const cvPhoto = $("#cvPhoto");
const cvSummary = $("#cvSummary");
const cvCompany = $("#cvCompany");
const cvDate = $("#cvDate");
const cvExperience = $("#cvExperience");
const cvEducation = $("#cvEducation");
const cvSkills = $("#cvSkills");
const cvProject = $("#cvProject");
const cvCounter = $("#cvCounter");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");
const reviewBtn = $("#reviewBtn");
const toast = $("#toast");
const stage = $("#cv-showcase");

let current = 0;
let timer;
let startX = 0;


cvs.forEach(profile => {
  const img = new Image();
  img.src = profile.photo;
});

function render(index) {
  current = (index + cvs.length) % cvs.length;
  const data = cvs[current];

  cvPaper.classList.remove("switching");
  void cvPaper.offsetWidth;
  cvPaper.classList.add("switching");

  setTimeout(() => {
    cvName.textContent = data.name;
    cvRole.textContent = data.role;
    cvPhoto.src = data.photo;
    cvPhoto.alt = `${data.name} profile`;
    cvPhoto.loading = "eager";
    cvPhoto.decoding = "async";
    cvSummary.textContent = data.summary;
    cvCompany.textContent = data.company;
    cvDate.textContent = data.date;
    cvExperience.textContent = data.experience;
    cvEducation.textContent = data.education;
    cvProject.textContent = data.project;
    cvSkills.innerHTML = data.skills.map(s => `<span>${s}</span>`).join("");
    cvCounter.textContent = `0${current + 1} / 03`;
  }, 135);

  $$(".dot").forEach((dot, i) => dot.classList.toggle("active", i === current));
  clearHighlights();
  restartAuto();
}

function next() { render(current + 1); }
function previous() { render(current - 1); }

function clearHighlights() {
  $$(".cv-block").forEach(el => el.classList.remove("active"));
  $$(".feature-card").forEach(el => el.classList.remove("active"));
}

function activate(section, card) {
  clearHighlights();
  const block = document.querySelector(`[data-cv-section="${section}"]`);
  if (block) block.classList.add("active");
  if (card) card.classList.add("active");
}

function restartAuto() {
  clearInterval(timer);
  timer = setInterval(next, 8500);
}

prevBtn.addEventListener("click", previous);
nextBtn.addEventListener("click", next);

$$(".dot").forEach(dot => {
  dot.addEventListener("click", () => render(Number(dot.dataset.index)));
});

$$(".feature-card").forEach(card => {
  const section = card.dataset.section;

  card.addEventListener("mousedown", (event) => {
    if (event.detail > 0) event.preventDefault();
  });

  card.addEventListener("mouseenter", () => activate(section, card));
  card.addEventListener("focus", () => activate(section, card));

  card.addEventListener("mouseleave", clearHighlights);
  card.addEventListener("blur", clearHighlights);

  card.addEventListener("click", () => activate(section, card));
});

reviewBtn.addEventListener("click", () => {
  activate("experience", null);
  showToast("AI review preview activated ✦");

  setTimeout(clearHighlights, 1900);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

/* Pause auto-change while the user is interacting with the CV */
stage.addEventListener("mouseenter", () => clearInterval(timer));
stage.addEventListener("mouseleave", restartAuto);

/* Touch swipe */
stage.addEventListener("touchstart", e => {
  startX = e.changedTouches[0].screenX;
  clearInterval(timer);
}, { passive: true });

stage.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].screenX;
  const delta = endX - startX;

  if (Math.abs(delta) > 45) {
    delta < 0 ? next() : previous();
  } else {
    restartAuto();
  }
}, { passive: true });

/* Keyboard */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") previous();
});

/* Luxury desktop parallax */
if (window.matchMedia("(min-width: 992px)").matches) {
  stage.addEventListener("mousemove", e => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;

    cvPaper.style.transform =
      `perspective(1400px) rotateY(${x * 3}deg) rotateX(${y * -3}deg) translateY(${y * -4}px)`;
  });

  stage.addEventListener("mouseleave", () => {
    cvPaper.style.transform = "";
  });
}

render(0);


/* =========================================================
   V4 INTERACTION ENGINE
   ========================================================= */

const buildBtn = document.getElementById("buildBtn");
const progressBar = document.getElementById("slideProgress");

let progressStart = performance.now();
const SLIDE_DURATION = 8500;

function animateSlideProgress(now) {
  if (!progressBar) return;
  const elapsed = now - progressStart;
  const percent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
  progressBar.style.width = `${percent}%`;
  requestAnimationFrame(animateSlideProgress);
}
requestAnimationFrame(animateSlideProgress);

function resetSlideProgress() {
  progressStart = performance.now();
  if (progressBar) progressBar.style.width = "0%";
}

/* Reset the visual timer whenever a slide changes */
const originalRender = render;
render = function(index) {
  originalRender(index);
  resetSlideProgress();
};

/* Left CTA gets a small connected interaction instead of feeling static */
buildBtn?.addEventListener("click", () => {
  buildBtn.classList.remove("clicked");
  void buildBtn.offsetWidth;
  buildBtn.classList.add("clicked");

  const showcase = document.getElementById("cv-showcase");
  setTimeout(() => showcase?.classList.add("focus-showcase"), 120);
  setTimeout(() => showcase?.classList.remove("focus-showcase"), 1000);
});

/* Review button now cycles through a useful highlight sequence */
reviewBtn?.addEventListener("click", () => {
  const sections = ["summary", "experience", "skills", "projects"];
  sections.forEach((section, i) => {
    setTimeout(() => activate(section, null), i * 240);
  });
  setTimeout(clearHighlights, sections.length * 240 + 550);
});

/* A subtle showcase focus pulse */


/* Fast portrait loading + graceful fallback */
const fallbackPortrait = "https://i.pravatar.cc/180?img=12&v=6";
cvPhoto?.addEventListener("error", () => {
  if (!cvPhoto.dataset.fallback) {
    cvPhoto.dataset.fallback = "1";
    cvPhoto.src = fallbackPortrait;
  }
});

cvs.forEach((profile) => {
  const portrait = new Image();
  portrait.decoding = "async";
  portrait.loading = "eager";
  portrait.src = profile.photo;
});

