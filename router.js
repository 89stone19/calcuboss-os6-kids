const FREE_MODELS = [
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2-7b-instruct:free"
];

async function askDemki(prompt) {
  console.log("🤖 Demki asking:", prompt);

  // 1. Try local Qwen 0.5B - 0$
  try {
    const r = await fetch('http://localhost:8081/completion', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({prompt, n_predict: 100})
    });
    const j = await r.json();
    if(j.content) {
      console.log("✅ Local Qwen answered - 0$");
      return j.content;
    }
  } catch(e) {
    console.log("Local not running, using free cloud...");
  }

  // 2. Free rotation - 0$
  for(const model of FREE_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + process.env.OPENROUTER_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [{role:"user", content: prompt}]
        })
      });
      if(res.ok) {
        const data = await res.json();
        console.log("✅ Free model:", model, "- 0$");
        return data.choices[0].message.content;
      }
    } catch(e) { continue }
  }
  return "Offline coat used";
}

// Test it
askDemki("Explain robotics loop for Grade R kid").then(console.log);
