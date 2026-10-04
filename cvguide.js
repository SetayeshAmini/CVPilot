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
                        value: "transparent"
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



(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // ---------- Scroll reveal ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => revealObserver.observe(el));

  // ---------- Smooth links ----------
  $$(".js-scroll").forEach(link => {
    link.addEventListener("click", e => {
      const target = $(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---------- Toast ----------
  const toastEl = $("#guideToast");
  const toastText = $("#toastText");
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2300 });
  function notify(message) {
    toastText.textContent = message;
    toast.show();
  }

  // ---------- Principle cards ----------
  const principleData = {
    clear: {
      icon: "bi-eye",
      title: "Clear information wins attention.",
      text: "A recruiter should understand your target role, strongest skills and most relevant experience without searching through a wall of text.",
      pills: ["Short sections", "Strong headings", "Readable spacing"],
      stat: "01"
    },
    relevant: {
      icon: "bi-crosshair2",
      title: "Relevance beats volume.",
      text: "A CV becomes stronger when the most useful evidence for the target role is easier to find than less relevant information.",
      pills: ["Target the role", "Prioritize evidence", "Trim distractions"],
      stat: "02"
    },
    specific: {
      icon: "bi-bullseye",
      title: "Specific claims feel credible.",
      text: "Replace vague statements with actions, technologies, outcomes, scale or other concrete evidence that shows what you actually did.",
      pills: ["Action verbs", "Evidence", "Results"],
      stat: "03"
    },
    professional: {
      icon: "bi-gem",
      title: "Professional means consistent.",
      text: "Good design supports the content. Keep dates, headings, spacing, typography and links consistent so the reader can focus on your experience.",
      pills: ["One visual system", "Consistent dates", "Working links"],
      stat: "04"
    }
  };

  $$(".principle-card").forEach(card => {
    card.addEventListener("click", () => {
      const data = principleData[card.dataset.principle];
      $$(".principle-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const detail = $("#principleDetail");
      detail.classList.remove("fade-swap");
      void detail.offsetWidth;
      detail.classList.add("fade-swap");
      $(".detail-orb i").className = `bi ${data.icon}`;
      $("#principleTitle").textContent = data.title;
      $("#principleText").textContent = data.text;
      $("#principleStat").textContent = data.stat;
      $("#principlePills").innerHTML = data.pills.map(p => `<span>${p}</span>`).join("");
      notify(`Principle ${data.stat} selected — ${card.querySelector("h3").textContent}.`);
      updateGuideProgress();
    });
  });

  // ---------- CV Anatomy ----------
  const anatomyData = {
    personal: {
      count: "01 / 07", kicker: "START HERE", title: "Personal Information",
      text: "Give the reader a direct way to identify you and contact you. Keep it compact and professional.",
      do: "Use a professional email, location and relevant portfolio links.",
      dont: "Adding unnecessary personal details such as age, marital status or a full home address.",
      preview: "01", label: "PERSONAL INFO",
      previewHtml: `<div class="preview-name">MORSAL AMINI</div><div class="preview-role">Frontend Developer</div><div class="preview-contact"><span>hello@email.com</span><span>Berlin, DE</span><span>linkedin.com/in/morsal</span></div><div class="preview-highlight">Make contact details useful — not noisy.</div>`,
      exampleTitle: "Personal Information",
      example: "<strong>MORSAL AMINI</strong><br>Frontend Developer<br><br>hello@email.com · Berlin, DE · linkedin.com/in/morsal",
      tip: "Your contact block should make it effortless to reach you. Test every link before sending the CV."
    },
    summary: {
      count: "02 / 07", kicker: "YOUR POSITIONING", title: "Professional Summary",
      text: "Use two or three focused sentences to establish your target role, strongest capabilities and professional direction.",
      do: "Mention the role you are targeting and connect it to your strongest evidence.",
      dont: "Opening with empty phrases such as “hard-working” or “motivated” without proof.",
      preview: "02", label: "SUMMARY",
      previewHtml: `<div class="preview-title">Professional Summary</div><div class="preview-subtitle">FRONTEND DEVELOPER</div><div class="preview-lines"><span></span><span></span><span class="short"></span></div><div class="preview-highlight">Responsive interfaces · JavaScript · Accessible UX</div>`,
      exampleTitle: "Professional Summary",
      example: "<strong>Frontend Developer</strong><br><br>Frontend developer focused on responsive interfaces, JavaScript and accessible user experiences, with hands-on experience building practical web projects.",
      tip: "Write the summary after the rest of your CV. It is easier to summarize strong evidence than to invent generic claims."
    },
    experience: {
      count: "03 / 07", kicker: "SHOW IMPACT", title: "Experience",
      text: "Describe what you did and why it mattered. Strong bullets start with an action and add evidence.",
      do: "Use action verbs and include outcomes, scale, tools or measurable results when available.",
      dont: "Copying a job description or listing responsibilities with no evidence of contribution.",
      preview: "03", label: "EXPERIENCE",
      previewHtml: `<div class="preview-title">Experience</div><div class="preview-education"><strong>Frontend Developer — Company</strong><small>2024 — Present</small></div><div class="preview-bullet">Developed responsive interfaces with JavaScript and CSS.</div><div class="preview-bullet">Created reusable components to reduce repeated UI work.</div>`,
      exampleTitle: "Experience",
      example: "<strong>Frontend Developer — Company</strong><br>• Developed responsive interfaces with JavaScript and CSS.<br>• Reduced repeated UI work by creating reusable components.",
      tip: "If you have no formal job experience, projects, internships, freelance work and meaningful volunteering can demonstrate relevant skills."
    },
    education: {
      count: "04 / 07", kicker: "CREDENTIALS", title: "Education",
      text: "Keep education factual and easy to scan. Give more space to qualifications that are recent or relevant to the target role.",
      do: "Include degree or program, institution, dates and relevant distinctions or coursework when useful.",
      dont: "Adding long descriptions for old or unrelated education.",
      preview: "04", label: "EDUCATION",
      previewHtml: `<div class="preview-title">Education</div><div class="preview-education"><strong>B.Sc. Computer Science</strong><small>Example University · 2022 — 2026</small></div><div class="preview-lines"><span></span><span class="short"></span></div><div class="preview-highlight">Web Development · Databases · Software Engineering</div>`,
      exampleTitle: "Education",
      example: "<strong>B.Sc. Computer Science</strong><br>Example University · 2022 — 2026<br><br>Relevant: Web Development, Databases, Software Engineering",
      tip: "For recent graduates, education can sit higher on the page. As professional experience grows, it usually becomes less prominent."
    },
    skills: {
      count: "05 / 07", kicker: "PROOF > LISTS", title: "Skills",
      text: "List skills that are genuinely relevant and supported by your projects, experience or other evidence.",
      do: "Group skills logically and prioritize those that match the role.",
      dont: "Adding a huge keyword wall or rating yourself with stars and percentage bars.",
      preview: "05", label: "SKILLS",
      previewHtml: `<div class="preview-title">Skills</div><div class="preview-chips"><span>JavaScript</span><span>HTML</span><span>CSS</span><span>React</span><span>Git</span><span>Figma</span></div><div class="preview-lines"><span></span><span></span><span class="short"></span></div>`,
      exampleTitle: "Skills",
      example: "<strong>Frontend</strong> JavaScript · HTML · CSS · React<br><strong>Tools</strong> Git · GitHub · Figma<br><strong>Practices</strong> Responsive UI · Accessibility",
      tip: "A skill becomes more convincing when the reader can find where you used it elsewhere in the CV."
    },
    projects: {
      count: "06 / 07", kicker: "SHOW YOUR WORK", title: "Projects",
      text: "Projects can be powerful evidence, especially when formal work experience is limited. Explain the problem, your contribution and the technology.",
      do: "Mention your role, key technologies, meaningful functionality and outcome.",
      dont: "Writing only “Built a website” without explaining what makes the project valuable.",
      preview: "06", label: "PROJECTS",
      previewHtml: `<div class="preview-title">Projects</div><div class="preview-project"><strong>PetTrace Platform</strong><small>JavaScript · CSS · Responsive UI</small></div><div class="preview-bullet">Search, reporting and case-tracking interactions.</div><div class="preview-bullet">Responsive lost-and-found pet platform.</div>`,
      exampleTitle: "Projects",
      exampleTitle: "Projects",
      example: "<strong>PetTrace Platform</strong><br>Built a responsive lost-and-found pet platform using JavaScript and CSS, with search, reporting and case-tracking interactions.",
      tip: "Link to GitHub or a live demo when the project is public and polished enough to represent you."
    },
    languages: {
      count: "07 / 07", kicker: "COMMUNICATION", title: "Languages",
      text: "Show languages clearly using recognized levels when appropriate. Keep the format simple and honest.",
      do: "Use familiar labels such as Native, C1, B2 or conversational when accurate.",
      dont: "Using vague visual bars that imply false precision.",
      preview: "07", label: "LANGUAGES",
      previewHtml: `<div class="preview-title">Languages</div><div class="preview-language"><strong>English — C1</strong><small>Professional working proficiency</small></div><div class="preview-language"><strong>German — B2</strong><small>Independent user</small></div><div class="preview-language"><strong>Dari — Native</strong><small>Native proficiency</small></div>`,
      exampleTitle: "Languages",
      example: "<strong>English</strong> — C1<br><strong>German</strong> — B2<br><strong>Dari</strong> — Native",
      tip: "Only claim a level you can confidently demonstrate in a real conversation or professional context."
    }
  };

  function updateAnatomy(key) {
    const d = anatomyData[key];
    const card = $(".anatomy-card");
    const preview = $("#anatomyPreview");
    const previewBody = $("#previewBody");

    card.classList.remove("fade-swap");
    void card.offsetWidth;
    card.classList.add("fade-swap");

    $("#anatomyCount").textContent = d.count;
    $("#anatomyKicker").textContent = d.kicker;
    $("#anatomyTitle").textContent = d.title;
    $("#anatomyText").textContent = d.text;
    $("#anatomyDo").textContent = d.do;
    $("#anatomyDont").textContent = d.dont;
    $("#previewLabel").textContent = d.preview;
    $("#previewSectionLabel").textContent = d.label;

    previewBody.classList.add("preview-changing");
    setTimeout(() => {
      previewBody.innerHTML = d.previewHtml;
      previewBody.classList.remove("preview-changing");
    }, 120);

    preview.classList.remove("flash");
    void preview.offsetWidth;
    preview.classList.add("flash");
    notify(`${d.title} opened.`);
    updateGuideProgress();
  }

  $$(".anatomy-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".anatomy-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      updateAnatomy(tab.dataset.section);
    });
  });

  const guideModalEl = $("#guideModal");
  const guideModal = bootstrap.Modal.getOrCreateInstance(guideModalEl, { backdrop: true, keyboard: true, focus: true });
  let anatomyScrollY = 0;

  $("#anatomyExampleBtn").addEventListener("click", (event) => {
    event.preventDefault();
    const key = $(".anatomy-tab.active").dataset.section;
    const d = anatomyData[key];
    anatomyScrollY = window.scrollY;
    $("#modalTitle").textContent = d.exampleTitle || d.title;
    $("#modalText").textContent = d.text;
    $("#modalExample").innerHTML = d.example;
    $("#modalTip").textContent = d.tip;
    guideModal.show();
  });

  guideModalEl.addEventListener("shown.bs.modal", () => window.scrollTo(0, anatomyScrollY));
  guideModalEl.addEventListener("hidden.bs.modal", () => window.scrollTo(0, anatomyScrollY));

  // ---------- Mistakes ----------
  const mistakes = {
    generic: {
      badge: "NEEDS ATTENTION", title: "A generic summary says almost nothing.",
      text: "Phrases like “hard-working team player” are easy to write but give little evidence of what you can actually do.",
      fix: "Name your target role, strongest skills and the kind of problems you can solve.",
      exampleLabel: "TRY THIS",
      example: "“Frontend developer focused on responsive interfaces, JavaScript and accessible user experiences.”"
    },
    long: {
      badge: "REDUCE THE NOISE", title: "More text does not automatically mean more value.",
      text: "Dense paragraphs make useful information harder to scan. Recruiters need structure before they need detail.",
      fix: "Use short bullets, clear headings and enough whitespace to create a visual hierarchy.",
      exampleLabel: "TRY THIS",
      example: "Replace a 7-line paragraph with 3–4 bullets, each focused on one contribution."
    },
    duties: {
      badge: "SHOW IMPACT", title: "Responsibilities alone hide your contribution.",
      text: "“Responsible for building websites” tells the reader what the role involved, but not what you actually achieved.",
      fix: "Start with a strong action verb and add an outcome, scale, tool or measurable result when possible.",
      exampleLabel: "BEFORE → AFTER",
      example: "Built responsive landing pages with HTML/CSS → Developed 6 responsive landing pages and standardized reusable UI sections."
    },
    skills: {
      badge: "ADD EVIDENCE", title: "A skill list is stronger when it has proof.",
      text: "A long list can look like keyword stuffing if none of the skills appear elsewhere in your CV.",
      fix: "Prioritize relevant skills and demonstrate them through projects, experience or certifications.",
      exampleLabel: "TRY THIS",
      example: "JavaScript → JavaScript (used in PetTrace search, filtering and interactive UI components)."
    },
    errors: {
      badge: "QUALITY CHECK", title: "Small errors can weaken a polished application.",
      text: "Inconsistent dates, spelling mistakes, broken links and uneven spacing can distract from otherwise strong content.",
      fix: "Do a final content pass and a visual pass. Export to PDF and inspect the actual file you will send.",
      exampleLabel: "FINAL PASS",
      example: "Check: spelling · dates · punctuation · alignment · URLs · file name · PDF rendering."
    },
    onecv: {
      badge: "MAKE IT RELEVANT", title: "One generic CV can hide your strongest evidence.",
      text: "Different roles emphasize different skills. The strongest version of your CV makes the relevant evidence easy to find.",
      fix: "Keep a strong master CV, then adjust your summary, skills and evidence for each target role.",
      exampleLabel: "SMART EDIT",
      example: "Frontend role → emphasize UI, JavaScript and projects. Data role → emphasize Python, SQL and analytical projects."
    }
  };

  function updateMistake(key) {
    const d = mistakes[key];
    const panel = $(".mistake-detail");
    panel.classList.remove("fade-swap");
    void panel.offsetWidth;
    panel.classList.add("fade-swap");
    $("#mistakeBadge").textContent = d.badge;
    $("#mistakeTitle").textContent = d.title;
    $("#mistakeText").textContent = d.text;
    $("#mistakeFix").textContent = d.fix;
    $("#mistakeExampleLabel").textContent = d.exampleLabel;
    $("#mistakeExample").textContent = d.example;
    notify("Tip updated — keep the useful part, remove the noise.");
    updateGuideProgress();
  }
  $$(".mistake-item").forEach(item => {
    item.addEventListener("click", () => {
      $$(".mistake-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      updateMistake(item.dataset.mistake);
    });
  });

  // ---------- Before / After ----------
  const baData = {
    summary: {
      before: "“I am a hardworking person who is interested in technology and wants to grow professionally.”",
      after: "“Frontend developer building responsive, accessible interfaces with JavaScript and modern CSS, with a focus on practical user experience.”",
      beforeNote: "Too broad · little evidence · no target",
      afterNote: "Target role · skills · focus",
      tip: "A stronger summary answers: What do you do? What are you good at? Where do you create value?"
    },
    project: {
      before: "“Made a website using HTML and CSS.”",
      after: "“Developed a responsive website using HTML/CSS with mobile-friendly layouts and interactive components.”",
      beforeNote: "Basic task · no context · no value",
      afterNote: "Action · technology · outcome",
      tip: "For projects, show what you built, the technologies you used and what the result enabled."
    },
    experience: {
      before: "“Responsible for maintaining websites and helping the team with frontend tasks.”",
      after: "“Maintained responsive web interfaces and delivered reusable frontend sections that reduced repeated implementation work.”",
      beforeNote: "Duty-focused · vague",
      afterNote: "Action · contribution · result",
      tip: "Turn duties into evidence: start with an action and explain the result or contribution."
    }
  };
  $$(".ba-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".ba-toggle").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const d = baData[btn.dataset.ba];
      const card = $(".ba-card");
      card.classList.remove("fade-swap");
      void card.offsetWidth;
      card.classList.add("fade-swap");
      $("#beforeText").textContent = d.before;
      $("#afterText").textContent = d.after;
      $("#beforeNote").textContent = d.beforeNote;
      $("#afterNote").textContent = d.afterNote;
      $("#baTip").textContent = d.tip;
      updateGuideProgress();
    });
  });

  // ---------- Checklist with localStorage ----------
  const checks = $$("[data-check]");
  const savedChecks = JSON.parse(localStorage.getItem("careerPilotCVGuideChecks") || "[]");
  checks.forEach((check, index) => {
    check.checked = !!savedChecks[index];
    check.closest(".check-item").classList.toggle("done", check.checked);
    check.addEventListener("change", () => {
      check.closest(".check-item").classList.toggle("done", check.checked);
      saveChecks();
      updateScore(true);
      updateGuideProgress();
    });
  });

  function saveChecks() {
    localStorage.setItem("careerPilotCVGuideChecks", JSON.stringify(checks.map(c => c.checked)));
  }

  function updateScore(showToast = false) {
    const done = checks.filter(c => c.checked).length;
    const percent = Math.round((done / checks.length) * 100);
    $("#checkScore").textContent = `${percent}%`;
    $("#ringValue").style.strokeDashoffset = 314.159 - (314.159 * percent / 100);

    let message = "Start checking your CV.";
    if (percent >= 100) message = "Excellent — your final checklist is complete.";
    else if (percent >= 75) message = "Strong progress — finish the last few checks.";
    else if (percent >= 50) message = "Halfway there — keep tightening the details.";
    else if (percent > 0) message = "Good start — keep building the evidence.";
    $("#checkMessage").textContent = message;
    if (showToast && percent > 0) notify(`${percent}% ready — checklist progress saved.`);
  }
  updateScore(false);

  $("#resetChecklist").addEventListener("click", () => {
    checks.forEach(c => {
      c.checked = false;
      c.closest(".check-item").classList.remove("done");
    });
    saveChecks();
    updateScore(false);
    notify("Checklist reset.");
  });

  // ---------- Guide progress ----------
  function updateGuideProgress() {
    const checked = checks.filter(c => c.checked).length;
    const interactions = Math.min(
      5,
      $$(".principle-card.active").length +
      $$(".anatomy-tab.active").length +
      $$(".mistake-item.active").length +
      $$(".ba-toggle.active").length
    );
    const pct = Math.min(100, Math.round((checked / checks.length) * 70 + interactions * 6));
    $("#heroProgress").textContent = `${pct}%`;
  }
  updateGuideProgress();

  // ---------- Quick start ----------
  $("#quickStartBtn").addEventListener("click", () => {
    $("#checklist").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => notify("Your final CV checklist is ready. Tick each item as you verify it."), 650);
  });

  // ---------- Completion ----------
  $("#finishGuideBtn").addEventListener("click", () => {
    checks.forEach(c => {
      c.checked = true;
      c.closest(".check-item").classList.add("done");
    });
    saveChecks();
    updateScore(false);
    $("#heroProgress").textContent = "100%";
    notify("Guide complete — your CV is ready for a final review.");
    $("#checklist").scrollIntoView({ behavior: "smooth", block: "center" });
  });



  // ---------- Mini CV parallax ----------
  const miniCv = $("#miniCv");
  const heroVisual = $(".hero-visual");
  heroVisual.addEventListener("mousemove", e => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    miniCv.style.transform = `rotate(${3.5 + x * 3}deg) translate(${x * 8}px,${y * 8}px)`;
  });
  heroVisual.addEventListener("mouseleave", () => {
    miniCv.style.transform = "";
  });

  // Initial state
  updateAnatomy("personal");
  updateMistake("generic");
})();
