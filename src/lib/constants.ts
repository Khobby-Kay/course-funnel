export const COURSE = {
  title: "Digital Marketing Mastery",
  headline:
    "The Exact 14-Day System to Start Earning Online — Even If You Have Zero Experience",
  subheadline:
    "1,000+ Africans used this step-by-step playbook to land clients, sell services, and build income streams — without a degree, connections, or expensive tools.",
  price: 399,
  oldPrice: 799,
  totalValue: 3200,
  currency: "GHS",
  lessons: "25+",
  duration: "14 Days",
  rating: 4.8,
  students: "1,000+",
  discount: "50% OFF — ENDS SOON",
  roiStatement: "One client pays for this 5× over",
  guaranteeDays: 30,
};

export const NAV_LINKS = [
  { label: "The System", href: "#modules" },
  { label: "What's Included", href: "#offer" },
  { label: "Results", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export const HERO_OUTCOMES = [
  "Land your first paying client in weeks",
  "Work from anywhere with a laptop",
  "Sell a skill companies already pay for",
  "Lifetime access — learn at your pace",
];

export const PAIN_AGITATE_SOLUTION = [
  {
    icon: "😤",
    title: "The Problem",
    description:
      "You want to earn online but don't know what to sell, who to sell to, or how to get paid. So you scroll, watch free videos, and stay stuck.",
    accent: "border-red-200 bg-red-50/80",
  },
  {
    icon: "⏳",
    title: "The Cost of Waiting",
    description:
      "Every month without a skill is another month depending on someone else. While others with the same phone as you are closing clients on WhatsApp.",
    accent: "border-orange-200 bg-orange-50/80",
  },
  {
    icon: "🎯",
    title: "The System",
    description:
      "A proven 5-module roadmap: learn the skill → build your offer → find clients → close deals → get paid. Copy the templates. Follow the steps. Execute.",
    accent: "border-purple/20 bg-purple/5",
  },
];

export const TRANSFORMATION = {
  before: [
    "Confused about where to start",
    "Watching free content with no results",
    "No portfolio, no clients, no income",
    "Afraid you're \"not tech enough\"",
  ],
  after: [
    "Clear offer you can sell this week",
    "Templates, scripts & step-by-step tasks",
    "System to find & close paying clients",
    "Certificate + skills employers pay for",
  ],
};

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Enroll & Get Instant Access",
    description: "Pay once. Login immediately. Every lesson, template, and bonus unlocked in seconds.",
  },
  {
    step: 2,
    title: "Follow the 14-Day Roadmap",
    description: "One module per few days. Watch, apply, use the templates. No guessing what to do next.",
  },
  {
    step: 3,
    title: "Launch & Get Paid",
    description: "Use the client-getting system to land your first deal. Most students aim for their first GHS 500–2,000 within 30 days.",
  },
];

export const VALUE_STACK = [
  { name: "Digital Marketing Mastery Course (25+ HD lessons)", value: 1200 },
  { name: "Client Acquisition Script Pack", value: 400 },
  { name: "90-Day Content Calendar Templates", value: 250 },
  { name: "Freelance Proposal & Invoice Templates", value: 200 },
  { name: "Niche & Offer Builder Worksheets", value: 150 },
  { name: "Private Student Community Access", value: 350 },
  { name: "Certificate of Completion", value: 150 },
  { name: "Lifetime Updates & New Modules", value: 500 },
] as const;

export const PRICING_INCLUDED = VALUE_STACK.map((item) => item.name);

export const CHECKOUT_INCLUDED = [
  ...VALUE_STACK.map((item) => item.name),
  `${COURSE.guaranteeDays}-day money-back guarantee`,
] as const;

export const PAYMENT_OPTIONS = [
  { id: "moolre" as const, label: "Mobile Money", hint: "MTN · Telecel · AT" },
  { id: "paystack" as const, label: "Paystack", hint: "MoMo & bank" },
  { id: "flutterwave" as const, label: "Flutterwave", hint: "Cards & MoMo" },
  { id: "card" as const, label: "Visa / Mastercard", hint: "Via Paystack" },
];

/** @deprecated Use PAYMENT_OPTIONS */
export const PAYMENT_METHODS = PAYMENT_OPTIONS.map((o) => o.label);

export const MODULES = [
  {
    number: 1,
    title: "Pick Your Profitable Niche",
    description:
      "Find what to sell in 48 hours — even with no experience. Skip the guesswork and choose an offer people already pay for.",
    icon: "🎯",
    outcome: "Your first sellable offer",
  },
  {
    number: 2,
    title: "Build a Brand That Converts",
    description:
      "Set up profiles, bios, and positioning that make strangers trust you — using our done-for-you templates.",
    icon: "🏗️",
    outcome: "A professional online presence",
  },
  {
    number: 3,
    title: "Get Traffic Without Ads",
    description:
      "Organic strategies that work on WhatsApp, Instagram, and Facebook — built for African audiences and budgets.",
    icon: "📈",
    outcome: "People discovering your offer",
  },
  {
    number: 4,
    title: "Turn Attention Into Money",
    description:
      "DM scripts, proposal templates, and closing frameworks used to convert leads into paying clients.",
    icon: "🔄",
    outcome: "Your first sales conversations",
  },
  {
    number: 5,
    title: "Scale & Stack Income",
    description:
      "Retainers, packages, and repeat clients — how to go from one-off gigs to predictable monthly income.",
    icon: "💰",
    outcome: "A repeatable income system",
  },
];

export const TESTIMONIALS = [
  {
    name: "Ama",
    location: "Accra",
    text: "I spent 6 months watching YouTube. This course gave me a system. Week 3 after finishing, I closed a GHS 2,000 social media client. The proposal template alone was worth 10× the price.",
    avatar: "A",
    result: "GHS 2,000 first client",
  },
  {
    name: "Kojo",
    location: "Kumasi",
    text: "I'm a student with no business background. The step-by-step modules removed all confusion. I now manage 2 small business accounts and earn more than my allowance.",
    avatar: "K",
    result: "2 paying clients",
  },
  {
    name: "Efua",
    location: "Takoradi",
    text: "What sold me was the guarantee — zero risk. I completed the course in 10 days, used the DM scripts, and got my first yes within a week. No fluff, just execution.",
    avatar: "E",
    result: "First client in 7 days",
  },
];

export const FAQ_ITEMS = [
  {
    question: "I've tried free content before. Why is this different?",
    answer:
      "Free content gives you information. This gives you a sequence — what to do on Day 1, Day 2, and so on — plus templates you copy and paste. You're buying speed and clarity, not more videos to watch.",
  },
  {
    question: "I have no experience. Will this work for me?",
    answer:
      "This was built for beginners. Module 1 starts from zero. If you can use a smartphone and follow instructions, you can do this. 1,000+ students started exactly where you are.",
  },
  {
    question: "How fast can I realistically earn?",
    answer:
      "Most focused students aim for their first paying client within 14–30 days. Results depend on your effort — but the system, scripts, and templates are designed to shorten the timeline dramatically.",
  },
  {
    question: "How long do I have access?",
    answer:
      "Forever. One payment, lifetime access — including every future update and new module we add. No subscriptions. No upsells required to finish.",
  },
  {
    question: "What if it doesn't work for me?",
    answer:
      `You're protected by a ${COURSE.guaranteeDays}-day money-back guarantee. Go through the material, apply the system — if you're not satisfied, email us for a full refund. We take the risk, not you.`,
  },
  {
    question: "Is payment secure?",
    answer:
      "Yes. Payments run through Moolre (Mobile Money), Paystack, and Flutterwave — the same platforms used by major African businesses. SSL encrypted end-to-end.",
  },
];

export const AUDIENCE = [
  { label: "Complete Beginners", hook: "Start from zero with a clear roadmap" },
  { label: "Students", hook: "Earn while you study — flexible hours" },
  { label: "Entrepreneurs", hook: "Add a high-demand skill to your business" },
  { label: "Job Seekers", hook: "Become hireable with proof of work" },
  { label: "Freelancers", hook: "Get clients faster with proven scripts" },
  { label: "Creators", hook: "Monetize your audience with offers that convert" },
];

export const GUARANTEE = {
  headline: "Try It Risk-Free for 30 Days",
  body: "Go through the course. Use the templates. Apply the client-getting system. If you don't feel it was worth every cedi, email us within 30 days for a full refund — no questions, no hassle. We're that confident in the system.",
};

export const CTAS = {
  primary: "Yes — Give Me Instant Access",
  secondary: "See What's Inside",
  sticky: "Get Access — GHS 399",
  checkout: "Complete My Enrollment",
  final: "Start Earning — Enroll Now",
};

export const INSTRUCTOR = {
  name: "Kwame Asante",
  title: "Digital Marketing Strategist & Client Acquisition Coach",
  quote:
    "I don't teach theory. I teach the exact system I used to help 5,000+ Africans go from zero to paid — and you get every template I wish I had when I started.",
};
