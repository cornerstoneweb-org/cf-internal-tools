// Staff Hub content. Source of truth for every section, card and link.
// Editing copy, adding a link, or recording a review happens here.
//
// Card shape:
//   {
//     title, body, meta,
//     owner:    "Name"        who keeps this accurate. Required.
//     reviewed: "YYYY-MM-DD"  when a human last confirmed it. null = never.
//     reviewEvery: 12         months until it needs checking again.
//                             Omit to use the section default.
//     links: [{ label, url, note, status }]
//   }
//
// link.status:
//   "ok"         url works (implied when url is set)
//   "pending"    url is null, renders "Coming soon", not clickable
//   "sharepoint" url is null, renders "Moving to SharePoint", not clickable
//
// Dropbox URLs from the old Canva site are deliberately NOT recorded here.
// They are unauthenticated public links and are being replaced with
// SharePoint links restricted to CF users.
//
// ON REVIEW DATES: most are null on purpose. Claude did not invent them.
// A date here means a person actually checked the item. The two real dates
// below came from the source filenames on the old site. Fill in the rest as
// you verify each one, and the flags clear themselves.

export const CONTENT = {
  tagline: "Everything staff need, in one place.",

  // Photos for the welcome banner on Home. One is picked at random on each
  // visit. Files live in shared/assets/photos/ (web-sized, about 1800px wide).
  //   place:  optional label shown in the corner, e.g. "Brentwood"
  //   focus:  optional CSS object-position, to keep the subject in frame
  // Empty = plain CF teal banner. Add photos here when good ones come in.
  heroPhotos: [],

  contact: {
    name: "Ryan Bicker",
    email: "ryanb@cornerstoneweb.org",
    prompt: "Can't find something?",
  },

  // The four things staff open every day. Kept short on purpose: this row is
  // a convenience under the welcome, not the point of the page. Request forms
  // live under Requests where people go looking for them.
  quickActions: [
    { glyph: "\u2709", label: "Email",    note: "Outlook",          accent: "var(--sec-software)", url: "https://outlook.office.com/" },
    { glyph: "\u25C8", label: "Teams",    note: "Chat and calls",   accent: "var(--sec-guides)",   url: "https://teams.microsoft.com/v2/" },
    { glyph: "\u2317", label: "Central",  note: "CCB",              accent: "var(--sec-values)",   url: "https://cornerstonefellowship.ccbchurch.com/goto/login" },
    { glyph: "\u25F7", label: "OnePoint", note: "Pay and time off", accent: "var(--sec-hr)",       url: "https://secure.onehcm.com/ta/CFLCA.login?rnd=QSZ&NoRedirect=1" },
  ],

  // Set to null when there is nothing to announce.
  //   level:  "info" (cyan) or "urgent" (orange)
  //   until:  "YYYY-MM-DD", hides itself after this date. Optional.
  //   link / linkLabel: optional call to action.
  announcement: {
    level: "info",
    text: "The Staff Hub is new. Tell Ryan what's missing or wrong.",
    link: "mailto:ryanb@cornerstoneweb.org?subject=Staff%20Hub%20feedback",
    linkLabel: "Send feedback",
    until: null,
  },

  sections: [
    {
      id: "requests",
      accent: "var(--sec-requests)",
      title: "Requests",
      blurb: "Ask another team for something.",
      enabled: true,
      layout: "compact",
      reviewEvery: 12,
      cards: [
        {
          title: "Graphic Design",
          body: "Request digital or print designs for your ministry.",
          owner: "Communications",
          reviewed: null,
          links: [{ label: "Start a request", url: "https://forms.monday.com/forms/6de2b801c96808d6d23344a75eddab75?r=use1" }],
        },
        {
          title: "Video Design",
          body: "Start a video request for your ministry or program.",
          owner: "Communications",
          reviewed: null,
          links: [{ label: "Start a request", url: "https://forms.monday.com/forms/059e6ecd1f5dc95eb69f8138e27fc9c9?r=use1" }],
        },
        {
          title: "Web Design",
          body: "Need a new or updated webpage?",
          owner: "Communications",
          reviewed: null,
          links: [{ label: "Start a request", url: "https://forms.monday.com/forms/b4b919ea5e6710981ec65e4228f7d248?r=use1" }],
        },
        {
          title: "IT Support",
          body: "Something not working? Let us help.",
          owner: "Dennis",
          reviewed: null,
          // The old Wufoo form is retired. Link removed on purpose; a
          // replacement is a decision, not an oversight.
          links: [{ label: "Open a ticket", url: null, status: "pending" }],
        },
        {
          title: "Facilities",
          body: "Room setup, repairs, building issues.",
          owner: "Joe",
          reviewed: null,
          links: [{ label: "Start a request", url: null, status: "pending" }],
        },
      ],
    },

    {
      id: "software",
      accent: "var(--sec-software)",
      title: "Software",
      blurb: "The programs we use to get work done.",
      enabled: true,
      layout: "full",
      reviewEvery: 12,
      cards: [
        {
          title: "Office 365",
          body: "Our cloud productivity suite: email, calendars, file storage, and Word, Excel, PowerPoint, Teams and OneDrive. Keeps work connected and reachable from anywhere.",
          owner: "Dennis",
          reviewed: null,
          links: [
            { label: "Account page", url: "https://myaccount.microsoft.com/?ref=MeControl" },
            { label: "Email in your browser", url: "https://outlook.office.com/" },
            { label: "Set up your phone", url: "https://support.microsoft.com/en-us/office/set-up-office-apps-and-email-on-a-mobile-device-7dabb6cb-0046-40b6-81fe-767e0b1f014f" },
          ],
        },
        {
          title: "Teams",
          body: "Chat, video meetings, calls and file collaboration. Connected to Office 365, so documents and conversations live together.",
          owner: "Dennis",
          reviewed: null,
          links: [
            { label: "Download the app", url: "https://www.microsoft.com/en-us/microsoft-teams/download-app" },
            { label: "Open in your browser", url: "https://teams.microsoft.com/v2/" },
          ],
        },
        {
          title: "Central (CCB)",
          body: "Our church management system. People, groups, events, giving and volunteers in one place, so we can connect, communicate and follow up.",
          owner: "Ryan",
          reviewed: null,
          links: [
            { label: "Log in to Central", url: "https://cornerstonefellowship.ccbchurch.com/goto/login" },
            { label: "Help center", url: "https://support.pushpay.com/s/topics-chms", note: "hosted by CCB" },
            { label: "Guide documents", url: null, status: "pending" },
          ],
        },
        {
          title: "Canva",
          body: "Our design tool for graphics, presentations, flyers and social content. Drag-and-drop editing with templates and brand colors. For anything more involved, the Communications Team can help.",
          owner: "Communications",
          reviewed: null,
          links: [
            { label: "Request an account", url: "mailto:ryanb@cornerstoneweb.org" },
            { label: "Beginner's guide", url: "https://www.canva.com/learn/how-to-canva-beginners-guide/" },
            { label: "Request a design", url: "https://forms.monday.com/forms/6de2b801c96808d6d23344a75eddab75?r=use1" },
          ],
        },
        {
          title: "Ramp",
          body: "Our corporate card and expense platform. Purchasing, real-time spend tracking and automated expense reports.",
          owner: "Ryan",
          reviewed: null,
          links: [{ label: "Log in to Ramp", url: "https://app.ramp.com/sign-in" }],
        },
        {
          title: "OnePoint",
          body: "Your HR dashboard. Pay stubs, time off, benefits and personal information.",
          owner: "Bou",
          reviewed: null,
          links: [{ label: "Log in to OnePoint", url: "https://secure.onehcm.com/ta/CFLCA.login?rnd=QSZ&NoRedirect=1" }],
        },
      ],
    },

    {
      id: "hr",
      accent: "var(--sec-hr)",
      title: "Human Resources",
      blurb: "Pay, time off, policies and paperwork.",
      enabled: true,
      layout: "compact",
      reviewEvery: 6,
      cards: [
        {
          title: "Staff Roster",
          body: "Who does what around here. Chat, call or email anyone on staff.",
          owner: "Bou",
          reviewed: "2025-10-01", // from the old file name, Updated October 2025
          reviewEvery: 3,
          links: [{ label: "Open the roster", url: "#/directory" }],
        },
        {
          title: "Pay Dates",
          body: "When you get paid in 2026.",
          owner: "Bou",
          reviewed: null,
          reviewEvery: 12,
          links: [{ label: "2026 pay dates", url: null, status: "sharepoint" }],
        },
        {
          title: "Holidays",
          body: "When the offices are closed in 2026.",
          owner: "Bou",
          reviewed: null,
          reviewEvery: 12,
          links: [{ label: "2026 holidays", url: null, status: "sharepoint" }],
        },
        {
          title: "Employee Handbook",
          body: "Policies, expectations and how things work here.",
          owner: "Bou",
          reviewed: "2025-04-23", // from the old file name, Revised 04.23.25
          reviewEvery: 12,
          links: [{ label: "Read the handbook", url: null, status: "sharepoint" }],
        },
        {
          title: "Labor Law Notices",
          body: "California and federal labor law postings.",
          owner: "Bou",
          reviewed: null,
          reviewEvery: 12,
          links: [{ label: "Open the folder", url: null, status: "sharepoint" }],
        },
        {
          title: "OnePoint",
          body: "Pay stubs, time off requests and benefits.",
          owner: "Bou",
          reviewed: null,
          links: [{ label: "Log in to OnePoint", url: "https://secure.onehcm.com/ta/CFLCA.login?rnd=QSZ&NoRedirect=1" }],
        },
      ],
    },

    {
      id: "brand",
      accent: "var(--sec-brand)",
      title: "Brand",
      blurb: "Logos, colors, and how to use them.",
      enabled: true,
      layout: "brand",
      reviewEvery: 12,

      // Where the brand actually lives day to day.
      home: {
        title: "Everything starts in Canva",
        body: "Our templates, brand colors and fonts are already set up in Canva. Building there is faster than starting from a blank file, and it keeps everything looking like us. If a project is bigger than a template, the Communications Team can take it from here.",
        links: [
          { label: "Open Canva", url: "https://www.canva.com/" },
          { label: "Request an account", url: "mailto:ryanb@cornerstoneweb.org?subject=Canva%20account%20request" },
          { label: "Request a design", url: "https://forms.monday.com/forms/6de2b801c96808d6d23344a75eddab75?r=use1" },
        ],
      },

      // Values sampled from the master brand library, 2026-09-20.
      // See 00_Program/brand-notes.md on the three blues in circulation.
      palette: {
        primary: [
          { name: "Cerulean", hex: "#07AED9" },
          { name: "Black", hex: "#000000" },
          { name: "White", hex: "#FFFFFF" },
        ],
        secondary: [
          { name: "Cadmium Orange", hex: "#F78C2E" },
          { name: "Bitter Lemon", hex: "#CEDC2D" },
          { name: "Dark Grey", hex: "#585C5F" },
          { name: "Light Gray", hex: "#D3D4D6" },
        ],
        note: "Tap a swatch to copy the hex. The church website uses a slightly deeper blue (#0693B2) for links and buttons; Communications is reconciling the two.",
      },

      // Practical guidance, not policy. Communications has the final say.
      guides: [
        {
          title: "Which mark to use",
          body: "Start with the full Cornerstone logo. Use the icon on its own only when space is genuinely tight, like an avatar or a favicon. Use a campus or ministry mark when the material belongs to that campus or team specifically, not for general church communication.",
        },
        {
          title: "Black, white or blue",
          body: "Black on light backgrounds, white on dark or on photos. Blue is for when the mark needs to carry color on its own. If a logo is hard to read against what is behind it, you picked the wrong version, not the wrong background.",
        },
        {
          title: "PNG or JPG",
          body: "PNG almost always. It has a transparent background, so it sits on any color. Use JPG only when something refuses to accept a PNG. The white JPGs come with a black background baked in, which is usually not what you want.",
        },
        {
          title: "Leave it alone",
          body: "Do not stretch it, recolor it, add effects, or rebuild it from scratch. Give it a clear margin roughly the height of the letters around all sides. If you need something these files do not cover, ask rather than improvise.",
        },
      ],

      cards: [],
    },

    {
      id: "directory",
      accent: "var(--sec-hr)",
      title: "Staff Roster",
      // placement: "linked" = its own page, but no sidebar entry. Reached from
      // the Staff Roster card on Human Resources. parent keeps HR highlighted.
      placement: "linked",
      parent: "hr",
      blurb: "Find anyone on staff and reach them in Teams.",
      enabled: true,
      // People are NOT listed here. They load from the locked staff_directory
      // table in Supabase after sign-in, so the roster never sits in the
      // public repo. See db/migrations/0003_staff_directory.sql.
      layout: "directory",
      reviewEvery: 6,
      cards: [],
    },

    {
      id: "values",
      accent: "var(--sec-values)",
      title: "Our Staff Values",
      blurb: "The five we hold each other to.",
      enabled: true,
      // placement: "home" means this section has no page and no nav entry.
      // It renders on Home under the welcome. Cards stay searchable and the
      // admin view still tracks them. Delete this line to give it a page back.
      placement: "home",
      layout: "values",
      reviewEvery: 24,
      cards: [
        {
          title: "We Are Healthy", accent: "var(--lime-d)", icon: "heart",
          body: "Live a balanced life that honors God by caring for your whole self: spiritually, physically, emotionally, mentally, financially, and within your family. Steward your body and life as God's temple, pursuing habits that reflect worship in all areas.",
          meta: "1 Corinthians 3:16-17, 4:5, 6:19-20, 10:31; 1 Timothy 4:8",
          owner: "Chris", reviewed: null,
        },
        {
          title: "We Are Honest", accent: "var(--teal)", icon: "talk",
          body: "When differences arise, we go directly to each other for understanding, lead with grace and truth, talk with people not about them, and stay open and vulnerable.",
          meta: "Matthew 18; 1 Corinthians 4:4, 4:19-21, 6:1-11, 13:6; 2 Corinthians 7:8-16",
          owner: "Chris", reviewed: null,
        },
        {
          title: "We Are Hungry", accent: "var(--orange)", icon: "flame",
          body: "Work diligently with a mindset of perseverance and growth. Set goals, pursue excellence, and maintain a whatever-it-takes attitude marked by healthy competition and reliance on God's grace to accomplish what He has called you to.",
          meta: "1 Corinthians 4:11-13, 15:10",
          owner: "Chris", reviewed: null,
        },
        {
          title: "We Are Hopeful", accent: "var(--sec-guides)", icon: "sunrise",
          body: "We trust where God is leading Cornerstone, believing the best, not assuming the worst. We stay open-handed, open to change, and act as owners, not renters.",
          meta: "1 Corinthians 13:7; 2 Corinthians 1:10-11, 13:11",
          owner: "Chris", reviewed: null,
        },
        {
          title: "We Are Humble", accent: "var(--sec-values)", icon: "sprout",
          body: "We admit mistakes, celebrate teammates, listen well, and don't take ourselves too seriously. We seek God's promotion, not self-promotion.",
          meta: "1 Corinthians 4:6-7, 4:18-19, 13:4; 2 Corinthians 12:9",
          owner: "Chris", reviewed: null,
        },
      ],
    },

    { id: "resources", accent: "var(--sec-default)", title: "Resources", blurb: "Coming in a future release.", enabled: false, layout: "compact", cards: [] },
    { id: "tutorials", accent: "var(--sec-default)", title: "Tutorials", blurb: "Coming in a future release.", enabled: false, layout: "compact", cards: [] },
    {
      id: "guides",
      accent: "var(--sec-guides)",
      title: "Reference Guides",
      blurb: "How to do the things that come up.",
      enabled: false,   // parked for V2. Cards below are kept, not shown.
      layout: "compact",
      reviewEvery: 12,
      cards: [
        {
          title: "Reserve a Room: Livermore",
          body: "How to book space at the Livermore campus.",
          owner: "Joe",
          reviewed: null,
          links: [{ label: "Open the guide", url: null, status: "sharepoint" }],
        },
        {
          title: "Reserve a Room: Other Campuses",
          body: "Brentwood, Walnut Creek, San Ramon Valley, Hayward.",
          owner: "Joe",
          reviewed: null,
          links: [{ label: "Open the guide", url: null, status: "pending" }],
        },
      ],
    },

  ],
};
