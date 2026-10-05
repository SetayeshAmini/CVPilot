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
    name: "Charistin Nekto",
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


/* =========================================================
   WHY CVPILOT INTERACTION
========================================================= */

(() => {

    const whyCards = [...document.querySelectorAll(".why-card")];

    if (!whyCards.length) return;

    const whyCounter = document.getElementById("counter");
    const whyProgress = document.getElementById("progress");

    let whyActive = 0;
    let whyTimer = null;

    function activateWhyCard(index) {

        whyActive =
            (index + whyCards.length) % whyCards.length;

        whyCards.forEach((card, i) => {
            card.classList.toggle(
                "active",
                i === whyActive
            );
        });

        if (whyCounter) {
            whyCounter.textContent =
                `${String(whyActive + 1).padStart(2, "0")} / 03`;
        }

        if (whyProgress) {
            whyProgress.style.width =
                `${((whyActive + 1) / whyCards.length) * 100}%`;
        }
    }

    function restartWhyAuto() {

        clearInterval(whyTimer);

        whyTimer = setInterval(() => {
            activateWhyCard(whyActive + 1);
        }, 5200);
    }

    whyCards.forEach((card, index) => {

        card.addEventListener("click", event => {

            if (event.target.closest(".card-button")) {
                return;
            }

            activateWhyCard(index);
            restartWhyAuto();
        });

        card.addEventListener("mousemove", event => {

            if (window.innerWidth < 901) return;

            const rect =
                card.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width - 0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height - 0.5;

            const lift =
                index === 1 ? 5 : -6;

            card.style.transform =
                `translateY(${lift}px) perspective(1000px) rotateX(${y * -1.1}deg) rotateY(${x * 1.5}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

    });

    activateWhyCard(0);
    restartWhyAuto();

})();

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
menu.classList.remove("show");        
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

document.addEventListener("DOMContentLoaded", () => {

    const cvs = [

        {
            name: "Shakiba Amini",
            role: "Frontend Developer",
            location: "Baku, Azerbaijan",
            email: "shakiba.amini@example.com",

            photo:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=90",

            summary:
                "Frontend developer focused on creating elegant, accessible and high-performing digital experiences. Combines visual design thinking with clean, scalable code.",

            job: "Frontend Developer",
            company: "North Studio · Digital Products",
            date: "2024 — Present",

            experience:
                "Built responsive interfaces for SaaS and e-commerce products, improved design-system consistency and collaborated closely with product and UX teams.",

            degree: "B.Sc. Computer Science",
            university: "Caspian Digital University",
            educationDate: "2020 — 2024",

            skills: [
                "HTML / CSS",
                "JavaScript",
                "Bootstrap",
                "React",
                "UI Systems",
                "Git"
            ],

            project: "CareerPilot",

            projectDescription:
                "Designed and developed a career platform that transforms professional information into a structured and modern CV experience."
        },


        {
            name: "Morsal Amini",
            role: "Product & UI Designer",
            location: "Remote · Europe",
            email: "morsal.amini@example.com",

            photo:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=90",

            summary:
                "Product designer passionate about turning complex workflows into clear, human-centered experiences. Works across research, interface design and visual systems.",

            job: "Product & UI Designer",
            company: "Atelier Digital · Product Team",
            date: "2023 — Present",

            experience:
                "Led interface redesigns for digital products, created reusable component libraries and translated user research into practical product improvements.",

            degree: "B.A. Digital Design",
            university: "European School of Design",
            educationDate: "2019 — 2023",

            skills: [
                "Figma",
                "UX Research",
                "Prototyping",
                "Design Systems",
                "Wireframing",
                "Branding"
            ],

            project: "Atlas Workspace",

            projectDescription:
                "Created a modular workspace interface that simplified project planning and improved information hierarchy across multiple screens."
        },


        {
            name: "Charistin Nekto",
            role: "Full-Stack Developer",
            location: "Baku, Azerbaijan",
            email: "Charistin.nek1@example.com",

            photo:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=90",

            summary:
                "Full-stack developer building reliable web applications from interface to backend. Interested in performance, architecture and polished product experiences.",

            job: "Full-Stack Developer",
            company: "Orbit Labs · Technology",
            date: "2022 — Present",

            experience:
                "Developed production web applications, designed REST APIs and optimized front-end performance while working across the complete product lifecycle.",

            degree: "B.Sc. Software Engineering",
            university: "Digital Technology Institute",
            educationDate: "2018 — 2022",

            skills: [
                "JavaScript",
                "Node.js",
                "React",
                "REST APIs",
                "MongoDB",
                "Cloud"
            ],

            project: "Orbit Commerce",

            projectDescription:
                "Built a scalable commerce platform with a responsive storefront, secure API layer and real-time order management dashboard."
        }

    ];


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const hero = document.getElementById("careerHero");
    const cv = document.getElementById("cpCv");
    const stack = document.getElementById("cpCvStack");
    const stage = document.getElementById("cpStage");

    const prev = document.getElementById("cvPrev");
    const next = document.getElementById("cvNext");

    const cards =
        document.querySelectorAll(".cp-floating-card");

    const sections =
        document.querySelectorAll(".cp-cv-section");

    const indicators =
        document.querySelectorAll(".cp-indicator");


    if (!hero || !cv || !stage) {
        return;
    }


    /* =====================================================
       FIELDS
       ===================================================== */

    const fields = {

        photo: document.getElementById("cvPhoto"),

        name: document.getElementById("cvName"),

        role: document.getElementById("cvRole"),

        location:
            document.getElementById("cvLocation"),

        email:
            document.getElementById("cvEmail"),

        summary:
            document.getElementById("cvSummary"),

        job:
            document.getElementById("cvJob"),

        company:
            document.getElementById("cvCompany"),

        date:
            document.getElementById("cvDate"),

        experience:
            document.getElementById("cvExperience"),

        degree:
            document.getElementById("cvDegree"),

        university:
            document.getElementById("cvUniversity"),

        educationDate:
            document.getElementById("cvEducationDate"),

        skills:
            document.getElementById("cvSkills"),

        project:
            document.getElementById("cvProject"),

        projectDescription:
            document.getElementById("cvProjectDescription"),

        index:
            document.getElementById("cvIndex")
    };


    /* =====================================================
       STATE
       ===================================================== */

    let currentIndex = 0;

    let isAnimating = false;

    let activeSection = "summary";

    let lockedSection = null;


    const reduceMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       SKILLS
       ===================================================== */

    function renderSkills(skills) {

        if (!fields.skills) return;

        fields.skills.innerHTML = "";

        skills.forEach(skill => {

            const item =
                document.createElement("span");

            item.className = "cp-skill";

            item.textContent = skill;

            fields.skills.appendChild(item);

        });
    }


    /* =====================================================
       INDICATORS
       ===================================================== */

    function updateIndicators() {

        indicators.forEach((indicator, index) => {

            indicator.classList.toggle(
                "active",
                index === currentIndex
            );

        });

        if (fields.index) {

            fields.index.textContent =
                String(currentIndex + 1)
                    .padStart(2, "0");

        }
    }


    /* =====================================================
       SECTION HIGHLIGHT
       ===================================================== */

    function activateSection(name) {

        activeSection = name;

        sections.forEach(section => {

            const isActive =
                section.dataset.section === name;

            section.classList.toggle(
                "is-highlighted",
                isActive
            );

            section.classList.toggle(
                "is-dimmed",
                !isActive
            );

        });


        cards.forEach(card => {

            card.classList.toggle(
                "is-active",
                card.dataset.target === name
            );

        });
    }


    /* =====================================================
       RENDER CV
       ===================================================== */

    function renderCV(index, animate = true) {

        const person = cvs[index];

        if (!person || isAnimating) {
            return;
        }

        isAnimating = true;


        if (
            animate &&
            !reduceMotion
        ) {

            cv.classList.add("is-changing");

        }


        const update = () => {

            if (fields.photo) {

                fields.photo.src =
                    person.photo;

                fields.photo.alt =
                    `${person.name} professional profile photo`;
            }


            if (fields.name)
                fields.name.textContent =
                    person.name;


            if (fields.role)
                fields.role.textContent =
                    person.role;


            if (fields.location)
                fields.location.textContent =
                    person.location;


            if (fields.email)
                fields.email.textContent =
                    person.email;


            if (fields.summary)
                fields.summary.textContent =
                    person.summary;


            if (fields.job)
                fields.job.textContent =
                    person.job;


            if (fields.company)
                fields.company.textContent =
                    person.company;


            if (fields.date)
                fields.date.textContent =
                    person.date;


            if (fields.experience)
                fields.experience.textContent =
                    person.experience;


            if (fields.degree)
                fields.degree.textContent =
                    person.degree;


            if (fields.university)
                fields.university.textContent =
                    person.university;


            if (fields.educationDate)
                fields.educationDate.textContent =
                    person.educationDate;


            if (fields.project)
                fields.project.textContent =
                    person.project;


            if (fields.projectDescription)
                fields.projectDescription.textContent =
                    person.projectDescription;


            renderSkills(person.skills);

            updateIndicators();

            activateSection(
                activeSection
            );
        };


        if (
            animate &&
            !reduceMotion
        ) {

            window.setTimeout(() => {

                update();

                cv.classList.remove(
                    "is-changing"
                );

                window.setTimeout(() => {

                    isAnimating = false;

                }, 260);

            }, 150);

        } else {

            update();

            cv.classList.remove(
                "is-changing"
            );

            isAnimating = false;
        }
    }


    /* =====================================================
       CHANGE CV
       ===================================================== */

    function changeCV(direction) {

        if (isAnimating) {
            return;
        }

        currentIndex += direction;


        if (currentIndex < 0) {

            currentIndex =
                cvs.length - 1;
        }


        if (currentIndex >= cvs.length) {

            currentIndex = 0;
        }


        renderCV(
            currentIndex,
            true
        );
    }


    /* =====================================================
       ARROWS
       ===================================================== */

    if (prev) {

        prev.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                changeCV(-1);
            }
        );
    }


    if (next) {

        next.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                changeCV(1);
            }
        );
    }


    /* =====================================================
       INDICATORS
       ===================================================== */

    indicators.forEach(indicator => {

        indicator.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const index =
                    Number(
                        indicator.dataset.index
                    );

                if (
                    index === currentIndex ||
                    isAnimating
                ) {
                    return;
                }

                currentIndex = index;

                renderCV(
                    currentIndex,
                    true
                );
            }
        );

    });


    /* =====================================================
       FLOATING CARDS
       ===================================================== */

    cards.forEach(card => {

        const target =
            card.dataset.target;


        card.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                lockedSection = target;

                activateSection(
                    target
                );
            }
        );


        card.addEventListener(
            "mouseenter",
            () => {

                if (!lockedSection) {

                    activateSection(
                        target
                    );
                }
            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                if (!lockedSection) {

                    activateSection(
                        activeSection
                    );
                }
            }
        );

    });


    /* =====================================================
       CV SECTIONS
       ===================================================== */

    sections.forEach(section => {

        const target =
            section.dataset.section;


        section.addEventListener(
            "click",
            event => {

                event.preventDefault();

                lockedSection = target;

                activateSection(
                    target
                );
            }
        );


        section.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    lockedSection = target;

                    activateSection(
                        target
                    );
                }
            }
        );

    });


    /* =====================================================
       INITIAL
       ===================================================== */

    renderCV(
        0,
        false
    );

    activateSection(
        "summary"
    );


    /* =====================================================
       PARALLAX
       IMPORTANT:
       CSS VARIABLES ONLY
       so CV rotation remains intact.
       ===================================================== */

    if (
        !reduceMotion &&
        window.matchMedia("(pointer:fine)").matches
    ) {

        let targetX = 0;
        let targetY = 0;

        let currentX = 0;
        let currentY = 0;

        let animationFrame = null;


        function animateParallax() {

            currentX +=
                (targetX - currentX) * .07;

            currentY +=
                (targetY - currentY) * .07;


            stack.style.setProperty(
                "--cp-parallax-x",
                `${currentX * -4}px`
            );


            stack.style.setProperty(
                "--cp-parallax-y",
                `${currentY * -3}px`
            );


            cards.forEach(
                (card, index) => {

                    const amount =
                        1.1 +
                        index * .25;

                    card.style.setProperty(
                        "--card-x",
                        `${currentX * amount}px`
                    );

                    card.style.setProperty(
                        "--card-y",
                        `${currentY * amount}px`
                    );

                }
            );


            animationFrame =
                requestAnimationFrame(
                    animateParallax
                );
        }


        stage.addEventListener(
            "pointermove",
            event => {

                const rect =
                    stage.getBoundingClientRect();


                targetX =
                    (
                        (event.clientX - rect.left) /
                        rect.width
                        - .5
                    ) * 2;


                targetY =
                    (
                        (event.clientY - rect.top) /
                        rect.height
                        - .5
                    ) * 2;


                if (!animationFrame) {

                    animationFrame =
                        requestAnimationFrame(
                            animateParallax
                        );
                }
            },
            { passive: true }
        );


        stage.addEventListener(
            "pointerleave",
            () => {

                targetX = 0;
                targetY = 0;
            }
        );

    }


    /* =====================================================
       KEYBOARD
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            const active =
                document.activeElement;


            if (
                active &&
                (
                    active.tagName === "INPUT" ||
                    active.tagName === "TEXTAREA"
                )
            ) {
                return;
            }


            if (
                event.key === "ArrowRight"
            ) {

                changeCV(1);
            }


            if (
                event.key === "ArrowLeft"
            ) {

                changeCV(-1);
            }

        }
    );


    /* =====================================================
       TOUCH SWIPE
       ===================================================== */

    let touchStartX = 0;


    cv.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


    cv.addEventListener(
        "touchend",
        event => {

            const endX =
                event.changedTouches[0]
                    .screenX;


            const distance =
                endX - touchStartX;


            if (
                Math.abs(distance) < 45
            ) {
                return;
            }


            if (distance < 0) {

                changeCV(1);

            } else {

                changeCV(-1);
            }

        },
        {
            passive: true
        }
    );

});







document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".why-card");

  if (!cards.length) return;


  /* ==============================
     CARD 3D HOVER
  ============================== */

  cards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

      if (window.innerWidth <= 820) return;

      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateX =
        ((y / rect.height) - 0.5) * -2;

      const rotateY =
        ((x / rect.width) - 0.5) * 2;

      card.style.transform =
        `translateY(-7px)
         perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;
    });


    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

  });


  /* ==============================
     BUTTON INTERACTION
  ============================== */

  const buttons =
    document.querySelectorAll(".why-card__button");

  buttons.forEach((button) => {

    button.addEventListener("click", (event) => {

      event.preventDefault();

      const card =
        button.closest(".why-card");

      if (!card) return;

      card.classList.add("is-active");

      setTimeout(() => {
        card.classList.remove("is-active");
      }, 450);

    });

  });


  /* ==============================
     TOUCH SAFETY
  ============================== */

  if ("ontouchstart" in window) {

    cards.forEach((card) => {

      card.addEventListener("touchstart", () => {
        card.style.transform =
          "translateY(-4px)";
      }, { passive: true });

      card.addEventListener("touchend", () => {
        card.style.transform = "";
      }, { passive: true });

    });

  }

});





document.addEventListener("DOMContentLoaded", () => {

  const section =
    document.querySelector("#how-cvpolit");

  if (!section) return;


  /* =====================================================
     ELEMENTS
  ===================================================== */

  const steps =
    [...section.querySelectorAll(".how-step")];

  const progress =
    section.querySelector(
      ".how-step-line__fill"
    );

  const image =
    section.querySelector("#how-image");

  const visualNumber =
    section.querySelector("#visual-number");

  const visualLabel =
    section.querySelector("#visual-label");

  const visualMini =
    section.querySelector("#visual-mini");

  const visualStatus =
    section.querySelector("#visual-status");

  const counterCurrent =
    section.querySelector("#counter-current");

  const contentNumber =
    section.querySelector("#content-number");

  const contentStatus =
    section.querySelector("#content-status");

  const title =
    section.querySelector("#how-title");

  const description =
    section.querySelector("#how-description");

  const features =
    section.querySelector("#how-features");

  const nextButton =
    section.querySelector("#how-next");

  const backButton =
    section.querySelector("#how-back");

  const nextText =
    section.querySelector("#next-text");

  const content =
    section.querySelector(".how-content");

  const visual =
    section.querySelector(".how-visual");


  /* =====================================================
     DATA
  ===================================================== */

  const data = [

    {
      number: "01",
      title: "Build your CV",
      status: "START HERE",

      visualStatus: "BUILDING",
      label: "BUILD YOUR CV",
      mini: "YOUR FOUNDATION",

      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",

      description:
        "Start with your experience, skills and goals. CVPolit helps you organize everything into a clear, professional CV without unnecessary complexity.",

      features: [
        [
          "01",
          "Simple structure",
          "Organize your experience clearly."
        ],
        [
          "02",
          "Professional presentation",
          "Turn information into a polished profile."
        ],
        [
          "03",
          "Built around you",
          "Highlight what makes you different."
        ]
      ]
    },


    {
      number: "02",
      title: "Review your CV",
      status: "CHECK YOUR WORK",

      visualStatus: "REVIEWING",
      label: "REVIEW YOUR CV",
      mini: "SEE WHAT MATTERS",

      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85",

      description:
        "Take a closer look at your CV before moving forward. Review your content, structure and presentation so every important detail has its place.",

      features: [
        [
          "01",
          "Clear content",
          "Make every section easier to understand."
        ],
        [
          "02",
          "Stronger structure",
          "Find areas that need more clarity."
        ],
        [
          "03",
          "Better first impression",
          "See your CV from a recruiter's perspective."
        ]
      ]
    },


    {
      number: "03",
      title: "Improve your profile",
      status: "READY TO GROW",

      visualStatus: "IMPROVING",
      label: "IMPROVE YOUR PROFILE",
      mini: "MOVE FORWARD",

      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85",

      description:
        "Turn what you discovered into progress. Refine the way you present your skills and experience and build a profile that feels ready for what's next.",

      features: [
        [
          "01",
          "Refine your story",
          "Highlight the experience that matters most."
        ],
        [
          "02",
          "Increase your impact",
          "Make your strengths easier to recognize."
        ],
        [
          "03",
          "Move forward",
          "Finish with a profile you can feel confident about."
        ]
      ]
    }

  ];


  /* =====================================================
     STATE
  ===================================================== */

  let currentStep = 0;
  let locked = false;
  let autoTimer;


  /* =====================================================
     PRELOAD
  ===================================================== */

  data.forEach(item => {

    const img = new Image();

    img.src = item.image;

  });


  /* =====================================================
     FEATURES
  ===================================================== */

  function renderFeatures(items) {

    features.innerHTML =
      items.map(item => `

        <div class="how-feature">

          <span class="how-feature__number">
            ${item[0]}
          </span>

          <div>

            <strong>
              ${item[1]}
            </strong>

            <p>
              ${item[2]}
            </p>

          </div>

        </div>

      `).join("");

  }


  /* =====================================================
     PROGRESS LINE
  ===================================================== */

  function updateProgress(index) {

    /*
      01 = 0%
      02 = 50%
      03 = 100%
    */

    const percentage =
      (index / (data.length - 1)) * 100;


    if (
      window.innerWidth <= 760
    ) {

      progress.style.width = "2px";

      progress.style.height =
        `${percentage}%`;

    } else {

      progress.style.height = "2px";

      progress.style.width =
        `${percentage}%`;

    }

  }


  /* =====================================================
     CHANGE STEP
  ===================================================== */

  function changeStep(index) {

    if (
      locked ||
      index === currentStep ||
      !data[index]
    ) return;


    locked = true;

    const item = data[index];


    content.classList.add(
      "is-changing"
    );

    visual.classList.add(
      "is-changing"
    );


    setTimeout(() => {


      /* STEP ACTIVE */

      steps.forEach((step, i) => {

        step.classList.toggle(
          "is-active",
          i === index
        );

      });


      /* CONTENT */

      title.textContent =
        item.title;

      description.textContent =
        item.description;


      /* NUMBERS */

      contentNumber.textContent =
        item.number;

      counterCurrent.textContent =
        item.number;

      visualNumber.textContent =
        item.number;


      /* STATUS */

      contentStatus.textContent =
        item.status;

      visualStatus.textContent =
        item.visualStatus;

      visualLabel.textContent =
        item.label;

      visualMini.textContent =
        item.mini;


      /* IMAGE */

      image.style.opacity = "0";

      image.style.transform =
        "scale(1.08)";


      setTimeout(() => {

        image.src =
          item.image;

        image.alt =
          item.title;


        image.onload = () => {

          image.style.opacity = "1";

          image.style.transform =
            "scale(1.03)";

        };

      }, 120);


      /* FEATURES */

      renderFeatures(
        item.features
      );


      /* LINE */

      updateProgress(index);


      /* BUTTON */

      nextText.textContent =
        index === data.length - 1
          ? "Back to Start"
          : "Continue";


      currentStep = index;


      setTimeout(() => {

        content.classList.remove(
          "is-changing"
        );

        visual.classList.remove(
          "is-changing"
        );

      }, 50);


      setTimeout(() => {

        locked = false;

      }, 420);


    }, 250);

  }


  /* =====================================================
     STEP CLICK
  ===================================================== */

  steps.forEach((step, index) => {

    step.addEventListener(
      "click",
      () => {

        changeStep(index);

        restartAuto();

      }
    );

  });


  /* =====================================================
     NEXT
  ===================================================== */

  nextButton.addEventListener(
    "click",
    () => {

      const next =
        currentStep <
        data.length - 1

          ? currentStep + 1

          : 0;

      changeStep(next);

      restartAuto();

    }
  );


  /* =====================================================
     BACK
  ===================================================== */

  backButton.addEventListener(
    "click",
    () => {

      const previous =
        currentStep > 0

          ? currentStep - 1

          : data.length - 1;

      changeStep(previous);

      restartAuto();

    }
  );


  /* =====================================================
     KEYBOARD
  ===================================================== */

  section.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown"
      ) {

        event.preventDefault();

        changeStep(
          (currentStep + 1) %
          data.length
        );

      }


      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
      ) {

        event.preventDefault();

        changeStep(
          (currentStep - 1 +
            data.length) %
          data.length
        );

      }

    }
  );


  /* =====================================================
     AUTO PLAY
  ===================================================== */

  function startAuto() {

    clearInterval(autoTimer);

    autoTimer =
      setInterval(() => {

        if (
          document.hidden ||
          locked
        ) return;

        changeStep(
          (currentStep + 1) %
          data.length
        );

      }, 6500);

  }


  function restartAuto() {

    clearInterval(autoTimer);

    startAuto();

  }


  section.addEventListener(
    "mouseenter",
    () => clearInterval(autoTimer)
  );


  section.addEventListener(
    "mouseleave",
    () => startAuto()
  );


  /* =====================================================
     RESIZE
  ===================================================== */

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(resizeTimer);

      resizeTimer =
        setTimeout(() => {

          updateProgress(
            currentStep
          );

        }, 150);

    }
  );


  /* =====================================================
     INITIAL
  ===================================================== */

  renderFeatures(
    data[0].features
  );

  updateProgress(0);

  startAuto();

});





document.addEventListener("DOMContentLoaded", () => {

  const section =
    document.querySelector("#cvAnatomy");

  if (!section) return;


  /* =======================================================
     ELEMENTS
     ======================================================= */

  const items = [
    ...section.querySelectorAll(
      ".cv-anatomy-item"
    )
  ];

  const parts = [
    ...section.querySelectorAll(
      ".cv-part"
    )
  ];

  const paperScroll =
    section.querySelector(
      "#cvPaperScroll"
    );

  const infoTitle =
    section.querySelector(
      "#cvInfoTitle"
    );

  const infoDescription =
    section.querySelector(
      "#cvInfoDescription"
    );

  const infoNumber =
    section.querySelector(
      "#cvInfoNumber"
    );

  const infoStatus =
    section.querySelector(
      "#cvInfoStatus"
    );

  const infoTip =
    section.querySelector(
      "#cvInfoTip"
    );

  const progress =
    section.querySelector(
      "#cvProgress"
    );


  /* =======================================================
     DATA
     ======================================================= */

  const anatomy = [

    {
      title: "Header & Profile",

      status: "FOUNDATION",

      description:
        "Start with the information employers need immediately: your name, professional title and contact details. Make your professional identity clear before the reader reaches the rest of your CV.",

      tip:
        "Make your professional identity clear within seconds."
    },


    {
      title: "Professional Summary",

      status: "POSITIONING",

      description:
        "Use this short introduction to connect your experience with your career direction. Focus on your strongest professional qualities instead of repeating everything already listed in your CV.",

      tip:
        "Show your value before the reader reaches your experience."
    },


    {
      title: "Experience",

      status: "PROOF",

      description:
        "Your experience demonstrates what you have actually done. Focus on responsibilities, achievements and measurable outcomes instead of simply listing job duties.",

      tip:
        "Turn responsibilities into evidence of your professional impact."
    },


    {
      title: "Skills",

      status: "CAPABILITY",

      description:
        "Choose skills that are relevant to the position you want. Combine technical abilities with professional strengths and avoid generic skills that do not support your story.",

      tip:
        "Show the capabilities that directly support your target role."
    },


    {
      title: "Education",

      status: "FOUNDATION",

      description:
        "Education gives context to your professional background. Include your relevant degree, institution and dates, especially when the qualification supports the role you are targeting.",

      tip:
        "Use education to reinforce your professional foundation."
    },


    {
      title: "Impact",

      status: "DIFFERENTIATION",

      description:
        "Impact makes your CV more memorable. Show how your work created value through improvements, measurable results, successful projects, growth or meaningful outcomes.",

      tip:
        "Replace generic claims with evidence of what changed because of you."
    }

  ];


  /* =======================================================
     STATE
     ======================================================= */

  let current = 0;

  let timer = null;


  /* =======================================================
     SCROLL CV TO SELECTED PART
     ======================================================= */

  function scrollToPart(part) {

    if (!paperScroll || !part) {
      return;
    }


    const paperRect =
      paperScroll.getBoundingClientRect();

    const partRect =
      part.getBoundingClientRect();


    const currentScroll =
      paperScroll.scrollTop;


    const partTop =
      partRect.top
      - paperRect.top
      + currentScroll;


    const partHeight =
      part.offsetHeight;


    /*
      Put selected CV section
      around the vertical center
      of the CV paper.
    */

    const targetScroll =
      partTop
      -
      (
        paperScroll.clientHeight / 2
      )
      +
      (
        partHeight / 2
      );


    const maxScroll =
      paperScroll.scrollHeight
      -
      paperScroll.clientHeight;


    const finalScroll =
      Math.max(
        0,
        Math.min(
          targetScroll,
          maxScroll
        )
      );


    paperScroll.scrollTo({

      top: finalScroll,

      behavior: "smooth"

    });

  }


  /* =======================================================
     ACTIVATE SECTION
     ======================================================= */

  function activate(
    index,
    animate = true
  ) {

    const item =
      items[index];

    const data =
      anatomy[index];


    if (!item || !data) {
      return;
    }


    current = index;


    /* ---------------------------------------------
       ACTIVE BUTTON
       --------------------------------------------- */

    items.forEach(button => {

      button.classList.toggle(
        "active",
        button === item
      );

    });


    /* ---------------------------------------------
       REMOVE OLD CV HIGHLIGHT
       --------------------------------------------- */

    parts.forEach(part => {

      part.classList.remove(
        "active-highlight"
      );

    });


    /* ---------------------------------------------
       FIND TARGET CV PART
       --------------------------------------------- */

    const target =
      section.querySelector(
        "#" + item.dataset.target
      );


    if (target) {

      target.classList.add(
        "active-highlight"
      );


      /*
        Wait one frame so browser
        knows the active element position.
      */

      requestAnimationFrame(() => {

        scrollToPart(target);

      });


      /* -------------------------------------------
         ACTIVE ANIMATION
         ------------------------------------------- */

      if (animate) {

        target.animate(

          [
            {
              opacity: .35,

              transform:
                "translateX(-8px) scale(.985)"
            },

            {
              opacity: 1,

              transform:
                "translateX(3px) scale(1)"
            }

          ],

          {
            duration: 430,

            easing:
              "cubic-bezier(.2,.8,.2,1)"
          }

        );

      }

    }


    /* =================================================
       INFO PANEL
       ================================================= */

    const panel =
      section.querySelector(
        ".cv-info-panel"
      );


    if (
      animate &&
      panel
    ) {

      panel.animate(

        [
          {
            opacity: .3,

            transform:
              "translateY(7px)"
          },

          {
            opacity: 1,

            transform:
              "translateY(0)"
          }

        ],

        {
          duration: 330,

          easing:
            "cubic-bezier(.2,.8,.2,1)"
        }

      );

    }


    /* =================================================
       UPDATE INFORMATION
       ================================================= */

    infoNumber.textContent =
      String(index + 1)
      .padStart(2, "0");


    infoTitle.textContent =
      data.title;


    infoStatus.textContent =
      data.status;


    infoDescription.textContent =
      data.description;


    infoTip.textContent =
      data.tip;


    /* =================================================
       UPDATE PROGRESS
       ================================================= */

    progress.style.width =
      (
        ((index + 1) /
        anatomy.length) * 100
      ) + "%";

  }


  /* =======================================================
     CLICK EVENTS
     ======================================================= */

  items.forEach(
    (item, index) => {

      item.addEventListener(
        "click",
        () => {

          activate(index);

          restartAuto();

        }
      );

    }
  );


  /* =======================================================
     KEYBOARD NAVIGATION
     ======================================================= */

  section.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft"
      ) {

        return;

      }


      event.preventDefault();


      if (
        event.key === "ArrowRight"
      ) {

        current =
          (
            current + 1
          )
          %
          anatomy.length;

      } else {

        current =
          (
            current - 1
            + anatomy.length
          )
          %
          anatomy.length;

      }


      activate(current);

      restartAuto();

    }
  );


  /* =======================================================
     AUTO PLAY
     ======================================================= */

  function startAuto() {

    clearInterval(timer);


    timer =
      setInterval(
        () => {

          current =
            (
              current + 1
            )
            %
            anatomy.length;


          activate(current);

        },
        5000
      );

  }


  function restartAuto() {

    clearInterval(timer);

    startAuto();

  }


  /* =======================================================
     PAUSE ON HOVER
     ======================================================= */

  section.addEventListener(
    "mouseenter",
    () => {

      clearInterval(timer);

    }
  );


  section.addEventListener(
    "mouseleave",
    () => {

      startAuto();

    }
  );


  /* =======================================================
     START
     ======================================================= */

  activate(
    0,
    false
  );

  startAuto();

});





document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector("#cpCtaFinal");

    if (!section) return;


    /* ------------------------------------------
       Reveal
       ------------------------------------------ */

    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    section.classList.add("is-visible");

                    observer.unobserve(section);
                }

            });

        },
        {
            threshold: 0.18
        }
    );

    observer.observe(section);


    /* ------------------------------------------
       Button hover
       ------------------------------------------ */

    const buttons = section.querySelectorAll(
        ".cp-cta-btn"
    );

    buttons.forEach(function (button) {

        const icon = button.querySelector("i");

        button.addEventListener(
            "mouseenter",
            function () {

                if (icon) {
                    icon.style.transform =
                        "translateX(4px)";
                }

            }
        );

        button.addEventListener(
            "mouseleave",
            function () {

                if (icon) {
                    icon.style.transform = "";
                }

            }
        );


        /* Prevent # jump */
        if (
            button.getAttribute("href") === "#"
        ) {

            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                }
            );

        }

    });


    /* ------------------------------------------
       Small CV preview interaction
       ------------------------------------------ */

    const preview =
        section.querySelector(
            ".cp-cta-preview"
        );

    if (preview) {

        preview.addEventListener(
            "mouseenter",
            function () {

                preview.style.transform =
                    "rotate(0deg) translateY(-5px)";

            }
        );

        preview.addEventListener(
            "mouseleave",
            function () {

                preview.style.transform =
                    "rotate(1.3deg)";

            }
        );

    }

});














/* =========================================================
   CVPILOT PREMIUM LOADER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("cvpilotLoader");

    const letters = document.querySelectorAll(
        ".loader-logo span"
    );

    if (!loader) return;


    /* =========================
       LETTER REVEAL
    ========================= */

    letters.forEach((letter, index) => {

        setTimeout(() => {

            letter.classList.add("show");

        }, 120 + (index * 90));

    });


    /* =========================
       HIDE LOADER
    ========================= */

    setTimeout(() => {

        loader.classList.add("loaded");

    }, 1200);

});