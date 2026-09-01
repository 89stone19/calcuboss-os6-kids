/**
 * aiRouter.ts - Intelligent Routing for Calcuboss OS6
 * Directs coding questions to Qwen Coder (VPS or OpenRouter Free Pool)
 * Directs Senior CAPS science/maths to Llama 4 Scout (Groq MoE)
 * Flag: VPS-QWEN-CODER-0.5B-FULL-ANSWER-FIXED 🚩
 * Chairman: Derol Willis (Founder)
 */

export interface RouterDecision {
  model: string;
  provider: string;
  endpoint?: string;
  prompt: string;
  max_tokens?: number;
  tier: string;
  isCode: boolean;
}

export function routeDemki(question: string, _grade = "Grade 8-12"): RouterDecision {
  const q = question.toLowerCase().trim();
  
  // If coding keyword -> SEND TO VPS / FREE QWEN CODER
  const isCoding = q.includes("code") || 
                   q.includes("calculator") || 
                   q.includes("python") || 
                   q.includes("debug") || 
                   q.includes("scratch") || 
                   q.includes("robotics") || 
                   q.includes("script") ||
                   q.includes("program") ||
                   q.includes("function") ||
                   q.includes("loop") ||
                   q.includes("syntax");

  if (isCoding) {
    const vpsHost = (typeof process !== "undefined" && process.env?.VPS_HOST) || "localhost";
    return {
      model: "qwen2.5-coder-0.5b-instruct",
      provider: "VPS Ollama / OpenRouter Qwen Coder Free",
      endpoint: `http://${vpsHost}:11434/api/generate`,
      prompt: `You are Demki, the South African school coding teacher for Grade R-12! Give FULL WORKING CODE. Do NOT repeat the question. Do NOT say empty question. Output working Python/Scratch code with simple explanations for: ${question}`,
      max_tokens: 1200,
      tier: "FREE VPS Qwen Coder",
      isCode: true
    };
  }

  // Maths / Equations / Formulas
  if (q.includes("solve") || q.includes("formula") || q.includes("x =") || q.includes("equation") || q.includes("calc")) {
    return {
      model: "llama-4-scout-17b-16e-instruct",
      provider: "Groq (Senior MoE)",
      prompt: `You are Demki, senior science & math tutor. Solve step-by-step with clear working: ${question}`,
      max_tokens: 800,
      tier: "Llama 4 Scout",
      isCode: false
    };
  }

  // General Science & Logic
  return {
    model: "llama-4-scout-17b-16e-instruct",
    provider: "Groq / Gemini",
    prompt: `You are Demki, enthusiastic science & logic teacher. Explain simply with real-world examples: ${question}`,
    max_tokens: 600,
    tier: "Standard Homework",
    isCode: false
  };
}

export function generateSmartCodeFallback(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes("calculator") || q.includes("calc")) {
    return `### 🧪 Python Calculator by Demki (Grade 8-12)
\`\`\`python
# Run this code in VS Code, Replit, or IDLE!
print("=== 🇿🇦 CALCUBOSS PYTHON CALCULATOR ===")

num1 = float(input("First number: "))
op = input("Choose operation (+, -, *, /): ")
num2 = float(input("Second number: "))

if op == "+":
    result = num1 + num2
    print(f"Result: {num1} + {num2} = {result} ✅")
elif op == "-":
    result = num1 - num2
    print(f"Result: {num1} - {num2} = {result} ✅")
elif op == "*":
    result = num1 * num2
    print(f"Result: {num1} * {num2} = {result} ✅")
elif op == "/":
    if num2 != 0:
        result = num1 / num2
        print(f"Result: {num1} / {num2} = {result} ✅")
    else:
        print("⚠️ Math Error: Cannot divide by zero!")
else:
    print("Invalid operator!")

print("\\n🚀 Next Level: Add a while loop to keep calculating!")
\`\`\`

**How it works:**
1. \`float(input(...))\` takes decimal numbers from the user.
2. \`if/elif/else\` checks which math operation was chosen.
3. \`print(f"... = {result}")\` uses f-strings to display the final answer neatly!`;
  }

  if (q.includes("debug") || q.includes("error") || q.includes("bug")) {
    return `### 🐛 Demki's Code Debugger & Logic Inspector

\`\`\`python
# Common Bug 1: TypeError with inputs
# ❌ BAD:
# age = input("Enter age: ")
# if age > 10: ... (Crashes because age is string!)

# ✅ FIXED:
try:
    age = int(input("Enter student age: "))
    if age >= 14:
        print("Senior High School (Llama 4 Scout Tier) 🎓")
    else:
        print("Primary Foundation (Gemini Flash Lite Tier) 🎒")
except ValueError:
    print("⚠️ Please type numbers only!")
\`\`\`

**Demki's 3-Step Fix:**
1. **Read the Error Line Number** in your terminal.
2. **Cast your data types** with \`int()\` or \`float()\`.
3. **Verify Indentation** (Python uses 4 spaces per block).`;
  }

  if (q.includes("robot") || q.includes("sensor") || q.includes("scratch")) {
    return `### 🤖 Robotics Sensor Logic (Scratch & Python)

\`\`\`python
# Autonomous Line-Follower & Obstacle Sensor
import time

sensor_reading_cm = 12

print("🤖 Calcuboss Bot Initializing...")

if sensor_reading_cm < 10:
    print("🛑 Obstacle at " + str(sensor_reading_cm) + "cm -> Turn Left 90°!")
else:
    print("🟢 Path is clear -> Full speed ahead!")

print("✅ Digital logic verified: Pure brainpower, no heavy machinery! 🧠")
\`\`\`

**Scratch Equivalent:**
- \`[when green flag clicked]\`
- \`[if <(distance) < [10]> then]\`
- \`  [turn right (90) degrees]\`
- \`[else]\`
- \`  [move (10) steps]\``;
  }

  return `### 🧪 Python Solution by Demki
\`\`\`python
# Problem: ${question}

def solve_homework():
    print("=== Demki Code Solver ===")
    # Step 1: Initialize variables
    items = ["Maths", "Science", "Python"]
    print("Loaded study subjects:", items)
    
    # Step 2: Calculate
    total_subjects = len(items)
    print(f"Total topics ready to master: {total_subjects} ✅")

solve_homework()
\`\`\`
🇿🇦 **Demki Tip**: Test this code in your browser or Python environment!`;
}
