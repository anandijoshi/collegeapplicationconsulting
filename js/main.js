(function () {
  const S = window.SITE;
  const SV = window.SERVICES || { packages: [], essay: null };
  const R = window.Render;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Site-wide text from config ---------- */
  $$('[data-site="brand"]').forEach((el) => (el.textContent = S.brand));
  $$('[data-site="email"]').forEach((el) => (el.textContent = S.email));
  $$('[data-site-href="email"]').forEach((el) => (el.href = "mailto:" + S.email));
  $$('[data-site="year"]').forEach((el) => (el.textContent = new Date().getFullYear()));
  $$('[data-site-href="linkedin"]').forEach((el) => {
    const u = (S.linkedinUrl || "").trim();
    if (u) el.href = /^https?:\/\//i.test(u) ? u : "https://" + u; else el.hidden = true;
  });

  /* ---------- Services + testimonials ---------- */
  const CONSULT = S.consult || {};
  $$('[data-render="packages"]').forEach((el) => (el.innerHTML = R.plans(SV.packages)));
  $$('[data-render="essay"]').forEach((el) => (el.innerHTML = SV.essay ? R.essay(SV.essay) : ""));
  /* Home page: the consulting call is the first step, so it just links to the booking page. */
  $$('[data-render="consult"]').forEach((el) => (el.innerHTML = SV.consult ? R.consult(SV.consult, { href: "book.html", label: "Book a consulting call" }) : ""));
  /* Booking page: pay for the call via Stripe (unless Google Calendar collects payment). */
  $$('[data-render="consult-pay"]').forEach((el) => {
    if (SV.consult) el.innerHTML = R.consult(SV.consult, { href: CONSULT.paymentLink, pay: true, label: "Pay " + R.money(SV.consult.price) + " & pick a time" });
  });
  const T = window.TESTIMONIALS || [];
    $$('[data-render="testimonials-full"]').forEach((el) => (el.innerHTML = T.map((t) => R.testimonial(t, false)).join("")));

  /* Unconfigured payment links: tell the owner instead of dead-ending */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-pay]");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") {
      e.preventDefault();
      showToast("Stripe link not connected yet. Add your Payment Link in js/config.js.");
    }
  });

  /* ---------- School carousel video: respect reduced-motion ---------- */
  const carousel = $(".strip-video");
  if (carousel && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    carousel.removeAttribute("autoplay");
    carousel.pause();
  }

  /* ---------- Nav ---------- */
  const nav = $(".nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $(".nav-toggle");
  const links = $(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------- Booking page ---------- */
  const root = $("#booking-root");
  if (!root) return;

  /* Two ways to run the $50 call (see js/config.js):
       paymentInCalendar → Google Calendar collects payment, so show the calendar straight away.
       otherwise         → Stripe first; Stripe sends people back with ?paid=call to reveal the calendar. */
  const inCalendar = !!CONSULT.paymentInCalendar;
  const state = inCalendar || new URLSearchParams(location.search).get("paid") === "call" ? "calendar" : "choose";

  $$("[data-state]", root).forEach((el) => (el.hidden = el.dataset.state !== state));

  const stepper = $("#stepper");
  if (stepper) {
    stepper.hidden = inCalendar;
    $$("li", stepper).forEach((li) => {
      const n = Number(li.dataset.step);
      li.classList.toggle("on", state === "choose" ? n === 1 : n === 2);
      li.classList.toggle("ok", state === "calendar" && n === 1);
    });
  }

  if (state === "calendar") {
    const price = SV.consult ? R.money(SV.consult.price) : "the consulting fee";
    const title = $("#notice-title"), body = $("#notice-body");
    if (inCalendar) {
      title.textContent = "Pick a time for your call";
      body.textContent = `The ${price} fee is collected when you confirm your booking. You'll get a confirmation email and a calendar invite with the video link.`;
    } else {
      title.textContent = "Payment received. Thank you!";
      body.textContent = "Now pick a time for your 30-minute call. You'll get a confirmation email and a calendar invite with the video link.";
    }

    const url = S.calendar.bookingUrl;
    const wrap = $("#calendar");
    if (url) {
      wrap.innerHTML = `<iframe src="${R.safeUrl(url)}" title="Book a consulting call" loading="lazy"></iframe>`;
      const open = $("#calendar-open");
      if (open) { open.href = R.safeUrl(S.calendar.shareUrl || url); open.hidden = false; }
    } else {
      wrap.innerHTML = `<div class="setup-box"><h3>Calendar not connected yet</h3><p>Paste your Google Calendar appointment schedule link into <span class="code">calendar.bookingUrl</span> in <span class="code">js/config.js</span> and your booking calendar will appear here.</p></div>`;
    }
  }
})();
