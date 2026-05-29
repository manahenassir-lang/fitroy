```javascript
// chat.js

const generateBtn = document.getElementById("generateBtn");

const input = document.getElementById("messageInput");

const output = document.getElementById("output");

const quizAmount = document.getElementById("quizAmount");

const modeButtons = document.querySelectorAll(".modeBtn");

let currentMode = "Summary";

modeButtons.forEach((button) => {

  button.addEventListener("click", () => {

    currentMode = button.innerText;

    modeButtons.forEach((btn) => {
      btn.classList.remove("activeMode");
    });

    button.classList.add("activeMode");

  });

});

function setOutput(text){
  output.innerHTML = text;
}

generateBtn.addEventListener("click", async () => {

  const userMessage = input.value;

  if(!userMessage){
    alert("Enter notes or a question.");
    return;
  }

  setOutput("Generating AI study materials...");

  try{

    // GEMINI

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GEMINI_KEY",
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          contents:[
            {
              parts:[
                {
                  text:`

You are an advanced AI study assistant.

Current Mode:
${currentMode}

Rules:

If mode is Summary:
- Create EXTREMELY detailed summaries
- Add headings
- Add bullet points
- Add definitions
- Add examples
- Add exam tips
- Add important relationships

If mode is Flashcards:
- Create detailed flashcards
- Format:
Q:
A:

If mode is Quiz:
- Generate ${quizAmount.value} difficult quiz questions
- Multiple choice
- Include answers
- Include explanations

Student content:
${userMessage}

                  `
                }
              ]
            }
          ]
        })
      }
    );

    const geminiData = await geminiResponse.json();

    const geminiText =
      geminiData.candidates[0].content.parts[0].text;

    // OPENAI PLACEHOLDER

    const openAIText = `
[OpenAI Enhancement]

- Improved reasoning
- Better structure
- Better explanations
`;

    // CLAUDE PLACEHOLDER

    const claudeText = `
[Claude Enhancement]

- Added educational clarity
- Improved readability
- Better concept connections
`;

    // FINAL OUTPUT

    const finalOutput = `

========================
STUDYAI RESULTS
========================

${geminiText}

${openAIText}

${claudeText}

`;

    setOutput(finalOutput);

  }catch(error){

    console.log(error);

    setOutput("Error generating AI content.");

  }

});
```
