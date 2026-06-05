document.addEventListener("DOMContentLoaded", () => {
  // === CORE DOM SELECTORS ===
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;
  const contactForm = document.querySelector(".contact-form");
  const navbar = document.querySelector(".navbar");

  // BACKEND API CONFIG
  const API_ENDPOINT = "http://localhost:8080/api/leads";

  // === GLOBAL REUSABLE TOAST COMPONENT ===
  function showToast(message, isSuccess = true) {
    const popup = document.createElement("div");
    popup.style.cssText = `
      position: fixed; 
      top: -100px; 
      left: 50%; 
      transform: translateX(-50%); 
      background: ${isSuccess ? '#25d366' : '#ef4444'}; 
      color: white; 
      padding: 16px 32px; 
      border-radius: 14px; 
      box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
      z-index: 9999; 
      font-weight: 600; 
      text-align: center; 
      opacity: 0; 
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.95rem;
    `;
    popup.innerHTML = isSuccess 
      ? `<i class="fa-solid fa-circle-check" style="font-size: 1.2rem;"></i> ${message}`
      : `<i class="fa-solid fa-circle-xmark" style="font-size: 1.2rem;"></i> ${message}`;
    
    document.body.appendChild(popup);
    
    // Animate In
    setTimeout(() => { 
      popup.style.top = "24px"; 
      popup.style.opacity = "1"; 
    }, 50);
    
    // Animate Out and Remove
    setTimeout(() => { 
      popup.style.opacity = "0"; 
      popup.style.top = "0px"; 
      setTimeout(() => popup.remove(), 500); 
    }, 4000);
  }

  // === 1. HAMBURGER MENU LAYOUT ===
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("toggle");
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("toggle");
      }
    });
  }

  // === 2. NAVBAR SCROLL DYNAMIC EFFECTS ===
  window.addEventListener("scroll", () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.padding = "12px 8%";
        navbar.style.boxShadow = document.body.classList.contains("dark") 
          ? "0 10px 30px rgba(0, 0, 0, 0.6)" 
          : "0 10px 30px rgba(15, 23, 42, 0.06)";
      } else {
        navbar.style.padding = "16px 8%";
        navbar.style.boxShadow = "none";
      }
    }
  });

  // === 3. THEME CONFIGURATION MEMORY ===
  const savedTheme = localStorage.getItem("auranet-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (themeIcon) themeIcon.className = "fa-solid fa-sun";
  }

  if (themeToggle && themeIcon) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
      localStorage.setItem("auranet-theme", isDark ? "dark" : "light");
    });
  }

  // === 4. CORE CONTACT FORM INGESTION ===
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";

      const nameInput = contactForm.querySelector('input[name="name"]') || contactForm.querySelector('input[type="text"]');
      const emailInput = contactForm.querySelector('input[name="email"]') || contactForm.querySelector('input[type="email"]');
      const briefInput = contactForm.querySelector('textarea[name="brief"]') || contactForm.querySelector('textarea');
      const sourceInput = contactForm.querySelector('input[name="sourcePlan"]');

      const payload = {
        name: nameInput ? nameInput.value.trim() : "",
        email: emailInput ? emailInput.value.trim() : "",
        brief: briefInput ? briefInput.value.trim() : "",
        sourcePlan: sourceInput ? sourceInput.value : "AuraNet Contact Node"
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Routing Matrix...`;
      }

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({ success: response.ok }));

        if (response.ok || result.success) {
          showToast("Secure communication routed successfully!");
          contactForm.reset();
        } else {
          showToast(result.message || "Server rejected transaction parameters.", false);
        }
      } catch (err) {
        console.error("Transmission Error:", err);
        showToast("Connection Refused: Target backend node offline.", false);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // === 5. PRICING CARDS SPEC TOGGLE ===
  document.querySelectorAll(".pricing-card").forEach((card) => {
    const toggleBtn = card.querySelector(".toggle-features-btn");
    const featuresContainer = card.querySelector(".plan-features");
    if (toggleBtn && featuresContainer) {
      const btnText = toggleBtn.querySelector("span");
      toggleBtn.addEventListener("click", () => {
        featuresContainer.classList.toggle("open");
        toggleBtn.classList.toggle("active");
        if (btnText) {
          btnText.textContent = featuresContainer.classList.contains("open") 
            ? "Hide Architecture Specs" 
            : "View Architecture Specs";
        }
      });
    }
  });

  // === 6. MODAL ENGINE & DYNAMIC API INTERCEPTOR ===
  document.querySelectorAll(".plan-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const planName = btn.getAttribute("data-plan") || "Selected Target Framework";
      const orderWindow = document.createElement("div");
      
      orderWindow.style.cssText = `
        position: fixed; 
        inset: 0; 
        background: rgba(3,7,18,0.6); 
        backdrop-filter: blur(12px); 
        -webkit-backdrop-filter: blur(12px); 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        z-index: 2000; 
        padding: 20px; 
        opacity: 0; 
        transition: opacity 0.3s ease;
      `;
      
      orderWindow.innerHTML = `
        <div style="background: var(--card-light, #ffffff); color: var(--text-light, #0f172a); padding: 40px 32px; border-radius: 24px; max-width: 460px; width: 100%; box-shadow: 0 25px 50px rgba(0,0,0,0.4); position: relative; border: 1px solid var(--border-light);" class="modal-box-card">
          <button class="close-modal-btn" type="button" style="position: absolute; top: 24px; right: 24px; background: transparent; border: none; font-size: 1.4rem; color: inherit; cursor: pointer; opacity: 0.7;"><i class="fa-solid fa-xmark"></i></button>
          <h3 style="font-size: 1.7rem; margin-bottom: 8px; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Initialize Deployment Matrix</h3>
          <p style="margin-bottom: 24px; opacity: 0.8; font-size: 0.95rem;">Target Core: <strong style="color: var(--primary);">${planName}</strong></p>
          <form class="modal-form" style="display: flex; flex-direction: column; gap: 16px;">
            <input type="text" id="modalName" placeholder="Your Full Name" required style="padding:12px; border-radius:8px; border:1px solid var(--border-light);">
            <input type="email" id="modalEmail" placeholder="Secure Network Email" required style="padding:12px; border-radius:8px; border:1px solid var(--border-light);">
            <textarea id="modalBrief" rows="4" style="padding:12px; border-radius:8px; border:1px solid var(--border-light);">I request custom infrastructure setup configuration parameters for ${planName}.</textarea>
            <button class="btn modal-submit-btn" type="submit" style="width: 100%; font-weight:700;">Confirm System Deployment</button>
          </form>
        </div>
      `;
      
      document.body.appendChild(orderWindow);
      
      if (document.body.classList.contains("dark")) {
        const box = orderWindow.querySelector(".modal-box-card");
        if (box) { 
          box.style.background = "var(--card-dark, #0b1329)"; 
          box.style.color = "var(--text-dark, #f8fafc)"; 
          box.style.border = "1px solid var(--border-dark)"; 
        }
      }
      
      setTimeout(() => { orderWindow.style.opacity = "1"; }, 10);
      
      const closeModal = () => { 
        orderWindow.style.opacity = "0"; 
        setTimeout(() => orderWindow.remove(), 300); 
      };
      
      orderWindow.querySelector(".close-modal-btn").addEventListener("click", closeModal);
      orderWindow.addEventListener("click", (e) => { if (e.target === orderWindow) closeModal(); });
      
      const modalForm = orderWindow.querySelector(".modal-form");
      if (modalForm) {
        modalForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          
          const modalSubmitBtn = modalForm.querySelector(".modal-submit-btn");
          const payload = {
            name: orderWindow.querySelector("#modalName").value.trim(),
            email: orderWindow.querySelector("#modalEmail").value.trim(),
            brief: orderWindow.querySelector("#modalBrief").value.trim(),
            sourcePlan: planName
          };

          if (modalSubmitBtn) {
            modalSubmitBtn.disabled = true;
            modalSubmitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Initializing Node...`;
          }

          closeModal();

          try {
            const response = await fetch(API_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            const result = await response.json().catch(() => ({ success: response.ok }));

            if (response.ok || result.success) {
              showToast("Project Matrix Deployment Dispatched Successfully!");
            } else {
              showToast(result.message || "Ecosystem core rejected system allocation blueprint.", false);
            }
          } catch (err) {
            console.error("Modal Submit Error:", err);
            showToast("Transaction Interrupted: Communication loop failure.", false);
          }
        });
      }
    });
  });

  // === 7. COST PROCESSING ALGORITHM ===
  const calcPages = document.getElementById("calcPages");
  const calcApp = document.getElementById("calcApp");
  const calcSeo = document.getElementById("calcSeo");
  const pageValue = document.getElementById("pageValue");
  const calcTotal = document.getElementById("calcTotal");

  function calculateProjectCost() {
    if (!calcPages || !calcTotal) return;
    const basePrice = 299;
    const pagesCount = parseInt(calcPages.value) || 1;
    if (pageValue) pageValue.textContent = pagesCount === 1 ? "1 Page" : `${pagesCount} Pages`;
    let total = basePrice + (pagesCount - 1) * 50;
    if (calcApp && calcApp.checked) total += 500;
    if (calcSeo && calcSeo.checked) total += 150;
    calcTotal.textContent = `$${total}`;
  }

  if (calcPages) {
    calcPages.addEventListener("input", calculateProjectCost);
    if (calcApp) calcApp.addEventListener("change", calculateProjectCost);
    if (calcSeo) calcSeo.addEventListener("change", calculateProjectCost);
  }

  // === 8. FAQ INTERFACE MECHANICS ===
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".faq-item").forEach((other) => { 
        if (other !== item) other.classList.remove("active"); 
      });
      item.classList.toggle("active");
    });
  });

  // === 9. STATIC INTERACTIVE AI CONSOLE ENGINE ===
  const aiAgentBtn = document.getElementById("aiAgentBtn");
  const aiConsole = document.getElementById("aiConsole");
  const closeConsole = document.getElementById("closeConsole");
  const consoleStream = document.getElementById("consoleStream");
  const consoleInput = document.getElementById("consoleInput");
  const sendConsoleBtn = document.getElementById("sendConsoleBtn");

  if (aiAgentBtn && aiConsole) {
    // Open/Close Console Toggle
    aiAgentBtn.addEventListener("click", () => {
      aiConsole.classList.toggle("active");
      if (aiConsole.classList.contains("active") && consoleInput) {
        consoleInput.focus();
      }
    });

    if (closeConsole) {
      closeConsole.addEventListener("click", () => {
        aiConsole.classList.remove("active");
      });
    }

    // Prompt Processing Response Mapping
    const handleAgentPrompt = () => {
      const prompt = consoleInput.value.trim();
      if (!prompt) return;

      // Append User Prompt Node to Stream
      const userNode = document.createElement("div");
      userNode.className = "msg-node user";
      userNode.textContent = prompt;
      consoleStream.appendChild(userNode);
      consoleInput.value = "";
      consoleStream.scrollTop = consoleStream.scrollHeight;

      // Automated Matrix Delay Simulation
      setTimeout(() => {
        const systemNode = document.createElement("div");
        systemNode.className = "msg-node system";
        
        const cmd = prompt.toLowerCase();
        if (cmd.includes("startup")) {
          systemNode.innerHTML = '🤖 <b>[Matrix Configured]</b> Startup Kit selected. Target Cost: $299. Features loaded: Production Deployment & 100% Fluid Engine Sync.';
        } else if (cmd.includes("growth")) {
          systemNode.innerHTML = '⚡ <b>[Scale Matrix Activated]</b> Growth Plan optimized. Target Cost: $699. Features loaded: Enterprise UI Layering & 30-Day DevOps Protection.';
        } else if (cmd.includes("custom")) {
          systemNode.innerHTML = '⚙️ <b>[Custom Ecosystem Scoped]</b> Full-Stack parameters required. Please fill the main form in the <b>Contact</b> tab for a premium AWS mapping session.';
        } else {
          systemNode.innerHTML = '🔍 Prompt processed by Core Nodes. For advanced system telemetry allocation, route this scope through the procurement desk.';
        }
        
        consoleStream.appendChild(systemNode);
        consoleStream.scrollTop = consoleStream.scrollHeight;
      }, 600);
    };

    if (sendConsoleBtn) sendConsoleBtn.addEventListener("click", handleAgentPrompt);
    if (consoleInput) {
      consoleInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleAgentPrompt();
      });
    }
  }
});