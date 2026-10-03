/* =========================================================
   CVPILOT — BUILD CV PAGE
   Client-side only. No API, no Firebase, no database.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       STATE
    ===================================================== */

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
        languages: []
    };


    /* =====================================================
       HELPERS
    ===================================================== */

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


    /* =====================================================
       PERSONAL + SUMMARY BINDING
    ===================================================== */

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


    /* =====================================================
       REPEATABLE ENTRY BUILDER
    ===================================================== */

    function buildEntry(type, data = {}) {
        const wrapper = document.createElement("div");
        wrapper.className = "bcv-entry";
        wrapper.dataset.id = data.id || nextId();
        wrapper.dataset.type = type;

        const labels = {
            experience: "Experience",
            education: "Education",
            project: "Project"
        };

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
                    : `<input type="text" data-key="${key}" value="${escapeHTML(value)}" placeholder="${placeholder}">`;

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


    /* =====================================================
       SKILLS & LANGUAGES
    ===================================================== */

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
    }

    if (languageInput) {
        languageInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addTag("language", languageInput.value);
                languageInput.value = "";
            }
        });
    }


    /* =====================================================
       PREVIEW RENDERING
    ===================================================== */

    function renderPreview() {
        renderPreviewHead();
        renderPreviewContacts();
        renderPreviewSummary();
        renderPreviewExperience();
        renderPreviewEducation();
        renderPreviewProjects();
        renderPreviewTags();
    }


    function setSectionVisible(sectionEl, hasContent) {
        if (!sectionEl) return;
        sectionEl.classList.toggle("is-empty", !hasContent);
    }


    function renderPreviewHead() {
        const name  = state.personal.fullName.trim();
        const title = state.personal.proTitle.trim();

        const nameEl  = document.getElementById("prevName");
        const titleEl = document.getElementById("prevTitle");

        if (nameEl)  nameEl.textContent  = name  || "Your Name";
        if (titleEl) titleEl.textContent = title || "Professional Title";
    }


    function renderPreviewContacts() {
        const el = document.getElementById("prevContacts");
        if (!el) return;

        const p = state.personal;
        const items = [];

        if (p.email)    items.push(`<li><i class="bi bi-envelope"></i> ${escapeHTML(p.email)}</li>`);
        if (p.phone)    items.push(`<li><i class="bi bi-telephone"></i> ${escapeHTML(p.phone)}</li>`);
        if (p.location) items.push(`<li><i class="bi bi-geo-alt"></i> ${escapeHTML(p.location)}</li>`);
        if (p.linkedin) items.push(`<li><i class="bi bi-linkedin"></i> ${escapeHTML(p.linkedin)}</li>`);
        if (p.github)   items.push(`<li><i class="bi bi-github"></i> ${escapeHTML(p.github)}</li>`);

        el.innerHTML = items.join("");
    }


    function renderPreviewSummary() {
        const el      = document.getElementById("prevSummary");
        const section = document.getElementById("prevSummarySection");
        if (!el || !section) return;

        const text = state.summary.trim();
        el.textContent = text;
        setSectionVisible(section, !!text);
    }


    function renderPreviewExperience() {
        const el      = document.getElementById("prevExperience");
        const section = document.getElementById("prevExperienceSection");
        if (!el || !section) return;

        const items = state.experience.filter((e) =>
            e.jobTitle || e.company || e.description
        );

        el.innerHTML = items.map((e) => {
            const range = humanRange(e.startDate, e.endDate);
            const companyLine = [e.company, e.location].filter(Boolean).join(" · ");

            return `
                <div class="cv-item">
                    <div class="cv-item__top">
                        <strong>${escapeHTML(e.jobTitle || "")}</strong>
                        ${range ? `<span>${escapeHTML(range)}</span>` : ""}
                    </div>
                    ${companyLine ? `<p class="cv-item__sub">${escapeHTML(companyLine)}</p>` : ""}
                    ${e.description ? `<p>${escapeHTML(e.description)}</p>` : ""}
                </div>
            `;
        }).join("");

        setSectionVisible(section, items.length > 0);
    }


    function renderPreviewEducation() {
        const el      = document.getElementById("prevEducation");
        const section = document.getElementById("prevEducationSection");
        if (!el || !section) return;

        const items = state.education.filter((e) =>
            e.degree || e.institution || e.description
        );

        el.innerHTML = items.map((e) => {
            const range = humanRange(e.startDate, e.endDate);

            return `
                <div class="cv-item">
                    <div class="cv-item__top">
                        <strong>${escapeHTML(e.degree || "")}</strong>
                        ${range ? `<span>${escapeHTML(range)}</span>` : ""}
                    </div>
                    ${e.institution ? `<p class="cv-item__sub">${escapeHTML(e.institution)}</p>` : ""}
                    ${e.description ? `<p>${escapeHTML(e.description)}</p>` : ""}
                </div>
            `;
        }).join("");

        setSectionVisible(section, items.length > 0);
    }


    function renderPreviewProjects() {
        const el      = document.getElementById("prevProjects");
        const section = document.getElementById("prevProjectsSection");
        if (!el || !section) return;

        const items = state.projects.filter((p) =>
            p.name || p.description || p.technologies
        );

        el.innerHTML = items.map((p) => {
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
                <div class="cv-item">
                    <div class="cv-item__top">
                        <strong>${escapeHTML(p.name || "")}</strong>
                    </div>
                    ${p.technologies ? `<p class="cv-item__sub">${escapeHTML(p.technologies)}</p>` : ""}
                    ${p.description ? `<p>${escapeHTML(p.description)}</p>` : ""}
                    ${links.length ? `<div class="cv-item__links">${links.join("")}</div>` : ""}
                </div>
            `;
        }).join("");

        setSectionVisible(section, items.length > 0);
    }


    function renderPreviewTags() {
        const skillsEl      = document.getElementById("prevSkills");
        const skillsSection = document.getElementById("prevSkillsSection");
        const langEl        = document.getElementById("prevLanguages");
        const langSection   = document.getElementById("prevLanguagesSection");

        if (skillsEl && skillsSection) {
            skillsEl.innerHTML = state.skills
                .map((s) => `<span>${escapeHTML(s)}</span>`)
                .join("");
            setSectionVisible(skillsSection, state.skills.length > 0);
        }

        if (langEl && langSection) {
            langEl.innerHTML = state.languages
                .map((s) => `<span>${escapeHTML(s)}</span>`)
                .join("");
            setSectionVisible(langSection, state.languages.length > 0);
        }
    }


    /* =====================================================
       QUICK FILTERS + SCROLL SPY
    ===================================================== */

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


    /* Click → smooth scroll + activate */

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.target;
            if (!id) return;

            const target = document.querySelector(`[data-section="${id}"]`);
            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            setActiveSection(id);
        });
    });


    /* Scroll Spy via IntersectionObserver */

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


    /* =====================================================
       DOWNLOAD CV
       Client-side only: opens a print view in a new tab
       and triggers the browser's print dialog (Save as PDF).
    ===================================================== */

    const downloadBtn = document.getElementById("downloadCV");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            const preview = document.getElementById("cvPreview");
            if (!preview) return;

            const clone = preview.cloneNode(true);

            /* Hide sections that are empty in the print version too */
            clone.querySelectorAll(".is-empty").forEach((el) => el.remove());

            const doc = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>CV — ${escapeHTML(state.personal.fullName || "My CV")}</title>
                    <style>
                        * { box-sizing: border-box; }
                        body {
                            font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
                            color: #1a1f2b;
                            background: #ffffff;
                            padding: 40px;
                            max-width: 900px;
                            margin: 0 auto;
                        }
                        h1 { margin: 0 0 6px; font-size: 32px; color: #10182a; }
                        h2 {
                            font-size: 12px;
                            letter-spacing: 2px;
                            text-transform: uppercase;
                            color: #B83E2B;
                            border-bottom: 1px solid rgba(16,24,42,0.12);
                            padding-bottom: 6px;
                            margin: 26px 0 12px;
                        }
                        p { line-height: 1.7; color: #2a3247; margin: 0; }
                        .cv-paper {
                            padding: 0;
                            border: none;
                            background: #ffffff;
                            box-shadow: none;
                            border-radius: 0;
                        }
                        .cv-paper__head {
                            padding-bottom: 18px;
                            margin-bottom: 22px;
                            border-bottom: 2px solid #E85D3F;
                            display: flex;
                            justify-content: space-between;
                            flex-wrap: wrap;
                            gap: 12px;
                        }
                        .cv-paper__title { color: #B83E2B; font-weight: 600; margin: 4px 0 0; }
                        .cv-paper__contacts {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                            display: flex;
                            flex-direction: column;
                            gap: 4px;
                            font-size: 13px;
                            color: #4a5468;
                            text-align: right;
                        }
                        .cv-paper__contacts li { justify-content: flex-end; }
                        .cv-paper__contacts i { display: none; }
                        .cv-paper__body {
                            display: grid;
                            grid-template-columns: 1.7fr 1fr;
                            gap: 40px;
                        }
                        .cv-paper__main,
                        .cv-paper__side { display: flex; flex-direction: column; gap: 22px; }
                        .cv-item { margin-top: 14px; }
                        .cv-item__top {
                            display: flex;
                            justify-content: space-between;
                            gap: 12px;
                            flex-wrap: wrap;
                        }
                        .cv-item__top strong { font-size: 15px; color: #10182a; }
                        .cv-item__top span { font-size: 12px; color: #6a7183; }
                        .cv-item__sub { font-size: 13px; color: #4a5468; font-weight: 600; margin: 2px 0 6px; }
                        .cv-paper__tags { display: flex; flex-wrap: wrap; gap: 8px; }
                        .cv-paper__tags span {
                            padding: 5px 12px;
                            border-radius: 999px;
                            font-size: 12px;
                            font-weight: 600;
                            color: #10182a;
                            background: rgba(232,93,63,0.14);
                            border: 1px solid rgba(232,93,63,0.35);
                        }
                        a { color: #B83E2B; text-decoration: none; }
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


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    renderPreview();
    setActiveSection("personal");

});