// 🚀 NAVIGATION LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isVisible = mobileMenu.style.display === 'flex';
            mobileMenu.style.display = isVisible ? 'none' : 'flex';

            // Toggle menu icon animation if needed
            menuToggle.classList.toggle('active');
        });

        // Close button support (if present)
        const closeBtn = document.querySelector('.close-mobile');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
                menuToggle.classList.remove('active');
            });
        }

        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
                menuToggle.classList.remove('active');
            });
        });
    }

    // 🔘 MODAL SYSTEM
    const contactModal = document.getElementById('contactModal');
    const contactTriggers = document.querySelectorAll('.contact-trigger');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Contact Modal Triggers
    contactTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (contactModal) contactModal.style.display = 'block';
        });
    });


    // Close Modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (contactModal) contactModal.style.display = 'none';
        });
    });

    // Close on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) contactModal.style.display = 'none';
    });

    // ✉️ FORM SUBMISSION (FORMSPREE) - CENTRALIZED LOGIC
    function setupAJAXForm(formId, statusId, successMsg) {
        const form = document.getElementById(formId);
        const status = document.getElementById(statusId);

        if (form && status) {
            form.addEventListener("submit", async function (event) {
                event.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn ? submitBtn.innerText : "Submit";

                const data = new FormData(event.target);

                if (submitBtn) {
                    submitBtn.innerText = "SENDING...";
                    submitBtn.disabled = true;
                }

                try {
                    const response = await fetch(event.target.action, {
                        method: form.method,
                        body: data,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        status.innerHTML = successMsg;
                        form.reset();
                        setTimeout(() => {
                            if (window.getComputedStyle(status.closest('.modal') || {}).display === 'block') {
                                status.closest('.modal').style.display = 'none';
                            }
                            status.innerHTML = "";
                        }, 4000);
                    } else {
                        status.innerHTML = "Oops! Problem submitting form";
                    }
                } catch (error) {
                    status.innerHTML = "Oops! Connection error";
                } finally {
                    if (submitBtn) {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }
                }
            });
        }
    }

    // Setup Inquiry Forms
    setupAJAXForm("enquiryForm", "status", "your inquiry submitted");
    setupAJAXForm("enquiryFormMain", "statusMain", "your inquiry submitted");

    // Setup Newsletter Forms
    document.querySelectorAll('.newsletter-form').forEach((form) => {
        setupDynamicStatusForm(form, "you succesfully subscribed our news letter");
    });

    // Setup Generic Contact Forms (like in ONGOING_PROJECT.html)
    document.querySelectorAll('.contact-form').forEach((form) => {
        // Only if it doesn't already have an ID handled by setupAJAXForm
        if (form.id !== "enquiryForm" && form.id !== "enquiryFormMain") {
            setupDynamicStatusForm(form, "your inquiry submitted");
        }
    });

    function setupDynamicStatusForm(form, successMsg) {
        // Ensure status div exists
        let status = form.querySelector('.status-msg');
        if (!status) {
            status = document.createElement('div');
            status.className = 'status-msg';
            status.style.marginTop = '10px';
            status.style.fontSize = '0.9rem';
            status.style.fontWeight = '700';
            status.style.color = 'var(--gold)';
            form.appendChild(status);
        }

        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
            const data = new FormData(event.target);

            if (submitBtn) {
                const originalText = submitBtn.innerText;
                submitBtn.innerText = "WAIT...";
                submitBtn.disabled = true;

                try {
                    const response = await fetch(event.target.action, {
                        method: form.method,
                        body: data,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        status.innerHTML = successMsg;
                        form.reset();
                        setTimeout(() => { status.innerHTML = ""; }, 4000);
                    } else {
                        status.innerHTML = "Error!";
                    }
                } catch (e) {
                    status.innerHTML = "Error!";
                } finally {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
    // 🚀 SMOOTH SCROLL FOR FLOATING BUTTONS
    const floatingButtons = document.querySelectorAll('.floating-ongoing, .floating-upcoming, .floating-completed');
    floatingButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
