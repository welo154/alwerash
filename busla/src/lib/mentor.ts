import { ACTIVITIES, EVENT, SCHEDULE } from "./event";

type Major = { name: string; keywords: string[]; activities: string[]; why: string };

// Kept deliberately broad: these are fields students can study in Egypt and abroad.
export const MAJORS: Major[] = [
  { name: "Computer Science", keywords: ["code", "coding", "program", "computer", "software", "app", "game", "tech", "hack"], activities: ["maker-yard", "major-labs"], why: "you like building things that run" },
  { name: "AI & Data Science", keywords: ["ai", "data", "math", "statistic", "pattern", "machine learning", "chatgpt", "robot"], activities: ["maker-yard", "major-labs"], why: "you enjoy patterns, numbers and smart systems" },
  { name: "Mechanical / Mechatronics Engineering", keywords: ["robot", "car", "machine", "build", "physics", "engine", "fix", "lego"], activities: ["maker-yard", "career-sims"], why: "you like making physical things move" },
  { name: "Civil & Architectural Engineering", keywords: ["bridge", "building", "construct", "city", "structure"], activities: ["career-sims", "creative-studio"], why: "you care how things stand up and how cities work" },
  { name: "Electrical & Communications Engineering", keywords: ["electric", "circuit", "electronics", "arduino", "signal", "network"], activities: ["maker-yard", "major-labs"], why: "you're curious about circuits and signals" },
  { name: "Medicine", keywords: ["doctor", "medicine", "medical", "biology", "body", "hospital", "save", "health", "anatomy"], activities: ["career-sims", "major-labs"], why: "you're drawn to biology and helping people directly" },
  { name: "Pharmacy & Biotechnology", keywords: ["chemistry", "lab", "drug", "pharma", "biotech", "gene", "experiment"], activities: ["major-labs", "admissions-desk"], why: "you enjoy chemistry and lab work" },
  { name: "Dentistry / Physiotherapy", keywords: ["dent", "teeth", "sport", "physio", "rehab", "athlete"], activities: ["career-sims", "major-labs"], why: "you like hands-on health work" },
  { name: "Business Administration", keywords: ["business", "startup", "money", "sell", "lead", "manage", "entrepreneur", "company"], activities: ["career-sims", "main-stage"], why: "you like leading and making ideas profitable" },
  { name: "Economics & Finance", keywords: ["economy", "economics", "finance", "invest", "stock", "bank", "crypto"], activities: ["career-sims", "major-labs"], why: "you're curious how money and markets behave" },
  { name: "Marketing & Advertising", keywords: ["marketing", "brand", "social media", "ads", "influenc", "content"], activities: ["creative-studio", "career-sims"], why: "you get what makes people pay attention" },
  { name: "Law", keywords: ["law", "lawyer", "justice", "debate", "argue", "rights", "court", "mun"], activities: ["career-sims", "major-labs"], why: "you like arguing a case and fairness matters to you" },
  { name: "Political Science & International Relations", keywords: ["politic", "world", "diplomat", "history", "government", "news", "mun"], activities: ["main-stage", "mentor-circles"], why: "you follow the world and how decisions get made" },
  { name: "Architecture", keywords: ["architect", "space", "interior", "sketch", "model", "house"], activities: ["creative-studio", "major-labs"], why: "you think in spaces and drawings" },
  { name: "Graphic & Product Design", keywords: ["design", "draw", "art", "illustrat", "ui", "ux", "logo", "creative", "paint"], activities: ["creative-studio", "mentor-circles"], why: "you make things look and feel right" },
  { name: "Mass Communication, Media & Film", keywords: ["film", "video", "movie", "journal", "media", "write", "story", "photo", "podcast", "youtube"], activities: ["creative-studio", "main-stage"], why: "you like telling stories to an audience" },
  { name: "Psychology", keywords: ["psych", "mind", "people", "behavio", "listen", "mental", "feel"], activities: ["mentor-circles", "main-stage"], why: "you're curious why people do what they do" },
  { name: "Education", keywords: ["teach", "tutor", "explain", "kids", "school"], activities: ["mentor-circles", "main-stage"], why: "you light up explaining things to others" },
  { name: "Environmental Science & Renewable Energy", keywords: ["environment", "climate", "planet", "solar", "energy", "nature", "sustainab", "green"], activities: ["major-labs", "maker-yard"], why: "you want to work on the planet's big problems" },
  { name: "Tourism & Hospitality", keywords: ["travel", "tourism", "hotel", "food", "chef", "event", "language"], activities: ["university-fair", "mentor-circles"], why: "you like people, places and making experiences" },
];

const activityLine = (id: string) => {
  const a = ACTIVITIES.find((x) => x.id === id);
  return a ? `**${a.title}** (${a.zone})` : id;
};

export function buildSystemPrompt() {
  const activities = ACTIVITIES.map(
    (a) => `- id:${a.id} | ${a.title} | zone: ${a.zone} | ${a.blurb} | tags: ${a.tags.join(", ")}`,
  ).join("\n");
  const schedule = SCHEDULE.map((s) => `- ${s.time} ${s.title} (${s.where})`).join("\n");
  const majors = MAJORS.map((m) => m.name).join(", ");

  return `You are Compass, the mentor inside the website for ${EVENT.name} (${EVENT.arabic}, Arabic for "compass"), a university and career discovery day for high-school students in Egypt.

Event facts:
- ${EVENT.dateLabel}, ${EVENT.hours}
- ${EVENT.venue}, ${EVENT.area}
- Free entry with registration (the "Register" section of this page).

What happens at the event:
${activities}

Schedule:
${schedule}

Majors you can draw from (not exhaustive): ${majors}.

How to mentor:
- You talk mostly with 14–18 year olds, sometimes their parents. Be warm, direct and specific. Short paragraphs, no lecturing.
- Reply in the language the student writes in. Egyptian Arabic, Modern Standard Arabic, English or a Franco-Arabic mix are all fine; mirror them.
- Before recommending, learn enough: what they enjoy doing (not just their best subject), how they like to work (people, things, ideas, data), their curriculum and grade if relevant. Ask at most two questions at a time.
- When you recommend, give 2–3 majors with one line each on why it fits *them*, then 2–4 Busla activities by their exact title with when/where from the schedule, and one thing to ask at the University Fair.
- Be honest about trade-offs (length of study, difficulty, job market in Egypt) without crushing anyone's dream. Never pressure a choice; parents' expectations are real, acknowledge them.
- If asked about specific university admission scores, fees or deadlines, say these change every year and point them to the Admissions & Scholarships Desk and the official university site. Don't invent numbers or university participants.
- If a student seems distressed or mentions self-harm, respond with care, encourage them to talk to a trusted adult or school counselor, and share Egypt's mental-health hotline 08008880700.
- Stay on topic: studies, careers, the event. Politely steer back otherwise.
- Use light Markdown (bold, short bullet lists). No headings, no tables.`;
}

/**
 * Rule-based mentor used when no ANTHROPIC_API_KEY is configured (or the API fails),
 * so the widget is always useful.
 */
export function fallbackReply(history: { role: "user" | "assistant"; content: string }[]): string {
  const userText = history
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");
  const isArabic = /[؀-ۿ]/.test(userText);

  const scored = MAJORS.map((m) => ({
    m,
    score: m.keywords.reduce((n, k) => n + (userText.includes(k) ? 1 : 0), 0),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) {
    return isArabic
      ? "أهلاً! أنا بوصلة 🧭 قولّي حاجتين: إيه الحاجة اللي بتعملها وتنسى الوقت معاها؟ وبتحب تشتغل مع ناس، ولا بإيديك، ولا بالأفكار والأرقام؟"
      : "Hey, I'm Compass 🧭 Tell me two things so I can point you somewhere useful:\n\n- What do you do that makes you lose track of time? (gaming, drawing, fixing stuff, debating, helping friends…)\n- Do you prefer working with **people**, **things**, **ideas**, or **data**?";
  }

  const majors = scored.map(({ m }) => `- **${m.name}**: ${m.why}.`).join("\n");
  const activityIds = Array.from(new Set(scored.flatMap(({ m }) => m.activities))).slice(0, 4);
  const acts = activityIds.map((id) => `- ${activityLine(id)}`).join("\n");

  return `Based on what you told me, here's where I'd start:\n\n${majors}\n\nAt Busla, don't miss:\n${acts}\n\nAt the University Fair, ask a current student: *"What does a normal Tuesday look like in year two?"* The answer tells you more than any brochure.\n\nWant me to compare two of these, or tell you what high-school subjects matter most for them?`;
}
