const btn = document.getElementById("btn");
const input = document.getElementById("input");
const output = document.getElementById("output");
const quizCount = document.getElementById("quizCount");

const modes = document.querySelectorAll(".mode");
let currentMode = "Summary";

// MODE SWITCH
modes.forEach((m) => {
  m.addEventListener("click", () => {

    modes.forEach(x => x.classList.remove("active"));
    m.classList.add("active");

    currentMode = m.innerText;
  });
});

function show(text) {
  output.textContent = text;
}

btn.addEventListener("click", async () => {

  const text = input.value.trim();

  if (!text) {
    alert("Please enter content");
    return;
  }

  show("Generating...");

  const prompt = `
You are an elite AI study assistant.

MODE: ${currentMode}

Rules:

If Summary:
- Very detailed university-level notes
- Headings
- Bullet points
- Definitions
- Examples
- Exam tips

If Flashcards:
- Format:
Q:
A:
- Cover all key ideas

If Quiz:
- Generate ${quizCount.value} multiple choice questions
- Include answers and explanations
- Make them HARD and exam level

CONTENT:
${text}
`;

  try {

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GEMINI_KEY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    const data = await res.json();

    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    show(result);

  } catch (err) {
    console.log(err);
    show("Error connecting to Gemini API.");
  }

});
