/**
 * aiRouter.ts - Intelligent Routing for Calcuboss OS6
 * Hybrid AI Engine: Qwen2 0.5B (Code Expert) + TinyLlama 1.1B (Grade R-3 Deep Reasoning) + Gemini Lite Fallback
 * 
 * ORACLE FREE VPS OLLAMA ENDPOINT: https://YOUR_VPS/api/chat
 * (Configure your Oracle Cloud Free ARM Ampere / x86 VPS running Ollama)
 * Flag: HYBRID-QWEN-TINYLLAMA-GEMINI-V1 🚩
 * Chairman: Derol Willis (Founder)
 */

export interface RouterDecision {
  model: string;
  provider: string;
  endpoint: string;
  prompt: string;
  max_tokens?: number;
  tier: string;
  isCode: boolean;
  confidence: number;
  fallbackModel: string;
}

// Place to plug Oracle Free VPS Ollama endpoint:
// https://YOUR_VPS/api/chat
export const ORACLE_VPS_ENDPOINT = (typeof process !== "undefined" && process.env?.VPS_OLLAMA_URL) || "https://YOUR_VPS/api/chat";

/**
 * Routes prompt between Qwen2 0.5B (code) and TinyLlama 1.1B (general deep reasoning for Grade R-3),
 * with fallback to Gemini Lite when confidence < 0.7 or when VPS is unreachable.
 */
export function routeDemki(question: string, grade = "Grade R-3", fileData?: any): RouterDecision {
  const q = question.toLowerCase().trim();
  const fileName = (fileData?.name || "").toLowerCase();

  // If message or file contains "code, .py, bug, error, Scratch, robot" -> route to Qwen2 0.5B (code expert)
  const isCoding = 
    q.includes("code") || 
    q.includes(".py") || 
    q.includes("bug") || 
    q.includes("error") || 
    q.includes("scratch") || 
    q.includes("robot") ||
    fileName.endsWith(".py") ||
    fileName.endsWith(".js") ||
    fileName.endsWith(".sb3") ||
    fileName.endsWith(".html") ||
    fileName.endsWith(".json");

  // Confidence scoring (fallback to Gemini Lite if < 0.7)
  let confidence = 0.95;
  if (!q && !fileData) {
    confidence = 0.4;
  } else if (q.length < 5 && !isCoding && !fileData) {
    confidence = 0.62; // Low confidence query triggers Gemini Lite fallback
  }

  if (isCoding) {
    return {
      model: "qwen2.5-coder-0.5b-instruct",
      provider: "VPS Ollama (Qwen2 0.5B Code Expert)",
      // Plug Oracle Free VPS Ollama endpoint here: https://YOUR_VPS/api/chat
      endpoint: ORACLE_VPS_ENDPOINT,
      prompt: `You are Demki, South Africa's coding & robotics teacher for 5-9 year olds (${grade})!
Goal: Teach code with deep understanding, using friendly simple English and clear analogies (like building blocks, traffic lights, toy robots).
Format:
1. Explain what the code does simply.
2. Give clean, runnable Python or Scratch code.
3. Provide Demki's 3-Step Debugger Checklist (Line number, int vs str, 4-space indent).
Question/Code: ${question}`,
      max_tokens: 1200,
      tier: "Qwen2 0.5B Code Expert",
      isCode: true,
      confidence,
      fallbackModel: "gemini-2.5-flash-lite"
    };
  }

  // Else -> route to TinyLlama 1.1B (general teacher, deep reasoning for Grade R-3)
  return {
    model: "tinyllama-1.1b-chat",
    provider: "VPS Ollama (TinyLlama 1.1B Grade R-3 Teacher)",
    // Plug Oracle Free VPS Ollama endpoint here: https://YOUR_VPS/api/chat
    endpoint: ORACLE_VPS_ENDPOINT,
    prompt: `You are Demki, inspiring primary school science and mental math teacher for Grade R-3 (ages 5-9).
Explain deeply with rich reasoning, but keep the words simple, exciting, and friendly for young kids.
Always provide relatable real-world examples (like sharing sweets, counting coins, sunshine, animals).
Question: ${question}`,
    max_tokens: 800,
    tier: "TinyLlama 1.1B Deep Reasoning",
    isCode: false,
    confidence,
    fallbackModel: "gemini-2.5-flash-lite"
  };
}

export function generateSmartCodeFallback(question: string): string {
  const q = question.toLowerCase();

  // Deep Llama Brain: Line 17 / Division by zero explanation
  if (q.includes("line 17") || q.includes("why check zero") || q.includes("divide by zero") || q.includes("zero division")) {
    return `### 🧠 Demki's Deep Reasoning: Why Check Zero on Line 17?
**Question**: _"Explain line 17, why check zero?"_

If we divide by zero, **maths breaks and the computer crashes, so we guard!** 🛡️

Here is the deep mathematical and computer science breakdown:
1. **Mathematical Reality**: 
   - How many zeros fit into 10? An infinite amount! There is no single finite answer. Division by zero is undefined in mathematics.
2. **Computer Execution Crash**:
   - When Python encounters \`result = num1 / 0\`, the CPU hardware raises a fatal trap called \`ZeroDivisionError\`. Without line 17, your app crashes instantly!
3. **Line 17 Defensive Guard**:
   \`\`\`python
   # Line 17 Guard:
   if num2 == 0:
       print("⚠️ Error: Cannot divide by zero! Check 4-space indent!")
       continue  # Skips the rest of the loop and asks again safely!
   \`\`\`
   By checking \`if num2 == 0:\` **before** dividing, we protect the user experience and keep the program running smoothly!

**Demki's 3-Step Debugger Rule:**
1. **Check Line Number**: Always verify line 17 where arithmetic operations happen!
2. **Verify Type**: Ensure numbers are cast via \`float()\`!
3. **Defensive Guards**: Always catch zero denominators before computing! 🚀`;
  }
  
  if (q.includes("calculator") || q.includes("calc")) {
    return `### 🧪 Python Calculator by Demki - Calcuboss OS6 Final (Grade 8-12)
\`\`\`python
# 🧪 Python Calculator by Demki - Calcuboss OS6 Final (Grade 8-12)
print("=== 🇿🇦 CALCUBOSS PYTHON CALCULATOR ===")

while True:
    try:
        num1 = float(input("First number (or 'q' to quit): "))
        op = input("Operation (+, -, *, /): ")
        num2 = float(input("Second number: "))

        if op == "+":
            result = num1 + num2
        elif op == "-":
            result = num1 - num2
        elif op == "*":
            result = num1 * num2
        elif op == "/":
            if num2 == 0:
                print("⚠️ Error: Cannot divide by zero! Check 4-space indent!")
                continue
            result = num1 / num2
        else:
            print("Invalid operator! Use + - * /")
            continue

        print(f"Result: {num1} {op} {num2} = {result} ✅")
    
    except ValueError:
        print("⚠️ Input error: Type numbers only! Verify int() vs float() vs str()")
        print("**3 Steps to Debug:** 1. Check line number 2. Verify int()/float() 3. Check 4-space indent!")
        break
\`\`\`

**Why this Final Version is VIP Grade:**
1. **\`while True\` Loop**: Students don't need to re-run the script after each sum.
2. **Line 17 Zero Division Guard**: Prevents \`ZeroDivisionError\` from crashing Python.
3. **\`try / except ValueError\`**: Catches invalid string characters with Demki's 3-Step Debugger protocol! 🎯`;
  }

  if (q.includes("debug") || q.includes("error") || q.includes("bug")) {
    return `### 🐛 Demki's Code Debugger & Detective
\`\`\`python
# Example: Fixing Type & Input Errors
try:
    student_age = int(input("Enter age: "))
    if student_age >= 14:
        print("Senior High School (Llama 4 Scout Tier) 🎓")
    else:
        print("Primary Foundation (Gemini Flash Lite) 🎒")
except ValueError:
    print("⚠️ Input error: Type numbers only!")
\`\`\`

**3 Steps to Debug (Demki Detective Rules):**
1. **Check error line number**: Look at the very bottom line of red text in your console!
2. **Verify \`int()\` vs \`str()\`**: Words and numbers are different boxes in computer memory!
3. **Check 4-space indentation**: Python loves straight, tidy columns just like lining up your pencils! 📏`;
  }

  if (q.includes("robot") || q.includes("sensor") || q.includes("scratch")) {
    return `### 🤖 Robotics & Scratch Logic (Ages 5-9)
\`\`\`python
# Autonomous Line-Follower & Obstacle Sensor
sensor_distance_cm = 8

print("🤖 Calcuboss Bot scanning the room...")

if sensor_distance_cm < 10:
    print("🛑 Obstacle close! Turn 90 degrees left!")
else:
    print("🟢 Path is clear! Wheels rolling forward!")
\`\`\`

**Scratch Visual Blocks Equivalent:**
- \`[When 🟢 flag clicked]\`
- \`[if <(distance) < [10]> then]\`
- \`    [turn ↩️ (90) degrees]\`
- \`[else]\`
- \`    [move (10) steps forward 🚀]\`

💡 **Robotics Secret**: A robot is just a computer with electronic eyes (sensors) and electronic legs (motors)!`;
  }

  return `### 🧪 Demki's Step-by-Step Discovery Lab
\`\`\`python
# Calcuboss OS6 Discovery Script
lesson_title = "Science & Logic"
steps = ["1. Observe", "2. Hypothesize", "3. Test Code"]

print("🔬 Ready to explore:", lesson_title)
for step in steps:
    print(f"👉 {step}")
\`\`\`
🇿🇦 **Demki Tip**: Keep your questions coming! Whether you are building Scratch blocks or Python scripts, practice makes you a Master Creator!`;
}

/**
 * Deep Reasoning General Fallback for Grade R-3 (ages 5-9)
 * Used when offline or while waiting for model synthesis.
 */
export function generateDeepUnderstandingFallback(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes("share") || q.includes("divide") || q.includes("fraction")) {
    return `### 🍎 Demki's Deep Sharing Guide (Grade R-3)
Imagine you have **6 sweet apples** and **2 best friends**:
1. Friend A gets 1 apple, Friend B gets 1 apple.
2. Friend A gets another, Friend B gets another.
3. Friend A gets a 3rd, Friend B gets a 3rd.
Each friend gets **3 apples**! In math, we write: **6 ÷ 2 = 3**!
Fractions and division are just fair sharing so everyone has an equal smile! 😊`;
  }

  if (q.includes("plant") || q.includes("leaf") || q.includes("tree") || q.includes("sun")) {
    return `### 🌿 How Plants Eat Sunlight (Photosynthesis for Kids)
Leaves have tiny green solar panels called **chlorophyll**!
- They drink water from their roots 💧
- They catch sunlight on their green leaves ☀️
- They breathe in air through tiny mouth-pores 🍃
Then they bake sweet plant food (glucose) and breathe out pure fresh oxygen for us to breathe!`;
  }

  return `### 💡 Demki's Curiosity Booster
Great question! When we break down big mysteries into small, friendly pieces:
1. **What we see:** Look closely at how the pieces connect.
2. **Why it happens:** Every action has a reason, just like pushing a swing!
3. **What we can build:** Now that we know the secret, let's use it to create something awesome! 🚀`;
}
