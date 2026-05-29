```javascript
// chat.js

const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const quizAmount = document.getElementById("quizAmount");

function addMessage(text){
  messages.innerHTML = text;
}

sendBtn.addEventListener("click", async () => {

  const message = input.value;

  if(!message) return;

  addMessage("Generating detailed study materials...");

  try{

    const response = await fetch(
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

Generate VERY detailed study materials.

Requirements:
- Deep explanations
- Examples
- Key concepts
- Definitions
- Bullet points
- Exam tips
- Flashcards if useful
- ${quizAmount.value} quiz questions if requested
- Detailed summaries

Student request:
${message}
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates[0].content.parts[0].text;

    addMessage(reply);

  }catch(error){

    console.log(error);

    addMessage("Error generating AI response.");

  }

});
```
