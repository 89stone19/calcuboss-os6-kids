/**
 * CALCUBOSS OS6 - PRICING - FINAL
 * Flag: PRICING-R50-R150-R200-R350-CODE-LOCKED 🚩
 * Chairman: Derol Willis (Founder)
 */

export interface PlanDetails {
  id: string;
  name: string;
  price: number;
  currency: string;
  badge?: string;
  grades: string;
  coding: boolean | string;
  limit?: string;
  model: string;
  features?: string;
  includes?: string[];
  why_expensive?: string;
  tagline?: string;
  amountCents: number;
  cadence: string;
  isPopular?: boolean;
  isVip?: boolean;
}

export const PLANS = {
  R50_STARTER: {
    id: "calcuboss_starter_50",
    name: "Starter",
    price: 50,
    currency: "ZAR", 
    cadence: "/ month",
    amountCents: 5000,
    grades: "Grade R - 7",
    coding: false,
    limit: "100 questions/day cached = FREE",
    model: "gemini-2.5-flash-lite",
    tagline: "Grade R-7 foundation homework, 1 subject, cache only, no coding",
    includes: [
      "Grade R-7 Primary Foundation",
      "1 Subject Homework Assistance",
      "Normalized Semantic Cache (0 AI Fuel)",
      "Interactive Life Canvas & Audio TTS",
      "Web & Mobile PWA Access"
    ]
  },

  R150_SCHOLAR: {
    id: "calcuboss_scholar_150",
    name: "Scholar",
    price: 150,
    currency: "ZAR",
    cadence: "/ month",
    amountCents: 15000,
    isPopular: true,
    badge: "MOST POPULAR • GRADE 8-11",
    grades: "Grade 8 - 11",
    coding: "Basic Scratch & Logic",
    model: "llama-4-scout-17b-16e-instruct ($0.11 in / $0.34 out)",
    tagline: "Grade 8-11 senior homework, all school subjects, textbook photos, Growth Charts",
    includes: [
      "Grade 8-11 High School CAPS",
      "All School Subjects (Maths, Science, Languages)",
      "Textbook & Homework Photo Vision",
      "Interactive Growth & Milestone Charts",
      "Basic Scratch & Computational Logic"
    ]
  },

  R200_MATRIC: {
    id: "calcuboss_matric_200",
    name: "Matric Pro",
    price: 200,
    currency: "ZAR",
    cadence: "/ month",
    amountCents: 20000,
    badge: "EXAM MASTER • GRADE 12",
    grades: "Grade 12 (Matric)",
    coding: "Python & Logic Solver",
    features: "Growth, Solver, Vault, Past Papers",
    model: "llama-4-scout 1.3M context (Groq MoE)",
    tagline: "Grade 12 Matric, past papers, Step-by-Step Solver, all 7 teachers unlocked",
    includes: [
      "Grade 12 Matric Final Exam Prep",
      "Past Exam Papers & Step-by-Step Solvers",
      "1.3M Context Window for Long Problem Sets",
      "Full 7 AI Teacher Squad Access",
      "Direct Creator Trust Vault Archive"
    ]
  },

  R350_CODE_ANALYSIS: {
    id: "calcuboss_code_350",
    name: "Code Analysis",
    price: 350,
    currency: "ZAR",
    cadence: "/ month",
    amountCents: 35000,
    isVip: true,
    badge: "🗄️💻 CODE ANALYSIS & ROBOTICS",
    grades: "Grade R-12 + Young Devs",
    coding: true,
    includes: [
      "🤖 Demki Codes & Debugs in Real-time",
      "🐍 Python + Scratch Error Diagnostics",
      "🧠 Robotics & Sensor Logic (If/Then, Loops)",
      "📷 Read Code Screenshots via Vision AI",
      "🏗️ Build Working App Logic & Math Solvers"
    ],
    why_expensive: "Vision + 4000 tokens per analysis vs 200 tokens normal homework",
    model: "llama-4-scout-17b-16e-instruct vision support",
    tagline: "Let kids code - Build SA digital future 🇿🇦"
  }
};

// Founder Mode - Chairman Derol Willis: VIP ACTIVE LIFETIME - All plans free
export const CEO_DerolWillis = { 
  name: "Derol Willis",
  email: "willisderol@gmail.com",
  role: "Founder & Chairman",
  status: "VIP LIFETIME", 
  pays: 0,
  flag: "PRICING-R50-R150-R200-R350-CODE-LOCKED"
};
