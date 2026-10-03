/* =========================================================
   CVPILOT — BUILD CV PAGE LOGIC
   Scoped to cp-build-* elements only.
   Does not touch Navbar (#mainNavbar) or global app.js logic.
========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONSTANTS
    ===================================================== */

    const STORAGE_KEY = "cvpilot.buildcv.data.v1";
    const SAVE_DEBOUNCE_MS = 500;

    const SECTION_ORDER = [
        "personal",
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "languages"
    ];

    const EXPERIENCE_TEMPLATE = {
        id: "",
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: ""
    };

    const EDUCATION_TEMPLATE = {
        id: "",
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        description: ""
    };

    const PROJECT_TEMPLATE = {
        id: "",
        name: "",
        description: "",
        technologies: "",
        github: "",
        live: ""
    };

    const LANGUAGE_TEMPLATE = {
        id: "",
        name: "",
        level: "Intermediate"
    };

    const LANGUAGE_LEVELS = [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Fluent",
        "Native"
    ];

    const FIELD_WEIGHTS = {
        fullName: 1,
        title: 1,
        email: 1,
        phone: 0.5,
        location: 0.5,
        linkedin: 0.5,
        github: 0.5,
        summary: 2,
        experience: 3,
        education: 2,
        skills: 2,
        projects: 2,
        languages: 1
    };


    /* =====================================================
       LOCAL SUGGESTION DATASETS
    ===================================================== */

    const LANGUAGE_SUGGESTIONS = [
        "English", "German", "Dari", "Pashto", "Persian", "Farsi",
        "Arabic", "French", "Spanish", "Italian", "Portuguese",
        "Dutch", "Russian", "Ukrainian", "Polish", "Turkish",
        "Hindi", "Urdu", "Bengali", "Chinese (Mandarin)",
        "Japanese", "Korean", "Vietnamese", "Thai",
        "Swedish", "Norwegian", "Danish", "Finnish",
        "Greek", "Hebrew", "Czech", "Romanian", "Hungarian",
        "Indonesian", "Malay", "Swahili", "Amharic", "Kurdish",
        "Azerbaijani", "Uzbek", "Tajik", "Kazakh"
    ];

    const SKILL_SUGGESTIONS = [
        "HTML", "CSS", "JavaScript", "TypeScript", "Sass", "Less",
        "Bootstrap", "Tailwind CSS", "jQuery",
        "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt",
        "Node.js", "Express", "NestJS",
        "Python", "Django", "Flask", "FastAPI",
        "Java", "Spring Boot",
        "C", "C++", "C#", ".NET",
        "PHP", "Laravel", "Ruby", "Ruby on Rails",
        "Go", "Rust", "Kotlin", "Swift", "Dart", "Flutter",
        "SQL", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Redis",
        "GraphQL", "REST API", "Firebase",
        "Git", "GitHub", "GitLab", "Bitbucket",
        "Docker", "Kubernetes", "Linux", "Bash",
        "CI/CD", "Jenkins", "Nginx",
        "Figma", "Adobe XD", "Photoshop", "Illustrator",
        "UI Design", "UX Design", "Wireframing", "Prototyping",
        "Data Analysis", "Pandas", "NumPy", "Machine Learning",
        "Deep Learning", "TensorFlow", "PyTorch",
        "Communication", "Teamwork", "Problem Solving",
        "Time Management", "Leadership", "Critical Thinking",
        "Adaptability", "Creativity", "Attention to Detail"
    ];

    const TECH_SUGGESTIONS = [
        "React", "React Native", "Next.js", "Vue", "Nuxt", "Angular", "Svelte",
        "JavaScript", "TypeScript", "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap",
        "Node.js", "Express", "NestJS",
        "Python", "Django", "Flask", "FastAPI",
        "Java", "Spring Boot", "Kotlin",
        "C", "C++", "C#", ".NET",
        "PHP", "Laravel", "Ruby on Rails", "Go", "Rust",
        "Swift", "Flutter", "Dart",
        "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis",
        "GraphQL", "REST API", "Firebase", "Supabase",
        "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "CI/CD",
        "AWS", "Azure", "Google Cloud", "Vercel", "Netlify",
        "Figma", "Photoshop", "Illustrator"
    ];


    /* =====================================================
       STATE
    ===================================================== */

    const state = {
        personal: {
            fullName: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: ""
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
        languages: []
    };

    let saveTimer = null;
    let lastFocusedSection = "personal";


    /* =====================================================
       HELPERS
    ===================================================== */

    function $(sel, root) {
        return (root || document).querySelector(sel);
    }

    function $$(sel, root) {
        return Array.from((root || document).querySelectorAll(sel));
    }

    function uid() {
        return "cp_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
    }

    function escapeHtml(str) {
        if (str == null) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function isNonEmpty(v) {
        return typeof v === "string" && v.trim().length > 0;
    }

    function formatMonth(str) {
        if (!str) return "";
        const parts = String(str).split("-");
        if (parts.length < 2) return str;
        const year = parts[0];
        const month = parseInt(parts[1], 10);
        if (isNaN(month) || month < 1 || month > 12) return str;
        const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return names[month - 1] + " " + year;
    }

    function formatRange(start, end) {
        const s = formatMonth(start);
        const e = formatMonth(end);
        if (!s && !e) return "";
        if (s && !e) return s + " — Present";
        if (!s && e) return e;
        return s + " — " + e;
    }

    function debounce(fn, ms) {
        let t = null;
        return function () {
            const args = arguments;
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), ms);
        };
    }


    /* =====================================================
       DOM CACHE
    ===================================================== */

    const dom = {};

    function cacheDom() {
        dom.page = $("#cpBuildPage");

        dom.personal = {
            fullName: $("#cpBuildFullName"),
            title: $("#cpBuildTitle"),
            email: $("#cpBuildEmail"),
            phone: $("#cpBuildPhone"),
            location: $("#cpBuildLocation"),
            linkedin: $("#cpBuildLinkedin"),
            github: $("#cpBuildGithub")
        };

        dom.summary = $("#cpBuildSummary");
        dom.summaryCount = $("#cpBuildSummaryCount");

        dom.experienceList = $("#cpBuildExperienceList");
        dom.educationList = $("#cpBuildEducationList");
        dom.projectsList = $("#cpBuildProjectsList");
        dom.languagesList = $("#cpBuildLanguagesList");

        dom.skillInput = $("#cpBuildSkillInput");
        dom.skillAddBtn = $("#cpBuildSkillAdd");
        dom.skillsTags = $("#cpBuildSkillsTags");
        dom.skillSuggest = $("#cpBuildSkillSuggest");

        dom.progressRing = $("#cpBuildProgressRing");
        dom.progressRingLabel = $("#cpBuildProgressRingLabel");
        dom.progressBarFill = $("#cpBuildProgressBarFill");
        dom.progressBar = $("#cpBuildProgressBar");
        dom.progressPercentText = $("#cpBuildProgressPercentText");
        dom.progressNote = $("#cpBuildProgressNote");
        dom.saveStatus = $("#cpBuildSaveStatus");

        dom.cvName = $("#cpBuildCvName");
        dom.cvTitle = $("#cpBuildCvTitle");
        dom.cvContact = $("#cpBuildCvContact");
        dom.cvSummary = $("#cpBuildCvSummary");
        dom.cvExperience = $("#cpBuildCvExperience");
        dom.cvEducation = $("#cpBuildCvEducation");
        dom.cvSkills = $("#cpBuildCvSkills");
        dom.cvProjects = $("#cpBuildCvProjects");
        dom.cvLanguages = $("#cpBuildCvLanguages");

        dom.navList = $("#cpBuildNavList");

        dom.sections = {};
        SECTION_ORDER.forEach(key => {
            dom.sections[key] = $("#cpBuildSection" + key.charAt(0).toUpperCase() + key.slice(1));
        });

        dom.addButtons = {
            experience: document.querySelector('[data-cp-build-add="experience"]'),
            education: document.querySelector('[data-cp-build-add="education"]'),
            projects: document.querySelector('[data-cp-build-add="projects"]'),
            languages: document.querySelector('[data-cp-build-add="languages"]')
        };

        dom.emptyStates = {
            experience: document.querySelector('[data-cp-build-empty="experience"]'),
            education: document.querySelector('[data-cp-build-empty="education"]'),
            skills: document.querySelector('[data-cp-build-empty="skills"]'),
            projects: document.querySelector('[data-cp-build-empty="projects"]'),
            languages: document.querySelector('[data-cp-build-empty="languages"]')
        };

        dom.confirmModal = $("#cpBuildConfirmModal");
        dom.confirmClear = $("#cpBuildConfirmClear");
        dom.clearAllBtn = $("#cpBuildClearAll");

        dom.printBtn = $("#cpBuildPrint");
        dom.downloadBtn = $("#cpBuildDownload");

        dom.mobileToggleButtons = $$(".cp-build-mobile-toggle-btn");
    }


    /* =====================================================
       STORAGE
    ===================================================== */

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;

            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") return;

            if (parsed.personal && typeof parsed.personal === "object") {
                Object.keys(state.personal).forEach(k => {
                    if (typeof parsed.personal[k] === "string") {
                        state.personal[k] = parsed.personal[k];
                    }
                });
            }
            if (typeof parsed.summary === "string") {
                state.summary = parsed.summary;
            }
            if (Array.isArray(parsed.experience)) {
                state.experience = parsed.experience.filter(Boolean).map(e => ({
                    ...EXPERIENCE_TEMPLATE,
                    ...e,
                    id: e.id || uid()
                }));
            }
            if (Array.isArray(parsed.education)) {
                state.education = parsed.education.filter(Boolean).map(e => ({
                    ...EDUCATION_TEMPLATE,
                    ...e,
                    id: e.id || uid()
                }));
            }
            if (Array.isArray(parsed.skills)) {
                state.skills = parsed.skills.filter(s => typeof s === "string" && s.trim());
            }
            if (Array.isArray(parsed.projects)) {
                state.projects = parsed.projects.filter(Boolean).map(p => ({
                    ...PROJECT_TEMPLATE,
                    ...p,
                    id: p.id || uid()
                }));
            }
            if (Array.isArray(parsed.languages)) {
                state.languages = parsed.languages.filter(Boolean).map(l => ({
                    ...LANGUAGE_TEMPLATE,
                    ...l,
                    id: l.id || uid()
                }));
            }
        } catch (err) {
            console.warn("Build CV: failed to load saved data.", err);
        }
    }

    const saveState = debounce(function () {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            showSaveStatus();
        } catch (err) {
            console.warn("Build CV: failed to save data.", err);
        }
    }, SAVE_DEBOUNCE_MS);

    function showSaveStatus() {
        if (!dom.saveStatus) return;
        dom.saveStatus.textContent = "✓ Saved locally";
        dom.saveStatus.classList.add("is-visible");
        clearTimeout(dom.saveStatus._t);
        dom.saveStatus._t = setTimeout(() => {
            dom.saveStatus.classList.remove("is-visible");
        }, 2200);
    }


    /* =====================================================
       PERSONAL FIELDS
    ===================================================== */

    function bindPersonalFields() {
        Object.keys(dom.personal).forEach(key => {
            const input = dom.personal[key];
            if (!input) return;

            input.value = state.personal[key] || "";

            input.addEventListener("input", () => {
                state.personal[key] = input.value;
                clearFieldError(input);
                updatePreview();
                updateProgress();
                updateNavStates();
                saveState();
            });

            input.addEventListener("blur", () => {
                validatePersonalField(key);
            });
        });
    }

    function validatePersonalField(key) {
        const input = dom.personal[key];
        if (!input) return true;

        let valid = true;
        let message = "";
        const value = (input.value || "").trim();

        if (key === "fullName" && !value) {
            valid = false;
            message = "Full name is required.";
        }
        if (key === "title" && !value) {
            valid = false;
            message = "Professional title is required.";
        }
        if (key === "email") {
            if (!value) {
                valid = false;
                message = "Email is required.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
                valid = false;
                message = "Please enter a valid email address.";
            }
        }

        if (!valid) showFieldError(input, message);
        else clearFieldError(input);

        return valid;
    }

    function showFieldError(input, message) {
        const wrap = input.closest(".cp-build-field");
        if (!wrap) return;

        const errEl = wrap.querySelector(".cp-build-field-error");
        if (errEl) errEl.textContent = message;

        wrap.classList.add("has-error");
    }

    function clearFieldError(input) {
        const wrap = input.closest(".cp-build-field");
        if (!wrap) return;
        wrap.classList.remove("has-error");
        const errEl = wrap.querySelector(".cp-build-field-error");
        if (errEl) errEl.textContent = "";
    }


    /* =====================================================
       SUMMARY
    ===================================================== */

    function bindSummary() {
        if (!dom.summary) return;

        dom.summary.value = state.summary || "";
        updateSummaryCount();

        dom.summary.addEventListener("input", () => {
            state.summary = dom.summary.value;
            updateSummaryCount();
            updatePreview();
            updateProgress();
            updateNavStates();
            saveState();
        });
    }

    function updateSummaryCount() {
        if (!dom.summaryCount) return;
        dom.summaryCount.textContent = String((state.summary || "").length);
    }


    /* =====================================================
       AUTOCOMPLETE ENGINE
    ===================================================== */

    function attachAutocomplete(inputEl, panelEl, getDataset, onPick, options) {
        if (!inputEl || !panelEl) return;

        const opts = Object.assign({
            minChars: 1,
            maxResults: 8,
            exclude: () => []
        }, options || {});

        let activeIndex = -1;
        let currentItems = [];
        let isOpen = false;

        function close() {
            isOpen = false;
            panelEl.hidden = true;
            panelEl.innerHTML = "";
            activeIndex = -1;
            currentItems = [];
            inputEl.setAttribute("aria-expanded", "false");
        }

        function open() {
            isOpen = true;
            panelEl.hidden = false;
            inputEl.setAttribute("aria-expanded", "true");
        }

        function filter(query) {
            const q = query.trim().toLowerCase();
            if (!q || q.length < opts.minChars) return [];

            const excluded = new Set(
                (opts.exclude() || []).map(x => String(x).toLowerCase())
            );

            const dataset = getDataset();
            const starts = [];
            const contains = [];

            dataset.forEach(item => {
                const low = item.toLowerCase();
                if (excluded.has(low)) return;
                if (low === q) return;
                if (low.startsWith(q)) starts.push(item);
                else if (low.includes(q)) contains.push(item);
            });

            return starts.concat(contains).slice(0, opts.maxResults);
        }

        function highlight(text, query) {
            const q = query.trim();
            if (!q) return escapeHtml(text);
            const idx = text.toLowerCase().indexOf(q.toLowerCase());
            if (idx === -1) return escapeHtml(text);
            const before = escapeHtml(text.slice(0, idx));
            const match = escapeHtml(text.slice(idx, idx + q.length));
            const after = escapeHtml(text.slice(idx + q.length));
            return before + "<mark>" + match + "</mark>" + after;
        }

        function render(query) {
            currentItems = filter(query);

            if (!currentItems.length) {
                panelEl.innerHTML =
                    '<div class="cp-build-suggest-empty">No suggestions — press Enter to add your own</div>';
                open();
                activeIndex = -1;
                return;
            }

            panelEl.innerHTML = currentItems.map((item, i) => `
                <div class="cp-build-suggest-item" data-index="${i}" role="option">
                    <span>${highlight(item, query)}</span>
                    <span class="cp-build-suggest-hint">↵</span>
                </div>
            `).join("");

            activeIndex = 0;
            updateActive();

            panelEl.querySelectorAll(".cp-build-suggest-item").forEach(el => {
                el.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                    const idx = parseInt(el.getAttribute("data-index"), 10);
                    pickAt(idx);
                });
            });

            open();
        }

        function updateActive() {
            panelEl.querySelectorAll(".cp-build-suggest-item").forEach((el, i) => {
                el.classList.toggle("is-active", i === activeIndex);
            });
            const activeEl = panelEl.querySelector(".cp-build-suggest-item.is-active");
            if (activeEl && typeof activeEl.scrollIntoView === "function") {
                activeEl.scrollIntoView({ block: "nearest" });
            }
        }

        function pickAt(idx) {
            if (idx < 0 || idx >= currentItems.length) return;
            const value = currentItems[idx];
            onPick(value);
            close();
        }

        inputEl.addEventListener("input", () => {
            const v = inputEl.value;
            if (!v || v.trim().length < opts.minChars) {
                close();
                return;
            }
            render(v);
        });

        inputEl.addEventListener("focus", () => {
            const v = inputEl.value;
            if (v && v.trim().length >= opts.minChars) {
                render(v);
            }
        });

        inputEl.addEventListener("keydown", (e) => {
            if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
                const v = inputEl.value;
                if (v && v.trim().length >= opts.minChars) {
                    render(v);
                }
                return;
            }
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (!currentItems.length) return;
                activeIndex = (activeIndex + 1) % currentItems.length;
                updateActive();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (!currentItems.length) return;
                activeIndex = (activeIndex - 1 + currentItems.length) % currentItems.length;
                updateActive();
            } else if (e.key === "Enter") {
                if (activeIndex >= 0 && currentItems.length) {
                    e.preventDefault();
                    pickAt(activeIndex);
                } else {
                    close();
                }
            } else if (e.key === "Escape") {
                close();
            } else if (e.key === "Tab") {
                close();
            }
        });

        inputEl.addEventListener("blur", () => {
            setTimeout(close, 120);
        });

        return { close, open: () => isOpen };
    }


    /* =====================================================
       REPEATER — EXPERIENCE
    ===================================================== */

    function renderExperience() {
        if (!dom.experienceList) return;

        dom.experienceList.innerHTML = "";

        state.experience.forEach(item => {
            dom.experienceList.appendChild(buildExperienceCard(item));
        });

        toggleEmpty("experience", state.experience.length === 0);
    }

    function buildExperienceCard(item) {
        const card = document.createElement("div");
        card.className = "cp-build-card is-open";
        card.dataset.id = item.id;

        card.innerHTML = `
            <div class="cp-build-card-head" role="button" tabindex="0" aria-expanded="true">
                <span class="cp-build-card-grip"><i class="bi bi-briefcase"></i></span>
                <div class="cp-build-card-info">
                    <p class="cp-build-card-title">${escapeHtml(item.title || "Untitled Role")}</p>
                    <p class="cp-build-card-sub">${escapeHtml(item.company || "Company")}${item.location ? " · " + escapeHtml(item.location) : ""}</p>
                </div>
                <div class="cp-build-card-actions">
                    <button type="button" class="cp-build-icon-btn cp-build-icon-danger" data-cp-build-remove title="Remove">
                        <i class="bi bi-trash3"></i>
                    </button>
                    <span class="cp-build-icon-btn cp-build-card-caret" aria-hidden="true">
                        <i class="bi bi-chevron-down"></i>
                    </span>
                </div>
            </div>
            <div class="cp-build-card-body">
                <div class="cp-build-card-body-inner">
                    <div class="cp-build-card-body-pad">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Job Title</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-briefcase"></i>
                                        <input type="text" data-field="title" placeholder="Frontend Developer" value="${escapeHtml(item.title)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Company</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-building"></i>
                                        <input type="text" data-field="company" placeholder="Company Name" value="${escapeHtml(item.company)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Location</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-geo-alt"></i>
                                        <input type="text" data-field="location" placeholder="City, Country" value="${escapeHtml(item.location)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-3">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Start</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-calendar-event"></i>
                                        <input type="month" data-field="startDate" value="${escapeHtml(item.startDate)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-3">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">End</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-calendar-check"></i>
                                        <input type="month" data-field="endDate" value="${escapeHtml(item.endDate)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-12">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Description</span>
                                    <span class="cp-build-field-textarea">
                                        <textarea data-field="description" rows="3" placeholder="What did you build, ship, or improve?">${escapeHtml(item.description)}</textarea>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindCardEvents(card, "experience", item.id);
        return card;
    }


    /* =====================================================
       REPEATER — EDUCATION
    ===================================================== */

    function renderEducation() {
        if (!dom.educationList) return;

        dom.educationList.innerHTML = "";

        state.education.forEach(item => {
            dom.educationList.appendChild(buildEducationCard(item));
        });

        toggleEmpty("education", state.education.length === 0);
    }

    function buildEducationCard(item) {
        const card = document.createElement("div");
        card.className = "cp-build-card is-open";
        card.dataset.id = item.id;

        card.innerHTML = `
            <div class="cp-build-card-head" role="button" tabindex="0" aria-expanded="true">
                <span class="cp-build-card-grip"><i class="bi bi-mortarboard"></i></span>
                <div class="cp-build-card-info">
                    <p class="cp-build-card-title">${escapeHtml(item.degree || "Untitled Degree")}</p>
                    <p class="cp-build-card-sub">${escapeHtml(item.institution || "Institution")}</p>
                </div>
                <div class="cp-build-card-actions">
                    <button type="button" class="cp-build-icon-btn cp-build-icon-danger" data-cp-build-remove title="Remove">
                        <i class="bi bi-trash3"></i>
                    </button>
                    <span class="cp-build-icon-btn cp-build-card-caret" aria-hidden="true">
                        <i class="bi bi-chevron-down"></i>
                    </span>
                </div>
            </div>
            <div class="cp-build-card-body">
                <div class="cp-build-card-body-inner">
                    <div class="cp-build-card-body-pad">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Degree</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-mortarboard"></i>
                                        <input type="text" data-field="degree" placeholder="BSc Computer Science" value="${escapeHtml(item.degree)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Institution</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-building"></i>
                                        <input type="text" data-field="institution" placeholder="University Name" value="${escapeHtml(item.institution)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Start</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-calendar-event"></i>
                                        <input type="month" data-field="startDate" value="${escapeHtml(item.startDate)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">End</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-calendar-check"></i>
                                        <input type="month" data-field="endDate" value="${escapeHtml(item.endDate)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-12">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Description</span>
                                    <span class="cp-build-field-textarea">
                                        <textarea data-field="description" rows="2" placeholder="Focus areas, honors, or achievements.">${escapeHtml(item.description)}</textarea>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindCardEvents(card, "education", item.id);
        return card;
    }


    /* =====================================================
       REPEATER — PROJECTS
    ===================================================== */

    function renderProjects() {
        if (!dom.projectsList) return;

        dom.projectsList.innerHTML = "";

        state.projects.forEach(item => {
            dom.projectsList.appendChild(buildProjectCard(item));
        });

        toggleEmpty("projects", state.projects.length === 0);
    }

    function buildProjectCard(item) {
        const card = document.createElement("div");
        card.className = "cp-build-card is-open";
        card.dataset.id = item.id;

        card.innerHTML = `
            <div class="cp-build-card-head" role="button" tabindex="0" aria-expanded="true">
                <span class="cp-build-card-grip"><i class="bi bi-kanban"></i></span>
                <div class="cp-build-card-info">
                    <p class="cp-build-card-title">${escapeHtml(item.name || "Untitled Project")}</p>
                    <p class="cp-build-card-sub">${escapeHtml(item.technologies || "Technologies")}</p>
                </div>
                <div class="cp-build-card-actions">
                    <button type="button" class="cp-build-icon-btn cp-build-icon-danger" data-cp-build-remove title="Remove">
                        <i class="bi bi-trash3"></i>
                    </button>
                    <span class="cp-build-icon-btn cp-build-card-caret" aria-hidden="true">
                        <i class="bi bi-chevron-down"></i>
                    </span>
                </div>
            </div>
            <div class="cp-build-card-body">
                <div class="cp-build-card-body-inner">
                    <div class="cp-build-card-body-pad">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Project Name</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-kanban"></i>
                                        <input type="text" data-field="name" placeholder="My Awesome App" value="${escapeHtml(item.name)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Technologies</span>
                                    <span class="cp-build-field-input cp-build-field-has-suggest">
                                        <i class="bi bi-cpu"></i>
                                        <input type="text" data-field="technologies" data-cp-build-suggest="technologies"
                                            placeholder="React, Node.js, MongoDB" value="${escapeHtml(item.technologies)}"
                                            autocomplete="off" role="combobox" aria-expanded="false" aria-autocomplete="list">
                                        <div class="cp-build-suggest" role="listbox" hidden></div>
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">GitHub</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-github"></i>
                                        <input type="url" data-field="github" placeholder="github.com/..." value="${escapeHtml(item.github)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Live Demo</span>
                                    <span class="cp-build-field-input">
                                        <i class="bi bi-globe2"></i>
                                        <input type="url" data-field="live" placeholder="https://..." value="${escapeHtml(item.live)}">
                                    </span>
                                </label>
                            </div>
                            <div class="col-12">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Description</span>
                                    <span class="cp-build-field-textarea">
                                        <textarea data-field="description" rows="3" placeholder="What does this project do?">${escapeHtml(item.description)}</textarea>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindCardEvents(card, "projects", item.id);
        return card;
    }


    /* =====================================================
       REPEATER — LANGUAGES
    ===================================================== */

    function renderLanguages() {
        if (!dom.languagesList) return;

        dom.languagesList.innerHTML = "";

        state.languages.forEach(item => {
            dom.languagesList.appendChild(buildLanguageCard(item));
        });

        toggleEmpty("languages", state.languages.length === 0);
    }

    function buildLanguageCard(item) {
        const card = document.createElement("div");
        card.className = "cp-build-card is-open";
        card.dataset.id = item.id;

        const optionsHtml = LANGUAGE_LEVELS.map(level =>
            `<option value="${level}" ${item.level === level ? "selected" : ""}>${level}</option>`
        ).join("");

        card.innerHTML = `
            <div class="cp-build-card-head" role="button" tabindex="0" aria-expanded="true">
                <span class="cp-build-card-grip"><i class="bi bi-translate"></i></span>
                <div class="cp-build-card-info">
                    <p class="cp-build-card-title">${escapeHtml(item.name || "Language")}</p>
                    <p class="cp-build-card-sub">${escapeHtml(item.level || "")}</p>
                </div>
                <div class="cp-build-card-actions">
                    <button type="button" class="cp-build-icon-btn cp-build-icon-danger" data-cp-build-remove title="Remove">
                        <i class="bi bi-trash3"></i>
                    </button>
                    <span class="cp-build-icon-btn cp-build-card-caret" aria-hidden="true">
                        <i class="bi bi-chevron-down"></i>
                    </span>
                </div>
            </div>
            <div class="cp-build-card-body">
                <div class="cp-build-card-body-inner">
                    <div class="cp-build-card-body-pad">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Language</span>
                                    <span class="cp-build-field-input cp-build-field-has-suggest">
                                        <i class="bi bi-translate"></i>
                                        <input type="text" data-field="name" data-cp-build-suggest="languages"
                                            placeholder="English, German, Dari..." value="${escapeHtml(item.name)}"
                                            autocomplete="off" role="combobox" aria-expanded="false" aria-autocomplete="list">
                                        <div class="cp-build-suggest" role="listbox" hidden></div>
                                    </span>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="cp-build-field">
                                    <span class="cp-build-field-label">Level</span>
                                    <span class="cp-build-field-input cp-build-select-wrap">
                                        <i class="bi bi-bar-chart"></i>
                                        <select data-field="level" class="cp-build-select" aria-label="Language proficiency">
                                            ${optionsHtml}
                                        </select>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindCardEvents(card, "languages", item.id);

        const langInput = card.querySelector('[data-field="name"]');
        const langSuggestPanel = card.querySelector(".cp-build-suggest");
        if (langInput && langSuggestPanel) {
            attachAutocomplete(
                langInput,
                langSuggestPanel,
                () => LANGUAGE_SUGGESTIONS,
                (value) => {
                    langInput.value = value;
                    langInput.dispatchEvent(new Event("input", { bubbles: true }));
                },
                {
                    minChars: 1,
                    maxResults: 8,
                    exclude: () => state.languages.map(l => l.name).filter(n => n && n !== item.name)
                }
            );
        }

        return card;
    }


    /* =====================================================
       CARD EVENTS
    ===================================================== */

    function bindCardEvents(card, type, id) {
        const head = card.querySelector(".cp-build-card-head");
        const removeBtn = card.querySelector("[data-cp-build-remove]");

        if (head) {
            head.addEventListener("click", (e) => {
                if (e.target.closest("[data-cp-build-remove]")) return;
                toggleCard(card);
            });

            head.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    if (e.target.closest("[data-cp-build-remove]")) return;
                    e.preventDefault();
                    toggleCard(card);
                }
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                removeRepeaterItem(type, id, card);
            });
        }

        card.querySelectorAll("[data-field]").forEach(input => {
            const handler = () => {
                updateRepeaterItem(type, id, input.dataset.field, input.value);
            };
            input.addEventListener("input", handler);
            input.addEventListener("change", handler);
        });

        if (type === "projects") {
            const techInput = card.querySelector('[data-cp-build-suggest="technologies"]');
            const panel = card.querySelector(".cp-build-suggest");
            if (techInput && panel) {
                attachAutocomplete(
                    techInput,
                    panel,
                    () => TECH_SUGGESTIONS,
                    (value) => {
                        const current = techInput.value;
                        const lastComma = current.lastIndexOf(",");
                        let prefix = "";
                        if (lastComma >= 0) {
                            prefix = current.slice(0, lastComma + 1) + " ";
                        }
                        const newVal = (prefix + value).trim();
                        techInput.value = newVal;
                        techInput.dispatchEvent(new Event("input", { bubbles: true }));
                    },
                    {
                        minChars: 1,
                        maxResults: 8,
                        exclude: () => {
                            return (techInput.value || "")
                                .split(",")
                                .map(s => s.trim())
                                .filter(Boolean);
                        }
                    }
                );
            }
        }
    }

    function toggleCard(card) {
        const isOpen = card.classList.contains("is-open");
        card.classList.toggle("is-open", !isOpen);
        const head = card.querySelector(".cp-build-card-head");
        if (head) head.setAttribute("aria-expanded", String(!isOpen));
    }

    function updateRepeaterItem(type, id, field, value) {
        const list = state[type];
        if (!Array.isArray(list)) return;
        const item = list.find(i => i.id === id);
        if (!item) return;

        item[field] = value;

        const listEl = dom[type === "experience" ? "experienceList"
            : type === "education" ? "educationList"
                : type === "projects" ? "projectsList"
                    : "languagesList"];

        const card = listEl.querySelector(`[data-id="${id}"]`);

        if (card) {
            const titleEl = card.querySelector(".cp-build-card-title");
            const subEl = card.querySelector(".cp-build-card-sub");

            if (type === "experience") {
                if (titleEl) titleEl.textContent = item.title || "Untitled Role";
                if (subEl) subEl.textContent = (item.company || "Company") + (item.location ? " · " + item.location : "");
            } else if (type === "education") {
                if (titleEl) titleEl.textContent = item.degree || "Untitled Degree";
                if (subEl) subEl.textContent = item.institution || "Institution";
            } else if (type === "projects") {
                if (titleEl) titleEl.textContent = item.name || "Untitled Project";
                if (subEl) subEl.textContent = item.technologies || "Technologies";
            } else if (type === "languages") {
                if (titleEl) titleEl.textContent = item.name || "Language";
                if (subEl) subEl.textContent = item.level || "";
            }
        }

        updatePreview();
        updateProgress();
        updateNavStates();
        saveState();
    }

    function removeRepeaterItem(type, id, card) {
        const list = state[type];
        if (!Array.isArray(list)) return;

        const idx = list.findIndex(i => i.id === id);
        if (idx === -1) return;

        card.classList.add("is-leaving");

        setTimeout(() => {
            state[type].splice(idx, 1);
            if (type === "experience") renderExperience();
            if (type === "education") renderEducation();
            if (type === "projects") renderProjects();
            if (type === "languages") renderLanguages();

            updatePreview();
            updateProgress();
            updateNavStates();
            saveState();
        }, 220);
    }

    function addRepeaterItem(type) {
        const template =
            type === "experience" ? EXPERIENCE_TEMPLATE :
                type === "education" ? EDUCATION_TEMPLATE :
                    type === "projects" ? PROJECT_TEMPLATE :
                        LANGUAGE_TEMPLATE;

        const item = { ...template, id: uid() };
        state[type].push(item);

        if (type === "experience") renderExperience();
        if (type === "education") renderEducation();
        if (type === "projects") renderProjects();
        if (type === "languages") renderLanguages();

        const listEl = dom[type === "experience" ? "experienceList"
            : type === "education" ? "educationList"
                : type === "projects" ? "projectsList"
                    : "languagesList"];

        if (listEl) {
            const newest = listEl.querySelector(`[data-id="${item.id}"]`);
            if (newest) {
                newest.classList.add("is-entering");
                requestAnimationFrame(() => {
                    newest.classList.remove("is-entering");
                    newest.classList.add("is-open");
                });

                setTimeout(() => {
                    const firstInput = newest.querySelector("input, textarea, select");
                    if (firstInput) firstInput.focus();
                }, 120);
            }
        }

        toggleEmpty(type, false);

        updatePreview();
        updateProgress();
        updateNavStates();
        saveState();
    }

    function toggleEmpty(type, isEmpty) {
        const el = dom.emptyStates[type];
        if (!el) return;
        el.classList.toggle("is-hidden", !isEmpty);
    }


    /* =====================================================
       SKILLS (tag system) + Skills autocomplete
    ===================================================== */

    let skillAutocomplete = null;

    function bindSkills() {
        if (!dom.skillInput) return;

        renderSkills();

        if (dom.skillSuggest) {
            skillAutocomplete = attachAutocomplete(
                dom.skillInput,
                dom.skillSuggest,
                () => SKILL_SUGGESTIONS,
                (value) => {
                    addSkill(value);
                    dom.skillInput.value = "";
                },
                {
                    minChars: 1,
                    maxResults: 8,
                    exclude: () => state.skills
                }
            );
        }

        dom.skillInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const val = dom.skillInput.value;
                if (val && val.trim()) {
                    addSkill(val);
                    dom.skillInput.value = "";
                    if (skillAutocomplete && skillAutocomplete.close) skillAutocomplete.close();
                }
            }
        });

        if (dom.skillAddBtn) {
            dom.skillAddBtn.addEventListener("click", () => {
                addSkill(dom.skillInput.value);
                dom.skillInput.value = "";
            });
        }
    }

    function addSkill(raw) {
        const value = String(raw || "").trim();
        if (!value) return;

        const exists = state.skills.some(s => s.toLowerCase() === value.toLowerCase());
        if (exists) {
            if (dom.skillInput) dom.skillInput.value = "";
            return;
        }

        state.skills.push(value);
        if (dom.skillInput) dom.skillInput.value = "";

        renderSkills();
        updatePreview();
        updateProgress();
        updateNavStates();
        saveState();
    }

    function renderSkills() {
        if (!dom.skillsTags) return;

        dom.skillsTags.innerHTML = "";

        state.skills.forEach(skill => {
            const tag = document.createElement("span");
            tag.className = "cp-build-tag";
            tag.innerHTML = `
                <span>${escapeHtml(skill)}</span>
                <button type="button" class="cp-build-tag-remove" aria-label="Remove ${escapeHtml(skill)}">
                    <i class="bi bi-x-lg"></i>
                </button>
            `;
            const btn = tag.querySelector(".cp-build-tag-remove");
            btn.addEventListener("click", () => removeSkill(skill, tag));
            dom.skillsTags.appendChild(tag);
        });

        toggleEmpty("skills", state.skills.length === 0);
    }

    function removeSkill(skill, tagEl) {
        tagEl.classList.add("is-leaving");
        setTimeout(() => {
            const idx = state.skills.findIndex(s => s === skill);
            if (idx > -1) state.skills.splice(idx, 1);
            renderSkills();
            updatePreview();
            updateProgress();
            updateNavStates();
            saveState();
        }, 220);
    }


    /* =====================================================
       PREVIEW RENDER
    ===================================================== */

    function updatePreview() {
        if (dom.cvName) {
            const name = state.personal.fullName.trim();
            dom.cvName.textContent = name || "Your Name";
            dom.cvName.classList.toggle("is-placeholder", !name);
        }

        if (dom.cvTitle) {
            const title = state.personal.title.trim();
            dom.cvTitle.textContent = title || "Professional Title";
            dom.cvTitle.classList.toggle("is-placeholder", !title);
        }

        if (dom.cvContact) {
            const contacts = {
                email: state.personal.email,
                phone: state.personal.phone,
                location: state.personal.location,
                linkedin: state.personal.linkedin,
                github: state.personal.github
            };
            Object.keys(contacts).forEach(key => {
                const li = dom.cvContact.querySelector(`[data-cp-build-cv-contact="${key}"]`);
                if (!li) return;
                const span = li.querySelector("span");
                const value = (contacts[key] || "").trim();
                if (value) {
                    span.textContent = value;
                    li.hidden = false;
                } else {
                    span.textContent = "";
                    li.hidden = true;
                }
            });
        }

        if (dom.cvSummary) {
            const summary = state.summary.trim();
            dom.cvSummary.textContent = summary || "Your professional summary will appear here.";
            dom.cvSummary.classList.toggle("is-placeholder", !summary);
        }

        renderPreviewExperience();
        renderPreviewEducation();
        renderPreviewSkills();
        renderPreviewProjects();
        renderPreviewLanguages();
    }

    function renderPreviewExperience() {
        if (!dom.cvExperience) return;
        dom.cvExperience.innerHTML = "";

        const valid = state.experience.filter(e => (e.title || e.company));
        valid.forEach(item => {
            const el = document.createElement("div");
            el.className = "cp-build-cv-item";
            const range = formatRange(item.startDate, item.endDate);

            el.innerHTML = `
                <div class="cp-build-cv-item-head">
                    <span class="cp-build-cv-item-title">${escapeHtml(item.title || "Role")}</span>
                    ${range ? `<span class="cp-build-cv-item-date">${escapeHtml(range)}</span>` : ""}
                </div>
                ${(item.company || item.location) ? `<span class="cp-build-cv-item-sub">${escapeHtml(item.company || "")}${item.location ? (item.company ? " · " : "") + escapeHtml(item.location) : ""}</span>` : ""}
                ${item.description ? `<p class="cp-build-cv-item-desc">${escapeHtml(item.description)}</p>` : ""}
            `;
            dom.cvExperience.appendChild(el);
        });

        const empty = document.querySelector('[data-cp-build-cv-empty="experience"]');
        if (empty) empty.classList.toggle("is-hidden", valid.length > 0);
    }

    function renderPreviewEducation() {
        if (!dom.cvEducation) return;
        dom.cvEducation.innerHTML = "";

        const valid = state.education.filter(e => (e.degree || e.institution));
        valid.forEach(item => {
            const el = document.createElement("div");
            el.className = "cp-build-cv-item";
            const range = formatRange(item.startDate, item.endDate);

            el.innerHTML = `
                <div class="cp-build-cv-item-head">
                    <span class="cp-build-cv-item-title">${escapeHtml(item.degree || "Degree")}</span>
                    ${range ? `<span class="cp-build-cv-item-date">${escapeHtml(range)}</span>` : ""}
                </div>
                ${item.institution ? `<span class="cp-build-cv-item-sub">${escapeHtml(item.institution)}</span>` : ""}
                ${item.description ? `<p class="cp-build-cv-item-desc">${escapeHtml(item.description)}</p>` : ""}
            `;
            dom.cvEducation.appendChild(el);
        });

        const empty = document.querySelector('[data-cp-build-cv-empty="education"]');
        if (empty) empty.classList.toggle("is-hidden", valid.length > 0);
    }

    function renderPreviewSkills() {
        if (!dom.cvSkills) return;
        dom.cvSkills.innerHTML = "";

        state.skills.forEach(skill => {
            const span = document.createElement("span");
            span.className = "cp-build-cv-tag";
            span.textContent = skill;
            dom.cvSkills.appendChild(span);
        });

        const empty = document.querySelector('[data-cp-build-cv-empty="skills"]');
        if (empty) empty.classList.toggle("is-hidden", state.skills.length > 0);
    }

    function renderPreviewProjects() {
        if (!dom.cvProjects) return;
        dom.cvProjects.innerHTML = "";

        const valid = state.projects.filter(p => (p.name || p.description));
        valid.forEach(item => {
            const el = document.createElement("div");
            el.className = "cp-build-cv-item";

            const links = [];
            if (item.github) links.push(`<a href="${escapeHtml(item.github)}" target="_blank" rel="noopener">GitHub</a>`);
            if (item.live) links.push(`<a href="${escapeHtml(item.live)}" target="_blank" rel="noopener">Live Demo</a>`);

            el.innerHTML = `
                <div class="cp-build-cv-item-head">
                    <span class="cp-build-cv-item-title">${escapeHtml(item.name || "Project")}</span>
                </div>
                ${item.technologies ? `<span class="cp-build-cv-item-sub">${escapeHtml(item.technologies)}</span>` : ""}
                ${item.description ? `<p class="cp-build-cv-item-desc">${escapeHtml(item.description)}</p>` : ""}
                ${links.length ? `<div class="cp-build-cv-item-links">${links.join("")}</div>` : ""}
            `;
            dom.cvProjects.appendChild(el);
        });

        const empty = document.querySelector('[data-cp-build-cv-empty="projects"]');
        if (empty) empty.classList.toggle("is-hidden", valid.length > 0);
    }

    function renderPreviewLanguages() {
        if (!dom.cvLanguages) return;
        dom.cvLanguages.innerHTML = "";

        const valid = state.languages.filter(l => l.name);
        valid.forEach(item => {
            const span = document.createElement("span");
            span.className = "cp-build-cv-tag cp-build-cv-tag-lang";
            span.textContent = item.name + (item.level ? " — " + item.level : "");
            dom.cvLanguages.appendChild(span);
        });

        const empty = document.querySelector('[data-cp-build-cv-empty="languages"]');
        if (empty) empty.classList.toggle("is-hidden", valid.length > 0);
    }


    /* =====================================================
       PROGRESS & SECTION STATES
    ===================================================== */

    function getSectionState(key) {
        if (key === "personal") {
            const filled = Object.keys(state.personal).filter(k => isNonEmpty(state.personal[k])).length;
            const total = Object.keys(state.personal).length;
            if (filled === 0) return "empty";
            if (filled === total) return "complete";
            return "progress";
        }
        if (key === "summary") {
            const len = state.summary.trim().length;
            if (len === 0) return "empty";
            if (len >= 80) return "complete";
            return "progress";
        }
        if (key === "experience") {
            if (state.experience.length === 0) return "empty";
            const complete = state.experience.every(e => e.title && e.company && e.startDate);
            return complete ? "complete" : "progress";
        }
        if (key === "education") {
            if (state.education.length === 0) return "empty";
            const complete = state.education.every(e => e.degree && e.institution);
            return complete ? "complete" : "progress";
        }
        if (key === "skills") {
            if (state.skills.length === 0) return "empty";
            if (state.skills.length >= 3) return "complete";
            return "progress";
        }
        if (key === "projects") {
            if (state.projects.length === 0) return "empty";
            const complete = state.projects.every(p => p.name && (p.github || p.live));
            return complete ? "complete" : "progress";
        }
        if (key === "languages") {
            if (state.languages.length === 0) return "empty";
            const complete = state.languages.every(l => l.name);
            return complete ? "complete" : "progress";
        }
        return "empty";
    }

    function updateNavStates() {
        SECTION_ORDER.forEach(key => {
            const stateVal = getSectionState(key);
            const navItem = dom.navList ? dom.navList.querySelector(`[data-cp-build-target="${key}"]`) : null;
            const statusEl = navItem ? navItem.querySelector(`[data-cp-build-status="${key}"]`) : null;
            const sectionEl = dom.sections[key];
            const tagEl = sectionEl ? sectionEl.querySelector(`[data-cp-build-section-tag="${key}"]`) : null;

            if (navItem) {
                navItem.classList.toggle("is-complete", stateVal === "complete");
            }

            const label = stateVal === "empty" ? "Not started"
                : stateVal === "progress" ? "In progress"
                    : "Completed";

            if (statusEl) statusEl.textContent = label;
            if (tagEl) {
                tagEl.textContent = label;
                tagEl.setAttribute("data-cp-build-tag-state",
                    stateVal === "empty" ? "" : stateVal);
            }
        });
    }

    function computeProgress() {
        let earned = 0;
        let total = 0;

        Object.keys(FIELD_WEIGHTS).forEach(key => {
            const weight = FIELD_WEIGHTS[key];
            total += weight;

            let value = 0;

            if (key === "fullName") value = isNonEmpty(state.personal.fullName) ? 1 : 0;
            if (key === "title") value = isNonEmpty(state.personal.title) ? 1 : 0;
            if (key === "email") value = isNonEmpty(state.personal.email) ? 1 : 0;
            if (key === "phone") value = isNonEmpty(state.personal.phone) ? 1 : 0;
            if (key === "location") value = isNonEmpty(state.personal.location) ? 1 : 0;
            if (key === "linkedin") value = isNonEmpty(state.personal.linkedin) ? 1 : 0;
            if (key === "github") value = isNonEmpty(state.personal.github) ? 1 : 0;
            if (key === "summary") value = state.summary.trim().length >= 60 ? 1 : (state.summary.trim().length > 0 ? 0.5 : 0);
            if (key === "experience") value = state.experience.length > 0 ? 1 : 0;
            if (key === "education") value = state.education.length > 0 ? 1 : 0;
            if (key === "skills") value = state.skills.length >= 3 ? 1 : (state.skills.length > 0 ? 0.5 : 0);
            if (key === "projects") value = state.projects.length > 0 ? 1 : 0;
            if (key === "languages") value = state.languages.length > 0 ? 1 : 0;

            earned += weight * value;
        });

        return Math.round((earned / total) * 100);
    }

    function updateProgress() {
        const percent = computeProgress();

        if (dom.progressRingLabel) dom.progressRingLabel.textContent = percent + "%";
        if (dom.progressPercentText) dom.progressPercentText.textContent = percent + "% complete";

        if (dom.progressRing) {
            const circumference = 2 * Math.PI * 52;
            const offset = circumference - (percent / 100) * circumference;
            const fill = dom.progressRing.querySelector(".cp-build-ring-fill");
            if (fill) fill.style.strokeDashoffset = offset;
        }

        if (dom.progressBarFill) dom.progressBarFill.style.width = percent + "%";
        if (dom.progressBar) dom.progressBar.setAttribute("aria-valuenow", String(percent));

        if (dom.progressNote) {
            let note = "Start with your personal details.";
            if (percent >= 100) note = "Your CV looks complete. Print or download it!";
            else if (percent >= 70) note = "Almost there — polish your strongest sections.";
            else if (percent >= 40) note = "Great progress. Keep going.";
            else if (percent > 0) note = "Nice start. Fill in more sections.";
            dom.progressNote.textContent = note;
        }

        updateNavStates();
    }


    /* =====================================================
       NAV SCROLL
    ===================================================== */

    function bindNav() {
        if (!dom.navList) return;

        dom.navList.addEventListener("click", (e) => {
            const link = e.target.closest(".cp-build-nav-link");
            if (!link) return;
            const item = link.closest(".cp-build-nav-item");
            if (!item) return;

            const target = item.getAttribute("data-cp-build-target");
            const sectionEl = dom.sections[target];
            if (!sectionEl) {
                console.warn("Build CV: section not found for target:", target);
                return;
            }

            setMobileView("editor");
            sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveNav(target);
        });
    }

    function setActiveNav(target) {
        if (!dom.navList) return;
        dom.navList.querySelectorAll(".cp-build-nav-item").forEach(item => {
            item.classList.toggle("is-active", item.getAttribute("data-cp-build-target") === target);
        });
    }

    function bindSectionFocusTracking() {
        const allInputs = document.querySelectorAll(".cp-build-editor input, .cp-build-editor textarea, .cp-build-editor select");
        allInputs.forEach(input => {
            input.addEventListener("focus", () => {
                const section = input.closest("[data-cp-build-section]");
                if (!section) return;
                const key = section.getAttribute("data-cp-build-section");
                highlightSection(key, true);
            });
        });
    }

    function highlightSection(key, active) {
        if (lastFocusedSection === key && active) return;

        document.querySelectorAll(".cp-build-section").forEach(s => {
            s.classList.toggle("is-focused", active && s.getAttribute("data-cp-build-section") === key);
        });

        document.querySelectorAll(".cp-build-cv-block").forEach(b => {
            b.classList.toggle("is-highlighted", active && b.getAttribute("data-cp-build-cv-section") === key);
        });

        if (active) setActiveNav(key);
        if (active) lastFocusedSection = key;
    }


    /* =====================================================
       MOBILE VIEW TOGGLE
    ===================================================== */

    function bindMobileToggle() {
        if (!dom.page) return;

        dom.page.setAttribute("data-cp-build-view", "editor");

        dom.mobileToggleButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const view = btn.getAttribute("data-cp-build-view");
                setMobileView(view);
            });
        });
    }

    function setMobileView(view) {
        if (!dom.page) return;
        dom.page.setAttribute("data-cp-build-view", view);
        dom.mobileToggleButtons.forEach(btn => {
            const isActive = btn.getAttribute("data-cp-build-view") === view;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-selected", String(isActive));
        });
    }


    /* =====================================================
       CLEAR FORM (MODAL)
    ===================================================== */

    function bindClear() {
        if (dom.clearAllBtn) {
            dom.clearAllBtn.addEventListener("click", () => openConfirmModal());
        }
        if (dom.confirmModal) {
            dom.confirmModal.querySelectorAll("[data-cp-build-modal-close]").forEach(el => {
                el.addEventListener("click", () => closeConfirmModal());
            });
        }
        if (dom.confirmClear) {
            dom.confirmClear.addEventListener("click", () => {
                clearAllData();
                closeConfirmModal();
            });
        }
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && dom.confirmModal && !dom.confirmModal.hidden) {
                closeConfirmModal();
            }
        });
    }

    function openConfirmModal() {
        if (!dom.confirmModal) return;
        dom.confirmModal.hidden = false;
        const focusTarget = dom.confirmClear || dom.confirmModal.querySelector("button");
        if (focusTarget) focusTarget.focus();
    }

    function closeConfirmModal() {
        if (!dom.confirmModal) return;
        dom.confirmModal.hidden = true;
    }

    function clearAllData() {
        state.personal = {
            fullName: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: ""
        };
        state.summary = "";
        state.experience = [];
        state.education = [];
        state.skills = [];
        state.projects = [];
        state.languages = [];

        try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* no-op */ }

        Object.keys(dom.personal).forEach(key => {
            if (dom.personal[key]) {
                dom.personal[key].value = "";
                clearFieldError(dom.personal[key]);
            }
        });

        if (dom.summary) dom.summary.value = "";
        updateSummaryCount();

        renderExperience();
        renderEducation();
        renderProjects();
        renderLanguages();
        renderSkills();

        if (dom.progressRing) {
            const fill = dom.progressRing.querySelector(".cp-build-ring-fill");
            if (fill) fill.style.strokeDashoffset = 2 * Math.PI * 52;
        }

        updatePreview();
        updateProgress();
        updateNavStates();

        highlightSection("personal", true);
    }


    /* =====================================================
       PRINT / DOWNLOAD
    ===================================================== */

    function bindActions() {
        if (dom.printBtn) {
            dom.printBtn.addEventListener("click", () => window.print());
        }
        if (dom.downloadBtn) {
            dom.downloadBtn.addEventListener("click", () => window.print());
        }
    }


    /* =====================================================
       ADD BUTTONS
    ===================================================== */

    function bindAddButtons() {
        Object.keys(dom.addButtons).forEach(type => {
            const btn = dom.addButtons[type];
            if (!btn) return;
            btn.addEventListener("click", () => addRepeaterItem(type));
        });
    }


    /* =====================================================
       INIT
    ===================================================== */

    function init() {
        cacheDom();

        bindPersonalFields();
        bindSummary();
        bindSkills();

        renderExperience();
        renderEducation();
        renderProjects();
        renderLanguages();

        bindAddButtons();
        bindNav();
        bindMobileToggle();
        bindClear();
        bindActions();

        loadState();

        Object.keys(dom.personal).forEach(key => {
            if (dom.personal[key]) dom.personal[key].value = state.personal[key] || "";
        });
        if (dom.summary) dom.summary.value = state.summary || "";
        updateSummaryCount();

        renderExperience();
        renderEducation();
        renderProjects();
        renderLanguages();
        renderSkills();

        updatePreview();
        updateProgress();
        updateNavStates();

        setActiveNav("personal");
        highlightSection("personal", true);

        document.addEventListener("focusin", (e) => {
            const input = e.target;
            if (!input || !input.closest) return;
            const section = input.closest("[data-cp-build-section]");
            if (!section) return;
            const key = section.getAttribute("data-cp-build-section");
            highlightSection(key, true);
        });
    }


    /* =====================================================
       BOOT
    ===================================================== */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();