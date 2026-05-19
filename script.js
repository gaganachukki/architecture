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

// Function to bind and handle mobile sidebar menu toggle events
function bindMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    const navButtons = document.querySelector(".nav-buttons");
    
    if (menuToggle && nav && navButtons) {
        // Clone and replace to prevent duplicate event listeners on re-fetches
        const clone = menuToggle.cloneNode(true);
        menuToggle.replaceWith(clone);
        
        clone.addEventListener("click", (e) => {
            e.stopPropagation();
            clone.classList.toggle("active");
            nav.classList.toggle("active");
            navButtons.classList.toggle("active");
            document.body.classList.toggle("menu-open");
        });

        // Close mobile drawer when a link is clicked
        const navLinks = document.querySelectorAll("nav a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                clone.classList.remove("active");
                nav.classList.remove("active");
                navButtons.classList.remove("active");
                document.body.classList.remove("menu-open");
            });
        });

        // Close drawer when clicking outside the navbar
        document.addEventListener("click", (e) => {
            if (nav.classList.contains("active") && !nav.contains(e.target) && !clone.contains(e.target)) {
                clone.classList.remove("active");
                nav.classList.remove("active");
                navButtons.classList.remove("active");
                document.body.classList.remove("menu-open");
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