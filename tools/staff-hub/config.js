// Copy, labels and feature flags for the Staff Hub.
// Wording changes belong here, not in app.js.
export const CONFIG = {
  id: "staff-hub",
  name: "Staff Hub",
  owner: "Ryan",

  features: {
    search: true,
    showDisabled: true,   // list disabled sections as "coming soon"
    freshness: false,     // owner + review state on PUBLIC cards. Off: it is
                          // internal bookkeeping, and stale metadata tells
                          // staff the wrong story. It lives on /admin now.
    announcement: true,   // the banner
    healthLine: false,    // "n items need checking" in the footer. Same reason.
    quickActions: true,   // the circle-icon row on Home
    browse: false,        // section cards on Home. Off: the sidebar already
                          // lists every section, so these just repeated it.
    greeting: true,       // "Good morning" + date over a photo banner.
                          // Off: the plain "Welcome to the Staff Hub" text.
    tiles: false,         // stat tiles. Off in V1: this is not a dashboard.
    homePanels: false,    // "Your tools" and "Needs attention" on Home. Same reason.
  },

  defaultReviewEvery: 12,  // months
  dueSoonDays: 45,

  // The admin view at #/admin. It lists what has drifted.
  //
  // THE GATE IS A CURTAIN, NOT A LOCK. This is a static site with no server,
  // so anyone who opens dev tools can reach the admin view regardless. The
  // gate exists to keep an internal maintenance screen out of the way of
  // staff, not to protect anything. Never put anything behind it that would
  // matter if a staff member saw it. Real access control waits for the
  // Entra ID decision in docs/auth.md.
  //
  // The passphrase is stored as a SHA-256 hash so the string itself never
  // appears in the source. To set yours:
  //   node scripts/admin-passphrase.mjs "your phrase"
  // then paste the hash below.
  admin: {
    enabled: true,
    gate: "passphrase",      // "passphrase" or "none"
    passphraseHash: "",      // empty = not set yet, the view says so
    label: "Hub admin",
  },

  labels: {
    // Sign-in screen
    gateTitle: "Staff Hub",
    gateMsg: "Sign in with your Cornerstone Microsoft account to continue.",
    gateButton: "Sign in with Microsoft",
    gateNotStaff: (email) => `${email} isn't a Cornerstone staff account. Sign in with your @cornerstoneweb.org account.`,
    gateNotStaffButton: "Use a different account",
    gateError: "Something went wrong reaching the sign-in service. Refresh to try again.",
    signedInAs: "Signed in as",
    signOut: "Sign out",

    searchPlaceholder: "Search the hub, or ask where something lives",
    sectionSearchPlaceholder: (name) => `Search ${name.toLowerCase()}`,
    noResults: "Nothing matches that.",
    noResultsHint: "Try a shorter word, or clear the search.",
    resultsFor: (q, n) => `${n} result${n === 1 ? "" : "s"} for "${q}"`,
    comingSoon: "Coming soon",
    movingToSharePoint: "Moving to SharePoint",  // admin view only
    owner: "Kept by",
    reviewedOn: "Checked",
    dueSoon: "Review due",
    overdue: "Needs review",
    neverReviewed: "Not checked yet",
    open: "Open",
    // Voice matched to cornerstoneweb.org: warm, plain, second person, short
    // sentences. Internal, so it can be a little more direct than the public
    // site, but it should sound like the same church wrote it.
    welcomeTitle: "Welcome to the Staff Hub",
    welcomeLede: "We're so glad you're here.",
    welcomeBody: [],
    heroSub: "Welcome to the Staff Hub. We're so glad you're here.",

    // The big greeting on Home. One is picked at random per visit from the
    // list for the time of day (morning before noon, afternoon until 5pm,
    // evening after). Add, cut or reword freely. Keep them short: they are
    // the headline.
    greetings: {
      morning: [
        "Good morning",
        "Rise and shine",
        "Fresh day, fresh start",
        "Morning, sunshine",
        "Hello, early bird",
        "Let's make it a good one",
        "Welcome back, friend",
        "Top of the morning",
      ],
      afternoon: [
        "Good afternoon",
        "Coffee number two? No judgment",
        "Afternoon, friend",
        "Hello, halfway point",
        "Snack o'clock",
        "Hang in there",
        "Look at you, still crushing it",
        "Hope your day's been a good one",
        "The afternoon stretch",
      ],
      evening: [
        "Good evening",
        "Thanks for all you did today",
        "Well done today",
        "Night owl mode: on",
        "Evening, friend",
        "That's a wrap (almost)",
        "Look who's still here",
        "Well, hello there, night owl",
      ],
    },
    quickHeading: "Quick links",
    valuesHeading: "How we work around here",
    valuesLead: "We are",
    valuesHint: "Tap one to read what it means.",
    browseHeading: "Browse",
    itemCount: (n) => `${n} item${n === 1 ? "" : "s"}`,
    toolsHeading: "Your tools",
    attentionHeading: "Needs attention",
    seeAll: "See all",
    nothingToAttend: "Everything is current. Nothing needs you right now.",
    healthAllGood: "Everything in the hub has been checked recently.",
    healthNeedsWork: (n) => `${n} item${n === 1 ? "" : "s"} in the hub ${n === 1 ? "needs" : "need"} checking.`,

    adminTitle: "What needs your attention",
    adminLede: "Internal maintenance view. Staff never see this page.",
    adminLocked: "Enter the passphrase",
    adminLockedHint: "This keeps a maintenance screen out of the way. It is not security.",
    adminNoHash: "No passphrase is set yet.",
    adminNoHashHint: "Run node scripts/admin-passphrase.mjs \"your phrase\" and paste the hash into config.js.",
    adminWrong: "That is not it.",
    adminUnlock: "Unlock",
    adminLock: "Lock again",
    adminClean: "Nothing has drifted. Every item is current and every link works.",
    adminHowTo: "To clear an item, set its reviewed date in content.js to today.",
    groupOverdue: "Past its review date",
    groupNever: "Never checked",
    groupDead: "Links that do not go anywhere yet",
    groupEmpty: "Sections with nothing in them",
    groupParked: "Parked for V2, content already written",
  },

  // Home tiles. Every value is computed from real content, never typed in,
  // so nothing here can quietly go stale or be wrong.
  // Add a tile by adding a key here and a case in app.js tileValue().
  tiles: ["items", "needsReview", "campuses", "keepers"],
  tileLabels: {
    items:       { k: "Items in the hub", n: "Links, guides and tools" },
    needsReview: { k: "Needs review",     n: "Past its check date" },
    campuses:    { k: "Campuses",         n: "LV · BW · WC · SRV · HW · Online" },
    keepers:     { k: "People keeping it current", n: "Named owners across the hub" },
  },
};
