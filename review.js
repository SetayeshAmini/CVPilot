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

    // 1. FIXED BUTTON: Start AI Review is now a normal button with dynamic smooth scrolling
    if (uploadBtn) {
        uploadBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Prevents page jumping or instant refreshing
            
            // Finds the main upload workspace anchor lower on your landing page
            const targetWorkspace = document.getElementById("review-workspace");
            if (targetWorkspace) {
                targetWorkspace.scrollIntoView({ 
                    behavior: "smooth", 
                    block: "start" 
                });
            }
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
   CAREERPILOT AI CV REVIEW
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GLOBAL STATE
    ===================================================== */

    let workspaceUploadedFileObject = null;
    let workspaceExtractedCVText = "";


    /* =====================================================
       MAIN ELEMENTS
    ===================================================== */

    const workspace = document.querySelector("#review-workspace");

    if (!workspace) {
        console.error("Review workspace not found.");
        return;
    }

    const tabs = workspace.querySelectorAll(".review-tab");
    const tabContents = workspace.querySelectorAll(".review-tab-content");

    const fileInput =
        workspace.querySelector("#cvFileInputWorkspace");

    const browseBtn =
        workspace.querySelector("#browseCV");

    const dropzone =
        workspace.querySelector("#cvDropzone");

    const selectedCV =
        workspace.querySelector("#selectedCVWorkspace");

    const removeCVBtn =
        workspace.querySelector("#removeCVWorkspace");

    const selectedFileName =
        workspace.querySelector("#selectedFileNameWorkspace");

    const selectedFileSize =
        workspace.querySelector("#selectedFileSizeWorkspace");

    const textInput =
        workspace.querySelector("#cvTextInputWorkspace");

    const characterCounter =
        workspace.querySelector("#characterCountWorkspace");

    const analyzeBtn =
        workspace.querySelector("#analyzeCVWorkspaceBtn");

    const analysisPanel =
        workspace.querySelector("#reviewAnalysisPanel");

    const workspaceContainer =
        workspace.querySelector(".review-workspace");


    /* =====================================================
       TAB SYSTEM
    ===================================================== */

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(item => {
                item.classList.remove("active");
            });

            tabContents.forEach(content => {
                content.classList.remove("active");
            });

            tab.classList.add("active");

            const targetTab = tab.dataset.tab;

            const targetContent =
                workspace.querySelector(`#${targetTab}Content`);

            if (targetContent) {
                targetContent.classList.add("active");
            }

        });

    });


    /* =====================================================
       CHARACTER COUNTER
    ===================================================== */

    if (textInput) {

        textInput.addEventListener("input", () => {

            const length = textInput.value.length;

            if (characterCounter) {
                characterCounter.textContent =
                    `${length.toLocaleString()} characters`;
            }

        });

    }


    /* =====================================================
       BROWSE BUTTON
    ===================================================== */

    if (browseBtn && fileInput) {

        browseBtn.addEventListener("click", () => {
            fileInput.click();
        });

    }


    /* =====================================================
       FILE INPUT
    ===================================================== */

    if (fileInput) {

        fileInput.addEventListener("change", async () => {

            const file = fileInput.files[0];

            if (!file) {
                return;
            }

            await handleSelectedFile(file);

        });

    }


    /* =====================================================
       DRAG & DROP
    ===================================================== */

    if (dropzone) {

        dropzone.addEventListener("dragover", event => {

            event.preventDefault();

            dropzone.classList.add("dragover");

        });


        dropzone.addEventListener("dragleave", event => {

            event.preventDefault();

            dropzone.classList.remove("dragover");

        });


        dropzone.addEventListener("drop", async event => {

            event.preventDefault();

            dropzone.classList.remove("dragover");

            const file =
                event.dataTransfer.files[0];

            if (!file) {
                return;
            }

            await handleSelectedFile(file);

        });

    }


    /* =====================================================
       HANDLE SELECTED FILE
    ===================================================== */

    async function handleSelectedFile(file) {

        const fileExtension =
            file.name.split(".").pop().toLowerCase();


        /* ---------------------------------------------
           ALLOWED FILE TYPES
        --------------------------------------------- */

        const allowedTypes = [
            "pdf",
            "doc",
            "docx"
        ];

        if (!allowedTypes.includes(fileExtension)) {

            alert(
                "Please select a PDF, DOC or DOCX file."
            );

            return;
        }


        /* ---------------------------------------------
           MAX FILE SIZE = 10MB
        --------------------------------------------- */

        const maxSize =
            10 * 1024 * 1024;

        if (file.size > maxSize) {

            alert(
                "The maximum file size is 10MB."
            );

            return;
        }


        /* ---------------------------------------------
           SAVE FILE
        --------------------------------------------- */

        workspaceUploadedFileObject = file;


        /* ---------------------------------------------
           SHOW FILE INFORMATION
        --------------------------------------------- */

        if (selectedFileName) {
            selectedFileName.textContent =
                file.name;
        }

        if (selectedFileSize) {

            const sizeMB =
                (file.size / 1024 / 1024).toFixed(2);

            selectedFileSize.textContent =
                `${sizeMB} MB · Ready for analysis`;

        }


        /* ---------------------------------------------
           CHANGE UI
        --------------------------------------------- */

        if (dropzone) {
            dropzone.style.display = "none";
        }

        if (selectedCV) {
            selectedCV.style.display = "flex";
        }


        /* ---------------------------------------------
           READ FILE
        --------------------------------------------- */

        try {

            setPreviewStatus("READING");

            if (fileExtension === "pdf") {

                workspaceExtractedCVText =
                    await extractPDFText(file);

            }

            else if (
                fileExtension === "doc" ||
                fileExtension === "docx"
            ) {

                /*
                   DOC / DOCX cannot be read by PDF.js.

                   For the current test version,
                   the browser keeps the file selected.

                   We can add DOCX extraction later
                   without changing the UI.
                */

                workspaceExtractedCVText = "";

                setPreviewStatus("FILE READY");

                return;
            }


            /* -----------------------------------------
               CLEAN EXTRACTED TEXT
            ----------------------------------------- */

            workspaceExtractedCVText =
                workspaceExtractedCVText.trim();


            if (!workspaceExtractedCVText) {

                throw new Error(
                    "No readable text was found."
                );

            }


            /* -----------------------------------------
               ALSO PUT TEXT INTO TEXTAREA
            ----------------------------------------- */

            if (textInput) {

                textInput.value =
                    workspaceExtractedCVText;

                textInput.dispatchEvent(
                    new Event("input", {
                        bubbles: true
                    })
                );

            }


            setPreviewStatus("READY");

        }

        catch (error) {

            console.error(
                "File reading error:",
                error
            );

            workspaceExtractedCVText = "";

            setPreviewStatus("ERROR");

            alert(
                "We could not read this PDF. Please make sure the PDF contains selectable text."
            );

        }

    }


    /* =====================================================
       PDF TEXT EXTRACTION
    ===================================================== */

    async function extractPDFText(file) {

        if (typeof pdfjsLib === "undefined") {

            throw new Error(
                "PDF.js is not loaded."
            );

        }


        const arrayBuffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjsLib
                .getDocument({
                    data: arrayBuffer
                })
                .promise;


        let fullText = "";


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(pageNumber);


            const textContent =
                await page.getTextContent();


            const pageText =
                textContent.items
                    .map(item => item.str)
                    .join(" ");


            fullText +=
                pageText + "\n\n";

        }


        return fullText;

    }


    /* =====================================================
       REMOVE SELECTED FILE
    ===================================================== */

    if (removeCVBtn) {

        removeCVBtn.addEventListener("click", () => {

            workspaceUploadedFileObject = null;

            workspaceExtractedCVText = "";


            if (fileInput) {
                fileInput.value = "";
            }


            if (textInput) {
                textInput.value = "";
            }


            if (characterCounter) {
                characterCounter.textContent =
                    "0 characters";
            }


            if (dropzone) {
                dropzone.style.display = "block";
            }


            if (selectedCV) {
                selectedCV.style.display = "none";
            }


            if (analysisPanel) {
                analysisPanel.style.display = "none";
            }


            if (workspaceContainer) {
                workspaceContainer.classList.remove(
                    "active-results"
                );
            }


            setPreviewStatus("READY");

        });

    }


    /* =====================================================
       PREVIEW STATUS
    ===================================================== */

    function setPreviewStatus(status) {

        const statusElement =
            workspace.querySelector(
                "#previewStatusLabel"
            );

        if (!statusElement) {
            return;
        }


        statusElement.innerHTML =
            `<span></span>${status}`;

    }


    /* =====================================================
       MAKE FUNCTIONS AVAILABLE FOR PART 2
    ===================================================== */

    window.CareerPilotWorkspace = {

        getFile: () =>
            workspaceUploadedFileObject,

        getCVText: () =>
            workspaceExtractedCVText,

        getTextInput: () =>
            textInput ? textInput.value.trim() : "",

        getWorkspace: () =>
            workspace,

        getAnalyzeButton: () =>
            analyzeBtn,

        getAnalysisPanel: () =>
            analysisPanel,

        getWorkspaceContainer: () =>
            workspaceContainer,

        setStatus: setPreviewStatus

    };

});
/* =========================================================
   GROQ API + AI CV REVIEW
========================================================= */

const BACKEND_API_URL = "http://127.0.0.1:5000/api/analyze";

document.addEventListener("DOMContentLoaded", () => {

    const workspace =
        document.querySelector("#review-workspace");

    if (!workspace) {
        console.error("Review workspace not found.");
        return;
    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const analyzeBtn =
        workspace.querySelector("#analyzeCVWorkspaceBtn");

    const analysisPanel =
        workspace.querySelector("#reviewAnalysisPanel");

    const workspaceContainer =
        workspace.querySelector(".review-workspace");

    const resultBox =
        workspace.querySelector("#aiAnalysisResultBox");

    const previewStatus =
        workspace.querySelector("#previewStatusLabel");


    if (!analyzeBtn) {
        console.error("Analyze button not found.");
        return;
    }


    /* =====================================================
       FORCE CORRECT LAYOUT
    ===================================================== */

    if (workspaceContainer) {

        workspaceContainer.style.setProperty(
            "display",
            "flex",
            "important"
        );

        workspaceContainer.style.setProperty(
            "flex-direction",
            "column",
            "important"
        );

        workspaceContainer.style.setProperty(
            "gap",
            "30px",
            "important"
        );

        workspaceContainer.style.setProperty(
            "width",
            "100%",
            "important"
        );
    }


    /* =====================================================
       AI PANEL ALWAYS VISIBLE
    ===================================================== */

    showAnalysisPanel();


    /* =====================================================
       RESET RESULT BOX LAYOUT
    ===================================================== */

    resetResultBox();


    /* =====================================================
       ANALYZE BUTTON
    ===================================================== */

    analyzeBtn.addEventListener(
        "click",
        analyzeCV
    );


    /* =====================================================
       ANALYZE CV
    ===================================================== */

    async function analyzeCV() {

        let cvText = "";


        /* =================================================
           GET CV TEXT
        ================================================= */

        if (
            window.CareerPilotWorkspace &&
            typeof window.CareerPilotWorkspace.getCVText ===
            "function"
        ) {

            cvText =
                window.CareerPilotWorkspace.getCVText();
        }


        /* =================================================
           GET TEXTAREA TEXT
        ================================================= */

        const textarea =
            workspace.querySelector(
                "#cvTextInputWorkspace"
            );

        const textareaText =
            textarea
                ? textarea.value.trim()
                : "";


        if (textareaText.length > 0) {
            cvText = textareaText;
        }


        /* =================================================
           CHECK CV
        ================================================= */

        if (
            !cvText ||
            cvText.length < 30
        ) {

            alert(
                "Please upload your CV or paste your CV text first."
            );

            return;
        }



        /* =================================================
           SHOW LOADING
        ================================================= */

        setLoading(true);

        setStatus("ANALYZING");

        showAnalysisPanel();

        resetResultBox();


        if (workspaceContainer) {

            workspaceContainer.classList.add(
                "active-results"
            );
        }


        if (resultBox) {

            resultBox.innerHTML = `

                <div
                    style="
                        margin:0 !important;
                        padding:0 !important;
                        min-height:0 !important;
                        height:auto !important;
                        line-height:1.5 !important;
                        display:flex !important;
                        align-items:center !important;
                        gap:8px !important;
                        color:#b9c5d3 !important;
                        font-size:13px !important;
                    "
                >

                    <i class="bi bi-stars"></i>

                    <span>
                        CareerPilot AI is analyzing your CV...
                    </span>

                </div>

            `;
        }


        try {


            /* =================================================
               PROMPT
            ================================================= */

            const prompt = `

You are CareerPilot AI, a professional CV reviewer.

Analyze the CV below.

Return ONLY valid JSON.

Use exactly:

{
    "score": 0,
    "structure": 0,
    "impact": 0,
    "keywords": 0,
    "status": "string",
    "description": "string",
    "analysis": "string"
}

Rules:

score = 0-100
structure = 0-100
impact = 0-100
keywords = 0-100

The analysis must be compact and easy to read.

Start with one short overall assessment.

Then write numbered sections.

IMPORTANT:
Each numbered section MUST be on ONE SINGLE LINE.

Use this exact style:

1. Overall Quality: Your explanation here.

2. Structure: Your explanation here.

3. Professional Impact: Your explanation here.

4. Keywords & ATS: Your explanation here.

5. Skills: Your explanation here.

6. Work Experience: Your explanation here.

7. Education: Your explanation here.

8. Missing or Weak Areas: Your explanation here.

9. Recommended Improvements: Your explanation here.

NEVER return:

1.

Overall Quality:

Text here.

NEVER put the number on a separate line.

NEVER put the title on a separate line.

Do not use Markdown.

Do not use bullet points.

Do not use **.

Do not use ##.

Keep the analysis concise.

CV:

${cvText}

`;


            /* =================================================
               GROQ REQUEST
            ================================================= */
            const BACKEND_API_URL = "https://cvpilot-1.onrender.com/api/analyze";
            const response = await fetch(
               BACKEND_API_URL,
            {
               method: "POST",

               headers: {
                 "Content-Type": "application/json"
               },

               body: JSON.stringify({
                   cv_text: prompt
                })
            }
        );


            /* =================================================
               CHECK RESPONSE
            ================================================= */

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "GROQ STATUS:",
                    response.status
                );

                console.error(
                    "GROQ ERROR:",
                    errorText
                );

                throw new Error(
                    `Groq API Error ${response.status}: ${errorText}`
                );
            }


            /* =================================================
               READ RESPONSE
            ================================================= */

            const data =
                await response.json();


            console.log(
                "Groq Response:",
                data
            );


            const aiMessage =
                data?.choices?.[0]?.message?.content;


            console.log(
                "AI MESSAGE:",
                aiMessage
            );


            if (!aiMessage) {

                throw new Error(
                    "No AI response was returned."
                );
            }


            /* =================================================
               CLEAN JSON
            ================================================= */

            let cleanedResponse =
                aiMessage.trim();


            cleanedResponse =
                cleanedResponse
                    .replace(
                        /^```json\s*/i,
                        ""
                    )
                    .replace(
                        /^```\s*/i,
                        ""
                    )
                    .replace(
                        /\s*```$/i,
                        ""
                    )
                    .trim();


            /* =================================================
               PARSE JSON
            ================================================= */

            let aiResult;


            try {

                aiResult =
                    JSON.parse(
                        cleanedResponse
                    );

            }

            catch (error) {

                console.error(
                    "INVALID AI JSON:",
                    cleanedResponse
                );

                throw new Error(
                    "The AI returned an invalid result."
                );
            }


            console.log(
                "FINAL AI RESULT:",
                aiResult
            );


            /* =================================================
               DISPLAY
            ================================================= */

            displayAIResults(
                aiResult
            );


            setStatus(
                "READY"
            );

        }

        catch (error) {

            console.error(
                "CareerPilot AI Error:",
                error
            );


            setStatus(
                "ERROR"
            );


            if (resultBox) {

                resultBox.innerHTML = `

                    <div
                        style="
                            margin:0 !important;
                            padding:0 !important;
                            min-height:0 !important;
                            height:auto !important;
                            color:#ff8b7a !important;
                            font-size:13px !important;
                            line-height:1.5 !important;
                        "
                    >

                        <strong>
                            Analysis failed
                        </strong>

                        <p
                            style="
                                margin:5px 0 0 0 !important;
                                padding:0 !important;
                            "
                        >
                            ${escapeAIHTML(
                                error.message
                            )}
                        </p>

                    </div>

                `;
            }


            alert(
                "AI analysis failed. Please check your API key and internet connection."
            );
        }

        finally {

            setLoading(false);
        }
    }


    /* =====================================================
       SHOW ANALYSIS PANEL
    ===================================================== */

    function showAnalysisPanel() {

        if (!analysisPanel) {
            return;
        }


        analysisPanel.style.setProperty(
            "display",
            "flex",
            "important"
        );

        analysisPanel.style.setProperty(
            "visibility",
            "visible",
            "important"
        );

        analysisPanel.style.setProperty(
            "opacity",
            "1",
            "important"
        );

        analysisPanel.style.setProperty(
            "width",
            "100%",
            "important"
        );

        analysisPanel.style.setProperty(
            "max-width",
            "100%",
            "important"
        );

        analysisPanel.style.setProperty(
            "height",
            "auto",
            "important"
        );

        analysisPanel.style.setProperty(
            "min-height",
            "0",
            "important"
        );
    }


    /* =====================================================
       RESET RESULT BOX
    ===================================================== */
     function resetResultBox() {
    if (!resultBox) return;
    resultBox.style.setProperty("max-height", "380px", "important");
    resultBox.style.setProperty("margin-top", "20px", "important");
    resultBox.style.setProperty("padding", "10px 15px", "important"); 
    resultBox.style.setProperty("overflow-y", "auto", "important");
}

   
    /* =====================================================
       LOADING BUTTON
    ===================================================== */

    function setLoading(
        isLoading
    ) {

        const defaultContent =
            analyzeBtn.querySelector(
                ".analyze-default"
            );

        const loadingContent =
            analyzeBtn.querySelector(
                ".analyze-loading"
            );


        analyzeBtn.disabled =
            isLoading;


        if (defaultContent) {

            defaultContent.style.display =
                isLoading
                    ? "none"
                    : "inline-flex";
        }


        if (loadingContent) {

            loadingContent.style.display =
                isLoading
                    ? "inline-flex"
                    : "none";
        }
    }


    /* =====================================================
       STATUS
    ===================================================== */

    function setStatus(
        status
    ) {

        if (!previewStatus) {
            return;
        }


        previewStatus.innerHTML =
            `<span></span>${status}`;
    }

});


/* =========================================================
   DISPLAY AI RESULTS
========================================================= */

function displayAIResults(
    result
) {

    const workspace =
        document.querySelector(
            "#review-workspace"
        );


    if (!workspace) {
        return;
    }


    const analysisPanel =
        workspace.querySelector(
            "#reviewAnalysisPanel"
        );


    const resultBox =
        workspace.querySelector(
            "#aiAnalysisResultBox"
        );


    /* =====================================================
       FORCE PANEL
    ===================================================== */

    if (analysisPanel) {

        analysisPanel.style.setProperty(
            "display",
            "flex",
            "important"
        );

        analysisPanel.style.setProperty(
            "visibility",
            "visible",
            "important"
        );

        analysisPanel.style.setProperty(
            "opacity",
            "1",
            "important"
        );

        analysisPanel.style.setProperty(
            "width",
            "100%",
            "important"
        );

        analysisPanel.style.setProperty(
            "height",
            "auto",
            "important"
        );

        analysisPanel.style.setProperty(
            "min-height",
            "0",
            "important"
        );
    }


    /* =====================================================
       SCORE ELEMENTS
    ===================================================== */

    const scoreNumber =
        workspace.querySelector(
            "#workspaceScoreNumber"
        );

    const scoreStatus =
        workspace.querySelector(
            "#workspaceScoreStatus"
        );

    const scoreDescription =
        workspace.querySelector(
            "#workspaceScoreDescription"
        );

    const scoreCircle =
        workspace.querySelector(
            "#workspaceScoreProgressCircle"
        );


    /* =====================================================
       METRICS
    ===================================================== */

    const structureBar =
        workspace.querySelector(
            "#structureProgressBarFill"
        );

    const structureText =
        workspace.querySelector(
            "#structurePercentageText"
        );

    const impactBar =
        workspace.querySelector(
            "#impactProgressBarFill"
        );

    const impactText =
        workspace.querySelector(
            "#impactPercentageText"
        );

    const keywordsBar =
        workspace.querySelector(
            "#keywordsProgressBarFill"
        );

    const keywordsText =
        workspace.querySelector(
            "#keywordsPercentageText"
        );


    /* =====================================================
       SCORES
    ===================================================== */

    const score =
        normalizeScore(
            result.score
        );

    const structure =
        normalizeScore(
            result.structure
        );

    const impact =
        normalizeScore(
            result.impact
        );

    const keywords =
        normalizeScore(
            result.keywords
        );


    /* =====================================================
       SCORE
    ===================================================== */

    if (scoreNumber) {

        animateScore(
            scoreNumber,
            score
        );
    }


    if (scoreStatus) {

        scoreStatus.textContent =
            result.status ||
            getScoreStatus(
                score
            );
    }


    if (scoreDescription) {

        scoreDescription.textContent =
            result.description ||
            getScoreDescription(
                score
            );
    }


    updateScoreCircle(
        scoreCircle,
        score
    );


    /* =====================================================
       METRICS
    ===================================================== */

    updateMetric(
        structureBar,
        structureText,
        structure
    );


    updateMetric(
        impactBar,
        impactText,
        impact
    );


    updateMetric(
        keywordsBar,
        keywordsText,
        keywords
    );


    /* =====================================================
       AI TEXT
    ===================================================== */

    if (resultBox) {

        resetAnalysisBoxForFinalResult(
            resultBox
        );


        resultBox.innerHTML =
            formatAIAnalysis(
                result.analysis ||
                "No detailed analysis was returned."
            );
    }
}


/* =========================================================
   RESET FINAL ANALYSIS BOX
========================================================= */

function resetAnalysisBoxForFinalResult(
    box
) {

    box.style.setProperty(
        "height",
        "auto",
        "important"
    );

    box.style.setProperty(
        "min-height",
        "0",
        "important"
    );

    box.style.setProperty(
        "max-height",
        "380px",
        "important"
    );

    box.style.setProperty(
        "overflow-y",
        "auto",
        "important"
    );
}


/* =========================================================
   NORMALIZE SCORE
========================================================= */

function normalizeScore(
    value
) {

    const number =
        Number(value);


    if (Number.isNaN(number)) {
        return 0;
    }


    return Math.max(
        0,
        Math.min(
            100,
            Math.round(number)
        )
    );
}


/* =========================================================
   ANIMATE SCORE
========================================================= */

function animateScore(
    element,
    target
) {

    const duration =
        1000;

    const startTime =
        performance.now();


    function update(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        const current =
            Math.floor(
                progress *
                target
            );


        element.textContent =
            current;


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                update
            );
        }
    }


    requestAnimationFrame(
        update
    );
}


/* =========================================================
   SCORE CIRCLE
========================================================= */

function updateScoreCircle(
    circle,
    score
) {

    if (!circle) {
        return;
    }


    const radius =
        50;


    const circumference =
        2 *
        Math.PI *
        radius;


    const offset =
        circumference -
        (
            score /
            100
        ) *
        circumference;


    circle.style.strokeDasharray =
        `${circumference}`;


    circle.style.strokeDashoffset =
        `${circumference}`;


    circle.style.transition =
        "stroke-dashoffset 1.2s ease";


    requestAnimationFrame(
        () => {

            circle.style.strokeDashoffset =
                `${offset}`;
        }
    );
}


/* =========================================================
   UPDATE METRIC
========================================================= */

function updateMetric(
    bar,
    text,
    value
) {

    if (bar) {

        bar.style.width =
            `${value}%`;
    }


    if (text) {

        text.textContent =
            `${value}%`;
    }
}


/* =========================================================
   SCORE STATUS
========================================================= */

function getScoreStatus(
    score
) {

    if (score >= 90) {
        return "Excellent CV";
    }

    if (score >= 80) {
        return "Very Strong CV";
    }

    if (score >= 70) {
        return "Strong Foundation";
    }

    if (score >= 60) {
        return "Good, But Needs Improvement";
    }

    if (score >= 50) {
        return "Needs Improvement";
    }

    return "Needs Major Improvements";
}


/* =========================================================
   SCORE DESCRIPTION
========================================================= */

function getScoreDescription(
    score
) {

    if (score >= 90) {

        return "Your CV is highly polished and presents your experience very effectively.";
    }

    if (score >= 80) {

        return "Your CV has a strong foundation with a few areas that could be improved.";
    }

    if (score >= 70) {

        return "Your CV is solid, but improving structure, impact and keywords can make it stronger.";
    }

    if (score >= 60) {

        return "Your CV has potential but several areas should be improved before applying.";
    }

    return "Your CV needs several important improvements to create a stronger professional impression.";
}


/* =========================================================
   FORMAT AI ANALYSIS
   NO OLD ANALYSIS CLASSES
   NO BIG SPACING
========================================================= */

function formatAIAnalysis(
    text
) {

    if (!text) {
        return "";
    }


    /* =====================================================
       CLEAN
    ===================================================== */

    // ⚡ FIX: Convert literal "\n" strings into real line breaks securely
    let cleanText = String(text)
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/\\n/g, '\n') // 🟢 تیر خلاص برای تبدیل عبارت \n به اینتر واقعی
      .trim();



    /* =====================================================
       REMOVE MULTIPLE EMPTY LINES
    ===================================================== */

    cleanText =
        cleanText.replace(
            /\n{2,}/g,
            "\n"
        );


    /* =====================================================
       SPLIT
    ===================================================== */

    let lines =
        cleanText
            .split("\n")
            .map(
                line =>
                    line.trim()
            )
            .filter(
                line =>
                    line.length > 0
            );


    /* =====================================================
       JOIN BROKEN NUMBER + TITLE

       1.
       Overall Quality: text

       =>
       1. Overall Quality: text
    ===================================================== */

    const finalLines = [];


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        let line =
            lines[i];


        const numberOnly =
            line.match(
                /^(\d+)[.)]$/
            );


        if (
            numberOnly &&
            i + 1 < lines.length
        ) {

            line =
                numberOnly[1] +
                ". " +
                lines[i + 1];

            i++;
        }


        finalLines.push(
            line
        );
    }


    /* =====================================================
       BUILD ONE COMPACT TEXT AREA
    ===================================================== */

    let html = `

        <div
            style="
                display:block !important;
                width:100% !important;
                margin:0 0 2px 0 !important;
                padding:0 !important;
                min-height:0 !important;
                height:auto !important;
                line-height:1.55 !important;
                font-size:13.5px !important;
            "
        >

            <div
                style="
                    display:block !important;
                    margin:0 0 2px 0 !important;
                    padding:0 !important;
                    height:auto !important;
                    min-height:0 !important;
                    line-height:1.2 !important;
                    color:#E85D3F !important;
                    font-size:10px !important;
                    font-weight:700 !important;
                    letter-spacing:1.5px !important;
                    text-transform:uppercase !important;
                "
            >

                <i class="bi bi-stars"></i>
                AI CV REVIEW

            </div>

            <div
                style="
                    display:block !important;
                    width:100% !important;
                    margin:0 0 2px 0 !important;
                    padding:0 !important;
                    height:auto !important;
                    min-height:0 !important;
                "
            >
    `;


    let introFound =
        false;


    /* =====================================================
       PROCESS TEXT
    ===================================================== */

    finalLines.forEach(
        line => {

            line =
                line
                    .replace(
                        /^[-•*]\s*/,
                        ""
                    )
                    .trim();


            if (!line) {
                return;
            }


            /* =================================================
               NUMBER + TITLE + DESCRIPTION
            ================================================= */

            const section =
                line.match(
                    /^(\d+)[.)]\s*(.*?)(?::|-)\s*(.*)$/i
                );


            if (section) {

                const number =
                    section[1];

                const title =
                    section[2].trim();

                const description =
                    section[3].trim();


                html += `

                    <div
                        style="
                            display:block !important;
                            width:100% !important;
                            margin:0 0 6px 0 !important;
                            padding:0 !important;
                            height:auto !important;
                            min-height:0 !important;
                            line-height:1.55 !important;
                            color:#b9c5d3 !important;
                            font-size:13.5px !important;
                            font-weight:400 !important;
                        "
                    >

                        <span
                            style="
                                color:#E85D3F !important;
                                font-weight:700 !important;
                                margin:0 4px 0 0 !important;
                            "
                        >
                            ${number}.
                        </span>

                        <strong
                            style="
                                color:#edf2f7 !important;
                                font-weight:600 !important;
                                margin:0 4px 0 0 !important;
                            "
                        >
                            ${escapeAIHTML(title)}:
                        </strong>

                        <span
                            style="
                                color:#b9c5d3 !important;
                                font-weight:400 !important;
                                margin:0 !important;
                                padding:0 !important;
                            "
                        >
                            ${escapeAIHTML(description)}
                        </span>

                    </div>

                `;

                return;
            }


            /* =================================================
               NUMBERED TITLE WITHOUT DESCRIPTION
            ================================================= */

            const titleOnly =
                line.match(
                    /^(\d+)[.)]\s*(.*)$/i
                );


            if (titleOnly) {

                html += `

                    <div
                        style="
                            display:block !important;
                            width:100% !important;
                            margin:0 0 2px 0 !important;
                            padding:0 !important;
                            height:auto !important;
                            min-height:0 !important;
                            line-height:1.55 !important;
                        "
                    >

                        <span
                            style="
                                color:#E85D3F !important;
                                font-weight:700 !important;
                                margin-right:4px !important;
                            "
                        >
                            ${titleOnly[1]}.
                        </span>

                        <strong
                            style="
                                color:#edf2f7 !important;
                                font-weight:600 !important;
                            "
                        >
                            ${escapeAIHTML(
                                titleOnly[2]
                            )}
                        </strong>

                    </div>

                `;

                return;
            }


            /* =================================================
               INTRO
            ================================================= */

            if (!introFound) {

                html += `

                    <div
                        style="
                            display:block !important;
                            width:100% !important;
                            margin:0 0 2px 0 !important;
                            padding:0 !important;
                            height:auto !important;
                            min-height:0 !important;
                            color:#c5cfdb !important;
                            font-size:13.5px !important;
                            line-height:1.55 !important;
                        "
                    >
                        ${escapeAIHTML(line)}
                    </div>

                `;


                introFound =
                    true;

                return;
            }


            /* =================================================
               EXTRA TEXT
            ================================================= */

            html += `

                <div
                    style="
                        display:block !important;
                        width:100% !important;
                        margin:0 0 6px 0 !important;
                        padding:0 !important;
                        height:auto !important;
                        min-height:0 !important;
                        color:#b9c5d3 !important;
                        font-size:13.5px !important;
                        line-height:1.55 !important;
                    "
                >
                    ${escapeAIHTML(line)}
                </div>

            `;
        }
    );


    /* =====================================================
       CLOSE
    ===================================================== */

    html += `

            </div>

        </div>

    `;


    return html;
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeAIHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;
}
/* =========================================================
   CAREERPILOT — SECTION 3 INTERACTIVE METRICS HUB
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const detailsSection = document.querySelector(".ai-review-details");
    if (!detailsSection) return;

    const categories = detailsSection.querySelectorAll(".review-category");
    const previewTitle = detailsSection.querySelector("#previewTitle");
    const previewScore = detailsSection.querySelector("#previewScore");
    const previewLabel = detailsSection.querySelector("#previewLabel");
    const previewDescription = detailsSection.querySelector("#previewDescription");
    const previewRecommendation = detailsSection.querySelector("#previewRecommendation");
    const contentBar = detailsSection.querySelector("#contentBar");
    const relevanceBar = detailsSection.querySelector("#relevanceBar");
    const contentValue = detailsSection.querySelector("#contentValue");
    const relevanceValue = detailsSection.querySelector("#relevanceValue");

    // Local Dataset representing metric branches instantly without internet lag
    const localizedReviewData = {
        score: { title: "Overall CV Score", score: 78, label: "GOOD FOUNDATION", description: "Your CV has a solid foundation, but several areas could be improved to make it more competitive.", recommendation: "Add measurable achievements to your experience section.", content: 82, relevance: 74 },
        ats: { title: "ATS Compatibility", score: 85, label: "HIGH COMPLIANCE", description: "Your CV format clears standard resume bot parsed parameters smoothly.", recommendation: "Ensure standard fonts are preserved across export modules.", content: 88, relevance: 81 },
        skills: { title: "Skills & Keywords", score: 64, label: "GAP IDENTIFIED", description: "Critical technical stack terms are missing for your target career roles.", recommendation: "Incorporate missing skills highlighted in recent job listings.", content: 60, relevance: 68 },
        experience: { title: "Experience Impact", score: 71, label: "WEAK BULLETS", description: "Responsibilities are listed, but they lack metrics and strong leadership verbs.", recommendation: "Use action verbs and add specific percentage increases.", content: 75, relevance: 66 }
    };

    function switchActiveMetricHUD(typeKey) {
        const data = localizedReviewData[typeKey];
        if (!data) return;

        if (previewTitle) previewTitle.textContent = data.title;
        if (previewScore) previewScore.textContent = data.score;
        if (previewLabel) previewLabel.textContent = data.label;
        if (previewDescription) previewDescription.textContent = data.description;
        if (previewRecommendation) previewRecommendation.textContent = data.recommendation;

        if (contentBar) contentBar.style.width = `${data.content}%`;
        if (contentValue) contentValue.textContent = `${data.content}%`;
        if (relevanceBar) relevanceBar.style.width = `${data.relevance}%`;
        if (relevanceValue) relevanceValue.textContent = `${data.relevance}%`;
    }

    categories.forEach(btn => {
        btn.addEventListener("click", () => {
            categories.forEach(c => i = c.classList.remove("active"));
            btn.classList.add("active");
            switchActiveMetricHUD(btn.dataset.review);
        });
    });
});

