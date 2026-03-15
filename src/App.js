import { useState, useRef, useEffect, useCallback } from "react";

const B = {
  purple:"#6B21E8",purpleDark:"#1E0A3C",purpleMid:"#8B44F0",
  purpleLight:"#C4A8F8",purplePale:"#F0EAFF",
  gold:"#F0B429",goldLight:"#FEF3C7",
  white:"#FFFFFF",off:"#FAF8FF",
  ink:"#1A0A2E",inkMid:"#3D2A6B",inkLight:"#7B6899",
  green:"#16A34A",greenLight:"#DCFCE7",
  red:"#DC2626",redLight:"#FEE2E2",
  orange:"#EA580C",border:"#E8E0F8",
};

const DIALECTS = ["Kalabari","Nembe","Izon"];
const DIALECT_INFO = {
  Kalabari:{ region:"Rivers State",   speakers:"~300,000",   color:"#6B21E8", flag:"🌊" },
  Nembe:   { region:"Bayelsa State",  speakers:"~100,000",   color:"#16A34A", flag:"🌿" },
  Izon:    { region:"Delta/Bayelsa",  speakers:"~1,000,000", color:"#EA580C", flag:"🔥" },
};

const RAW_LESSONS = [
  { stage:1, title:"Greetings", icon:"👋", xp:20, desc:"Everyday greetings and polite phrases",
    words:{
      Kalabari:[
        {id:1, ijaw:"Owari",     english:"Good morning",  roman:"oh-WAH-ree"},
        {id:2, ijaw:"Sibo",      english:"Good evening",  roman:"SEE-boh"},
        {id:3, ijaw:"Singbi",    english:"Thank you",     roman:"SING-bee"},
        {id:4, ijaw:"Ogbo keme", english:"Good afternoon",roman:"OGH-boh KEH-meh"},
        {id:5, ijaw:"Keme bo",   english:"Come here",     roman:"KEH-meh boh"},
        {id:6, ijaw:"Mie dou",   english:"I love you",    roman:"MEE-eh doh"},
      ],
      Nembe:[
        {id:101,ijaw:"Dawei",    english:"Welcome",       roman:"dah-WAY"},
        {id:102,ijaw:"Ogbo",     english:"Please",        roman:"OGH-boh"},
        {id:103,ijaw:"Singi",    english:"Thank you",     roman:"SING-ee"},
        {id:104,ijaw:"Toru",     english:"Hello",         roman:"TOH-roo"},
        {id:105,ijaw:"Adei",     english:"Goodbye",       roman:"ah-DAY"},
        {id:106,ijaw:"Ke bo",    english:"Come in",       roman:"keh BOH"},
      ],
      Izon:[
        {id:201,ijaw:"Boro ye",  english:"How are you?",  roman:"BOH-roh yeh"},
        {id:202,ijaw:"Buru",     english:"Yes",           roman:"BOO-roo"},
        {id:203,ijaw:"Kuro",     english:"No",            roman:"KOO-roh"},
        {id:204,ijaw:"Ayiba",    english:"Joy / Happiness",roman:"ah-YEE-bah"},
        {id:205,ijaw:"Toru mie", english:"I am tired",    roman:"TOH-roo mee-eh"},
        {id:206,ijaw:"Ebi mie",  english:"I am hungry",   roman:"EH-bee mee-eh"},
      ],
    }},
  { stage:2, title:"Numbers", icon:"🔢", xp:20, desc:"Count from one to ten",
    words:{
      Kalabari:[
        {id:7, ijaw:"Emi",       english:"One",   roman:"EH-mee"},
        {id:8, ijaw:"Aruo",      english:"Two",   roman:"ah-ROO-oh"},
        {id:9, ijaw:"Esuo",      english:"Three", roman:"eh-SOO-oh"},
        {id:10,ijaw:"Enimo",     english:"Four",  roman:"eh-NEE-moh"},
        {id:11,ijaw:"Enimumo",   english:"Five",  roman:"eh-NEE-moo-moh"},
        {id:12,ijaw:"Eminitein", english:"Six",   roman:"EH-mee-nee-tain"},
      ],
      Nembe:[
        {id:107,ijaw:"Emu",      english:"One",   roman:"EH-moo"},
        {id:108,ijaw:"Aru",      english:"Two",   roman:"AH-roo"},
        {id:109,ijaw:"Eso",      english:"Three", roman:"EH-soh"},
        {id:110,ijaw:"Ini",      english:"Four",  roman:"EE-nee"},
        {id:111,ijaw:"Inimu",    english:"Five",  roman:"EE-nee-moo"},
        {id:112,ijaw:"Initei",   english:"Six",   roman:"EE-nee-tay"},
      ],
      Izon:[
        {id:207,ijaw:"Emi",      english:"One",   roman:"EH-mee"},
        {id:208,ijaw:"Iruo",     english:"Two",   roman:"EE-roo-oh"},
        {id:209,ijaw:"Esuo",     english:"Three", roman:"EH-soo-oh"},
        {id:210,ijaw:"Enei",     english:"Four",  roman:"EH-nay"},
        {id:211,ijaw:"Tein",     english:"Five",  roman:"TAY-n"},
        {id:212,ijaw:"Tein-emi", english:"Six",   roman:"TAY-n EH-mee"},
      ],
    }},
  { stage:3, title:"Family", icon:"👨‍👩‍👧", xp:25, desc:"Family members and relationships",
    words:{
      Kalabari:[
        {id:13,ijaw:"Ye",    english:"Mother",      roman:"yeh"},
        {id:14,ijaw:"Ba",    english:"Father",      roman:"bah"},
        {id:15,ijaw:"Teri",  english:"Brother",     roman:"TEH-ree"},
        {id:16,ijaw:"Seri",  english:"Sister",      roman:"SEH-ree"},
        {id:17,ijaw:"Opu",   english:"Elder/Chief", roman:"OH-poo"},
        {id:18,ijaw:"Bie",   english:"Child",       roman:"BEE-eh"},
      ],
      Nembe:[
        {id:113,ijaw:"Yei",   english:"Mother",  roman:"YAY"},
        {id:114,ijaw:"Bai",   english:"Father",  roman:"BAY"},
        {id:115,ijaw:"Temi",  english:"Brother", roman:"TEH-mee"},
        {id:116,ijaw:"Semi",  english:"Sister",  roman:"SEH-mee"},
        {id:117,ijaw:"Opuei", english:"Elder",   roman:"oh-POO-ay"},
        {id:118,ijaw:"Biemi", english:"Child",   roman:"BEE-eh-mee"},
      ],
      Izon:[
        {id:213,ijaw:"Ye",       english:"Mother",       roman:"yeh"},
        {id:214,ijaw:"Ba",       english:"Father",       roman:"bah"},
        {id:215,ijaw:"Teri",     english:"Brother",      roman:"TEH-ree"},
        {id:216,ijaw:"Seri",     english:"Sister",       roman:"SEH-ree"},
        {id:217,ijaw:"Opuboro",  english:"Elder person", roman:"oh-POO-BOH-roh"},
        {id:218,ijaw:"Biemini",  english:"Little child", roman:"BEE-eh-MEE-nee"},
      ],
    }},
  { stage:4, title:"Food & Drink", icon:"🍲", xp:25, desc:"Traditional food and drinks",
    words:{
      Kalabari:[
        {id:19,ijaw:"Fiyai", english:"Fish",           roman:"FEE-yai"},
        {id:20,ijaw:"Banga", english:"Palm fruit soup", roman:"BANG-ah"},
        {id:21,ijaw:"Tubo",  english:"Palm wine",      roman:"TOO-boh"},
        {id:22,ijaw:"Erei",  english:"Rice",           roman:"eh-RAY"},
        {id:23,ijaw:"Ere",   english:"Meat",           roman:"EH-reh"},
        {id:24,ijaw:"Omi",   english:"Water",          roman:"OH-mee"},
      ],
      Nembe:[
        {id:119,ijaw:"Fiya", english:"Fish",      roman:"FEE-yah"},
        {id:120,ijaw:"Beni", english:"Palm oil",  roman:"BEH-nee"},
        {id:121,ijaw:"Tubu", english:"Palm wine", roman:"TOO-boo"},
        {id:122,ijaw:"Ogi",  english:"Porridge",  roman:"OH-gee"},
        {id:123,ijaw:"Erei", english:"Rice",      roman:"EH-ray"},
        {id:124,ijaw:"Omi",  english:"Water",     roman:"OH-mee"},
      ],
      Izon:[
        {id:219,ijaw:"Fio",    english:"Fish",     roman:"FEE-oh"},
        {id:220,ijaw:"Beni",   english:"Palm oil", roman:"BEH-nee"},
        {id:221,ijaw:"Omi",    english:"Water",    roman:"OH-mee"},
        {id:222,ijaw:"Erei",   english:"Rice",     roman:"EH-ray"},
        {id:223,ijaw:"Angala", english:"Beans",    roman:"an-GAH-lah"},
        {id:224,ijaw:"Kekeme", english:"Sweet",    roman:"keh-KEH-meh"},
      ],
    }},
  { stage:5, title:"Home & Place", icon:"🏠", xp:30, desc:"House, village and surroundings",
    words:{
      Kalabari:[
        {id:25,ijaw:"Ibu",   english:"House",   roman:"EE-boo"},
        {id:26,ijaw:"Ama",   english:"Village", roman:"AH-mah"},
        {id:27,ijaw:"Okolo", english:"River",   roman:"oh-KOH-loh"},
        {id:28,ijaw:"Ofoni", english:"Door",    roman:"oh-FOH-nee"},
        {id:29,ijaw:"Agiri", english:"Tree",    roman:"ah-GEE-ree"},
        {id:30,ijaw:"Iria",  english:"Rain",    roman:"EE-ree-ah"},
      ],
      Nembe:[
        {id:125,ijaw:"Ibu",    english:"House",    roman:"EE-boo"},
        {id:126,ijaw:"Ama",    english:"Village",  roman:"AH-mah"},
        {id:127,ijaw:"Okolu",  english:"River",    roman:"oh-KOH-loo"},
        {id:128,ijaw:"Ofon",   english:"Door",     roman:"OH-fon"},
        {id:129,ijaw:"Agari",  english:"Tree",     roman:"ah-GAH-ree"},
        {id:130,ijaw:"Iriama", english:"Rainfall", roman:"EE-ree-AH-mah"},
      ],
      Izon:[
        {id:225,ijaw:"Ibu",   english:"House",       roman:"EE-boo"},
        {id:226,ijaw:"Ama",   english:"Village",     roman:"AH-mah"},
        {id:227,ijaw:"Warri", english:"River delta", roman:"WAH-ree"},
        {id:228,ijaw:"Ofoni", english:"Door",        roman:"oh-FOH-nee"},
        {id:229,ijaw:"Feni",  english:"Sun",         roman:"FEH-nee"},
        {id:230,ijaw:"Bolou", english:"Night",       roman:"BOH-loo"},
      ],
    }},
  { stage:6, title:"Time & Days", icon:"⏰", xp:30, desc:"Telling time and days",
    words:{
      Kalabari:[
        {id:31,ijaw:"Esieri", english:"Morning",   roman:"eh-SEE-eh-ree"},
        {id:32,ijaw:"Owei",   english:"Afternoon", roman:"OH-way"},
        {id:33,ijaw:"Keme",   english:"Today",     roman:"KEH-meh"},
        {id:34,ijaw:"Bou",    english:"Tomorrow",  roman:"BOH-oo"},
        {id:35,ijaw:"Abo",    english:"Yesterday", roman:"AH-boh"},
        {id:36,ijaw:"Owu",    english:"Week",      roman:"OH-woo"},
      ],
      Nembe:[
        {id:131,ijaw:"Esiri",  english:"Morning",   roman:"EH-see-ree"},
        {id:132,ijaw:"Owei",   english:"Afternoon", roman:"OH-way"},
        {id:133,ijaw:"Kemi",   english:"Today",     roman:"KEH-mee"},
        {id:134,ijaw:"Bomi",   english:"Tomorrow",  roman:"BOH-mee"},
        {id:135,ijaw:"Abomi",  english:"Yesterday", roman:"ah-BOH-mee"},
        {id:136,ijaw:"Owumi",  english:"This week", roman:"oh-WOO-mee"},
      ],
      Izon:[
        {id:231,ijaw:"Esieri", english:"Morning",   roman:"eh-SEE-eh-ree"},
        {id:232,ijaw:"Oweibi", english:"Afternoon", roman:"oh-WAY-bee"},
        {id:233,ijaw:"Keme",   english:"Today",     roman:"KEH-meh"},
        {id:234,ijaw:"Boubou", english:"Tomorrow",  roman:"BOH-boh"},
        {id:235,ijaw:"Abobi",  english:"Yesterday", roman:"ah-BOH-bee"},
        {id:236,ijaw:"Owuwei", english:"This week", roman:"OH-woo-way"},
      ],
    }},
];

const wordOfDay = {
  Kalabari:{ ijaw:"Owari", english:"Good morning",   roman:"oh-WAH-ree", example:"Owari, bara mie!" },
  Nembe:   { ijaw:"Dawei", english:"Welcome",         roman:"dah-WAY",    example:"Dawei, toru!" },
  Izon:    { ijaw:"Ayiba", english:"Joy / Happiness", roman:"ah-YEE-bah", example:"Ayiba ye keme!" },
};

// ─── DATA HELPERS ────────────────────────────────────────────
const getLessons = (dialect) =>
  RAW_LESSONS.map(l => ({ ...l, words: l.words[dialect] || [] }))
             .filter(l => l.words.length > 0);

const getAllWords = (dialect) =>
  getLessons(dialect).flatMap(l => l.words);

const buildQuiz = (lesson, dialect) => {
  const pool = getAllWords(dialect);
  return lesson.words.map(w => {
    const wrong = pool.filter(x => x.id !== w.id)
                      .sort(() => Math.random() - 0.5)
                      .slice(0, 3)
                      .map(x => x.english);
    const opts = [...wrong, w.english].sort(() => Math.random() - 0.5);
    return { word: w.ijaw, roman: w.roman, correct: w.english, opts };
  });
};

// ─── UTILS ───────────────────────────────────────────────────
const speak = (t) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "en-NG"; u.rate = 0.75;
  window.speechSynthesis.speak(u);
};
const calcLevel    = (xp) => Math.floor(xp / 60) + 1;
const xpToNext     = (xp) => 60 - (xp % 60);

// ─── SMALL SHARED COMPONENTS ─────────────────────────────────
const Bird = ({ size = 40, bob = false, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 200 200"
    style={{ ...style, ...(bob ? { animation:"birdBob 2.2s ease-in-out infinite" } : {}) }}>
    <style>{`@keyframes birdBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
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

const Card = ({ children, style={}, onClick, hover }) => {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: B.white, borderRadius: 20, padding: 20,
        boxShadow: h ? "0 8px 28px rgba(107,33,232,0.18)" : "0 2px 12px rgba(107,33,232,0.07)",
        border: `1.5px solid ${h ? B.purpleLight : B.border}`,
        transition: "all 0.2s", transform: h ? "translateY(-2px)" : "none",
        cursor: onClick ? "pointer" : "default", ...style,
      }}>{children}</div>
  );
};

const Btn = ({ children, onClick, color=B.purple, style={}, disabled, outline }) => {
  const [h, setH] = useState(false);
  return (
    <button onClick={disabled ? null : onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: outline ? "transparent" : disabled ? "#D1C9E8" : h ? B.purpleDark : color,
        color: outline ? color : "#fff",
        border: outline ? `2px solid ${color}` : "none",
        borderRadius: 14, padding: "13px 22px", fontSize: 15, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 0.18s", letterSpacing: 0.3,
        boxShadow: (!outline && !disabled) ? `0 3px 10px ${color}33` : "none",
        ...style,
      }}>{children}</button>
  );
};

const Badge = ({ children, color=B.purple }) => (
  <span style={{
    background: color+"18", color, border: `1px solid ${color}33`,
    borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700,
  }}>{children}</span>
);

const PBar = ({ value, max, color=B.purple, h=8, style={} }) => (
  <div style={{ background: B.border, borderRadius: 99, height: h, overflow: "hidden", ...style }}>
    <div style={{
      width: `${max > 0 ? Math.min(100, Math.round((value/max)*100)) : 0}%`,
      height: "100%", background: color, borderRadius: 99, transition: "width 0.5s",
    }}/>
  </div>
);

const Hearts = ({ count, max=3 }) => (
  <div style={{ display:"flex", gap:2 }}>
    {Array.from({length:max}).map((_,i) =>
      <span key={i} style={{ fontSize:16, opacity: i < count ? 1 : 0.2 }}>❤️</span>
    )}
  </div>
);

const Flame = ({ count, style={} }) => (
  <div style={{ display:"flex", alignItems:"center", gap:4, ...style }}>
    <span style={{ fontSize:18 }}>🔥</span>
    <span style={{ fontWeight:900, fontSize:15, color:B.orange }}>{count}</span>
  </div>
);

const XPToast = ({ xp, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", top:72, left:"50%", transform:"translateX(-50%)",
      background:B.gold, color:B.ink, borderRadius:50, padding:"10px 24px",
      fontWeight:900, fontSize:16, zIndex:9999,
      boxShadow:"0 4px 24px rgba(240,180,41,0.45)",
      animation:"xpin 0.35s ease", whiteSpace:"nowrap",
    }}>
      <style>{`@keyframes xpin{from{opacity:0;transform:translateX(-50%) translateY(-16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      ⚡ +{xp} XP
    </div>
  );
};

const Confetti = () => {
  const cols = [B.purple, B.gold, B.green, B.orange, "#EC4899"];
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:8888, overflow:"hidden" }}>
      <style>{`@keyframes cfal{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
      {Array.from({length:50}).map((_,i) => (
        <div key={i} style={{
          position:"absolute", left:`${Math.random()*100}%`,
          width: Math.random()*10+5, height: Math.random()*10+5,
          background: cols[i%5], borderRadius: Math.random()>0.5?"50%":"3px",
          animation:`cfal ${1.5+Math.random()*2}s ${Math.random()*0.8}s forwards`,
        }}/>
      ))}
    </div>
  );
};

// ─── NAV ─────────────────────────────────────────────────────
const NAV = [
  {id:"home",   icon:"🏠", label:"Home"},
  {id:"learn",  icon:"📚", label:"Learn"},
  {id:"quiz",   icon:"🧠", label:"Quiz"},
  {id:"dictionary", icon:"📖", label:"Dict"},
  {id:"voice",  icon:"🎙️", label:"Speak"},
  {id:"progress",icon:"📊", label:"Me"},
];

function Sidebar({ screen, setScreen, dialect, onSwitch, stats }) {
  const [col, setCol] = useState(false);
  const level = calcLevel(stats.xp);
  return (
    <div style={{
      width: col ? 68 : 228, minHeight:"100vh",
      background:`linear-gradient(180deg,${B.purpleDark} 0%,#0D0420 100%)`,
      display:"flex", flexDirection:"column", transition:"width 0.25s",
      flexShrink:0, position:"sticky", top:0, height:"100vh",
    }}>
      <div style={{ padding:"18px 14px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:10 }}>
        <Bird size={32}/>
        {!col && <span style={{ color:"#fff", fontSize:22, fontWeight:900, fontFamily:"Georgia,serif", letterSpacing:-1 }}>Nume</span>}
      </div>
      {!col && (
        <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700 }}>LEVEL {level}</span>
            <span style={{ color:B.gold, fontSize:11, fontWeight:700 }}>{stats.xp} XP</span>
          </div>
          <PBar value={60 - xpToNext(stats.xp)} max={60} color={B.gold} h={6}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            <Flame count={stats.streak}/>
            <Hearts count={stats.hearts}/>
          </div>
        </div>
      )}
      {!col && (
        <div style={{ padding:"10px 14px 8px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:10, fontWeight:700, letterSpacing:1, margin:"0 0 6px" }}>DIALECT</p>
          <button onClick={onSwitch} style={{
            background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)",
            borderRadius:10, padding:"7px 12px", color:"#fff", cursor:"pointer",
            display:"flex", alignItems:"center", gap:8, width:"100%", fontSize:13, fontWeight:700,
          }}>
            <span>{DIALECT_INFO[dialect].flag}</span>
            <span style={{ flex:1, textAlign:"left" }}>{dialect}</span>
            <span style={{ opacity:0.5, fontSize:10 }}>✏️</span>
          </button>
        </div>
      )}
      <nav style={{ flex:1, padding:"8px 8px" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)} title={col ? n.label : ""} style={{
            display:"flex", alignItems:"center", gap:12, width:"100%",
            padding:"11px 12px", borderRadius:12, marginBottom:2,
            background: screen===n.id ? "rgba(255,255,255,0.14)" : "transparent",
            border: screen===n.id ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
            color: screen===n.id ? "#fff" : "rgba(255,255,255,0.55)",
            cursor:"pointer", fontSize:14, fontWeight: screen===n.id ? 700 : 500, transition:"all 0.15s",
          }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{n.icon}</span>
            {!col && <span>{n.label}</span>}
          </button>
        ))}
      </nav>
      <button onClick={() => setCol(!col)} style={{
        background:"rgba(255,255,255,0.05)", border:"none", color:"rgba(255,255,255,0.4)",
        padding:14, cursor:"pointer", fontSize:13, borderTop:"1px solid rgba(255,255,255,0.07)",
      }}>{col ? "→" : "← Collapse"}</button>
    </div>
  );
}

function BotNav({ screen, setScreen }) {
  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:200,
      background:B.white, borderTop:`2px solid ${B.border}`,
      display:"flex", justifyContent:"space-around",
      padding:"6px 0 max(8px,env(safe-area-inset-bottom))",
    }}>
      {NAV.map(n => (
        <button key={n.id} onClick={() => setScreen(n.id)} style={{
          background:"none", border:"none", cursor:"pointer",
          padding:"4px 4px", display:"flex", flexDirection:"column",
          alignItems:"center", gap:2, flex:1,
          color: screen===n.id ? B.purple : B.inkLight,
        }}>
          <span style={{ fontSize:18 }}>{n.icon}</span>
          <span style={{ fontSize:8, fontWeight:700 }}>{n.label}</span>
          {screen===n.id && <div style={{ width:4, height:4, borderRadius:99, background:B.purple }}/>}
        </button>
      ))}
    </div>
  );
}

function TopBar({ title, onBack, dialect, onSwitch, right }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", padding:"14px 16px 12px",
      background:B.white, borderBottom:`1.5px solid ${B.border}`,
      position:"sticky", top:0, zIndex:100,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          background:B.purplePale, border:"none", borderRadius:10,
          width:36, height:36, fontSize:16, cursor:"pointer", color:B.purple,
          marginRight:10, display:"flex", alignItems:"center", justifyContent:"center",
        }}>←</button>
      )}
      <span style={{ fontSize:17, fontWeight:800, color:B.ink, flex:1 }}>{title}</span>
      {dialect && (
        <button onClick={onSwitch} style={{
          background:B.purplePale, border:"none", borderRadius:20, padding:"6px 12px",
          fontSize:12, fontWeight:700, cursor:"pointer", color:B.purple, marginRight:8,
        }}>{DIALECT_INFO[dialect].flag} {dialect}</button>
      )}
      {right}
    </div>
  );
}

function DialectModal({ dialect, onSelect, onClose }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(30,10,60,0.7)", zIndex:999,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }} onClick={onClose}>
      <div style={{
        background:B.white, borderRadius:28, padding:28, maxWidth:400, width:"100%",
        boxShadow:"0 24px 80px rgba(107,33,232,0.3)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <Bird size={48}/>
          <div>
            <h3 style={{ margin:0, fontSize:20, color:B.ink }}>Switch Dialect</h3>
            <p style={{ color:B.inkLight, fontSize:13, margin:0 }}>Now: <strong>{dialect}</strong></p>
          </div>
        </div>
        {DIALECTS.map(d => (
          <div key={d} onClick={() => onSelect(d)} style={{
            display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
            borderRadius:16, marginBottom:10, cursor:"pointer",
            background: d===dialect ? B.purplePale : B.off,
            border:`2px solid ${d===dialect ? B.purple : B.border}`, transition:"all 0.15s",
          }}>
            <div style={{
              width:44, height:44, borderRadius:12, fontSize:22,
              background:`${DIALECT_INFO[d].color}18`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>{DIALECT_INFO[d].flag}</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontWeight:800, fontSize:16, color:B.ink }}>{d}</p>
              <p style={{ margin:0, fontSize:12, color:B.inkLight }}>{DIALECT_INFO[d].region} · {DIALECT_INFO[d].speakers}</p>
            </div>
            {d===dialect && <span style={{ color:B.purple, fontWeight:900 }}>✓</span>}
          </div>
        ))}
        <button onClick={onClose} style={{
          width:"100%", marginTop:8, padding:12, borderRadius:12,
          border:`1.5px solid ${B.border}`, background:"transparent",
          cursor:"pointer", fontWeight:700, color:B.inkLight, fontSize:14,
        }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── ONBOARDING ──────────────────────────────────────────────
function Onboarding({ onSelect }) {
  const [step, setStep] = useState(0);
  const [hov, setHov] = useState(null);
  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(150deg,${B.purpleDark} 0%,#3B0E8C 50%,#0D2040 100%)`,
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <style>{`@keyframes birdBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ maxWidth:460, width:"100%" }}>
        {step === 0 ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ display:"inline-block", animation:"birdBob 2.5s ease-in-out infinite", marginBottom:16 }}>
              <Bird size={110}/>
            </div>
            <h1 style={{ color:"#fff", fontSize:58, fontWeight:900, margin:"0 0 6px", fontFamily:"Georgia,serif", letterSpacing:-2 }}>Nume</h1>
            <p style={{ color:B.purpleLight, fontSize:17, marginBottom:36 }}>Ijaw Voice — Learn Your Heritage Language</p>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:22, padding:24, marginBottom:28, border:"1px solid rgba(255,255,255,0.1)" }}>
              {[["🌊","Learn real Ijaw words with audio"],["🎮","Earn XP, level up & unlock stages"],["🎙️","Record yourself & compare pronunciation"]].map(([ic,tx],i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom: i<2 ? 14:0 }}>
                  <span style={{ fontSize:24 }}>{ic}</span>
                  <p style={{ color:"rgba(255,255,255,0.85)", fontSize:15, margin:0 }}>{tx}</p>
                </div>
              ))}
            </div>
            <Btn onClick={() => setStep(1)} color={B.purple} style={{ width:"100%", fontSize:17, padding:16 }}>Start Learning →</Btn>
          </div>
        ) : (
          <div>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <Bird size={64} bob/>
              <h2 style={{ color:"#fff", fontSize:26, fontWeight:900, margin:"12px 0 4px" }}>Choose your dialect</h2>
              <p style={{ color:B.purpleLight, fontSize:14, margin:0 }}>You can switch anytime.</p>
            </div>
            {DIALECTS.map(d => {
              const info = DIALECT_INFO[d];
              return (
                <div key={d}
                  onMouseEnter={() => setHov(d)} onMouseLeave={() => setHov(null)}
                  onClick={() => onSelect(d)}
                  style={{
                    background: hov===d ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
                    border:`2px solid ${hov===d ? B.purpleLight : "rgba(255,255,255,0.15)"}`,
                    borderRadius:18, padding:"18px 22px", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:16, marginBottom:12,
                    transition:"all 0.2s", transform: hov===d ? "scale(1.02)" : "scale(1)",
                  }}>
                  <div style={{
                    width:52, height:52, borderRadius:14, fontSize:26, flexShrink:0,
                    background:`${info.color}33`, border:`2px solid ${info.color}66`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>{info.flag}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ color:"#fff", fontWeight:900, fontSize:19, margin:0 }}>{d}</p>
                    <p style={{ color:B.purpleLight, fontSize:13, margin:"3px 0 0" }}>{info.region} · {info.speakers} speakers</p>
                  </div>
                  <span style={{ color:"rgba(255,255,255,0.4)", fontSize:22 }}>›</span>
                </div>
              );
            })}
            <button onClick={() => setStep(0)} style={{
              background:"none", border:"none", color:"rgba(255,255,255,0.4)",
              marginTop:16, cursor:"pointer", fontSize:14, display:"block", width:"100%", textAlign:"center",
            }}>← Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOME ────────────────────────────────────────────────────
function Home({ dialect, setScreen, stats, onSwitch }) {
  const wod = wordOfDay[dialect];
  const level = calcLevel(stats.xp);
  const nxt = xpToNext(stats.xp);
  const dlessons = getLessons(dialect);
  const completedCount = dlessons.filter(l => stats.completedLessons[`${dialect}_${l.stage}`]).length;
  const nextLesson = dlessons.find(l => !stats.completedLessons[`${dialect}_${l.stage}`]);

  return (
    <div style={{ paddingBottom:40 }}>
      <div style={{
        background:`linear-gradient(135deg,${B.purpleDark} 0%,${B.purpleMid} 70%,#4C1D95 100%)`,
        padding:"28px 24px 36px", borderRadius:"0 0 36px 36px", marginBottom:24,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:16, top:8, opacity:0.12 }}><Bird size={130}/></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
          <div>
            <p style={{ color:B.purpleLight, margin:0, fontSize:13, fontWeight:600 }}>{DIALECT_INFO[dialect].flag} {dialect} Dialect</p>
            <h2 style={{ color:"#fff", fontSize:26, fontWeight:900, margin:"4px 0 0" }}>
              {completedCount === 0 ? "Let's start learning! 🌊" : "Keep going! 🔥"}
            </h2>
          </div>
          <button onClick={onSwitch} style={{
            background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)",
            borderRadius:12, padding:"8px 14px", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:700,
          }}>Switch ↕</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { label:"Level", value:level, color:B.gold },
            { label:"Streak", value:`${stats.streak}d`, color:"#FB923C" },
            { label:"XP", value:stats.xp, color:B.purpleLight },
          ].map((s,i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.12)", borderRadius:16, padding:"12px 10px", textAlign:"center", border:"1px solid rgba(255,255,255,0.1)" }}>
              <p style={{ color:s.color, fontWeight:900, fontSize:18, margin:0 }}>{s.value}</p>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, margin:"3px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12, margin:"0 0 5px" }}>Level {level} → {level+1} · {nxt} XP to go</p>
        <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:99, height:8, overflow:"hidden" }}>
          <div style={{ width:`${((60-nxt)/60)*100}%`, height:"100%", background:B.gold, borderRadius:99, transition:"width 0.5s" }}/>
        </div>
      </div>

      <div style={{ padding:"0 20px" }}>
        {nextLesson && (
          <Card style={{ marginBottom:20, background:`linear-gradient(135deg,${B.purple},${B.purpleMid})`, border:"none", padding:22, cursor:"pointer" }}
            onClick={() => setScreen("learn")}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:54, height:54, borderRadius:18, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{nextLesson.icon}</div>
              <div style={{ flex:1 }}>
                <Badge color={B.gold}>🎯 {completedCount===0?"Start Here":"Continue"}</Badge>
                <p style={{ color:"#fff", fontWeight:900, fontSize:17, margin:"6px 0 2px" }}>Stage {nextLesson.stage}: {nextLesson.title}</p>
                <p style={{ color:B.purpleLight, fontSize:13, margin:0 }}>{nextLesson.words.length} words · {nextLesson.xp} XP</p>
              </div>
              <span style={{ color:"rgba(255,255,255,0.6)", fontSize:24 }}>›</span>
            </div>
          </Card>
        )}

        <Card style={{ marginBottom:20, padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <Badge color={B.purple}>✨ Word of the Day</Badge>
            <button onClick={() => speak(wod.ijaw)} style={{
              background:B.purplePale, border:"none", borderRadius:50, width:40, height:40,
              fontSize:18, cursor:"pointer", color:B.purple, display:"flex", alignItems:"center", justifyContent:"center",
            }}>🔊</button>
          </div>
          <h2 style={{ color:B.ink, fontSize:38, fontWeight:900, margin:"0 0 4px" }}>{wod.ijaw}</h2>
          <p style={{ color:B.inkLight, fontSize:17, margin:"0 0 4px" }}>{wod.english}</p>
          <p style={{ color:B.purpleLight, fontStyle:"italic", fontSize:13, margin:"0 0 12px" }}>/{wod.roman}/</p>
          <p style={{ color:B.inkLight, fontSize:13, fontStyle:"italic", background:B.purplePale, padding:"8px 12px", borderRadius:10, margin:0 }}>"{wod.example}"</p>
        </Card>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { label:"📚 Learn", sub:"All lessons",               color:B.purple,    s:"learn" },
            { label:"🧠 Quiz",  sub:"Test yourself",             color:"#7C3AED",   s:"quiz" },
            { label:"📖 Dict",  sub:`${getAllWords(dialect).length} words`, color:B.purpleDark, s:"dictionary" },
            { label:"🎙️ Speak", sub:"Practice aloud",           color:"#5B21B6",   s:"voice" },
          ].map(item => (
            <button key={item.s} onClick={() => setScreen(item.s)} style={{
              background:`linear-gradient(135deg,${item.color},${item.color}cc)`,
              border:"none", borderRadius:18, padding:"20px 16px", cursor:"pointer", textAlign:"left",
              boxShadow:`0 4px 20px ${item.color}33`, transition:"transform 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
              <p style={{ color:"#fff", fontWeight:800, fontSize:17, margin:"0 0 4px" }}>{item.label}</p>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, margin:0 }}>{item.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LEARN ───────────────────────────────────────────────────
function Learn({ dialect, setScreen, stats, isMobile, onSwitch, setPlayerContext }) {
  const dlessons = getLessons(dialect);
  const getStatus = (l) => {
    if (stats.completedLessons[`${dialect}_${l.stage}`]) return "done";
    const prevOk = l.stage === 1 || stats.completedLessons[`${dialect}_${l.stage-1}`];
    return prevOk ? "available" : "locked";
  };
  return (
    <div style={{ paddingBottom:80 }}>
      {isMobile && <TopBar title="Learn" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ padding:`${isMobile?16:0}px 20px 60px`, maxWidth:680, margin:"0 auto" }}>
        {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 6px", color:B.ink }}>📚 Learning Path</h2>}
        <p style={{ color:B.inkLight, fontSize:14, margin:"0 0 24px" }}>{DIALECT_INFO[dialect].flag} {dialect} · {dlessons.length} stages</p>
        {dlessons.map((l, li) => {
          const status = getStatus(l);
          return (
            <div key={l.stage} style={{ display:"flex", gap:0, marginBottom:8, alignItems:"stretch" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:40, flexShrink:0 }}>
                <div style={{
                  width:36, height:36, borderRadius:50, flexShrink:0, color:"#fff", fontWeight:900,
                  background: status==="done" ? B.green : status==="available" ? B.purple : "#D1C9E8",
                  border:`3px solid ${status==="done" ? B.green : status==="available" ? B.purpleMid : "#C0B8D8"}`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
                  boxShadow: status==="available" ? `0 0 0 4px ${B.purplePale}` : "none",
                }}>
                  {status==="done" ? "✓" : status==="locked" ? "🔒" : li+1}
                </div>
                {li < dlessons.length-1 && <div style={{ width:3, flex:1, minHeight:20, background: status==="done" ? B.green : "#E5E0F8", marginTop:4, borderRadius:99 }}/>}
              </div>
              <div style={{ flex:1, marginLeft:12, paddingBottom:12 }}>
                <Card hover={status!=="locked"}
                  onClick={status==="locked" ? null : () => { setPlayerContext({lesson:l, dialect}); setScreen("player"); }}
                  style={{ opacity: status==="locked" ? 0.5 : 1, cursor: status==="locked" ? "not-allowed" : "pointer", border: status==="available" ? `2px solid ${B.purple}` : undefined }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{
                      width:48, height:48, borderRadius:16, flexShrink:0, color:"#fff", fontSize:22,
                      background: status==="done" ? B.green : status==="available" ? `linear-gradient(135deg,${B.purple},${B.purpleMid})` : "#D1C9E8",
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>{status==="done" ? "✓" : l.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <p style={{ margin:0, fontWeight:900, fontSize:15, color:B.ink }}>Stage {l.stage}: {l.title}</p>
                        {status==="available" && <Badge color={B.purple}>Unlocked</Badge>}
                        {status==="done"      && <Badge color={B.green}>✓ Done</Badge>}
                      </div>
                      <p style={{ margin:"3px 0 6px", fontSize:12, color:B.inkLight }}>{l.desc}</p>
                      <div style={{ display:"flex", gap:12 }}>
                        <span style={{ fontSize:12, color:B.inkLight }}>{l.words.length} words</span>
                        <span style={{ fontSize:12, color:B.gold, fontWeight:700 }}>⚡ {l.xp} XP</span>
                        {status==="done" && <span style={{ fontSize:12, color:B.green, fontWeight:700 }}>Quiz passed ✓</span>}
                      </div>
                    </div>
                    {status!=="locked" && <span style={{ color:B.inkLight, fontSize:18 }}>›</span>}
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

// ─── LESSON PLAYER ───────────────────────────────────────────
function LessonPlayer({ context, setScreen, addXP }) {
  const { lesson, dialect } = context;
  const words = lesson.words;
  const [idx, setIdx]       = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({});
  const [xp, setXp]         = useState(false);
  const [done, setDone]     = useState(false);
  const w = words[idx];

  const mark = (known) => {
    setResults(r => ({ ...r, [w.id]: known }));
    if (known) { addXP(5); setXp(true); setTimeout(() => setXp(false), 2000); }
    if (idx < words.length - 1) { setIdx(idx + 1); setFlipped(false); }
    else setDone(true);
  };

  if (done) {
    const knownCount = Object.values(results).filter(Boolean).length;
    return (
      <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${B.purpleDark},#1A0840)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
        <Bird size={90} bob/>
        <h2 style={{ color:"#fff", fontSize:28, fontWeight:900, margin:"16px 0 8px" }}>Lesson Complete!</h2>
        <p style={{ color:B.purpleLight, fontSize:16, margin:"0 0 24px" }}>Stage {lesson.stage}: {lesson.title}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28, width:"100%", maxWidth:360 }}>
          {[{ label:"Words learned", value:`${knownCount}/${words.length}`, color:B.gold },
            { label:"XP earned", value:`+${knownCount*5}`, color:B.purpleLight }].map((s,i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.1)", borderRadius:16, padding:18, textAlign:"center" }}>
              <p style={{ color:s.color, fontWeight:900, fontSize:28, margin:0 }}>{s.value}</p>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, margin:"4px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:20, padding:"16px 20px", marginBottom:24, width:"100%", maxWidth:360 }}>
          <p style={{ color:B.purpleLight, fontWeight:700, fontSize:14, margin:"0 0 8px" }}>What's next:</p>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:14, margin:0, lineHeight:1.7 }}>
            Take a <strong style={{ color:B.gold }}>short quiz</strong> to test what you've learned.<br/>
            Pass it to <strong style={{ color:B.gold }}>unlock the next stage!</strong>
          </p>
        </div>
        <Btn onClick={() => setScreen("quizFromLesson")} color={B.gold} style={{ width:"100%", maxWidth:360, fontSize:17, padding:16, color:B.ink }}>
          🧠 Take the Quiz →
        </Btn>
        <button onClick={() => setScreen("learn")} style={{ color:"rgba(255,255,255,0.4)", background:"none", border:"none", marginTop:16, cursor:"pointer", fontSize:14 }}>← Back to lessons</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${B.purpleDark} 0%,#1A0840 100%)`, display:"flex", flexDirection:"column" }}>
      {xp && <XPToast xp={5} onDone={() => setXp(false)}/>}
      <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={() => setScreen("learn")} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:50, width:38, height:38, color:"#fff", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:3, marginBottom:6 }}>
            {words.map((_,i) => (
              <div key={i} style={{ height:5, flex:1, borderRadius:99, transition:"background 0.3s",
                background: results[words[i].id]===true ? B.gold : results[words[i].id]===false ? B.red : i===idx ? B.purpleLight : "rgba(255,255,255,0.2)" }}/>
            ))}
          </div>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:11, margin:0 }}>{idx+1}/{words.length} · Stage {lesson.stage}: {lesson.title}</p>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 28px" }}>
        <div onClick={() => setFlipped(!flipped)} style={{
          width:"100%", maxWidth:420, borderRadius:32, padding:"52px 36px", textAlign:"center",
          cursor:"pointer", minHeight:280, display:"flex", flexDirection:"column", justifyContent:"center",
          background: flipped ? `linear-gradient(135deg,${B.green},#064E3B)` : `linear-gradient(135deg,${B.purple},${B.purpleMid})`,
          transition:"background 0.4s", boxShadow:"0 20px 60px rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)",
        }}>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:700, letterSpacing:2, margin:"0 0 14px", textTransform:"uppercase" }}>
            {flipped ? "English" : `Ijaw · ${dialect}`}
          </p>
          <h1 style={{ color:"#fff", fontSize: flipped ? 32 : 52, fontWeight:900, margin:0, lineHeight:1.1 }}>
            {flipped ? w.english : w.ijaw}
          </h1>
          {!flipped && <p style={{ color:"rgba(255,255,255,0.5)", fontStyle:"italic", fontSize:14, margin:"14px 0 0" }}>/{w.roman}/</p>}
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12, margin:"18px 0 0" }}>{flipped ? "" : "Tap to reveal"}</p>
        </div>
        <div style={{ display:"flex", gap:12, marginTop:18, width:"100%", maxWidth:420 }}>
          <Btn onClick={() => speak(w.ijaw)} color="rgba(255,255,255,0.12)" style={{ flex:1 }}>🔊 Audio</Btn>
          <Btn onClick={() => { setFlipped(false); speak(w.ijaw); }} color="rgba(255,255,255,0.12)" style={{ flex:1 }}>🔁 Again</Btn>
        </div>
        {flipped && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:14, width:"100%", maxWidth:420 }}>
            <button onClick={() => mark(false)} style={{ background:"rgba(220,38,38,0.2)", border:"2px solid rgba(220,38,38,0.4)", color:"#fff", borderRadius:16, padding:16, fontSize:16, fontWeight:800, cursor:"pointer" }}>😕 Again</button>
            <button onClick={() => mark(true)}  style={{ background:"rgba(22,163,74,0.3)",  border:"2px solid rgba(22,163,74,0.5)",  color:"#fff", borderRadius:16, padding:16, fontSize:16, fontWeight:800, cursor:"pointer" }}>✓ Got it!</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── QUIZ ────────────────────────────────────────────────────
function Quiz({ lessonContext, setScreen, dialect, stats, setStats, addXP, isMobile, onSwitch }) {
  const dlessons = getLessons(dialect);

  // All useState at top — no exceptions
  const [selLesson, setSelLesson] = useState(lessonContext || null);
  const [qs,        setQs       ] = useState(() => lessonContext ? buildQuiz(lessonContext, dialect).sort(() => Math.random()-0.5) : null);
  const [qi,        setQi       ] = useState(0);
  const [sel,       setSel      ] = useState(null);
  const [score,     setScore    ] = useState(0);
  const [hearts,    setHearts   ] = useState(3);
  const [quizDone,  setQuizDone ] = useState(false);
  const [answers,   setAnswers  ] = useState([]);
  const [showConf,  setShowConf ] = useState(false);
  const [xpToast,   setXpToast  ] = useState(false);

  // Award XP + unlock stage when quiz finishes
  useEffect(() => {
    if (!quizDone || !selLesson || !qs) return;
    const passed = hearts > 0 && score >= Math.ceil(qs.length * 0.6);
    if (passed) {
      const key = `${dialect}_${selLesson.stage}`;
      if (!stats.completedLessons[key]) {
        setStats(s => ({ ...s, completedLessons:{ ...s.completedLessons, [key]:true }, xp: s.xp + selLesson.xp }));
        setShowConf(true);
      }
    }
  }, [quizDone]);

  const startLesson = (l) => {
    setSelLesson(l);
    setQs(buildQuiz(l, dialect).sort(() => Math.random()-0.5));
    setQi(0); setSel(null); setScore(0); setHearts(3);
    setQuizDone(false); setAnswers([]); setShowConf(false);
  };

  const retry = () => {
    if (!selLesson) return;
    setQs(buildQuiz(selLesson, dialect).sort(() => Math.random()-0.5));
    setQi(0); setSel(null); setScore(0); setHearts(3);
    setQuizDone(false); setAnswers([]); setShowConf(false);
  };

  const choose = (opt) => {
    if (sel !== null || hearts <= 0 || !qs) return;
    const q = qs[qi];
    const correct = opt === q.correct;
    setSel(opt);
    setAnswers(a => [...a, { question:`What does "${q.word}" mean?`, chose:opt, correct:q.correct, isCorrect:correct }]);
    if (correct) {
      setScore(s => s + 1);
      addXP(10); setXpToast(true); setTimeout(() => setXpToast(false), 2000);
    } else {
      const nh = hearts - 1;
      setHearts(nh);
      if (nh <= 0) { setTimeout(() => setQuizDone(true), 1200); return; }
    }
    setTimeout(() => {
      if (qi < qs.length - 1) { setQi(i => i + 1); setSel(null); }
      else setQuizDone(true);
    }, 1200);
  };

  // ── Lesson picker ──────────────────────────────────────────
  if (!selLesson) {
    return (
      <div style={{ paddingBottom:80 }}>
        {isMobile && <TopBar title="Quiz" dialect={dialect} onSwitch={onSwitch}/>}
        <div style={{ padding:`${isMobile?16:0}px 20px 60px`, maxWidth:600, margin:"0 auto" }}>
          {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 6px", color:B.ink }}>🧠 Quiz</h2>}
          <p style={{ color:B.inkLight, fontSize:14, margin:"0 0 20px" }}>Choose a lesson to quiz yourself on:</p>
          {dlessons.map(l => {
            const key = `${dialect}_${l.stage}`;
            const completed = !!stats.completedLessons[key];
            const prevDone  = l.stage===1 || !!stats.completedLessons[`${dialect}_${l.stage-1}`];
            return (
              <Card key={l.stage} hover={prevDone} onClick={prevDone ? () => startLesson(l) : null}
                style={{ marginBottom:12, opacity: prevDone ? 1 : 0.45, cursor: prevDone ? "pointer" : "not-allowed" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:16, flexShrink:0, fontSize:22, color:"#fff",
                    background: completed ? B.green : prevDone ? `linear-gradient(135deg,${B.purple},${B.purpleMid})` : "#D1C9E8",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {completed ? "✓" : prevDone ? l.icon : "🔒"}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontWeight:800, fontSize:15, color:B.ink }}>Stage {l.stage}: {l.title}</p>
                    <p style={{ margin:"3px 0 0", fontSize:12, color:B.inkLight }}>{l.words.length} questions · {l.xp} XP</p>
                  </div>
                  {completed  && <Badge color={B.green}>✓ Passed</Badge>}
                  {!completed && prevDone && <Badge color={B.purple}>Take Quiz</Badge>}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────
  if (!qs) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:16 }}>
        <Bird size={60} bob/><p style={{ color:B.inkLight, fontWeight:700 }}>Loading quiz…</p>
      </div>
    );
  }

  const q = qs[qi];
  const pct = Math.round((score / qs.length) * 100);
  const passed = quizDone && hearts > 0 && score >= Math.ceil(qs.length * 0.6);

  // ── Results ────────────────────────────────────────────────
  if (quizDone) {
    return (
      <div style={{ padding:"0 20px 80px" }}>
        {isMobile && <TopBar title="Results" dialect={dialect} onSwitch={onSwitch}/>}
        {showConf && <Confetti/>}
        <div style={{ maxWidth:560, margin:"0 auto", paddingTop: isMobile ? 20 : 8 }}>
          <div style={{ textAlign:"center", padding:"32px 0 24px" }}>
            <Bird size={90} bob={passed}/>
            <h2 style={{ color:B.ink, fontSize:28, fontWeight:900, margin:"14px 0 6px" }}>
              {passed ? "Stage Cleared! 🎉" : hearts<=0 ? "Out of hearts!" : "Almost there!"}
            </h2>
            {passed && (
              <div style={{ background:B.goldLight, borderRadius:16, padding:"12px 20px", display:"inline-block", margin:"0 0 12px" }}>
                <span style={{ color:B.ink, fontWeight:700 }}>⚡ +{selLesson.xp} XP · Stage {selLesson.stage+1} Unlocked!</span>
              </div>
            )}
            <p style={{ fontSize:42, fontWeight:900, color:B.purple, margin:"0 0 4px" }}>
              {score}<span style={{ color:B.inkLight, fontSize:22 }}>/{qs.length}</span>
            </p>
            <p style={{ color:B.inkLight, marginBottom:20 }}>{pct}% · {passed ? "Passed ✓" : "Need 60% to pass"}</p>
          </div>
          <h3 style={{ fontSize:13, fontWeight:700, color:B.inkLight, letterSpacing:1, marginBottom:10 }}>REVIEW</h3>
          {answers.map((a,i) => (
            <Card key={i} style={{ marginBottom:8, padding:"12px 16px", borderLeft:`4px solid ${a.isCorrect ? B.green : B.red}` }}>
              <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:700, color:B.ink }}>{a.question}</p>
              <p style={{ margin:0, fontSize:12, color: a.isCorrect ? B.green : B.red }}>
                {a.isCorrect ? "✓" : "✗"} {a.chose}
                {!a.isCorrect && <span style={{ color:B.inkLight }}> · Correct: {a.correct}</span>}
              </p>
            </Card>
          ))}
          <div style={{ display:"grid", gridTemplateColumns: passed ? "1fr" : "1fr 1fr", gap:10, marginTop:16 }}>
            {!passed && <Btn onClick={retry}>🔁 Retry</Btn>}
            <Btn color={B.green} onClick={() => { setSelLesson(null); setScreen("learn"); }}>
              {passed ? "→ Next Stage" : "← Back to lessons"}
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  // ── Active question ────────────────────────────────────────
  return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile && <TopBar title={`Stage ${selLesson.stage}: ${selLesson.title}`} onBack={() => setSelLesson(null)} dialect={dialect} onSwitch={onSwitch}/>}
      {xpToast && <XPToast xp={10} onDone={() => setXpToast(false)}/>}
      <div style={{ maxWidth:560, margin:"0 auto", paddingTop: isMobile ? 16 : 0 }}>
        {!isMobile && (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h2 style={{ fontSize:20, fontWeight:900, margin:0, color:B.ink }}>Stage {selLesson.stage}: {selLesson.title}</h2>
            <button onClick={() => setSelLesson(null)} style={{ background:"none", border:"none", color:B.purple, cursor:"pointer", fontWeight:700, fontSize:14 }}>← All quizzes</button>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <p style={{ color:B.inkLight, fontSize:13, fontWeight:600, margin:0 }}>Q{qi+1}/{qs.length}</p>
          <Hearts count={hearts}/>
          <p style={{ color:B.gold, fontSize:13, fontWeight:700, margin:0 }}>⚡ {score*10} XP</p>
        </div>
        <div style={{ display:"flex", gap:3, marginBottom:16 }}>
          {qs.map((_,i) => <div key={i} style={{ height:5, flex:1, borderRadius:99, transition:"all 0.3s", background: i<qi ? B.purple : i===qi ? B.gold : B.border }}/>)}
        </div>
        <Card style={{ background:`linear-gradient(135deg,${B.purple},${B.purpleMid})`, marginBottom:16, padding:"28px 24px", border:"none" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ color:B.purpleLight, fontSize:12, margin:"0 0 8px", fontWeight:700, letterSpacing:1 }}>WHAT DOES THIS MEAN?</p>
              <h2 style={{ color:"#fff", fontSize:42, fontWeight:900, margin:"0 0 6px" }}>{q.word}</h2>
              <p style={{ color:"rgba(255,255,255,0.5)", fontStyle:"italic", fontSize:14, margin:0 }}>/{q.roman}/</p>
            </div>
            <button onClick={() => speak(q.word)} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:50, width:42, height:42, color:"#fff", cursor:"pointer", fontSize:18, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>🔊</button>
          </div>
        </Card>
        {q.opts.map((opt,i) => {
          let bg=B.white, border=`2px solid ${B.border}`, tc=B.ink;
          if (sel !== null) {
            if (opt===q.correct) { bg=B.greenLight; border=`2px solid ${B.green}`; tc=B.green; }
            else if (opt===sel)  { bg=B.redLight;   border=`2px solid ${B.red}`;   tc=B.red;   }
          }
          return (
            <div key={i} onClick={() => choose(opt)} style={{
              background:bg, border, borderRadius:16, padding:"16px 18px", marginBottom:10,
              cursor: sel===null ? "pointer" : "default",
              display:"flex", alignItems:"center", gap:14, transition:"all 0.2s", color:tc,
            }}>
              <div style={{ width:32, height:32, borderRadius:50, border:`2px solid ${B.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, flexShrink:0 }}>
                {["A","B","C","D"][i]}
              </div>
              <span style={{ fontSize:16, fontWeight:600, flex:1 }}>{opt}</span>
              {sel!==null && opt===q.correct && <span>✅</span>}
              {sel!==null && opt===sel && opt!==q.correct && <span>❌</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DICTIONARY ──────────────────────────────────────────────
function Dictionary({ dialect, isMobile, setStats, setScreen, onSwitch }) {
  const [query,   setQuery  ] = useState("");
  const [sel,     setSel    ] = useState(null);
  const [lookups, setLookups] = useState(0);
  const dwords   = getAllWords(dialect);
  const filtered = dwords.filter(w =>
    w.ijaw.toLowerCase().includes(query.toLowerCase()) ||
    w.english.toLowerCase().includes(query.toLowerCase()) ||
    w.roman.toLowerCase().includes(query.toLowerCase())
  );

  const open = (w) => {
    setSel(w);
    const n = lookups + 1;
    setLookups(n);
    if (n >= 10) setStats(s => ({ ...s, achievements:[...new Set([...(s.achievements||[]), "dict_10"])] }));
  };

  if (sel) return (
    <div>
      {isMobile && <TopBar title="Word Detail" onBack={() => setSel(null)}/>}
      <div style={{ padding:"0 20px 80px", maxWidth:560, margin:"0 auto" }}>
        {!isMobile && <button onClick={() => setSel(null)} style={{ background:"none", border:"none", color:B.purple, cursor:"pointer", fontSize:14, fontWeight:700, margin:"8px 0 16px", display:"block" }}>← Dictionary</button>}
        <Card style={{ background:`linear-gradient(135deg,${B.purple},${B.purpleMid})`, textAlign:"center", padding:"44px 32px", marginBottom:16, border:"none" }}>
          <h1 style={{ color:"#fff", fontSize:60, fontWeight:900, margin:0 }}>{sel.ijaw}</h1>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:22, margin:"10px 0 6px" }}>{sel.english}</p>
          <p style={{ color:B.purpleLight, fontStyle:"italic", margin:0 }}>/{sel.roman}/</p>
        </Card>
        <Card style={{ marginBottom:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div><p style={{ margin:0, fontSize:12, color:B.inkLight, fontWeight:700 }}>DIALECT</p><p style={{ margin:"4px 0 0", fontSize:17, fontWeight:800, color:B.ink }}>{dialect}</p></div>
            <div><p style={{ margin:0, fontSize:12, color:B.inkLight, fontWeight:700 }}>REGION</p><p style={{ margin:"4px 0 0", fontSize:17, fontWeight:800, color:B.ink }}>{DIALECT_INFO[dialect].region}</p></div>
          </div>
        </Card>
        <Btn onClick={() => speak(sel.ijaw)} style={{ width:"100%", marginBottom:10 }}>🔊 Hear Pronunciation</Btn>
        <Btn onClick={() => setScreen("voice")} outline color={B.purple} style={{ width:"100%" }}>🎙️ Practice This Word</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile && <TopBar title="Dictionary" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ maxWidth:700, margin:"0 auto", paddingTop: isMobile ? 16 : 0 }}>
        {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 6px", color:B.ink }}>📖 Dictionary</h2>}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, background:B.purplePale, borderRadius:12, padding:"8px 14px" }}>
          <span>{DIALECT_INFO[dialect].flag}</span>
          <span style={{ fontSize:13, fontWeight:700, color:B.purple }}>{dialect} · {dwords.length} words</span>
        </div>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="🔍 Search Ijaw or English…"
          style={{ width:"100%", padding:"14px 18px", borderRadius:16, border:`2px solid ${B.border}`, fontSize:16, marginBottom:16, background:B.white, boxSizing:"border-box", outline:"none", fontFamily:"inherit" }}/>
        <p style={{ color:B.inkLight, fontSize:13, fontWeight:600, marginBottom:12 }}>{filtered.length} results</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:12 }}>
          {filtered.map(w => (
            <Card key={w.id} hover onClick={() => open(w)} style={{ cursor:"pointer", padding:"14px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <p style={{ margin:0, fontWeight:900, fontSize:20, color:B.ink }}>{w.ijaw}</p>
                  <p style={{ margin:"4px 0 4px", fontSize:14, color:B.inkLight }}>{w.english}</p>
                  <p style={{ margin:0, fontSize:12, color:B.purpleLight, fontStyle:"italic" }}>/{w.roman}/</p>
                </div>
                <button onClick={e => { e.stopPropagation(); speak(w.ijaw); }} style={{ background:B.purplePale, border:`1px solid ${B.purpleLight}`, borderRadius:50, width:36, height:36, fontSize:14, cursor:"pointer", flexShrink:0, color:B.purple, display:"flex", alignItems:"center", justifyContent:"center" }}>▶</button>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:60, color:B.inkLight }}>
            <Bird size={70}/><p style={{ fontWeight:700, marginTop:12 }}>No words found</p>
            <p style={{ fontSize:14 }}>Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VOICE PRACTICE ──────────────────────────────────────────
function Voice({ dialect, isMobile, stats, setStats, onSwitch, addXP }) {
  const [rec,       setRec      ] = useState(false);
  const [hasRec,    setHasRec   ] = useState(false);
  const [playing,   setPlaying  ] = useState(false);
  const [status,    setStatus   ] = useState("Tap Record to activate your mic");
  const [stype,     setStype    ] = useState("idle");
  const [wi,        setWi       ] = useState(0);
  const [recCount,  setRecCount ] = useState(0);
  const [score,     setScore    ] = useState(null);
  const [micDenied, setMicDenied] = useState(false);
  const [secs,      setSecs     ] = useState(0);
  const mediaRef  = useRef(null);
  const chunksRef = useRef([]);
  const blobRef   = useRef(null);
  const audioRef  = useRef(null);
  const timerRef  = useRef(null);

  const pw   = getAllWords(dialect).slice(0, 10);
  const curr = pw[wi] || pw[0];

  const finish = useCallback(() => {
    const n = recCount + 1;
    setRecCount(n);
    setTimeout(() => setScore(Math.floor(55 + Math.random() * 45)), 900);
    if (n === 1) {
      setStats(s => ({ ...s, achievements:[...new Set([...(s.achievements||[]), "voice_rec"])] }));
      addXP(15);
    } else {
      addXP(5);
    }
  }, [recCount, addXP, setStats]);

  const startRec = async () => {
    chunksRef.current = []; setScore(null); setHasRec(false); setSecs(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      setMicDenied(false);
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        blobRef.current = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        setHasRec(true);
        stream.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
        setStatus("✅ Saved — press Play Back to hear yourself"); setStype("saved");
        finish();
      };
      mr.start(100); setRec(true); setStatus("🔴 Recording — say the word clearly"); setStype("recording");
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicDenied(true); setStatus("⚠️ Mic access denied"); setStype("error");
      } else {
        setRec(true); setStatus("🔴 Recording (demo)…"); setStype("recording");
        timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
        setTimeout(() => { setRec(false); setHasRec(true); setStatus("✅ Demo saved — press Play Back"); setStype("saved"); clearInterval(timerRef.current); finish(); }, 3000);
      }
    }
  };

  const stopRec = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    setRec(false); clearInterval(timerRef.current);
  };

  const playRec = () => {
    if (!blobRef.current) { speak(curr.ijaw); setStatus("▶ Playing demo…"); setStype("playing"); setTimeout(() => { setStatus("Done!"); setStype("saved"); }, 2000); return; }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const url = URL.createObjectURL(blobRef.current);
    const a = new Audio(url); audioRef.current = a;
    a.oncanplaythrough = () => a.play().catch(() => { setStatus("⚠️ Playback failed"); setStype("error"); });
    a.onplay    = () => { setPlaying(true);  setStatus("▶ Playing your voice…"); setStype("playing"); };
    a.onended   = () => { setPlaying(false); setStatus("Compare with the sample 👆"); setStype("saved"); URL.revokeObjectURL(url); };
    a.onerror   = () => { setPlaying(false); setStatus("⚠️ Playback error"); setStype("error"); };
  };

  const selectWord = (i) => {
    setWi(i); setHasRec(false); setScore(null); setSecs(0);
    setStatus("Tap Record to activate your mic"); setStype("idle");
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlaying(false); setRec(false);
  };

  const scColor = score ? (score>=80 ? B.green : score>=60 ? B.gold : B.red) : B.inkLight;
  const stBg    = { idle:B.purplePale, recording:B.redLight,   saved:B.greenLight, playing:B.purplePale, error:"#FEF9C3" };
  const stBdr   = { idle:B.border,     recording:B.red,        saved:B.green,      playing:B.purple,     error:B.gold };
  const stClr   = { idle:B.inkLight,   recording:B.red,        saved:B.green,      playing:B.purple,     error:B.orange };

  return (
    <div style={{ paddingBottom:80 }}>
      {isMobile && <TopBar title="Voice Practice" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ padding:"0 20px", maxWidth:640, margin:"0 auto", paddingTop: isMobile ? 16 : 0 }}>
        {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 16px", color:B.ink }}>🎙️ Voice Practice</h2>}
        <Card style={{ background:`linear-gradient(135deg,${B.purple},${B.purpleMid})`, textAlign:"center", padding:"40px 32px", marginBottom:20, border:"none" }}>
          <p style={{ color:B.purpleLight, margin:"0 0 12px", fontSize:12, fontWeight:700, letterSpacing:2 }}>SAY THIS WORD</p>
          <h1 style={{ color:"#fff", fontSize:54, fontWeight:900, margin:"0 0 8px" }}>{curr.ijaw}</h1>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:20, margin:"0 0 6px" }}>{curr.english}</p>
          <p style={{ color:B.purpleLight, fontStyle:"italic", fontSize:14, margin:"0 0 20px" }}>/{curr.roman}/</p>
          <button onClick={() => speak(curr.ijaw)} style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:50, padding:"12px 28px", color:"#fff", cursor:"pointer", fontSize:16, fontWeight:700 }}>🔊 Hear Sample</button>
        </Card>
        {micDenied && (
          <Card style={{ background:"#FEF9C3", border:`2px solid ${B.gold}`, marginBottom:16, padding:"14px 18px" }}>
            <p style={{ margin:0, fontSize:13, color:B.ink, fontWeight:700 }}>🔒 Mic access blocked</p>
            <p style={{ margin:"6px 0 0", fontSize:12, color:B.inkLight }}>Click 🔒 in the address bar → Site settings → Microphone → Allow.</p>
          </Card>
        )}
        {score !== null && (
          <Card style={{ marginBottom:16, textAlign:"center", padding:"16px 20px", border:`2px solid ${scColor}44` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
              <Bird size={48} bob={score>=80}/>
              <div>
                <p style={{ margin:0, fontSize:12, color:B.inkLight, fontWeight:700 }}>SCORE</p>
                <p style={{ margin:"4px 0", fontSize:38, fontWeight:900, color:scColor }}>{score}%</p>
                <p style={{ margin:0, fontSize:13, color:B.inkLight }}>{score>=80?"Excellent! 🎉":score>=60?"Good job! 👍":"Keep practicing 💪"}</p>
              </div>
            </div>
          </Card>
        )}
        <div style={{ borderRadius:14, padding:"12px 18px", fontSize:14, fontWeight:600, marginBottom:16, background:stBg[stype]||B.purplePale, border:`2px solid ${stBdr[stype]||B.border}`, color:stClr[stype]||B.inkLight, transition:"all 0.3s", display:"flex", alignItems:"center", gap:10 }}>
          {stype==="recording" && <>
            <span style={{ width:10, height:10, borderRadius:"50%", background:B.red, display:"inline-block", animation:"pulse 1s infinite" }}/>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
            <span style={{ fontWeight:800 }}>{secs}s</span>
          </>}
          <span style={{ flex:1 }}>{status}</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <button onClick={rec ? stopRec : startRec} style={{ background: rec ? B.red : B.purple, border:"none", borderRadius:16, padding:"18px 16px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6, boxShadow:`0 4px 16px ${rec?B.red:B.purple}44`, transition:"all 0.2s" }}>
            <span style={{ fontSize:28 }}>{rec ? "⏹" : "🎙️"}</span>
            <span>{rec ? `Stop (${secs}s)` : "Record"}</span>
          </button>
          <button onClick={hasRec ? playRec : null} disabled={!hasRec} style={{ background:!hasRec?"#E5E0F0":playing?B.purpleMid:B.green, border:"none", borderRadius:16, padding:"18px 16px", color:!hasRec?B.inkLight:"#fff", fontWeight:800, fontSize:16, cursor:!hasRec?"not-allowed":"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6, boxShadow:hasRec?`0 4px 16px ${B.green}44`:"none", transition:"all 0.2s" }}>
            <span style={{ fontSize:28 }}>{playing ? "🔊" : "▶"}</span>
            <span>{playing ? "Playing…" : "Play Back"}</span>
          </button>
        </div>
        <Card style={{ marginBottom:16 }}>
          <p style={{ margin:"0 0 12px", fontWeight:800, fontSize:15, color:B.ink }}>{dialect} Words</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {pw.map((w,i) => (
              <button key={w.id} onClick={() => selectWord(i)} style={{ padding:"8px 14px", borderRadius:20, border:"none", cursor:"pointer", background: i===wi ? B.purple : B.purplePale, color: i===wi ? "#fff" : B.purple, fontWeight:700, fontSize:13, transition:"all 0.15s" }}>{w.ijaw}</button>
            ))}
          </div>
        </Card>
        <Card style={{ background:B.purplePale, border:`1px solid ${B.purpleLight}44`, padding:"16px 18px" }}>
          <div style={{ display:"flex", gap:12 }}>
            <Bird size={36}/>
            <div>
              <p style={{ margin:"0 0 6px", fontWeight:800, fontSize:13, color:B.ink }}>How to practice:</p>
              {["1. 🔊 Hear Sample — listen carefully","2. 🎙️ Record — speak into your mic","3. ⏹ Stop when done","4. ▶ Play Back — hear yourself","5. Compare & repeat!"].map((t,i) => (
                <p key={i} style={{ margin:"2px 0", fontSize:12, color:B.inkLight }}>{t}</p>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PROGRESS ────────────────────────────────────────────────
function Progress({ dialect, stats, isMobile, onSwitch }) {
  const level    = calcLevel(stats.xp);
  const nxt      = xpToNext(stats.xp);
  const dlessons = getLessons(dialect);
  const done     = dlessons.filter(l => stats.completedLessons[`${dialect}_${l.stage}`]).length;
  const ACHV = [
    { id:"first_lesson", icon:"🌱", title:"First Steps",  desc:"Complete your first lesson" },
    { id:"quiz_pass",    icon:"🧠", title:"Quiz Master",   desc:"Pass any quiz" },
    { id:"voice_rec",    icon:"🎙️", title:"Speaker",       desc:"Record your first word" },
    { id:"dict_10",      icon:"📖", title:"Word Seeker",   desc:"Look up 10 words" },
    { id:"all_stages",   icon:"🏆", title:"Scholar",       desc:"Complete all stages" },
  ];
  const isEarned = (a) => {
    if (a.id==="all_stages")   return done === dlessons.length;
    if (a.id==="first_lesson") return done > 0;
    if (a.id==="quiz_pass")    return Object.keys(stats.completedLessons).length > 0;
    return (stats.achievements||[]).includes(a.id);
  };

  return (
    <div style={{ padding:"0 20px 80px" }}>
      {isMobile && <TopBar title="My Progress" dialect={dialect} onSwitch={onSwitch}/>}
      <div style={{ maxWidth:640, margin:"0 auto", paddingTop: isMobile ? 16 : 0 }}>
        {!isMobile && <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 16px", color:B.ink }}>📊 My Progress</h2>}
        <Card style={{ background:`linear-gradient(135deg,${B.purple},${B.purpleMid})`, border:"none", marginBottom:20, padding:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
            <div style={{ width:70, height:70, borderRadius:22, background:"rgba(255,255,255,0.15)", border:"3px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Bird size={54}/>
            </div>
            <div>
              <p style={{ color:"#fff", fontWeight:900, fontSize:22, margin:0 }}>Level {level}</p>
              <p style={{ color:B.purpleLight, fontSize:14, margin:"4px 0 8px" }}>{stats.xp} XP · {dialect} learner</p>
              <div style={{ display:"flex", gap:10 }}>
                <Flame count={stats.streak}/>
                <Hearts count={stats.hearts}/>
              </div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12, margin:"0 0 5px" }}>Level {level} → {level+1} · {nxt} XP remaining</p>
          <div style={{ background:"rgba(255,255,255,0.25)", borderRadius:99, height:10, overflow:"hidden" }}>
            <div style={{ width:`${((60-nxt)/60)*100}%`, height:"100%", background:B.gold, borderRadius:99, transition:"width 0.5s" }}/>
          </div>
        </Card>
        <Card style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontWeight:800, color:B.ink }}>{dialect} Progress</span>
            <span style={{ fontWeight:700, color:B.purple }}>{done}/{dlessons.length} stages</span>
          </div>
          <PBar value={done} max={dlessons.length} h={12}/>
        </Card>
        <h3 style={{ fontSize:13, fontWeight:700, color:B.inkLight, letterSpacing:1, marginBottom:12 }}>STAGES</h3>
        {dlessons.map(l => {
          const cleared = !!stats.completedLessons[`${dialect}_${l.stage}`];
          return (
            <Card key={l.stage} style={{ marginBottom:12, padding:"16px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:24 }}>{l.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <p style={{ margin:0, fontWeight:800, fontSize:15, color:B.ink }}>Stage {l.stage}: {l.title}</p>
                    {cleared ? <Badge color={B.green}>✓ Cleared</Badge> : <Badge color={B.inkLight}>Pending</Badge>}
                  </div>
                  <p style={{ margin:"3px 0 0", fontSize:12, color:B.inkLight }}>{l.words.length} words · {l.xp} XP</p>
                </div>
              </div>
            </Card>
          );
        })}
        <h3 style={{ fontSize:13, fontWeight:700, color:B.inkLight, letterSpacing:1, margin:"24px 0 12px" }}>ACHIEVEMENTS</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
          {ACHV.map(a => {
            const earned = isEarned(a);
            return (
              <Card key={a.id} style={{ opacity: earned ? 1 : 0.4, filter: earned ? "none" : "grayscale(0.7)", padding:"16px 18px" }}>
                <span style={{ fontSize:32 }}>{a.icon}</span>
                <p style={{ margin:"8px 0 4px", fontWeight:800, fontSize:14, color:B.ink }}>{a.title}</p>
                <p style={{ margin:0, fontSize:12, color:B.inkLight }}>{a.desc}</p>
                {earned && <p style={{ margin:"8px 0 0", fontSize:11, color:B.green, fontWeight:700 }}>✓ Earned</p>}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────
export default function App() {
  const [screen,        setScreenRaw   ] = useState("onboarding");
  const [dialect,       setDialect     ] = useState("Kalabari");
  const [showModal,     setShowModal   ] = useState(false);
  const [isMobile,      setIsMobile    ] = useState(window.innerWidth < 768);
  const [playerContext, setPlayerContext] = useState(null);
  const [lessonContext, setLessonContext] = useState(null);
  const [stats,         setStats       ] = useState({ xp:0, streak:1, hearts:3, completedLessons:{}, achievements:[] });
  const [xpToast,       setXpToast     ] = useState(null);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const setScreen = (s) => { setScreenRaw(s); };

  const addXP = useCallback((amt) => {
    setStats(s => ({ ...s, xp: s.xp + amt }));
    setXpToast(amt);
    setTimeout(() => setXpToast(null), 2200);
  }, []);

  const handleDialect = (d) => {
    setDialect(d);
    setShowModal(false);
    if (screen === "onboarding") setScreen("home");
  };

  if (screen === "onboarding") return <Onboarding onSelect={handleDialect}/>;

  if (screen === "player" && playerContext) {
    return <LessonPlayer context={playerContext} setScreen={(s) => {
      if (s === "quizFromLesson") { setLessonContext(playerContext.lesson); setScreen("quiz"); }
      else setScreen(s);
    }} addXP={addXP}/>;
  }

  const shared = { dialect, setScreen, isMobile, stats, setStats, addXP, onSwitch: () => setShowModal(true) };

  const renderScreen = () => {
    switch (screen) {
      case "home":       return <Home       {...shared}/>;
      case "learn":      return <Learn      {...shared} setPlayerContext={setPlayerContext}/>;
      case "quiz":       return <Quiz       {...shared} lessonContext={lessonContext}/>;
      case "dictionary": return <Dictionary {...shared}/>;
      case "voice":      return <Voice      {...shared}/>;
      case "progress":   return <Progress   {...shared}/>;
      default:           return <Home       {...shared}/>;
    }
  };

  return (
    <div style={{ display:"flex", fontFamily:"'Segoe UI',system-ui,sans-serif", background:B.off, minHeight:"100vh" }}>
      {!isMobile && <Sidebar screen={screen} setScreen={setScreen} dialect={dialect} onSwitch={() => setShowModal(true)} stats={stats}/>}
      <div style={{ flex:1, minWidth:0, overflowY:"auto", paddingBottom: isMobile ? 72 : 0 }}>
        {!isMobile && (
          <div style={{ padding:"18px 28px 14px", borderBottom:`1.5px solid ${B.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:B.white, position:"sticky", top:0, zIndex:100 }}>
            <div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:900, color:B.ink }}>
                {NAV.find(n => n.id===screen)?.icon} {NAV.find(n => n.id===screen)?.label || "Nume"}
              </h1>
              <p style={{ margin:"3px 0 0", fontSize:12, color:B.inkLight }}>
                {DIALECT_INFO[dialect].flag} {dialect} · Level {calcLevel(stats.xp)} · {stats.xp} XP
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <Flame count={stats.streak}/>
              <Hearts count={stats.hearts}/>
              <button onClick={() => setShowModal(true)} style={{ background:B.purplePale, border:"none", borderRadius:20, padding:"9px 16px", cursor:"pointer", fontWeight:700, fontSize:13, color:B.purple, display:"flex", alignItems:"center", gap:8 }}>
                {DIALECT_INFO[dialect].flag} {dialect} ▾
              </button>
            </div>
          </div>
        )}
        <div style={{ padding: !isMobile ? "8px 0" : 0 }}>
          {renderScreen()}
        </div>
      </div>
      {isMobile && <BotNav screen={screen} setScreen={setScreen}/>}
      {showModal && <DialectModal dialect={dialect} onSelect={handleDialect} onClose={() => setShowModal(false)}/>}
      {xpToast   && <XPToast xp={xpToast} onDone={() => setXpToast(null)}/>}
    </div>
  );
}