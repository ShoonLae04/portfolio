// =============================================================
//  content.js: ALL the content for the portfolio site is in this file.
// =============================================================

const ME = {
  name: 'Shoon Lae Zayyar',
  school: 'Temasek Polytechnic',
  course: 'Diploma in Computer Engineering (T13)',

  // About me: each '…' is one paragraph. Add or remove lines freely.
  about: [
    "I'm a Computer Engineering student at Temasek Polytechnic in Singapore. I enjoy software development and IOT projects, and I like to learn new things.",
    'I’ve made things with microcontrollers, sensors and MQTT, but the work I enjoy most is software. My favourite so far is a recipe sharing platform I built with Blazor and SQL, with a smart pantry that suggests recipes from the ingredients the user already has.',    
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
const EXPERIENCE ={
  role: 'Application Developer',
  company: 'CBM Pte Ltd',
  dates: 'March 2026 - October 2026',
  summary: 'I joined CBM as an Application Developer intern, then came back as a contractor. One project in each role: a robot fleet simulation, and an in-house AI meeting note-taker.',
  work: [
    {
    kind: 'Internship',
    role: 'Application Developer Intern',
    dates: 'March 2026 - August 2026',
    name: 'Open-RMF robot fleet simulation',
    about: 'With a partner, I built middleware that turns work orders from digiBASE, CBM’s maintenance system, into robot tasks. Cleaning, patrol and delivery robots share a simulated office, and Open-RMF gives each task to the best robot.',
    images: ['assets/images/open-rmf.png'],
    steps: [
        'Map: office floor plan drawn in the traffic editor, turned into a Gazebo world.',
        'Work order: digiBASE sends it to a webhook, which publishes it to EMQX over MQTT; a Python bridge picks it up and passes it through the rmf-web API to Open-RMF, which picks the robot.',
        'Status: progress and fire alarms flow back to digiBASE and the dashboard.',
    ],
    did: [
        'Set up ROS 2, Open-RMF and the rmf-web dashboard',
        'Built one-time, recurring and time-bounded scheduling',
        'Built critical-task interruption',
        'Fixed a clock bug by moving every layer to UTC',
        'Fixed work orders silently dropped at the bridge',
        'Built the real-time fire alert pipeline in the simulation',
        'Made the demo videos and slides',
    ],
    tech: ['ROS 2', 'Open-RMF', 'Gazebo', 'Python', 'MQTT', 'EMQX', 'rmf-web', 'React', 'SQLite'],
    },
    {
      kind: 'Contract',
      role: 'Application Developer (Contract)',
      dates: 'September 2026 - October 2026',
      name: 'AI meeting note-taker',
      about: 'I built an internal AI note-taker with a teammate. AI note-taker is the local desktopapp that provides live captions during a meeting, then a transcript with speakers, minutes and action items.',
      images: [],
      steps: [
        'Record: the host records with a Windows app.',
        'Live captions: audio streams to a GPU server; participants read captions in a browser.',
        'Transcript: pyannote finds who spoke;  ASR Model writes it out.',
        'Minutes: a local Qwen model writes minutes and action items.',
      ],
      did: [
        'Set up the speech server to run as a service on the GPU server, so it starts on boot and stays running',
        'Developed the ASR Model with transformers and pyannote for speaker diarisation',
        'Moved speaker detection to the GPU',
        'Added a language filter using the SpeechBrain model since they wanted only English and Mandarin',
        'Worked on summarising long meetings',
      ],
      tech: ['Python', 'FastAPI', 'WebSocket', 'PyQt6'],

    }

  ]
}


//  PROJECTS: what I have built. Each project is an object with these properties:
const PROJECTS = [
  {
    title: 'Recipe Sharing Platform',
    type: 'full stack',                         // short label on the right
    cat: ['software'],                          // which filter buttons show it
    tags: ['C#', 'Blazor', 'SQL', 'HTML', 'CSS', 'JavaScript'],   // first 3 show under the title
    summary: 'A full-stack recipe platform where people share, browse and save recipes, with a smart pantry that suggests what to cook from the ingredients they already have.',
    points: [
      'Share, browse, like, save and comment on recipes',
      'Smart pantry matches the user’s ingredients to recipes',
      'Personalised recipe suggestions',
      'Search and filter recipes by category, ingredients, or dietary restrictions',
      'Notifications when a recipe becomes popular',
      'Admin dashboard to monitor recipe and user activity',
    ],
    myPart:  "Built in a team of two. I made the meal plan and notification features, login, sign-up and password reset, user profiles, bookmarks and the admin dashboard for managing recipes and users. My biggest challenge was authorization in Blazor: making sure users can only see and change their own recipes and meal plans, and that only admins can delete recipes.",
    images: [],
    link: '',                                   // GitHub / demo link, or '' for none
  },
];

// =============================================================
//  CONTACT: the rows in the phone window.
// =============================================================

const CONTACT = [
  { short: '@',  label: 'Email',    value: 'zayarshoonlae@gmail.com', copy: true },
  { short: 'GH', label: 'GitHub',   value: 'github.com/ShoonLae04', href: 'https://github.com/ShoonLae04' },
  { short: 'in', label: 'LinkedIn', value: 'linkedin.com/in/shoon-lae-zayyar-2775ab346', href: 'https://www.linkedin.com/in/shoon-lae-zayyar-2775ab346/' },
];