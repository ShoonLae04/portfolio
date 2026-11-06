// =============================================================
//  content.js: ALL the content for the portfolio site is in this file.
// =============================================================

const ME = {
  name: 'Shoon Lae Zayyar',
  school: 'Temasek Polytechnic',
  course: 'Diploma in Computer Engineering (T13)',

  // About me: each '…' is one paragraph. Add or remove lines freely.
  about: [
    "I'm a Computer Engineering student at Temasek Polytechnic in Singapore. I enjoy software development, AI-powered tools that make everyday tasks easier.",
    'I’ve made things with microcontrollers, sensors and MQTT, but the work I enjoy most is software. My favourite so far is a recipe sharing platform I built with Blazor and SQL, with a smart pantry that suggests recipes from the ingredients you already have',
    "I’m open to part-time or full-time roles related to computer engineering, especially software, web or AI, while I apply for university. If your team is building something interesting, I’d love to hear from you.",
  ],

  languages: ['Java', 'JavaScript', 'HTML / CSS', 'Python', 'C / C++', 'C#', 'SQL'],
};


// The filter buttons above the tracklist: [id, label on the button].
// A project shows under a filter when its cat list has that id.
const FILTERS = [
  ['all', 'all'],
  ['software', 'software'],
  ['embedded', 'embedded'],
  ['iot', 'IoT'],
  ['automation', 'automation'],
  ['ai', 'AI'],
  ['data', 'data'],
];


// =============================================================
//  PROJECTS: what I have built. Each project is an object with these properties:
// =============================================================

const PROJECTS = [
  {
    title: 'Recipe Sharing Platform',
    type: 'full stack',                         // short label on the right
    cat: ['software'],                          // which filter buttons show it
    tags: ['C#', 'Blazor', 'SQL', 'HTML', 'CSS', 'JavaScript'],   // first 3 show under the title
    summary: 'A full-stack recipe platform where people share, browse and save recipes, with a smart pantry that suggests what to cook from the ingredients they already have.',
    points: [
      'Share, browse, like, save and comment on recipes',
      'Smart pantry matches your ingredients to recipes',
      'Personalised recipe suggestions',
      'Search and filter recipes by category, ingredients, or dietary restrictions',
      'Notifications when a recipe becomes popular',
      'Admin dashboard to monitor recipe and user activity',
    ],
    myPart:  "Built in a team of two. I made the meal plan and notification features, login, sign-up and password reset, user profiles, bookmarks and the admin dashboard for managing recipes and users. My biggest challenge was authorization in Blazor: making sure users can only see and change their own recipes and meal plans, and that only admins can delete recipes. Next time I'd set up authorization and realistic test data from the start instead of adding them at the end.",
    link: '',                                   // GitHub / demo link, or '' for none
  },
];