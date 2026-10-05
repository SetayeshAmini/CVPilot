/* =========================================================
   CVPILOT — BUILD CV PAGE
   Client-side only. No API, no Firebase, no database,
   no localStorage / sessionStorage.
========================================================= */
/* =========================================================
   NAVBAR GLOBAL CONTROLLER (FIXED FOR ALL PAGES)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.getElementById("mainNavbar");
    const toggle = document.getElementById("navbarToggle");
    const menu = document.getElementById("navbarMenu");

    // Defensive check: If navbar element doesn't exist on the current page, skip quietly
    if (!navbar || !toggle || !menu) {
        return;
    }

    // Initialize Bootstrap Collapse Instance safely to isolate navigation events
    let bsCollapse = null;
    if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
        bsCollapse = new bootstrap.Collapse(menu, { toggle: false });
    }

    const navLinks = document.querySelectorAll("#navbarMenu .nav-link");

    /* --- NAVBAR SCROLL DETECTOR --- */
    function navbarScroll() {
        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", navbarScroll, { passive: true });
    navbarScroll(); // Trigger instantly on load for layout safety

    /* --- CLOSE MENU UTILITY --- */
    function closeMenu() {
        if (bsCollapse) {
            bsCollapse.hide();
        } else {
            menu.classList.remove("show");
        }
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
    }

    /* --- TOGGLE MOBILE INTERFACE CLICK --- */
    toggle.addEventListener("click", (e) => {
        e.preventDefault();
        const isOpen = menu.classList.contains("show");

        if (isOpen) {
            closeMenu();
        } else {
            if (bsCollapse) {
                bsCollapse.show();
            } else {
                menu.classList.add("show");
            }
            toggle.classList.add("active");
            toggle.setAttribute("aria-expanded", "true");
        }
    });

    /* --- CLOSE MENU UPON LINK SELECTIONS --- */
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
            closeMenu();
        });
    });

    /* --- CLOSE ON CTA CLICK --- */
    const startButton = document.querySelector(".btn-start");
    if (startButton) {
        startButton.addEventListener("click", () => closeMenu());
    }

    /* --- CLOSE OUTSIDE BOUNDS CLICK --- */
    document.addEventListener("click", (event) => {
        if (!navbar.contains(event.target) && menu.classList.contains("show")) {
            closeMenu();
        }
    });

    /* --- CLOSE MENU WITH ESCAPE KEY --- */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menu.classList.contains("show")) {
            closeMenu();
        }
    });

    /* --- RESIZE AUTO-RESET INFRASTRUCTURE --- */
    window.addEventListener("resize", () => {
        if (window.innerWidth > 991.98 && menu.classList.contains("show")) {
            closeMenu();
        }
    });
});



document.addEventListener("DOMContentLoaded", () => {

    const state = {
        personal: {
            fullName: "",
            proTitle: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: ""
        },
        summary: "",
        experience: [],
        education: [],
        projects: [],
        skills: [],
        languages: [],
        template: "minimal"
    };

    const TEMPLATE_LABELS = {
        minimal: "Minimal",
        modern: "Modern",
        professional: "Professional",
        elegant: "Elegant",
        creative: "Creative"
    };

    const LOCATIONS = [
        "London", "Los Angeles", "Londonderry", "Berlin", "Bern", "Boston",
        "Barcelona", "Bangkok", "Beijing", "Bucharest", "Budapest", "Brussels",
        "Amsterdam", "Athens", "Austin", "Atlanta", "Abu Dhabi", "Ankara",
        "Cairo", "Copenhagen", "Chicago", "Calgary", "Canberra", "Colombo",
        "Dubai", "Dublin", "Delhi", "Doha", "Dallas", "Denver", "Damascus",
        "Edinburgh", "Frankfurt", "Florence", "Geneva", "Hamburg", "Helsinki",
        "Herat", "Istanbul", "Islamabad", "Jakarta", "Jerusalem", "Karachi",
        "Kabul", "Kandahar", "Kuala Lumpur", "Lagos", "Lisbon", "Liverpool",
        "Madrid", "Manchester", "Melbourne", "Mexico City", "Milan", "Montreal",
        "Moscow", "Mumbai", "Munich", "Nairobi", "New York", "Oslo", "Ottawa",
        "Paris", "Prague", "Riyadh", "Rome", "Seoul", "Singapore", "Stockholm",
        "Sydney", "Tokyo", "Toronto", "Tehran", "Vienna", "Warsaw", "Zurich"
    ];

    const DEGREES = [
        "High School Diploma", "Associate Degree",
        "Bachelor's Degree", "Bachelor of Science (BSc)", "Bachelor of Arts (BA)",
        "Bachelor of Engineering (BEng)", "Bachelor of Business Administration (BBA)",
        "Master's Degree", "Master of Science (MSc)", "Master of Arts (MA)",
        "Master of Business Administration (MBA)", "Doctor of Philosophy (PhD)",
        "Diploma", "Certificate"
    ];

    const SKILLS = [
        "HTML", "HTML5", "CSS", "CSS3", "JavaScript", "TypeScript", "React",
        "Vue.js", "Angular", "Bootstrap", "Tailwind CSS", "Sass", "Less",
        "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust",
        "Node.js", "Express", "Next.js", "Git", "GitHub", "GitLab",
        "WordPress", "Figma", "Adobe XD", "Photoshop", "Illustrator",
        "UI/UX Design", "Responsive Design", "REST API", "GraphQL",
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis",
        "Testing", "QA Testing", "Selenium", "Jest", "Cypress",
        "Communication", "Teamwork", "Problem Solving",
        "Project Management", "Agile", "Scrum"
    ];

    const LANGUAGES = [
        "English", "German", "Dari", "Persian", "Pashto", "French", "Spanish",
        "Italian", "Arabic", "Turkish", "Russian", "Chinese",
        "Japanese", "Korean", "Portuguese", "Hindi"
    ];

    const $  = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    let idCounter = 0;
    const nextId = () => `id-${++idCounter}-${Date.now()}`;

    const escapeHTML = (str = "") =>
        String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const safeURL = (url = "") => {
        if (!url) return "";
        const trimmed = url.trim();
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return "https://" + trimmed.replace(/^\/+/, "");
    };

    const humanRange = (start, end) => {
        const s = (start || "").trim();
        const e = (end || "").trim();
        if (!s && !e) return "";
        if (s && !e) return `${s} — Present`;
        if (!s && e) return e;
        return `${s} — ${e}`;
    };

    const initialsOf = (name = "") => {
        const parts = String(name).trim().split(/\s+/).filter(Boolean);
        if (!parts.length) return "CV";
        const first = parts[0][0] || "";
        const last  = parts.length > 1 ? parts[parts.length - 1][0] : "";
        return (first + last).toUpperCase();
    };

    function attachAutocomplete(input, data, opts = {}) {
        if (!input || !Array.isArray(data)) return;

        const max = opts.max || 8;

        let wrap = input.parentElement;
        if (!wrap || !wrap.classList.contains("bcv-autocomplete")) {
            wrap = document.createElement("div");
            wrap.className = "bcv-autocomplete";
            input.parentNode.insertBefore(wrap, input);
            wrap.appendChild(input);
        }

        const panel = document.createElement("div");
        panel.className = "bcv-suggest";
        panel.setAttribute("role", "listbox");
        panel.setAttribute("aria-hidden", "true");
        wrap.appendChild(panel);

        let items = [];
        let focusedIndex = -1;

        const close = () => {
            panel.classList.remove("is-open");
            panel.setAttribute("aria-hidden", "true");
            items = [];
            focusedIndex = -1;
            panel.innerHTML = "";
        };

        const render = (results) => {
            if (!results.length) { close(); return; }

            items = results;
            focusedIndex = -1;

            panel.innerHTML = results
                .map((value, i) => {
                    const q = input.value.trim();
                    let label = escapeHTML(value);
                    if (q) {
                        const idx = value.toLowerCase().indexOf(q.toLowerCase());
                        if (idx >= 0) {
                            const before = escapeHTML(value.slice(0, idx));
                            const match  = escapeHTML(value.slice(idx, idx + q.length));
                            const after  = escapeHTML(value.slice(idx + q.length));
                            label = `${before}<strong>${match}</strong>${after}`;
                        }
                    }
                    return `<button type="button" class="bcv-suggest__item"
                        role="option" data-index="${i}">${label}</button>`;
                })
                .join("");

            panel.classList.add("is-open");
            panel.setAttribute("aria-hidden", "false");

            $$(".bcv-suggest__item", panel).forEach((btn) => {
                btn.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                    select(parseInt(btn.dataset.index, 10));
                });
            });
        };

        const select = (i) => {
            if (i < 0 || i >= items.length) return;
            const value = items[i];
            input.value = value;

            if (typeof opts.onSelect === "function") {
                opts.onSelect(value);
            } else {
                input.dispatchEvent(new Event("input", { bubbles: true }));
            }

            close();
        };

        input.addEventListener("input", () => {
            const q = input.value.trim().toLowerCase();
            if (!q) { close(); return; }

            const matches = data
                .filter((v) => v.toLowerCase().includes(q))
                .sort((a, b) => {
                    const ap = a.toLowerCase().startsWith(q) ? 0 : 1;
                    const bp = b.toLowerCase().startsWith(q) ? 0 : 1;
                    if (ap !== bp) return ap - bp;
                    return a.length - b.length;
                })
                .slice(0, max);

            render(matches);
        });

        input.addEventListener("keydown", (e) => {
            if (!panel.classList.contains("is-open")) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
                updateFocus();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                focusedIndex = Math.max(focusedIndex - 1, 0);
                updateFocus();
            } else if (e.key === "Enter") {
                if (focusedIndex >= 0) {
                    e.preventDefault();
                    select(focusedIndex);
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                close();
            }
        });

        function updateFocus() {
            $$(".bcv-suggest__item", panel).forEach((el, i) => {
                el.classList.toggle("is-focused", i === focusedIndex);
                if (i === focusedIndex) el.scrollIntoView({ block: "nearest" });
            });
        }

        input.addEventListener("blur", () => setTimeout(close, 120));

        document.addEventListener("mousedown", (e) => {
            if (!wrap.contains(e.target)) close();
        });
    }

    ["fullName", "proTitle", "email", "phone", "location", "linkedin", "github"].forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener("input", () => {
            state.personal[id] = input.value;
            renderPreview();
        });
    });

    const summaryInput  = document.getElementById("summaryInput");
    const summaryHelper = document.getElementById("summaryHelper");

    if (summaryInput) {
        summaryInput.addEventListener("input", () => {
            state.summary = summaryInput.value;

            if (summaryHelper) {
                const len = state.summary.length;
                summaryHelper.textContent =
                    `${len} character${len === 1 ? "" : "s"}` +
                    (len < 60 ? " — aim for at least a couple of sentences." : "");
            }

            renderPreview();
        });
    }

    function buildEntry(type, data = {}) {
        const wrapper = document.createElement("div");
        wrapper.className = "bcv-entry";
        wrapper.dataset.id = data.id || nextId();
        wrapper.dataset.type = type;

        const labels = { experience: "Experience", education: "Education", project: "Project" };

        const fields = {
            experience: [
                ["jobTitle", "Job Title", "text", "e.g. Front-End Developer"],
                ["company", "Company", "text", "e.g. Nova Studio"],
                ["location", "Location", "text", "e.g. Remote"],
                ["startDate", "Start Date", "text", "e.g. Jan 2023"],
                ["endDate", "End Date", "text", "e.g. Present"],
                ["description", "Description", "textarea", "What did you do there?"]
            ],
            education: [
                ["degree", "Degree", "text", "e.g. BSc Computer Science"],
                ["institution", "Institution", "text", "e.g. Kabul University"],
                ["startDate", "Start Date", "text", "e.g. 2019"],
                ["endDate", "End Date", "text", "e.g. 2023"],
                ["description", "Description", "textarea", "Focus, honors, activities…"]
            ],
            project: [
                ["name", "Project Name", "text", "e.g. Portfolio Website"],
                ["technologies", "Technologies", "text", "e.g. HTML, CSS, JavaScript"],
                ["github", "GitHub", "text", "github.com/username/project"],
                ["liveDemo", "Live Demo", "text", "example.com"],
                ["description", "Description", "textarea", "What does the project do?"]
            ]
        };

        const typeFields = fields[type] || [];

        const fieldsHTML = typeFields.map(([key, label, kind, placeholder]) => {
            const value = data[key] || "";
            const full  = kind === "textarea" ? " bcv-field--full" : "";
            const control =
                kind === "textarea"
                    ? `<textarea data-key="${key}" rows="3" placeholder="${placeholder}">${escapeHTML(value)}</textarea>`
                    : `<input type="text" data-key="${key}" value="${escapeHTML(value)}" placeholder="${placeholder}" autocomplete="off">`;

            return `
                <div class="bcv-field${full}">
                    <label>${label}</label>
                    ${control}
                </div>
            `;
        }).join("");

        wrapper.innerHTML = `
            <div class="bcv-entry__top">
                <span class="bcv-entry__label">${labels[type] || "Entry"}</span>
                <button type="button" class="bcv-remove" aria-label="Remove entry">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="bcv-grid bcv-grid--2">
                ${fieldsHTML}
            </div>
        `;

        $(".bcv-remove", wrapper).addEventListener("click", () => {
            removeEntry(type, wrapper.dataset.id);
            wrapper.style.transition = "opacity 0.25s ease, transform 0.25s ease";
            wrapper.style.opacity = "0";
            wrapper.style.transform = "translateY(-6px)";
            setTimeout(() => wrapper.remove(), 220);
        });

        $$("[data-key]", wrapper).forEach((el) => {
            el.addEventListener("input", () => {
                updateEntryField(type, wrapper.dataset.id, el.dataset.key, el.value);
            });
        });

        if (type === "experience") {
            const locInput = $('[data-key="location"]', wrapper);
            if (locInput) attachAutocomplete(locInput, LOCATIONS);
        }

        if (type === "education") {
            const degreeInput = $('[data-key="degree"]', wrapper);
            if (degreeInput) attachAutocomplete(degreeInput, DEGREES);
        }

        return wrapper;
    }

    function addEntry(type, data = {}) {
        const entry = { id: data.id || nextId(), ...data };

        if (type === "experience") {
            state.experience.push(entry);
            $("#experienceList").appendChild(buildEntry("experience", entry));
        } else if (type === "education") {
            state.education.push(entry);
            $("#educationList").appendChild(buildEntry("education", entry));
        } else if (type === "project") {
            state.projects.push(entry);
            $("#projectList").appendChild(buildEntry("project", entry));
        }

        renderPreview();
    }

    function removeEntry(type, id) {
        const map = { experience: "experience", education: "education", project: "projects" };
        const key = map[type];
        if (!key) return;
        state[key] = state[key].filter((e) => e.id !== id);
        renderPreview();
    }

    function updateEntryField(type, id, key, value) {
        const map = { experience: "experience", education: "education", project: "projects" };
        const list = state[map[type]];
        const entry = list.find((e) => e.id === id);
        if (entry) entry[key] = value;
        renderPreview();
    }

    const addExpBtn = document.getElementById("addExperience");
    const addEduBtn = document.getElementById("addEducation");
    const addPrjBtn = document.getElementById("addProject");

    if (addExpBtn) addExpBtn.addEventListener("click", () => addEntry("experience"));
    if (addEduBtn) addEduBtn.addEventListener("click", () => addEntry("education"));
    if (addPrjBtn) addPrjBtn.addEventListener("click", () => addEntry("project"));

    function addTag(kind, value) {
        const clean = String(value || "").trim();
        if (!clean) return;

        const list  = kind === "skill" ? state.skills : state.languages;
        const lower = clean.toLowerCase();

        if (list.some((item) => item.toLowerCase() === lower)) return;

        list.push(clean);
        renderTags(kind);
        renderPreview();
    }

    function removeTag(kind, value) {
        if (kind === "skill") {
            state.skills = state.skills.filter((s) => s !== value);
            renderTags("skill");
        } else {
            state.languages = state.languages.filter((s) => s !== value);
            renderTags("language");
        }
        renderPreview();
    }

    function renderTags(kind) {
        const list = kind === "skill" ? state.skills : state.languages;
        const container = kind === "skill"
            ? document.getElementById("skillsList")
            : document.getElementById("languagesList");

        if (!container) return;
        container.innerHTML = "";

        list.forEach((value) => {
            const tag = document.createElement("span");
            tag.className = "bcv-tag";
            tag.innerHTML = `
                <span>${escapeHTML(value)}</span>
                <button type="button" aria-label="Remove ${escapeHTML(value)}">
                    <i class="bi bi-x"></i>
                </button>
            `;
            $("button", tag).addEventListener("click", () => removeTag(kind, value));
            container.appendChild(tag);
        });
    }

    const skillInput    = document.getElementById("skillInput");
    const languageInput = document.getElementById("languageInput");
    const addSkillBtn   = document.getElementById("addSkill");
    const addLangBtn    = document.getElementById("addLanguage");

    if (addSkillBtn) {
        addSkillBtn.addEventListener("click", () => {
            addTag("skill", skillInput.value);
            skillInput.value = "";
            skillInput.focus();
        });
    }

    if (addLangBtn) {
        addLangBtn.addEventListener("click", () => {
            addTag("language", languageInput.value);
            languageInput.value = "";
            languageInput.focus();
        });
    }

    if (skillInput) {
        skillInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addTag("skill", skillInput.value);
                skillInput.value = "";
            }
        });

        attachAutocomplete(skillInput, SKILLS, {
            onSelect: (value) => {
                addTag("skill", value);
                skillInput.value = "";
                skillInput.focus();
            }
        });
    }

    if (languageInput) {
        languageInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addTag("language", languageInput.value);
                languageInput.value = "";
            }
        });

        attachAutocomplete(languageInput, LANGUAGES, {
            onSelect: (value) => {
                addTag("language", value);
                languageInput.value = "";
                languageInput.focus();
            }
        });
    }

    const templateCards = $$(".tpl-card");
    const tplActiveLabel = document.getElementById("tplActiveLabel");
    const cvPreview = document.getElementById("cvPreview");
    const previewSection = document.getElementById("preview");

    function setActiveTemplate(id) {
        const known = TEMPLATE_LABELS[id] ? id : "minimal";
        state.template = known;

        templateCards.forEach((card) => {
            const isActive = card.dataset.template === known;
            card.classList.toggle("is-selected", isActive);
            card.setAttribute("aria-checked", isActive ? "true" : "false");
        });

        if (tplActiveLabel) {
            tplActiveLabel.textContent = TEMPLATE_LABELS[known] || "Minimal";
        }

        if (cvPreview) {
            cvPreview.dataset.template = known;
        }

        renderPreview();
    }

    templateCards.forEach((card) => {
        const activate = () => setActiveTemplate(card.dataset.template);

        card.addEventListener("click", activate);

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                activate();
            }
        });
    });

    function hasRealData() {
        const p = state.personal;

        if ((p.fullName || "").trim())  return true;
        if ((p.proTitle || "").trim())  return true;
        if ((p.email || "").trim())     return true;
        if ((p.phone || "").trim())     return true;
        if ((p.location || "").trim())  return true;
        if ((p.linkedin || "").trim())  return true;
        if ((p.github || "").trim())    return true;
        if ((state.summary || "").trim()) return true;

        if (state.skills.length)    return true;
        if (state.languages.length) return true;

        if (state.experience.some((e) =>
            (e.jobTitle && e.jobTitle.trim()) ||
            (e.company && e.company.trim()) ||
            (e.description && e.description.trim())
        )) return true;

        if (state.education.some((e) =>
            (e.degree && e.degree.trim()) ||
            (e.institution && e.institution.trim()) ||
            (e.description && e.description.trim())
        )) return true;

        if (state.projects.some((pr) =>
            (pr.name && pr.name.trim()) ||
            (pr.description && pr.description.trim()) ||
            (pr.technologies && pr.technologies.trim())
        )) return true;

        return false;
    }

    function updatePreviewVisibility() {
        if (!previewSection) return;
        if (hasRealData()) {
            previewSection.classList.remove("is-empty-preview");
        } else {
            previewSection.classList.add("is-empty-preview");
        }
    }

    function buildContactsList(personal) {
        const items = [];
        if (personal.email)    items.push(`<li><i class="bi bi-envelope"></i><span>${escapeHTML(personal.email)}</span></li>`);
        if (personal.phone)    items.push(`<li><i class="bi bi-telephone"></i><span>${escapeHTML(personal.phone)}</span></li>`);
        if (personal.location) items.push(`<li><i class="bi bi-geo-alt"></i><span>${escapeHTML(personal.location)}</span></li>`);
        if (personal.linkedin) items.push(`<li><i class="bi bi-linkedin"></i><span>${escapeHTML(personal.linkedin)}</span></li>`);
        if (personal.github)   items.push(`<li><i class="bi bi-github"></i><span>${escapeHTML(personal.github)}</span></li>`);
        return items;
    }

    function experienceItems() {
        return state.experience.filter((e) =>
            (e.jobTitle && e.jobTitle.trim()) ||
            (e.company && e.company.trim()) ||
            (e.description && e.description.trim())
        );
    }

    function educationItems() {
        return state.education.filter((e) =>
            (e.degree && e.degree.trim()) ||
            (e.institution && e.institution.trim()) ||
            (e.description && e.description.trim())
        );
    }

    function projectItems() {
        return state.projects.filter((p) =>
            (p.name && p.name.trim()) ||
            (p.description && p.description.trim()) ||
            (p.technologies && p.technologies.trim())
        );
    }

    function renderExperienceMarkup(items, className = "cv-item") {
        return items.map((e) => {
            const dates = humanRange(e.startDate, e.endDate);
            const company  = (e.company  || "").trim();
            const location = (e.location || "").trim();

            const subParts = [];
            if (company)  subParts.push(escapeHTML(company));
            if (location) subParts.push(`<span class="cv-item__loc">${escapeHTML(location)}</span>`);

            return `
                <div class="${className}">
                    <div class="cv-item__head">
                        <h3 class="cv-item__title">${escapeHTML(e.jobTitle || "")}</h3>
                        ${dates ? `<span class="cv-item__dates">${escapeHTML(dates)}</span>` : ""}
                    </div>
                    ${subParts.length
                        ? `<p class="cv-item__sub">${subParts.join('<span class="cv-item__sep">·</span>')}</p>`
                        : ""}
                    ${e.description ? `<p>${escapeHTML(e.description)}</p>` : ""}
                </div>
            `;
        }).join("");
    }

    function renderEducationMarkup(items, className = "cv-item") {
        return items.map((e) => {
            const dates = humanRange(e.startDate, e.endDate);

            return `
                <div class="${className}">
                    <div class="cv-item__head">
                        <h3 class="cv-item__title">${escapeHTML(e.degree || "")}</h3>
                        ${dates ? `<span class="cv-item__dates">${escapeHTML(dates)}</span>` : ""}
                    </div>
                    ${e.institution ? `<p class="cv-item__sub">${escapeHTML(e.institution)}</p>` : ""}
                    ${e.description ? `<p>${escapeHTML(e.description)}</p>` : ""}
                </div>
            `;
        }).join("");
    }

    function renderProjectsMarkup(items, className = "cv-item") {
        return items.map((p) => {
            const links = [];
            if (p.github)
                links.push(
                    `<a href="${escapeHTML(safeURL(p.github))}" target="_blank" rel="noopener noreferrer">GitHub</a>`
                );
            if (p.liveDemo)
                links.push(
                    `<a href="${escapeHTML(safeURL(p.liveDemo))}" target="_blank" rel="noopener noreferrer">Live Demo</a>`
                );

            return `
                <div class="${className}">
                    <div class="cv-item__head">
                        <h3 class="cv-item__title">${escapeHTML(p.name || "")}</h3>
                    </div>
                    ${p.description ? `<p>${escapeHTML(p.description)}</p>` : ""}
                    ${p.technologies ? `<p class="cv-item__tech"><strong>Technologies:</strong> ${escapeHTML(p.technologies)}</p>` : ""}
                    ${links.length ? `<div class="cv-item__links">${links.join("")}</div>` : ""}
                </div>
            `;
        }).join("");
    }

    function renderSkillsMarkup() {
        if (!state.skills.length) return "";
        return state.skills.map((s) => `<span>${escapeHTML(s)}</span>`).join("");
    }

    function renderLanguagesMarkup() {
        if (!state.languages.length) return "";
        return state.languages.map((s) => `<span>${escapeHTML(s)}</span>`).join("");
    }

    function renderMinimal() {
        const p = state.personal;
        const name  = (p.fullName || "").trim();
        const title = (p.proTitle || "").trim();
        const contacts = buildContactsList(p);

        const expItems = experienceItems();
        const eduItems = educationItems();
        const prjItems = projectItems();

        const summaryHTML = state.summary.trim()
            ? `<section class="cv-section">
                    <h2>Summary</h2>
                    <p>${escapeHTML(state.summary.trim())}</p>
               </section>`
            : "";

        const contactsHTML = contacts.length
            ? `<ul class="cv-contacts">${contacts.join("")}</ul>`
            : "";

        return `
            <div class="cv-minimal">
                <header class="cv-head">
                    <h1 class="cv-name">${escapeHTML(name || "Your Name")}</h1>
                    ${title ? `<p class="cv-title">${escapeHTML(title)}</p>` : ""}
                    ${contactsHTML}
                </header>

                ${summaryHTML}

                ${expItems.length ? `
                    <section class="cv-section">
                        <h2>Experience</h2>
                        ${renderExperienceMarkup(expItems)}
                    </section>
                ` : ""}

                ${eduItems.length ? `
                    <section class="cv-section">
                        <h2>Education</h2>
                        ${renderEducationMarkup(eduItems)}
                    </section>
                ` : ""}

                ${state.skills.length ? `
                    <section class="cv-section">
                        <h2>Skills</h2>
                        <div class="cv-tags">${renderSkillsMarkup()}</div>
                    </section>
                ` : ""}

                ${prjItems.length ? `
                    <section class="cv-section">
                        <h2>Projects</h2>
                        ${renderProjectsMarkup(prjItems)}
                    </section>
                ` : ""}

                ${state.languages.length ? `
                    <section class="cv-section">
                        <h2>Languages</h2>
                        <div class="cv-langs">${renderLanguagesMarkup()}</div>
                    </section>
                ` : ""}
            </div>
        `;
    }

    function renderModern() {
        const p = state.personal;
        const name  = (p.fullName || "").trim();
        const title = (p.proTitle || "").trim();
        const initials = initialsOf(name);

        const expItems = experienceItems();
        const eduItems = educationItems();
        const prjItems = projectItems();

        const contacts = [];
        if (p.email)    contacts.push(`<li><i class="bi bi-envelope"></i><span>${escapeHTML(p.email)}</span></li>`);
        if (p.phone)    contacts.push(`<li><i class="bi bi-telephone"></i><span>${escapeHTML(p.phone)}</span></li>`);
        if (p.location) contacts.push(`<li><i class="bi bi-geo-alt"></i><span>${escapeHTML(p.location)}</span></li>`);
        if (p.linkedin) contacts.push(`<li><i class="bi bi-linkedin"></i><span>${escapeHTML(p.linkedin)}</span></li>`);
        if (p.github)   contacts.push(`<li><i class="bi bi-github"></i><span>${escapeHTML(p.github)}</span></li>`);

        const skillsHTML = state.skills.length
            ? `<div class="cv-modern__chips">${renderSkillsMarkup()}</div>`
            : "";

        const langsHTML = state.languages.length
            ? `<ul class="cv-modern__langs">${state.languages.map((s) => `<li>${escapeHTML(s)}</li>`).join("")}</ul>`
            : "";

        return `
            <div class="cv-modern">
                <aside class="cv-modern__side">
                    <div class="cv-modern__side-head">
                        <div class="cv-modern__avatar">${escapeHTML(initials)}</div>
                        <h1>${escapeHTML(name || "Your Name")}</h1>
                        ${title ? `<p class="cv-modern__role">${escapeHTML(title)}</p>` : ""}
                    </div>

                    ${contacts.length ? `
                        <div class="cv-modern__side-section">
                            <h2>Contact</h2>
                            <ul>${contacts.join("")}</ul>
                        </div>
                    ` : ""}

                    ${skillsHTML ? `
                        <div class="cv-modern__side-section">
                            <h2>Skills</h2>
                            ${skillsHTML}
                        </div>
                    ` : ""}

                    ${langsHTML ? `
                        <div class="cv-modern__side-section">
                            <h2>Languages</h2>
                            ${langsHTML}
                        </div>
                    ` : ""}
                </aside>

                <div class="cv-modern__main">
                    ${state.summary.trim() ? `
                        <section class="cv-section">
                            <h2>Summary</h2>
                            <p>${escapeHTML(state.summary.trim())}</p>
                        </section>
                    ` : ""}

                    ${expItems.length ? `
                        <section class="cv-section">
                            <h2>Experience</h2>
                            ${renderExperienceMarkup(expItems)}
                        </section>
                    ` : ""}

                    ${eduItems.length ? `
                        <section class="cv-section">
                            <h2>Education</h2>
                            ${renderEducationMarkup(eduItems)}
                        </section>
                    ` : ""}

                    ${prjItems.length ? `
                        <section class="cv-section">
                            <h2>Projects</h2>
                            ${renderProjectsMarkup(prjItems)}
                        </section>
                    ` : ""}
                </div>
            </div>
        `;
    }

    function renderProfessional() {
        const p = state.personal;
        const name  = (p.fullName || "").trim();
        const title = (p.proTitle || "").trim();

        const expItems = experienceItems();
        const eduItems = educationItems();
        const prjItems = projectItems();

        const contacts = [];
        if (p.email)    contacts.push(`<li><i class="bi bi-envelope"></i> ${escapeHTML(p.email)}</li>`);
        if (p.phone)    contacts.push(`<li><i class="bi bi-telephone"></i> ${escapeHTML(p.phone)}</li>`);
        if (p.location) contacts.push(`<li><i class="bi bi-geo-alt"></i> ${escapeHTML(p.location)}</li>`);
        if (p.linkedin) contacts.push(`<li><i class="bi bi-linkedin"></i> ${escapeHTML(p.linkedin)}</li>`);
        if (p.github)   contacts.push(`<li><i class="bi bi-github"></i> ${escapeHTML(p.github)}</li>`);

        return `
            <div class="cv-professional">
                <div class="cv-professional__band">
                    <h1 class="cv-professional__name">${escapeHTML(name || "Your Name")}</h1>
                    ${title ? `<p class="cv-professional__role">${escapeHTML(title)}</p>` : ""}
                    ${contacts.length ? `<ul class="cv-professional__contacts">${contacts.join("")}</ul>` : ""}
                </div>

                <div class="cv-professional__body">
                    ${state.summary.trim() ? `
                        <section class="cv-section">
                            <h2>Professional Summary</h2>
                            <p>${escapeHTML(state.summary.trim())}</p>
                        </section>
                    ` : ""}

                    ${expItems.length ? `
                        <section class="cv-section">
                            <h2>Experience</h2>
                            ${renderExperienceMarkup(expItems)}
                        </section>
                    ` : ""}

                    ${eduItems.length ? `
                        <section class="cv-section">
                            <h2>Education</h2>
                            ${renderEducationMarkup(eduItems)}
                        </section>
                    ` : ""}

                    ${state.skills.length ? `
                        <section class="cv-section">
                            <h2>Skills</h2>
                            <div class="cv-tags">${renderSkillsMarkup()}</div>
                        </section>
                    ` : ""}

                    ${prjItems.length ? `
                        <section class="cv-section">
                            <h2>Projects</h2>
                            ${renderProjectsMarkup(prjItems)}
                        </section>
                    ` : ""}

                    ${state.languages.length ? `
                        <section class="cv-section">
                            <h2>Languages</h2>
                            <div class="cv-langs">${renderLanguagesMarkup()}</div>
                        </section>
                    ` : ""}
                </div>
            </div>
        `;
    }

    function renderElegant() {
        const p = state.personal;
        const name  = (p.fullName || "").trim();
        const title = (p.proTitle || "").trim();

        const expItems = experienceItems();
        const eduItems = educationItems();
        const prjItems = projectItems();

        const contacts = [];
        if (p.email)    contacts.push(`<li>${escapeHTML(p.email)}</li>`);
        if (p.phone)    contacts.push(`<li>${escapeHTML(p.phone)}</li>`);
        if (p.location) contacts.push(`<li>${escapeHTML(p.location)}</li>`);
        if (p.linkedin) contacts.push(`<li>${escapeHTML(p.linkedin)}</li>`);
        if (p.github)   contacts.push(`<li>${escapeHTML(p.github)}</li>`);

        return `
            <div class="cv-elegant">
                <header class="cv-elegant__head">
                    <h1 class="cv-elegant__name">${escapeHTML(name || "Your Name")}</h1>
                    ${title ? `<p class="cv-elegant__role">${escapeHTML(title)}</p>` : ""}
                    ${contacts.length ? `<ul class="cv-elegant__contacts">${contacts.join("")}</ul>` : ""}
                </header>

                <div class="cv-elegant__body">
                    ${state.summary.trim() ? `
                        <section class="cv-section">
                            <h2>Summary</h2>
                            <p>${escapeHTML(state.summary.trim())}</p>
                        </section>
                    ` : ""}

                    ${expItems.length ? `
                        <section class="cv-section">
                            <h2>Experience</h2>
                            ${renderExperienceMarkup(expItems)}
                        </section>
                    ` : ""}

                    ${eduItems.length ? `
                        <section class="cv-section">
                            <h2>Education</h2>
                            ${renderEducationMarkup(eduItems)}
                        </section>
                    ` : ""}

                    ${state.skills.length ? `
                        <section class="cv-section">
                            <h2>Skills</h2>
                            <div class="cv-tags">${renderSkillsMarkup()}</div>
                        </section>
                    ` : ""}

                    ${prjItems.length ? `
                        <section class="cv-section">
                            <h2>Projects</h2>
                            ${renderProjectsMarkup(prjItems)}
                        </section>
                    ` : ""}

                    ${state.languages.length ? `
                        <section class="cv-section">
                            <h2>Languages</h2>
                            <div class="cv-langs">${renderLanguagesMarkup()}</div>
                        </section>
                    ` : ""}
                </div>
            </div>
        `;
    }

    function renderCreative() {
        const p = state.personal;
        const name  = (p.fullName || "").trim();
        const title = (p.proTitle || "").trim();
        const initials = initialsOf(name);

        const expItems = experienceItems();
        const eduItems = educationItems();
        const prjItems = projectItems();

        const contacts = [];
        if (p.email)    contacts.push(`<li><i class="bi bi-envelope"></i>${escapeHTML(p.email)}</li>`);
        if (p.phone)    contacts.push(`<li><i class="bi bi-telephone"></i>${escapeHTML(p.phone)}</li>`);
        if (p.location) contacts.push(`<li><i class="bi bi-geo-alt"></i>${escapeHTML(p.location)}</li>`);
        if (p.linkedin) contacts.push(`<li><i class="bi bi-linkedin"></i>${escapeHTML(p.linkedin)}</li>`);
        if (p.github)   contacts.push(`<li><i class="bi bi-github"></i>${escapeHTML(p.github)}</li>`);

        return `
            <div class="cv-creative">
                <header class="cv-creative__head">
                    <div class="cv-creative__avatar">${escapeHTML(initials)}</div>
                    <div>
                        <h1 class="cv-creative__name">${escapeHTML(name || "Your Name")}</h1>
                        ${title ? `<p class="cv-creative__role">${escapeHTML(title)}</p>` : ""}
                        ${contacts.length ? `<ul class="cv-creative__contacts">${contacts.join("")}</ul>` : ""}
                    </div>
                </header>

                <div class="cv-creative__body">
                    <div>
                        ${state.summary.trim() ? `
                            <section class="cv-section">
                                <h2>Summary</h2>
                                <p>${escapeHTML(state.summary.trim())}</p>
                            </section>
                        ` : ""}

                        ${expItems.length ? `
                            <section class="cv-section">
                                <h2>Experience</h2>
                                ${renderExperienceMarkup(expItems)}
                            </section>
                        ` : ""}

                        ${eduItems.length ? `
                            <section class="cv-section">
                                <h2>Education</h2>
                                ${renderEducationMarkup(eduItems)}
                            </section>
                        ` : ""}

                        ${prjItems.length ? `
                            <section class="cv-section">
                                <h2>Projects</h2>
                                ${renderProjectsMarkup(prjItems)}
                            </section>
                        ` : ""}
                    </div>

                    <aside>
                        ${state.skills.length ? `
                            <section class="cv-section">
                                <h2>Skills</h2>
                                <div class="cv-creative__chips">${renderSkillsMarkup()}</div>
                            </section>
                        ` : ""}

                        ${state.languages.length ? `
                            <section class="cv-section">
                                <h2>Languages</h2>
                                <div class="cv-creative__langs">${renderLanguagesMarkup()}</div>
                            </section>
                        ` : ""}
                    </aside>
                </div>
            </div>
        `;
    }

    function renderPreview() {
        const cvPreviewEl = document.getElementById("cvPreview");
        if (!cvPreviewEl) return;

        const tpl = TEMPLATE_LABELS[state.template] ? state.template : "minimal";

        cvPreviewEl.classList.remove(
            "cv-paper--minimal",
            "cv-paper--modern",
            "cv-paper--professional",
            "cv-paper--elegant",
            "cv-paper--creative"
        );

        cvPreviewEl.classList.add(`cv-paper--${tpl}`);

        let html = "";
        switch (tpl) {
            case "modern":       html = renderModern(); break;
            case "professional": html = renderProfessional(); break;
            case "elegant":      html = renderElegant(); break;
            case "creative":     html = renderCreative(); break;
            case "minimal":
            default:             html = renderMinimal(); break;
        }

        cvPreviewEl.innerHTML = html;

        cvPreviewEl.style.animation = "none";
        void cvPreviewEl.offsetWidth;
        cvPreviewEl.style.animation = "";

        updatePreviewVisibility();
    }

    const filterButtons = $$(".bcv-filter");
    const sectionCards  = $$("[data-section]");

    function setActiveSection(sectionId) {
        filterButtons.forEach((btn) => {
            btn.classList.toggle("is-active", btn.dataset.target === sectionId);
        });

        sectionCards.forEach((card) => {
            card.classList.toggle("is-active", card.dataset.section === sectionId);
        });
    }

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.target;
            if (!id) return;

            const target = document.querySelector(`[data-section="${id}"]`);
            if (!target) return;

            target.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveSection(id);
        });
    });

    if ("IntersectionObserver" in window && sectionCards.length) {

        const visibilityMap = new Map();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                visibilityMap.set(
                    entry.target.dataset.section,
                    entry.isIntersecting ? entry.intersectionRatio : 0
                );
            });

            let bestId = null;
            let bestRatio = 0;

            visibilityMap.forEach((ratio, id) => {
                if (ratio > bestRatio) {
                    bestRatio = ratio;
                    bestId = id;
                }
            });

            if (bestId && bestRatio > 0) {
                setActiveSection(bestId);
            }
        }, {
            root: null,
            rootMargin: "-30% 0px -45% 0px",
            threshold: [0, 0.15, 0.3, 0.5, 0.75, 1]
        });

        sectionCards.forEach((card) => observer.observe(card));
    }

    const downloadBtn = document.getElementById("downloadCV");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            const preview = document.getElementById("cvPreview");
            if (!preview) return;

            const clone = preview.cloneNode(true);
            clone.querySelectorAll(".is-empty").forEach((el) => el.remove());

            const doc = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>CV — ${escapeHTML(state.personal.fullName || "My CV")}</title>
                    <style>
                        * { box-sizing: border-box; }
                        html, body { margin: 0; padding: 0; background: #ffffff; }
                        body {
                            font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
                            color: #1a1f2b;
                            padding: 40px; max-width: 900px;
                            margin: 0 auto; line-height: 1.6;
                        }
                        h1, h2, h3, p, ul, li { margin: 0; padding: 0; }
                        ul { list-style: none; }
                        a { color: #B83E2B; text-decoration: none; }
                        .cv-paper { padding: 0; border: none; background: #ffffff; box-shadow: none; border-radius: 0; }
                        .cv-section h2 { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #B83E2B; border-bottom: 1.5px solid rgba(184,62,43,0.35); padding-bottom: 6px; margin: 24px 0 12px; }
                        .cv-item + .cv-item { margin-top: 18px; padding-top: 18px; border-top: 1px dashed rgba(16,24,42,0.14); }
                        .cv-item__head { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; flex-wrap: wrap; }
                        .cv-item__title { font-size: 15px; font-weight: 700; color: #0B111C; }
                        .cv-item__dates { font-size: 12px; color: #6a7183; font-weight: 600; }
                        .cv-item__sub   { font-size: 13px; color: #4a5468; margin: 3px 0 8px; font-weight: 500; }
                        .cv-item p      { font-size: 13px; line-height: 1.65; color: #2a3247; margin: 0; }
                        .cv-item__tech  { font-size: 13px; color: #4a5468; margin-top: 8px; }
                        .cv-item__tech strong { color: #0B111C; }
                        .cv-item__links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; font-size: 13px; }
                        .cv-item__links a { font-weight: 600; }

                        .cv-minimal .cv-head { padding-bottom: 18px; margin-bottom: 20px; border-bottom: 1.5px solid rgba(16,24,42,0.14); }
                        .cv-minimal .cv-name { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; color: #0B111C; margin-bottom: 4px; }
                        .cv-minimal .cv-title { font-size: 15px; color: #4a5468; font-weight: 500; margin-bottom: 10px; }
                        .cv-minimal .cv-contacts { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 13px; color: #4a5468; }
                        .cv-minimal .cv-contacts i { display: none; }
                        .cv-minimal .cv-tags { display: flex; flex-wrap: wrap; gap: 6px; }
                        .cv-minimal .cv-tags span { font-size: 12px; color: #2a3247; padding: 3px 10px; border-radius: 4px; background: rgba(16,24,42,0.05); border: 1px solid rgba(16,24,42,0.08); }
                        .cv-minimal .cv-langs { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 13px; color: #2a3247; }

                        .cv-modern { display: grid; grid-template-columns: 34% 66%; }
                        .cv-modern__side { background: linear-gradient(180deg, rgba(232,93,63,0.92), rgba(184,62,43,0.92)); padding: 30px 22px; color: #ffffff; }
                        .cv-modern__avatar { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: 18px; color: #B83E2B; background: rgba(255,255,255,0.92); margin-bottom: 10px; }
                        .cv-modern__side h1 { font-size: 20px; font-weight: 800; line-height: 1.15; color: #ffffff; }
                        .cv-modern__role { font-size: 13px; color: rgba(255,255,255,0.88); margin-top: 4px; }
                        .cv-modern__side-section { margin-top: 20px; }
                        .cv-modern__side-section h2 { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 800; color: rgba(255,255,255,0.85); padding-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.25); margin-bottom: 8px; }
                        .cv-modern__side-section ul { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: rgba(255,255,255,0.95); }
                        .cv-modern__side-section ul li { display: flex; align-items: center; gap: 8px; }
                        .cv-modern__side-section ul li i { display: none; }
                        .cv-modern__chips { display: flex; flex-wrap: wrap; gap: 6px; }
                        .cv-modern__chips span { padding: 3px 9px; border-radius: 4px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.25); color: #ffffff; }
                        .cv-modern__langs { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: rgba(255,255,255,0.95); }
                        .cv-modern__main { padding: 32px 28px; }
                        .cv-modern__main .cv-section h2 { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #B83E2B; border-bottom: 1.5px solid rgba(232,93,63,0.35); padding-bottom: 5px; margin: 22px 0 10px; }
                        .cv-modern__main .cv-section:first-child h2 { margin-top: 0; }

                        .cv-professional__band { padding: 26px 32px 20px; background: linear-gradient(135deg, #0B111C 0%, #1B2A40 100%); color: #ffffff; }
                        .cv-professional__name { font-size: 28px; font-weight: 800; letter-spacing: 0.01em; color: #ffffff; }
                        .cv-professional__role { font-size: 14px; color: rgba(255,255,255,0.85); margin-top: 4px; }
                        .cv-professional__contacts { display: flex; flex-wrap: wrap; gap: 6px 20px; margin-top: 12px; padding-top: 12px; font-size: 12px; color: rgba(255,255,255,0.85); border-top: 1px solid rgba(255,255,255,0.18); }
                        .cv-professional__contacts i { display: none; }
                        .cv-professional__body { padding: 26px 32px 32px; }
                        .cv-professional__body .cv-section h2 { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #0B111C; border-bottom: 1.5px solid #0B111C; padding-bottom: 5px; margin: 22px 0 12px; display: inline-block; }
                        .cv-professional__body .cv-item { padding-left: 14px; border-left: 2px solid rgba(232,93,63,0.45); }
                        .cv-professional__body .cv-tags { display: flex; flex-wrap: wrap; gap: 6px; }
                        .cv-professional__body .cv-tags span { font-size: 12px; color: #0B111C; padding: 3px 10px; border-radius: 3px; background: rgba(232,93,63,0.10); border: 1px solid rgba(232,93,63,0.28); font-weight: 600; }
                        .cv-professional__body .cv-langs { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 13px; color: #2a3247; }

                        .cv-elegant { font-family: "Georgia", "Times New Roman", serif; padding: 30px 36px; }
                        .cv-elegant__head { text-align: center; padding-bottom: 22px; margin-bottom: 24px; border-bottom: 1px solid rgba(184,62,43,0.45); }
                        .cv-elegant__name { font-size: 28px; font-weight: 700; letter-spacing: 0.02em; color: #0B111C; }
                        .cv-elegant__role { font-size: 14px; color: #4a5468; font-style: italic; margin-top: 4px; }
                        .cv-elegant__contacts { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 18px; font-size: 12px; color: #4a5468; margin-top: 10px; font-family: Inter, system-ui, sans-serif; }
                        .cv-elegant__body .cv-section h2 { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #0B111C; text-align: center; padding-bottom: 6px; margin: 26px 0 14px; border-bottom: none; position: relative; }
                        .cv-elegant__body .cv-section h2::after { content: ""; display: block; width: 30px; height: 1px; margin: 6px auto 0; background: rgba(184,62,43,0.55); }
                        .cv-elegant__body .cv-section p { text-align: center; }
                        .cv-elegant__body .cv-item p { text-align: left; }
                        .cv-elegant__body .cv-tags { display: flex; flex-wrap: wrap; gap: 6px 8px; justify-content: center; }
                        .cv-elegant__body .cv-tags span { font-size: 12px; color: #0B111C; font-family: Inter, system-ui, sans-serif; padding: 2px 8px; border-bottom: 1px solid rgba(184,62,43,0.35); }
                        .cv-elegant__body .cv-langs { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 18px; font-size: 13px; color: #2a3247; font-style: italic; }

                        .cv-creative { padding: 26px 28px; }
                        .cv-creative__head { display: flex; align-items: center; gap: 18px; padding-bottom: 20px; margin-bottom: 22px; border-bottom: 2px solid #E85D3F; }
                        .cv-creative__avatar { width: 58px; height: 58px; border-radius: 16px; display: grid; place-items: center; font-weight: 800; font-size: 20px; color: #ffffff; background: linear-gradient(135deg, #E85D3F, #F08A4B); }
                        .cv-creative__name { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #0B111C; }
                        .cv-creative__role { font-size: 14px; color: #B83E2B; font-weight: 600; margin-top: 3px; }
                        .cv-creative__contacts { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 12px; color: #4a5468; margin-top: 8px; }
                        .cv-creative__contacts i { display: none; }
                        .cv-creative__body { display: grid; grid-template-columns: 1.6fr 1fr; gap: 26px; }
                        .cv-creative__body .cv-section h2 { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #0B111C; border-bottom: none; padding-bottom: 0; margin: 20px 0 10px; display: flex; align-items: center; gap: 8px; }
                        .cv-creative__body .cv-section h2::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: #E85D3F; }
                        .cv-creative__body .cv-item { padding: 10px 12px; border-radius: 10px; background: rgba(232,93,63,0.06); border-left: 3px solid #E85D3F; }
                        .cv-creative__chips { display: flex; flex-wrap: wrap; gap: 6px; }
                        .cv-creative__chips span { font-size: 12px; color: #0B111C; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: rgba(232,93,63,0.12); border: 1px solid rgba(232,93,63,0.30); }
                        .cv-creative__langs { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 13px; color: #2a3247; }

                        @media print { body { padding: 0; } }
                    </style>
                </head>
                <body>
                    ${clone.outerHTML}
                    <script>
                        window.addEventListener("load", () => {
                            setTimeout(() => window.print(), 200);
                        });
                    <\/script>
                </body>
                </html>
            `;

            const printWindow = window.open("", "_blank");
            if (!printWindow) {
                alert("Please allow pop-ups to download your CV.");
                return;
            }

            printWindow.document.open();
            printWindow.document.write(doc);
            printWindow.document.close();
        });
    }

    const clearBtn     = document.getElementById("clearCV");
    const modal        = document.getElementById("clearModal");
    const modalCancel  = document.getElementById("clearCancel");
    const modalConfirm = document.getElementById("clearConfirm");

    function openClearModal() {
        if (!modal) return;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        if (modalCancel) modalCancel.focus();
    }

    function closeClearModal() {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        if (clearBtn) clearBtn.focus();
    }

    if (clearBtn) clearBtn.addEventListener("click", openClearModal);
    if (modalCancel) modalCancel.addEventListener("click", closeClearModal);

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target.dataset && e.target.dataset.close === "true") {
                closeClearModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
            closeClearModal();
        }
    });

    function clearAll() {
        const currentTemplate = state.template;

        state.personal = {
            fullName: "", proTitle: "", email: "", phone: "",
            location: "", linkedin: "", github: ""
        };
        state.summary = "";
        state.experience = [];
        state.education = [];
        state.projects = [];
        state.skills = [];
        state.languages = [];
        state.template = currentTemplate;

        ["fullName", "proTitle", "email", "phone", "location", "linkedin", "github"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        if (summaryInput) summaryInput.value = "";
        if (summaryHelper) summaryHelper.textContent = "0 characters";

        if (skillInput) skillInput.value = "";
        if (languageInput) languageInput.value = "";

        const expList = document.getElementById("experienceList");
        const eduList = document.getElementById("educationList");
        const prjList = document.getElementById("projectList");

        if (expList) expList.innerHTML = "";
        if (eduList) eduList.innerHTML = "";
        if (prjList) prjList.innerHTML = "";

        renderTags("skill");
        renderTags("language");

        renderPreview();
        setActiveSection("personal");

        seedInitialEntries();
        updatePreviewVisibility();
    }

    if (modalConfirm) {
        modalConfirm.addEventListener("click", () => {
            clearAll();
            closeClearModal();

            const builder = document.getElementById("builder");
            if (builder) builder.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    function seedInitialEntries() {
        if (state.experience.length === 0) {
            addEntry("experience");
        }
        if (state.education.length === 0) {
            addEntry("education");
        }
    }

    setActiveTemplate(state.template);
    setActiveSection("personal");
    seedInitialEntries();
    renderPreview();
    updatePreviewVisibility();

});