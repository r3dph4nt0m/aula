export type HouseId = "gryffindor" | "slytherin" | "ravenclaw" | "hufflepuff"

export type House = {
  id: HouseId
  name: string
  motto: string
  element: string
  emblem: string // lucide icon key handled in component
  className: string
  points: number
  lastPeriodPoints: number
  members: number
  trophies: number
  founded: string
  colorName: string
}

export const houses: Record<HouseId, House> = {
  gryffindor: {
    id: "gryffindor",
    name: "Gryffindor",
    motto: "Courage above all",
    element: "Fire",
    emblem: "flame",
    className: "house-gryffindor",
    points: 4820,
    lastPeriodPoints: 4310,
    members: 214,
    trophies: 11,
    founded: "MCMX?—reimagined 2019",
    colorName: "Scarlet & Gold",
  },
  ravenclaw: {
    id: "ravenclaw",
    name: "Ravenclaw",
    motto: "Wit beyond measure",
    element: "Air",
    emblem: "feather",
    className: "house-ravenclaw",
    points: 5040,
    lastPeriodPoints: 4260,
    members: 208,
    trophies: 14,
    founded: "reimagined 2019",
    colorName: "Midnight & Bronze",
  },
  slytherin: {
    id: "slytherin",
    name: "Slytherin",
    motto: "Ambition finds a way",
    element: "Water",
    emblem: "waves",
    className: "house-slytherin",
    points: 4655,
    lastPeriodPoints: 4590,
    members: 219,
    trophies: 13,
    founded: "reimagined 2019",
    colorName: "Emerald & Silver",
  },
  hufflepuff: {
    id: "hufflepuff",
    name: "Hufflepuff",
    motto: "Loyalty is earned",
    element: "Earth",
    emblem: "sprout",
    className: "house-hufflepuff",
    points: 4390,
    lastPeriodPoints: 3980,
    members: 226,
    trophies: 9,
    founded: "reimagined 2019",
    colorName: "Amber & Slate",
  },
}

export const houseOrder: HouseId[] = ["ravenclaw", "gryffindor", "slytherin", "hufflepuff"]

export function rankedHouses() {
  return Object.values(houses).sort((a, b) => b.points - a.points)
}

export const currentUser = {
  name: "Elouan Mercier",
  firstName: "Elouan",
  handle: "@elouan.m",
  house: "ravenclaw" as HouseId,
  grade: "Première S — Section Internationale",
  year: "Year 12",
  level: 24,
  levelTitle: "Prefect Scholar",
  xp: 18420,
  xpIntoLevel: 420,
  xpForLevel: 900,
  rankInHouse: 7,
  rankInSchool: 41,
  streak: 12,
  coins: 342,
  trashCoins: 128,
  readingCoins: 76,
  housePointsContributed: 1240,
  avatarInitials: "EM",
  studentId: "SIA-2027-0412",
}

export type ActivityItem = {
  id: string
  type: "xp" | "house" | "trash" | "reading" | "badge" | "coin"
  title: string
  detail: string
  amount: string
  time: string
}

export const recentActivity: ActivityItem[] = [
  { id: "a1", type: "trash", title: "SmartBin deposit", detail: "Sorted PET plastic — Hall C", amount: "+5 Trash", time: "12m ago" },
  { id: "a2", type: "house", title: "House points awarded", detail: "Physics olympiad qualifier", amount: "+120 HP", time: "1h ago" },
  { id: "a3", type: "reading", title: "Reading session logged", detail: "\u201cThe Left Hand of Darkness\u201d — 38 pages", amount: "+8 Reading", time: "3h ago" },
  { id: "a4", type: "badge", title: "Badge unlocked", detail: "Two-week reading streak", amount: "Streak II", time: "Yesterday" },
  { id: "a5", type: "xp", title: "Challenge completed", detail: "Weekly recycling target", amount: "+240 XP", time: "Yesterday" },
  { id: "a6", type: "coin", title: "Cafeteria credit used", detail: "Lunch — Menu végétarien", amount: "-4 Coins", time: "2d ago" },
]

export type Challenge = {
  id: string
  title: string
  category: "Ecology" | "Academic" | "Community" | "Reading"
  progress: number
  goal: number
  unit: string
  reward: string
  endsIn: string
}

export const challenges: Challenge[] = [
  { id: "c1", title: "Zero-waste week", category: "Ecology", progress: 4, goal: 5, unit: "deposits", reward: "+50 Trash Coins", endsIn: "2 days" },
  { id: "c2", title: "Read 150 pages", category: "Reading", progress: 112, goal: 150, unit: "pages", reward: "+30 Reading Coins", endsIn: "4 days" },
  { id: "c3", title: "House study circle", category: "Academic", progress: 2, goal: 3, unit: "sessions", reward: "+180 House Points", endsIn: "5 days" },
  { id: "c4", title: "Volunteer at open day", category: "Community", progress: 0, goal: 1, unit: "shift", reward: "+300 XP", endsIn: "1 week" },
]

export type EventItem = {
  id: string
  title: string
  date: string
  day: string
  month: string
  time: string
  location: string
  organizer: string
  category: string
  capacity: number
  registered: number
  status: "open" | "almost-full" | "registered" | "waitlist"
}

export const events: EventItem[] = [
  { id: "e1", title: "Inter-House Debate Final", date: "Thu 20 Mar", day: "20", month: "MAR", time: "17:30 — 19:00", location: "Auditorium A", organizer: "Debate Society", category: "Competition", capacity: 220, registered: 198, status: "registered" },
  { id: "e2", title: "Spring Reading Night", date: "Fri 21 Mar", day: "21", month: "MAR", time: "18:00 — 21:00", location: "Library — East Wing", organizer: "Reading Club", category: "Culture", capacity: 90, registered: 61, status: "open" },
  { id: "e3", title: "Ecology Fair & SmartBin Launch", date: "Sat 22 Mar", day: "22", month: "MAR", time: "10:00 — 16:00", location: "Central Courtyard", organizer: "Green Committee", category: "Ecology", capacity: 400, registered: 355, status: "almost-full" },
  { id: "e4", title: "House Cup Mid-Term Ceremony", date: "Wed 26 Mar", day: "26", month: "MAR", time: "12:30 — 13:30", location: "Grand Hall", organizer: "Student Council", category: "Ceremony", capacity: 500, registered: 500, status: "waitlist" },
]

export type NewsItem = {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  readTime: string
  date: string
  featured?: boolean
  accentHouse?: HouseId
}

export const news: NewsItem[] = [
  { id: "n1", title: "Ravenclaw edges ahead as mid-term House Cup tightens", excerpt: "A decisive week in the sciences pushed Ravenclaw to the top of the table — but only 220 points separate the leaders from fourth place.", category: "House Cup", author: "Student Council", readTime: "4 min", date: "18 March", featured: true, accentHouse: "ravenclaw" },
  { id: "n2", title: "The library after dark: inside Spring Reading Night", excerpt: "Ninety students, one candlelit east wing, and a reading marathon that redefined the school record.", category: "Culture", author: "Léa Fontaine", readTime: "6 min", date: "16 March" },
  { id: "n3", title: "SmartBins have diverted 1.2 tonnes of waste this term", excerpt: "The numbers behind the school's ecology programme, and what happens to your Trash Coins.", category: "Ecology", author: "Green Committee", readTime: "3 min", date: "14 March" },
  { id: "n4", title: "Meet the new student proposals shaping campus life", excerpt: "From a rooftop garden to later library hours — the ideas students are voting on this month.", category: "Participation", author: "Editorial", readTime: "5 min", date: "12 March" },
]

export type Badge = {
  id: string
  name: string
  description: string
  icon: string
  tier: "bronze" | "silver" | "gold"
  unlocked: boolean
  date?: string
}

export const badges: Badge[] = [
  { id: "b1", name: "First Deposit", description: "Made your first SmartBin deposit", icon: "recycle", tier: "bronze", unlocked: true, date: "Sep 2026" },
  { id: "b2", name: "Bookworm", description: "Finished 10 books this year", icon: "book-open", tier: "gold", unlocked: true, date: "Feb 2027" },
  { id: "b3", name: "House Champion", description: "Top-10 contributor in your house", icon: "trophy", tier: "silver", unlocked: true, date: "Jan 2027" },
  { id: "b4", name: "Streak Keeper", description: "14-day activity streak", icon: "flame", tier: "silver", unlocked: true, date: "Mar 2027" },
  { id: "b5", name: "Debate Laureate", description: "Won an inter-house debate", icon: "megaphone", tier: "gold", unlocked: true, date: "Nov 2026" },
  { id: "b6", name: "Green Warden", description: "Sort 200 items correctly", icon: "leaf", tier: "gold", unlocked: false },
  { id: "b7", name: "Marathon Reader", description: "Read for 50 hours", icon: "timer", tier: "silver", unlocked: false },
  { id: "b8", name: "Founder's Circle", description: "Reach level 30", icon: "crown", tier: "gold", unlocked: false },
]

export const houseTimeline = [
  { term: "2019", title: "The houses are re-founded", detail: "A new charter revives the four-house tradition for the international section." },
  { term: "2021", title: "First Ecology Cup", detail: "Ravenclaw takes the inaugural sustainability trophy." },
  { term: "2023", title: "Reading Marathon record", detail: "House members log a combined 12,400 pages in a single term." },
  { term: "2026", title: "SmartBin network goes live", detail: "NFC-enabled deposits begin feeding the House Cup in real time." },
]

export const houseMembers = [
  { name: "Amara Diallo", role: "House Captain", points: 1980, initials: "AD" },
  { name: "Elouan Mercier", role: "Prefect", points: 1240, initials: "EM" },
  { name: "Sofia Marchetti", role: "Reading Lead", points: 1120, initials: "SM" },
  { name: "Tomás Herrera", role: "Ecology Warden", points: 980, initials: "TH" },
  { name: "Nour El-Amin", role: "Member", points: 870, initials: "NE" },
  { name: "Ines Lefebvre", role: "Member", points: 760, initials: "IL" },
]

export const readingData = {
  currentBook: {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    pagesRead: 214,
    totalPages: 304,
    startedAt: "5 March",
  },
  stats: {
    booksThisYear: 11,
    pagesThisYear: 3120,
    minutesThisMonth: 640,
    streakDays: 12,
  },
  shelf: [
    { title: "Kindred", author: "Octavia E. Butler", pages: 288 },
    { title: "The Overstory", author: "Richard Powers", pages: 502 },
    { title: "Persepolis", author: "Marjane Satrapi", pages: 341 },
    { title: "Sapiens", author: "Yuval Noah Harari", pages: 443 },
  ],
  schoolRanking: [
    { name: "Sofia Marchetti", house: "slytherin" as HouseId, pages: 4820 },
    { name: "Amara Diallo", house: "gryffindor" as HouseId, pages: 4210 },
    { name: "Elouan Mercier", house: "ravenclaw" as HouseId, pages: 3120 },
    { name: "Kenji Watanabe", house: "hufflepuff" as HouseId, pages: 2990 },
  ],
}

export const smartbinData = {
  personal: { deposits: 148, itemsSorted: 412, trashCoins: 128, co2Saved: 34 },
  houseRanking: [
    { house: "slytherin" as HouseId, kg: 328 },
    { house: "ravenclaw" as HouseId, kg: 311 },
    { house: "gryffindor" as HouseId, kg: 287 },
    { house: "hufflepuff" as HouseId, kg: 244 },
  ],
  school: { totalKg: 1170, itemsSorted: 24800, activeBins: 18, participation: 82 },
}

export const cafeteriaStudent = {
  name: "Elouan Mercier",
  studentId: "SIA-2027-0412",
  house: "ravenclaw" as HouseId,
  balance: 24.5,
  debt: 0,
  transactions: [
    { id: "t1", label: "Menu végétarien", amount: -4.2, time: "Today 12:34", type: "purchase" },
    { id: "t2", label: "Credit added — parent portal", amount: 20, time: "Mon 08:10", type: "credit" },
    { id: "t3", label: "Sandwich & juice", amount: -3.8, time: "Fri 12:50", type: "purchase" },
    { id: "t4", label: "Menu du jour", amount: -4.5, time: "Thu 12:41", type: "purchase" },
  ],
}

export const adminStats = {
  activeStudents: 867,
  weeklyActive: 741,
  housePointsWeek: 6420,
  smartbinKgWeek: 214,
  alerts: [
    { id: "al1", level: "warning", text: "3 SmartBins report near-full capacity (Hall C, Gym, Library)." },
    { id: "al2", level: "info", text: "House Cup mid-term ceremony reaches registration cap." },
    { id: "al3", level: "critical", text: "Cafeteria: 12 accounts exceeded debt threshold." },
  ],
  weeklyPoints: [
    { day: "Mon", ravenclaw: 220, gryffindor: 180, slytherin: 160, hufflepuff: 140 },
    { day: "Tue", ravenclaw: 260, gryffindor: 210, slytherin: 190, hufflepuff: 170 },
    { day: "Wed", ravenclaw: 300, gryffindor: 240, slytherin: 220, hufflepuff: 210 },
    { day: "Thu", ravenclaw: 280, gryffindor: 300, slytherin: 250, hufflepuff: 230 },
    { day: "Fri", ravenclaw: 340, gryffindor: 290, slytherin: 300, hufflepuff: 260 },
  ],
}

export type Poll = {
  id: string
  question: string
  status: "open" | "closed"
  totalVotes: number
  endsIn?: string
  options: { label: string; votes: number }[]
  voted?: number
}

export const polls: Poll[] = [
  {
    id: "p1",
    question: "Which theme should the Spring Gala follow?",
    status: "open",
    totalVotes: 412,
    endsIn: "3 days",
    voted: 1,
    options: [
      { label: "Nuit étoilée", votes: 186 },
      { label: "Renaissance", votes: 121 },
      { label: "Futures", votes: 105 },
    ],
  },
  {
    id: "p2",
    question: "Extend library hours until 20:00 on weekdays?",
    status: "closed",
    totalVotes: 640,
    options: [
      { label: "Yes", votes: 512 },
      { label: "No", votes: 128 },
    ],
  },
]

export type Proposal = {
  id: string
  title: string
  author: string
  house: HouseId
  votes: number
  comments: number
  status: "under-review" | "approved" | "in-progress" | "declined"
  excerpt: string
}

export const proposals: Proposal[] = [
  { id: "pr1", title: "Rooftop garden managed by the Green Committee", author: "Nour El-Amin", house: "hufflepuff", votes: 284, comments: 41, status: "in-progress", excerpt: "Convert the unused C-block roof into a student-run garden feeding the cafeteria." },
  { id: "pr2", title: "Silent study pods in the East Wing", author: "Sofia Marchetti", house: "slytherin", votes: 213, comments: 22, status: "approved", excerpt: "Bookable single-person pods for focused revision during exam season." },
  { id: "pr3", title: "House playlist takeover in the cafeteria", author: "Amara Diallo", house: "gryffindor", votes: 176, comments: 30, status: "under-review", excerpt: "Each week the leading house curates the lunchtime playlist." },
  { id: "pr4", title: "Reading Coins redeemable for book vouchers", author: "Elouan Mercier", house: "ravenclaw", votes: 158, comments: 18, status: "under-review", excerpt: "Let students convert Reading Coins into vouchers at the school bookshop." },
]

export const ceremonyQuestions = [
  {
    id: "q1",
    prompt: "When the school faces a challenge, you are the first to…",
    options: [
      { label: "Rally everyone and lead from the front", house: "gryffindor" as HouseId },
      { label: "Study the problem until you find the elegant answer", house: "ravenclaw" as HouseId },
      { label: "Find the opportunity others overlook", house: "slytherin" as HouseId },
      { label: "Make sure no one is left behind", house: "hufflepuff" as HouseId },
    ],
  },
  {
    id: "q2",
    prompt: "Your ideal Saturday at school is…",
    options: [
      { label: "Captaining the inter-house tournament", house: "gryffindor" as HouseId },
      { label: "A quiet corner of the library and a hard book", house: "ravenclaw" as HouseId },
      { label: "Pitching a bold idea to the student council", house: "slytherin" as HouseId },
      { label: "Volunteering at the community open day", house: "hufflepuff" as HouseId },
    ],
  },
  {
    id: "q3",
    prompt: "Which value do you refuse to compromise on?",
    options: [
      { label: "Courage", house: "gryffindor" as HouseId },
      { label: "Wisdom", house: "ravenclaw" as HouseId },
      { label: "Ambition", house: "slytherin" as HouseId },
      { label: "Loyalty", house: "hufflepuff" as HouseId },
    ],
  },
  {
    id: "q4",
    prompt: "People describe you as…",
    options: [
      { label: "Bold and warm", house: "gryffindor" as HouseId },
      { label: "Curious and precise", house: "ravenclaw" as HouseId },
      { label: "Driven and resourceful", house: "slytherin" as HouseId },
      { label: "Steady and kind", house: "hufflepuff" as HouseId },
    ],
  },
]

export const navItems = [
  { href: "/", label: "Home", icon: "house", group: "student" },
  { href: "/house", label: "My House", icon: "shield", group: "student" },
  { href: "/house-cup", label: "House Cup", icon: "trophy", group: "student" },
  { href: "/reading", label: "Reading", icon: "book-open", group: "student" },
  { href: "/events", label: "Events", icon: "calendar", group: "student" },
  { href: "/news", label: "News", icon: "newspaper", group: "student" },
  { href: "/participation", label: "Participation", icon: "vote", group: "student" },
  { href: "/profile", label: "Profile", icon: "user", group: "student" },
] as const

export const serviceNav = [
  { href: "/smartbin", label: "SmartBin", icon: "recycle" },
  { href: "/cafeteria", label: "Cafeteria", icon: "utensils" },
  { href: "/admin", label: "Admin", icon: "layout-dashboard" },
] as const
