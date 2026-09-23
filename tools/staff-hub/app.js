import { CONFIG } from "./config.js";
import { CONTENT } from "./content.js";
import { CAMPUSES } from "../../config/site.config.js";
import { BRAND_LIBRARY } from "./brand-library.js";

const LIB = "../../shared/assets/brand/library/";
const PHOTOS = "../../shared/assets/photos/";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const DAY = 86400000;
const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });
const DATE_FMT = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

/* ================= staff values graphic ================= */
// Line icons, 24px grid, drawn with currentColor so each value's color
// carries through. Keyed by the card's `icon` field in content.js.
const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const VALUE_ICONS = {
  heart:   svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  talk:    svg('<path d="M4 5h11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-4-3h-3"/>'),
  flame:   svg('<path d="M12 21c-3.9 0-7-2.8-7-6.6 0-3.1 2.2-5.3 3.6-6.8.4 1.8 1.4 3 2.6 3.4C11 7.6 12.6 4.6 15 3c-.3 3 1.3 4.5 2.6 6 1 1.2 1.4 2.8 1.4 4.4 0 4.2-3.1 7.6-7 7.6z"/>'),
  sunrise: svg('<path d="M4 18h16M7 18a5 5 0 0 1 10 0"/><path d="M12 5v3M5.6 9.6l2 2M18.4 9.6l-2 2M3 21h18"/>'),
  sprout:  svg('<path d="M12 21v-9"/><path d="M12 12C12 8 9 6 5 6c0 4 3 6 7 6z"/><path d="M12 14c0-4 3-6 7-6 0 4-3 6-7 6z"/>'),
};
const valueWord = (title) => String(title ?? "").replace(/^we are\s+/i, "");
const valueCards = () => sections().filter((s) => onHome(s) && s.enabled).flatMap((s) => s.cards);

function openValue(i) {
  const cards = valueCards();
  if (!cards.length) return;
  const n = (i + cards.length) % cards.length;
  const c = cards[n];
  const d = $("value-dialog");
  d.style.setProperty("--v", c.accent ?? "var(--teal)");
  d.dataset.index = n;
  d.querySelector(".vd-ic").innerHTML = VALUE_ICONS[c.icon] ?? "";
  d.querySelector(".vd-kicker").textContent = CONFIG.labels.valuesLead;
  d.querySelector(".vd-title").textContent = valueWord(c.title);
  d.querySelector(".vd-body").textContent = c.body ?? "";
  const ref = d.querySelector(".vd-ref");
  ref.textContent = c.meta ?? "";
  ref.hidden = !c.meta;
  d.querySelector(".vd-count").textContent = `${n + 1} of ${cards.length}`;
  if (!d.open) d.showModal();
}

function wireValues() {
  const d = document.createElement("dialog");
  d.id = "value-dialog";
  d.className = "vd";
  d.setAttribute("aria-labelledby", "vd-title");
  d.innerHTML = `
    <div class="vd-card">
      <button type="button" class="vd-x" data-vd="close" aria-label="Close">&times;</button>
      <div class="vd-top">
        <span class="vd-ic" aria-hidden="true"></span>
        <p class="vd-kicker"></p>
        <h2 class="vd-title" id="vd-title"></h2>
      </div>
      <p class="vd-body"></p>
      <p class="vd-ref"></p>
      <div class="vd-nav">
        <button type="button" data-vd="prev" aria-label="Previous value">&larr;</button>
        <span class="vd-count"></span>
        <button type="button" data-vd="next" aria-label="Next value">&rarr;</button>
      </div>
    </div>`;
  document.body.appendChild(d);

  $("view").addEventListener("click", (e) => {
    const b = e.target.closest(".hv-item");
    if (b) openValue(Number(b.dataset.value));
  });
  d.addEventListener("click", (e) => {
    const act = e.target.closest("[data-vd]")?.dataset.vd;
    const i = Number(d.dataset.index);
    if (act === "close" || e.target === d) d.close();
    else if (act === "prev") openValue(i - 1);
    else if (act === "next") openValue(i + 1);
  });
  d.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") openValue(Number(d.dataset.index) - 1);
    if (e.key === "ArrowRight") openValue(Number(d.dataset.index) + 1);
  });
}

/* ================= freshness ================= */
// Pure, so it can be reasoned about and tested on its own.
export function freshness(card, section, now = Date.now()) {
  const every = card.reviewEvery ?? section.reviewEvery ?? CONFIG.defaultReviewEvery;
  if (!card.reviewed) return { state: "never", label: CONFIG.labels.neverReviewed };

  const checked = new Date(card.reviewed + "T00:00:00");
  if (Number.isNaN(checked.getTime())) return { state: "never", label: CONFIG.labels.neverReviewed };

  const due = new Date(checked);
  due.setMonth(due.getMonth() + every);
  const daysLeft = Math.ceil((due.getTime() - now) / DAY);

  if (daysLeft < 0) return { state: "overdue", label: CONFIG.labels.overdue, checked };
  if (daysLeft <= CONFIG.dueSoonDays) return { state: "due-soon", label: CONFIG.labels.dueSoon, checked };
  return { state: "ok", label: `${CONFIG.labels.reviewedOn} ${MONTH_FMT.format(checked)}`, checked };
}
const needsAttention = (f) => f.state === "never" || f.state === "overdue";
const pillClass = (s) => (s === "overdue" ? "pill-warn" : s === "due-soon" ? "pill-warn" : s === "ok" ? "pill-ok" : "pill-mute");

/* ================= data helpers ================= */
const sections = () => CONTENT.sections;
// Each section's accent rides along as a CSS custom property, so one value in
// content.js colors the nav dot, the home card and the section page together.
const ac = (s) => s?.accent ?? "var(--sec-default)";
const liveSections = () => sections().filter((s) => s.enabled);
// Sections placed on Home have no page of their own, so they stay out of the
// nav and off the router.
const onHome = (s) => s.placement === "home";
const navSections = () =>
  sections()
    .filter((s) => !onHome(s))
    .filter((s) => s.enabled || CONFIG.features.showDisabled)
    .sort((a, b) => Number(b.enabled) - Number(a.enabled));  // live first, parked last
const allCards = () => liveSections().flatMap((s) => s.cards.map((c) => ({ card: c, section: s })));
// Overdue first, then never checked. An item with a real date that has
// lapsed is a stronger signal than one nobody has gotten to yet.
const ATTENTION_ORDER = { overdue: 0, never: 1 };
const attentionList = () =>
  allCards()
    .map((x) => ({ ...x, f: freshness(x.card, x.section) }))
    .filter((x) => needsAttention(x.f))
    .sort((a, b) => (ATTENTION_ORDER[a.f.state] ?? 9) - (ATTENTION_ORDER[b.f.state] ?? 9));

function tileValue(key) {
  switch (key) {
    case "items": return String(allCards().length);
    case "needsReview": return String(attentionList().length);
    case "campuses": return String(CAMPUSES.length);
    case "keepers": return String(new Set(allCards().map(({ card }) => card.owner).filter(Boolean)).size);
    default: return "";
  }
}

const haystack = (card, section) => [
  card.title, card.body, card.meta, card.owner, section.title,
  ...(card.links ?? []).map((l) => l.label),
].filter(Boolean).join(" ").toLowerCase();

/* ================= pieces ================= */
const linkStatus = (link) => link.status ?? (link.url ? "ok" : "pending");

// A card is "coming soon" when it has links and not one of them is live.
// Nothing on it is actionable yet, so the whole card goes quiet.
const cardSoon = (card) =>
  Boolean(card.links?.length) && card.links.every((l) => linkStatus(l) !== "ok");

function linkHTML(link) {
  const status = linkStatus(link);
  const note = link.note ? ` <span class="link-note">${esc(link.note)}</span>` : "";
  if (status === "ok") {
    const ext = /^https?:/.test(link.url);
    return `<li><a class="link" href="${esc(link.url)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${esc(link.label)}</a>${note}</li>`;
  }
  // Staff see one honest label. "Moving to SharePoint" is internal jargon and
  // means nothing to them; the distinction lives on the admin view.
  // The pill carries the section's accent, not a flat grey. It is the one
  // spot of colour left on a card that has gone quiet.
  return `<li><span class="link link-off">${esc(link.label)}</span> <span class="pill pill-soon">${esc(CONFIG.labels.comingSoon)}</span></li>`;
}

function cardHTML(card, section) {
  // Staff-facing cards carry no owner and no review state. That is internal
  // bookkeeping, and stale bookkeeping tells staff the wrong story. It lives
  // on the admin view instead.
  const meta = card.meta ? `<p class="card-meta">${esc(card.meta)}</p>` : "";
  const links = card.links?.length ? `<ul class="card-links">${card.links.map(linkHTML).join("")}</ul>` : "";
  const soon = cardSoon(card) ? " card-soon" : "";
  return `<article class="card${soon}" style="--sec:${ac(section)}" data-search="${esc(haystack(card, section))}">
      <h3>${esc(card.title)}</h3>
      <p class="card-body">${esc(card.body)}</p>
      ${meta}${links}
    </article>`;
}

function cardsHTML(section, cards = section.cards) {
  if (!cards.length) return `<p class="empty">${esc(CONFIG.labels.comingSoon)}</p>`;
  return `<div class="cards cards-${esc(section.layout)}">${cards.map((c) => cardHTML(c, section)).join("")}</div>`;
}

/* ================= views ================= */
// Picked once per visit so the greeting does not change while you click
// around. Falls back to the plain greeting if a list is empty.
let greeting = null;
function greetingText() {
  if (greeting) return greeting;
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  const list = CONFIG.labels.greetings?.[part] ?? [];
  greeting = list.length
    ? list[Math.floor(Math.random() * list.length)]
    : `Good ${part}`;
  return greeting;
}

function homeView() {
  const photos = CONTENT.heroPhotos ?? [];
  const photo = photos.length ? photos[Math.floor(Math.random() * photos.length)] : null;
  const head = CONFIG.features.greeting
    ? `<section class="hero${photo ? " has-photo" : ""}">
         ${photo ? `<img class="hero-img" src="${PHOTOS}${esc(photo.src)}" alt="${esc(photo.alt ?? "")}"
            style="object-position:${esc(photo.focus ?? "center")}" fetchpriority="high">` : ""}
         <div class="hero-text">
           <p class="hero-date">${esc(DATE_FMT.format(new Date()))}</p>
           <h1>${esc(greetingText())}</h1>
           <p class="hero-sub">${esc(CONFIG.labels.heroSub ?? CONFIG.labels.welcomeLede)}</p>
         </div>
         ${photo?.place ? `<span class="hero-place">${esc(photo.place)}</span>` : ""}
       </section>`
    : `<div class="welcome">
         <h1>${esc(CONFIG.labels.welcomeTitle)}</h1>
         <p class="welcome-lede">${esc(CONFIG.labels.welcomeLede)}</p>
         ${(CONFIG.labels.welcomeBody ?? []).map((para) => `<p>${esc(para)}</p>`).join("")}
       </div>`;

  const quick = CONFIG.features.quickActions && CONTENT.quickActions?.length
    ? `<div class="quick-block">
         <h2 class="block-head">${esc(CONFIG.labels.quickHeading)}</h2>
         <div class="quick">${CONTENT.quickActions.map((a) => `
           <a class="quick-item" href="${esc(a.url)}" target="_blank" rel="noopener" style="--sec:${esc(a.accent ?? "var(--sec-default)")}">
             <span class="quick-ic" aria-hidden="true">${esc(a.glyph)}</span>
             <span class="quick-text"><b>${esc(a.label)}</b><span class="quick-note">${esc(a.note ?? "")}</span></span>
           </a>`).join("")}</div>
       </div>` : "";

  // Staff values live here rather than on a page of their own. They are not
  // a resource you go look up; they are the frame around everything else on
  // the hub, so they sit with the welcome.
  const homeSections = sections().filter((s) => onHome(s) && s.enabled);
  const values = homeSections.map((s) => `
    <section class="home-values" style="--sec:${ac(s)}">
      <h2 class="block-head">${esc(CONFIG.labels.valuesHeading)}</h2>
      <div class="hv">
        <p class="hv-lead">${esc(CONFIG.labels.valuesLead)}</p>
        <ul class="hv-row">${s.cards.map((c, i) => `
          <li><button type="button" class="hv-item" data-value="${i}" style="--v:${esc(c.accent ?? "var(--teal)")}"
              aria-haspopup="dialog" aria-label="${esc(c.title)}">
            <span class="hv-ic" aria-hidden="true">${VALUE_ICONS[c.icon] ?? ""}</span>
            <b>${esc(valueWord(c.title))}</b>
          </button></li>`).join("")}</ul>
        <p class="hv-hint">${esc(CONFIG.labels.valuesHint)}</p>
      </div>
    </section>`).join("");

  const browse = CONFIG.features.browse
    ? `<h2 class="block-head">${esc(CONFIG.labels.browseHeading)}</h2>
       <div class="browse">${navSections().map((s) => {
         const n = s.cards.length;
         if (!s.enabled) {
           return `<div class="browse-item is-off" aria-disabled="true">
             <b>${esc(s.title)}</b>
             <span>${esc(s.blurb)}</span>
             <em>${esc(CONFIG.labels.comingSoon)}</em>
           </div>`;
         }
         return `<a class="browse-item" href="#/${esc(s.id)}" style="--sec:${ac(s)}">
           <b>${esc(s.title)}</b>
           <span>${esc(s.blurb)}</span>
           <em>${esc(CONFIG.labels.itemCount(n))}</em>
         </a>`;
       }).join("")}</div>` : "";

  const tiles = CONFIG.features.tiles
    ? `<div class="tiles">${CONFIG.tiles.map((k) => {
        const l = CONFIG.tileLabels[k] ?? { k, n: "" };
        const v = tileValue(k);
        const warn = k === "needsReview" && v !== "0" ? " tile-warn" : "";
        return `<div class="tile${warn}"><div class="tile-k">${esc(l.k)}</div>
                <div class="tile-v">${esc(v)}</div><div class="tile-n">${esc(l.n)}</div></div>`;
      }).join("")}</div>` : "";

  let panels = "";
  if (CONFIG.features.homePanels) {
    const att = attentionList();
    const attention = `<div class="panel">
        <div class="panel-head"><h2>${esc(CONFIG.labels.attentionHeading)}</h2></div>
        ${att.length ? att.slice(0, 6).map(({ card, section, f }) =>
          `<a class="rowlink" href="#/${esc(section.id)}">
            <span class="row-main"><b>${esc(card.title)}</b>
            <span>${esc(section.title)}${card.owner ? " · " + esc(card.owner) : ""}</span></span>
            <span class="pill ${pillClass(f.state)}">${esc(f.label)}</span></a>`
        ).join("") + (att.length > 6
          ? `<p class="empty-soft">${esc(`and ${att.length - 6} more not checked yet`)}</p>` : "")
          : `<p class="empty-soft">${esc(CONFIG.labels.nothingToAttend)}</p>`}
      </div>`;
    const software = sections().find((s) => s.id === "software");
    const tools = software ? `<div class="panel">
        <div class="panel-head"><h2>${esc(CONFIG.labels.toolsHeading)}</h2>
          <a href="#/software">${esc(CONFIG.labels.seeAll)} ${software.cards.length} →</a></div>
        ${software.cards.map((c) => `
          <a class="rowlink" href="#/software">
            <span class="row-main"><b>${esc(c.title)}</b><span>${esc(CONFIG.labels.owner)} ${esc(c.owner ?? "")}</span></span>
            <span class="pill ${pillClass(freshness(c, software).state)}">${esc(freshness(c, software).label)}</span>
          </a>`).join("")}
      </div>` : "";
    panels = `<div class="cols">${tools}${attention}</div>`;
  }

  // Order: greeting, the four daily links, then the values.
  return `${head}${quick}${values}${browse}${tiles}${panels}`;
}

function sectionView(section) {
  const empty = !section.enabled || section.cards.length === 0;
  return `<div class="page-head has-accent" style="--sec:${ac(section)}">
      <div><h1 class="page-title">${esc(section.title)}</h1>
      <p class="page-sub">${esc(section.blurb)}</p></div>
    </div>
    ${empty ? `<p class="empty">${esc(CONFIG.labels.comingSoon)}</p>` : cardsHTML(section)}`;
}

function brandView(section) {
  const b = section;
  const head = `<div class="page-head has-accent" style="--sec:${ac(section)}">
      <div><h1 class="page-title">${esc(section.title)}</h1>
      <p class="page-sub">${esc(section.blurb)}</p></div>
    </div>`;

  const canva = b.home ? `<div class="brand-lead">
      <h2>${esc(b.home.title)}</h2>
      <p>${esc(b.home.body)}</p>
      <div class="brand-lead-links">
        ${b.home.links.map((l, i) => `<a class="btn${i ? " btn-ghost" : ""}" href="${esc(l.url)}"${/^https?:/.test(l.url) ? ' target="_blank" rel="noopener"' : ""}>${esc(l.label)}</a>`).join("")}
      </div>
    </div>` : "";

  const swatch = (c) => `<button type="button" class="swatch" data-hex="${esc(c.hex)}" title="Copy ${esc(c.hex)}">
      <span class="swatch-chip" style="background:${esc(c.hex)}"></span>
      <span class="swatch-name">${esc(c.name)}</span>
      <span class="swatch-hex">${esc(c.hex)}</span>
    </button>`;

  const palette = b.palette ? `<h2 class="block-head">Colors</h2>
      <div class="swatches">${b.palette.primary.map(swatch).join("")}</div>
      <div class="swatches swatches-sec">${b.palette.secondary.map(swatch).join("")}</div>
      ${b.palette.note ? `<p class="brand-note">${esc(b.palette.note)}</p>` : ""}` : "";

  const guides = b.guides?.length ? `<h2 class="block-head">Using the marks</h2>
      <div class="cards cards-full">${b.guides.map((g) => `
        <article class="card" style="--sec:${ac(section)}">
          <h3>${esc(g.title)}</h3>
          <p class="card-body">${esc(g.body)}</p>
        </article>`).join("")}</div>` : "";

  const downloads = BRAND_LIBRARY.map((g) => `
      <h2 class="block-head">${esc(g.title)} <span class="count">${g.assets.length}</span></h2>
      <p class="brand-note brand-note-top">${esc(g.blurb)}</p>
      <div class="assets">${g.assets.map((a) => `
        <figure class="asset asset-${esc(a.variant)}">
          <div class="asset-art"><img src="${esc(LIB + (a.png ?? a.jpg))}" alt="${esc(a.name)} ${esc(a.variant)}" loading="lazy"></div>
          <figcaption>
            <b>${esc(a.name)}</b>
            <span>${esc(a.variant)}</span>
            <span class="asset-dl">
              ${a.png ? `<a href="${esc(LIB + a.png)}" download>PNG</a>` : ""}
              ${a.jpg ? `<a href="${esc(LIB + a.jpg)}" download>JPG</a>` : ""}
            </span>
          </figcaption>
        </figure>`).join("")}</div>`).join("");

  return head + canva + palette + guides
    + `<h2 class="block-head">Download</h2>
       <p class="brand-note brand-note-top">Web resolution, 1200px wide. PNG has a transparent background. Enough for slides, documents and most print.</p>`
    + downloads;
}

function searchView(q) {
  const hits = allCards().filter(({ card, section }) => haystack(card, section).includes(q));
  if (!hits.length) {
    return `<h1 class="page-title">${esc(CONFIG.labels.noResults)}</h1>
      <p class="page-sub">${esc(CONFIG.labels.noResultsHint)}</p>
      <p class="ask">Still stuck? <a href="mailto:${esc(CONTENT.contact.email)}?subject=${encodeURIComponent("Staff Hub: I looked for \"" + q + "\"")}">Tell ${esc(CONTENT.contact.name)} what you were looking for</a>. That is how the hub gets better.</p>`;
  }
  const byId = new Map();
  for (const h of hits) {
    if (!byId.has(h.section.id)) byId.set(h.section.id, { section: h.section, cards: [] });
    byId.get(h.section.id).cards.push(h.card);
  }
  return `<h1 class="page-title">${esc(CONFIG.labels.resultsFor(q, hits.length))}</h1>
    ${[...byId.values()].map(({ section, cards }) => `
      <h2 class="block-head">${esc(section.title)}</h2>${cardsHTML(section, cards)}`).join("")}`;
}

/* ================= admin drift report ================= */
const UNLOCK_KEY = "cf-staffhub-admin";

async function sha256(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const isUnlocked = () => {
  if (CONFIG.admin.gate !== "passphrase") return true;
  try { return sessionStorage.getItem(UNLOCK_KEY) === "1"; } catch { return false; }
};

// Everything an admin would want flagged, in one pass over the content.
export function drift() {
  const overdue = [], never = [], dead = [], empty = [], parked = [];
  for (const s of sections()) {
    if (!s.enabled && s.cards.length > 0) { parked.push({ section: s }); continue; }
    if (!s.enabled || s.cards.length === 0) { empty.push({ section: s }); continue; }
    for (const c of s.cards) {
      const f = freshness(c, s);
      if (f.state === "overdue") overdue.push({ card: c, section: s, f });
      else if (f.state === "never") never.push({ card: c, section: s, f });
      for (const l of c.links ?? []) {
        const st = l.status ?? (l.url ? "ok" : "pending");
        if (st !== "ok") dead.push({ card: c, section: s, link: l, status: st });
      }
    }
  }
  const age = (x) => (x.f.checked ? Math.floor((Date.now() - x.f.checked.getTime()) / DAY) : 0);
  overdue.sort((a, b) => age(b) - age(a));
  return { overdue, never, dead, empty, parked,
    total: overdue.length + never.length + dead.length + empty.length + parked.length };
}

function driftRow(title, section, owner, right, tone) {
  return `<div class="drift-row">
      <span class="row-main"><b>${esc(title)}</b>
      <span>${esc(section)}${owner ? " · " + esc(owner) : ""}</span></span>
      <span class="pill ${esc(tone)}">${esc(right)}</span>
    </div>`;
}

function driftGroup(heading, rows) {
  if (!rows.length) return "";
  return `<h2 class="block-head">${esc(heading)} <span class="count">${rows.length}</span></h2>
    <div class="drift">${rows.join("")}</div>`;
}

function adminView() {
  const a = CONFIG.admin;
  if (!a.enabled) return homeView();

  if (a.gate === "passphrase" && !isUnlocked()) {
    if (!a.passphraseHash) {
      return `<h1 class="page-title">${esc(CONFIG.labels.adminNoHash)}</h1>
        <p class="page-lede">${esc(CONFIG.labels.adminNoHashHint)}</p>`;
    }
    return `<div class="gate">
        <h1 class="page-title">${esc(CONFIG.labels.adminLocked)}</h1>
        <p class="page-sub">${esc(CONFIG.labels.adminLockedHint)}</p>
        <form id="gate-form" autocomplete="off">
          <input type="password" id="gate-input" aria-label="Passphrase" autocomplete="current-password">
          <button class="btn" type="submit">${esc(CONFIG.labels.adminUnlock)}</button>
        </form>
        <p class="gate-err" id="gate-err" hidden>${esc(CONFIG.labels.adminWrong)}</p>
      </div>`;
  }

  const d = drift();
  const head = `<div class="page-head">
      <div><h1 class="page-title">${esc(CONFIG.labels.adminTitle)}</h1>
      <p class="page-sub">${esc(CONFIG.labels.adminLede)}</p></div>
      ${a.gate === "passphrase" ? `<button class="btn btn-ghost" id="gate-lock">${esc(CONFIG.labels.adminLock)}</button>` : ""}
    </div>`;

  if (d.total === 0) {
    return head + `<p class="empty-soft">${esc(CONFIG.labels.adminClean)}</p>`;
  }

  const fmtAge = (x) => {
    if (!x.f.checked) return CONFIG.labels.overdue;
    const days = Math.floor((Date.now() - x.f.checked.getTime()) / DAY);
    const months = Math.round(days / 30);
    return months >= 12 ? `${Math.floor(months / 12)}y ${months % 12}m ago` : `${months}m ago`;
  };

  return head
    + driftGroup(CONFIG.labels.groupOverdue,
        d.overdue.map((x) => driftRow(x.card.title, x.section.title, x.card.owner, fmtAge(x), "pill-warn")))
    + driftGroup(CONFIG.labels.groupDead,
        d.dead.map((x) => driftRow(`${x.card.title}: ${x.link.label}`, x.section.title, x.card.owner,
          x.status === "sharepoint" ? "SharePoint" : "No link", "pill-warn")))
    + driftGroup(CONFIG.labels.groupParked,
        d.parked.map((x) => driftRow(x.section.title, "Built, switched off", null,
          `${x.section.cards.length} ready`, "pill-mute")))
    + driftGroup(CONFIG.labels.groupEmpty,
        d.empty.map((x) => driftRow(x.section.title, "Section", null, "Empty", "pill-mute")))
    + driftGroup(CONFIG.labels.groupNever,
        d.never.map((x) => driftRow(x.card.title, x.section.title, x.card.owner, "Not checked", "pill-mute")))
    + `<p class="empty-soft">${esc(CONFIG.labels.adminHowTo)}</p>`;
}

/* ================= announcement ================= */
const KEY = "cf-staffhub-dismissed";
const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h); };

function announcementHTML() {
  const a = CONTENT.announcement;
  if (!CONFIG.features.announcement || !a?.text) return "";
  if (a.until) {
    const until = new Date(a.until + "T23:59:59");
    if (!Number.isNaN(until.getTime()) && Date.now() > until.getTime()) return "";
  }
  const id = hash(a.text + (a.link ?? ""));
  try { if (localStorage.getItem(KEY) === id) return ""; } catch { /* show it */ }
  const cta = a.link ? ` <a class="ann-cta" href="${esc(a.link)}">${esc(a.linkLabel ?? "Details")}</a>` : "";
  return `<div class="ann ann-${esc(a.level ?? "info")}" id="ann" data-id="${esc(id)}" role="status">
      <p>${esc(a.text)}${cta}</p>
      <button type="button" id="ann-x" aria-label="Dismiss">&times;</button>
    </div>`;
}

/* ================= shell ================= */
function renderNav(active) {
  const items = [`<a href="#/home"${active === "home" ? ' class="is-active"' : ""}><i class="dot"></i>Home</a>`];
  let labelled = false;
  for (const s of navSections()) {
    if (!s.enabled && !labelled) { items.push(`<div class="side-label">Coming soon</div>`); labelled = true; }
    if (!s.enabled) {
      // Parked sections are shown so staff know they are coming, but they do
      // not go anywhere, so they are not links.
      items.push(`<span class="nav-parked"><i class="dot"></i>${esc(s.title)}</span>`);
      continue;
    }
    const cls = active === s.id ? ' class="is-active"' : "";
    items.push(`<a href="#/${esc(s.id)}"${cls} style="--sec:${ac(s)}"><i class="dot"></i>${esc(s.title)}</a>`);
  }
  $("nav").innerHTML = items.join("");
}

function healthHTML() {
  if (!CONFIG.features.healthLine || !CONFIG.features.freshness) return "";
  const n = attentionList().length;
  return n === 0 ? CONFIG.labels.healthAllGood : CONFIG.labels.healthNeedsWork(n);
}

function route() {
  const q = $("search").value.trim().toLowerCase();
  if (q) {
    renderNav(null);
    $("view").innerHTML = searchView(q);
    return;
  }
  const id = (location.hash.replace(/^#\/?/, "") || "home").toLowerCase();

  if (id === "admin") {
    renderNav(null);
    $("view").innerHTML = adminView();
    $("search").placeholder = CONFIG.labels.searchPlaceholder;
    document.title = "Admin · Staff Hub";
    wireGate();
    return;
  }

  const found = sections().find((s) => s.id === id);
  // Parked sections are not reachable; neither are sections that live on Home.
  const section = found?.enabled && !onHome(found) ? found : null;
  renderNav(section ? section.id : "home");
  $("view").innerHTML = section
    ? (section.layout === "brand" ? brandView(section) : sectionView(section))
    : homeView();
  $("search").placeholder = section
    ? CONFIG.labels.sectionSearchPlaceholder(section.title)
    : CONFIG.labels.searchPlaceholder;
  document.title = `${section ? section.title + " · " : ""}Staff Hub | Cornerstone Fellowship`;
  if (section?.layout === "brand") wireSwatches();
}

// Swatches copy their hex. Clipboard can be unavailable or refused, so the
// button says what happened either way rather than silently doing nothing.
function wireSwatches() {
  for (const el of document.querySelectorAll(".swatch")) {
    el.addEventListener("click", async () => {
      const hex = el.dataset.hex;
      try {
        await navigator.clipboard.writeText(hex);
        el.classList.add("is-copied");
        setTimeout(() => el.classList.remove("is-copied"), 1200);
      } catch {
        el.classList.add("is-failed");
        setTimeout(() => el.classList.remove("is-failed"), 1600);
      }
    });
  }
}

function wireGate() {
  const form = $("gate-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = (await sha256($("gate-input").value)) === CONFIG.admin.passphraseHash;
      if (ok) {
        try { sessionStorage.setItem(UNLOCK_KEY, "1"); } catch { /* fine */ }
        route();
      } else {
        $("gate-err").hidden = false;
        $("gate-input").value = "";
        $("gate-input").focus();
      }
    });
    $("gate-input").focus();
  }
  const lock = $("gate-lock");
  if (lock) lock.addEventListener("click", () => {
    try { sessionStorage.removeItem(UNLOCK_KEY); } catch { /* fine */ }
    route();
  });
}

function boot() {
  $("announce").innerHTML = announcementHTML();
  const x = $("ann-x");
  if (x) x.addEventListener("click", () => {
    const el = $("ann");
    try { localStorage.setItem(KEY, el.dataset.id); } catch { /* fine */ }
    el.remove();
  });

  const c = CONTENT.contact;
  $("contact").innerHTML = `${esc(c.prompt)} <a href="mailto:${esc(c.email)}">${esc(c.name)}</a>`;
  $("health").textContent = healthHTML();
  if (!CONFIG.features.search) $("search").closest(".search").hidden = true;

  wireValues();
  route();
}

boot();

// Going somewhere clears the filter. Without this, an active search keeps
// winning over the route and destinations like #/admin never render.
window.addEventListener("hashchange", () => {
  if ($("search").value) { $("search").value = ""; $("clear").hidden = true; }
  route();
});
$("search").addEventListener("input", () => { $("clear").hidden = !$("search").value; route(); });
$("clear").addEventListener("click", () => { $("search").value = ""; $("clear").hidden = true; route(); $("search").focus(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== $("search")) { e.preventDefault(); $("search").focus(); }
  if (e.key === "Escape" && document.activeElement === $("search")) { $("search").value = ""; $("clear").hidden = true; route(); }
});
