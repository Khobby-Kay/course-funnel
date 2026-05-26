import type { CourseDefinition } from "./types";

/** Shared Hormozi-style sales patterns adapted for African digital earners. */
export const HORMOZI_GUARANTEE = {
  headline: "Try it risk-free for 30 days",
  body: "Go through the program and use the templates. If you would not pay 10× the price for what you got, email us for a full refund. We only win when you win.",
};

export const HORMOZI_CTAS = {
  primary: "Yes — I want instant access",
  secondary: "See the full offer",
  checkout: "Complete my enrollment",
  final: "Enroll now — lock in this price",
};

function baseLms(slug: string, title: string): CourseDefinition["lms"] {
  return {
    modules: [
      {
        id: `${slug}-m1`,
        number: 1,
        title: "Start here",
        icon: "1",
        outcome: "Your first action step done",
        lessons: [
          {
            id: `${slug}-m1-l1`,
            number: 1,
            title: `Welcome to ${title}`,
            duration: "8 min",
            summary: "How to get results fast from this playbook.",
            content: [
              "Watch this first — it shows you exactly how to use every template.",
              "Do not binge. Complete one module, apply it, then move on.",
            ],
            actionStep: "Write your #1 income goal for the next 30 days.",
          },
        ],
      },
    ],
    bonusResources: [
      { id: "templates", title: "Playbook templates (PDF)", icon: "PDF" },
      { id: "scripts", title: "Copy-paste scripts", icon: "DOC" },
    ],
  };
}

export function createGrandSlamOffersCourse(): CourseDefinition {
  const slug = "grand-slam-offers";
  return {
    id: slug,
    slug,
    badge: "OFF",
    brandName: "Offer Playbook",
    status: "published",
    catalog: {
      emoji: "",
      tagline: "Build offers people feel stupid saying no to",
      description:
        "The same offer-building framework used by top acquisition coaches — adapted for freelancers, creators, and service sellers in Ghana and West Africa.",
      highlights: [
        "5-module offer system",
        "Pricing & guarantee templates",
        "30-day money-back guarantee",
      ],
    },
    marketing: {
      course: {
        title: "The Grand Slam Offer Playbook",
        headline: "Build an Offer So Good People Feel Stupid Saying No",
        subheadline:
          "Stop competing on price. Package your skill into a premium offer with guarantees, bonuses, and positioning that makes MoMo checkout feel like a steal — even at GHS 500+.",
        price: 449,
        oldPrice: 899,
        totalValue: 3800,
        currency: "GHS",
        lessons: "18+",
        duration: "7 Days",
        rating: 4.9,
        students: "350+",
        discount: "LAUNCH PRICING — LIMITED",
        roiStatement: "One premium client covers this 5× over",
        guaranteeDays: 30,
      },
      whatYouGet: [
        "Full video training — 5 modules, watch on any device",
        "Offer Builder Worksheet — name, price, and package your service in one sitting",
        "Grand Slam Value Stack template — line-item bonuses like top acquisition offers",
        "Pricing ladder cheat sheet — starter, core, and premium tiers",
        "Risk-reversal scripts — guarantees that increase yeses without killing margin",
        "Before/after positioning examples for Ghana & West African markets",
        "Lifetime access + all future offer templates we add",
      ],
      offerSystems: [
        {
          name: "System 1 — Offer design",
          tagline: "Make the thing you sell obvious and irresistible.",
          playbooks: [
            {
              title: "Niche & outcome picker",
              description: "Choose who you serve and the one result you promise in 14–30 days.",
            },
            {
              title: "Value equation worksheet",
              description: "Increase dream outcome and likelihood; decrease time and effort.",
            },
            {
              title: "Bonus naming library",
              description: "Turn basic deliverables into named assets that inflate perceived value.",
            },
          ],
        },
        {
          name: "System 2 — Pricing & risk reversal",
          tagline: "Charge more without losing sales.",
          playbooks: [
            {
              title: "Three-tier pricing sheet",
              description: "Good / better / best packages for MoMo-friendly price points.",
            },
            {
              title: "Guarantee selector",
              description: "Conditional, unconditional, and anti-guarantee options with copy.",
            },
            {
              title: "Objection pre-handle FAQ",
              description: "Answer price, time, and trust objections before checkout.",
            },
          ],
        },
      ],
      navLinks: [
        { label: "Playbooks", href: "#playbooks" },
        { label: "What's included", href: "#included" },
        { label: "Curriculum", href: "#modules" },
        { label: "FAQ", href: "#faq" },
      ],
      heroOutcomes: [
        "A named offer you can sell this week",
        "Pricing that feels premium, not cheap",
        "Guarantee language that removes buyer fear",
        "Templates you copy — not blank pages",
      ],
      painAgitateSolution: [
        {
          icon: "1",
          title: "Competing on price",
          description:
            "You charge GHS 50 for work worth GHS 500 because your offer sounds like everyone else's.",
          accent: "border-red-200 bg-red-50/80",
        },
        {
          icon: "2",
          title: "The cost of a weak offer",
          description:
            "Every 'let me think about it' is an offer problem. Strong offers convert on the first conversation.",
          accent: "border-orange-200 bg-orange-50/80",
        },
        {
          icon: "3",
          title: "The grand slam fix",
          description:
            "Stack outcomes, bonuses, and risk reversal until the value gap is obvious. Price becomes a detail.",
          accent: "border-purple/20 bg-purple/5",
        },
      ],
      transformation: {
        before: [
          "Generic 'I do social media' pitch",
          "Clients haggling on every job",
          "No clear deliverables or timeline",
          "Afraid to raise prices",
        ],
        after: [
          "Named offer with clear outcome",
          "Three price tiers ready to present",
          "Bonus stack that justifies premium fees",
          "Guarantee that builds trust fast",
        ],
      },
      howItWorks: [
        {
          step: 1,
          title: "Enroll — instant access",
          description: "Pay once. Every video, worksheet, and template unlocks immediately.",
        },
        {
          step: 2,
          title: "Build your offer in 7 days",
          description: "Follow the modules in order. Each ends with a finished asset, not notes.",
        },
        {
          step: 3,
          title: "Sell it the same week",
          description: "Use the scripts to present your new offer on WhatsApp or calls.",
        },
      ],
      valueStack: [
        { name: "Grand Slam Offer video course (18+ lessons)", value: 1400 },
        { name: "Offer Builder Worksheet & value stack template", value: 450 },
        { name: "Three-tier pricing & guarantee library", value: 350 },
        { name: "Bonus naming & positioning swipe file", value: 300 },
        { name: "Sales conversation one-pager template", value: 250 },
        { name: "Lifetime updates & new playbooks", value: 550 },
        { name: "30-day money-back guarantee", value: 500 },
      ],
      modules: [
        {
          number: 1,
          title: "Pick a market that pays",
          description: "Choose a niche with money in motion — local businesses, creators, or B2B services.",
          icon: "1",
          outcome: "One target buyer profile",
        },
        {
          number: 2,
          title: "Craft the core promise",
          description: "Turn your skill into a specific outcome with a deadline.",
          icon: "2",
          outcome: "One-line grand slam headline",
        },
        {
          number: 3,
          title: "Stack the value",
          description: "Add bonuses until your offer feels like a steal at your target price.",
          icon: "3",
          outcome: "Complete value stack slide",
        },
        {
          number: 4,
          title: "Price & guarantee",
          description: "Set tiers, payment terms, and risk reversal that fit MoMo buyers.",
          icon: "4",
          outcome: "Published price sheet",
        },
        {
          number: 5,
          title: "Launch the offer",
          description: "Post, pitch, and present using the included scripts.",
          icon: "5",
          outcome: "First conversations booked",
        },
      ],
      testimonials: [
        {
          name: "Abena",
          location: "Accra",
          text: "I renamed my package and tripled the price. Same work — different offer. First yes came two days after I updated my WhatsApp status.",
          avatar: "A",
          result: "3× price, first sale in 48h",
        },
        {
          name: "Yaw",
          location: "Tema",
          text: "The guarantee template removed the awkwardness. Clients stopped ghosting after I sent the one-pager.",
          avatar: "Y",
          result: "Higher close rate",
        },
      ],
      faqItems: [
        {
          question: "Do I need an existing business?",
          answer: "No. This is for anyone selling a skill — freelancing, agency work, coaching, or digital services.",
        },
        {
          question: "Is this copied from Hormozi?",
          answer: "It applies the same offer principles (value stacking, risk reversal, premium packaging) to African markets — with GHS pricing examples and MoMo-friendly checkout.",
        },
        {
          question: "How is this different from Digital Marketing Mastery?",
          answer: "Digital Marketing teaches the full client-getting system. This course is ONLY about packaging and pricing what you sell — do this first if your offer is weak.",
        },
      ],
      audience: [
        { label: "Freelancers", hook: "Stop undercharging for the same deliverables" },
        { label: "Agency owners", hook: "Productize services into clear packages" },
        { label: "Creators", hook: "Turn content skills into premium offers" },
        { label: "Side hustlers", hook: "Launch one offer before building everything" },
      ],
      guarantee: HORMOZI_GUARANTEE,
      ctas: { ...HORMOZI_CTAS, sticky: "Get access — GHS 449" },
      instructor: {
        name: "African Skills Academy",
        title: "Offer systems for digital earners",
        quote:
          "You do not have a traffic problem. You have an offer problem. Fix the offer — everything else gets easier.",
      },
    },
    lms: baseLms(slug, "Grand Slam Offer Playbook"),
  };
}

export function createClientLeadsSystemCourse(): CourseDefinition {
  const slug = "client-leads-system";
  return {
    id: slug,
    slug,
    badge: "LD",
    brandName: "Leads System",
    status: "published",
    catalog: {
      emoji: "",
      tagline: "Fill your pipeline without ad spend",
      description:
        "Lead generation playbooks for WhatsApp, Instagram, and referrals — built for African budgets and buyer behavior.",
      highlights: [
        "Organic + low-budget ads",
        "DM & outreach scripts",
        "Lead nurture templates",
      ],
    },
    marketing: {
      course: {
        title: "The Client Leads System",
        headline: "Get Strangers to Raise Their Hand and Say \"I'm Interested\"",
        subheadline:
          "A practical lead system for Ghana and West Africa — content hooks, DM scripts, lead magnets, and follow-up sequences that turn attention into booked calls.",
        price: 399,
        oldPrice: 799,
        totalValue: 3400,
        currency: "GHS",
        lessons: "22+",
        duration: "10 Days",
        rating: 4.8,
        students: "420+",
        discount: "ENROLLMENT OPEN",
        roiStatement: "One new client pays for this many times over",
        guaranteeDays: 30,
      },
      whatYouGet: [
        "22+ video lessons — lead gen without guessing",
        "Lead magnet builder — PDF/checklist your audience actually wants",
        "30-day content hook library — posts that start conversations",
        "Cold & warm DM scripts for WhatsApp and Instagram",
        "Lead nurture sequence — 5 follow-ups that aren't annoying",
        "Simple tracking sheet — know where every lead came from",
        "Lifetime access + future lead templates",
      ],
      offerSystems: [
        {
          name: "System 1 — Attract",
          tagline: "Get attention from the right people.",
          playbooks: [
            {
              title: "Hook & headline bank",
              description: "50+ proven openers adapted for local business owners.",
            },
            {
              title: "Lead magnet builder",
              description: "Checklist, template, or mini-guide that trades value for contact info.",
            },
            {
              title: "Profile conversion audit",
              description: "Bio, link, and pinned post setup that converts views to DMs.",
            },
          ],
        },
        {
          name: "System 2 — Nurture & book",
          tagline: "Turn interest into booked conversations.",
          playbooks: [
            {
              title: "DM qualification script",
              description: "Three questions that filter serious buyers in under 2 minutes.",
            },
            {
              title: "5-touch follow-up sequence",
              description: "WhatsApp messages when they go quiet — without being pushy.",
            },
            {
              title: "Booking & reminder templates",
              description: "Calendar links, MoMo deposit asks, and show-up reminders.",
            },
          ],
        },
      ],
      navLinks: [
        { label: "Playbooks", href: "#playbooks" },
        { label: "What's included", href: "#included" },
        { label: "Curriculum", href: "#modules" },
        { label: "FAQ", href: "#faq" },
      ],
      heroOutcomes: [
        "A lead magnet you can publish this week",
        "DM scripts that start real conversations",
        "Content plan that attracts buyers — not likes",
        "Follow-up system so leads don't go cold",
      ],
      painAgitateSolution: [
        {
          icon: "1",
          title: "Posting with no leads",
          description: "You get views but no DMs. Content without a lead system is entertainment.",
          accent: "border-red-200 bg-red-50/80",
        },
        {
          icon: "2",
          title: "Feast or famine",
          description: "One good month, then silence. Without a pipeline, you're always starting from zero.",
          accent: "border-orange-200 bg-orange-50/80",
        },
        {
          icon: "3",
          title: "The leads system",
          description: "Attract → capture → nurture → book. Repeat weekly until the pipeline is full.",
          accent: "border-purple/20 bg-purple/5",
        },
      ],
      transformation: {
        before: [
          "Random posting, no strategy",
          "Afraid to DM strangers",
          "No list, no follow-up",
          "Waiting for referrals only",
        ],
        after: [
          "Weekly content that generates DMs",
          "Scripts for warm and cold outreach",
          "Lead magnet collecting contacts",
          "Follow-up sequence running on autopilot",
        ],
      },
      howItWorks: [
        {
          step: 1,
          title: "Enroll & unlock",
          description: "Instant access to every lesson, script, and template.",
        },
        {
          step: 2,
          title: "Launch your lead magnet",
          description: "Publish one asset that trades value for WhatsApp numbers or emails.",
        },
        {
          step: 3,
          title: "Run the weekly rhythm",
          description: "Content → DMs → follow-up → booked calls. Track it on one sheet.",
        },
      ],
      valueStack: [
        { name: "Client Leads System course (22+ lessons)", value: 1300 },
        { name: "Lead magnet builder & examples", value: 400 },
        { name: "30-day hook & content library", value: 350 },
        { name: "DM & outreach script pack", value: 350 },
        { name: "5-touch nurture sequence", value: 300 },
        { name: "Lead tracking spreadsheet", value: 150 },
        { name: "Lifetime updates", value: 550 },
      ],
      modules: [
        {
          number: 1,
          title: "Choose your lead channel",
          description: "WhatsApp, Instagram, or both — pick where your buyers already are.",
          icon: "1",
          outcome: "One primary channel",
        },
        {
          number: 2,
          title: "Build the magnet",
          description: "Create a checklist or template worth saving their number for.",
          icon: "2",
          outcome: "Published lead magnet",
        },
        {
          number: 3,
          title: "Content that converts",
          description: "Hooks, stories, and CTAs that drive DMs — not just engagement.",
          icon: "3",
          outcome: "2-week content calendar",
        },
        {
          number: 4,
          title: "Outreach & DMs",
          description: "Warm and cold scripts that feel human, not spammy.",
          icon: "4",
          outcome: "10 conversations started",
        },
        {
          number: 5,
          title: "Nurture & book",
          description: "Follow up until they book or say no — with templates for both.",
          icon: "5",
          outcome: "First call booked",
        },
      ],
      testimonials: [
        {
          name: "Kofi",
          location: "Kumasi",
          text: "The DM script got me 4 replies in one afternoon. I was terrified of outreach before this.",
          avatar: "K",
          result: "4 qualified DMs day 1",
        },
        {
          name: "Ama",
          location: "Accra",
          text: "Lead magnet + follow-up sequence = 3 discovery calls in 10 days. All organic.",
          avatar: "A",
          result: "3 calls in 10 days",
        },
      ],
      faqItems: [
        {
          question: "Do I need ad budget?",
          answer: "No. The core system is organic. We include a simple intro to boosting posts later if you want.",
        },
        {
          question: "Will this work outside Ghana?",
          answer: "Yes — WhatsApp-first outreach works across West Africa. Examples use GHS and local context.",
        },
      ],
      audience: [
        { label: "Beginners", hook: "Get your first leads without ads" },
        { label: "Freelancers", hook: "Stop waiting for referrals" },
        { label: "Agencies", hook: "Fill the top of your pipeline weekly" },
      ],
      guarantee: HORMOZI_GUARANTEE,
      ctas: { ...HORMOZI_CTAS, sticky: "Get access — GHS 399" },
      instructor: {
        name: "African Skills Academy",
        title: "Client acquisition for African markets",
        quote: "Leads are the lifeblood. One predictable system beats ten random tactics.",
      },
    },
    lms: baseLms(slug, "Client Leads System"),
  };
}

export function createCloseMoreClientsCourse(): CourseDefinition {
  const slug = "close-more-clients";
  return {
    id: slug,
    slug,
    badge: "SL",
    brandName: "Sales Playbook",
    status: "published",
    catalog: {
      emoji: "",
      tagline: "Turn conversations into MoMo payments",
      description:
        "Discovery calls, objection handling, and closing frameworks for selling services on WhatsApp and phone — no sleazy tactics.",
      highlights: [
        "Discovery call script",
        "Objection handling bank",
        "MoMo closing flow",
      ],
    },
    marketing: {
      course: {
        title: "Close More Clients",
        headline: "Stop Losing Deals at \"Let Me Think About It\"",
        subheadline:
          "The sales playbook for service sellers — discovery questions, objection scripts, and closing flows that work when payment means Mobile Money, not a card form.",
        price: 349,
        oldPrice: 699,
        totalValue: 2900,
        currency: "GHS",
        lessons: "16+",
        duration: "5 Days",
        rating: 4.9,
        students: "280+",
        discount: "NEW PROGRAM",
        roiStatement: "One closed deal covers this 10× over",
        guaranteeDays: 30,
      },
      whatYouGet: [
        "16+ video lessons — sales without being salesy",
        "Discovery call script — 15 questions that uncover budget and urgency",
        "Objection handling bank — price, time, trust, and \"I need to ask\"",
        "WhatsApp closing sequence — from interest to MoMo payment",
        "Proposal & invoice templates — look professional, get paid faster",
        "Follow-up after no — recover deals that went quiet",
        "Lifetime access + script updates",
      ],
      offerSystems: [
        {
          name: "System 1 — Discovery",
          tagline: "Diagnose before you prescribe.",
          playbooks: [
            {
              title: "15-question discovery script",
              description: "Uncover pain, budget, timeline, and decision-maker in one call.",
            },
            {
              title: "Problem-solution bridge",
              description: "Transition from their words to your offer without a hard pitch.",
            },
            {
              title: "Call notes template",
              description: "Capture what matters so follow-up is personal, not generic.",
            },
          ],
        },
        {
          name: "System 2 — Close",
          tagline: "Ask for the payment with confidence.",
          playbooks: [
            {
              title: "Objection response library",
              description: "Word-for-word replies to the 12 most common stalls.",
            },
            {
              title: "MoMo checkout script",
              description: "Send payment link, confirm receipt, and onboard in one thread.",
            },
            {
              title: "Proposal one-pager",
              description: "Scope, price, timeline, and guarantee on a single page.",
            },
          ],
        },
      ],
      navLinks: [
        { label: "Playbooks", href: "#playbooks" },
        { label: "What's included", href: "#included" },
        { label: "Curriculum", href: "#modules" },
        { label: "FAQ", href: "#faq" },
      ],
      heroOutcomes: [
        "Discovery calls that feel like help, not pitches",
        "Scripts for every common objection",
        "MoMo-ready closing flow on WhatsApp",
        "Proposals that make saying yes easy",
      ],
      painAgitateSolution: [
        {
          icon: "1",
          title: "Losing at the finish line",
          description: "They liked you — then disappeared. Weak closing costs more than weak marketing.",
          accent: "border-red-200 bg-red-50/80",
        },
        {
          icon: "2",
          title: "Discounting to close",
          description: "You drop price when you should handle the objection. Margin dies, respect dies with it.",
          accent: "border-orange-200 bg-orange-50/80",
        },
        {
          icon: "3",
          title: "The closing playbook",
          description: "Structured discovery, scripted objections, clear ask. Sales becomes a process you repeat.",
          accent: "border-purple/20 bg-purple/5",
        },
      ],
      transformation: {
        before: [
          "Free advice on calls, no payment",
          "Panic when they say \"too expensive\"",
          "Chasing ghosts after proposals",
          "No script — winging every conversation",
        ],
        after: [
          "Calls that qualify and close",
          "Calm responses to objections",
          "WhatsApp flow through to MoMo",
          "Repeatable sales process",
        ],
      },
      howItWorks: [
        {
          step: 1,
          title: "Learn the scripts",
          description: "Short modules — each gives you language you use the same day.",
        },
        {
          step: 2,
          title: "Run one real conversation",
          description: "Discovery or follow-up using the templates. Real reps beat perfect theory.",
        },
        {
          step: 3,
          title: "Close & iterate",
          description: "MoMo payment → onboard → refine. Track wins in the script doc.",
        },
      ],
      valueStack: [
        { name: "Close More Clients course (16+ lessons)", value: 1100 },
        { name: "Discovery call script & notes template", value: 400 },
        { name: "Objection handling bank (12 scenarios)", value: 350 },
        { name: "WhatsApp → MoMo closing sequence", value: 300 },
        { name: "Proposal & invoice templates", value: 250 },
        { name: "Lifetime updates", value: 500 },
      ],
      modules: [
        {
          number: 1,
          title: "Sales mindset",
          description: "Help first, ask clearly — ethical selling for people who hate selling.",
          icon: "1",
          outcome: "Your personal sales rules",
        },
        {
          number: 2,
          title: "Discovery that qualifies",
          description: "Questions that reveal if they're a buyer or a browser.",
          icon: "2",
          outcome: "Completed discovery script",
        },
        {
          number: 3,
          title: "Present the offer",
          description: "Bridge from their problem to your packaged solution.",
          icon: "3",
          outcome: "One recorded practice pitch",
        },
        {
          number: 4,
          title: "Handle objections",
          description: "Price, timing, trust — without discounting by default.",
          icon: "4",
          outcome: "Objection cheat sheet saved",
        },
        {
          number: 5,
          title: "Close on MoMo",
          description: "Payment ask, confirmation, and onboarding in WhatsApp.",
          icon: "5",
          outcome: "First payment collected",
        },
      ],
      testimonials: [
        {
          name: "Efua",
          location: "Takoradi",
          text: "The objection bank alone paid for the course. I used the price response verbatim and closed same day.",
          avatar: "E",
          result: "Closed same-day deal",
        },
        {
          name: "Kwame",
          location: "Accra",
          text: "Discovery script stopped me from over-explaining. Shorter calls, more yeses.",
          avatar: "K",
          result: "2 clients in 2 weeks",
        },
      ],
      faqItems: [
        {
          question: "I'm not a \"salesperson\" — is this for me?",
          answer: "Yes. This is for freelancers and creators who need to collect money without feeling pushy.",
        },
        {
          question: "Does this work on WhatsApp only?",
          answer: "Scripts work on WhatsApp and phone. MoMo closing flow is written for Ghana payments.",
        },
      ],
      audience: [
        { label: "Freelancers", hook: "Convert DMs into deposits" },
        { label: "Coaches & consultants", hook: "Run calls that end in payment" },
        { label: "Agency sellers", hook: "Stop sending proposals into the void" },
      ],
      guarantee: HORMOZI_GUARANTEE,
      ctas: { ...HORMOZI_CTAS, sticky: "Get access — GHS 349" },
      instructor: {
        name: "African Skills Academy",
        title: "Ethical sales for digital services",
        quote: "The fortune is in the follow-up — and in asking clearly for the payment.",
      },
    },
    lms: baseLms(slug, "Close More Clients"),
  };
}
