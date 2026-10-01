// Copy, labels and options for Facilities Requests.
// Wording changes belong here, not in facilities.js.
//
// MOCKUP (2026-09-30): runs entirely on demo data in the browser. Nothing is
// sent anywhere and no database is involved yet. Real requests wait for the
// Supabase tables, RLS and Pro backups (see docs/privacy.md).

export const CONFIG = {
  id: "facilities",
  name: "Facilities Requests",
  owner: "Joe",

  demo: true,   // shows the demo bar and uses demo data

  // Who works requests. First names only in the repo; the real list will come
  // from Supabase once roles exist.
  team: [
    { id: "joe",    name: "Joe",    role: "Facilities lead" },
    { id: "eric",   name: "Eric",   role: "Facilities" },
    { id: "vendor", name: "Vendor", role: "Outside vendor" },
  ],
  approver: { id: "ryan", name: "Ryan" },

  // Campuses come from config/site.config.js. Online has no building.
  campusExclude: ["online"],

  // Demo bar: who you are pretending to be.
  viewers: [
    { id: "staff", label: "Staff member", note: "Submits and tracks their own" },
    { id: "eric",  label: "Eric",         note: "Works assigned requests" },
    { id: "joe",   label: "Joe",          note: "Triages everything" },
    { id: "ryan",  label: "Ryan",         note: "Overview and approvals" },
  ],

  types: [
    { id: "repair", label: "Repair or maintenance", blurb: "Something is broken, leaking, worn out or not working.", icon: "wrench" },
    { id: "keys",   label: "Keys or access",        blurb: "A key, a door that won't lock, an access or alarm problem.", icon: "key" },
  ],

  // Three statuses on purpose. "Waiting on approval" is shown from the
  // approval itself, not as a fourth status Joe has to remember to set.
  statuses: [
    { id: "new",      label: "New",         tone: "new" },
    { id: "progress", label: "In progress", tone: "progress" },
    { id: "done",     label: "Done",        tone: "done" },
  ],

  priorities: [
    { id: "emergency", label: "Emergency", blurb: "Safety issue, water, no power, can't lock a door." },
    { id: "week",      label: "This week", blurb: "Needs attention soon, but nothing is at risk." },
    { id: "whenever",  label: "Whenever",  blurb: "Fix it when there's time." },
  ],

  labels: {
    title: "Facilities",
    sub: "Report a repair or a key and access issue, then follow it to done.",
    demoTag: "Demo",
    demoNote: "Mockup with made-up requests. Nothing you do here is saved anywhere but this browser.",
    demoViewing: "Viewing as",
    demoReset: "Reset demo",

    tabMine: "My requests",
    tabQueue: "Queue",
    tabApprovals: "Approvals",
    newRequest: "New request",

    mineEmpty: "You haven't sent any facilities requests yet.",
    queueEmpty: "Nothing matches these filters.",
    approvalsEmpty: "Nothing is waiting on you.",

    formTitle: "New facilities request",
    formType: "What kind of request?",
    formCampus: "Campus",
    formLocation: "Where exactly?",
    formLocationHint: "Room, building or area. \"Kids wing, room 4\" is perfect.",
    formTitleLabel: "What's going on?",
    formTitleHint: "A short summary, like \"Sink leaking in the café\".",
    formDetails: "Details",
    formDetailsHint: "Anything that helps: when it started, what you tried, how bad it is.",
    formPriority: "How urgent?",
    formPhotos: "Photos",
    formPhotosHint: "Optional, up to 4. A picture saves a trip.",
    formKeysWho: "Who needs access?",
    formKeysWhoHint: "Name of the person, or \"me\".",
    formKeysWhere: "Which doors or rooms?",
    formNeedBy: "Needed by",
    formSubmit: "Send request",
    formCancel: "Cancel",
    emergencyWarn: "Don't wait on the form. Call or text Joe now, then send this so it gets tracked.",
    codesWarn: "Never type door codes or alarm codes into a request. Joe will handle those in person or by phone.",
    photoPrivacy: "In the real version, photos go to private storage only the facilities team and you can see.",

    sent: (id) => `Request #${id} sent. Joe got a Teams message.`,

    tileOpen: "Open",
    tileOpenN: "New plus in progress",
    tileEmergency: "Emergency",
    tileEmergencyN: "Open and urgent",
    tileOld: "Older than 7 days",
    tileOldN: "Still open",
    tileApproval: "Waiting on Ryan",
    tileApprovalN: "Sent for approval",
    byCampus: "Open by campus",

    filterAll: "All",
    filterOpen: "Open",
    filterMine: "Assigned to me",
    filterUnassigned: "Unassigned",
    searchPlaceholder: "Search requests",

    detailRequested: "Requested by",
    detailSubmitted: "Submitted",
    detailAssigned: "Assigned to",
    detailCampus: "Campus",
    detailLocation: "Location",
    detailNeedBy: "Needed by",
    detailWho: "Access for",
    detailWhere: "Doors or rooms",
    unassigned: "Not assigned yet",
    timeline: "Updates",
    addUpdate: "Add an update",
    addUpdatePlaceholder: "What happened, what's next, or a question.",
    internal: "Facilities team only (requester won't see this)",
    post: "Post update",
    manage: "Manage",
    status: "Status",
    assign: "Assign to",
    priority: "Priority",
    sendApproval: "Send to Ryan for approval",
    approvalAmount: "Estimated cost",
    approvalNote: "Why it needs approval",
    approvalSend: "Send for approval",
    approve: "Approve",
    decline: "Decline",
    approvalPending: (amt) => `Waiting on Ryan's approval${amt ? ` · ${amt}` : ""}`,
    approvalApproved: (amt) => `Approved by Ryan${amt ? ` · ${amt}` : ""}`,
    approvalDeclined: "Declined by Ryan",
    teamsTag: "Teams",
    back: "Back",
  },
};
