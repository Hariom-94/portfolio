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
    id: 'p1',
    title: 'Sonia Gandhi',
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
    thumbTime: 36, // 31 || 36
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
];

// Only 10 portfolio items (real + realistic)
export const portfolioItems = [
  {
    id: 'p0',
    title: 'Sonia Gandhi',
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
    title: 'Road Accident',
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
