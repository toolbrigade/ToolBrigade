"use client";
import { useState, useMemo } from "react";
import { Copy } from "lucide-react";

type EmojiEntry = { e: string; n: string; k: string[] };

const EMOJIS: Record<string, EmojiEntry[]> = {
  "Smileys": [
    {e:"😀",n:"grinning face",k:["happy","smile","grin"]},{e:"😂",n:"face with tears of joy",k:["laugh","lol","funny"]},{e:"🥹",n:"face holding back tears",k:["moved","grateful","cry"]},{e:"😍",n:"smiling face with heart-eyes",k:["love","heart","adore"]},{e:"🤔",n:"thinking face",k:["think","hmm","ponder"]},{e:"😎",n:"smiling face with sunglasses",k:["cool","sunglasses","awesome"]},{e:"😭",n:"loudly crying face",k:["cry","sad","sob"]},{e:"😅",n:"grinning face with sweat",k:["nervous","sweat","relief"]},{e:"🤣",n:"rolling on the floor laughing",k:["rofl","laugh","funny"]},{e:"😊",n:"smiling face with smiling eyes",k:["happy","blush","smile"]},{e:"😇",n:"smiling face with halo",k:["angel","innocent","good"]},{e:"🥰",n:"smiling face with hearts",k:["love","adore","hearts"]},{e:"😘",n:"face blowing a kiss",k:["kiss","love","mwah"]},{e:"😜",n:"winking face with tongue",k:["wink","tongue","playful"]},{e:"🤩",n:"star-struck",k:["star","wow","amazing"]},{e:"🥳",n:"partying face",k:["party","celebrate","birthday"]},{e:"😤",n:"face with steam from nose",k:["angry","frustrated","triumph"]},{e:"😱",n:"face screaming in fear",k:["scream","scared","shocked"]},{e:"🤯",n:"exploding head",k:["mind blown","shocked","wow"]},{e:"😴",n:"sleeping face",k:["sleep","tired","zzz"]},
  ],
  "Gestures": [
    {e:"👍",n:"thumbs up",k:["like","good","approve"]},{e:"👎",n:"thumbs down",k:["dislike","bad","disapprove"]},{e:"👋",n:"waving hand",k:["wave","hello","bye"]},{e:"🤝",n:"handshake",k:["deal","agree","shake"]},{e:"👏",n:"clapping hands",k:["clap","applause","bravo"]},{e:"🙌",n:"raising hands",k:["celebrate","praise","hooray"]},{e:"🤜",n:"right-facing fist",k:["fist","bump","punch"]},{e:"✌️",n:"victory hand",k:["peace","victory","two"]},{e:"🤞",n:"crossed fingers",k:["luck","hope","fingers crossed"]},{e:"🖐️",n:"hand with fingers splayed",k:["stop","five","hand"]},{e:"☝️",n:"index pointing up",k:["point","up","one"]},{e:"👇",n:"backhand index pointing down",k:["down","point","below"]},{e:"👈",n:"backhand index pointing left",k:["left","point","this"]},{e:"👉",n:"backhand index pointing right",k:["right","point","that"]},{e:"🤙",n:"call me hand",k:["call","shaka","hang loose"]},{e:"💪",n:"flexed biceps",k:["strong","muscle","flex"]},{e:"🙏",n:"folded hands",k:["pray","please","thanks","namaste"]},{e:"🫶",n:"heart hands",k:["love","heart","hands"]},{e:"🤲",n:"palms up together",k:["offer","receive","pray"]},{e:"👐",n:"open hands",k:["open","hug","jazz hands"]},
  ],
  "People": [
    {e:"👶",n:"baby",k:["baby","infant","child"]},{e:"👦",n:"boy",k:["boy","child","kid"]},{e:"👧",n:"girl",k:["girl","child","kid"]},{e:"👨",n:"man",k:["man","male","person"]},{e:"👩",n:"woman",k:["woman","female","person"]},{e:"🧑",n:"person",k:["person","adult","human"]},{e:"👴",n:"old man",k:["old","elderly","grandfather"]},{e:"👵",n:"old woman",k:["old","elderly","grandmother"]},{e:"👨‍💻",n:"man technologist",k:["developer","coder","programmer"]},{e:"👩‍💻",n:"woman technologist",k:["developer","coder","programmer"]},{e:"👨‍🎨",n:"man artist",k:["artist","painter","creative"]},{e:"👩‍🎨",n:"woman artist",k:["artist","painter","creative"]},{e:"👨‍🏫",n:"man teacher",k:["teacher","professor","education"]},{e:"👩‍🏫",n:"woman teacher",k:["teacher","professor","education"]},{e:"🧑‍🚀",n:"astronaut",k:["astronaut","space","rocket"]},{e:"🧑‍🍳",n:"cook",k:["chef","cook","food"]},{e:"🧑‍⚕️",n:"health worker",k:["doctor","nurse","medical"]},{e:"🧑‍🔬",n:"scientist",k:["scientist","lab","research"]},{e:"🧑‍🎤",n:"singer",k:["singer","music","performer"]},{e:"🧑‍🏋️",n:"person lifting weights",k:["gym","workout","fitness"]},
  ],
  "Animals": [
    {e:"🐶",n:"dog face",k:["dog","puppy","pet"]},{e:"🐱",n:"cat face",k:["cat","kitten","pet"]},{e:"🐭",n:"mouse face",k:["mouse","rodent"]},{e:"🐹",n:"hamster",k:["hamster","pet","cute"]},{e:"🐰",n:"rabbit face",k:["rabbit","bunny","easter"]},{e:"🦊",n:"fox",k:["fox","clever","animal"]},{e:"🐻",n:"bear",k:["bear","animal","cute"]},{e:"🐼",n:"panda",k:["panda","china","cute"]},{e:"🐨",n:"koala",k:["koala","australia","cute"]},{e:"🐯",n:"tiger face",k:["tiger","wild","stripes"]},{e:"🦁",n:"lion",k:["lion","king","wild"]},{e:"🐮",n:"cow face",k:["cow","moo","farm"]},{e:"🐷",n:"pig face",k:["pig","oink","farm"]},{e:"🐸",n:"frog",k:["frog","green","ribbit"]},{e:"🐵",n:"monkey face",k:["monkey","ape","animal"]},{e:"🐔",n:"chicken",k:["chicken","bird","farm"]},{e:"🐧",n:"penguin",k:["penguin","bird","cold"]},{e:"🐦",n:"bird",k:["bird","tweet","fly"]},{e:"🦋",n:"butterfly",k:["butterfly","insect","pretty"]},{e:"🐝",n:"honeybee",k:["bee","honey","insect"]},
  ],
  "Food": [
    {e:"🍎",n:"red apple",k:["apple","fruit","red"]},{e:"🍊",n:"tangerine",k:["orange","fruit","citrus"]},{e:"🍋",n:"lemon",k:["lemon","sour","yellow"]},{e:"🍇",n:"grapes",k:["grapes","fruit","wine"]},{e:"🍓",n:"strawberry",k:["strawberry","fruit","red"]},{e:"🍕",n:"pizza",k:["pizza","food","italian"]},{e:"🍔",n:"hamburger",k:["burger","food","fast food"]},{e:"🌮",n:"taco",k:["taco","mexican","food"]},{e:"🍜",n:"steaming bowl",k:["noodles","ramen","soup"]},{e:"🍣",n:"sushi",k:["sushi","japanese","fish"]},{e:"🍦",n:"soft ice cream",k:["ice cream","dessert","sweet"]},{e:"🎂",n:"birthday cake",k:["cake","birthday","celebrate"]},{e:"☕",n:"hot beverage",k:["coffee","tea","hot"]},{e:"🍺",n:"beer mug",k:["beer","drink","cheers"]},{e:"🥂",n:"clinking glasses",k:["champagne","toast","celebrate"]},{e:"🍷",n:"wine glass",k:["wine","drink","red"]},{e:"🧃",n:"beverage box",k:["juice","drink","box"]},{e:"🥑",n:"avocado",k:["avocado","healthy","green"]},{e:"🌽",n:"ear of corn",k:["corn","vegetable","yellow"]},{e:"🍩",n:"doughnut",k:["donut","sweet","dessert"]},
  ],
  "Travel": [
    {e:"✈️",n:"airplane",k:["plane","fly","travel","airport"]},{e:"🚀",n:"rocket",k:["rocket","space","launch"]},{e:"🚗",n:"automobile",k:["car","drive","vehicle"]},{e:"🚕",n:"taxi",k:["taxi","cab","yellow"]},{e:"🚌",n:"bus",k:["bus","transport","public"]},{e:"🚂",n:"locomotive",k:["train","steam","railway"]},{e:"🚢",n:"ship",k:["ship","boat","cruise"]},{e:"🏖️",n:"beach with umbrella",k:["beach","vacation","summer"]},{e:"🏔️",n:"snow-capped mountain",k:["mountain","snow","hike"]},{e:"🗼",n:"Tokyo tower",k:["tokyo","japan","tower"]},{e:"🗽",n:"Statue of Liberty",k:["liberty","new york","usa"]},{e:"🏰",n:"European castle",k:["castle","europe","medieval"]},{e:"🌍",n:"globe showing Europe-Africa",k:["earth","world","globe"]},{e:"🌎",n:"globe showing Americas",k:["earth","world","globe"]},{e:"🌏",n:"globe showing Asia-Australia",k:["earth","world","globe"]},{e:"🗺️",n:"world map",k:["map","world","travel"]},{e:"🧳",n:"luggage",k:["luggage","travel","suitcase"]},{e:"🎫",n:"ticket",k:["ticket","event","admission"]},{e:"🏕️",n:"camping",k:["camp","tent","outdoor"]},{e:"🌅",n:"sunrise",k:["sunrise","morning","dawn"]},
  ],
  "Objects": [
    {e:"💻",n:"laptop",k:["laptop","computer","tech"]},{e:"📱",n:"mobile phone",k:["phone","mobile","smartphone"]},{e:"⌨️",n:"keyboard",k:["keyboard","type","computer"]},{e:"🖥️",n:"desktop computer",k:["desktop","monitor","computer"]},{e:"🖨️",n:"printer",k:["printer","print","office"]},{e:"📷",n:"camera",k:["camera","photo","picture"]},{e:"🎥",n:"movie camera",k:["video","film","camera"]},{e:"📺",n:"television",k:["tv","television","watch"]},{e:"📻",n:"radio",k:["radio","music","broadcast"]},{e:"🎮",n:"video game",k:["game","controller","gaming"]},{e:"🕹️",n:"joystick",k:["joystick","game","arcade"]},{e:"💡",n:"light bulb",k:["idea","light","bulb"]},{e:"🔦",n:"flashlight",k:["flashlight","torch","light"]},{e:"🔑",n:"key",k:["key","lock","access"]},{e:"🔒",n:"locked",k:["lock","secure","closed"]},{e:"📚",n:"books",k:["books","read","library"]},{e:"✏️",n:"pencil",k:["pencil","write","draw"]},{e:"📎",n:"paperclip",k:["paperclip","attach","clip"]},{e:"🔧",n:"wrench",k:["wrench","tool","fix"]},{e:"⚙️",n:"gear",k:["gear","settings","cog"]},
  ],
  "Symbols": [
    {e:"❤️",n:"red heart",k:["heart","love","red"]},{e:"🧡",n:"orange heart",k:["heart","orange","love"]},{e:"💛",n:"yellow heart",k:["heart","yellow","love"]},{e:"💚",n:"green heart",k:["heart","green","love"]},{e:"💙",n:"blue heart",k:["heart","blue","love"]},{e:"💜",n:"purple heart",k:["heart","purple","love"]},{e:"🖤",n:"black heart",k:["heart","black","dark"]},{e:"🤍",n:"white heart",k:["heart","white","pure"]},{e:"💔",n:"broken heart",k:["broken","sad","heartbreak"]},{e:"⭐",n:"star",k:["star","favorite","rating"]},{e:"🌟",n:"glowing star",k:["star","glow","shine"]},{e:"✨",n:"sparkles",k:["sparkle","magic","shine"]},{e:"🔥",n:"fire",k:["fire","hot","flame"]},{e:"💯",n:"hundred points",k:["100","perfect","score"]},{e:"✅",n:"check mark button",k:["check","done","yes","tick"]},{e:"❌",n:"cross mark",k:["cross","no","wrong","x"]},{e:"⚠️",n:"warning",k:["warning","caution","alert"]},{e:"ℹ️",n:"information",k:["info","information","help"]},{e:"🔴",n:"red circle",k:["red","circle","dot"]},{e:"🟢",n:"green circle",k:["green","circle","dot"]},
  ],
};

const ALL_EMOJIS = Object.values(EMOJIS).flat();

export default function EmojiPicker() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  const categories = ["All", ...Object.keys(EMOJIS)];

  const filtered = useMemo(() => {
    let list = category === "All" ? ALL_EMOJIS : (EMOJIS[category] ?? []);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.n.includes(q) || e.k.some(k => k.includes(q)) || e.e === q);
    }
    return list;
  }, [search, category]);

  function copyEmoji(emoji: string) {
    navigator.clipboard.writeText(emoji);
    setCopied(emoji);
    setTimeout(() => setCopied(null), 1200);
    setRecent(r => [emoji, ...r.filter(e => e !== emoji)].slice(0, 20));
  }

  return (
    <div className="space-y-4">
      <input
        className="input"
        placeholder="Search emoji by name or keyword (e.g. happy, fire, heart)…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        autoFocus
      />

      <div className="flex flex-wrap gap-1.5">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${category === c ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : "border-[var(--border)] text-[var(--text-muted)]"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {recent.length > 0 && !search && (
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Recently copied</p>
          <div className="flex flex-wrap gap-1">
            {recent.map((e, i) => (
              <button key={i} onClick={() => copyEmoji(e)}
                className="text-2xl p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors relative"
                title={ALL_EMOJIS.find(x => x.e === e)?.n ?? e}>
                {e}
                {copied === e && <span className="absolute -top-1 -right-1 text-[9px] bg-green-500 text-white rounded px-0.5">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2">{filtered.length} emoji — click to copy</p>
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
          {filtered.map((entry, i) => (
            <button
              key={i}
              onClick={() => copyEmoji(entry.e)}
              title={entry.n}
              className="relative text-2xl p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors aspect-square flex items-center justify-center"
            >
              {entry.e}
              {copied === entry.e && (
                <span className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg text-xs text-green-600 dark:text-green-400 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">No emoji found for &quot;{search}&quot;</p>
        )}
      </div>
    </div>
  );
}
