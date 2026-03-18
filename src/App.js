import { useState, useRef, useEffect, useCallback } from "react";

/* ─── MINIMAL LINE ICONS (kept from previous) ───────────── */
const Icon = {
  Home: ({ size=20, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  Learn: ({ size=20, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  Quiz: ({ size=20, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill={stroke}/>
    </svg>
  ),
  Dictionary: ({ size=20, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  Voice: ({ size=20, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
      <path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  Progress: ({ size=20, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  ChevronRight: ({ size=16, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
  ChevronDown: ({ size=14, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
  ),
  ArrowLeft: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Volume: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/>
    </svg>
  ),
  Repeat: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
      <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  ),
  Search: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Logout: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Check: ({ size=16, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Lock: ({ size=16, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  Info: ({ size=16, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Play: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Stop: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    </svg>
  ),
  Share: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  Edit: ({ size=16, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Switch: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
      <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  ),
  Collapse: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  Expand: ({ size=18, stroke="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
  Heart: ({ size=16, stroke="currentColor", filled=false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?"#FF4D6D":"none"} stroke={filled?"#FF4D6D":stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
};

/* ─── BRAND — Playful Modern ────────────────────────────── */
const B = {
  // Warm, punchy, joyful palette
  purple:      "#7C3AED",
  purpleMid:   "#8B5CF6",
  purpleLight: "#C4B5FD",
  purplePale:  "#F5F3FF",
  purpleGlow:  "#7C3AED20",

  coral:       "#FF6B6B",
  coralLight:  "#FFE4E4",

  yellow:      "#FFD166",
  yellowLight: "#FFF8E1",
  yellowDark:  "#B8860B",

  mint:        "#06D6A0",
  mintLight:   "#E6FAF5",

  blue:        "#4361EE",
  blueLight:   "#EEF2FF",

  orange:      "#FF9F1C",
  orangeLight: "#FFF3E0",

  ink:         "#1A1033",
  inkMid:      "#3D2E6B",
  inkSoft:     "#6B5B95",
  inkFaint:    "#A89BC2",

  white:       "#FFFFFF",
  offWhite:    "#FAFAF8",
  surface:     "#F7F5FF",
  border:      "#EAE6F8",
  borderMid:   "#D8D0F0",

  red:         "#EF4444",
  redLight:    "#FEF2F2",
  green:       "#22C55E",
  greenLight:  "#F0FDF4",
};

/* ─── GLOBAL STYLES ──────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;0,6..12,800;1,6..12,400&display=swap');

  * { box-sizing: border-box; }
  
  @keyframes birdBob    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes xpin       { from{opacity:0;transform:translateX(-50%) translateY(-14px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown   { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pop        { 0%{transform:scale(0.5) rotate(-6deg);opacity:0} 60%{transform:scale(1.08) rotate(1deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes wiggle     { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-4deg)} 75%{transform:rotate(4deg)} }
  @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes cfal       { 0%{transform:translateY(-10px) rotate(0);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
  @keyframes shimmer    { 0%,100%{opacity:0.7} 50%{opacity:1} }
  @keyframes bounce     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes starPop    { 0%{transform:scale(0) rotate(-30deg);opacity:0} 60%{transform:scale(1.3) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }

  .nav-btn:hover { background: rgba(255,255,255,0.13) !important; color: rgba(255,255,255,0.9) !important; }
  .card-hover:hover { transform: translateY(-3px) !important; box-shadow: 0 10px 36px rgba(124,58,237,0.16) !important; border-color: ${B.purpleLight} !important; }
  .pill-btn:hover { opacity: 0.88; transform: scale(1.03); }
  .quick-btn:hover { transform: scale(1.04) !important; }
`;

/* ─── CONSTANTS ──────────────────────────────────────────── */
const DIALECTS = ["Tobu", "Kalabari", "Nembe"];
const DIALECT_INFO = {
  Tobu:     { region:"Delta State",   speakers:"~500,000", color:"#FF6B35", flag:"🔥" },
  Kalabari: { region:"Rivers State",  speakers:"~300,000", color:"#7C3AED", flag:"🌊" },
  Nembe:    { region:"Bayelsa State", speakers:"~100,000", color:"#06D6A0", flag:"🌿" },
};

const NAV = [
  { id:"home",       Icon:Icon.Home,       label:"Home"       },
  { id:"learn",      Icon:Icon.Learn,      label:"Learn"      },
  { id:"quiz",       Icon:Icon.Quiz,       label:"Quiz"       },
  { id:"dictionary", Icon:Icon.Dictionary, label:"Dictionary" },
  { id:"voice",      Icon:Icon.Voice,      label:"Speak"      },
  { id:"progress",   Icon:Icon.Progress,   label:"Me"         },
];

/* ─── MOCK USERS ─────────────────────────────────────────── */
const MOCK_USERS = [
  { id:"u1", name:"Amina Dokubo",  email:"amina@example.com",  password:"password123", avatar:"👩🏾", joinedDate:"Jan 2025" },
  { id:"u2", name:"Tonye Briggs",  email:"tonye@example.com",  password:"password123", avatar:"👨🏿", joinedDate:"Mar 2025" },
  { id:"u3", name:"Ebiside Okolo", email:"ebi@example.com",    password:"password123", avatar:"👩🏿", joinedDate:"Feb 2025" },
];

/* ─── PERSISTENCE ────────────────────────────────────────── */
function safeGet(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
function getUsersDB() { const s = safeGet("nume_users_db") || {}; const db = {}; MOCK_USERS.forEach(u => { db[u.id] = u; }); Object.values(s).forEach(u => { db[u.id] = u; }); return db; }
function saveUserToDB(user) { const s = safeGet("nume_users_db") || {}; s[user.id] = user; safeSet("nume_users_db", s); }
function freshStats() { return { xp:0, streak:1, hearts:3, completedLessons:{}, achievements:[] }; }
function freshAllStats() { return { Tobu:freshStats(), Kalabari:freshStats(), Nembe:freshStats() }; }
function loadUserStats(uid) { const db = safeGet("nume_stats_db") || {}; return db[uid] || freshAllStats(); }
function saveUserStats(uid, stats) { const db = safeGet("nume_stats_db") || {}; db[uid] = stats; safeSet("nume_stats_db", db); }

/* ─── STREAK HELPERS ─────────────────────────────────────── */
function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); }
function getStreakData(uid, d) { const db = safeGet("nume_streak_db") || {}; return db[uid+"_"+d] || { lastDate:null, count:1 }; }
function saveStreakData(uid, d, data) { const db = safeGet("nume_streak_db") || {}; db[uid+"_"+d] = data; safeSet("nume_streak_db", db); }
function getActiveDates(uid, d) { const db = safeGet("nume_activity_db") || {}; return new Set(db[uid+"_"+d] || []); }
function markActiveDate(uid, d) { const db = safeGet("nume_activity_db") || {}; const key = uid+"_"+d; const arr = Array.from(new Set([...(db[key]||[]), todayStr()])).slice(-90); db[key] = arr; safeSet("nume_activity_db", db); }
function tickStreak(uid, d) { const data = getStreakData(uid, d); const today = todayStr(), yest = yesterdayStr(); let count = data.count; if (data.lastDate === today) return count; else if (data.lastDate === yest) count = data.count + 1; else count = 1; saveStreakData(uid, d, { lastDate:today, count }); return count; }

/* ─── ACHIEVEMENTS ───────────────────────────────────────── */
const ALL_ACHIEVEMENTS = [
  { id:"first_lesson", icon:"🌱", title:"First Steps",   desc:"Completed your first lesson",  color:B.mint },
  { id:"quiz_pass",    icon:"🧠", title:"Quiz Master",   desc:"Passed your first quiz",        color:B.purple },
  { id:"voice_rec",    icon:"🎙️", title:"Speaker",       desc:"Recorded your first word",      color:B.coral },
  { id:"streak_3",     icon:"🔥", title:"On Fire",       desc:"3-day learning streak",         color:B.orange },
  { id:"streak_7",     icon:"⚡", title:"Unstoppable",   desc:"7-day learning streak",         color:B.blue },
  { id:"all_stages",   icon:"🏆", title:"Scholar",       desc:"Completed all stages",          color:B.yellow },
  { id:"dict_10",      icon:"📖", title:"Word Seeker",   desc:"Looked up 10 words",            color:B.blue },
  { id:"perfect_quiz", icon:"💯", title:"Perfect Score", desc:"100% on a quiz",                color:B.coral },
];

/* ─── LESSON DATA ────────────────────────────────────────── */
const RAW_LESSONS = [
  { stage:1, title:"Greetings", icon:"👋", xp:20, desc:"Everyday greetings and polite phrases",
    words:{
      Tobu:[
        { id:201, ijaw:"Seridou",  english:"Good morning",  roman:"seh-REE-doh"    },
        { id:202, ijaw:"Nua",      english:"Welcome",       roman:"NOO-ah"          },
        { id:203, ijaw:"Tubara",   english:"How are you?",  roman:"too-BAH-rah"     },
        { id:204, ijaw:"Emi dau",  english:"I am fine",     roman:"EH-mee dah-oo"   },
        { id:205, ijaw:"Pasisei",  english:"Please",        roman:"pah-SEE-say"     },
        { id:206, ijaw:"Di mu",    english:"Goodbye",       roman:"dee MOO"         },
      ],
      Kalabari:[
        { id:1,  ijaw:"Fiafia sime", english:"Good morning",     roman:"fee-AH-fee-ah SEE-meh" },
        { id:2,  ijaw:"Beke bo",     english:"Welcome",          roman:"BEH-keh boh"            },
        { id:3,  ijaw:"Singbi",      english:"Thank you",        roman:"SING-bee"               },
        { id:4,  ijaw:"Aluwa",       english:"Hello",            roman:"ah-LOO-wah"             },
        { id:5,  ijaw:"Bara bo",     english:"Come as you like", roman:"BAH-rah boh"            },
        { id:6,  ijaw:"Tamuno",      english:"God/Providence",   roman:"tah-MOO-noh"            },
      ],
      Nembe:[
        { id:101, ijaw:"Dawei",     english:"Welcome",       roman:"dah-WAY"        },
        { id:102, ijaw:"Owei seni", english:"Good morning",  roman:"OH-way SEH-nee" },
        { id:103, ijaw:"Singi",     english:"Thank you",     roman:"SING-ee"        },
        { id:104, ijaw:"Toru",      english:"Hello",         roman:"TOH-roo"        },
        { id:105, ijaw:"Adei",      english:"Goodbye",       roman:"ah-DAY"         },
        { id:106, ijaw:"Pele",      english:"Sorry/Please",  roman:"PEH-leh"        },
      ],
    },
  },
  { stage:2, title:"Numbers", icon:"🔢", xp:20, desc:"Count from one to six",
    words:{
      Tobu:[
        { id:207, ijaw:"Emi",     english:"One",   roman:"EH-mee"        },
        { id:208, ijaw:"Aruo",    english:"Two",   roman:"ah-ROO-oh"     },
        { id:209, ijaw:"Esuo",    english:"Three", roman:"eh-SOO-oh"     },
        { id:210, ijaw:"Enimo",   english:"Four",  roman:"eh-NEE-moh"    },
        { id:211, ijaw:"Enimumo", english:"Five",  roman:"eh-NEE-moo-moh"},
        { id:212, ijaw:"Tein",    english:"Ten",   roman:"TAY-n"         },
      ],
      Kalabari:[
        { id:7,  ijaw:"Emi",       english:"One",   roman:"EH-mee"         },
        { id:8,  ijaw:"Aruo",      english:"Two",   roman:"ah-ROO-oh"      },
        { id:9,  ijaw:"Esuo",      english:"Three", roman:"eh-SOO-oh"      },
        { id:10, ijaw:"Enimo",     english:"Four",  roman:"eh-NEE-moh"     },
        { id:11, ijaw:"Enimumo",   english:"Five",  roman:"eh-NEE-moo-moh" },
        { id:12, ijaw:"Eninitein", english:"Six",   roman:"eh-NEE-nee-tain"},
      ],
      Nembe:[
        { id:107, ijaw:"Emu",     english:"One",   roman:"EH-moo"        },
        { id:108, ijaw:"Aruo",    english:"Two",   roman:"ah-ROO-oh"     },
        { id:109, ijaw:"Esuo",    english:"Three", roman:"EH-soo-oh"     },
        { id:110, ijaw:"Enimo",   english:"Four",  roman:"EH-nee-moh"    },
        { id:111, ijaw:"Enimumo", english:"Five",  roman:"EH-nee-moo-moh"},
        { id:112, ijaw:"Initei",  english:"Six",   roman:"EE-nee-tay"    },
      ],
    },
  },
  { stage:3, title:"Family", icon:"👨‍👩‍👧", xp:25, desc:"Family members and relationships",
    words:{
      Tobu:[
        { id:213, ijaw:"Ye",   english:"Mother",          roman:"yeh"         },
        { id:214, ijaw:"Dau",  english:"Father",          roman:"dah-oo"      },
        { id:215, ijaw:"Owei", english:"Man/Husband",     roman:"oh-WAY"      },
        { id:216, ijaw:"Ere",  english:"Woman/Wife",      roman:"EH-reh"      },
        { id:217, ijaw:"Bibi", english:"Child",           roman:"BEE-bee"     },
        { id:218, ijaw:"Ibe",  english:"Community/Clan",  roman:"EE-beh"      },
      ],
      Kalabari:[
        { id:13, ijaw:"Yee",    english:"Mother",        roman:"yeh"           },
        { id:14, ijaw:"Ba",     english:"Father",        roman:"bah"           },
        { id:15, ijaw:"Owiapu", english:"Men/Husbands",  roman:"oh-WEE-ah-poo" },
        { id:16, ijaw:"Iyo",    english:"Woman",         roman:"EE-yoh"        },
        { id:17, ijaw:"Bie",    english:"Child",         roman:"BEE-eh"        },
        { id:18, ijaw:"Opu",    english:"Elder/Chief",   roman:"OH-poo"        },
      ],
      Nembe:[
        { id:113, ijaw:"Yei",    english:"Mother",  roman:"YAY"        },
        { id:114, ijaw:"Bai",    english:"Father",  roman:"BAY"        },
        { id:115, ijaw:"Oweibi", english:"Man",     roman:"oh-WAY-bee" },
        { id:116, ijaw:"Eremi",  english:"Woman",   roman:"EH-reh-mee" },
        { id:117, ijaw:"Biebi",  english:"Child",   roman:"BEE-eh-bee" },
        { id:118, ijaw:"Opuei",  english:"Elder",   roman:"oh-POO-ay"  },
      ],
    },
  },
  { stage:4, title:"Food & Drink", icon:"🍲", xp:25, desc:"Traditional food and drinks",
    words:{
      Tobu:[
        { id:219, ijaw:"Indi",  english:"Fish",          roman:"IN-dee"    },
        { id:220, ijaw:"Beni",  english:"Water",         roman:"BEH-nee"   },
        { id:221, ijaw:"Fiyai", english:"Food",          roman:"FEE-yai"   },
        { id:222, ijaw:"Folou", english:"Soup",          roman:"FOH-loo"   },
        { id:223, ijaw:"Namaa", english:"Meat",          roman:"nah-MAH"   },
        { id:224, ijaw:"Agua",  english:"Beans/Cowpeas", roman:"ah-GOO-ah" },
      ],
      Kalabari:[
        { id:19, ijaw:"Fiyai", english:"Food",          roman:"FEE-yai" },
        { id:20, ijaw:"Indi",  english:"Fish",          roman:"IN-dee"  },
        { id:21, ijaw:"Tubo",  english:"Palm wine",     roman:"TOO-boh" },
        { id:22, ijaw:"Beni",  english:"Water",         roman:"BEH-nee" },
        { id:23, ijaw:"Tombo", english:"Drink/Alcohol", roman:"TOM-boh" },
        { id:24, ijaw:"Namaa", english:"Meat",          roman:"nah-MAH" },
      ],
      Nembe:[
        { id:119, ijaw:"Fiya",  english:"Fish",         roman:"FEE-yah" },
        { id:120, ijaw:"Beni",  english:"Water",        roman:"BEH-nee" },
        { id:121, ijaw:"Fiyai", english:"Food",         roman:"FEE-yai" },
        { id:122, ijaw:"Tubu",  english:"Palm wine",    roman:"TOO-boo" },
        { id:123, ijaw:"Ogi",   english:"Pap/Porridge", roman:"OH-gee"  },
        { id:124, ijaw:"Nama",  english:"Meat",         roman:"NAH-mah" },
      ],
    },
  },
  { stage:5, title:"Home & Place", icon:"🏠", xp:30, desc:"House, village and surroundings",
    words:{
      Tobu:[
        { id:225, ijaw:"Wari",  english:"House/Home",    roman:"WAH-ree"    },
        { id:226, ijaw:"Ama",   english:"Town/Village",  roman:"AH-mah"     },
        { id:227, ijaw:"Okolo", english:"River/Creek",   roman:"oh-KOH-loh" },
        { id:228, ijaw:"Bou",   english:"Forest/Bush",   roman:"BOH-oo"     },
        { id:229, ijaw:"Oru",   english:"Deity/Spirit",  roman:"OH-roo"     },
        { id:230, ijaw:"Ibe",   english:"Community/Clan",roman:"EE-beh"     },
      ],
      Kalabari:[
        { id:25, ijaw:"Warii", english:"House/Home",   roman:"WAH-ree"    },
        { id:26, ijaw:"Ama",   english:"Town/Village", roman:"AH-mah"     },
        { id:27, ijaw:"Okolo", english:"River/Creek",  roman:"oh-KOH-loh" },
        { id:28, ijaw:"Ifie",  english:"Farm/Land",    roman:"EE-fee-eh"  },
        { id:29, ijaw:"Sime",  english:"Place/There",  roman:"SEE-meh"    },
        { id:30, ijaw:"Anga",  english:"Here",         roman:"ANG-ah"     },
      ],
      Nembe:[
        { id:125, ijaw:"Wari",   english:"House",          roman:"WAH-ree"     },
        { id:126, ijaw:"Ama",    english:"Village",        roman:"AH-mah"      },
        { id:127, ijaw:"Okolu",  english:"River",          roman:"oh-KOH-loo"  },
        { id:128, ijaw:"Ibu",    english:"Compound/Yard",  roman:"EE-boo"      },
        { id:129, ijaw:"Agiri",  english:"Tree",           roman:"ah-GEE-ree"  },
        { id:130, ijaw:"Iriama", english:"Rainfall",       roman:"EE-ree-AH-mah"},
      ],
    },
  },
  { stage:6, title:"Time & Days", icon:"⏰", xp:30, desc:"Telling time and daily expressions",
    words:{
      Tobu:[
        { id:231, ijaw:"Seridei", english:"Morning",     roman:"seh-REE-day" },
        { id:232, ijaw:"Keme",    english:"Today",       roman:"KEH-meh"     },
        { id:233, ijaw:"Bou",     english:"Tomorrow",    roman:"BOH-oo"      },
        { id:234, ijaw:"Abobi",   english:"Yesterday",   roman:"ah-BOH-bee"  },
        { id:235, ijaw:"Bolou",   english:"Night",       roman:"BOH-loo"     },
        { id:236, ijaw:"Diye",    english:"Month/Moon",  roman:"DEE-yeh"     },
      ],
      Kalabari:[
        { id:31, ijaw:"Esieri", english:"Morning",   roman:"eh-SEE-eh-ree" },
        { id:32, ijaw:"Keme",   english:"Today",     roman:"KEH-meh"       },
        { id:33, ijaw:"Bou",    english:"Tomorrow",  roman:"BOH-oo"        },
        { id:34, ijaw:"Abo",    english:"Yesterday", roman:"AH-boh"        },
        { id:35, ijaw:"Owu",    english:"Week",      roman:"OH-woo"        },
        { id:36, ijaw:"Bolou",  english:"Night",     roman:"BOH-loo"       },
      ],
      Nembe:[
        { id:131, ijaw:"Esiri",  english:"Morning",    roman:"EH-see-ree"  },
        { id:132, ijaw:"Kemi",   english:"Today",      roman:"KEH-mee"     },
        { id:133, ijaw:"Bomi",   english:"Tomorrow",   roman:"BOH-mee"     },
        { id:134, ijaw:"Abomi",  english:"Yesterday",  roman:"ah-BOH-mee"  },
        { id:135, ijaw:"Bolou",  english:"Night",      roman:"BOH-loo"     },
        { id:136, ijaw:"Owumi",  english:"This week",  roman:"oh-WOO-mee"  },
      ],
    },
  },
];

const WORD_OF_DAY = {
  Tobu:     { ijaw:"Seridou", english:"Good morning",     roman:"seh-REE-doh",  example:"Seridou, tubara?" },
  Kalabari: { ijaw:"Tamuno",  english:"God/Providence",   roman:"tah-MOO-noh",  example:"Tamuno nengibo ofori." },
  Nembe:    { ijaw:"Dawei",   english:"Welcome",          roman:"dah-WAY",      example:"Dawei, toru!" },
};

/* ─── DATA HELPERS ───────────────────────────────────────── */
function getLessons(dialect) { return RAW_LESSONS.map(l => ({ ...l, words:l.words[dialect]||[] })).filter(l => l.words.length > 0); }
function getAllWords(dialect) { return getLessons(dialect).flatMap(l => l.words); }
function buildQuiz(lesson, dialect) {
  const pool = getAllWords(dialect);
  return lesson.words.map(w => {
    const wrong = pool.filter(x => x.id !== w.id).sort(() => Math.random()-0.5).slice(0,3).map(x => x.english);
    return { word:w.ijaw, roman:w.roman, correct:w.english, opts:[...wrong, w.english].sort(() => Math.random()-0.5) };
  });
}
function calcLevel(xp) { return Math.floor(xp / 60) + 1; }
function xpToNext(xp)  { return 60 - (xp % 60); }

/* ─── SPEECH ─────────────────────────────────────────────── */
const SPEECH_CACHE = new Map();
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const EL_MODEL = "eleven_multilingual_v2";
const CORS_PROXY = "https://corsproxy.io/?";
let _currentAudio = null;
function stopAudio() { if (_currentAudio) { try { _currentAudio.pause(); } catch {} _currentAudio = null; } if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); }
async function speakElevenLabs(phonetic, apiKey) {
  const cacheKey = "el_"+phonetic; let blob = SPEECH_CACHE.get(cacheKey);
  if (!blob) { const target = "https://api.elevenlabs.io/v1/text-to-speech/"+VOICE_ID+"/stream"; const res = await fetch(CORS_PROXY+encodeURIComponent(target), { method:"POST", headers:{ "Content-Type":"application/json", "xi-api-key":apiKey }, body:JSON.stringify({ text:phonetic, model_id:EL_MODEL, voice_settings:{ stability:0.35, similarity_boost:0.90, style:0.55, use_speaker_boost:true } }) }); if (!res.ok) { const msg = await res.text().catch(()=>res.statusText); throw new Error(res.status+": "+msg.slice(0,120)); } blob = await res.blob(); SPEECH_CACHE.set(cacheKey, blob); }
  const url = URL.createObjectURL(blob); const audio = new Audio(url); _currentAudio = audio; audio.playbackRate = 0.92; audio.onended = () => URL.revokeObjectURL(url); await audio.play();
}
function speakBrowser(text) { if (typeof window === "undefined" || !window.speechSynthesis) return; const u = new SpeechSynthesisUtterance(text); const voices = window.speechSynthesis.getVoices(); const pick = voices.find(v => /en-NG|Nigeria/i.test(v.lang+v.name)) || voices.find(v => /en-GH|en-ZA|Africa/i.test(v.lang+v.name)) || voices.find(v => /en/i.test(v.lang)); if (pick) u.voice = pick; u.lang = pick ? pick.lang : "en-NG"; u.rate = 0.65; u.pitch = 0.92; window.speechSynthesis.speak(u); }
async function speak(word, apiKey) { stopAudio(); const w = typeof word === "string" ? { ijaw:word, roman:word } : word; const phonetic = ((w.roman||w.ijaw)+"").replace(/-/g," ").replace(/\//g,"").trim(); if (apiKey) { try { await speakElevenLabs(phonetic, apiKey); return; } catch(e) { console.warn("ElevenLabs:",e.message); } } speakBrowser(phonetic); }

/* ─── MOCK BANNER ────────────────────────────────────────── */
function MockBanner({ message, style }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:9, background:`${B.yellow}22`, border:`1.5px dashed ${B.yellow}`, borderRadius:14, padding:"10px 14px", fontSize:12.5, color:"#7A5C00", fontWeight:600, lineHeight:1.5, ...style }}>
      <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>🧪</span>
      <span>{message || "Mock content — for testing purposes only. Verified Ijaw language data will be added in production."}</span>
    </div>
  );
}

/* ─── SHARED COMPONENTS ──────────────────────────────────── */
function Card({ children, style, onClick, hover }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => setH(false)}
      className={hover ? "card-hover" : ""}
      style={{
        background: B.white, borderRadius: 20, padding: 18,
        boxShadow: h ? "0 10px 36px rgba(124,58,237,0.14)" : "0 2px 12px rgba(26,16,51,0.07)",
        border: `2px solid ${h ? B.purpleLight : B.border}`,
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: onClick ? "pointer" : "default",
        ...(style||{})
      }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, color, bg, style, disabled, outline, size="md" }) {
  const c = color || "#fff";
  const bgColor = bg || (outline ? "transparent" : disabled ? B.border : B.purple);
  const pad = size==="sm" ? "8px 15px" : size==="lg" ? "15px 28px" : "12px 20px";
  const fs = size==="sm" ? 13 : size==="lg" ? 16 : 14.5;
  const [h, setH] = useState(false);
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h && !disabled ? (outline ? `${B.purple}10` : B.purpleMid) : bgColor,
        color: disabled ? B.inkFaint : c,
        border: outline ? `2px solid ${B.purple}` : "none",
        borderRadius: 14, padding: pad, fontSize: fs, fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        fontFamily: "inherit", letterSpacing: 0.2,
        boxShadow: (!outline && !disabled) ? `0 4px 16px ${B.purple}35` : "none",
        transform: h && !disabled ? "translateY(-1px)" : "none",
        ...(style||{})
      }}>
      {children}
    </button>
  );
}

function Badge({ children, color, bg }) {
  const c = color || B.purple;
  return (
    <span style={{ background: bg || `${c}18`, color: c, border: `1.5px solid ${c}30`, borderRadius: 99, padding: "3px 11px", fontSize: 11.5, fontWeight: 800, whiteSpace: "nowrap", letterSpacing: 0.2 }}>
      {children}
    </span>
  );
}

function PBar({ value, max, color, h=8, style, rounded=true }) {
  const c = color || B.purple;
  const pct = max > 0 ? Math.min(100, Math.round((value/max)*100)) : 0;
  return (
    <div style={{ background: B.surface, borderRadius: 99, height: h, overflow: "hidden", ...(style||{}) }}>
      <div style={{ width: `${pct}%`, height: "100%", background: c, borderRadius: 99, transition: "width 0.55s cubic-bezier(0.34,1.56,0.64,1)" }}/>
    </div>
  );
}

function HeartsRow({ count, max=3 }) {
  return (
    <div style={{ display:"flex", gap:3 }}>
      {Array.from({length:max}).map((_,i) => <Icon.Heart key={i} size={17} stroke={i < count ? "#FF4D6D" : B.border} filled={i < count}/>)}
    </div>
  );
}

function FlameCount({ count, style }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5, ...(style||{}) }}>
      <span style={{ fontSize:17 }}>🔥</span>
      <span style={{ fontWeight:900, fontSize:15, color:B.orange }}>{count}</span>
    </div>
  );
}

function XPToast({ xp, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2100); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position:"fixed", top:72, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg, ${B.yellow}, ${B.orange})`, color: B.ink, borderRadius: 99, padding: "11px 26px", fontWeight: 900, fontSize: 16, zIndex: 9999, boxShadow: `0 6px 28px ${B.yellow}70`, animation: "xpin 0.32s cubic-bezier(0.34,1.56,0.64,1)", whiteSpace: "nowrap", fontFamily: "inherit" }}>
      ⚡ +{xp} XP
    </div>
  );
}

function Confetti() {
  const cols = [B.purple, B.yellow, B.mint, B.coral, B.blue, B.orange];
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:8888, overflow:"hidden" }}>
      {Array.from({length:52}).map((_,i) => (
        <div key={i} style={{ position:"absolute", left:`${Math.random()*100}%`, width: Math.random()*10+5, height: Math.random()*10+5, background: cols[i%6], borderRadius: Math.random()>0.5?"50%":"4px", animation: `cfal ${1.6+Math.random()*2}s ${Math.random()*0.8}s forwards` }}/>
      ))}
    </div>
  );
}

/* ─── BIRD ───────────────────────────────────────────────── */
function Bird({ size=40, bob, style }) {
  const sz = size || 40;
  return (
    <svg width={sz} height={sz} viewBox="0 0 200 200" style={{ ...(style||{}), ...(bob ? { animation:"birdBob 2.2s ease-in-out infinite" } : {}) }}>
      <ellipse cx="105" cy="108" rx="68" ry="72" fill={B.purpleMid} stroke={B.ink} strokeWidth="6"/>
      <path d="M50 140 Q30 160 45 175 Q70 155 80 145" fill={B.purple} stroke={B.ink} strokeWidth="4"/>
      <path d="M52 148 L44 158" stroke={B.ink} strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M58 152 L52 163" stroke={B.ink} strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M64 155 L60 167" stroke={B.ink} strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M72 42 Q90 20 115 38" fill={B.purpleMid} stroke={B.ink} strokeWidth="5"/>
      <ellipse cx="110" cy="128" rx="42" ry="34" fill={B.purpleLight} opacity="0.45"/>
      <circle cx="95" cy="90" r="32" fill="white" stroke={B.ink} strokeWidth="5"/>
      <circle cx="98" cy="90" r="18" fill={B.ink}/>
      <circle cx="104" cy="84" r="6" fill="white"/>
      <circle cx="148" cy="100" r="12" fill={B.purpleMid} stroke={B.ink} strokeWidth="4"/>
      <polygon points="140,96 162,90 155,103" fill={B.yellow} stroke={B.ink} strokeWidth="3"/>
      <polygon points="140,104 162,112 155,103" fill={B.orange} stroke={B.ink} strokeWidth="3"/>
    </svg>
  );
}

/* ─── ACHIEVEMENT MODAL ──────────────────────────────────── */
function AchievementModal({ achievement, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);
  function handleShare() {
    const text = `I just earned "${achievement.title}" on Nume — Ijaw Voice! ${achievement.icon} ${achievement.desc}. Learn Ijaw languages at your own pace!`;
    if (navigator.share) { navigator.share({ title:"Nume Achievement", text }).catch(()=>{}); }
    else { navigator.clipboard.writeText(text).then(() => alert("Copied!")).catch(()=>{}); }
  }
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(26,16,51,0.75)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(10px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:B.white, borderRadius:28, padding:"40px 28px", maxWidth:340, width:"100%", textAlign:"center", position:"relative", overflow:"hidden", animation:visible?"pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards":"none", opacity:visible?1:0, boxShadow:`0 32px 80px ${achievement.color}50` }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% -10%, ${achievement.color}20 0%, transparent 65%)`, pointerEvents:"none" }}/>
        {/* Floating stars */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ position:"absolute", top:`${10+Math.random()*30}%`, left:`${5+i*20}%`, fontSize:14, animation:`starPop 0.8s ${i*0.12}s both` }}>⭐</div>
        ))}
        <div style={{ width:96, height:96, borderRadius:28, margin:"0 auto 20px", background:`linear-gradient(135deg, ${achievement.color}25, ${achievement.color}45)`, border:`2.5px solid ${achievement.color}50`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:52, position:"relative", zIndex:1, animation:"wiggle 0.6s 0.5s ease-in-out" }}>{achievement.icon}</div>
        <div style={{ display:"inline-block", background:`${achievement.color}18`, border:`1.5px solid ${achievement.color}40`, borderRadius:99, padding:"4px 14px", fontSize:11, fontWeight:900, color:achievement.color, letterSpacing:1.2, marginBottom:12, textTransform:"uppercase" }}>Achievement Unlocked!</div>
        <h2 style={{ color:B.ink, fontSize:26, fontWeight:900, margin:"0 0 8px" }}>{achievement.title}</h2>
        <p style={{ color:B.inkSoft, fontSize:14, margin:"0 0 28px", lineHeight:1.6 }}>{achievement.desc}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button onClick={handleShare} style={{ background:B.purple, border:"none", borderRadius:14, padding:13, color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><Icon.Share size={14} stroke="#fff"/>Share</button>
          <button onClick={onClose} style={{ background:B.purplePale, border:`2px solid ${B.purpleLight}`, borderRadius:14, padding:13, color:B.purple, fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Continue</button>
        </div>
      </div>
    </div>
  );
}

/* ─── STREAK POPOVER ─────────────────────────────────────── */
function StreakPopover({ count, userId, dialect, onClose }) {
  const activeDates = getActiveDates(userId, dialect);
  const today = new Date();
  const days = [];
  for (let i = 48; i >= 0; i--) { const d = new Date(today); d.setDate(today.getDate()-i); days.push({ dateStr:d.toISOString().slice(0,10), dayNum:d.getDate(), isToday:i===0 }); }
  const weeks = []; for (let i = 0; i < days.length; i+=7) weeks.push(days.slice(i,i+7));
  const DAY_LABELS = ["M","T","W","T","F","S","S"];
  return (
    <div style={{ position:"absolute", top:"calc(100% + 10px)", right:0, zIndex:500, background:B.white, borderRadius:22, padding:20, width:300, boxShadow:"0 16px 48px rgba(26,16,51,0.2)", border:`2px solid ${B.border}`, animation:"fadeDown 0.18s ease" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div>
          <p style={{ margin:0, fontWeight:900, fontSize:15, color:B.ink }}>🔥 {count}-day streak</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:B.inkFaint }}>{dialect} · last 7 weeks</p>
        </div>
        <button onClick={onClose} style={{ background:B.surface, border:"none", borderRadius:50, width:28, height:28, cursor:"pointer", color:B.inkSoft, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontFamily:"inherit" }}>×</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:5 }}>
        {DAY_LABELS.map((d,i) => <div key={i} style={{ textAlign:"center", fontSize:9, fontWeight:800, color:B.inkFaint, letterSpacing:0.3 }}>{d}</div>)}
      </div>
      {weeks.map((week,wi) => (
        <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:3 }}>
          {week.map(day => {
            const active = activeDates.has(day.dateStr);
            return <div key={day.dateStr} title={day.dateStr} style={{ width:"100%", aspectRatio:"1", borderRadius:7, background: active ? (day.isToday ? B.orange : `${B.orange}cc`) : day.isToday ? B.purplePale : B.surface, border: day.isToday ? `2px solid ${active ? B.orange : B.purple}` : "2px solid transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color: active ? "#fff" : day.isToday ? B.purple : B.inkFaint }}>{day.dayNum}</div>;
          })}
        </div>
      ))}
    </div>
  );
}

/* ─── SPEECH SETTINGS MODAL ──────────────────────────────── */
function SpeechSettingsModal({ apiKey, onSave, onClose }) {
  const [val, setVal] = useState(apiKey||""); const [testing, setTesting] = useState(false); const [result, setResult] = useState(null);
  async function testKey() { setTesting(true); setResult(null); try { await speakElevenLabs("Seridou", val); setResult("success"); } catch(e) { setResult("fail:"+e.message); } setTesting(false); }
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,16,51,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(10px)" }} onClick={onClose}>
      <div style={{ background:B.white, borderRadius:26, padding:28, maxWidth:420, width:"100%", boxShadow:"0 32px 80px rgba(124,58,237,0.3)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
          <div style={{ width:50, height:50, borderRadius:16, background:B.purplePale, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🎙️</div>
          <div><h3 style={{ margin:0, fontSize:18, color:B.ink, fontWeight:900 }}>Localized Voice</h3><p style={{ margin:0, fontSize:12, color:B.inkFaint }}>Powered by ElevenLabs</p></div>
        </div>
        <div style={{ background:B.purplePale, borderRadius:14, padding:"12px 14px", marginBottom:16, fontSize:13, color:B.inkMid, lineHeight:1.6, border:`1.5px solid ${B.purpleLight}50` }}>
          Browser voices don't support Ijaw accents. ElevenLabs handles West African phonemes. Get a free key at elevenlabs.io.
        </div>
        <label style={{ fontSize:11, fontWeight:800, color:B.inkFaint, display:"block", marginBottom:6, letterSpacing:0.8 }}>ELEVENLABS API KEY</label>
        <input value={val} onChange={e => setVal(e.target.value)} placeholder="sk-..." type="password" style={{ width:"100%", padding:"13px 16px", borderRadius:14, border:`2px solid ${B.border}`, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", marginBottom:10, color:B.ink, background:B.offWhite }}/>
        {result && <p style={{ fontSize:13, margin:"0 0 10px", fontWeight:700, color:result==="success"?B.mint:B.coral }}>{result==="success"?"✅ Voice working!":result.replace("fail:","")}</p>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
          <button onClick={testKey} disabled={!val||testing} style={{ padding:12, borderRadius:14, border:`2px solid ${B.purple}`, background:"transparent", color:B.purple, cursor:(!val||testing)?"not-allowed":"pointer", fontWeight:800, fontSize:14, fontFamily:"inherit" }}>{testing?"Testing…":"Test Voice"}</button>
          <button onClick={() => { onSave(val); onClose(); }} style={{ padding:12, borderRadius:14, border:"none", background:B.purple, color:"#fff", cursor:"pointer", fontWeight:800, fontSize:14, fontFamily:"inherit" }}>Save & Close</button>
        </div>
        {val && <button onClick={() => { onSave(""); onClose(); }} style={{ width:"100%", padding:10, borderRadius:14, border:`2px solid ${B.border}`, background:"transparent", color:B.inkFaint, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Remove key</button>}
        <p style={{ fontSize:11, color:B.inkFaint, margin:"12px 0 0", textAlign:"center" }}>Key stored in localStorage only.</p>
      </div>
    </div>
  );
}

/* ─── DIALECT MODAL ──────────────────────────────────────── */
function DialectModal({ dialect, allStats, onSelect, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,16,51,0.75)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(10px)" }} onClick={onClose}>
      <div style={{ background:B.white, borderRadius:26, padding:28, maxWidth:420, width:"100%", boxShadow:"0 32px 80px rgba(124,58,237,0.3)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
          <Bird size={46}/>
          <div><h3 style={{ margin:0, fontSize:20, color:B.ink, fontWeight:900 }}>Switch Dialect</h3><p style={{ color:B.inkFaint, fontSize:13, margin:0 }}>Progress tracked independently</p></div>
        </div>
        <div style={{ background:B.purplePale, borderRadius:14, padding:"10px 14px", marginBottom:16, fontSize:13, color:B.inkMid, border:`1.5px dashed ${B.purpleLight}` }}>
          💡 Switching doesn't reset progress — each dialect saves separately.
        </div>
        {DIALECTS.map(d => {
          const ds = allStats[d] || freshStats(); const dl = getLessons(d);
          const done = dl.filter(l => ds.completedLessons[d+"_"+l.stage]).length;
          return (
            <div key={d} onClick={() => onSelect(d)} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:18, marginBottom:10, cursor:"pointer", background:d===dialect?B.purplePale:B.offWhite, border:`2px solid ${d===dialect?B.purple:B.border}`, transition:"all 0.2s", transform:d===dialect?"scale(1.01)":"scale(1)" }}>
              <div style={{ width:46, height:46, borderRadius:14, fontSize:24, background:`${DIALECT_INFO[d].color}18`, border:`2px solid ${DIALECT_INFO[d].color}35`, display:"flex", alignItems:"center", justifyContent:"center" }}>{DIALECT_INFO[d].flag}</div>
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontWeight:900, fontSize:16, color:B.ink }}>{d}</p>
                <p style={{ margin:"2px 0 0", fontSize:12, color:B.inkFaint }}>{DIALECT_INFO[d].region} · {done}/{dl.length} stages · {ds.xp} XP</p>
              </div>
              {d===dialect && <Badge color={B.purple}>Active</Badge>}
            </div>
          );
        })}
        <button onClick={onClose} style={{ width:"100%", marginTop:8, padding:13, borderRadius:14, border:`2px solid ${B.border}`, background:"transparent", cursor:"pointer", fontWeight:800, color:B.inkSoft, fontSize:14, fontFamily:"inherit" }}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────── */
function Sidebar({ screen, setScreen, dialect, onSwitch, stats, user, onLogout }) {
  const [col, setCol] = useState(false);
  const level = calcLevel(stats.xp);
  return (
    <div style={{ width:col?68:230, minHeight:"100vh", background:`linear-gradient(180deg, ${B.ink} 0%, #0D0820 100%)`, display:"flex", flexDirection:"column", transition:"width 0.26s cubic-bezier(0.34,1.56,0.64,1)", flexShrink:0, position:"sticky", top:0, height:"100vh", borderRight:`1px solid rgba(255,255,255,0.07)` }}>
      {/* Logo */}
      <div style={{ padding:"20px 14px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:10 }}>
        <Bird size={32}/>{!col && <span style={{ color:"#fff", fontSize:22, fontWeight:900, letterSpacing:-0.5 }}>Nume</span>}
      </div>

      {/* User block */}
      {!col && user && (
        <div style={{ padding:"12px 14px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:38, height:38, borderRadius:50, background:"rgba(255,255,255,0.1)", border:"2px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{user.avatar}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:"#fff", fontWeight:800, fontSize:14, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name.split(" ")[0]}</p>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, margin:0 }}>Level {level}</p>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700 }}>XP</span>
            <span style={{ color:B.yellow, fontSize:11, fontWeight:800 }}>{stats.xp}</span>
          </div>
          <PBar value={60-xpToNext(stats.xp)} max={60} color={B.yellow} h={6}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
            <FlameCount count={stats.streak}/>
            <HeartsRow count={stats.hearts}/>
          </div>
        </div>
      )}

      {/* Dialect switcher */}
      {!col && (
        <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:9, fontWeight:800, letterSpacing:1.5, margin:"0 0 7px", textTransform:"uppercase" }}>Dialect</p>
          <button onClick={onSwitch} style={{ background:"rgba(255,255,255,0.08)", border:"2px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"8px 12px", color:"rgba(255,255,255,0.85)", cursor:"pointer", display:"flex", alignItems:"center", gap:9, width:"100%", fontSize:13.5, fontWeight:800, fontFamily:"inherit" }}>
            <span style={{ fontSize:18 }}>{DIALECT_INFO[dialect].flag}</span>
            <span style={{ flex:1, textAlign:"left" }}>{dialect}</span>
            <Icon.Edit size={13} stroke="rgba(255,255,255,0.35)"/>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 8px" }}>
        {NAV.map(n => {
          const isActive = screen === n.id;
          const NavIcon = n.Icon;
          return (
            <button key={n.id} onClick={() => setScreen(n.id)} title={col ? n.label : ""} className="nav-btn"
              style={{ display:"flex", alignItems:"center", gap:11, width:"100%", padding:"11px 12px", borderRadius:14, marginBottom:3, background:isActive?"rgba(124,58,237,0.35)":"transparent", border:`2px solid ${isActive?"rgba(124,58,237,0.5)":"transparent"}`, color:isActive?"#fff":"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14, fontWeight:isActive?800:500, transition:"all 0.18s", fontFamily:"inherit" }}>
              <NavIcon size={19} stroke={isActive?"#fff":"rgba(255,255,255,0.45)"}/>
              {!col && <span>{n.label}</span>}
              {!col && isActive && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:99, background:B.yellow }}/>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      {!col && (
        <button onClick={onLogout} style={{ background:"transparent", border:"none", color:"rgba(255,120,120,0.7)", padding:"13px 16px", cursor:"pointer", fontSize:13.5, fontWeight:700, textAlign:"left", display:"flex", alignItems:"center", gap:9, borderTop:"1px solid rgba(255,255,255,0.07)", fontFamily:"inherit" }}>
          <Icon.Logout size={17} stroke="rgba(255,120,120,0.7)"/>Sign Out
        </button>
      )}
      <button onClick={() => setCol(!col)} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.25)", padding:"13px 14px", cursor:"pointer", fontSize:13, borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:8, justifyContent:col?"center":"flex-start", fontFamily:"inherit" }}>
        {col ? <Icon.Expand size={17} stroke="rgba(255,255,255,0.3)"/> : <><Icon.Collapse size={17} stroke="rgba(255,255,255,0.3)"/><span style={{ fontSize:12 }}>Collapse</span></>}
      </button>
    </div>
  );
}

/* ─── BOTTOM NAV ─────────────────────────────────────────── */
function BotNav({ screen, setScreen }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:B.white, borderTop:`2px solid ${B.border}`, display:"flex", justifyContent:"space-around", padding:"8px 0 max(10px,env(safe-area-inset-bottom))" }}>
      {NAV.map(n => {
        const isActive = screen === n.id;
        const NavIcon = n.Icon;
        return (
          <button key={n.id} onClick={() => setScreen(n.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1, color:isActive?B.purple:B.inkFaint, fontFamily:"inherit", transition:"all 0.15s" }}>
            <div style={{ width:34, height:34, borderRadius:12, background:isActive?B.purplePale:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.18s" }}>
              <NavIcon size={20} stroke={isActive?B.purple:B.inkFaint}/>
            </div>
            <span style={{ fontSize:9, fontWeight:isActive?900:600, letterSpacing:0.3 }}>{n.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── TOP BAR ────────────────────────────────────────────── */
function TopBar({ title, onBack, dialect, onSwitch, right }) {
  return (
    <div style={{ display:"flex", alignItems:"center", padding:"13px 16px 11px", background:B.white, borderBottom:`2px solid ${B.border}`, position:"sticky", top:0, zIndex:100 }}>
      {onBack && (
        <button onClick={onBack} style={{ background:B.purplePale, border:`2px solid ${B.border}`, borderRadius:12, width:38, height:38, cursor:"pointer", color:B.purple, marginRight:10, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit" }}>
          <Icon.ArrowLeft size={17} stroke={B.purple}/>
        </button>
      )}
      <span style={{ fontSize:17, fontWeight:900, color:B.ink, flex:1 }}>{title}</span>
      {dialect && (
        <button onClick={onSwitch} style={{ background:B.purplePale, border:`2px solid ${B.border}`, borderRadius:20, padding:"6px 13px", fontSize:13, fontWeight:800, cursor:"pointer", color:B.purple, marginRight:8, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
          <span style={{ fontSize:16 }}>{DIALECT_INFO[dialect].flag}</span>{dialect}
        </button>
      )}
      {right}
    </div>
  );
}

/* ─── AUTH SCREEN ────────────────────────────────────────── */
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("landing");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  function upd(f, v) { setForm(x => ({...x, [f]:v})); }
  function handleLogin() {
    setErr(""); if (!form.email||!form.password) { setErr("Please fill in all fields."); return; }
    setBusy(true);
    setTimeout(() => { const db = getUsersDB(); const found = Object.values(db).find(u => u.email.toLowerCase()===form.email.toLowerCase() && u.password===form.password); if (found) { onLogin(found); } else { setErr("Invalid email or password. Try amina@example.com / password123"); setBusy(false); } }, 900);
  }
  function handleSignup() {
    setErr(""); if (!form.name||!form.email||!form.password) { setErr("Please fill in all fields."); return; }
    if (form.password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    const db = getUsersDB(); if (Object.values(db).find(u => u.email.toLowerCase()===form.email.toLowerCase())) { setErr("Account already exists. Sign in instead."); return; }
    setBusy(true);
    const emojis = ["👩🏾","👨🏿","👩🏿","👦🏾","👧🏿","🧑🏾"];
    setTimeout(() => { const nu = { id:"u"+Date.now(), name:form.name, email:form.email, password:form.password, joinedDate:new Date().toLocaleDateString("en-GB",{month:"short",year:"numeric"}), avatar:emojis[Math.floor(Math.random()*emojis.length)] }; saveUserToDB(nu); onLogin(nu); }, 900);
  }
  const inputStyle = { width:"100%", padding:"13px 16px", borderRadius:14, border:`2px solid rgba(255,255,255,0.15)`, background:"rgba(255,255,255,0.1)", color:"#fff", fontSize:14.5, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };

  if (mode === "landing") return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(150deg, ${B.ink} 0%, #2D1050 50%, #0A1840 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      {/* Decorative blobs */}
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:`${B.purple}20`, filter:"blur(80px)", top:-100, right:-100, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:`${B.coral}15`, filter:"blur(70px)", bottom:-50, left:-50, pointerEvents:"none" }}/>
      <div style={{ maxWidth:440, width:"100%", textAlign:"center", position:"relative", zIndex:1, animation:"fadeUp 0.6s ease" }}>
        <div style={{ display:"inline-block", animation:"birdBob 2.5s ease-in-out infinite", marginBottom:20 }}><Bird size={120}/></div>
        <h1 style={{ color:"#fff", fontSize:72, fontWeight:900, margin:"0 0 4px", letterSpacing:-2 }}>Nume</h1>
        <p style={{ color:B.purpleLight, fontSize:17, marginBottom:8, fontWeight:600 }}>Ijaw Voice</p>
        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:15, marginBottom:36, lineHeight:1.75 }}>
          Reconnect with your heritage.<br/>Learn Ijaw languages through audio, quizzes & voice practice.
        </p>
        <MockBanner message="Demo app with placeholder Ijaw language content. Word accuracy & audio are approximated for testing. Verified content coming soon!" style={{ marginBottom:24, textAlign:"left" }}/>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
          <Btn onClick={() => setMode("signup")} size="lg" style={{ width:"100%", fontSize:16, background:`linear-gradient(135deg, ${B.purple}, ${B.purpleMid})` }}>Create Free Account</Btn>
          <Btn onClick={() => setMode("login")} size="lg" outline style={{ width:"100%", fontSize:16, color:"rgba(255,255,255,0.8)", borderColor:"rgba(255,255,255,0.3)" }}>Sign In</Btn>
        </div>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:20, padding:"18px 18px", border:"2px solid rgba(255,255,255,0.08)" }}>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:10, margin:"0 0 12px", fontWeight:800, letterSpacing:1.5 }}>DEMO ACCOUNTS</p>
          {MOCK_USERS.map(u => (
            <button key={u.id} onClick={() => { setForm({ email:u.email, password:u.password, name:u.name }); setMode("login"); }} style={{ display:"flex", alignItems:"center", gap:12, width:"100%", background:"rgba(255,255,255,0.08)", border:"2px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"10px 14px", cursor:"pointer", marginBottom:8, color:"#fff", fontSize:13, fontFamily:"inherit", transition:"all 0.18s" }}>
              <span style={{ fontSize:26 }}>{u.avatar}</span>
              <div style={{ flex:1, textAlign:"left" }}>
                <p style={{ margin:0, fontWeight:800, fontSize:14 }}>{u.name}</p>
                <p style={{ margin:0, fontSize:11, opacity:0.5 }}>{u.email}</p>
              </div>
              <Icon.ChevronRight size={15} stroke="rgba(255,255,255,0.35)"/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const isLogin = mode === "login";
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(150deg, ${B.ink} 0%, #2D1050 60%, #0A1840 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative" }}>
      <div style={{ position:"absolute", width:350, height:350, borderRadius:"50%", background:`${B.purple}20`, filter:"blur(80px)", top:-80, right:-80, pointerEvents:"none" }}/>
      <div style={{ maxWidth:420, width:"100%", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <Bird size={62} bob/>
          <h2 style={{ color:"#fff", fontSize:28, fontWeight:900, margin:"14px 0 4px" }}>{isLogin?"Welcome back! 👋":"Let's get started 🚀"}</h2>
          <p style={{ color:B.purpleLight, fontSize:14, margin:0, fontWeight:600 }}>{isLogin?"Sign in to continue learning":"Start your Ijaw language journey"}</p>
        </div>
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:24, padding:28, border:"2px solid rgba(255,255,255,0.1)" }}>
          {!isLogin && <div style={{ marginBottom:14 }}><label style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:800, display:"block", marginBottom:6, letterSpacing:0.8 }}>FULL NAME</label><input value={form.name} onChange={e => upd("name",e.target.value)} placeholder="e.g. Tonye Briggs" style={inputStyle}/></div>}
          <div style={{ marginBottom:14 }}><label style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:800, display:"block", marginBottom:6, letterSpacing:0.8 }}>EMAIL</label><input value={form.email} onChange={e => upd("email",e.target.value)} placeholder="you@example.com" type="email" style={inputStyle}/></div>
          <div style={{ marginBottom:20 }}><label style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:800, display:"block", marginBottom:6, letterSpacing:0.8 }}>PASSWORD</label><input value={form.password} onChange={e => upd("password",e.target.value)} type="password" placeholder={isLogin?"Your password":"Min. 6 characters"} onKeyDown={e => { if (e.key==="Enter") isLogin?handleLogin():handleSignup(); }} style={inputStyle}/></div>
          {err && <div style={{ background:"rgba(239,68,68,0.18)", border:"2px solid rgba(239,68,68,0.4)", borderRadius:12, padding:"10px 14px", marginBottom:14, color:"#FCA5A5", fontSize:13, fontWeight:600 }}>{err}</div>}
          <Btn onClick={isLogin?handleLogin:handleSignup} style={{ width:"100%", fontSize:15, padding:"14px 20px", background:`linear-gradient(135deg, ${B.purple}, ${B.purpleMid})` }} disabled={busy}>{busy?"Please wait…":isLogin?"Sign In ✨":"Create Account 🎉"}</Btn>
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.45)", fontSize:13, margin:"14px 0 0" }}>{isLogin?"No account? ":"Already have one? "}<button onClick={() => { setMode(isLogin?"signup":"login"); setErr(""); }} style={{ background:"none", border:"none", color:B.purpleLight, cursor:"pointer", fontWeight:800, fontSize:13, fontFamily:"inherit" }}>{isLogin?"Sign up":"Sign in"}</button></p>
        </div>
        <button onClick={() => setMode("landing")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.35)", marginTop:18, cursor:"pointer", fontSize:13, display:"block", width:"100%", textAlign:"center", fontFamily:"inherit" }}>← Back</button>
      </div>
    </div>
  );
}

/* ─── DIALECT PICKER ─────────────────────────────────────── */
function DialectPicker({ onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(150deg, ${B.ink} 0%, #2D1050 50%, #0A1840 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:`${B.purple}18`, filter:"blur(80px)", top:-100, right:-100, pointerEvents:"none" }}/>
      <div style={{ maxWidth:460, width:"100%", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <Bird size={74} bob/>
          <h2 style={{ color:"#fff", fontSize:26, fontWeight:900, margin:"16px 0 6px" }}>Which dialect first? 🗣️</h2>
          <p style={{ color:B.purpleLight, fontSize:14, margin:0, fontWeight:600 }}>You can learn all three — each tracks separately.</p>
        </div>
        <MockBanner message="Dialect word lists are placeholder content for testing. Verified linguistic data will replace these." style={{ marginBottom:18 }}/>
        {DIALECTS.map(d => {
          const info = DIALECT_INFO[d];
          return (
            <div key={d} onMouseEnter={() => setHov(d)} onMouseLeave={() => setHov(null)} onClick={() => onSelect(d)}
              style={{ background:hov===d?"rgba(255,255,255,0.16)":"rgba(255,255,255,0.08)", border:`2px solid ${hov===d?B.purpleLight:"rgba(255,255,255,0.12)"}`, borderRadius:20, padding:"18px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:16, marginBottom:12, transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)", transform:hov===d?"scale(1.025)":"scale(1)", boxShadow:hov===d?`0 12px 36px ${info.color}30`:"none" }}>
              <div style={{ width:54, height:54, borderRadius:16, fontSize:28, flexShrink:0, background:`${info.color}22`, border:`2px solid ${info.color}45`, display:"flex", alignItems:"center", justifyContent:"center" }}>{info.flag}</div>
              <div style={{ flex:1 }}>
                <p style={{ color:"#fff", fontWeight:900, fontSize:19, margin:0 }}>{d}</p>
                <p style={{ color:B.purpleLight, fontSize:13, margin:"3px 0 0", fontWeight:600 }}>{info.region} · {info.speakers} speakers</p>
              </div>
              <Icon.ChevronRight size={20} stroke="rgba(255,255,255,0.4)"/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── HOME ───────────────────────────────────────────────── */
function Home({ dialect, setScreen, dialectStats, onSwitch, user, apiKey }) {
  const wod = WORD_OF_DAY[dialect];
  const level = calcLevel(dialectStats.xp);
  const nxt = xpToNext(dialectStats.xp);
  const dlessons = getLessons(dialect);
  const completedCount = dlessons.filter(l => dialectStats.completedLessons[dialect+"_"+l.stage]).length;
  const nextLesson = dlessons.find(l => !dialectStats.completedLessons[dialect+"_"+l.stage]);

  return (
    <div style={{ paddingBottom:40 }}>
      {/* Hero header */}
      <div style={{ background:`linear-gradient(140deg, ${B.ink} 0%, ${B.inkMid} 50%, #3B0E8C 100%)`, padding:"28px 24px 36px", borderRadius:"0 0 36px 36px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", background:`${B.purple}25`, filter:"blur(50px)", top:-50, right:-40, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", width:160, height:160, borderRadius:"50%", background:`${B.coral}15`, filter:"blur(40px)", bottom:-30, left:-20, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", right:16, top:12, opacity:0.1, transform:"rotate(-10deg)" }}><Bird size={140}/></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, position:"relative", zIndex:1 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:18 }}>{DIALECT_INFO[dialect].flag}</span>
              <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700 }}>{dialect}</span>
              <span style={{ color:"rgba(255,255,255,0.2)" }}>·</span>
              <span style={{ fontSize:20 }}>{user.avatar}</span>
              <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700 }}>{user.name.split(" ")[0]}</span>
            </div>
            <h2 style={{ color:"#fff", fontSize:26, fontWeight:900, margin:0 }}>
              {completedCount===0 ? "Let's start! 🌊" : "Keep going! 🔥"}
            </h2>
          </div>
          <button onClick={onSwitch} style={{ background:"rgba(255,255,255,0.12)", border:"2px solid rgba(255,255,255,0.2)", borderRadius:14, padding:"9px 15px", color:"rgba(255,255,255,0.9)", cursor:"pointer", fontSize:12.5, fontWeight:800, flexShrink:0, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
            <Icon.Switch size={14} stroke="rgba(255,255,255,0.9)"/>Switch
          </button>
        </div>
        {/* Stats pills */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18, position:"relative", zIndex:1 }}>
          {[
            { label:"Level",  value:level,              color:B.yellow,  bg:"rgba(255,209,102,0.15)" },
            { label:"Streak", value:`${dialectStats.streak}d`, color:B.orange,  bg:"rgba(255,159,28,0.15)"  },
            { label:"XP",     value:dialectStats.xp,    color:B.purpleLight, bg:"rgba(196,181,253,0.15)" },
          ].map((s,i) => (
            <div key={i} style={{ background:s.bg, borderRadius:16, padding:"13px 10px", textAlign:"center", border:`1.5px solid ${s.color}30` }}>
              <p style={{ color:s.color, fontWeight:900, fontSize:22, margin:0 }}>{s.value}</p>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:10, margin:"2px 0 0", fontWeight:700, letterSpacing:0.5 }}>{s.label.toUpperCase()}</p>
            </div>
          ))}
        </div>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, margin:"0 0 6px", position:"relative", zIndex:1, fontWeight:600 }}>Level {level} → {level+1} · {nxt} XP to go</p>
        <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:99, height:8, overflow:"hidden", position:"relative", zIndex:1 }}>
          <div style={{ width:`${((60-nxt)/60)*100}%`, height:"100%", background:`linear-gradient(90deg, ${B.yellow}, ${B.orange})`, borderRadius:99, transition:"width 0.55s" }}/>
        </div>
      </div>

      <div style={{ padding:"0 20px" }}>
        <MockBanner message="Word of the Day and all lesson content is placeholder data — not linguistically verified." style={{ marginBottom:18 }}/>

        {/* Continue lesson CTA */}
        {nextLesson && (
          <div onClick={() => setScreen("learn")}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px) scale(1.01)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; }}
            style={{ background:`linear-gradient(135deg, ${B.purple} 0%, ${B.purpleMid} 50%, #4C1D95 100%)`, borderRadius:22, padding:"20px 22px", marginBottom:20, cursor:"pointer", position:"relative", overflow:"hidden", boxShadow:`0 10px 36px ${B.purple}45`, transition:"transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s" }}>
            <div style={{ position:"absolute", right:-20, top:-20, opacity:0.1 }}><Bird size={130}/></div>
            <div style={{ display:"flex", alignItems:"center", gap:14, position:"relative", zIndex:1 }}>
              <div style={{ width:56, height:56, borderRadius:18, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{nextLesson.icon}</div>
              <div style={{ flex:1 }}>
                <Badge color={B.yellow} bg={`${B.yellow}22`}>{completedCount===0?"Start Here 👆":"Continue 💪"}</Badge>
                <p style={{ color:"#fff", fontWeight:900, fontSize:17, margin:"7px 0 3px" }}>Stage {nextLesson.stage}: {nextLesson.title}</p>
                <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12.5, margin:0, fontWeight:600 }}>{nextLesson.words.length} words · {nextLesson.xp} XP</p>
              </div>
              <Icon.ChevronRight size={22} stroke="rgba(255,255,255,0.7)"/>
            </div>
          </div>
        )}

        {/* Word of the day */}
        <Card style={{ marginBottom:20, padding:"22px 24px", background:`linear-gradient(135deg, ${B.white} 0%, ${B.purplePale} 100%)`, border:`2px solid ${B.purpleLight}50` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <Badge color={B.purple}>✨ Word of the Day</Badge>
            <button onClick={() => speak(wod, apiKey)} style={{ background:B.purple, border:"none", borderRadius:14, width:42, height:42, cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 14px ${B.purple}40`, transition:"transform 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
              onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
              <Icon.Volume size={18} stroke="#fff"/>
            </button>
          </div>
          <h2 style={{ color:B.ink, fontSize:44, fontWeight:900, margin:"0 0 4px", letterSpacing:-1 }}>{wod.ijaw}</h2>
          <p style={{ color:B.inkSoft, fontSize:17, margin:"0 0 4px", fontWeight:600 }}>{wod.english}</p>
          <p style={{ color:B.inkFaint, fontStyle:"italic", fontSize:13, margin:"0 0 14px" }}>/{wod.roman}/</p>
          <p style={{ color:B.inkSoft, fontSize:13, fontStyle:"italic", background:"rgba(124,58,237,0.08)", padding:"10px 14px", borderRadius:12, margin:0, borderLeft:`4px solid ${B.purpleLight}`, fontWeight:500 }}>"{wod.example}"</p>
        </Card>

        {/* Quick nav grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { label:"Learn",      sub:"All lessons",               color:"#fff", bg:B.purple,  s:"learn",      icon:"📚", shadowColor:B.purple  },
            { label:"Quiz",       sub:"Test yourself",             color:"#fff", bg:B.blue,    s:"quiz",       icon:"🧠", shadowColor:B.blue    },
            { label:"Dictionary", sub:`${getAllWords(dialect).length} words`, color:"#fff", bg:B.coral,   s:"dictionary", icon:"📖", shadowColor:B.coral  },
            { label:"Speak",      sub:"Practice aloud",            color:"#fff", bg:B.mint,    s:"voice",      icon:"🎙️", shadowColor:B.mint    },
          ].map(item => (
            <button key={item.s} onClick={() => setScreen(item.s)} className="quick-btn"
              style={{ background:`linear-gradient(140deg, ${item.bg}, ${item.bg}cc)`, border:"none", borderRadius:20, padding:"20px 18px", cursor:"pointer", textAlign:"left", boxShadow:`0 6px 22px ${item.shadowColor}35`, transition:"transform 0.2s", fontFamily:"inherit" }}>
              <div style={{ fontSize:26, marginBottom:8 }}>{item.icon}</div>
              <p style={{ color:item.color, fontWeight:900, fontSize:16, margin:"0 0 3px" }}>{item.label}</p>
              <p style={{ color:`${item.color}99`, fontSize:12, margin:0, fontWeight:600 }}>{item.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LEARN ──────────────────────────────────────────────── */
function Learn({ dialect, setScreen, dialectStats, isMobile, onSwitch, setPlayerContext }) {
  const dlessons = getLessons(dialect);
  function getStatus(l) {
    if (dialectStats.completedLessons[dialect+"_"+l.stage]) return "done";
    return (l.stage===1 || dialectStats.completedLessons[dialect+"_"+(l.stage-1)]) ? "available" : "locked";
  }
  return (
    <div style={{ paddingBottom:80 }}>
      {isMobile && <TopBar title="Learn 📚" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ padding:`${isMobile?16:0}px 20px 60px`, maxWidth:680, margin:"0 auto" }}>
        {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 4px", color:B.ink }}>Learning Path 📚</h2>}
        <p style={{ color:B.inkFaint, fontSize:13, margin:"0 0 16px", fontWeight:600 }}>{DIALECT_INFO[dialect].flag} {dialect} · {dlessons.length} stages</p>
        <MockBanner message="Lesson vocabulary is placeholder content for testing purposes. Accuracy not guaranteed." style={{ marginBottom:20 }}/>
        {dlessons.map((l, li) => {
          const status = getStatus(l);
          return (
            <div key={l.stage} style={{ display:"flex", gap:0, marginBottom:8, alignItems:"stretch" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:42, flexShrink:0 }}>
                <div style={{ width:36, height:36, borderRadius:50, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:status==="done"?B.mint:status==="available"?B.purple:B.border, border:`3px solid ${status==="done"?B.mint:status==="available"?B.purpleMid:B.borderMid}`, boxShadow:status==="available"?`0 0 0 5px ${B.purplePale}`:"none", fontSize:status==="locked"?14:status==="done"?0:13, fontWeight:900, color:"#fff" }}>
                  {status==="done" ? <Icon.Check size={16} stroke="#fff"/> : status==="locked" ? <Icon.Lock size={13} stroke={B.inkFaint}/> : li+1}
                </div>
                {li < dlessons.length-1 && <div style={{ width:3, flex:1, minHeight:18, background:status==="done"?`${B.mint}60`:B.border, marginTop:4, borderRadius:99 }}/>}
              </div>
              <div style={{ flex:1, marginLeft:12, paddingBottom:10 }}>
                <Card hover={status!=="locked"} onClick={status==="locked"?undefined:() => { setPlayerContext({lesson:l,dialect}); setScreen("player"); }} style={{ opacity:status==="locked"?0.4:1, cursor:status==="locked"?"not-allowed":"pointer", border:status==="available"?`2px solid ${B.purple}`:undefined }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:48, height:48, borderRadius:16, flexShrink:0, fontSize:22, display:"flex", alignItems:"center", justifyContent:"center", background:status==="done"?`${B.mint}20`:status==="available"?B.purplePale:B.surface, border:`2px solid ${status==="done"?B.mint+"40":status==="available"?B.purpleLight+"60":B.border}` }}>
                      {status==="done" ? <span style={{ fontSize:20 }}>✅</span> : l.icon}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:3 }}>
                        <p style={{ margin:0, fontWeight:900, fontSize:15, color:B.ink }}>Stage {l.stage}: {l.title}</p>
                        {status==="available" && <Badge color={B.purple}>Unlocked 🔓</Badge>}
                        {status==="done" && <Badge color={B.mint}>Done ✓</Badge>}
                      </div>
                      <p style={{ margin:"0 0 5px", fontSize:12.5, color:B.inkFaint, fontWeight:600 }}>{l.desc}</p>
                      <div style={{ display:"flex", gap:14 }}>
                        <span style={{ fontSize:12, color:B.inkFaint, fontWeight:600 }}>{l.words.length} words</span>
                        <span style={{ fontSize:12, color:B.orange, fontWeight:800 }}>⚡ {l.xp} XP</span>
                      </div>
                    </div>
                    {status!=="locked" && <Icon.ChevronRight size={18} stroke={B.inkFaint}/>}
                  </div>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── LESSON PLAYER ──────────────────────────────────────── */
function LessonPlayer({ context, setScreen, addXP, apiKey, grantAchievement }) {
  const { lesson, dialect } = context; const words = lesson.words;
  const [idx, setIdx] = useState(0); const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({}); const [showXP, setShowXP] = useState(false); const [done, setDone] = useState(false);
  const w = words[idx];
  function mark(known) {
    setResults(r => ({...r, [w.id]:known}));
    if (known) { addXP(5); setShowXP(true); setTimeout(() => setShowXP(false), 2100); }
    const next = idx+1;
    if (next < words.length) { setIdx(next); setFlipped(false); }
    else { setDone(true); setTimeout(() => grantAchievement("first_lesson"), 800); }
  }
  if (done) {
    const knownCount = Object.values(results).filter(Boolean).length;
    return (
      <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, ${B.ink}, #1A0840)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
        <div style={{ animation:"bounce 2s ease-in-out infinite" }}><Bird size={100}/></div>
        <h2 style={{ color:"#fff", fontSize:30, fontWeight:900, margin:"18px 0 8px" }}>Lesson Complete! 🎉</h2>
        <p style={{ color:B.purpleLight, fontSize:15, margin:"0 0 28px", fontWeight:600 }}>Stage {lesson.stage}: {lesson.title}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28, width:"100%", maxWidth:380 }}>
          {[{label:"Words learned",value:`${knownCount}/${words.length}`,color:B.yellow},{label:"XP earned",value:`+${knownCount*5}`,color:B.purpleLight}].map((s,i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.1)", borderRadius:18, padding:20, textAlign:"center", border:"2px solid rgba(255,255,255,0.12)" }}>
              <p style={{ color:s.color, fontWeight:900, fontSize:30, margin:0 }}>{s.value}</p>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, margin:"5px 0 0", fontWeight:600 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <Btn onClick={() => setScreen("quizFromLesson")} bg={`linear-gradient(135deg, ${B.yellow}, ${B.orange})`} color={B.ink} style={{ width:"100%", maxWidth:380, fontSize:16, padding:"16px 20px", marginBottom:12 }}>Take the Quiz 🧠</Btn>
        <button onClick={() => setScreen("learn")} style={{ color:"rgba(255,255,255,0.35)", background:"none", border:"none", cursor:"pointer", fontSize:14, fontFamily:"inherit", fontWeight:600 }}>Back to lessons</button>
      </div>
    );
  }
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, ${B.ink} 0%, #1A0840 100%)`, display:"flex", flexDirection:"column" }}>
      {showXP && <XPToast xp={5} onDone={() => setShowXP(false)}/>}
      <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={() => setScreen("learn")} style={{ background:"rgba(255,255,255,0.1)", border:"2px solid rgba(255,255,255,0.12)", borderRadius:12, width:40, height:40, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit" }}>
          <Icon.ArrowLeft size={18} stroke="rgba(255,255,255,0.8)"/>
        </button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:4, marginBottom:7 }}>
            {words.map((_,i) => <div key={i} style={{ height:5, flex:1, borderRadius:99, transition:"background 0.35s", background:results[words[i].id]===true?B.yellow:results[words[i].id]===false?B.coral:i===idx?B.purpleLight:"rgba(255,255,255,0.15)" }}/>)}
          </div>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, margin:0, fontWeight:600 }}>{idx+1}/{words.length} · Stage {lesson.stage}: {lesson.title}</p>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"16px 28px" }}>
        <MockBanner message="Word pronunciations are approximate — for testing only." style={{ marginBottom:18, maxWidth:420, width:"100%" }}/>
        <div onClick={() => setFlipped(!flipped)} style={{ width:"100%", maxWidth:430, borderRadius:28, padding:"52px 40px", textAlign:"center", cursor:"pointer", minHeight:270, display:"flex", flexDirection:"column", justifyContent:"center", background:flipped?`linear-gradient(135deg, ${B.mint} 0%, #064E3B 100%)`:`linear-gradient(135deg, ${B.purple} 0%, ${B.purpleMid} 60%, #4C1D95 100%)`, transition:"background 0.4s cubic-bezier(0.16,1,0.3,1)", boxShadow:flipped?`0 24px 60px ${B.mint}40`:`0 24px 60px ${B.purple}50`, border:"2px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:800, letterSpacing:2, margin:"0 0 14px", textTransform:"uppercase" }}>{flipped?"English":`Ijaw · ${dialect}`}</p>
          <h1 style={{ color:"#fff", fontSize:flipped?34:56, fontWeight:900, margin:0, lineHeight:1.1, letterSpacing:flipped?-0.5:-1 }}>{flipped?w.english:w.ijaw}</h1>
          {!flipped && <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", fontSize:14, margin:"13px 0 0" }}>/{w.roman}/</p>}
          <p style={{ color:"rgba(255,255,255,0.25)", fontSize:12, margin:"18px 0 0", fontWeight:600 }}>{flipped?"":"Tap to reveal"}</p>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:16, width:"100%", maxWidth:430 }}>
          <Btn onClick={() => speak(w, apiKey)} bg="rgba(255,255,255,0.12)" color="#fff" style={{ flex:1, border:"2px solid rgba(255,255,255,0.18)" }}>
            <Icon.Volume size={16} stroke="#fff"/>Audio
          </Btn>
          <Btn onClick={() => { setFlipped(false); speak(w, apiKey); }} bg="rgba(255,255,255,0.12)" color="#fff" style={{ flex:1, border:"2px solid rgba(255,255,255,0.18)" }}>
            <Icon.Repeat size={16} stroke="#fff"/>Again
          </Btn>
        </div>
        {flipped && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:14, width:"100%", maxWidth:430 }}>
            <button onClick={() => mark(false)} style={{ background:"rgba(239,68,68,0.18)", border:`2px solid rgba(239,68,68,0.4)`, color:"#fff", borderRadius:18, padding:16, fontSize:16, fontWeight:900, cursor:"pointer", fontFamily:"inherit" }}>Again 😅</button>
            <button onClick={() => mark(true)} style={{ background:"rgba(6,214,160,0.2)", border:`2px solid rgba(6,214,160,0.45)`, color:"#fff", borderRadius:18, padding:16, fontSize:16, fontWeight:900, cursor:"pointer", fontFamily:"inherit" }}>Got it! ✨</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── QUIZ ───────────────────────────────────────────────── */
function Quiz({ lessonContext, setScreen, dialect, dialectStats, updateDialectStats, addXP, isMobile, onSwitch, apiKey, grantAchievement }) {
  const dlessons = getLessons(dialect);
  const [selLesson, setSelLesson] = useState(lessonContext||null);
  const [qs, setQs] = useState(() => lessonContext ? buildQuiz(lessonContext,dialect).sort(()=>Math.random()-0.5) : null);
  const [qi, setQi] = useState(0); const [sel, setSel] = useState(null); const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3); const [quizDone, setQuizDone] = useState(false);
  const [answers, setAnswers] = useState([]); const [showConf, setShowConf] = useState(false); const [xpToast, setXpToast] = useState(false);
  useEffect(() => {
    if (!quizDone||!selLesson||!qs) return;
    const passed = hearts>0 && score>=Math.ceil(qs.length*0.6);
    const perfect = hearts>0 && score===qs.length;
    if (passed) {
      const key = dialect+"_"+selLesson.stage;
      if (!dialectStats.completedLessons[key]) {
        updateDialectStats(d => ({...d, completedLessons:{...d.completedLessons,[key]:true}, xp:d.xp+selLesson.xp}));
        setShowConf(true);
        setTimeout(() => grantAchievement("quiz_pass"), 1200);
        const allDone = getLessons(dialect).every(l => l.stage===selLesson.stage || dialectStats.completedLessons[dialect+"_"+l.stage]);
        if (allDone) setTimeout(() => grantAchievement("all_stages"), 2000);
      }
    }
    if (perfect) setTimeout(() => grantAchievement("perfect_quiz"), 1600);
  }, [quizDone]);
  function startLesson(l) { setSelLesson(l); setQs(buildQuiz(l,dialect).sort(()=>Math.random()-0.5)); setQi(0); setSel(null); setScore(0); setHearts(3); setQuizDone(false); setAnswers([]); setShowConf(false); }
  function retry() { if (!selLesson) return; setQs(buildQuiz(selLesson,dialect).sort(()=>Math.random()-0.5)); setQi(0); setSel(null); setScore(0); setHearts(3); setQuizDone(false); setAnswers([]); setShowConf(false); }
  function choose(opt) {
    if (sel!==null||hearts<=0||!qs) return;
    const q = qs[qi]; const correct = opt===q.correct;
    setSel(opt); setAnswers(a => [...a, { question:`What does "${q.word}" mean?`, chose:opt, correct:q.correct, isCorrect:correct }]);
    if (correct) { setScore(s => s+1); addXP(10); setXpToast(true); setTimeout(() => setXpToast(false), 2100); }
    else { const nh = hearts-1; setHearts(nh); if (nh<=0) { setTimeout(() => setQuizDone(true), 1200); return; } }
    setTimeout(() => { if (qi<qs.length-1) { setQi(i => i+1); setSel(null); } else setQuizDone(true); }, 1200);
  }
  if (!selLesson) return (
    <div style={{ paddingBottom:80 }}>
      {isMobile && <TopBar title="Quiz 🧠" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ padding:`${isMobile?16:0}px 20px 60px`, maxWidth:600, margin:"0 auto" }}>
        {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 4px", color:B.ink }}>Quiz 🧠</h2>}
        <p style={{ color:B.inkFaint, fontSize:13, margin:"0 0 16px", fontWeight:600 }}>Choose a lesson to quiz yourself on:</p>
        <MockBanner message="Quiz questions use placeholder vocabulary — not verified Ijaw content." style={{ marginBottom:18 }}/>
        {dlessons.map(l => {
          const key = dialect+"_"+l.stage; const completed = !!dialectStats.completedLessons[key];
          const prevDone = l.stage===1 || !!dialectStats.completedLessons[dialect+"_"+(l.stage-1)];
          return (
            <Card key={l.stage} hover={prevDone} onClick={prevDone?() => startLesson(l):undefined} style={{ marginBottom:12, opacity:prevDone?1:0.4, cursor:prevDone?"pointer":"not-allowed" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:48, height:48, borderRadius:16, flexShrink:0, fontSize:22, display:"flex", alignItems:"center", justifyContent:"center", background:completed?`${B.mint}18`:prevDone?B.purplePale:B.surface, border:`2px solid ${completed?B.mint+"40":prevDone?B.purpleLight+"60":B.border}` }}>
                  {completed?"✅":prevDone?l.icon:<Icon.Lock size={16} stroke={B.inkFaint}/>}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontWeight:900, fontSize:15, color:B.ink }}>Stage {l.stage}: {l.title}</p>
                  <p style={{ margin:"3px 0 0", fontSize:12.5, color:B.inkFaint, fontWeight:600 }}>{l.words.length} questions · {l.xp} XP</p>
                </div>
                {completed && <Badge color={B.mint}>Passed ✓</Badge>}
                {!completed && prevDone && <Badge color={B.purple}>Take Quiz</Badge>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
  if (!qs) return <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh" }}><Bird size={60} bob/></div>;
  const q = qs[qi]; const pct = Math.round((score/qs.length)*100);
  const passed = quizDone && hearts>0 && score>=Math.ceil(qs.length*0.6);
  if (quizDone) return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile && <TopBar title="Results" dialect={dialect} onSwitch={onSwitch}/>}
      {showConf && <Confetti/>}
      <div style={{ maxWidth:560, margin:"0 auto", paddingTop:isMobile?20:8 }}>
        <div style={{ textAlign:"center", padding:"32px 0 24px" }}>
          <Bird size={92} bob={passed}/>
          <h2 style={{ color:B.ink, fontSize:28, fontWeight:900, margin:"16px 0 6px" }}>{passed?"Stage Cleared! 🎉":hearts<=0?"Out of hearts 💔":"Almost there! 💪"}</h2>
          {passed && <div style={{ background:B.yellowLight, borderRadius:16, padding:"10px 20px", display:"inline-block", margin:"0 0 12px", border:`2px solid ${B.yellow}50` }}><span style={{ color:B.ink, fontWeight:800, fontSize:13 }}>+{selLesson.xp} XP · Stage {selLesson.stage+1} Unlocked! 🔓</span></div>}
          <p style={{ fontSize:46, fontWeight:900, color:B.purple, margin:"0 0 4px", letterSpacing:-1 }}>{score}<span style={{ color:B.inkFaint, fontSize:22 }}>/{qs.length}</span></p>
          <p style={{ color:B.inkFaint, marginBottom:20, fontSize:14, fontWeight:600 }}>{pct}% · {passed?"Passed ✓":"Need 60% to pass"}</p>
        </div>
        <h3 style={{ fontSize:11, fontWeight:800, color:B.inkFaint, letterSpacing:1.5, marginBottom:10 }}>REVIEW</h3>
        {answers.map((a,i) => (
          <Card key={i} style={{ marginBottom:8, padding:"12px 16px", borderLeft:`4px solid ${a.isCorrect?B.mint:B.coral}` }}>
            <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:800, color:B.ink }}>{a.question}</p>
            <p style={{ margin:0, fontSize:12.5, color:a.isCorrect?B.mint:B.coral, fontWeight:700 }}>{(a.isCorrect?"✓ ":"✗ ")+a.chose}{!a.isCorrect&&<span style={{ color:B.inkFaint }}> · Correct: {a.correct}</span>}</p>
          </Card>
        ))}
        <div style={{ display:"grid", gridTemplateColumns:passed?"1fr":"1fr 1fr", gap:10, marginTop:16 }}>
          {!passed && <Btn onClick={retry}><Icon.Repeat size={15} stroke="#fff"/>Retry</Btn>}
          <Btn bg={B.mint} color={B.ink} onClick={() => { setSelLesson(null); setScreen("learn"); }}>{passed?"Next Stage 🚀":"Back to lessons"}</Btn>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile && <TopBar title={`Stage ${selLesson.stage}: ${selLesson.title}`} onBack={() => setSelLesson(null)} dialect={dialect} onSwitch={onSwitch}/>}
      {xpToast && <XPToast xp={10} onDone={() => setXpToast(false)}/>}
      <div style={{ maxWidth:560, margin:"0 auto", paddingTop:isMobile?16:0 }}>
        {!isMobile && <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h2 style={{ fontSize:20, fontWeight:900, margin:0, color:B.ink }}>Stage {selLesson.stage}: {selLesson.title}</h2>
          <button onClick={() => setSelLesson(null)} style={{ background:"none", border:"none", color:B.purple, cursor:"pointer", fontWeight:800, fontSize:13, fontFamily:"inherit" }}>All quizzes</button>
        </div>}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <p style={{ color:B.inkFaint, fontSize:12.5, fontWeight:700, margin:0 }}>Q{qi+1}/{qs.length}</p>
          <HeartsRow count={hearts}/>
          <p style={{ color:B.orange, fontSize:12.5, fontWeight:900, margin:0 }}>⚡ {score*10} XP</p>
        </div>
        <div style={{ display:"flex", gap:4, marginBottom:18 }}>{qs.map((_,i) => <div key={i} style={{ height:6, flex:1, borderRadius:99, transition:"all 0.3s", background:i<qi?B.purple:i===qi?B.yellow:B.border }}/>)}</div>
        <Card style={{ background:`linear-gradient(135deg, ${B.purple} 0%, ${B.purpleMid} 60%, #4C1D95 100%)`, marginBottom:18, padding:"26px 22px", border:"none" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ color:B.purpleLight, fontSize:10, margin:"0 0 8px", fontWeight:800, letterSpacing:1.5 }}>WHAT DOES THIS MEAN?</p>
              <h2 style={{ color:"#fff", fontSize:44, fontWeight:900, margin:"0 0 5px", letterSpacing:-1 }}>{q.word}</h2>
              <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", fontSize:13.5, margin:0, fontWeight:600 }}>/{q.roman}/</p>
            </div>
            <button onClick={() => speak(q, apiKey)} style={{ background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.2)", borderRadius:14, width:44, height:44, color:"#fff", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon.Volume size={18} stroke="#fff"/>
            </button>
          </div>
        </Card>
        {q.opts.map((opt,i) => {
          let bg = B.white, border = `2px solid ${B.border}`, tc = B.ink;
          if (sel!==null) { if (opt===q.correct) { bg=B.greenLight; border=`2px solid ${B.green}`; tc=B.green; } else if (opt===sel) { bg=B.redLight; border=`2px solid ${B.red}`; tc=B.red; } }
          return (
            <div key={i} onClick={() => choose(opt)} style={{ background:bg, border, borderRadius:16, padding:"15px 18px", marginBottom:10, cursor:sel===null?"pointer":"default", display:"flex", alignItems:"center", gap:13, transition:"all 0.2s", color:tc }}>
              <div style={{ width:32, height:32, borderRadius:10, border:`2px solid ${sel!==null&&opt===q.correct?B.green:sel!==null&&opt===sel?B.red:B.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, flexShrink:0, color:tc, background:sel!==null&&opt===q.correct?`${B.green}15`:sel!==null&&opt===sel?`${B.red}15`:"transparent" }}>{["A","B","C","D"][i]}</div>
              <span style={{ fontSize:15.5, fontWeight:700, flex:1 }}>{opt}</span>
              {sel!==null && opt===q.correct && <span style={{ fontSize:18 }}>✅</span>}
              {sel!==null && opt===sel && opt!==q.correct && <span style={{ fontSize:18 }}>❌</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── DICTIONARY ─────────────────────────────────────────── */
function Dictionary({ dialect, isMobile, onSwitch, setScreen, apiKey }) {
  const [query, setQuery] = useState(""); const [sel, setSel] = useState(null);
  const dwords = getAllWords(dialect);
  const filtered = dwords.filter(w => w.ijaw.toLowerCase().includes(query.toLowerCase()) || w.english.toLowerCase().includes(query.toLowerCase()) || w.roman.toLowerCase().includes(query.toLowerCase()));
  if (sel) return (
    <div>
      {isMobile && <TopBar title="Word Detail" onBack={() => setSel(null)}/>}
      <div style={{ padding:"0 20px 80px", maxWidth:560, margin:"0 auto" }}>
        {!isMobile && <button onClick={() => setSel(null)} style={{ background:"none", border:"none", color:B.purple, cursor:"pointer", fontSize:13.5, fontWeight:800, margin:"8px 0 16px", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}><Icon.ArrowLeft size={14} stroke={B.purple}/>Dictionary</button>}
        <Card style={{ background:`linear-gradient(135deg, ${B.purple} 0%, ${B.purpleMid} 60%, #4C1D95 100%)`, textAlign:"center", padding:"48px 36px", marginBottom:16, border:"none" }}>
          <h1 style={{ color:"#fff", fontSize:64, fontWeight:900, margin:0, letterSpacing:-2 }}>{sel.ijaw}</h1>
          <p style={{ color:"rgba(255,255,255,0.9)", fontSize:23, margin:"10px 0 6px", fontWeight:700 }}>{sel.english}</p>
          <p style={{ color:B.purpleLight, fontStyle:"italic", margin:0, fontSize:14 }}>/{sel.roman}/</p>
        </Card>
        <MockBanner message="Definitions and pronunciations are placeholder content for testing." style={{ marginBottom:14 }}/>
        <Card style={{ marginBottom:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div><p style={{ margin:0, fontSize:10, color:B.inkFaint, fontWeight:800, letterSpacing:1 }}>DIALECT</p><p style={{ margin:"5px 0 0", fontSize:17, fontWeight:900, color:B.ink }}>{dialect}</p></div>
            <div><p style={{ margin:0, fontSize:10, color:B.inkFaint, fontWeight:800, letterSpacing:1 }}>REGION</p><p style={{ margin:"5px 0 0", fontSize:17, fontWeight:900, color:B.ink }}>{DIALECT_INFO[dialect].region}</p></div>
          </div>
        </Card>
        <Btn onClick={() => speak(sel, apiKey)} style={{ width:"100%", marginBottom:10 }}><Icon.Volume size={16} stroke="#fff"/>Hear Pronunciation</Btn>
        <Btn onClick={() => setScreen("voice")} outline style={{ width:"100%", color:B.purple }}><Icon.Voice size={16} stroke={B.purple}/>Practice This Word</Btn>
      </div>
    </div>
  );
  return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile && <TopBar title="Dictionary 📖" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ maxWidth:700, margin:"0 auto", paddingTop:isMobile?16:0 }}>
        {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 4px", color:B.ink }}>Dictionary 📖</h2>}
        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14, background:B.purplePale, borderRadius:14, padding:"8px 14px", border:`2px solid ${B.purpleLight}50` }}>
          <span style={{ fontSize:18 }}>{DIALECT_INFO[dialect].flag}</span>
          <span style={{ fontSize:13.5, fontWeight:800, color:B.purple }}>{dialect} · {dwords.length} words</span>
        </div>
        <MockBanner message="All dictionary entries are placeholder data — pronunciations and meanings are approximated for testing." style={{ marginBottom:14 }}/>
        <div style={{ position:"relative", marginBottom:14 }}>
          <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}><Icon.Search size={17} stroke={B.inkFaint}/></div>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Ijaw or English…" style={{ width:"100%", padding:"13px 16px 13px 42px", borderRadius:16, border:`2px solid ${B.border}`, fontSize:15, background:B.white, boxSizing:"border-box", outline:"none", fontFamily:"inherit", color:B.ink }}/>
        </div>
        <p style={{ color:B.inkFaint, fontSize:12.5, fontWeight:700, marginBottom:14 }}>{filtered.length} results</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
          {filtered.map(w => (
            <Card key={w.id} hover onClick={() => setSel(w)} style={{ cursor:"pointer", padding:"15px 17px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <p style={{ margin:0, fontWeight:900, fontSize:21, color:B.ink, letterSpacing:-0.5 }}>{w.ijaw}</p>
                  <p style={{ margin:"4px 0 4px", fontSize:13.5, color:B.inkSoft, fontWeight:600 }}>{w.english}</p>
                  <p style={{ margin:0, fontSize:12, color:B.purpleLight, fontStyle:"italic" }}>/{w.roman}/</p>
                </div>
                <button onClick={e => { e.stopPropagation(); speak(w, apiKey); }} style={{ background:B.purplePale, border:`2px solid ${B.border}`, borderRadius:12, width:36, height:36, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", marginTop:2 }}>
                  <Icon.Volume size={15} stroke={B.purple}/>
                </button>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:64, color:B.inkFaint }}><Bird size={72}/><p style={{ fontWeight:800, marginTop:14, fontSize:16 }}>No words found 🤔</p><p style={{ fontSize:13.5 }}>Try a different search term.</p></div>}
      </div>
    </div>
  );
}

/* ─── VOICE ──────────────────────────────────────────────── */
function Voice({ dialect, isMobile, updateDialectStats, onSwitch, addXP, apiKey, grantAchievement }) {
  const [rec, setRec] = useState(false); const [hasRec, setHasRec] = useState(false); const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState("Tap Record to activate your mic"); const [stype, setStype] = useState("idle");
  const [wi, setWi] = useState(0); const [recCount, setRecCount] = useState(0); const [score, setScore] = useState(null);
  const [micDenied, setMicDenied] = useState(false); const [secs, setSecs] = useState(0);
  const mediaRef = useRef(null); const chunksRef = useRef([]); const blobRef = useRef(null); const audioRef = useRef(null); const timerRef = useRef(null);
  const pw = getAllWords(dialect).slice(0,10); const curr = pw[wi]||pw[0];
  const finish = useCallback(() => {
    const n = recCount+1; setRecCount(n);
    setTimeout(() => setScore(Math.floor(55+Math.random()*45)), 900);
    if (n===1) { updateDialectStats(d => ({...d, achievements:[...new Set([...(d.achievements||[]),"voice_rec"])]})); setTimeout(() => grantAchievement("voice_rec"), 1000); addXP(15); }
    else addXP(5);
  }, [recCount, addXP, updateDialectStats, grantAchievement]);
  async function startRec() {
    chunksRef.current=[]; setScore(null); setHasRec(false); setSecs(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio:true}); setMicDenied(false);
      const mr = new MediaRecorder(stream); mediaRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size>0) chunksRef.current.push(e.data); };
      mr.onstop = () => { blobRef.current = new Blob(chunksRef.current,{type:mr.mimeType||"audio/webm"}); setHasRec(true); stream.getTracks().forEach(t => t.stop()); clearInterval(timerRef.current); setStatus("Saved — press Play Back 🎧"); setStype("saved"); finish(); };
      mr.start(100); setRec(true); setStatus("Recording — say the word clearly 🎤"); setStype("recording");
      timerRef.current = setInterval(() => setSecs(s => s+1), 1000);
    } catch(err) {
      if (err.name==="NotAllowedError"||err.name==="PermissionDeniedError") { setMicDenied(true); setStatus("Mic access denied 🔒"); setStype("error"); }
      else { setRec(true); setStatus("Recording (demo)… 🎤"); setStype("recording"); timerRef.current = setInterval(() => setSecs(s => s+1), 1000); setTimeout(() => { setRec(false); setHasRec(true); setStatus("Demo saved — press Play Back 🎧"); setStype("saved"); clearInterval(timerRef.current); finish(); }, 3000); }
    }
  }
  function stopRec() { if (mediaRef.current && mediaRef.current.state!=="inactive") mediaRef.current.stop(); setRec(false); clearInterval(timerRef.current); }
  function playRec() {
    if (!blobRef.current) { speak(curr,apiKey); setStatus("Playing demo…"); setStype("playing"); setTimeout(() => { setStatus("Done!"); setStype("saved"); }, 2000); return; }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current=null; }
    const url = URL.createObjectURL(blobRef.current); const a = new Audio(url); audioRef.current = a;
    a.oncanplaythrough = () => a.play().catch(() => { setStatus("Playback failed"); setStype("error"); });
    a.onplay = () => { setPlaying(true); setStatus("Playing your voice… 🔊"); setStype("playing"); };
    a.onended = () => { setPlaying(false); setStatus("Compare with the sample above 🎯"); setStype("saved"); URL.revokeObjectURL(url); };
    a.onerror = () => { setPlaying(false); setStatus("Playback error"); setStype("error"); };
  }
  function selectWord(i) { setWi(i); setHasRec(false); setScore(null); setSecs(0); setStatus("Tap Record to activate your mic"); setStype("idle"); if (audioRef.current) { audioRef.current.pause(); audioRef.current=null; } setPlaying(false); setRec(false); }
  const scColor = score ? (score>=80?B.mint:score>=60?B.yellow:B.coral) : B.inkFaint;
  const stConf = { idle:{bg:`${B.purple}0C`,bdr:B.border,clr:B.inkFaint}, recording:{bg:`${B.coral}12`,bdr:`${B.coral}50`,clr:B.coral}, saved:{bg:`${B.mint}12`,bdr:`${B.mint}50`,clr:"#059669"}, playing:{bg:`${B.blue}10`,bdr:`${B.blue}40`,clr:B.blue}, error:{bg:`${B.yellow}15`,bdr:`${B.yellow}50`,clr:"#7A5C00"} };
  const sc = stConf[stype] || stConf.idle;
  return (
    <div style={{ paddingBottom:80 }}>
      {isMobile && <TopBar title="Voice Practice 🎙️" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ padding:"0 20px", maxWidth:640, margin:"0 auto", paddingTop:isMobile?16:0 }}>
        {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 16px", color:B.ink }}>Voice Practice 🎙️</h2>}
        <MockBanner message="Voice scoring is simulated — AI pronunciation feedback is not implemented in this testing version." style={{ marginBottom:18 }}/>
        <Card style={{ background:`linear-gradient(135deg, ${B.purple} 0%, ${B.purpleMid} 60%, #4C1D95 100%)`, textAlign:"center", padding:"42px 32px", marginBottom:20, border:"none", boxShadow:`0 12px 40px ${B.purple}45` }}>
          <p style={{ color:B.purpleLight, margin:"0 0 12px", fontSize:10, fontWeight:800, letterSpacing:2 }}>SAY THIS WORD</p>
          <h1 style={{ color:"#fff", fontSize:56, fontWeight:900, margin:"0 0 8px", letterSpacing:-1.5 }}>{curr.ijaw}</h1>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:21, margin:"0 0 6px", fontWeight:700 }}>{curr.english}</p>
          <p style={{ color:B.purpleLight, fontStyle:"italic", fontSize:13.5, margin:"0 0 20px" }}>/{curr.roman}/</p>
          <button onClick={() => speak(curr, apiKey)} style={{ background:"rgba(255,255,255,0.18)", border:"2px solid rgba(255,255,255,0.3)", borderRadius:50, padding:"12px 28px", color:"#fff", cursor:"pointer", fontSize:14.5, fontWeight:800, display:"flex", alignItems:"center", gap:8, margin:"0 auto", fontFamily:"inherit" }}>
            <Icon.Volume size={17} stroke="#fff"/>Hear Sample
          </button>
        </Card>
        {micDenied && <Card style={{ background:`${B.yellow}15`, border:`2px solid ${B.yellow}50`, marginBottom:14, padding:"14px 16px" }}><p style={{ margin:0, fontSize:13.5, color:B.ink, fontWeight:800 }}>🔒 Mic access blocked</p><p style={{ margin:"5px 0 0", fontSize:12.5, color:B.inkSoft }}>Click the lock icon in your browser address bar and allow microphone access.</p></Card>}
        {score!==null && (
          <Card style={{ marginBottom:18, textAlign:"center", padding:"18px 22px", border:`2px solid ${scColor}35` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:18 }}>
              <Bird size={52} bob={score>=80}/>
              <div>
                <p style={{ margin:0, fontSize:10, color:B.inkFaint, fontWeight:800, letterSpacing:1 }}>SCORE</p>
                <p style={{ margin:"4px 0", fontSize:42, fontWeight:900, color:scColor, letterSpacing:-1 }}>{score}%</p>
                <p style={{ margin:0, fontSize:13, color:B.inkFaint, fontWeight:600 }}>{score>=80?"Excellent! 🎉":score>=60?"Good job! 👍":"Keep practicing 💪"}</p>
              </div>
            </div>
          </Card>
        )}
        <div style={{ borderRadius:16, padding:"12px 16px", fontSize:13.5, fontWeight:700, marginBottom:18, background:sc.bg, border:`2px solid ${sc.bdr}`, color:sc.clr, transition:"all 0.3s", display:"flex", alignItems:"center", gap:10 }}>
          {stype==="recording" && <><span style={{ width:9, height:9, borderRadius:"50%", background:B.coral, display:"inline-block", animation:"pulse 1s infinite", flexShrink:0 }}/><span style={{ fontWeight:900 }}>{secs}s</span></>}
          <span style={{ flex:1 }}>{status}</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
          <button onClick={rec?stopRec:startRec} style={{ background:rec?`linear-gradient(135deg,${B.coral},#CC0000)`:`linear-gradient(135deg,${B.purple},${B.purpleMid})`, border:"none", borderRadius:18, padding:"20px 16px", color:"#fff", fontWeight:900, fontSize:15.5, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8, boxShadow:rec?`0 6px 20px ${B.coral}50`:`0 6px 20px ${B.purple}45`, transition:"all 0.2s", fontFamily:"inherit" }}>
            {rec ? <Icon.Stop size={28} stroke="#fff"/> : <Icon.Voice size={28} stroke="#fff"/>}
            <span>{rec?`Stop (${secs}s)⏹`:"Record 🎤"}</span>
          </button>
          <button onClick={hasRec?playRec:undefined} disabled={!hasRec} style={{ background:!hasRec?B.surface:playing?`linear-gradient(135deg,${B.purpleMid},${B.purple})`:`linear-gradient(135deg,${B.mint},#059669)`, border:`2px solid ${!hasRec?B.border:"transparent"}`, borderRadius:18, padding:"20px 16px", color:!hasRec?B.inkFaint:"#fff", fontWeight:900, fontSize:15.5, cursor:!hasRec?"not-allowed":"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8, boxShadow:hasRec?`0 6px 20px ${B.mint}50`:"none", transition:"all 0.2s", fontFamily:"inherit" }}>
            <Icon.Play size={28} stroke={!hasRec?B.inkFaint:"#fff"}/>
            <span>{playing?"Playing…":"Play Back 🎧"}</span>
          </button>
        </div>
        <Card style={{ marginBottom:18 }}>
          <p style={{ margin:"0 0 12px", fontWeight:900, fontSize:14.5, color:B.ink }}>{dialect} Words</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {pw.map((w,i) => (
              <button key={w.id} onClick={() => selectWord(i)} style={{ padding:"8px 15px", borderRadius:20, border:`2px solid ${i===wi?B.purple:B.border}`, cursor:"pointer", background:i===wi?B.purple:B.offWhite, color:i===wi?"#fff":B.inkSoft, fontWeight:800, fontSize:13, transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)", fontFamily:"inherit" }}>{w.ijaw}</button>
            ))}
          </div>
        </Card>
        <Card style={{ background:B.purplePale, border:`2px solid ${B.purpleLight}50`, padding:"16px 18px" }}>
          <div style={{ display:"flex", gap:12 }}>
            <Bird size={38}/>
            <div>
              <p style={{ margin:"0 0 8px", fontWeight:900, fontSize:13.5, color:B.ink }}>How to practice:</p>
              {["1. Tap Hear Sample — listen carefully 👂","2. Tap Record — speak into your mic 🎤","3. Tap Stop when done ⏹","4. Tap Play Back — hear yourself 🎧","5. Compare and repeat! 🔄"].map((t,i) => <p key={i} style={{ margin:"3px 0", fontSize:12.5, color:B.inkSoft, fontWeight:600 }}>{t}</p>)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─── PROGRESS ───────────────────────────────────────────── */
function Progress({ dialect, allStats, isMobile, onSwitch, user, onLogout }) {
  const ds = allStats[dialect]||freshStats();
  const level = calcLevel(ds.xp); const nxt = xpToNext(ds.xp);
  const dlessons = getLessons(dialect);
  const done = dlessons.filter(l => ds.completedLessons[dialect+"_"+l.stage]).length;
  const totalXP = DIALECTS.reduce((sum,d) => sum+(allStats[d]?allStats[d].xp:0), 0);
  return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile && <TopBar title="My Progress 📊" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ maxWidth:640, margin:"0 auto", paddingTop:isMobile?16:0 }}>
        {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 16px", color:B.ink }}>My Progress 📊</h2>}
        {/* Profile */}
        <Card style={{ background:`linear-gradient(140deg, ${B.ink} 0%, ${B.inkMid} 60%, #3B0E8C 100%)`, border:"none", marginBottom:22, padding:26, boxShadow:`0 12px 40px ${B.purple}30` }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
            <div style={{ width:68, height:68, borderRadius:22, background:"rgba(255,255,255,0.12)", border:"3px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:42, flexShrink:0 }}>{user.avatar}</div>
            <div>
              <p style={{ color:"#fff", fontWeight:900, fontSize:21, margin:0 }}>{user.name}</p>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:12.5, margin:"3px 0 7px", fontWeight:600 }}>{user.email} · Joined {user.joinedDate}</p>
              <p style={{ color:B.yellow, fontSize:13.5, fontWeight:900, margin:0 }}>⚡ {totalXP} total XP across all dialects</p>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, margin:"0 0 6px", fontWeight:700 }}>Level {level} → {level+1} · {nxt} XP remaining ({dialect})</p>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:99, height:8, overflow:"hidden" }}>
            <div style={{ width:`${((60-nxt)/60)*100}%`, height:"100%", background:`linear-gradient(90deg,${B.yellow},${B.orange})`, borderRadius:99, transition:"width 0.55s" }}/>
          </div>
        </Card>
        {/* All dialects */}
        <h3 style={{ fontSize:11, fontWeight:800, color:B.inkFaint, letterSpacing:1.5, marginBottom:14 }}>ALL DIALECTS</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:12, marginBottom:26 }}>
          {DIALECTS.map(d => {
            const dst = allStats[d]||freshStats(); const dl = getLessons(d);
            const dc = dl.filter(l => dst.completedLessons[d+"_"+l.stage]).length;
            return (
              <Card key={d} style={{ border:d===dialect?`2px solid ${B.purple}`:undefined, padding:"16px 17px" }} active={d===dialect}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontSize:24 }}>{DIALECT_INFO[d].flag}</span>
                  {d===dialect && <Badge color={B.purple}>Active</Badge>}
                </div>
                <p style={{ margin:0, fontWeight:900, fontSize:15, color:B.ink }}>{d}</p>
                <p style={{ margin:"3px 0 10px", fontSize:12, color:B.inkFaint, fontWeight:600 }}>{dc}/{dl.length} stages · {dst.xp} XP</p>
                <PBar value={dc} max={dl.length} h={7}/>
              </Card>
            );
          })}
        </div>
        {/* Stages */}
        <h3 style={{ fontSize:11, fontWeight:800, color:B.inkFaint, letterSpacing:1.5, marginBottom:14 }}>{dialect.toUpperCase()} STAGES</h3>
        {dlessons.map(l => {
          const cleared = !!ds.completedLessons[dialect+"_"+l.stage];
          return (
            <Card key={l.stage} style={{ marginBottom:10, padding:"15px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:24 }}>{l.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <p style={{ margin:0, fontWeight:900, fontSize:14.5, color:B.ink }}>Stage {l.stage}: {l.title}</p>
                    {cleared ? <Badge color={B.mint}>Cleared ✅</Badge> : <Badge color={B.inkFaint}>Pending</Badge>}
                  </div>
                  <p style={{ margin:"3px 0 0", fontSize:12, color:B.inkFaint, fontWeight:600 }}>{l.words.length} words · {l.xp} XP</p>
                </div>
              </div>
            </Card>
          );
        })}
        {/* Achievements */}
        <h3 style={{ fontSize:11, fontWeight:800, color:B.inkFaint, letterSpacing:1.5, margin:"26px 0 14px" }}>ACHIEVEMENTS</h3>
        <MockBanner message="Achievement definitions and milestone data are placeholder — subject to change." style={{ marginBottom:16 }}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(158px,1fr))", gap:12, marginBottom:26 }}>
          {ALL_ACHIEVEMENTS.map(a => {
            const earned = (ds.achievements||[]).includes(a.id) || (a.id==="first_lesson"&&done>0) || (a.id==="quiz_pass"&&Object.keys(ds.completedLessons).length>0) || (a.id==="all_stages"&&done===dlessons.length&&dlessons.length>0);
            return (
              <Card key={a.id} style={{ opacity:earned?1:0.35, filter:earned?"none":"grayscale(0.9)", padding:"16px 16px", border:earned?`2px solid ${a.color}35`:undefined, position:"relative", overflow:"hidden" }}>
                {earned && <div style={{ position:"absolute", top:0, right:0, background:`${a.color}22`, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"0 12px 0 14px", fontSize:13 }}>✓</div>}
                <div style={{ fontSize:30, marginBottom:8 }}>{a.icon}</div>
                <p style={{ margin:"0 0 4px", fontWeight:900, fontSize:13, color:B.ink }}>{a.title}</p>
                <p style={{ margin:0, fontSize:11.5, color:B.inkFaint, lineHeight:1.45, fontWeight:600 }}>{a.desc}</p>
                {earned && <p style={{ margin:"9px 0 0", fontSize:9.5, color:a.color, fontWeight:900, letterSpacing:1 }}>EARNED 🌟</p>}
              </Card>
            );
          })}
        </div>
        <button onClick={onLogout} style={{ width:"100%", padding:14, borderRadius:16, border:`2px solid ${B.coralLight}`, background:"transparent", color:B.coral, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
          <Icon.Logout size={17} stroke={B.coral}/>Sign Out
        </button>
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────── */
export default function App() {
  const [authUser,       setAuthUser      ] = useState(() => { const uid = safeGet("nume_session"); if (!uid) return null; return getUsersDB()[uid]||null; });
  const [hasChosen,      setHasChosen     ] = useState(false);
  const [dialect,        setDialect       ] = useState("Tobu");
  const [screen,         setScreen        ] = useState("home");
  const [showModal,      setShowModal     ] = useState(false);
  const [showSpeech,     setShowSpeech    ] = useState(false);
  const [showStreakPop,  setShowStreakPop  ] = useState(false);
  const [isMobile,       setIsMobile      ] = useState(typeof window!=="undefined"?window.innerWidth<768:false);
  const [playerCtx,      setPlayerCtx     ] = useState(null);
  const [lessonCtx,      setLessonCtx     ] = useState(null);
  const [xpToast,        setXpToast       ] = useState(null);
  const [apiKey,         setApiKey        ] = useState(() => safeGet("nume_elevenlabs_key")||"");
  const [newAchievement, setNewAchievement] = useState(null);
  const [allStats,       setAllStats      ] = useState(() => { const uid = safeGet("nume_session"); return uid?loadUserStats(uid):freshAllStats(); });

  useEffect(() => { const h = () => setIsMobile(window.innerWidth<768); window.addEventListener("resize",h); return () => window.removeEventListener("resize",h); }, []);
  useEffect(() => { if (authUser) saveUserStats(authUser.id,allStats); }, [allStats,authUser]);
  function saveApiKey(k) { setApiKey(k); safeSet("nume_elevenlabs_key",k); }

  const grantAchievement = useCallback((id) => {
    setAllStats(all => {
      const ds = all[dialect]||freshStats();
      if ((ds.achievements||[]).includes(id)) return all;
      const achDef = ALL_ACHIEVEMENTS.find(a => a.id===id);
      if (achDef) setNewAchievement(achDef);
      return { ...all, [dialect]:{ ...ds, achievements:[...(ds.achievements||[]),id] } };
    });
  }, [dialect]);

  const doStreak = useCallback(() => {
    if (!authUser) return;
    markActiveDate(authUser.id,dialect);
    const newCount = tickStreak(authUser.id,dialect);
    setAllStats(all => ({...all,[dialect]:{ ...(all[dialect]||freshStats()), streak:newCount }}));
    if (newCount>=3) setTimeout(() => grantAchievement("streak_3"),800);
    if (newCount>=7) setTimeout(() => grantAchievement("streak_7"),800);
  }, [authUser,dialect,grantAchievement]);

  const dialectStats = allStats[dialect]||freshStats();
  const updateDialectStats = useCallback((updater) => { setAllStats(all => ({...all,[dialect]:updater(all[dialect]||freshStats())})); }, [dialect]);
  const addXP = useCallback((amt) => { updateDialectStats(d => ({...d,xp:d.xp+amt})); setXpToast(amt); setTimeout(() => setXpToast(null),2200); doStreak(); }, [updateDialectStats,doStreak]);

  function handleLogin(user) { setAuthUser(user); safeSet("nume_session",user.id); setAllStats(loadUserStats(user.id)); setHasChosen(false); }
  function handleLogout() { if (authUser) saveUserStats(authUser.id,allStats); safeSet("nume_session",null); setAuthUser(null); setHasChosen(false); setScreen("home"); setAllStats(freshAllStats()); }
  function handleDialectPick(d) { setDialect(d); setHasChosen(true); }
  function handleDialectSwitch(d) { setDialect(d); setShowModal(false); setScreen("home"); setPlayerCtx(null); setLessonCtx(null); }

  if (!authUser) return <><style>{GLOBAL_CSS}</style><AuthScreen onLogin={handleLogin}/></>;
  if (!hasChosen) return <><style>{GLOBAL_CSS}</style><DialectPicker onSelect={handleDialectPick}/></>;
  if (screen==="player"&&playerCtx) return (
    <><style>{GLOBAL_CSS}</style>
    <LessonPlayer context={playerCtx} apiKey={apiKey} grantAchievement={grantAchievement}
      setScreen={s => { if (s==="quizFromLesson") { setLessonCtx(playerCtx.lesson); setScreen("quiz"); } else setScreen(s); }}
      addXP={addXP}/>
    </>
  );

  const shared = { dialect, setScreen, isMobile, dialectStats, updateDialectStats, allStats, addXP, apiKey, grantAchievement, onSwitch:() => setShowModal(true), user:authUser };
  function renderScreen() {
    switch(screen) {
      case "home":       return <Home       {...shared}/>;
      case "learn":      return <Learn      {...shared} setPlayerContext={setPlayerCtx}/>;
      case "quiz":       return <Quiz       {...shared} lessonContext={lessonCtx}/>;
      case "dictionary": return <Dictionary {...shared}/>;
      case "voice":      return <Voice      {...shared}/>;
      case "progress":   return <Progress   dialect={dialect} allStats={allStats} isMobile={isMobile} onSwitch={() => setShowModal(true)} user={authUser} onLogout={handleLogout}/>;
      default:           return <Home       {...shared}/>;
    }
  }

  return (
    <div style={{ display:"flex", fontFamily:"'Nunito','Nunito Sans',system-ui,sans-serif", background:B.offWhite, minHeight:"100vh" }}>
      <style>{GLOBAL_CSS}</style>
      {!isMobile && <Sidebar screen={screen} setScreen={setScreen} dialect={dialect} onSwitch={() => setShowModal(true)} stats={dialectStats} user={authUser} onLogout={handleLogout}/>}
      <div style={{ flex:1, minWidth:0, overflowY:"auto", paddingBottom:isMobile?72:0 }}>
        {!isMobile && (
          <div style={{ padding:"15px 28px 13px", borderBottom:`2px solid ${B.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:B.white, position:"sticky", top:0, zIndex:100 }}>
            <div>
              <h1 style={{ margin:0, fontSize:20, fontWeight:900, color:B.ink }}>
                {(NAV.find(n => n.id===screen)||{label:"Nume"}).label}
              </h1>
              <p style={{ margin:"2px 0 0", fontSize:11.5, color:B.inkFaint, fontWeight:700 }}>{DIALECT_INFO[dialect].flag} {dialect} · Level {calcLevel(dialectStats.xp)} · {dialectStats.xp} XP</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {/* Streak popover */}
              <div style={{ position:"relative" }}>
                <button onClick={() => setShowStreakPop(p => !p)} style={{ background:"none", border:`2px solid ${B.border}`, borderRadius:12, cursor:"pointer", padding:"6px 12px", display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
                  <FlameCount count={dialectStats.streak}/>
                </button>
                {showStreakPop && (
                  <><div style={{ position:"fixed", inset:0, zIndex:499 }} onClick={() => setShowStreakPop(false)}/><StreakPopover count={dialectStats.streak} userId={authUser.id} dialect={dialect} onClose={() => setShowStreakPop(false)}/></>
                )}
              </div>
              <HeartsRow count={dialectStats.hearts}/>
              <button onClick={() => setShowSpeech(true)} style={{ background:apiKey?`${B.mint}15`:B.surface, border:`2px solid ${apiKey?B.mint+"50":B.border}`, borderRadius:20, padding:"7px 14px", cursor:"pointer", fontWeight:800, fontSize:12, color:apiKey?B.mint:B.inkFaint, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
                <span style={{ fontSize:14 }}>🎙️</span>{apiKey?"Voice On":"Set Voice"}
              </button>
              <div onClick={() => setScreen("progress")} style={{ width:38, height:38, borderRadius:14, background:B.purplePale, border:`2px solid ${B.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, cursor:"pointer" }}>{authUser.avatar}</div>
              <button onClick={() => setShowModal(true)} style={{ background:B.purplePale, border:`2px solid ${B.purpleLight}60`, borderRadius:20, padding:"8px 15px", cursor:"pointer", fontWeight:800, fontSize:13, color:B.purple, display:"flex", alignItems:"center", gap:8, fontFamily:"inherit" }}>
                <span style={{ fontSize:16 }}>{DIALECT_INFO[dialect].flag}</span>{dialect}<Icon.ChevronDown size={13} stroke={B.purple}/>
              </button>
            </div>
          </div>
        )}
        <div style={{ padding:!isMobile?"8px 0":0 }}>{renderScreen()}</div>
      </div>
      {isMobile && <BotNav screen={screen} setScreen={setScreen}/>}
      {showModal     && <DialectModal     dialect={dialect} allStats={allStats} onSelect={handleDialectSwitch} onClose={() => setShowModal(false)}/>}
      {showSpeech    && <SpeechSettingsModal apiKey={apiKey} onSave={saveApiKey} onClose={() => setShowSpeech(false)}/>}
      {xpToast       && <XPToast xp={xpToast} onDone={() => setXpToast(null)}/>}
      {newAchievement && <AchievementModal achievement={newAchievement} onClose={() => setNewAchievement(null)}/>}
    </div>
  );
}