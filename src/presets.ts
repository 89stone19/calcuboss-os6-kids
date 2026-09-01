/**
 * presets.ts - Demki Logic & Teacher Presets (Digital Only)
 * Scope: School kids Grade R to Grade 12 homework only.
 * Flag: PRICING-R50-R150-R200-R350-CODE-LOCKED 🚩
 * Chairman: Derol Willis (Founder)
 */

export interface DemkiPreset {
  id: string;
  trigger: string;
  icon?: string;
  label: string;
  chip?: string;
  response: string;
  quick_reply?: string;
  grade?: string;
  tier?: string;
  price?: number;
  founder_only?: boolean;
}

export const DEMKI_PRESETS: DemkiPreset[] = [
  {
    id: "welcome",
    trigger: "hello | hi | start",
    icon: "🧪",
    label: "Demki Intro",
    response: "Hello! I am Demki! Let's build code, robotics logic and solve cool science experiments! 🧪\n\nWhat are we solving today? Maths or Code?",
    quick_reply: "Want to know more about debugging"
  },
  {
    id: "math_logic",
    trigger: "4x - 6 = 2x + 10 | equation | maths | solve",
    label: "🧮 4x - 6 = 2x + 10",
    chip: "Growth Projections",
    response: "Number crunching complete! 🧮 That's a fantastic Math homework question. To solve this, let's look at the numbers and logic step by step!\n\n1. 4x - 6 = 2x + 10\n2. 4x - 2x = 10 + 6\n3. 2x = 16\n4. x = 8 ✅\n\nGrowth: You just leveled up logic! Now want to CODE a solver for this in Python? (R350 tier unlocks auto-solver)",
    grade: "Grade 8-12"
  },
  {
    id: "debugging",
    trigger: "debugging | bug | error | code not working",
    label: "🐛 Debugging",
    response: "Want to know more about debugging?\n\nDebugging = Detective work for code! 🕵️\n\n3 Steps:\n1. READ the error\n2. CHECK your logic (if/then)\n3. TEST small pieces\n\nUpload your code screenshot and I will analyze it line by line! [R350 Code Analysis 🗄️💻]",
    tier: "R350"
  },
  {
    id: "robotics_logic",
    trigger: "robotics | robot | sensor | logic",
    label: "🤖 Robotics Logic",
    response: "Robotics Logic (Digital ONLY - No machines!):\n\nIF sensor sees line -> THEN turn left\nIF button pressed -> THEN beep\nLOOP forever -> keep checking\n\nLet's build this logic in Scratch first! Grade R-7 can do this. No welding, only BRAINS! 🧠",
    tier: "R50-R350"
  },
  {
    id: "growth_projections",
    trigger: "growth | stats | level",
    chip: "📈 Growth Projections",
    label: "📈 Growth Projections",
    response: "📊 Growth Projection:\n\nYou solved 12 equations this week!\nNext level: Code Solver\nUnlock: Build your own calculator in Python (R350 tier) and earn Creator Trust Vault badge! @DerolWillis 🧩👑"
  },
  {
    id: "ceo_business_rules",
    trigger: "business | ceo | rule",
    chip: "💼 CEO Business Rules",
    label: "💼 CEO Business Rules",
    response: "💼 CEO Business Rule by Derol Willis:\n\n1. Tech Only in this app - No hard labour\n2. Coding = Future of SA 🇿🇦\n3. Cache everything - One answer = 1000 kids served FREE\n4. R50=R-7, R150=8-11, R200=Matric, R350=Code Analysis 🗄️",
    founder_only: true
  },
  {
    id: "code_analysis_350",
    trigger: "analyze code | check my code | python",
    label: "💻 Code Analysis R350 🗃️",
    response: "R350 Code Analysis Mode Activated! 🗄️💻\n\nUpload:\n- Python file\n- Screenshot of error\n- Scratch project\n\nI will:\n✅ Read your code (Vision - Llama 4 Scout)\n✅ Find 3 bugs\n✅ Fix step by step\n✅ Explain like Grade 7\n✅ Show better logic\n\nLlama 4 Scout: $0.34/M - Most affordable Llama 4 tier for SA kids!",
    price: 350
  },
  {
    id: "science_experiment",
    trigger: "experiment | science | why",
    label: "🧪 Science Experiment",
    response: "Cool Science Experiment you can do at home in Emalahleni! 🏠\n\nNo lab needed, only logic:\n\nLet's use CODE to simulate it first, then real life!\n\nWhat topic? Electricity? Forces? Chemical reactions? (Digital simulations only!) 🇿🇦"
  }
];

export function findDemkiPreset(query: string): DemkiPreset | undefined {
  const q = query.toLowerCase().trim();
  return DEMKI_PRESETS.find(preset => {
    const triggers = preset.trigger.split('|').map(t => t.trim().toLowerCase());
    return triggers.some(t => q.includes(t) || t.includes(q));
  });
}
