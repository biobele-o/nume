import { useState, useRef, useEffect, useCallback } from "react";

/* ─── BRAND ─────────────────────────────────────────────── */
const B = {
  purple:"#6B21E8", purpleDark:"#1E0A3C", purpleMid:"#8B44F0",
  purpleLight:"#C4A8F8", purplePale:"#F0EAFF",
  gold:"#F0B429", goldLight:"#FEF3C7",
  white:"#FFFFFF", off:"#FAF8FF",
  ink:"#1A0A2E", inkMid:"#3D2A6B", inkLight:"#7B6899",
  green:"#16A34A", greenLight:"#DCFCE7",
  red:"#DC2626", redLight:"#FEE2E2",
  orange:"#EA580C", border:"#E8E0F8",
};

/* ─── CONSTANTS ─────────────────────────────────────────── */
const DIALECTS = ["Tobu", "Kalabari", "Nembe"];
const DIALECT_INFO = {
  Tobu:     { region:"Delta State",  speakers:"~500,000",  color:"#EA580C", flag:"🔥" },
  Kalabari: { region:"Rivers State", speakers:"~300,000",  color:"#6B21E8", flag:"🌊" },
  Nembe:    { region:"Bayelsa State",speakers:"~100,000",  color:"#16A34A", flag:"🌿" },
};
const NAV = [
  { id:"home",       icon:"🏠", label:"Home"  },
  { id:"learn",      icon:"📚", label:"Learn" },
  { id:"quiz",       icon:"🧠", label:"Quiz"  },
  { id:"dictionary", icon:"📖", label:"Dictionary"  },
  { id:"voice",      icon:"🎙️", label:"Speak" },
  { id:"progress",   icon:"📊", label:"Me"    },
];

/* ─── MOCK USERS ────────────────────────────────────────── */
const MOCK_USERS = [
  { id:"u1", name:"Amina Dokubo",  email:"amina@example.com",  password:"password123", avatar:"👩🏾", joinedDate:"Jan 2025" },
  { id:"u2", name:"Tonye Briggs",  email:"tonye@example.com",  password:"password123", avatar:"👨🏿", joinedDate:"Mar 2025" },
  { id:"u3", name:"Ebiside Okolo", email:"ebi@example.com",    password:"password123", avatar:"👩🏿", joinedDate:"Feb 2025" },
];

/* ─── PERSISTENCE ───────────────────────────────────────── */
function safeGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function safeSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function getUsersDB() {
  const stored = safeGet("nume_users_db") || {};
  const db = {};
  MOCK_USERS.forEach(u => { db[u.id] = u; });
  Object.values(stored).forEach(u => { db[u.id] = u; });
  return db;
}
function saveUserToDB(user) {
  const stored = safeGet("nume_users_db") || {};
  stored[user.id] = user;
  safeSet("nume_users_db", stored);
}
function freshStats() {
  return { xp:0, streak:1, hearts:3, completedLessons:{}, achievements:[] };
}
function freshAllStats() {
  return { Tobu:freshStats(), Kalabari:freshStats(), Nembe:freshStats() };
}
function loadUserStats(uid) {
  const db = safeGet("nume_stats_db") || {};
  return db[uid] || freshAllStats();
}
function saveUserStats(uid, stats) {
  const db = safeGet("nume_stats_db") || {};
  db[uid] = stats;
  safeSet("nume_stats_db", db);
}

/* ─── STREAK HELPERS ────────────────────────────────────── */
function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
function getStreakData(userId, dialect) {
  const db = safeGet("nume_streak_db") || {};
  return db[userId + "_" + dialect] || { lastDate:null, count:1 };
}
function saveStreakData(userId, dialect, data) {
  const db = safeGet("nume_streak_db") || {};
  db[userId + "_" + dialect] = data;
  safeSet("nume_streak_db", db);
}
function getActiveDates(userId, dialect) {
  const db = safeGet("nume_activity_db") || {};
  return new Set(db[userId + "_" + dialect] || []);
}
function markActiveDate(userId, dialect) {
  const db  = safeGet("nume_activity_db") || {};
  const key = userId + "_" + dialect;
  const arr = Array.from(new Set([...(db[key] || []), todayStr()])).slice(-90);
  db[key]   = arr;
  safeSet("nume_activity_db", db);
}
function tickStreak(userId, dialect) {
  const data = getStreakData(userId, dialect);
  const today = todayStr(), yest = yesterdayStr();
  let count = data.count;
  if (data.lastDate === today)      return count;
  else if (data.lastDate === yest)  count = data.count + 1;
  else                              count = 1;
  saveStreakData(userId, dialect, { lastDate:today, count });
  return count;
}

/* ─── ACHIEVEMENT DEFINITIONS ───────────────────────────── */
const ALL_ACHIEVEMENTS = [
  { id:"first_lesson", icon:"🌱", title:"First Steps",   desc:"Completed your first lesson",  color:"#16A34A" },
  { id:"quiz_pass",    icon:"🧠", title:"Quiz Master",    desc:"Passed your first quiz",        color:"#6B21E8" },
  { id:"voice_rec",    icon:"🎙️", title:"Speaker",        desc:"Recorded your first word",      color:"#EA580C" },
  { id:"streak_3",     icon:"🔥", title:"On Fire",        desc:"3-day learning streak",         color:"#F0B429" },
  { id:"streak_7",     icon:"⚡", title:"Unstoppable",    desc:"7-day learning streak",         color:"#8B44F0" },
  { id:"all_stages",   icon:"🏆", title:"Scholar",        desc:"Completed all stages",          color:"#F0B429" },
  { id:"dict_10",      icon:"📖", title:"Word Seeker",    desc:"Looked up 10 words",            color:"#1A6B9A" },
  { id:"perfect_quiz", icon:"💯", title:"Perfect Score",  desc:"100% on a quiz",                color:"#DC2626" },
];

/* ─── LESSON DATA ───────────────────────────────────────── */
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
        { id:1,  ijaw:"Fiafia sime", english:"Good morning",      roman:"fee-AH-fee-ah SEE-meh" },
        { id:2,  ijaw:"Beke bo",     english:"Welcome",           roman:"BEH-keh boh"            },
        { id:3,  ijaw:"Singbi",      english:"Thank you",         roman:"SING-bee"                },
        { id:4,  ijaw:"Aluwa",       english:"Hello",             roman:"ah-LOO-wah"              },
        { id:5,  ijaw:"Bara bo",     english:"Come as you like",  roman:"BAH-rah boh"             },
        { id:6,  ijaw:"Tamuno",      english:"God / Providence",  roman:"tah-MOO-noh"             },
      ],
      Nembe:[
        { id:101, ijaw:"Dawei",     english:"Welcome",        roman:"dah-WAY"       },
        { id:102, ijaw:"Owei seni", english:"Good morning",   roman:"OH-way SEH-nee"},
        { id:103, ijaw:"Singi",     english:"Thank you",      roman:"SING-ee"        },
        { id:104, ijaw:"Toru",      english:"Hello",          roman:"TOH-roo"        },
        { id:105, ijaw:"Adei",      english:"Goodbye",        roman:"ah-DAY"         },
        { id:106, ijaw:"Pele",      english:"Sorry / Please", roman:"PEH-leh"        },
      ],
    },
  },
  { stage:2, title:"Numbers", icon:"🔢", xp:20, desc:"Count from one to six",
    words:{
      Tobu:[
        { id:207, ijaw:"Emi",      english:"One",   roman:"EH-mee"         },
        { id:208, ijaw:"Aruo",     english:"Two",   roman:"ah-ROO-oh"       },
        { id:209, ijaw:"Esuo",     english:"Three", roman:"eh-SOO-oh"       },
        { id:210, ijaw:"Enimo",    english:"Four",  roman:"eh-NEE-moh"      },
        { id:211, ijaw:"Enimumo",  english:"Five",  roman:"eh-NEE-moo-moh"  },
        { id:212, ijaw:"Tein",     english:"Ten",   roman:"TAY-n"           },
      ],
      Kalabari:[
        { id:7,  ijaw:"Emi",       english:"One",   roman:"EH-mee"          },
        { id:8,  ijaw:"Aruo",      english:"Two",   roman:"ah-ROO-oh"       },
        { id:9,  ijaw:"Esuo",      english:"Three", roman:"eh-SOO-oh"       },
        { id:10, ijaw:"Enimo",     english:"Four",  roman:"eh-NEE-moh"      },
        { id:11, ijaw:"Enimumo",   english:"Five",  roman:"eh-NEE-moo-moh"  },
        { id:12, ijaw:"Eninitein", english:"Six",   roman:"eh-NEE-nee-tain" },
      ],
      Nembe:[
        { id:107, ijaw:"Emu",      english:"One",   roman:"EH-moo"          },
        { id:108, ijaw:"Aruo",     english:"Two",   roman:"ah-ROO-oh"       },
        { id:109, ijaw:"Esuo",     english:"Three", roman:"EH-soo-oh"       },
        { id:110, ijaw:"Enimo",    english:"Four",  roman:"EH-nee-moh"      },
        { id:111, ijaw:"Enimumo",  english:"Five",  roman:"EH-nee-moo-moh"  },
        { id:112, ijaw:"Initei",   english:"Six",   roman:"EE-nee-tay"      },
      ],
    },
  },
  { stage:3, title:"Family", icon:"👨‍👩‍👧", xp:25, desc:"Family members and relationships",
    words:{
      Tobu:[
        { id:213, ijaw:"Ye",      english:"Mother",          roman:"yeh"           },
        { id:214, ijaw:"Dau",     english:"Father",          roman:"dah-oo"        },
        { id:215, ijaw:"Owei",    english:"Man / Husband",   roman:"oh-WAY"        },
        { id:216, ijaw:"Ere",     english:"Woman / Wife",    roman:"EH-reh"        },
        { id:217, ijaw:"Bibi",    english:"Child",           roman:"BEE-bee"       },
        { id:218, ijaw:"Ibe",     english:"Community / Clan",roman:"EE-beh"        },
      ],
      Kalabari:[
        { id:13, ijaw:"Yee",      english:"Mother",          roman:"yeh"           },
        { id:14, ijaw:"Ba",       english:"Father",          roman:"bah"           },
        { id:15, ijaw:"Owiapu",   english:"Men / Husbands",  roman:"oh-WEE-ah-poo" },
        { id:16, ijaw:"Iyo",      english:"Woman",           roman:"EE-yoh"        },
        { id:17, ijaw:"Bie",      english:"Child",           roman:"BEE-eh"        },
        { id:18, ijaw:"Opu",      english:"Elder / Chief",   roman:"OH-poo"        },
      ],
      Nembe:[
        { id:113, ijaw:"Yei",     english:"Mother",          roman:"YAY"           },
        { id:114, ijaw:"Bai",     english:"Father",          roman:"BAY"           },
        { id:115, ijaw:"Oweibi",  english:"Man",             roman:"oh-WAY-bee"    },
        { id:116, ijaw:"Eremi",   english:"Woman",           roman:"EH-reh-mee"    },
        { id:117, ijaw:"Biebi",   english:"Child",           roman:"BEE-eh-bee"    },
        { id:118, ijaw:"Opuei",   english:"Elder",           roman:"oh-POO-ay"     },
      ],
    },
  },
  { stage:4, title:"Food & Drink", icon:"🍲", xp:25, desc:"Traditional food and drinks",
    words:{
      Tobu:[
        { id:219, ijaw:"Indi",    english:"Fish",            roman:"IN-dee"        },
        { id:220, ijaw:"Beni",    english:"Water",           roman:"BEH-nee"       },
        { id:221, ijaw:"Fiyai",   english:"Food",            roman:"FEE-yai"       },
        { id:222, ijaw:"Folou",   english:"Soup",            roman:"FOH-loo"       },
        { id:223, ijaw:"Namaa",   english:"Meat",            roman:"nah-MAH"       },
        { id:224, ijaw:"Agua",    english:"Beans / Cowpeas", roman:"ah-GOO-ah"     },
      ],
      Kalabari:[
        { id:19, ijaw:"Fiyai",    english:"Food",            roman:"FEE-yai"       },
        { id:20, ijaw:"Indi",     english:"Fish",            roman:"IN-dee"        },
        { id:21, ijaw:"Tubo",     english:"Palm wine",       roman:"TOO-boh"       },
        { id:22, ijaw:"Beni",     english:"Water",           roman:"BEH-nee"       },
        { id:23, ijaw:"Tombo",    english:"Drink / Alcohol", roman:"TOM-boh"       },
        { id:24, ijaw:"Namaa",    english:"Meat",            roman:"nah-MAH"       },
      ],
      Nembe:[
        { id:119, ijaw:"Fiya",    english:"Fish",            roman:"FEE-yah"       },
        { id:120, ijaw:"Beni",    english:"Water",           roman:"BEH-nee"       },
        { id:121, ijaw:"Fiyai",   english:"Food",            roman:"FEE-yai"       },
        { id:122, ijaw:"Tubu",    english:"Palm wine",       roman:"TOO-boo"       },
        { id:123, ijaw:"Ogi",     english:"Pap / Porridge",  roman:"OH-gee"        },
        { id:124, ijaw:"Nama",    english:"Meat",            roman:"NAH-mah"       },
      ],
    },
  },
  { stage:5, title:"Home & Place", icon:"🏠", xp:30, desc:"House, village and surroundings",
    words:{
      Tobu:[
        { id:225, ijaw:"Wari",    english:"House / Home",    roman:"WAH-ree"       },
        { id:226, ijaw:"Ama",     english:"Town / Village",  roman:"AH-mah"        },
        { id:227, ijaw:"Okolo",   english:"River / Creek",   roman:"oh-KOH-loh"    },
        { id:228, ijaw:"Bou",     english:"Forest / Bush",   roman:"BOH-oo"        },
        { id:229, ijaw:"Oru",     english:"Deity / Spirit",  roman:"OH-roo"        },
        { id:230, ijaw:"Ibe",     english:"Community / Clan",roman:"EE-beh"        },
      ],
      Kalabari:[
        { id:25, ijaw:"Warii",    english:"House / Home",    roman:"WAH-ree"       },
        { id:26, ijaw:"Ama",      english:"Town / Village",  roman:"AH-mah"        },
        { id:27, ijaw:"Okolo",    english:"River / Creek",   roman:"oh-KOH-loh"    },
        { id:28, ijaw:"Ifie",     english:"Farm / Land",     roman:"EE-fee-eh"     },
        { id:29, ijaw:"Sime",     english:"Place / There",   roman:"SEE-meh"       },
        { id:30, ijaw:"Anga",     english:"Here",            roman:"ANG-ah"        },
      ],
      Nembe:[
        { id:125, ijaw:"Wari",    english:"House",           roman:"WAH-ree"       },
        { id:126, ijaw:"Ama",     english:"Village",         roman:"AH-mah"        },
        { id:127, ijaw:"Okolu",   english:"River",           roman:"oh-KOH-loo"    },
        { id:128, ijaw:"Ibu",     english:"Compound / Yard", roman:"EE-boo"        },
        { id:129, ijaw:"Agiri",   english:"Tree",            roman:"ah-GEE-ree"    },
        { id:130, ijaw:"Iriama",  english:"Rainfall",        roman:"EE-ree-AH-mah" },
      ],
    },
  },
  { stage:6, title:"Time & Days", icon:"⏰", xp:30, desc:"Telling time and daily expressions",
    words:{
      Tobu:[
        { id:231, ijaw:"Seridei", english:"Morning",         roman:"seh-REE-day"   },
        { id:232, ijaw:"Keme",    english:"Today",           roman:"KEH-meh"       },
        { id:233, ijaw:"Bou",     english:"Tomorrow",        roman:"BOH-oo"        },
        { id:234, ijaw:"Abobi",   english:"Yesterday",       roman:"ah-BOH-bee"    },
        { id:235, ijaw:"Bolou",   english:"Night",           roman:"BOH-loo"       },
        { id:236, ijaw:"Diye",    english:"Month / Moon",    roman:"DEE-yeh"       },
      ],
      Kalabari:[
        { id:31, ijaw:"Esieri",   english:"Morning",         roman:"eh-SEE-eh-ree" },
        { id:32, ijaw:"Keme",     english:"Today",           roman:"KEH-meh"       },
        { id:33, ijaw:"Bou",      english:"Tomorrow",        roman:"BOH-oo"        },
        { id:34, ijaw:"Abo",      english:"Yesterday",       roman:"AH-boh"        },
        { id:35, ijaw:"Owu",      english:"Week",            roman:"OH-woo"        },
        { id:36, ijaw:"Bolou",    english:"Night",           roman:"BOH-loo"       },
      ],
      Nembe:[
        { id:131, ijaw:"Esiri",   english:"Morning",         roman:"EH-see-ree"    },
        { id:132, ijaw:"Kemi",    english:"Today",           roman:"KEH-mee"       },
        { id:133, ijaw:"Bomi",    english:"Tomorrow",        roman:"BOH-mee"       },
        { id:134, ijaw:"Abomi",   english:"Yesterday",       roman:"ah-BOH-mee"    },
        { id:135, ijaw:"Bolou",   english:"Night",           roman:"BOH-loo"       },
        { id:136, ijaw:"Owumi",   english:"This week",       roman:"oh-WOO-mee"    },
      ],
    },
  },
];

const WORD_OF_DAY = {
  Tobu:     { ijaw:"Seridou", english:"Good morning",     roman:"seh-REE-doh",  example:"Seridou, tubara?" },
  Kalabari: { ijaw:"Tamuno",  english:"God / Providence", roman:"tah-MOO-noh",  example:"Tamuno nengibo ofori." },
  Nembe:    { ijaw:"Dawei",   english:"Welcome",          roman:"dah-WAY",      example:"Dawei, toru!" },
};

/* ─── DATA HELPERS ──────────────────────────────────────── */
function getLessons(dialect) {
  return RAW_LESSONS.map(l => ({ ...l, words:l.words[dialect]||[] })).filter(l => l.words.length > 0);
}
function getAllWords(dialect) { return getLessons(dialect).flatMap(l => l.words); }
function buildQuiz(lesson, dialect) {
  const pool = getAllWords(dialect);
  return lesson.words.map(w => {
    const wrong = pool.filter(x => x.id !== w.id).sort(() => Math.random()-0.5).slice(0,3).map(x => x.english);
    return { word:w.ijaw, roman:w.roman, correct:w.english, opts:[...wrong, w.english].sort(() => Math.random()-0.5) };
  });
}

/* ─── UTILS ─────────────────────────────────────────────── */
function calcLevel(xp) { return Math.floor(xp / 60) + 1; }
function xpToNext(xp)  { return 60 - (xp % 60); }

/* ─── SPEECH ─────────────────────────────────────────────── */
const SPEECH_CACHE = new Map();
const VOICE_ID     = "21m00Tcm4TlvDq8ikWAM";
const EL_MODEL     = "eleven_multilingual_v2";
const CORS_PROXY   = "https://corsproxy.io/?";
let _currentAudio  = null;

function stopAudio() {
  if (_currentAudio) { try { _currentAudio.pause(); } catch {} _currentAudio = null; }
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
}
async function speakElevenLabs(phonetic, apiKey) {
  const cacheKey = "el_" + phonetic;
  let blob = SPEECH_CACHE.get(cacheKey);
  if (!blob) {
    const target = "https://api.elevenlabs.io/v1/text-to-speech/" + VOICE_ID + "/stream";
    const res = await fetch(CORS_PROXY + encodeURIComponent(target), {
      method:"POST",
      headers:{ "Content-Type":"application/json", "xi-api-key":apiKey },
      body: JSON.stringify({
        text: phonetic, model_id: EL_MODEL,
        voice_settings:{ stability:0.35, similarity_boost:0.90, style:0.55, use_speaker_boost:true },
      }),
    });
    if (!res.ok) { const msg = await res.text().catch(()=>res.statusText); throw new Error(res.status+": "+msg.slice(0,120)); }
    blob = await res.blob();
    SPEECH_CACHE.set(cacheKey, blob);
  }
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  _currentAudio = audio;
  audio.playbackRate = 0.92;
  audio.onended = () => URL.revokeObjectURL(url);
  await audio.play();
}
function speakBrowser(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const pick = voices.find(v => /en-NG|Nigeria/i.test(v.lang+v.name))
            || voices.find(v => /en-GH|en-ZA|Africa/i.test(v.lang+v.name))
            || voices.find(v => /en/i.test(v.lang));
  if (pick) u.voice = pick;
  u.lang = pick ? pick.lang : "en-NG";
  u.rate = 0.65; u.pitch = 0.92;
  window.speechSynthesis.speak(u);
}
async function speak(word, apiKey) {
  stopAudio();
  const w = typeof word === "string" ? { ijaw:word, roman:word } : word;
  const phonetic = ((w.roman || w.ijaw)+"").replace(/-/g," ").replace(/\//g,"").trim();
  if (apiKey) { try { await speakElevenLabs(phonetic, apiKey); return; } catch(e) { console.warn("ElevenLabs:",e.message); } }
  speakBrowser(phonetic);
}

/* ─── SHARED UI ─────────────────────────────────────────── */
function Card({ children, style, onClick, hover }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => hover && setH(true)} onMouseLeave={() => setH(false)}
      style={{ background:B.white, borderRadius:20, padding:20,
        boxShadow:h?"0 8px 28px rgba(107,33,232,0.18)":"0 2px 12px rgba(107,33,232,0.07)",
        border:"1.5px solid "+(h?B.purpleLight:B.border), transition:"all 0.2s",
        transform:h?"translateY(-2px)":"none", cursor:onClick?"pointer":"default", ...(style||{}) }}>
      {children}
    </div>
  );
}
function Btn({ children, onClick, color, style, disabled, outline }) {
  const c = color||B.purple; const [h,setH] = useState(false);
  return (
    <button onClick={disabled?undefined:onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:outline?"transparent":disabled?"#D1C9E8":h?B.purpleDark:c,
        color:outline?c:"#fff", border:outline?"2px solid "+c:"none",
        borderRadius:14, padding:"13px 22px", fontSize:15, fontWeight:700,
        cursor:disabled?"not-allowed":"pointer", display:"flex", alignItems:"center",
        justifyContent:"center", gap:8, transition:"all 0.18s",
        boxShadow:(!outline&&!disabled)?"0 3px 10px "+c+"33":"none", ...(style||{}) }}>
      {children}
    </button>
  );
}
function Badge({ children, color }) {
  const c = color||B.purple;
  return <span style={{ background:c+"18", color:c, border:"1px solid "+c+"33", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{children}</span>;
}
function PBar({ value, max, color, h, style }) {
  const c = color||B.purple; const ht = h||8; const pct = max>0?Math.min(100,Math.round((value/max)*100)):0;
  return <div style={{ background:B.border, borderRadius:99, height:ht, overflow:"hidden", ...(style||{}) }}><div style={{ width:pct+"%", height:"100%", background:c, borderRadius:99, transition:"width 0.5s" }}/></div>;
}
function Hearts({ count, max }) {
  const m = max||3;
  return <div style={{ display:"flex", gap:2 }}>{Array.from({length:m}).map((_,i)=><span key={i} style={{ fontSize:16, opacity:i<count?1:0.2 }}>❤️</span>)}</div>;
}
function Flame({ count, style }) {
  return <div style={{ display:"flex", alignItems:"center", gap:4, ...(style||{}) }}><span style={{ fontSize:18 }}>🔥</span><span style={{ fontWeight:900, fontSize:15, color:B.orange }}>{count}</span></div>;
}
function Bird({ size, bob, style }) {
  const sz = size||40;
  return (
    <svg width={sz} height={sz} viewBox="0 0 200 200" style={{ ...(style||{}), ...(bob?{animation:"birdBob 2.2s ease-in-out infinite"}:{}) }}>
      <style>{"@keyframes birdBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}"}</style>
      <ellipse cx="105" cy="108" rx="68" ry="72" fill="#7C3AED" stroke="#1E0A3C" strokeWidth="7"/>
      <path d="M50 140 Q30 160 45 175 Q70 155 80 145" fill="#6B21E8" stroke="#1E0A3C" strokeWidth="5"/>
      <path d="M52 148 L44 158" stroke="#1E0A3C" strokeWidth="4" strokeLinecap="round"/>
      <path d="M58 152 L52 163" stroke="#1E0A3C" strokeWidth="4" strokeLinecap="round"/>
      <path d="M64 155 L60 167" stroke="#1E0A3C" strokeWidth="4" strokeLinecap="round"/>
      <path d="M72 42 Q90 20 115 38" fill="#7C3AED" stroke="#1E0A3C" strokeWidth="6"/>
      <ellipse cx="110" cy="128" rx="42" ry="34" fill="#C4B5FD" opacity="0.5"/>
      <circle cx="95" cy="90" r="32" fill="white" stroke="#1E0A3C" strokeWidth="6"/>
      <circle cx="98" cy="90" r="18" fill="#1E0A3C"/>
      <circle cx="104" cy="84" r="6" fill="white"/>
      <circle cx="148" cy="100" r="12" fill="#7C3AED" stroke="#1E0A3C" strokeWidth="5"/>
      <polygon points="140,96 162,90 155,103" fill="#F0B429" stroke="#1E0A3C" strokeWidth="3"/>
      <polygon points="140,104 162,112 155,103" fill="#D97706" stroke="#1E0A3C" strokeWidth="3"/>
    </svg>
  );
}
function XPToast({ xp, onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,2000); return()=>clearTimeout(t); },[onDone]);
  return (
    <div style={{ position:"fixed", top:72, left:"50%", transform:"translateX(-50%)", background:B.gold, color:B.ink, borderRadius:50, padding:"10px 24px", fontWeight:900, fontSize:16, zIndex:9999, boxShadow:"0 4px 24px rgba(240,180,41,0.45)", animation:"xpin 0.35s ease", whiteSpace:"nowrap" }}>
      <style>{"@keyframes xpin{from{opacity:0;transform:translateX(-50%) translateY(-16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}"}</style>
      {"⚡ +"+xp+" XP"}
    </div>
  );
}
function Confetti() {
  const cols = [B.purple,B.gold,B.green,B.orange,"#EC4899"];
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:8888, overflow:"hidden" }}>
      <style>{"@keyframes cfal{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}"}</style>
      {Array.from({length:50}).map((_,i)=>(
        <div key={i} style={{ position:"absolute", left:(Math.random()*100)+"%", width:Math.random()*10+5, height:Math.random()*10+5, background:cols[i%5], borderRadius:Math.random()>0.5?"50%":"3px", animation:"cfal "+(1.5+Math.random()*2)+"s "+(Math.random()*0.8)+"s forwards" }}/>
      ))}
    </div>
  );
}

/* ─── ACHIEVEMENT MODAL ─────────────────────────────────── */
function AchievementModal({ achievement, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setVisible(true),50); return()=>clearTimeout(t); },[]);
  function handleShare() {
    const text = "I just earned the \""+achievement.title+"\" achievement on Nume - Ijaw Voice! "+achievement.icon+" "+achievement.desc+". Learn Ijaw languages at your own pace!";
    if (navigator.share) { navigator.share({ title:"Nume Achievement", text }).catch(()=>{}); }
    else { navigator.clipboard.writeText(text).then(()=>alert("Copied to clipboard!")).catch(()=>{}); }
  }
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(30,10,60,0.75)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <style>{`
        @keyframes achievePop{0%{transform:scale(0.4) rotate(-8deg);opacity:0}60%{transform:scale(1.12) rotate(2deg);opacity:1}80%{transform:scale(0.96) rotate(-1deg)}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes starSpin{0%{transform:rotate(0deg) scale(0);opacity:0}50%{opacity:1}100%{transform:rotate(360deg) scale(1);opacity:0}}
        @keyframes shimmer{0%,100%{opacity:0.6}50%{opacity:1}}
      `}</style>
      <div onClick={e=>e.stopPropagation()} style={{ background:B.white, borderRadius:28, padding:"36px 28px", maxWidth:360, width:"100%", textAlign:"center", position:"relative", overflow:"hidden", animation:visible?"achievePop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards":"none", opacity:visible?1:0, boxShadow:"0 24px 80px rgba(107,33,232,0.4)" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:28, background:"radial-gradient(ellipse at 50% 0%, "+achievement.color+"22 0%, transparent 70%)", pointerEvents:"none" }}/>
        {[0,1,2,3,4,5].map(i=>(
          <div key={i} style={{ position:"absolute", top:(20+Math.sin(i*60*(Math.PI/180))*120)+"px", left:"calc(50% + "+(Math.cos(i*60*(Math.PI/180))*120)+"px)", fontSize:14, animation:"starSpin 1.2s "+(i*0.15)+"s ease-out forwards", opacity:0 }}>⭐</div>
        ))}
        <div style={{ width:100, height:100, borderRadius:50, margin:"0 auto 20px", background:"linear-gradient(135deg,"+achievement.color+","+achievement.color+"99)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, boxShadow:"0 8px 32px "+achievement.color+"55", animation:"shimmer 2s 0.6s ease-in-out infinite", position:"relative", zIndex:1 }}>{achievement.icon}</div>
        <div style={{ display:"inline-block", background:achievement.color+"18", border:"1px solid "+achievement.color+"44", borderRadius:20, padding:"4px 14px", fontSize:11, fontWeight:700, color:achievement.color, letterSpacing:1, marginBottom:12 }}>ACHIEVEMENT UNLOCKED</div>
        <h2 style={{ color:B.ink, fontSize:26, fontWeight:900, margin:"0 0 8px" }}>{achievement.title}</h2>
        <p style={{ color:B.inkLight, fontSize:15, margin:"0 0 28px", lineHeight:1.5 }}>{achievement.desc}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button onClick={handleShare} style={{ background:B.purple, border:"none", borderRadius:12, padding:13, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>🔗 Share</button>
          <button onClick={onClose} style={{ background:B.purplePale, border:"none", borderRadius:12, padding:13, color:B.purple, fontWeight:700, fontSize:14, cursor:"pointer" }}>Continue</button>
        </div>
      </div>
    </div>
  );
}

/* ─── STREAK POPOVER ────────────────────────────────────── */
function StreakPopover({ count, userId, dialect, onClose }) {
  const activeDates = getActiveDates(userId, dialect);
  const today = new Date();
  const days  = [];
  for (let i = 48; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate()-i);
    days.push({ dateStr:d.toISOString().slice(0,10), dayNum:d.getDate(), isToday:i===0 });
  }
  const weeks = [];
  for (let i = 0; i < days.length; i+=7) weeks.push(days.slice(i,i+7));
  const DAY_LABELS = ["M","T","W","T","F","S","S"];
  return (
    <div style={{ position:"absolute", top:"calc(100% + 10px)", right:0, zIndex:500, background:B.white, borderRadius:20, padding:20, width:300, boxShadow:"0 12px 40px rgba(107,33,232,0.22)", border:"1.5px solid "+B.border, animation:"fadeDown 0.18s ease" }}>
      <style>{"@keyframes fadeDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}"}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div>
          <p style={{ margin:0, fontWeight:900, fontSize:15, color:B.ink }}>{"🔥 "+count+"-day streak"}</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:B.inkLight }}>{dialect+" · last 7 weeks"}</p>
        </div>
        <button onClick={onClose} style={{ background:B.purplePale, border:"none", borderRadius:50, width:28, height:28, cursor:"pointer", color:B.inkLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>×</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4 }}>
        {DAY_LABELS.map((d,i)=><div key={i} style={{ textAlign:"center", fontSize:9, fontWeight:700, color:B.inkLight }}>{d}</div>)}
      </div>
      {weeks.map((week,wi)=>(
        <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:3 }}>
          {week.map(day=>{
            const active=activeDates.has(day.dateStr), isToday=day.isToday;
            return (
              <div key={day.dateStr} title={day.dateStr} style={{ width:"100%", aspectRatio:"1", borderRadius:6, background:active?(isToday?B.orange:B.orange+"cc"):isToday?B.purplePale:B.off, border:isToday?"2px solid "+(active?B.orange:B.purple):"2px solid transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:active?"#fff":isToday?B.purple:B.inkLight }}>
                {day.dayNum}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:12, paddingTop:10, borderTop:"1px solid "+B.border }}>
        {[{bg:B.orange+"cc",label:"Active"},{bg:B.purplePale,border:"2px solid "+B.purple,label:"Today"},{bg:B.off,label:"Inactive"}].map((item,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:B.inkLight }}>
            <div style={{ width:11, height:11, borderRadius:3, background:item.bg, border:item.border||"none" }}/>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SPEECH SETTINGS MODAL ─────────────────────────────── */
function SpeechSettingsModal({ apiKey, onSave, onClose }) {
  const [val,setVal]=useState(apiKey||""); const [testing,setTesting]=useState(false); const [result,setResult]=useState(null);
  async function testKey() {
    setTesting(true); setResult(null);
    try { await speakElevenLabs("Seridou", val); setResult("success"); }
    catch(e) { setResult("fail:"+e.message); }
    setTesting(false);
  }
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(30,10,60,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ background:B.white, borderRadius:24, padding:28, maxWidth:420, width:"100%", boxShadow:"0 24px 80px rgba(107,33,232,0.3)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <span style={{ fontSize:28 }}>🎙️</span>
          <div><h3 style={{ margin:0, fontSize:18, color:B.ink }}>Localized Voice</h3><p style={{ margin:0, fontSize:12, color:B.inkLight }}>Powered by ElevenLabs</p></div>
        </div>
        <div style={{ background:B.purplePale, borderRadius:12, padding:"12px 14px", marginBottom:16, fontSize:13, color:B.inkMid, lineHeight:1.6 }}>
          Browser voices do not support Ijaw accents. ElevenLabs handles West African phonemes. Get a free key at elevenlabs.io.
        </div>
        <label style={{ fontSize:13, fontWeight:700, color:B.inkLight, display:"block", marginBottom:6 }}>ElevenLabs API Key</label>
        <input value={val} onChange={e=>setVal(e.target.value)} placeholder="sk-..." type="password"
          style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"2px solid "+B.border, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", marginBottom:10 }}/>
        {result&&<p style={{ fontSize:13, margin:"0 0 10px", fontWeight:700, color:result==="success"?B.green:B.red }}>{result==="success"?"Voice working!":result.replace("fail:","")}</p>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
          <button onClick={testKey} disabled={!val||testing} style={{ padding:11, borderRadius:12, border:"2px solid "+B.purple, background:"transparent", color:B.purple, cursor:(!val||testing)?"not-allowed":"pointer", fontWeight:700, fontSize:14 }}>{testing?"Testing...":"Test Voice"}</button>
          <button onClick={()=>{onSave(val);onClose();}} style={{ padding:11, borderRadius:12, border:"none", background:B.purple, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:14 }}>Save and Close</button>
        </div>
        {val&&<button onClick={()=>{onSave("");onClose();}} style={{ width:"100%", padding:10, borderRadius:12, border:"1px solid "+B.border, background:"transparent", color:B.inkLight, cursor:"pointer", fontSize:13 }}>Remove key</button>}
        <p style={{ fontSize:11, color:B.inkLight, margin:"12px 0 0", textAlign:"center" }}>Key stored in localStorage only.</p>
      </div>
    </div>
  );
}

/* ─── LAYOUT COMPONENTS ─────────────────────────────────── */
function Sidebar({ screen, setScreen, dialect, onSwitch, stats, user, onLogout }) {
  const [col,setCol]=useState(false); const level=calcLevel(stats.xp);
  return (
    <div style={{ width:col?68:228, minHeight:"100vh", background:"linear-gradient(180deg,"+B.purpleDark+" 0%,#0D0420 100%)", display:"flex", flexDirection:"column", transition:"width 0.25s", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
      <div style={{ padding:"18px 14px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:10 }}>
        <Bird size={32}/>{!col&&<span style={{ color:"#fff", fontSize:22, fontWeight:900, fontFamily:"Georgia,serif", letterSpacing:-1 }}>Nume</span>}
      </div>
      {!col&&user&&(
        <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:36, height:36, borderRadius:50, background:B.purpleMid, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{user.avatar}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:"#fff", fontWeight:700, fontSize:13, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name.split(" ")[0]}</p>
              <p style={{ color:B.purpleLight, fontSize:11, margin:0 }}>{"Level "+level}</p>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700 }}>XP</span>
            <span style={{ color:B.gold, fontSize:11, fontWeight:700 }}>{stats.xp}</span>
          </div>
          <PBar value={60-xpToNext(stats.xp)} max={60} color={B.gold} h={6}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            <Flame count={stats.streak}/><Hearts count={stats.hearts}/>
          </div>
        </div>
      )}
      {!col&&(
        <div style={{ padding:"10px 14px 8px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:10, fontWeight:700, letterSpacing:1, margin:"0 0 6px" }}>DIALECT</p>
          <button onClick={onSwitch} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:10, padding:"7px 12px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:8, width:"100%", fontSize:13, fontWeight:700 }}>
            <span>{DIALECT_INFO[dialect].flag}</span><span style={{ flex:1, textAlign:"left" }}>{dialect}</span><span style={{ opacity:0.5, fontSize:10 }}>✏️</span>
          </button>
        </div>
      )}
      <nav style={{ flex:1, padding:"8px 8px" }}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setScreen(n.id)} title={col?n.label:""}
            style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"11px 12px", borderRadius:12, marginBottom:2, background:screen===n.id?"rgba(255,255,255,0.14)":"transparent", border:screen===n.id?"1px solid rgba(255,255,255,0.2)":"1px solid transparent", color:screen===n.id?"#fff":"rgba(255,255,255,0.55)", cursor:"pointer", fontSize:14, fontWeight:screen===n.id?700:500, transition:"all 0.15s" }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{n.icon}</span>{!col&&<span>{n.label}</span>}
          </button>
        ))}
      </nav>
      {!col&&<button onClick={onLogout} style={{ background:"rgba(220,38,38,0.15)", border:"none", color:"rgba(255,100,100,0.8)", padding:"12px 14px", cursor:"pointer", fontSize:13, fontWeight:700, textAlign:"left", display:"flex", alignItems:"center", gap:8, borderTop:"1px solid rgba(255,255,255,0.07)" }}>🚪 Sign Out</button>}
      <button onClick={()=>setCol(!col)} style={{ background:"rgba(255,255,255,0.05)", border:"none", color:"rgba(255,255,255,0.4)", padding:14, cursor:"pointer", fontSize:13, borderTop:"1px solid rgba(255,255,255,0.07)" }}>{col?"→":"← Collapse"}</button>
    </div>
  );
}
function BotNav({ screen, setScreen }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:B.white, borderTop:"2px solid "+B.border, display:"flex", justifyContent:"space-around", padding:"6px 0 max(8px,env(safe-area-inset-bottom))" }}>
      {NAV.map(n=>(
        <button key={n.id} onClick={()=>setScreen(n.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", flexDirection:"column", alignItems:"center", gap:2, flex:1, color:screen===n.id?B.purple:B.inkLight }}>
          <span style={{ fontSize:18 }}>{n.icon}</span>
          <span style={{ fontSize:8, fontWeight:700 }}>{n.label}</span>
          {screen===n.id&&<div style={{ width:4, height:4, borderRadius:99, background:B.purple }}/>}
        </button>
      ))}
    </div>
  );
}
function TopBar({ title, onBack, dialect, onSwitch, right }) {
  return (
    <div style={{ display:"flex", alignItems:"center", padding:"14px 16px 12px", background:B.white, borderBottom:"1.5px solid "+B.border, position:"sticky", top:0, zIndex:100 }}>
      {onBack&&<button onClick={onBack} style={{ background:B.purplePale, border:"none", borderRadius:10, width:36, height:36, fontSize:16, cursor:"pointer", color:B.purple, marginRight:10, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>}
      <span style={{ fontSize:17, fontWeight:800, color:B.ink, flex:1 }}>{title}</span>
      {dialect&&<button onClick={onSwitch} style={{ background:B.purplePale, border:"none", borderRadius:20, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", color:B.purple, marginRight:8 }}>{DIALECT_INFO[dialect].flag+" "+dialect}</button>}
      {right}
    </div>
  );
}

/* ─── DIALECT MODAL ─────────────────────────────────────── */
function DialectModal({ dialect, allStats, onSelect, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(30,10,60,0.7)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ background:B.white, borderRadius:28, padding:28, maxWidth:420, width:"100%", boxShadow:"0 24px 80px rgba(107,33,232,0.3)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
          <Bird size={44}/>
          <div><h3 style={{ margin:0, fontSize:20, color:B.ink }}>Switch Dialect</h3><p style={{ color:B.inkLight, fontSize:13, margin:0 }}>Progress tracked independently</p></div>
        </div>
        <p style={{ color:B.inkLight, fontSize:13, margin:"0 0 16px", background:B.purplePale, borderRadius:10, padding:"8px 12px" }}>Switching does not reset progress — each dialect saves separately.</p>
        {DIALECTS.map(d=>{
          const ds=allStats[d]||freshStats(); const dl=getLessons(d);
          const done=dl.filter(l=>ds.completedLessons[d+"_"+l.stage]).length;
          return (
            <div key={d} onClick={()=>onSelect(d)} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:16, marginBottom:10, cursor:"pointer", background:d===dialect?B.purplePale:B.off, border:"2px solid "+(d===dialect?B.purple:B.border), transition:"all 0.15s" }}>
              <div style={{ width:44, height:44, borderRadius:12, fontSize:22, background:DIALECT_INFO[d].color+"18", display:"flex", alignItems:"center", justifyContent:"center" }}>{DIALECT_INFO[d].flag}</div>
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontWeight:800, fontSize:16, color:B.ink }}>{d}</p>
                <p style={{ margin:"2px 0 0", fontSize:12, color:B.inkLight }}>{DIALECT_INFO[d].region+" · "+done+"/"+dl.length+" stages · "+ds.xp+" XP"}</p>
              </div>
              {d===dialect&&<Badge color={B.purple}>Active</Badge>}
            </div>
          );
        })}
        <button onClick={onClose} style={{ width:"100%", marginTop:8, padding:12, borderRadius:12, border:"1.5px solid "+B.border, background:"transparent", cursor:"pointer", fontWeight:700, color:B.inkLight, fontSize:14 }}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── AUTH ──────────────────────────────────────────────── */
function AuthScreen({ onLogin }) {
  const [mode,setMode]=useState("landing"); const [form,setForm]=useState({name:"",email:"",password:""}); const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
  function updateForm(f,v){setForm(x=>({...x,[f]:v}));}
  function handleLogin() {
    setErr(""); if(!form.email||!form.password){setErr("Please fill in all fields.");return;}
    setBusy(true);
    setTimeout(()=>{
      const db=getUsersDB(); const found=Object.values(db).find(u=>u.email.toLowerCase()===form.email.toLowerCase()&&u.password===form.password);
      if(found){onLogin(found);}else{setErr("Invalid email or password. Try amina@example.com / password123");setBusy(false);}
    },900);
  }
  function handleSignup() {
    setErr(""); if(!form.name||!form.email||!form.password){setErr("Please fill in all fields.");return;}
    if(form.password.length<6){setErr("Password must be at least 6 characters.");return;}
    const db=getUsersDB(); if(Object.values(db).find(u=>u.email.toLowerCase()===form.email.toLowerCase())){setErr("Account already exists. Sign in instead.");return;}
    setBusy(true);
    setTimeout(()=>{
      const avatars=["👩🏾","👨🏿","👩🏿","👦🏾","👧🏿","🧑🏾"];
      const newUser={id:"u"+Date.now(),name:form.name,email:form.email,password:form.password,joinedDate:new Date().toLocaleDateString("en-GB",{month:"short",year:"numeric"}),avatar:avatars[Math.floor(Math.random()*avatars.length)]};
      saveUserToDB(newUser); onLogin(newUser);
    },900);
  }
  const inputStyle={width:"100%",padding:"13px 16px",borderRadius:12,border:"1.5px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  if(mode==="landing") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(150deg,"+B.purpleDark+" 0%,#3B0E8C 50%,#0D2040 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{"@keyframes birdBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}"}</style>
      <div style={{ maxWidth:440, width:"100%", textAlign:"center" }}>
        <div style={{ display:"inline-block", animation:"birdBob 2.5s ease-in-out infinite", marginBottom:20 }}><Bird size={120}/></div>
        <h1 style={{ color:"#fff", fontSize:62, fontWeight:900, margin:"0 0 6px", fontFamily:"Georgia,serif", letterSpacing:-2 }}>Nume</h1>
        <p style={{ color:B.purpleLight, fontSize:18, marginBottom:10 }}>Ijaw Voice</p>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:15, marginBottom:40, lineHeight:1.6 }}>Reconnect with your heritage.<br/>Learn Ijaw languages through audio, quizzes and voice practice.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
          <Btn onClick={()=>setMode("signup")} color={B.purple} style={{ width:"100%", fontSize:17, padding:16 }}>Create Free Account</Btn>
          <Btn onClick={()=>setMode("login")} color="rgba(255,255,255,0.15)" style={{ width:"100%", fontSize:17, padding:16, border:"1.5px solid rgba(255,255,255,0.3)" }}>Sign In</Btn>
        </div>
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:16, padding:"16px 20px", border:"1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, margin:"0 0 10px", fontWeight:700, letterSpacing:1 }}>DEMO ACCOUNTS</p>
          {MOCK_USERS.map(u=>(
            <button key={u.id} onClick={()=>{setForm({email:u.email,password:u.password,name:u.name});setMode("login");}} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"9px 12px", cursor:"pointer", marginBottom:6, color:"#fff", fontSize:13 }}>
              <span style={{ fontSize:22 }}>{u.avatar}</span>
              <div style={{ flex:1, textAlign:"left" }}><p style={{ margin:0, fontWeight:700 }}>{u.name}</p><p style={{ margin:0, fontSize:11, opacity:0.6 }}>{u.email}</p></div>
              <span style={{ opacity:0.5, fontSize:12 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  const isLogin=mode==="login";
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(150deg,"+B.purpleDark+" 0%,#3B0E8C 60%,#0D2040 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:420, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <Bird size={64} bob/>
          <h2 style={{ color:"#fff", fontSize:28, fontWeight:900, margin:"12px 0 4px" }}>{isLogin?"Welcome back":"Create account"}</h2>
          <p style={{ color:B.purpleLight, fontSize:14, margin:0 }}>{isLogin?"Sign in to continue learning":"Start your Ijaw language journey"}</p>
        </div>
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:24, padding:28, border:"1px solid rgba(255,255,255,0.12)" }}>
          {!isLogin&&<div style={{ marginBottom:16 }}><label style={{ color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:700, display:"block", marginBottom:6 }}>Full Name</label><input value={form.name} onChange={e=>updateForm("name",e.target.value)} placeholder="e.g. Tonye Briggs" style={inputStyle}/></div>}
          <div style={{ marginBottom:16 }}><label style={{ color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:700, display:"block", marginBottom:6 }}>Email</label><input value={form.email} onChange={e=>updateForm("email",e.target.value)} placeholder="you@example.com" type="email" style={inputStyle}/></div>
          <div style={{ marginBottom:20 }}><label style={{ color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:700, display:"block", marginBottom:6 }}>Password</label><input value={form.password} onChange={e=>updateForm("password",e.target.value)} type="password" placeholder={isLogin?"Your password":"At least 6 characters"} onKeyDown={e=>{if(e.key==="Enter")isLogin?handleLogin():handleSignup();}} style={inputStyle}/></div>
          {err&&<div style={{ background:"rgba(220,38,38,0.2)", border:"1px solid rgba(220,38,38,0.4)", borderRadius:10, padding:"10px 14px", marginBottom:16, color:"#FCA5A5", fontSize:13 }}>{err}</div>}
          <Btn onClick={isLogin?handleLogin:handleSignup} color={B.purple} style={{ width:"100%", fontSize:16, padding:15 }} disabled={busy}>{busy?"Please wait...":isLogin?"Sign In":"Create Account"}</Btn>
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.5)", fontSize:13, margin:"16px 0 0" }}>{isLogin?"Don't have an account? ":"Already have an account? "}<button onClick={()=>{setMode(isLogin?"signup":"login");setErr("");}} style={{ background:"none", border:"none", color:B.purpleLight, cursor:"pointer", fontWeight:700, fontSize:13 }}>{isLogin?"Sign up":"Sign in"}</button></p>
        </div>
        <button onClick={()=>setMode("landing")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", marginTop:20, cursor:"pointer", fontSize:14, display:"block", width:"100%", textAlign:"center" }}>Back</button>
      </div>
    </div>
  );
}

/* ─── DIALECT PICKER ────────────────────────────────────── */
function DialectPicker({ onSelect }) {
  const [hov,setHov]=useState(null);
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(150deg,"+B.purpleDark+" 0%,#3B0E8C 50%,#0D2040 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{"@keyframes birdBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}"}</style>
      <div style={{ maxWidth:460, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <Bird size={72} bob/>
          <h2 style={{ color:"#fff", fontSize:26, fontWeight:900, margin:"14px 0 4px" }}>Which dialect first?</h2>
          <p style={{ color:B.purpleLight, fontSize:14, margin:0 }}>You can learn all three — each tracks separately.</p>
        </div>
        {DIALECTS.map(d=>{
          const info=DIALECT_INFO[d];
          return (
            <div key={d} onMouseEnter={()=>setHov(d)} onMouseLeave={()=>setHov(null)} onClick={()=>onSelect(d)}
              style={{ background:hov===d?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.1)", border:"2px solid "+(hov===d?B.purpleLight:"rgba(255,255,255,0.15)"), borderRadius:18, padding:"18px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:16, marginBottom:12, transition:"all 0.2s", transform:hov===d?"scale(1.02)":"scale(1)" }}>
              <div style={{ width:52, height:52, borderRadius:14, fontSize:26, flexShrink:0, background:info.color+"33", border:"2px solid "+info.color+"66", display:"flex", alignItems:"center", justifyContent:"center" }}>{info.flag}</div>
              <div style={{ flex:1 }}><p style={{ color:"#fff", fontWeight:900, fontSize:19, margin:0 }}>{d}</p><p style={{ color:B.purpleLight, fontSize:13, margin:"3px 0 0" }}>{info.region+" · "+info.speakers+" speakers"}</p></div>
              <span style={{ color:"rgba(255,255,255,0.4)", fontSize:22 }}>›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── HOME ──────────────────────────────────────────────── */
function Home({ dialect, setScreen, dialectStats, onSwitch, user, apiKey }) {
  const wod=WORD_OF_DAY[dialect]; const level=calcLevel(dialectStats.xp); const nxt=xpToNext(dialectStats.xp);
  const dlessons=getLessons(dialect);
  const completedCount=dlessons.filter(l=>dialectStats.completedLessons[dialect+"_"+l.stage]).length;
  const nextLesson=dlessons.find(l=>!dialectStats.completedLessons[dialect+"_"+l.stage]);
  return (
    <div style={{ paddingBottom:40 }}>
      <div style={{ background:"linear-gradient(135deg,"+B.purpleDark+" 0%,"+B.purpleMid+" 70%,#4C1D95 100%)", padding:"28px 24px 36px", borderRadius:"0 0 36px 36px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:16, top:8, opacity:0.12 }}><Bird size={130}/></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
          <div>
            <p style={{ color:B.purpleLight, margin:0, fontSize:13, fontWeight:600 }}>{DIALECT_INFO[dialect].flag+" "+dialect+" · "+user.avatar+" "+user.name.split(" ")[0]}</p>
            <h2 style={{ color:"#fff", fontSize:26, fontWeight:900, margin:"4px 0 0" }}>{completedCount===0?"Let's start learning! 🌊":"Keep going! 🔥"}</h2>
          </div>
          <button onClick={onSwitch} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:12, padding:"9px 16px", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, flexShrink:0, zIndex:1 }}>Switch ↕</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
          {[{label:"Level",value:level,color:B.gold},{label:"Streak",value:dialectStats.streak+"d",color:"#FB923C"},{label:"XP",value:dialectStats.xp,color:B.purpleLight}].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.12)", borderRadius:16, padding:"12px 10px", textAlign:"center", border:"1px solid rgba(255,255,255,0.1)" }}>
              <p style={{ color:s.color, fontWeight:900, fontSize:18, margin:0 }}>{s.value}</p>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, margin:"3px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12, margin:"0 0 5px" }}>{"Level "+level+" → "+(level+1)+" · "+nxt+" XP to go"}</p>
        <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:99, height:8, overflow:"hidden" }}>
          <div style={{ width:(((60-nxt)/60)*100)+"%", height:"100%", background:B.gold, borderRadius:99, transition:"width 0.5s" }}/>
        </div>
      </div>
      <div style={{ padding:"0 20px" }}>
        {nextLesson&&(
          <Card style={{ marginBottom:20, background:"linear-gradient(135deg,"+B.purple+","+B.purpleMid+")", border:"none", padding:22, cursor:"pointer" }} onClick={()=>setScreen("learn")}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:54, height:54, borderRadius:18, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{nextLesson.icon}</div>
              <div style={{ flex:1 }}>
                <Badge color={B.gold}>{completedCount===0?"Start Here":"Continue"}</Badge>
                <p style={{ color:"#fff", fontWeight:900, fontSize:17, margin:"6px 0 2px" }}>{"Stage "+nextLesson.stage+": "+nextLesson.title}</p>
                <p style={{ color:B.purpleLight, fontSize:13, margin:0 }}>{nextLesson.words.length+" words · "+nextLesson.xp+" XP"}</p>
              </div>
              <span style={{ color:"rgba(255,255,255,0.6)", fontSize:24 }}>›</span>
            </div>
          </Card>
        )}
        <Card style={{ marginBottom:20, padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <Badge color={B.purple}>✨ Word of the Day</Badge>
            <button onClick={()=>speak(wod,apiKey)} style={{ background:B.purplePale, border:"none", borderRadius:50, width:40, height:40, fontSize:18, cursor:"pointer", color:B.purple, display:"flex", alignItems:"center", justifyContent:"center" }}>🔊</button>
          </div>
          <h2 style={{ color:B.ink, fontSize:38, fontWeight:900, margin:"0 0 4px" }}>{wod.ijaw}</h2>
          <p style={{ color:B.inkLight, fontSize:17, margin:"0 0 4px" }}>{wod.english}</p>
          <p style={{ color:B.purpleLight, fontStyle:"italic", fontSize:13, margin:"0 0 12px" }}>{"/" + wod.roman + "/"}</p>
          <p style={{ color:B.inkLight, fontSize:13, fontStyle:"italic", background:B.purplePale, padding:"8px 12px", borderRadius:10, margin:0 }}>{'"'+wod.example+'"'}</p>
        </Card>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[{label:"📚 Learn",sub:"All lessons",color:B.purple,s:"learn"},{label:"🧠 Quiz",sub:"Test yourself",color:"#7C3AED",s:"quiz"},{label:"📖 Dictionary",sub:getAllWords(dialect).length+" words",color:B.purpleDark,s:"dictionary"},{label:"🎙️ Speak",sub:"Practice aloud",color:"#5B21B6",s:"voice"}].map(item=>(
            <button key={item.s} onClick={()=>setScreen(item.s)} onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}
              style={{ background:"linear-gradient(135deg,"+item.color+","+item.color+"cc)", border:"none", borderRadius:18, padding:"20px 16px", cursor:"pointer", textAlign:"left", boxShadow:"0 4px 20px "+item.color+"33", transition:"transform 0.15s" }}>
              <p style={{ color:"#fff", fontWeight:800, fontSize:17, margin:"0 0 4px" }}>{item.label}</p>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, margin:0 }}>{item.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LEARN ─────────────────────────────────────────────── */
function Learn({ dialect, setScreen, dialectStats, isMobile, onSwitch, setPlayerContext }) {
  const dlessons=getLessons(dialect);
  function getStatus(l) {
    if(dialectStats.completedLessons[dialect+"_"+l.stage]) return "done";
    return (l.stage===1||dialectStats.completedLessons[dialect+"_"+(l.stage-1)])?"available":"locked";
  }
  return (
    <div style={{ paddingBottom:80 }}>
      {isMobile&&<TopBar title="Learn" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ padding:(isMobile?16:0)+"px 20px 60px", maxWidth:680, margin:"0 auto" }}>
        {!isMobile&&<h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 6px", color:B.ink }}>📚 Learning Path</h2>}
        <p style={{ color:B.inkLight, fontSize:14, margin:"0 0 24px" }}>{DIALECT_INFO[dialect].flag+" "+dialect+" · "+dlessons.length+" stages"}</p>
        {dlessons.map((l,li)=>{
          const status=getStatus(l);
          return (
            <div key={l.stage} style={{ display:"flex", gap:0, marginBottom:8, alignItems:"stretch" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:40, flexShrink:0 }}>
                <div style={{ width:36, height:36, borderRadius:50, flexShrink:0, color:"#fff", fontWeight:900, background:status==="done"?B.green:status==="available"?B.purple:"#D1C9E8", border:"3px solid "+(status==="done"?B.green:status==="available"?B.purpleMid:"#C0B8D8"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:status==="available"?"0 0 0 4px "+B.purplePale:"none" }}>
                  {status==="done"?"✓":status==="locked"?"🔒":li+1}
                </div>
                {li<dlessons.length-1&&<div style={{ width:3, flex:1, minHeight:20, background:status==="done"?B.green:"#E5E0F8", marginTop:4, borderRadius:99 }}/>}
              </div>
              <div style={{ flex:1, marginLeft:12, paddingBottom:12 }}>
                <Card hover={status!=="locked"} onClick={status==="locked"?undefined:()=>{setPlayerContext({lesson:l,dialect});setScreen("player");}} style={{ opacity:status==="locked"?0.5:1, cursor:status==="locked"?"not-allowed":"pointer", border:status==="available"?"2px solid "+B.purple:undefined }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:48, height:48, borderRadius:16, flexShrink:0, color:"#fff", fontSize:22, background:status==="done"?B.green:status==="available"?"linear-gradient(135deg,"+B.purple+","+B.purpleMid+")":"#D1C9E8", display:"flex", alignItems:"center", justifyContent:"center" }}>{status==="done"?"✓":l.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <p style={{ margin:0, fontWeight:900, fontSize:15, color:B.ink }}>{"Stage "+l.stage+": "+l.title}</p>
                        {status==="available"&&<Badge color={B.purple}>Unlocked</Badge>}
                        {status==="done"&&<Badge color={B.green}>Done</Badge>}
                      </div>
                      <p style={{ margin:"3px 0 6px", fontSize:12, color:B.inkLight }}>{l.desc}</p>
                      <div style={{ display:"flex", gap:12 }}>
                        <span style={{ fontSize:12, color:B.inkLight }}>{l.words.length+" words"}</span>
                        <span style={{ fontSize:12, color:B.gold, fontWeight:700 }}>{l.xp+" XP"}</span>
                        {status==="done"&&<span style={{ fontSize:12, color:B.green, fontWeight:700 }}>Quiz passed</span>}
                      </div>
                    </div>
                    {status!=="locked"&&<span style={{ color:B.inkLight, fontSize:18 }}>›</span>}
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

/* ─── LESSON PLAYER ─────────────────────────────────────── */
function LessonPlayer({ context, setScreen, addXP, apiKey, grantAchievement }) {
  const {lesson,dialect}=context; const words=lesson.words;
  const [idx,setIdx]=useState(0); const [flipped,setFlipped]=useState(false);
  const [results,setResults]=useState({}); const [showXP,setShowXP]=useState(false); const [done,setDone]=useState(false);
  const w=words[idx];
  function mark(known) {
    setResults(r=>({...r,[w.id]:known}));
    if(known){addXP(5);setShowXP(true);setTimeout(()=>setShowXP(false),2000);}
    const next=idx+1;
    if(next<words.length){setIdx(next);setFlipped(false);}
    else{setDone(true);setTimeout(()=>grantAchievement("first_lesson"),800);}
  }
  if(done) {
    const knownCount=Object.values(results).filter(Boolean).length;
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,"+B.purpleDark+",#1A0840)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
        <Bird size={90} bob/>
        <h2 style={{ color:"#fff", fontSize:28, fontWeight:900, margin:"16px 0 8px" }}>Lesson Complete!</h2>
        <p style={{ color:B.purpleLight, fontSize:16, margin:"0 0 24px" }}>{"Stage "+lesson.stage+": "+lesson.title}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28, width:"100%", maxWidth:360 }}>
          {[{label:"Words learned",value:knownCount+"/"+words.length,color:B.gold},{label:"XP earned",value:"+"+(knownCount*5),color:B.purpleLight}].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.1)", borderRadius:16, padding:18, textAlign:"center" }}>
              <p style={{ color:s.color, fontWeight:900, fontSize:28, margin:0 }}>{s.value}</p>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, margin:"4px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:20, padding:"16px 20px", marginBottom:24, width:"100%", maxWidth:360 }}>
          <p style={{ color:B.purpleLight, fontWeight:700, fontSize:14, margin:"0 0 8px" }}>What is next:</p>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:14, margin:0, lineHeight:1.7 }}>Take a <strong style={{ color:B.gold }}>short quiz</strong> to unlock the next stage!</p>
        </div>
        <Btn onClick={()=>setScreen("quizFromLesson")} color={B.gold} style={{ width:"100%", maxWidth:360, fontSize:17, padding:16, color:B.ink }}>Take the Quiz</Btn>
        <button onClick={()=>setScreen("learn")} style={{ color:"rgba(255,255,255,0.4)", background:"none", border:"none", marginTop:16, cursor:"pointer", fontSize:14 }}>Back to lessons</button>
      </div>
    );
  }
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,"+B.purpleDark+" 0%,#1A0840 100%)", display:"flex", flexDirection:"column" }}>
      {showXP&&<XPToast xp={5} onDone={()=>setShowXP(false)}/>}
      <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={()=>setScreen("learn")} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:50, width:38, height:38, color:"#fff", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:3, marginBottom:6 }}>
            {words.map((_,i)=><div key={i} style={{ height:5, flex:1, borderRadius:99, transition:"background 0.3s", background:results[words[i].id]===true?B.gold:results[words[i].id]===false?B.red:i===idx?B.purpleLight:"rgba(255,255,255,0.2)" }}/>)}
          </div>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:11, margin:0 }}>{(idx+1)+"/"+words.length+" · Stage "+lesson.stage+": "+lesson.title}</p>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 28px" }}>
        <div onClick={()=>setFlipped(!flipped)} style={{ width:"100%", maxWidth:420, borderRadius:32, padding:"52px 36px", textAlign:"center", cursor:"pointer", minHeight:280, display:"flex", flexDirection:"column", justifyContent:"center", background:flipped?"linear-gradient(135deg,"+B.green+",#064E3B)":"linear-gradient(135deg,"+B.purple+","+B.purpleMid+")", transition:"background 0.4s", boxShadow:"0 20px 60px rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:700, letterSpacing:2, margin:"0 0 14px", textTransform:"uppercase" }}>{flipped?"English":"Ijaw · "+dialect}</p>
          <h1 style={{ color:"#fff", fontSize:flipped?32:52, fontWeight:900, margin:0, lineHeight:1.1 }}>{flipped?w.english:w.ijaw}</h1>
          {!flipped&&<p style={{ color:"rgba(255,255,255,0.5)", fontStyle:"italic", fontSize:14, margin:"14px 0 0" }}>{"/" + w.roman + "/"}</p>}
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12, margin:"18px 0 0" }}>{flipped?"":"Tap to reveal"}</p>
        </div>
        <div style={{ display:"flex", gap:12, marginTop:18, width:"100%", maxWidth:420 }}>
          <Btn onClick={()=>speak(w,apiKey)} color="rgba(255,255,255,0.12)" style={{ flex:1 }}>🔊 Audio</Btn>
          <Btn onClick={()=>{setFlipped(false);speak(w,apiKey);}} color="rgba(255,255,255,0.12)" style={{ flex:1 }}>🔁 Again</Btn>
        </div>
        {flipped&&(
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:14, width:"100%", maxWidth:420 }}>
            <button onClick={()=>mark(false)} style={{ background:"rgba(220,38,38,0.2)", border:"2px solid rgba(220,38,38,0.4)", color:"#fff", borderRadius:16, padding:16, fontSize:16, fontWeight:800, cursor:"pointer" }}>Again</button>
            <button onClick={()=>mark(true)} style={{ background:"rgba(22,163,74,0.3)", border:"2px solid rgba(22,163,74,0.5)", color:"#fff", borderRadius:16, padding:16, fontSize:16, fontWeight:800, cursor:"pointer" }}>Got it!</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── QUIZ ──────────────────────────────────────────────── */
function Quiz({ lessonContext, setScreen, dialect, dialectStats, updateDialectStats, addXP, isMobile, onSwitch, apiKey, grantAchievement }) {
  const dlessons=getLessons(dialect);
  const [selLesson,setSelLesson]=useState(lessonContext||null);
  const [qs,setQs]=useState(()=>lessonContext?buildQuiz(lessonContext,dialect).sort(()=>Math.random()-0.5):null);
  const [qi,setQi]=useState(0); const [sel,setSel]=useState(null); const [score,setScore]=useState(0);
  const [hearts,setHearts]=useState(3); const [quizDone,setQuizDone]=useState(false);
  const [answers,setAnswers]=useState([]); const [showConf,setShowConf]=useState(false); const [xpToast,setXpToast]=useState(false);

  useEffect(()=>{
    if(!quizDone||!selLesson||!qs) return;
    const passed=hearts>0&&score>=Math.ceil(qs.length*0.6);
    const perfect=hearts>0&&score===qs.length;
    if(passed){
      const key=dialect+"_"+selLesson.stage;
      if(!dialectStats.completedLessons[key]){
        updateDialectStats(d=>({...d,completedLessons:{...d.completedLessons,[key]:true},xp:d.xp+selLesson.xp}));
        setShowConf(true);
        setTimeout(()=>grantAchievement("quiz_pass"),1200);
        const dlessonsAll=getLessons(dialect);
        const allDone=dlessonsAll.every(l=>l.stage===selLesson.stage||dialectStats.completedLessons[dialect+"_"+l.stage]);
        if(allDone) setTimeout(()=>grantAchievement("all_stages"),2000);
      }
    }
    if(perfect) setTimeout(()=>grantAchievement("perfect_quiz"),1600);
  },[quizDone]); // eslint-disable-line

  function startLesson(l){setSelLesson(l);setQs(buildQuiz(l,dialect).sort(()=>Math.random()-0.5));setQi(0);setSel(null);setScore(0);setHearts(3);setQuizDone(false);setAnswers([]);setShowConf(false);}
  function retry(){if(!selLesson)return;setQs(buildQuiz(selLesson,dialect).sort(()=>Math.random()-0.5));setQi(0);setSel(null);setScore(0);setHearts(3);setQuizDone(false);setAnswers([]);setShowConf(false);}
  function choose(opt){
    if(sel!==null||hearts<=0||!qs)return;
    const q=qs[qi]; const correct=opt===q.correct;
    setSel(opt); setAnswers(a=>[...a,{question:"What does \""+q.word+"\" mean?",chose:opt,correct:q.correct,isCorrect:correct}]);
    if(correct){setScore(s=>s+1);addXP(10);setXpToast(true);setTimeout(()=>setXpToast(false),2000);}
    else{const nh=hearts-1;setHearts(nh);if(nh<=0){setTimeout(()=>setQuizDone(true),1200);return;}}
    setTimeout(()=>{if(qi<qs.length-1){setQi(i=>i+1);setSel(null);}else setQuizDone(true);},1200);
  }

  if(!selLesson) return (
    <div style={{ paddingBottom:80 }}>
      {isMobile&&<TopBar title="Quiz" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ padding:(isMobile?16:0)+"px 20px 60px", maxWidth:600, margin:"0 auto" }}>
        {!isMobile&&<h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 6px", color:B.ink }}>🧠 Quiz</h2>}
        <p style={{ color:B.inkLight, fontSize:14, margin:"0 0 20px" }}>Choose a lesson to quiz yourself on:</p>
        {dlessons.map(l=>{
          const key=dialect+"_"+l.stage; const completed=!!dialectStats.completedLessons[key];
          const prevDone=l.stage===1||!!dialectStats.completedLessons[dialect+"_"+(l.stage-1)];
          return (
            <Card key={l.stage} hover={prevDone} onClick={prevDone?()=>startLesson(l):undefined} style={{ marginBottom:12, opacity:prevDone?1:0.45, cursor:prevDone?"pointer":"not-allowed" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:48, height:48, borderRadius:16, flexShrink:0, fontSize:22, color:"#fff", background:completed?B.green:prevDone?"linear-gradient(135deg,"+B.purple+","+B.purpleMid+")":"#D1C9E8", display:"flex", alignItems:"center", justifyContent:"center" }}>{completed?"✓":prevDone?l.icon:"🔒"}</div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontWeight:800, fontSize:15, color:B.ink }}>{"Stage "+l.stage+": "+l.title}</p>
                  <p style={{ margin:"3px 0 0", fontSize:12, color:B.inkLight }}>{l.words.length+" questions · "+l.xp+" XP"}</p>
                </div>
                {completed&&<Badge color={B.green}>Passed</Badge>}
                {!completed&&prevDone&&<Badge color={B.purple}>Take Quiz</Badge>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  if(!qs) return <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:16 }}><Bird size={60} bob/><p style={{ color:B.inkLight, fontWeight:700 }}>Loading quiz...</p></div>;

  const q=qs[qi]; const pct=Math.round((score/qs.length)*100);
  const passed=quizDone&&hearts>0&&score>=Math.ceil(qs.length*0.6);

  if(quizDone) return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile&&<TopBar title="Results" dialect={dialect} onSwitch={onSwitch}/>}
      {showConf&&<Confetti/>}
      <div style={{ maxWidth:560, margin:"0 auto", paddingTop:isMobile?20:8 }}>
        <div style={{ textAlign:"center", padding:"32px 0 24px" }}>
          <Bird size={90} bob={passed}/>
          <h2 style={{ color:B.ink, fontSize:28, fontWeight:900, margin:"14px 0 6px" }}>{passed?"Stage Cleared! 🎉":hearts<=0?"Out of hearts!":"Almost there!"}</h2>
          {passed&&<div style={{ background:B.goldLight, borderRadius:16, padding:"12px 20px", display:"inline-block", margin:"0 0 12px" }}><span style={{ color:B.ink, fontWeight:700 }}>{"+" + selLesson.xp+" XP · Stage "+(selLesson.stage+1)+" Unlocked!"}</span></div>}
          <p style={{ fontSize:42, fontWeight:900, color:B.purple, margin:"0 0 4px" }}>{score}<span style={{ color:B.inkLight, fontSize:22 }}>{"/" + qs.length}</span></p>
          <p style={{ color:B.inkLight, marginBottom:20 }}>{pct+"% · "+(passed?"Passed":"Need 60% to pass")}</p>
        </div>
        <h3 style={{ fontSize:13, fontWeight:700, color:B.inkLight, letterSpacing:1, marginBottom:10 }}>REVIEW</h3>
        {answers.map((a,i)=>(
          <Card key={i} style={{ marginBottom:8, padding:"12px 16px", borderLeft:"4px solid "+(a.isCorrect?B.green:B.red) }}>
            <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:700, color:B.ink }}>{a.question}</p>
            <p style={{ margin:0, fontSize:12, color:a.isCorrect?B.green:B.red }}>{(a.isCorrect?"✓ ":"✗ ")+a.chose}{!a.isCorrect&&<span style={{ color:B.inkLight }}>{" · Correct: "+a.correct}</span>}</p>
          </Card>
        ))}
        <div style={{ display:"grid", gridTemplateColumns:passed?"1fr":"1fr 1fr", gap:10, marginTop:16 }}>
          {!passed&&<Btn onClick={retry}>🔁 Retry</Btn>}
          <Btn color={B.green} onClick={()=>{setSelLesson(null);setScreen("learn");}}>{passed?"Next Stage":"Back to lessons"}</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile&&<TopBar title={"Stage "+selLesson.stage+": "+selLesson.title} onBack={()=>setSelLesson(null)} dialect={dialect} onSwitch={onSwitch}/>}
      {xpToast&&<XPToast xp={10} onDone={()=>setXpToast(false)}/>}
      <div style={{ maxWidth:560, margin:"0 auto", paddingTop:isMobile?16:0 }}>
        {!isMobile&&<div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}><h2 style={{ fontSize:20, fontWeight:900, margin:0, color:B.ink }}>{"Stage "+selLesson.stage+": "+selLesson.title}</h2><button onClick={()=>setSelLesson(null)} style={{ background:"none", border:"none", color:B.purple, cursor:"pointer", fontWeight:700, fontSize:14 }}>All quizzes</button></div>}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <p style={{ color:B.inkLight, fontSize:13, fontWeight:600, margin:0 }}>{"Q"+(qi+1)+"/"+qs.length}</p>
          <Hearts count={hearts}/>
          <p style={{ color:B.gold, fontSize:13, fontWeight:700, margin:0 }}>{"⚡ "+(score*10)+" XP"}</p>
        </div>
        <div style={{ display:"flex", gap:3, marginBottom:16 }}>{qs.map((_,i)=><div key={i} style={{ height:5, flex:1, borderRadius:99, transition:"all 0.3s", background:i<qi?B.purple:i===qi?B.gold:B.border }}/>)}</div>
        <Card style={{ background:"linear-gradient(135deg,"+B.purple+","+B.purpleMid+")", marginBottom:16, padding:"28px 24px", border:"none" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ color:B.purpleLight, fontSize:12, margin:"0 0 8px", fontWeight:700, letterSpacing:1 }}>WHAT DOES THIS MEAN?</p>
              <h2 style={{ color:"#fff", fontSize:42, fontWeight:900, margin:"0 0 6px" }}>{q.word}</h2>
              <p style={{ color:"rgba(255,255,255,0.5)", fontStyle:"italic", fontSize:14, margin:0 }}>{"/" + q.roman + "/"}</p>
            </div>
            <button onClick={()=>speak(q,apiKey)} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:50, width:42, height:42, color:"#fff", cursor:"pointer", fontSize:18, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>🔊</button>
          </div>
        </Card>
        {q.opts.map((opt,i)=>{
          let bg=B.white,border="2px solid "+B.border,tc=B.ink;
          if(sel!==null){if(opt===q.correct){bg=B.greenLight;border="2px solid "+B.green;tc=B.green;}else if(opt===sel){bg=B.redLight;border="2px solid "+B.red;tc=B.red;}}
          return <div key={i} onClick={()=>choose(opt)} style={{ background:bg, border, borderRadius:16, padding:"16px 18px", marginBottom:10, cursor:sel===null?"pointer":"default", display:"flex", alignItems:"center", gap:14, transition:"all 0.2s", color:tc }}>
            <div style={{ width:32, height:32, borderRadius:50, border:"2px solid "+B.border, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, flexShrink:0 }}>{["A","B","C","D"][i]}</div>
            <span style={{ fontSize:16, fontWeight:600, flex:1 }}>{opt}</span>
            {sel!==null&&opt===q.correct&&<span>✅</span>}
            {sel!==null&&opt===sel&&opt!==q.correct&&<span>❌</span>}
          </div>;
        })}
      </div>
    </div>
  );
}

/* ─── DICTIONARY ────────────────────────────────────────── */
function Dictionary({ dialect, isMobile, onSwitch, setScreen, apiKey }) {
  const [query,setQuery]=useState(""); const [sel,setSel]=useState(null);
  const dwords=getAllWords(dialect);
  const filtered=dwords.filter(w=>w.ijaw.toLowerCase().includes(query.toLowerCase())||w.english.toLowerCase().includes(query.toLowerCase())||w.roman.toLowerCase().includes(query.toLowerCase()));
  if(sel) return (
    <div>
      {isMobile&&<TopBar title="Word Detail" onBack={()=>setSel(null)}/>}
      <div style={{ padding:"0 20px 80px", maxWidth:560, margin:"0 auto" }}>
        {!isMobile&&<button onClick={()=>setSel(null)} style={{ background:"none", border:"none", color:B.purple, cursor:"pointer", fontSize:14, fontWeight:700, margin:"8px 0 16px", display:"block" }}>Dictionary</button>}
        <Card style={{ background:"linear-gradient(135deg,"+B.purple+","+B.purpleMid+")", textAlign:"center", padding:"44px 32px", marginBottom:16, border:"none" }}>
          <h1 style={{ color:"#fff", fontSize:60, fontWeight:900, margin:0 }}>{sel.ijaw}</h1>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:22, margin:"10px 0 6px" }}>{sel.english}</p>
          <p style={{ color:B.purpleLight, fontStyle:"italic", margin:0 }}>{"/" + sel.roman + "/"}</p>
        </Card>
        <Card style={{ marginBottom:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div><p style={{ margin:0, fontSize:12, color:B.inkLight, fontWeight:700 }}>DIALECT</p><p style={{ margin:"4px 0 0", fontSize:17, fontWeight:800, color:B.ink }}>{dialect}</p></div>
            <div><p style={{ margin:0, fontSize:12, color:B.inkLight, fontWeight:700 }}>REGION</p><p style={{ margin:"4px 0 0", fontSize:17, fontWeight:800, color:B.ink }}>{DIALECT_INFO[dialect].region}</p></div>
          </div>
        </Card>
        <Btn onClick={()=>speak(sel,apiKey)} style={{ width:"100%", marginBottom:10 }}>🔊 Hear Pronunciation</Btn>
        <Btn onClick={()=>setScreen("voice")} outline color={B.purple} style={{ width:"100%" }}>🎙️ Practice This Word</Btn>
      </div>
    </div>
  );
  return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile&&<TopBar title="Dictionary" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ maxWidth:700, margin:"0 auto", paddingTop:isMobile?16:0 }}>
        {!isMobile&&<h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 6px", color:B.ink }}>📖 Dictionary</h2>}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, background:B.purplePale, borderRadius:12, padding:"8px 14px" }}>
          <span>{DIALECT_INFO[dialect].flag}</span><span style={{ fontSize:13, fontWeight:700, color:B.purple }}>{dialect+" · "+dwords.length+" words"}</span>
        </div>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Ijaw or English..." style={{ width:"100%", padding:"14px 18px", borderRadius:16, border:"2px solid "+B.border, fontSize:16, marginBottom:16, background:B.white, boxSizing:"border-box", outline:"none", fontFamily:"inherit" }}/>
        <p style={{ color:B.inkLight, fontSize:13, fontWeight:600, marginBottom:12 }}>{filtered.length+" results"}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:12 }}>
          {filtered.map(w=>(
            <Card key={w.id} hover onClick={()=>setSel(w)} style={{ cursor:"pointer", padding:"14px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <p style={{ margin:0, fontWeight:900, fontSize:20, color:B.ink }}>{w.ijaw}</p>
                  <p style={{ margin:"4px 0 4px", fontSize:14, color:B.inkLight }}>{w.english}</p>
                  <p style={{ margin:0, fontSize:12, color:B.purpleLight, fontStyle:"italic" }}>{"/" + w.roman + "/"}</p>
                </div>
                <button onClick={e=>{e.stopPropagation();speak(w,apiKey);}} style={{ background:B.purplePale, border:"1px solid "+B.purpleLight, borderRadius:50, width:36, height:36, fontSize:14, cursor:"pointer", flexShrink:0, color:B.purple, display:"flex", alignItems:"center", justifyContent:"center" }}>▶</button>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length===0&&<div style={{ textAlign:"center", padding:60, color:B.inkLight }}><Bird size={70}/><p style={{ fontWeight:700, marginTop:12 }}>No words found</p><p style={{ fontSize:14 }}>Try a different search term.</p></div>}
      </div>
    </div>
  );
}

/* ─── VOICE ─────────────────────────────────────────────── */
function Voice({ dialect, isMobile, updateDialectStats, onSwitch, addXP, apiKey, grantAchievement }) {
  const [rec,setRec]=useState(false); const [hasRec,setHasRec]=useState(false); const [playing,setPlaying]=useState(false);
  const [status,setStatus]=useState("Tap Record to activate your mic"); const [stype,setStype]=useState("idle");
  const [wi,setWi]=useState(0); const [recCount,setRecCount]=useState(0); const [score,setScore]=useState(null);
  const [micDenied,setMicDenied]=useState(false); const [secs,setSecs]=useState(0);
  const mediaRef=useRef(null); const chunksRef=useRef([]); const blobRef=useRef(null); const audioRef=useRef(null); const timerRef=useRef(null);
  const pw=getAllWords(dialect).slice(0,10); const curr=pw[wi]||pw[0];
  const finish=useCallback(()=>{
    const n=recCount+1; setRecCount(n);
    setTimeout(()=>setScore(Math.floor(55+Math.random()*45)),900);
    if(n===1){updateDialectStats(d=>({...d,achievements:[...new Set([...(d.achievements||[]),"voice_rec"])]}));setTimeout(()=>grantAchievement("voice_rec"),1000);addXP(15);}
    else addXP(5);
  },[recCount,addXP,updateDialectStats,grantAchievement]);
  async function startRec(){
    chunksRef.current=[];setScore(null);setHasRec(false);setSecs(0);
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});setMicDenied(false);
      const mr=new MediaRecorder(stream);mediaRef.current=mr;
      mr.ondataavailable=e=>{if(e.data.size>0)chunksRef.current.push(e.data);};
      mr.onstop=()=>{blobRef.current=new Blob(chunksRef.current,{type:mr.mimeType||"audio/webm"});setHasRec(true);stream.getTracks().forEach(t=>t.stop());clearInterval(timerRef.current);setStatus("Saved — press Play Back");setStype("saved");finish();};
      mr.start(100);setRec(true);setStatus("Recording — say the word clearly");setStype("recording");
      timerRef.current=setInterval(()=>setSecs(s=>s+1),1000);
    }catch(err){
      if(err.name==="NotAllowedError"||err.name==="PermissionDeniedError"){setMicDenied(true);setStatus("Mic access denied");setStype("error");}
      else{setRec(true);setStatus("Recording (demo)...");setStype("recording");timerRef.current=setInterval(()=>setSecs(s=>s+1),1000);setTimeout(()=>{setRec(false);setHasRec(true);setStatus("Demo saved — press Play Back");setStype("saved");clearInterval(timerRef.current);finish();},3000);}
    }
  }
  function stopRec(){if(mediaRef.current&&mediaRef.current.state!=="inactive")mediaRef.current.stop();setRec(false);clearInterval(timerRef.current);}
  function playRec(){
    if(!blobRef.current){speak(curr,apiKey);setStatus("Playing demo...");setStype("playing");setTimeout(()=>{setStatus("Done!");setStype("saved");},2000);return;}
    if(audioRef.current){audioRef.current.pause();audioRef.current=null;}
    const url=URL.createObjectURL(blobRef.current); const a=new Audio(url); audioRef.current=a;
    a.oncanplaythrough=()=>a.play().catch(()=>{setStatus("Playback failed");setStype("error");});
    a.onplay=()=>{setPlaying(true);setStatus("Playing your voice...");setStype("playing");};
    a.onended=()=>{setPlaying(false);setStatus("Compare with the sample above");setStype("saved");URL.revokeObjectURL(url);};
    a.onerror=()=>{setPlaying(false);setStatus("Playback error");setStype("error");};
  }
  function selectWord(i){setWi(i);setHasRec(false);setScore(null);setSecs(0);setStatus("Tap Record to activate your mic");setStype("idle");if(audioRef.current){audioRef.current.pause();audioRef.current=null;}setPlaying(false);setRec(false);}
  const scColor=score?(score>=80?B.green:score>=60?B.gold:B.red):B.inkLight;
  const stBg={idle:B.purplePale,recording:B.redLight,saved:B.greenLight,playing:B.purplePale,error:"#FEF9C3"};
  const stBdr={idle:B.border,recording:B.red,saved:B.green,playing:B.purple,error:B.gold};
  const stClr={idle:B.inkLight,recording:B.red,saved:B.green,playing:B.purple,error:B.orange};
  return (
    <div style={{ paddingBottom:80 }}>
      {isMobile&&<TopBar title="Voice Practice" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ padding:"0 20px", maxWidth:640, margin:"0 auto", paddingTop:isMobile?16:0 }}>
        {!isMobile&&<h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 16px", color:B.ink }}>🎙️ Voice Practice</h2>}
        <Card style={{ background:"linear-gradient(135deg,"+B.purple+","+B.purpleMid+")", textAlign:"center", padding:"40px 32px", marginBottom:20, border:"none" }}>
          <p style={{ color:B.purpleLight, margin:"0 0 12px", fontSize:12, fontWeight:700, letterSpacing:2 }}>SAY THIS WORD</p>
          <h1 style={{ color:"#fff", fontSize:54, fontWeight:900, margin:"0 0 8px" }}>{curr.ijaw}</h1>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:20, margin:"0 0 6px" }}>{curr.english}</p>
          <p style={{ color:B.purpleLight, fontStyle:"italic", fontSize:14, margin:"0 0 20px" }}>{"/" + curr.roman + "/"}</p>
          <button onClick={()=>speak(curr,apiKey)} style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:50, padding:"12px 28px", color:"#fff", cursor:"pointer", fontSize:16, fontWeight:700 }}>🔊 Hear Sample</button>
        </Card>
        {micDenied&&<Card style={{ background:"#FEF9C3", border:"2px solid "+B.gold, marginBottom:16, padding:"14px 18px" }}><p style={{ margin:0, fontSize:13, color:B.ink, fontWeight:700 }}>Mic access blocked</p><p style={{ margin:"6px 0 0", fontSize:12, color:B.inkLight }}>Click the lock icon in your browser address bar, then allow microphone.</p></Card>}
        {score!==null&&<Card style={{ marginBottom:16, textAlign:"center", padding:"16px 20px", border:"2px solid "+scColor+"44" }}><div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}><Bird size={48} bob={score>=80}/><div><p style={{ margin:0, fontSize:12, color:B.inkLight, fontWeight:700 }}>SCORE</p><p style={{ margin:"4px 0", fontSize:38, fontWeight:900, color:scColor }}>{score+"%"}</p><p style={{ margin:0, fontSize:13, color:B.inkLight }}>{score>=80?"Excellent!":score>=60?"Good job!":"Keep practicing"}</p></div></div></Card>}
        <div style={{ borderRadius:14, padding:"12px 18px", fontSize:14, fontWeight:600, marginBottom:16, background:stBg[stype]||B.purplePale, border:"2px solid "+(stBdr[stype]||B.border), color:stClr[stype]||B.inkLight, transition:"all 0.3s", display:"flex", alignItems:"center", gap:10 }}>
          {stype==="recording"&&<><span style={{ width:10, height:10, borderRadius:"50%", background:B.red, display:"inline-block", animation:"pulse 1s infinite" }}/><style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}"}</style><span style={{ fontWeight:800 }}>{secs+"s"}</span></>}
          <span style={{ flex:1 }}>{status}</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <button onClick={rec?stopRec:startRec} style={{ background:rec?B.red:B.purple, border:"none", borderRadius:16, padding:"18px 16px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6, boxShadow:"0 4px 16px "+(rec?B.red:B.purple)+"44", transition:"all 0.2s" }}><span style={{ fontSize:28 }}>{rec?"⏹":"🎙️"}</span><span>{rec?"Stop ("+secs+"s)":"Record"}</span></button>
          <button onClick={hasRec?playRec:undefined} disabled={!hasRec} style={{ background:!hasRec?"#E5E0F0":playing?B.purpleMid:B.green, border:"none", borderRadius:16, padding:"18px 16px", color:!hasRec?B.inkLight:"#fff", fontWeight:800, fontSize:16, cursor:!hasRec?"not-allowed":"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6, boxShadow:hasRec?"0 4px 16px "+B.green+"44":"none", transition:"all 0.2s" }}><span style={{ fontSize:28 }}>{playing?"🔊":"▶"}</span><span>{playing?"Playing...":"Play Back"}</span></button>
        </div>
        <Card style={{ marginBottom:16 }}>
          <p style={{ margin:"0 0 12px", fontWeight:800, fontSize:15, color:B.ink }}>{dialect+" Words"}</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {pw.map((w,i)=><button key={w.id} onClick={()=>selectWord(i)} style={{ padding:"8px 14px", borderRadius:20, border:"none", cursor:"pointer", background:i===wi?B.purple:B.purplePale, color:i===wi?"#fff":B.purple, fontWeight:700, fontSize:13, transition:"all 0.15s" }}>{w.ijaw}</button>)}
          </div>
        </Card>
        <Card style={{ background:B.purplePale, border:"1px solid "+B.purpleLight+"44", padding:"16px 18px" }}>
          <div style={{ display:"flex", gap:12 }}><Bird size={36}/><div><p style={{ margin:"0 0 6px", fontWeight:800, fontSize:13, color:B.ink }}>How to practice:</p>{["1. Hear Sample — listen carefully","2. Record — speak into your mic","3. Stop when done","4. Play Back — hear yourself","5. Compare and repeat!"].map((t,i)=><p key={i} style={{ margin:"2px 0", fontSize:12, color:B.inkLight }}>{t}</p>)}</div></div>
        </Card>
      </div>
    </div>
  );
}

/* ─── PROGRESS ──────────────────────────────────────────── */
function Progress({ dialect, allStats, isMobile, onSwitch, user, onLogout }) {
  const ds=allStats[dialect]||freshStats(); const level=calcLevel(ds.xp); const nxt=xpToNext(ds.xp);
  const dlessons=getLessons(dialect); const done=dlessons.filter(l=>ds.completedLessons[dialect+"_"+l.stage]).length;
  const totalXP=DIALECTS.reduce((sum,d)=>sum+(allStats[d]?allStats[d].xp:0),0);
  return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile&&<TopBar title="My Progress" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ maxWidth:640, margin:"0 auto", paddingTop:isMobile?16:0 }}>
        {!isMobile&&<h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 16px", color:B.ink }}>📊 My Progress</h2>}
        <Card style={{ background:"linear-gradient(135deg,"+B.purple+","+B.purpleMid+")", border:"none", marginBottom:20, padding:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
            <div style={{ width:70, height:70, borderRadius:22, background:"rgba(255,255,255,0.15)", border:"3px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:42 }}>{user.avatar}</div>
            <div>
              <p style={{ color:"#fff", fontWeight:900, fontSize:22, margin:0 }}>{user.name}</p>
              <p style={{ color:B.purpleLight, fontSize:13, margin:"3px 0 6px" }}>{user.email+" · Joined "+user.joinedDate}</p>
              <p style={{ color:B.gold, fontSize:13, fontWeight:700, margin:0 }}>{"⚡ "+totalXP+" total XP across all dialects"}</p>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12, margin:"0 0 5px" }}>{"Level "+level+" → "+(level+1)+" · "+nxt+" XP remaining ("+dialect+")"}</p>
          <div style={{ background:"rgba(255,255,255,0.25)", borderRadius:99, height:10, overflow:"hidden" }}><div style={{ width:(((60-nxt)/60)*100)+"%", height:"100%", background:B.gold, borderRadius:99, transition:"width 0.5s" }}/></div>
        </Card>
        <h3 style={{ fontSize:13, fontWeight:700, color:B.inkLight, letterSpacing:1, marginBottom:12 }}>ALL DIALECTS</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12, marginBottom:24 }}>
          {DIALECTS.map(d=>{const dst=allStats[d]||freshStats();const dl=getLessons(d);const dc=dl.filter(l=>dst.completedLessons[d+"_"+l.stage]).length;return(
            <Card key={d} style={{ border:d===dialect?"2px solid "+B.purple:undefined, padding:"16px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}><span style={{ fontSize:24 }}>{DIALECT_INFO[d].flag}</span>{d===dialect&&<Badge color={B.purple}>Active</Badge>}</div>
              <p style={{ margin:0, fontWeight:800, fontSize:15, color:B.ink }}>{d}</p>
              <p style={{ margin:"4px 0 8px", fontSize:12, color:B.inkLight }}>{dc+"/"+dl.length+" stages · "+dst.xp+" XP"}</p>
              <PBar value={dc} max={dl.length} h={6}/>
            </Card>
          );})}
        </div>
        <h3 style={{ fontSize:13, fontWeight:700, color:B.inkLight, letterSpacing:1, marginBottom:12 }}>{dialect.toUpperCase()+" STAGES"}</h3>
        {dlessons.map(l=>{const cleared=!!ds.completedLessons[dialect+"_"+l.stage];return(
          <Card key={l.stage} style={{ marginBottom:12, padding:"16px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}><span style={{ fontSize:24 }}>{l.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <p style={{ margin:0, fontWeight:800, fontSize:15, color:B.ink }}>{"Stage "+l.stage+": "+l.title}</p>
                  {cleared?<Badge color={B.green}>Cleared</Badge>:<Badge color={B.inkLight}>Pending</Badge>}
                </div>
                <p style={{ margin:"3px 0 0", fontSize:12, color:B.inkLight }}>{l.words.length+" words · "+l.xp+" XP"}</p>
              </div>
            </div>
          </Card>
        );})}
        <h3 style={{ fontSize:13, fontWeight:700, color:B.inkLight, letterSpacing:1, margin:"24px 0 12px" }}>ACHIEVEMENTS</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12, marginBottom:24 }}>
          {ALL_ACHIEVEMENTS.map(a=>{
            const earned=(ds.achievements||[]).includes(a.id)||(a.id==="first_lesson"&&done>0)||(a.id==="quiz_pass"&&Object.keys(ds.completedLessons).length>0)||(a.id==="all_stages"&&done===dlessons.length&&dlessons.length>0);
            return(
              <Card key={a.id} style={{ opacity:earned?1:0.38, filter:earned?"none":"grayscale(0.8)", padding:"16px 16px", border:earned?"2px solid "+a.color+"44":undefined, position:"relative", overflow:"hidden" }}>
                {earned&&<div style={{ position:"absolute", top:0, right:0, background:a.color, width:8, height:8, borderRadius:"0 0 0 8px" }}/>}
                <div style={{ fontSize:32, marginBottom:8 }}>{a.icon}</div>
                <p style={{ margin:"0 0 4px", fontWeight:800, fontSize:13, color:B.ink }}>{a.title}</p>
                <p style={{ margin:0, fontSize:11, color:B.inkLight, lineHeight:1.4 }}>{a.desc}</p>
                {earned&&<p style={{ margin:"8px 0 0", fontSize:10, color:a.color, fontWeight:800, letterSpacing:0.5 }}>EARNED</p>}
              </Card>
            );
          })}
        </div>
        <button onClick={onLogout} style={{ width:"100%", padding:14, borderRadius:14, border:"2px solid "+B.redLight, background:"transparent", color:B.red, cursor:"pointer", fontWeight:700, fontSize:15 }}>🚪 Sign Out</button>
      </div>
    </div>
  );
}

/* ─── ROOT APP ──────────────────────────────────────────── */
export default function App() {
  const [authUser,      setAuthUser     ] = useState(()=>{ const uid=safeGet("nume_session"); if(!uid)return null; return getUsersDB()[uid]||null; });
  const [hasChosen,     setHasChosen    ] = useState(false);
  const [dialect,       setDialect      ] = useState("Tobu");
  const [screen,        setScreen       ] = useState("home");
  const [showModal,     setShowModal    ] = useState(false);
  const [showSpeech,    setShowSpeech   ] = useState(false);
  const [showStreakPop, setShowStreakPop ] = useState(false);
  const [isMobile,      setIsMobile     ] = useState(typeof window!=="undefined"?window.innerWidth<768:false);
  const [playerCtx,     setPlayerCtx    ] = useState(null);
  const [lessonCtx,     setLessonCtx    ] = useState(null);
  const [xpToast,       setXpToast      ] = useState(null);
  const [apiKey,        setApiKey       ] = useState(()=>safeGet("nume_elevenlabs_key")||"");
  const [newAchievement,setNewAchievement] = useState(null);
  const [allStats,      setAllStats     ] = useState(()=>{ const uid=safeGet("nume_session"); return uid?loadUserStats(uid):freshAllStats(); });

  useEffect(()=>{ const h=()=>setIsMobile(window.innerWidth<768); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h); },[]);
  useEffect(()=>{ if(authUser)saveUserStats(authUser.id,allStats); },[allStats,authUser]);

  function saveApiKey(k){setApiKey(k);safeSet("nume_elevenlabs_key",k);}

  const grantAchievement=useCallback((id)=>{
    setAllStats(all=>{
      const ds=all[dialect]||freshStats();
      if((ds.achievements||[]).includes(id))return all;
      const achDef=ALL_ACHIEVEMENTS.find(a=>a.id===id);
      if(achDef)setNewAchievement(achDef);
      return{...all,[dialect]:{...ds,achievements:[...(ds.achievements||[]),id]}};
    });
  },[dialect]);

  const doStreak=useCallback(()=>{
    if(!authUser)return;
    markActiveDate(authUser.id,dialect);
    const newCount=tickStreak(authUser.id,dialect);
    setAllStats(all=>({...all,[dialect]:{...(all[dialect]||freshStats()),streak:newCount}}));
    if(newCount>=3) setTimeout(()=>grantAchievement("streak_3"),800);
    if(newCount>=7) setTimeout(()=>grantAchievement("streak_7"),800);
  },[authUser,dialect,grantAchievement]);

  const dialectStats=allStats[dialect]||freshStats();
  const updateDialectStats=useCallback((updater)=>{setAllStats(all=>({...all,[dialect]:updater(all[dialect]||freshStats())}));},[dialect]);
  const addXP=useCallback((amt)=>{updateDialectStats(d=>({...d,xp:d.xp+amt}));setXpToast(amt);setTimeout(()=>setXpToast(null),2200);doStreak();},[updateDialectStats,doStreak]);

  function handleLogin(user){setAuthUser(user);safeSet("nume_session",user.id);setAllStats(loadUserStats(user.id));setHasChosen(false);}
  function handleLogout(){if(authUser)saveUserStats(authUser.id,allStats);safeSet("nume_session",null);setAuthUser(null);setHasChosen(false);setScreen("home");setAllStats(freshAllStats());}
  function handleDialectPick(d){setDialect(d);setHasChosen(true);}
  function handleDialectSwitch(d){setDialect(d);setShowModal(false);setScreen("home");setPlayerCtx(null);setLessonCtx(null);}

  if(!authUser)  return <AuthScreen onLogin={handleLogin}/>;
  if(!hasChosen) return <DialectPicker onSelect={handleDialectPick}/>;

  if(screen==="player"&&playerCtx) return(
    <LessonPlayer context={playerCtx} apiKey={apiKey} grantAchievement={grantAchievement}
      setScreen={s=>{if(s==="quizFromLesson"){setLessonCtx(playerCtx.lesson);setScreen("quiz");}else setScreen(s);}}
      addXP={addXP}/>
  );

  const shared={dialect,setScreen,isMobile,dialectStats,updateDialectStats,allStats,addXP,apiKey,grantAchievement,onSwitch:()=>setShowModal(true),user:authUser};

  function renderScreen(){
    switch(screen){
      case "home":       return <Home       {...shared}/>;
      case "learn":      return <Learn      {...shared} setPlayerContext={setPlayerCtx}/>;
      case "quiz":       return <Quiz       {...shared} lessonContext={lessonCtx}/>;
      case "dictionary": return <Dictionary {...shared}/>;
      case "voice":      return <Voice      {...shared}/>;
      case "progress":   return <Progress   dialect={dialect} allStats={allStats} isMobile={isMobile} onSwitch={()=>setShowModal(true)} user={authUser} onLogout={handleLogout}/>;
      default:           return <Home       {...shared}/>;
    }
  }

  return(
    <div style={{ display:"flex", fontFamily:"'Segoe UI',system-ui,sans-serif", background:B.off, minHeight:"100vh" }}>
      {!isMobile&&<Sidebar screen={screen} setScreen={setScreen} dialect={dialect} onSwitch={()=>setShowModal(true)} stats={dialectStats} user={authUser} onLogout={handleLogout}/>}
      <div style={{ flex:1, minWidth:0, overflowY:"auto", paddingBottom:isMobile?72:0 }}>
        {!isMobile&&(
          <div style={{ padding:"18px 28px 14px", borderBottom:"1.5px solid "+B.border, display:"flex", justifyContent:"space-between", alignItems:"center", background:B.white, position:"sticky", top:0, zIndex:100 }}>
            <div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:900, color:B.ink }}>
                {(NAV.find(n=>n.id===screen)||{icon:"",label:"Nume"}).icon+" "+(NAV.find(n=>n.id===screen)||{icon:"",label:"Nume"}).label}
              </h1>
              <p style={{ margin:"3px 0 0", fontSize:12, color:B.inkLight }}>{DIALECT_INFO[dialect].flag+" "+dialect+" · Level "+calcLevel(dialectStats.xp)+" · "+dialectStats.xp+" XP"}</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {/* Streak with calendar popover */}
              <div style={{ position:"relative" }}>
                <button onClick={()=>setShowStreakPop(p=>!p)} onMouseEnter={()=>setShowStreakPop(true)}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:4, borderRadius:8 }}>
                  <Flame count={dialectStats.streak}/>
                </button>
                {showStreakPop&&(
                  <>
                    <div style={{ position:"fixed", inset:0, zIndex:499 }} onClick={()=>setShowStreakPop(false)}/>
                    <StreakPopover count={dialectStats.streak} userId={authUser.id} dialect={dialect} onClose={()=>setShowStreakPop(false)}/>
                  </>
                )}
              </div>
              <Hearts count={dialectStats.hearts}/>
              <button onClick={()=>setShowSpeech(true)} style={{ background:apiKey?B.green+"18":B.purplePale, border:"1px solid "+(apiKey?B.green:B.border), borderRadius:20, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:12, color:apiKey?B.green:B.inkLight, display:"flex", alignItems:"center", gap:6 }}>{"🎙️ "+(apiKey?"Voice On":"Set Voice")}</button>
              <div onClick={()=>setScreen("progress")} style={{ width:36, height:36, borderRadius:50, background:B.purplePale, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, cursor:"pointer" }}>{authUser.avatar}</div>
              <button onClick={()=>setShowModal(true)} style={{ background:B.purplePale, border:"none", borderRadius:20, padding:"9px 16px", cursor:"pointer", fontWeight:700, fontSize:13, color:B.purple, display:"flex", alignItems:"center", gap:8 }}>{DIALECT_INFO[dialect].flag+" "+dialect+" ▾"}</button>
            </div>
          </div>
        )}
        <div style={{ padding:!isMobile?"8px 0":0 }}>{renderScreen()}</div>
      </div>
      {isMobile&&<BotNav screen={screen} setScreen={setScreen}/>}
      {showModal   &&<DialectModal     dialect={dialect} allStats={allStats} onSelect={handleDialectSwitch} onClose={()=>setShowModal(false)}/>}
      {showSpeech  &&<SpeechSettingsModal apiKey={apiKey} onSave={saveApiKey} onClose={()=>setShowSpeech(false)}/>}
      {xpToast     &&<XPToast xp={xpToast} onDone={()=>setXpToast(null)}/>}
      {newAchievement&&<AchievementModal achievement={newAchievement} onClose={()=>setNewAchievement(null)}/>}
    </div>
  );
}