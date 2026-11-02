// Single source of truth for event content. The page, the registration form
// and the Compass mentor all read from here, so edit copy in one place.

export const EVENT = {
  name: "Busla",
  arabic: "بوصلة",
  tagline: "Find your direction before you pick your road.",
  edition: "Edition 01",
  date: process.env.NEXT_PUBLIC_EVENT_DATE ?? "2027-02-13T10:00:00+02:00",
  dateLabel: "Saturday · 13 February 2027",
  hours: "10:00 AM – 5:00 PM",
  venue: "Seven Pillars School",
  area: "New Administrative Capital, Cairo",
  mapQuery: "Seven Pillars International School, New Administrative Capital, Egypt",
  email: "hello@busla.events",
  phone: "+20 100 000 0000",
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/",
  tiktok: "https://tiktok.com/",
};

export type Color = "saffron" | "brick" | "nile" | "rose" | "sky" | "lime" | "ink";

export type Activity = {
  id: string;
  title: string;
  kicker: string;
  blurb: string;
  color: Color;
  tags: string[];
  zone: string;
};

export const ACTIVITIES: Activity[] = [
  {
    id: "university-fair",
    title: "University Fair",
    kicker: "Hall A",
    blurb:
      "Walk the floor with admissions teams from Egyptian and international universities. Ask the questions brochures dodge.",
    color: "saffron",
    tags: ["admissions", "abroad", "all majors"],
    zone: "Fair Hall",
  },
  {
    id: "major-labs",
    title: "Major Taster Labs",
    kicker: "20-minute classes",
    blurb:
      "Sit a real first-year class in engineering, medicine, CS, architecture, law, business and more, taught by university faculty.",
    color: "nile",
    tags: ["engineering", "medicine", "computer science", "law", "business"],
    zone: "Lab Wing",
  },
  {
    id: "career-sims",
    title: "Career Simulation Rooms",
    kicker: "Try the job",
    blurb:
      "Triage a mock ER, pitch a startup to investors, argue a moot-court case, or stress-test a bridge you designed in 15 minutes.",
    color: "brick",
    tags: ["medicine", "business", "law", "engineering"],
    zone: "Studio Block",
  },
  {
    id: "maker-yard",
    title: "Maker Yard",
    kicker: "Hands dirty",
    blurb:
      "Robotics arena, 3D printing bar and a 90-minute coding sprint. Build something, break it, then build it better.",
    color: "lime",
    tags: ["robotics", "coding", "AI", "engineering"],
    zone: "Courtyard",
  },
  {
    id: "creative-studio",
    title: "Creative Studio",
    kicker: "Make things people feel",
    blurb:
      "Architecture model-making, brand design, short-film editing and a live illustration wall. Portfolio advice from working creatives.",
    color: "rose",
    tags: ["design", "architecture", "media", "art"],
    zone: "Art Rooms",
  },
  {
    id: "main-stage",
    title: "Main Stage: The Detour",
    kicker: "Talks",
    blurb:
      "Short, honest talks from young professionals who changed majors, dropped plans or found their field by accident.",
    color: "sky",
    tags: ["inspiration", "all majors"],
    zone: "Auditorium",
  },
  {
    id: "mentor-circles",
    title: "Mentor Circles",
    kicker: "Small groups",
    blurb:
      "Eight students, one university student from the major you're curious about, thirty minutes of no-filter questions.",
    color: "saffron",
    tags: ["all majors", "student life"],
    zone: "Library",
  },
  {
    id: "admissions-desk",
    title: "Admissions & Scholarships Desk",
    kicker: "The paperwork, decoded",
    blurb:
      "Thanaweya Amma, IGCSE, American Diploma and IB requirements, equivalency, SAT/IELTS timelines and scholarship options.",
    color: "nile",
    tags: ["admissions", "scholarships", "abroad"],
    zone: "Fair Hall",
  },
  {
    id: "parents-lounge",
    title: "Parents' Lounge",
    kicker: "For the people paying",
    blurb:
      "Sessions on supporting a teen's choice, the real cost of each path, and how the job market is shifting by 2030.",
    color: "brick",
    tags: ["parents"],
    zone: "Lounge",
  },
];

export type ScheduleItem = {
  time: string;
  title: string;
  where: string;
  track: "Stage" | "Labs" | "Fair" | "Parents";
};

export const SCHEDULE: ScheduleItem[] = [
  { time: "10:00", title: "Doors open · Compass Check-in & interest scan", where: "Main entrance", track: "Fair" },
  { time: "10:30", title: "Opening: Why nobody has it figured out at 17", where: "Auditorium", track: "Stage" },
  { time: "11:00", title: "University Fair opens", where: "Fair Hall", track: "Fair" },
  { time: "11:00", title: "Taster Labs · Round 1 (Engineering, Medicine, CS)", where: "Lab Wing", track: "Labs" },
  { time: "11:30", title: "Parents: Choosing with them, not for them", where: "Lounge", track: "Parents" },
  { time: "12:00", title: "Career Simulations open", where: "Studio Block", track: "Labs" },
  { time: "12:30", title: "The Detour · Talks block 1", where: "Auditorium", track: "Stage" },
  { time: "13:15", title: "Lunch break & courtyard music", where: "Courtyard", track: "Fair" },
  { time: "14:00", title: "Taster Labs · Round 2 (Design, Law, Business, Media)", where: "Lab Wing", track: "Labs" },
  { time: "14:00", title: "Parents: Real costs, scholarships, studying abroad", where: "Lounge", track: "Parents" },
  { time: "14:30", title: "Coding sprint & robotics arena finals", where: "Maker Yard", track: "Labs" },
  { time: "15:15", title: "The Detour · Talks block 2", where: "Auditorium", track: "Stage" },
  { time: "16:00", title: "Mentor Circles", where: "Library", track: "Fair" },
  { time: "16:45", title: "Closing: Your next 12 months", where: "Auditorium", track: "Stage" },
];

export const SPEAKERS = [
  { role: "Robotics engineer", topic: "I failed physics once. Now I build arms that move.", color: "lime" as Color, initials: "RE" },
  { role: "ER resident doctor", topic: "What a 30-hour shift actually looks like", color: "brick" as Color, initials: "MD" },
  { role: "Fintech founder", topic: "From commerce faculty to a startup in Cairo", color: "saffron" as Color, initials: "FF" },
  { role: "Architect & urbanist", topic: "Designing a city that doesn't exist yet", color: "nile" as Color, initials: "AU" },
  { role: "Product designer", topic: "Art school taught me to ship software", color: "rose" as Color, initials: "PD" },
  { role: "Human-rights lawyer", topic: "Law is less courtroom, more puzzle", color: "sky" as Color, initials: "HL" },
];

export const STATS = [
  { value: 40, suffix: "+", label: "universities & colleges" },
  { value: 60, suffix: "", label: "taster labs & simulations" },
  { value: 1500, suffix: "", label: "students expected" },
  { value: 7, suffix: "", label: "hours to change your mind" },
];

export const INTERESTS = [
  "Engineering",
  "Medicine & Health",
  "Computer Science & AI",
  "Business & Economics",
  "Law & Politics",
  "Design & Architecture",
  "Media & Film",
  "Science & Research",
  "Psychology & Education",
  "Not sure yet",
];

export const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12", "Gap year / other"];
export const CURRICULA = ["Thanaweya Amma", "IGCSE / British", "American Diploma", "IB", "Other"];
export const HEARD_FROM = ["My school", "Instagram", "TikTok", "A friend", "Parent / family", "Other"];

export const FAQ = [
  {
    q: "Who is Busla for?",
    a: "Students in Grades 9–12 from any school or curriculum, plus their parents. Educators and school counselors are welcome too.",
  },
  {
    q: "Is it free?",
    a: "Yes. Entry is free, but registration is required so we can plan lab and simulation seats. Each registration gets a ticket code to show at the door.",
  },
  {
    q: "Can my parents come?",
    a: "Please bring them. There's a dedicated Parents' Lounge with its own sessions running alongside the student program.",
  },
  {
    q: "Do I need to choose labs in advance?",
    a: "No. Lab and simulation seats are first-come at the event. Use Compass, our AI mentor, before you arrive to plan the activities worth your time.",
  },
  {
    q: "How do I get to Seven Pillars School?",
    a: "The school is in the New Administrative Capital. There'll be shuttle buses from central meeting points in Cairo; routes are emailed to registered guests one week before.",
  },
  {
    q: "My university or company wants to take part. Who do I talk to?",
    a: "Use the contact form at the bottom of the page and pick “Partner university” or “Sponsor”. We reply within two working days.",
  },
];
