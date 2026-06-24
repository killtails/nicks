/* ---------------------------------------------------------
   Nick's Beer Garden — shared header/footer + interactions
   Edit navigation in ONE place (the NAV_LINKS array below)
   and every page updates.
--------------------------------------------------------- */

const NAV_LINKS = [
  { href: "on-tap.html",  label: "On Tap" },
  { href: "events.html",  label: "Events" },
  { href: "about.html",   label: "About" },
  { href: "hours.html",   label: "Hours & Location" },
  { href: "contact.html", label: "Contact" },
];

const IG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
const FB  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-9h3l.5-3.5H13V7.3c0-1 .3-1.7 1.8-1.7H17V2.5C16.6 2.4 15.5 2.3 14.2 2.3c-2.7 0-4.6 1.6-4.6 4.7v2.5H6.5V13h3.1v9z"/></svg>';
const ML  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';

// which file is currently open (e.g. "events.html"; "" or "index.html" = home)
const current = location.pathname.split("/").pop() || "index.html";

/* ---------- build header ---------- */
function buildHeader() {
  const links = NAV_LINKS.map(l => {
    const active = l.href === current ? " class=\"active\"" : "";
    return `<li><a href="${l.href}"${active}>${l.label}</a></li>`;
  }).join("");

  return `
  <div class="wrap topbar">
    <a href="index.html" class="logo"><b>Nick's</b><span>CHICAGO</span></a>
    <nav class="nav" id="nav">
      <ul>${links}</ul>
    </nav>
    <div class="header-right">
      <div class="socials">
        <a href="#" aria-label="Instagram">${IG}</a>
        <a href="#" aria-label="Facebook">${FB}</a>
        <a href="#" aria-label="Email">${ML}</a>
      </div>
      <a href="on-tap.html" class="btn">Beer List</a>
    </div>
    <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>
  </div>`;
}

/* ---------- build footer ---------- */
function buildFooter() {
  const links = NAV_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`).join("");
  return `
  <div class="wrap">
    <div class="foot-top">
      <p class="foot-motto">Chicago's<br><span class="accent">Late-Night</span><br>Garden</p>
      <div class="foot-links">${links}</div>
      <div class="foot-social">
        <a href="#" aria-label="Instagram">${IG}</a>
        <a href="#" aria-label="Facebook">${FB}</a>
        <a href="#" aria-label="Email">${ML}</a>
      </div>
    </div>
    <p class="copyright">© 2024 Nick's Beer Garden. All Rights Reserved.</p>
  </div>`;
}

/* ---------- inject + wire up ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) header.innerHTML = buildHeader();
  if (footer) footer.innerHTML = buildFooter();

  // On inner pages (no .hero) keep the header solid from the top.
  const hasHero = !!document.querySelector(".hero");
  if (header && !hasHero) header.classList.add("solid");

  // Sticky header background on scroll (home page).
  if (header && hasHero) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile full-screen overlay menu.
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    const ICON_OPEN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    const ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M6 18 18 6"/></svg>';

    const setMenu = (open) => {
      const changing = nav.classList.contains("open") !== open;
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);   // lock background scroll
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.innerHTML = open ? ICON_CLOSE : ICON_OPEN;     // hamburger <-> X
      if (!changing) return;
      if (open) {
        const first = nav.querySelector("a");
        if (first) first.focus();                           // move focus into menu
      } else {
        toggle.focus();                                     // return focus to button
      }
    };

    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false);
    });
    // Returning to desktop width should reset the menu state cleanly.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  // Highlight today's row on the hours page.
  const rows = document.querySelectorAll(".hours-table li");
  if (rows.length) {
    const order = [1, 2, 3, 4, 5, 6, 0]; // table is Mon → Sun
    const idx = order.indexOf(new Date().getDay());
    if (rows[idx]) rows[idx].classList.add("today");
  }

  // Friendly stub for the contact form (no backend in a static mockup).
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const status = document.getElementById("formStatus");
      if (status) status.textContent = "Thanks — this is a mockup, so the message wasn't actually sent.";
      form.reset();
    });
  }
});
