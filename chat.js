const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender = "user") {

  const message = document.createElement("div");

  message.className = `
    p-4
    rounded-2xl
    max-w-xl
    whitespace-pre-wrap
    ${sender === "user"
      ? "bg-blue-600 ml-auto"
      : "glass"}
  `;

  message.textContent = text;

  messages.appendChild(message);

  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {

  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");

  input.value = "";

  addMessage("Thinking...", "ai");

  const thinkingMessage = messages.lastChild;

  try {

    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: text,
      }),
    });

    const data = await response.json();

    thinkingMessage.remove();

    addMessage(data.reply, "ai");

  } catch (error) {

    thinkingMessage.remove();

    addMessage("Error connecting to AI.", "ai");

    console.error(error);
  }
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    sendMessage();
  }

});
