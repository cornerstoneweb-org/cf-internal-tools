// Site-wide configuration. Copy and structure live here, not in code.
// A wording change should be a one-line edit in this file.

export const SITE = {
  orgName: "Cornerstone Fellowship",
  siteTitle: "Cornerstone Staff Tools",
  supportContact: "", // who staff email when a tool is broken
};

export const CAMPUSES = [
  { id: "livermore", name: "Livermore" },
  { id: "brentwood", name: "Brentwood" },
  { id: "walnut-creek", name: "Walnut Creek" },
  { id: "san-ramon-valley", name: "San Ramon Valley" },
  { id: "hayward", name: "Hayward" },
  { id: "online", name: "Online" },
];

// Feature flags. A tool only appears on the home page and only loads when
// enabled. Build a tool fully before flipping it on.
export const TOOLS = [
  {
    id: "staff-hub",
    name: "Staff Hub",
    blurb: "Everything staff need in one place.",
    path: "tools/staff-hub/",
    enabled: true,
    owner: "Ryan",
  },
  {
    id: "facilities",
    name: "Facilities Request",
    blurb: "Submit and track a facilities request.",
    path: "tools/facilities/",
    enabled: false,
    owner: "Joe",
  },
  {
    id: "it",
    name: "IT Request",
    blurb: "Submit and track an IT request.",
    path: "tools/it/",
    enabled: false,
    owner: "Dennis",
  },
  {
    id: "comms",
    name: "Comms Request",
    blurb: "Request a communication or announcement.",
    path: "tools/comms/",
    enabled: false,
    owner: "TBD",
  },
];

// Roles used by auth and RLS. Keep this list and the database in sync.
export const ROLES = ["staff", "facilities_admin", "it_admin", "comms_admin", "super_admin"];
