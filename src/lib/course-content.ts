export type Lesson = {
  id: string;
  number: number;
  title: string;
  duration: string;
  summary: string;
  content: string[];
  actionStep: string;
  /** Path inside Supabase Storage bucket `course-videos`, e.g. `digital-marketing-mastery/m1-l1.mp4` */
  videoPath?: string;
  /** Optional poster image path in the same bucket */
  videoPosterPath?: string;
};

export type CourseModule = {
  id: string;
  number: number;
  title: string;
  icon: string;
  outcome: string;
  lessons: Lesson[];
};

export const COURSE_MODULES: CourseModule[] = [
  {
    id: "module-1",
    number: 1,
    title: "Pick Your Profitable Niche",
    icon: "🎯",
    outcome: "Your first sellable offer",
    lessons: [
      {
        id: "m1-l1",
        number: 1,
        title: "Why Most Beginners Fail (And How You Won't)",
        duration: "8 min",
        summary: "Understand the income-first mindset before picking a skill.",
        content: [
          "Most people fail because they learn random skills with no paying market.",
          "Your goal is not to become an expert overnight — it's to become useful enough to get paid.",
          "Digital marketing works because every business needs customers online.",
        ],
        actionStep: "Write down 3 problems you see businesses struggle with in your area.",
      },
      {
        id: "m1-l2",
        number: 2,
        title: "Choose a Niche That Pays in Ghana",
        duration: "12 min",
        summary: "Pick a niche with real demand and low competition.",
        content: [
          "Focus on service-based offers: social media management, content creation, or ads setup.",
          "Target local SMEs, churches, salons, restaurants, and online sellers.",
          "Use the Niche Worksheet to score 5 options and pick one winner.",
        ],
        actionStep: "Complete the Niche Scorecard and select your top niche.",
      },
      {
        id: "m1-l3",
        number: 3,
        title: "Craft Your First Offer",
        duration: "10 min",
        summary: "Turn your niche into a clear, sellable package.",
        content: [
          "An offer = specific result + timeframe + deliverables + price anchor.",
          "Example: 'I manage your Instagram for 30 days — posts, captions, and DMs.'",
          "Start simple. One service, one price, one outcome.",
        ],
        actionStep: "Draft your offer in one sentence using the Offer Builder template.",
      },
      {
        id: "m1-l4",
        number: 4,
        title: "Set Your Starter Price",
        duration: "9 min",
        summary: "Price confidently even as a beginner.",
        content: [
          "Starter range in Ghana: GHS 300–800 for first clients.",
          "Price on value delivered, not hours worked.",
          "Your first 3 clients are for proof and testimonials — not maximum profit yet.",
        ],
        actionStep: "Set your starter price and write why it's fair for the client.",
      },
    ],
  },
  {
    id: "module-2",
    number: 2,
    title: "Build a Brand That Converts",
    icon: "🏗️",
    outcome: "A professional online presence",
    lessons: [
      {
        id: "m2-l1",
        number: 1,
        title: "Profile Setup That Builds Trust",
        duration: "11 min",
        summary: "Optimize WhatsApp Business, Instagram, and LinkedIn profiles.",
        content: [
          "Use a clear profile photo, benefit-driven bio, and one call-to-action.",
          "Show proof early: 'Helping [niche] get [result]' beats vague titles.",
          "Link to a simple portfolio or Google Doc with samples.",
        ],
        actionStep: "Update one profile using the Bio Template from your bonus pack.",
      },
      {
        id: "m2-l2",
        number: 2,
        title: "Create a Mini Portfolio Fast",
        duration: "14 min",
        summary: "Show work samples even if you've never had a client.",
        content: [
          "Create 3 mock projects for imaginary clients in your niche.",
          "Use Canva for post designs, captions, and before/after layouts.",
          "A portfolio removes the 'you're too new' objection.",
        ],
        actionStep: "Publish 3 portfolio pieces to a folder or highlight on Instagram.",
      },
      {
        id: "m2-l3",
        number: 3,
        title: "Positioning: Why Clients Should Pick You",
        duration: "10 min",
        summary: "Stand out without being the cheapest.",
        content: [
          "Position on speed, local understanding, or a specific industry.",
          "Example: 'I help Accra restaurants get more orders via Instagram.'",
          "Specificity beats generic 'digital marketer' every time.",
        ],
        actionStep: "Write your positioning statement in under 20 words.",
      },
    ],
  },
  {
    id: "module-3",
    number: 3,
    title: "Get Traffic Without Ads",
    icon: "📈",
    outcome: "People discovering your offer",
    lessons: [
      {
        id: "m3-l1",
        number: 1,
        title: "WhatsApp Outreach That Gets Replies",
        duration: "13 min",
        summary: "Start conversations that lead to paid work.",
        content: [
          "Warm outreach beats cold spam — start with people you know or local businesses.",
          "Use the 3-message script: compliment → problem → soft offer.",
          "Follow up once after 48 hours. Persistence with respect wins.",
        ],
        actionStep: "Send 5 outreach messages using the DM Script Pack.",
      },
      {
        id: "m3-l2",
        number: 2,
        title: "Instagram Content That Attracts Clients",
        duration: "15 min",
        summary: "Post with purpose, not just for likes.",
        content: [
          "Use the 3-3-3 rule: 3 educational, 3 proof, 3 personal posts per week.",
          "Every post should move someone closer to trusting you or DMing you.",
          "Use the 90-Day Content Calendar from your bonuses.",
        ],
        actionStep: "Schedule your first week of posts using the calendar template.",
      },
      {
        id: "m3-l3",
        number: 3,
        title: "Facebook Groups & Local Communities",
        duration: "10 min",
        summary: "Find buyers where they already gather.",
        content: [
          "Join 5 groups where your ideal clients ask for help.",
          "Give value first — answer questions before pitching.",
          "When someone asks for help you solve, DM them privately.",
        ],
        actionStep: "Join 3 relevant groups and leave 2 helpful comments today.",
      },
    ],
  },
  {
    id: "module-4",
    number: 4,
    title: "Turn Attention Into Money",
    icon: "🔄",
    outcome: "Your first sales conversations",
    lessons: [
      {
        id: "m4-l1",
        number: 1,
        title: "Discovery Calls on WhatsApp",
        duration: "12 min",
        summary: "Qualify leads and understand what they'll pay for.",
        content: [
          "Ask: What's your goal? What's not working? What have you tried?",
          "Listen more than you talk on the first call.",
          "End every call with a clear next step — proposal or follow-up date.",
        ],
        actionStep: "Practice the Discovery Questions script with a friend.",
      },
      {
        id: "m4-l2",
        number: 2,
        title: "Send Proposals That Close",
        duration: "14 min",
        summary: "Use the proposal template to look professional instantly.",
        content: [
          "Include: problem, solution, deliverables, timeline, price, and guarantee.",
          "Send proposals within 24 hours of the discovery call.",
          "One clear price beats three confusing packages for beginners.",
        ],
        actionStep: "Customize the Proposal Template for your offer and save it.",
      },
      {
        id: "m4-l3",
        number: 3,
        title: "Handle Objections & Get Paid",
        duration: "11 min",
        summary: "Overcome 'too expensive' and 'let me think about it'.",
        content: [
          "'Too expensive' → refocus on ROI: one new customer pays for your service.",
          "'Let me think' → ask what specific concern they need answered.",
          "Always ask for payment via Mobile Money once they say yes.",
        ],
        actionStep: "Memorize 3 objection responses from the script pack.",
      },
    ],
  },
  {
    id: "module-5",
    number: 5,
    title: "Scale & Stack Income",
    icon: "💰",
    outcome: "A repeatable income system",
    lessons: [
      {
        id: "m5-l1",
        number: 1,
        title: "Turn One Client Into Three",
        duration: "10 min",
        summary: "Referrals and upsells from happy clients.",
        content: [
          "Ask every happy client: 'Do you know one person who needs this?'",
          "Offer a small referral bonus or extra deliverable.",
          "Upsell retainers after a successful one-month project.",
        ],
        actionStep: "Draft your referral ask message and save it for future clients.",
      },
      {
        id: "m5-l2",
        number: 2,
        title: "Monthly Retainers Explained",
        duration: "12 min",
        summary: "Build predictable income instead of one-off gigs.",
        content: [
          "Retainer = fixed monthly fee for ongoing work (e.g. GHS 800/month).",
          "Define scope clearly: X posts, Y hours, Z reports per month.",
          "Aim for 3 retainers = stable base income.",
        ],
        actionStep: "Create a retainer package with 3 clear deliverables.",
      },
      {
        id: "m5-l3",
        number: 3,
        title: "Your 30-Day Action Plan",
        duration: "8 min",
        summary: "Lock in habits that keep income growing.",
        content: [
          "Week 1: Finish course + set up profiles.",
          "Week 2: Outreach daily + first proposals sent.",
          "Week 3–4: Close first client and deliver excellently.",
          "Review progress every Sunday and adjust.",
        ],
        actionStep: "Write your personal 30-day plan with 3 weekly milestones.",
      },
    ],
  },
];

export const BONUS_RESOURCES = [
  { id: "scripts", title: "Client Acquisition Script Pack", icon: "💬" },
  { id: "calendar", title: "90-Day Content Calendar", icon: "📅" },
  { id: "proposal", title: "Proposal & Invoice Templates", icon: "📄" },
  { id: "niche", title: "Niche & Offer Builder Worksheets", icon: "📋" },
];
