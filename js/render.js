/* Shared rendering helpers (used by the site and by admin.html's live preview). */
(function () {
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ESC[c]);
  const money = (n) => "$" + Number(n || 0).toLocaleString("en-US");
  const safeUrl = (u) => (/^(https?:|mailto:)/i.test(String(u || "").trim()) ? esc(u.trim()) : "#");
  const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const CHECK = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8.25" stroke-opacity=".35"/><path d="m6.5 10.2 2.4 2.4 4.6-5"/></svg>';
  const features = (list) => (list || []).map((f) => `<li>${CHECK}<span>${esc(f)}</span></li>`).join("");

  /* Nobody buys directly: every package and the essay review start with a call. */
  const BOOK = "book.html";

  function planCard(p) {
    return `
      <article class="plan reveal${p.featured ? " featured" : ""}">
        ${p.featured ? '<span class="badge">Most Common</span>' : ""}
        <h3>${esc(p.name)}</h3>
        <p class="tag">${esc(p.tagline)}</p>
        ${p.price != null ? `<div class="price"><strong>${money(p.price)}</strong><span>one-time</span></div>` : ""}
        <ul class="feat">${features(p.features)}</ul>
        <a class="btn ${p.featured ? "btn-primary" : "btn-dark"} btn-block" href="${BOOK}">Book a call to get started</a>
      </article>`;
  }

  function essayCard(e) {
    return `
      <div class="carte reveal">
        <div>
          <span class="lab">À la carte</span>
          <h3>${esc(e.name || "Essay Review")}</h3>
          <p>${esc(e.tagline)}</p>
          <ul class="feat">${features(e.features)}</ul>
        </div>
        <div class="carte-buy">
          ${e.price != null ? `<div class="price"><strong>${money(e.price)}</strong><span>${esc(e.unit)}</span></div>` : ""}
          <a class="btn btn-dark btn-block" href="${BOOK}">Book a call to get started</a>
        </div>
      </div>`;
  }

  /* The paid consulting call. opts: { href, label, pay } — `pay` marks a Stripe link. */
  function consultCard(c, opts) {
    const o = opts || {};
    const href = o.pay ? safeUrl(o.href) : esc(o.href || BOOK);
    return `
      <div class="carte consult reveal">
        <div>
          <span class="lab">Start here</span>
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.tagline)}</p>
          <ul class="feat">${features(c.features)}</ul>
        </div>
        <div class="carte-buy">
          <div class="price"><strong>${money(c.price)}</strong><span>${esc(c.unit)}</span></div>
          <a class="btn btn-primary btn-block" href="${href}"${o.pay ? ' data-pay="consult"' : ""}>${esc(o.label || "Book a consulting call")}</a>
        </div>
      </div>`;
  }

  function testimonialCard(t, excerpt) {
    const body = excerpt ? [t.excerpt] : t.quote;
    return `
      <figure class="tcard${excerpt ? " excerpt" : ""} reveal" style="margin:0">
        <header class="t-head">
          ${t.logo ? `<img class="t-logo" src="${esc(t.logo)}" alt="${esc(t.school)} logo" style="height:${Number(t.logoH) || 40}px" loading="lazy">` : ""}
          <div><b>${esc(t.school)}</b><span>${esc(t.who)} · Major: ${esc(t.major)}</span></div>
        </header>
        <div class="qm" aria-hidden="true">“</div>
        <blockquote>${body.map((p) => `<p>${rich(p)}</p>`).join("")}</blockquote>
      </figure>`;
  }

  window.Render = {
    esc, money, safeUrl,
    plans: (pkgs) => (pkgs || []).map(planCard).join(""),
    essay: essayCard,
    consult: consultCard,
    testimonial: testimonialCard,
  };
})();
