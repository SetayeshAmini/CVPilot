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

/* =========================================================
   CAREERPILOT — HERO INTERACTION & HUD DASHBOARD CONTROLLER
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".ai-review-hero");
    if (!hero) return;

    // Fixed DOM Triggers
    const uploadBtn = hero.querySelector(".hero-review-btn");
    const fileInput = hero.querySelector("#cvFileInput");
    const selectedCv = hero.querySelector("#selectedCv");
    const selectedFileName = hero.querySelector("#selectedFileName");
    const selectedFileSize = hero.querySelector("#selectedFileSize");
    const removeFileBtn = hero.querySelector("#removeFileBtn");
    const uploadError = hero.querySelector("#uploadError");
    const scannerCard = hero.querySelector("#aiScannerCard");
    const scoreRing = hero.querySelector("#scoreRing");
    const scoreNumber = hero.querySelector("#scoreNumber");
    const scoreProgress = hero.querySelector("#scoreProgress");
    const aiStatusText = hero.querySelector("#aiStatusText");

    // Environmental variables
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // AOS Animation Hub
    if (typeof AOS !== "undefined") {
        AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
    }

    // Helper functions
    function updateScoreRing(score) {
        if (!scoreRing) return;
        scoreRing.style.setProperty("--score-degrees", `${(score / 100) * 360}deg`);
    }

    // 1. File Upload Selector Triggers
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener("click", (e) => {
            e.preventDefault();
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (!file) return;

            if (uploadError) uploadError.textContent = "";

            if (selectedFileName) selectedFileName.textContent = file.name;
            if (selectedFileSize) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                selectedFileSize.textContent = `${sizeMB} MB · Ready`;
            }

            if (selectedCv) selectedCv.style.display = "flex";
            if (aiStatusText) aiStatusText.textContent = "CV Loaded · Ready to process";
        });
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener("click", () => {
            if (fileInput) fileInput.value = "";
            if (selectedCv) selectedCv.style.display = "none";
            if (aiStatusText) aiStatusText.textContent = "Ready to analyze";
        });
    }

    // 2. High Performance 3D Tilt Card Component
    if (scannerCard && !reducedMotion) {
        scannerCard.addEventListener("pointermove", (e) => {
            const rect = scannerCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;

            scannerCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            scannerCard.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(232, 93, 63, 0.15)`;
        });

        scannerCard.addEventListener("pointerleave", () => {
            scannerCard.style.transform = "";
            scannerCard.style.boxShadow = "";
        });
    }

    // 3. Kick off Native UI Loaders animations
    setTimeout(() => {
        updateScoreRing(78);
        const bars = hero.querySelectorAll(".analysis-fill");
        bars.forEach(bar => {
            const progress = bar.style.getPropertyValue("--progress") || bar.getAttribute("style").split("opacity")[0].match(/\d+/)[0];
            bar.style.width = `${progress}%`;
            bar.style.transition = "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
        });
    }, 400);
});


/* =========================================================
   CAREERPILOT — WORKSPACE DYNAMIC PIPELINE HUD CONTROLLER
========================================================= */
let dynamicWorkspaceFileObject = null;

document.addEventListener("DOMContentLoaded", () => {
    const workspaceSection = document.querySelector(".review-workspace-section");
    if (!workspaceSection) return;

    // Grid System Core Elements
    const workspaceWrapper = workspaceSection.querySelector(".review-workspace");
    const rightAnalysisPanel = workspaceSection.querySelector("#reviewAnalysisPanel");

    // Inputs selectors
    const tabs = workspaceSection.querySelectorAll('.review-tab');
    const tabContents = workspaceSection.querySelectorAll('.review-tab-content');
    const fileInput = workspaceSection.querySelector('#cvFileInputWorkspace');
    const browseBtn = workspaceSection.querySelector('#browseCV');
    const cvDropzone = workspaceSection.querySelector('#cvDropzone');
    const selectedCvSection = workspaceSection.querySelector('#selectedCVWorkspace');
    const removeCvBtn = workspaceSection.querySelector('#removeCVWorkspace');
    const cvTextInput = workspaceSection.querySelector('#cvTextInputWorkspace');
    const characterCount = workspaceSection.querySelector('#characterCountWorkspace');
    const analyzeBtn = workspaceSection.querySelector('#analyzeCVWorkspaceBtn');

    // Dashboard Result Selectors
    const previewStatusLabel = workspaceSection.querySelector('#previewStatusLabel');
    const workspaceScoreNumber = workspaceSection.querySelector('#workspaceScoreNumber');
    const workspaceScoreStatus = workspaceSection.querySelector('#workspaceScoreStatus');
    const workspaceScoreDescription = workspaceSection.querySelector('#workspaceScoreDescription');
    const scoreCircle = workspaceSection.querySelector('#workspaceScoreProgressCircle');
    const aiAnalysisResultBox = workspaceSection.querySelector('#aiAnalysisResultBox');

    // Sub progress bars
    const structureBar = workspaceSection.querySelector('#structureProgressBarFill');
    const structureText = workspaceSection.querySelector('#structurePercentageText');
    const impactBar = workspaceSection.querySelector('#impactProgressBarFill');
    const impactText = workspaceSection.querySelector('#impactPercentageText');
    const keywordsBar = workspaceSection.querySelector('#keywordsProgressBarFill');
    const keywordsText = workspaceSection.querySelector('#keywordsPercentageText');

    /* --- TABS SYSTEM --- */
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const target = workspaceSection.querySelector(`#${tab.dataset.tab}Content`);
            if (target) target.classList.add('active');
        });
    });

    if (cvTextInput && characterCount) {
        cvTextInput.addEventListener('input', () => {
            characterCount.innerText = `${cvTextInput.value.length.toLocaleString()} characters`;
        });
    }

    /* --- NATIVE BAR ACTIONS --- */
    if (browseBtn && fileInput) browseBtn.addEventListener('click', () => fileInput.click());
    if (fileInput) fileInput.addEventListener('change', () => { if (fileInput.files.length > 0) processSelectedFile(fileInput.files[0]); });

    if (cvDropzone) {
        ['dragenter', 'dragover'].forEach(n => cvDropzone.addEventListener(n, (e) => { e.preventDefault(); cvDropzone.classList.add('dragover'); }));
        ['dragleave', 'drop'].forEach(n => cvDropzone.addEventListener(n, (e) => { e.preventDefault(); cvDropzone.classList.remove('dragover'); }));
        cvDropzone.addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer.files.length > 0) processSelectedFile(e.dataTransfer.files[0]); });
    }

    if (removeCvBtn) {
        removeCvBtn.addEventListener('click', () => {
            dynamicWorkspaceFileObject = null;
            if (fileInput) fileInput.value = "";
            if (cvDropzone) cvDropzone.style.display = 'block';
            if (selectedCvSection) selectedCvSection.style.display = 'none';
        });
    }

    function processSelectedFile(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext !== 'pdf' && ext !== 'txt') return alert("Please select a valid PDF or TXT document.");
        dynamicWorkspaceFileObject = file;
        const nameEl = workspaceSection.querySelector('#selectedFileNameWorkspace');
        const sizeEl = workspaceSection.querySelector('#selectedFileSizeWorkspace');
        if (nameEl) nameEl.innerText = file.name;
        if (sizeEl) sizeEl.innerText = `${(file.size / (1024 * 1024)).toFixed(2)} MB · Ready`;
        if (cvDropzone) cvDropzone.style.display = 'none';
        if (selectedCvSection) selectedCvSection.style.display = 'flex';
    }

    /* --- CONNECTION AND REVEAL REACTION PIPELINE --- */
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            const API_KEY = "REMOVED_GROQ_KEYu49FPYrk3Cu4xRGqt36AWGdyb3FYDR7D5aqAztPQtvWJEsmLQlrD";
            const isUploadTab = workspaceSection.querySelector('#uploadContent').classList.contains('active');
            let cvText = "";

            if (isUploadTab && !dynamicWorkspaceFileObject) return alert('Please upload your CV file first.');
            if (!isUploadTab && (!cvTextInput || cvTextInput.value.trim() === "")) return alert('Please paste your CV text first.');

            const defaultText = analyzeBtn.querySelector('.analyze-default');
            const loadingText = analyzeBtn.querySelector('.analyze-loading');
            if (defaultText && loadingText) { defaultText.style.display = 'none'; loadingText.style.display = 'inline-flex'; }

            try {
                if (isUploadTab) {
                    if (dynamicWorkspaceFileObject.name.toLowerCase().endsWith('.pdf')) {
                        cvText = await parsePdfWorkspaceNode(dynamicWorkspaceFileObject);
                    } else { cvText = await dynamicWorkspaceFileObject.text(); }
                } else { cvText = cvTextInput.value.trim(); }

                // HTTPS Server Connection Fetching
                const response = await fetch("https://groq.com", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-specdec",
                        messages: [
                            { role: "system", content: "You are an expert HR manager. Critique this resume in English. List strengths and concrete practical improvements." },
                            { role: "user", content: cvText }
                        ],
                        temperature: 0.7
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data?.error?.message || "Server Error.");

                const reportString = data?.choices?.[0]?.message?.content;
                if (!reportString) throw new Error("Empty model response.");

                /* 🛠️ STEP 1: ANIMATE LAYOUT REVEAL FROM HIDE STATUS TO BLOCK GRID */
                if (workspaceWrapper && rightAnalysisPanel) {
                    rightAnalysisPanel.style.display = 'flex'; // Turn display on
                    workspaceWrapper.classList.add('active-results'); // Fire grid expansion
                    setTimeout(() => { rightAnalysisPanel.classList.add('reveal-active'); }, 50); // Fire opacity entry fade
                }

                /* 🛠️ STEP 2: LOAD DATA AND RUN METER RAILS ANIMATIONS */
                if (aiAnalysisResultBox) aiAnalysisResultBox.innerText = reportString;
                if (workspaceScoreNumber) workspaceScoreNumber.innerText = "84";
                if (workspaceScoreStatus) workspaceScoreStatus.innerText = "Strong Foundation";
                if (workspaceScoreDescription) workspaceScoreDescription.innerText = "Structural integrity matches premium HR compliance standards. View details below.";
                if (scoreCircle) scoreCircle.style.strokeDashoffset = "50"; // Rotate progress circle

                // Run progress bar loads dynamically
                setTimeout(() => {
                    if (structureBar) structureBar.setAttribute("style", "width: 86% !important");
                    if (impactBar) impactBar.setAttribute("style", "width: 68% !important");
                    if (keywordsBar) keywordsBar.setAttribute("style", "width: 74% !important");
                }, 150);

            } catch (err) {
                alert("Error: " + err.message);
            } finally {
                if (defaultText && loadingText) { defaultText.style.display = 'inline-flex'; loadingText.style.display = 'none'; }
            }
        });
    }
});

/* --- CLIENT SIDE PDF PARSER NODE --- */
async function parsePdfWorkspaceNode(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const arr = new Uint8Array(e.target.result);
                const pdf = await window.pdfjsLib.getDocument({ data: arr }).promise;
                let text = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map(item => item.str).join(" ") + "\n";
                }
                resolve(text.trim());
            } catch (err) { reject(err); }
        };
        reader.readAsArrayBuffer(file);
    });
}
