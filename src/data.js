// ---------------------------------------------------------------------------
// PLACEHOLDER CONTENT
// Every name, avatar, stat and video below is a placeholder so the layout can
// be previewed end to end. Swap in real client names, real Mux playback IDs
// and real numbers before shipping. See README.md for exactly what to change
// and where.
// ---------------------------------------------------------------------------

import { aspectRatio } from 'framer-motion';

// A public Mux demo asset — used everywhere below as a stand-in so every
// player on the page works out of the box. Replace `playbackId` per item
// with your own Mux asset ids.
export const DEMO_PLAYBACK_ID = 'VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU';

function avatar(seed, bg) {
  // ui-avatars.com generates a clean initials avatar on the fly — swap for
  // an uploaded client logo/profile photo when you have real assets.
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=${bg}&color=fff&size=128&bold=true&font-size=0.4`;
}

export const softwareSkills = [
  {
    name: 'Adobe After Effects',
    category: 'Motion graphics',
    level: 85,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg',
  },
  {
    name: 'Adobe Premiere Pro',
    category: 'Editing',
    level: 75,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Adobe_Premiere_Pro_CC_icon.svg/960px-Adobe_Premiere_Pro_CC_icon.svg.png',
  },
  {
    name: 'DaVinci Resolve',
    category: 'Color grading',
    level: 50,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg',
  },
  {
    name: 'Krita',
    category: 'Digital painting',
    level: 50,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Calligrakrita-base.svg/960px-Calligrakrita-base.svg.png',
  },
  {
    name: 'Audacity',
    category: 'Audio editing',
    level: 60,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/f/f6/Audacity_Logo.svg',
  },
  {
    name: 'Frame.io',
    category: 'Review workflow',
    level: 100,
    image:
      'https://cdn.brandfetch.io/idKZYqdo-7/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B',
  },
];

export const clientChannels = [
  {
    yt_id: 'UCLSgpKnoLCS1kPQ4n1t8B_Q',
    name: 'Strike',
    handle: '@StrikeOriginals',
    subs: '54.3K',
    views: 8240000,
    since: '2026',
    niche: 'Entertainment',
    color: '1B2023',
    round: true,
    avatar:
      'https://yt3.googleusercontent.com/hH7ONuYnYsPfO1FdREiS8TJGkiuBqVYIR_BxuRmrYSDYpjBwRk8a4072AHA6qylCSRCvmppBGQ=s160-c-k-c0x00ffffff-no-rj',
  },
  {
    yt_id: 'UCyAMoOTlfSGPxrtvh6M6wig',
    name: 'Shyam Meera Singh',
    handle: '@shyammeerasingh1',
    subs: '1.85M',
    views: 240000000,
    since: '2025',
    niche: 'Journalism & Commentary',
    color: '2C3E50',
    avatar:
      'https://yt3.googleusercontent.com/1abhPJau58hVgF4BA4sinMwEyJ9XFGQn90XNnN82-3ZAU6aM9Ksco9kVD5HtKXQBWm2UHCIjXg=s160-c-k-c0x00ffffff-no-rj',
  },
  {
    yt_id: 'UCoCbt0YNJL4_MtIo6Lg1ybA',
    name: 'Traya Health',
    handle: '@trayahealth',
    subs: '796K',
    views: 199700000,
    since: '2025',
    niche: 'Health & Wellness',
    color: '27AE60',
    avatar:
      'https://yt3.googleusercontent.com/ytc/AIdro_k_L0yUiXhHF0ySNGet-n0do1bUhQfEnfCNNb-uPl6ivQ=s160-c-k-c0x00ffffff-no-rj',
  },
];

export const TOTAL_VIEWS = clientChannels.reduce((sum, c) => sum + c.views, 0);

// Flagship long-form pieces
export const featuredReels = [
  {
    id: 'p0',
    title: 'Sonia Gandhi: This Video Will Change Your Mind',
    client: 'Shyam Meera Singh',
    category: 'Long-form',
    duration: '05:03',
    views: '1.1M views',
    playbackId: '8HW8DqAtAJJsefVEuz7CxDaR02TukSm6VitP02lRFIP6M',
    aspectRatio: '16/9',
    thumbTime: 122, // 31 || 36
    role: 'Documentary',
  },
  {
    id: 'p1',
    title: 'The White House: An AI-Enhanced Edit',
    client: '',
    category: 'Long-form',
    duration: '01:12',
    views: '3.1M views',
    playbackId: '00WGqwBkF7wjcmC57Jaix8XrvKRGEuinQHT01GzYyQ02mI',
    aspectRatio: '16/9',
    thumbTime: 3, // 31 || 36
    role: 'Documentary',
  },
  {
    id: 'p2',
    title: 'The Forest King: A Modern Robin Hood',
    client: '',
    category: 'Long-form',
    duration: '01:50',
    views: '2.6M views',
    playbackId: 'KpD00XW02yKVHHUAV966qaReCETIr2dJMId02Eg7izSgz00',
    aspectRatio: '16/9',
    thumbTime: 56,
    role: 'Documentary',
  },
  {
    id: 'p3',
    title: "Something's wrong here!",
    client: 'Shyam Meera Singh',
    handle: '@shyammeerasingh1',
    category: 'Long-form',
    duration: '03:39',
    views: '2.6M views',
    playbackId: '5JgcC02KlNbOwj7TiakccKZlURGwRHEG41pxvt9ev02wA',
    aspectRatio: '16/9',
    thumbTime: 56,
  },
];

// Only 10 portfolio items (real + realistic)
export const portfolioItems = [
  {
    id: 'p0',
    title: 'Sonia Gandhi: This Video Will Change Your Mind',
    client: 'Shyam Meera Singh',
    handle: '@shyammeerasingh1',
    category: 'Long-form',
    duration: '05:03',
    views: '1.1M views',
    playbackId: '8HW8DqAtAJJsefVEuz7CxDaR02TukSm6VitP02lRFIP6M',
    aspectRatio: '16/9',
    thumbTime: 122, // 31 || 36
    role: 'Documentary',
  },
  {
    id: 'p1',
    title: 'The White House: An AI-Enhanced Edit',
    client: '',
    handle: '',
    category: 'Long-form',
    duration: '01:12',
    // views: '3.1M views',
    playbackId: '00WGqwBkF7wjcmC57Jaix8XrvKRGEuinQHT01GzYyQ02mI',
    thumbTime: 3,
    aspectRatio: '16/9',
    // thumbTime: 36, // 31 || 36
  },
  {
    id: 'p2',
    title: 'The Forest King: A Modern Robin Hood',
    handle: '',
    clientChannel: '',
    client: '',
    category: 'Long-form',
    duration: '01:50',
    // views: '2.6M views',
    playbackId: 'KpD00XW02yKVHHUAV966qaReCETIr2dJMId02Eg7izSgz00',
    aspectRatio: '16/9',
    thumbTime: 56,
  },
  {
    id: 'p3',
    title: "Something's wrong here!",
    client: 'Shyam Meera Singh',
    handle: '@shyammeerasingh1',
    category: 'Long-form',
    duration: '03:39',
    views: '2.6M views',
    playbackId: '5JgcC02KlNbOwj7TiakccKZlURGwRHEG41pxvt9ev02wA',
    aspectRatio: '16/9',
    thumbTime: 56,
  },
  {
    id: 'p4',
    title: 'Truth Behind Amazon Logo',
    handle: '',
    client: '',
    category: 'Shorts',
    duration: '00:25',
    // views: '1.8M views',
    playbackId: 'TbBrc2IYoJ54Vla3ePlLqPw2EKfifUqT37n01apxnkXQ',
    aspectRatio: '9/16',
    thumbTime: 2,
  },
  {
    id: 'p5',
    title: 'Nepal GenZ Protest',
    client: '',
    handle: '',
    category: 'Shorts',
    duration: '00:50',
    // views: '2.4M views',
    playbackId: 'm3L2HIK4SxNdl00q1eggbzVnz4CaOkOaTo5y3EQ76ju8',
    thumbTime: 41,
    aspectRatio: '9/16',
  },
];

export const categories = ['Long-form', 'Shorts', 'Brand'];

export const edited_videos = [
  {
    yt_id: '6nHbHBSZk_Q',
    title: 'Story of Yuvraj Singh Will Shock You',
    views: '',
  },
  {
    yt_id: 's-NT36W2igA',
    title: 'Once upon a time in Gorakhpur',
    views: '',
  },
  {
    yt_id: 'bfYX46vNgl4',
    title: 'Dark History of Pappu Yadav',
    views: '',
  },
  {
    yt_id: '6WIWn0fQg7Y',
    title: 'They Tried to Hide This Billion-Rupee Scam',
    views: '',
  },
  {
    yt_id: 'qLAOoOGu4Rs',
    title: 'Real Story of Anant Singh, Surajbhan Singh and Viveka Pahalwan',
    views: '',
  },
  {
    yt_id: 'WzeLKYxUzvk',
    title: 'How One Family Took Control of North Korea',
    views: '',
  },
  {
    yt_id: 'vaY6mDbf3_w',
    title: 'Untold Story of Smriti Irani',
    views: '',
  },
  {
    yt_id: 'dyUwnbq3mAM',
    title: 'Real Story Of Gautam Gambhir',
    views: '',
  },
  {
    yt_id: 'mTmbkN-BAeg',
    title: "Why SACHIN Tendulkar's BEST Friend 'VINOD KAMBLI' Collapsed?",
    views: '',
  },
  {
    yt_id: 'QS75VNhCOm8',
    title: 'Dark Reality of Manusmriti Exposed',
    views: '',
  },
  {
    yt_id: 'Qh2APG_o7tU',
    title: "I Investigated India's Wildest R#pe Case",
    views: '',
  },
  {
    yt_id: 'VZkeuQFGvc0',
    title: 'Real Story of Veerappan',
    views: '',
  },
  {
    yt_id: '3uMQsqnhPQk',
    title: 'Why Indian Cricket Team Is A Upper-Caste Club?',
    views: '',
  },

  {
    yt_id: 'xp8AYn4EUkI',
    title: 'Dark Side of Ambani Legacy',
    views: '',
  },
  {
    yt_id: 'QHXgAALX68o',
    title: 'How Putin Changed Russia Forever?',
    views: '',
  },
  {
    yt_id: 'NpaWlFUllKQ',
    title: "Reality of Narendra Modi's FAKE IMAGE",
    views: '',
  },
  {
    yt_id: 'drRsiPoeyHE',
    title: 'Reality of Electricity Bill in India',
    views: '',
  },
  {
    yt_id: '5aBsZV3nkQg',
    title: "Something's Wrong Here!",
    views: '',
  },
  {
    yt_id: 'OtP2gr4hZGQ',
    title: 'Reality of Narendra Modi',
    views: '',
  },
  {
    yt_id: '8wp-4BKGyGE',
    title: 'A Call Recording That Exposed Cricketers',
    views: '',
  },
  {
    yt_id: 'mNsStGyUuHc',
    title: "This Boy Shouldn't Be in IPL | Real Story of Vaibhav Sooryavanshi",
    views: '',
  },
  {
    yt_id: 'NP8034WjvLw',
    title: 'Modi Made Himself Bigger Than Bhagwan Ram',
    views: '',
  },
  {
    yt_id: 'P97bH3pC4Bw',
    title: 'Reality Of BJP',
    views: '',
  },
  {
    yt_id: 'CWmZL_h3QuA',
    title: 'How One Man Shook India : STORY OF KANSHIRAM',
    views: '',
  },
  {
    yt_id: 'tpxRW97XHGo',
    title: 'Thalapathy Vijay : How A Flop Actor Become Tamilnadu CM',
    views: '',
  },
  {
    yt_id: '4QyfIl5tOXg',
    title: 'Why India Stopped OSHO?',
    views: '',
  },
  {
    yt_id: 'UF5xeeLsT0A',
    title: 'What Happened with OSHO? (Part-2)',
    views: '',
  },
  {
    yt_id: 'jbHE2LY1xhk',
    title: 'Gangs of Bombay | Dawood Ibrahim Story',
    views: '',
  },
  {
    yt_id: 'NOTlQhX_RCs',
    title: 'Dawood VS Chhota Rajan',
    views: '',
  },
  {
    yt_id: 'H3P086E_gHE',
    title: 'Tragic Life of Michael Jackson',
    views: '',
  },
  {
    yt_id: '1dIvCe5Sqkg',
    title: 'Why Everyone Hates THAR Car?',
    views: '',
  },
  {
    yt_id: 'lhpKiC3spTo',
    title: 'Sonia Gandhi: This Video Will Change Your Mind',
    views: '',
  },
  {
    yt_id: 'n6ljFZMFhIM',
    title: 'Nobody Expected Sonia Gandhi | @StrikeOriginals',
    views: '',
  },
  {
    yt_id: '2TPngFhvpNY',
    title: 'Mulayam Singh Yadav Story | Samajwadi Party History',
    views: '',
  },
  {
    yt_id: 'a5oqHQHAk3E',
    title: 'Real Story Of Mulayam Singh | Part-2',
    views: '',
  },
  {
    yt_id: 'qM-f-vVW6dg',
    title:
      "The Kapoor Family: Bollywood's Most Powerful Dynasty | Shyam Meera Singh",
    views: '',
  },
  {
    yt_id: 'NBdODGyPqfg',
    title: 'Real Story of Sonam Wangchuk | Cockroach Party',
    views: '',
  },
  {
    yt_id: 'w5jh0w_pxAw',
    title: 'Mayawati: How A Dalit Woman Ruled',
    views: '',
  },
  {
    yt_id: 'yYYoFDIRYps',
    title: 'Story Of Hippies and LSD Drug',
    views: '',
  },
  {
    yt_id: '9Bgb0AuT8qI',
    title: 'Real Story of Neem Karoli Baba',
    views: '',
  },
  {
    yt_id: 'orMKe9wAiGo',
    title: 'How Kalyan Singh Destroyed India',
    views: '',
  },
  {
    yt_id: 'LkD6i64rihU',
    title: 'How Modi and Gyanesh Cheated India?',
    views: '',
  },
  {
    yt_id: 'vZsITkM_ObQ',
    title: 'Chandra Shekhar Azad Story | Bhim Army',
    views: '',
  },
  {
    yt_id: '6sezvDU7aLo',
    title: "I Investigated India's Food Adulteration Problem",
    views: '',
  },
  {
    yt_id: 'Kv7fuoWlTGc',
    title: 'Why Gen Z Is Obsessed with Energy Drinks',
    views: '',
  },
];
