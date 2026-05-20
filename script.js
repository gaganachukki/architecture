/**
 * Stackly Architecture - Dynamic Navbar Script
 */

// Function to update the active navigation link based on current page URL
function updateActiveLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("nav a");
    
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href) {
            const linkPath = href.split("/").pop();
            // Handle matching logic including potential slash issues
            if (linkPath === currentPath) {
                link.classList.add("active");
            } else if ((currentPath === "" || currentPath === "/") && linkPath === "index.html") {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        }
    });
}

// Function to handle scroll-based navbar shrink and blur styling
function handleScroll() {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        if (window.scrollY > 20) {
            navbar.classList.add("scrolled");
            navbar.classList.add("sticky"); // Support legacy CSS sticky rules
        } else {
            navbar.classList.remove("scrolled");
            navbar.classList.remove("sticky");
        }
    }
}

// Function to bind and handle mobile sidebar menu toggle events for dashboards
function bindDashboardHamburgerMenu() {
    const hamburger = document.getElementById("hamburger-menu");
    const sidebar = document.querySelector(".sidebar");
    
    if (hamburger && sidebar) {
        // Create overlay element
        let overlay = document.querySelector(".sidebar-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "sidebar-overlay";
            document.body.appendChild(overlay);
        }
        
        // Hamburger click handler
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
            document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : "";
        });

        // Close sidebar when a nav item is clicked
        const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                hamburger.classList.remove("active");
                sidebar.classList.remove("active");
                overlay.classList.remove("active");
                document.body.style.overflow = "";
            });
        });

        // Close sidebar when overlay is clicked
        overlay.addEventListener("click", () => {
            hamburger.classList.remove("active");
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = "";
        });

        // Close sidebar when clicking outside (on main content)
        document.addEventListener("click", (e) => {
            if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                if (sidebar.classList.contains("active")) {
                    hamburger.classList.remove("active");
                    sidebar.classList.remove("active");
                    overlay.classList.remove("active");
                    document.body.style.overflow = "";
                }
            }
        });
    }
}

// Function to bind and handle mobile sidebar menu toggle events
function bindMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    
    if (menuToggle && nav) {
        // Clone and replace to prevent duplicate event listeners on re-fetches
        const clone = menuToggle.cloneNode(true);
        menuToggle.replaceWith(clone);

        // Create overlay element for mobile menu
        let overlay = document.querySelector(".mobile-menu-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "mobile-menu-overlay";
            document.body.appendChild(overlay);
        }

        function openMenu() {
            clone.classList.add("active");
            nav.classList.add("active");
            overlay.classList.add("active");
            document.body.classList.add("menu-open");
        }

        function closeMenu() {
            clone.classList.remove("active");
            nav.classList.remove("active");
            overlay.classList.remove("active");
            document.body.classList.remove("menu-open");
        }
        
        clone.addEventListener("click", (e) => {
            e.stopPropagation();
            if (nav.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close mobile drawer when a link is clicked
        const navLinks = document.querySelectorAll("nav a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        // Close drawer when overlay is clicked
        overlay.addEventListener("click", () => {
            closeMenu();
        });

        // Close drawer when clicking outside the navbar
        document.addEventListener("click", (e) => {
            if (nav.classList.contains("active") && !nav.contains(e.target) && !clone.contains(e.target)) {
                closeMenu();
            }
        });
    }
}

// Function to dynamically load the common footer
function loadFooter() {
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer && !footerContainer.innerHTML.trim()) {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            });
    }
}

// Initialize navbar and footer enhancements
function initNavbar() {
    updateActiveLink();
    handleScroll();
    bindMobileMenu();
    bindDashboardHamburgerMenu();
    loadFooter();
}

// Global scroll event listener
window.addEventListener("scroll", handleScroll);

// MutationObserver to run initialization automatically as soon as the navbar is fetched and loaded in any page
const observer = new MutationObserver((mutations) => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        observer.disconnect(); // Disconnect BEFORE mutating the DOM to prevent recursive loops!
        initNavbar();
    }
});

// Configure observer to watch body additions
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial runs to support pages where navbar is pre-rendered or fast-loaded
document.addEventListener("DOMContentLoaded", initNavbar);
if (document.readyState === "complete" || document.readyState === "interactive") {
    initNavbar();
}

// Global Scroll Reveal Intersection Observer
function initScrollReveal() {
    // Dynamically add reveal class to major elements if they don't have it
    const elementsToReveal = document.querySelectorAll('section h1, section h2, section h3, section p, .stats-item, .project-item, .hs-card, .ht-card, .blog-card, .service-item, .teaser-content, .teaser-img-wrapper, img, .form-container, .contact-card');
    elementsToReveal.forEach(el => {
        if (!el.classList.contains('reveal') && !el.closest('.hero') && !el.closest('nav') && !el.closest('.navbar')) {
            el.classList.add('reveal');
        }
    });

    // Add global hover effect classes dynamically to make them interactive
    const elementsToHover = document.querySelectorAll('.stats-item, .project-item, .hs-card, .ht-card, .blog-card, .service-item, .contact-card');
    elementsToHover.forEach(el => {
        el.classList.add('global-hover');
    });

    const imagesToHover = document.querySelectorAll('img:not(.navbar img):not(nav img)');
    imagesToHover.forEach(el => {
        if(!el.closest('.hero')) {
            el.classList.add('img-hover');
        }
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target); // Unobserve after animating once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it enters the frame
    });

    document.querySelectorAll(".reveal").forEach(el => {
        revealObserver.observe(el);
    });
}

// Initialize scroll reveals on content load
document.addEventListener("DOMContentLoaded", initScrollReveal);
if (document.readyState === "complete" || document.readyState === "interactive") {
    initScrollReveal();
}

// Stats Counter Animation
function initStatsCounter() {
    const counters = document.querySelectorAll('.stats-item h2[data-target]');
    
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

document.addEventListener("DOMContentLoaded", initStatsCounter);
if (document.readyState === "complete" || document.readyState === "interactive") {
    initStatsCounter();
}