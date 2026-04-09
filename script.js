// =====================================
// LiveLab 10 – AI Recommendation Engine
// Student Starter Code
//
// YOUR MISSION: Complete the TODOs below to build
// your AI-powered recommendation engine!
//
// ⚠️  SETUP REQUIRED: Before you begin, make sure your secrets.js file contains:
//    const api_key = "your-openai-api-key-here";
//    (Replace "your-openai-api-key-here" with your actual API key)
// =====================================

// =====================================
// STEP 1: Select DOM Elements (COMPLETED FOR YOU)
// =====================================
const button = document.getElementById("askBtn");
const input = document.getElementById("userInput");
const responseDiv = document.getElementById("response");
const clearBtn = document.getElementById("clearBtn");

const SYSTEM_PROMPT =
  "You are a helpful and concise fashion assistant that provides outfit recommendations based on user preferences and current fashion trends. Always respond with a single, stylish outfit recommendation that includes clothing items, colors, and accessories. Keep your response under 50 words.";

// Keep full conversation context for future API calls.
const messages = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
];

function createMessageBubble(role, text) {
  const message = document.createElement("article");
  message.className = `message ${role}`;

  const label = document.createElement("strong");
  if (role === "user") {
    label.textContent = "YOU";
  } else if (role === "assistant") {
    label.textContent = "AI STYLIST";
  } else {
    label.textContent = "NOTICE";
  }

  const content = document.createElement("p");
  content.textContent = text;

  message.append(label, content);
  return message;
}

function renderConversation() {
  responseDiv.innerHTML = "";

  const visibleMessages = messages
    .filter((message) => message.role !== "system")
    .slice(-6);

  if (visibleMessages.length === 0) {
    responseDiv.append(
      createMessageBubble(
        "assistant",
        "Hi! Ask for an outfit and I will suggest a look with clothing, colors, and accessories. ✨",
      ),
    );
    return;
  }

  visibleMessages.forEach((message) => {
    responseDiv.append(createMessageBubble(message.role, message.content));
  });

  responseDiv.scrollTop = responseDiv.scrollHeight;
}

function showNotice(text) {
  responseDiv.innerHTML = "";
  responseDiv.append(createMessageBubble("notice", text));
}

renderConversation();

// =====================================
// STEP 2: Add Event Listener (COMPLETED FOR YOU)
// =====================================
button.addEventListener("click", async () => {
  // Get and trim the user's question
  const userQuestion = input.value.trim();

  // =====================================
  // STEP 3: Implement Error Handling
  // =====================================
  // TODO: Check if the user's input is empty, and if so:
  //       1. Display a helpful message asking them to enter a question
  //       2. Stop the function from continuing (exit early)
  //
  // GUIDANCE:
  // - Use an if statement to check if userQuestion is falsy (empty, null, etc.)
  // - Update the responseDiv element to show your message
  // - Use the return keyword to exit the function early
  // YOUR CODE HERE
  if (!userQuestion) {
    showNotice("Please enter a question first.");
    return;
  }

  messages.push({ role: "user", content: userQuestion });
  renderConversation();
  input.value = "";
  input.focus();

  // =====================================
  // STEP 4: Connect to the AI
  // =====================================
  // IMPORTANT: Before starting, make sure your secrets.js file contains:
  // const api_key = "your-actual-api-key-here";
  //
  // The variable name 'api_key' MUST match what you use in the Authorization header below!
  // ⚠️  CRITICAL: If you use Authorization: `Bearer ${api_key}`, then your secrets.js
  //    must have: const api_key = "your-key-here"

  // TODO: Complete the fetch request below to send the user's question to OpenAI
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      // TODO: Set the HTTP method to POST (this is required for sending data to the API)
      method: "POST",
      // TODO: Add a headers object with TWO properties:
      //       1. Content-Type header set to "application/json" (tells API we're sending JSON)
      //       2. Authorization header with format: "Bearer <your-api-key-variable>"
      //          Use template literals with ${} to insert your api_key variable
      //          ⚠️  The variable name you use here MUST exist in secrets.js!
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      // TODO: Add a body property that sends JSON data to the API
      //       Use JSON.stringify() to convert an object with these properties:
      //       - model: which AI model to use (use "gpt-3.5-turbo" for this lab)
      //       - messages: an array with ONE message object containing:
      //           * role: set to "user" (tells AI this is from the user)
      //           * content: use the userQuestion variable (the user's input)
      // YOUR CODE HERE
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_completion_tokens: 800,
        temperature: 0.7,
        frequency_penalty: 0.5,
        messages,
      }),
    });

    // TODO: Check if the API response was successful
    //       If not successful (!res.ok), throw an error with the status code
    // YOUR CODE HERE
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    // TODO: Parse the JSON response from the API
    //       Store the result in a variable called 'data'
    // YOUR CODE HERE
    const data = await res.json();

    // TODO: Extract and display the AI's response
    //       OpenAI returns the message in: data.choices[0].message.content
    //       Set responseDiv.textContent to show this to the user
    // YOUR CODE HERE
    const aiReply = data.choices[0].message.content;
    messages.push({ role: "assistant", content: aiReply });
    renderConversation();
  } catch (error) {
    // TODO: Handle errors gracefully by doing TWO things:
    //       1. Log the error to the console so you can debug (use console.error)
    //       2. Show a user-friendly error message in responseDiv
    // YOUR CODE HERE
    console.error("Error fetching AI response:", error);

    // Remove the last user message if the request failed so context stays clean.
    if (messages[messages.length - 1]?.role === "user") {
      messages.pop();
    }

    showNotice("Sorry, something went wrong. Please try again later.");
  }
});

clearBtn.addEventListener("click", () => {
  messages.length = 1;
  renderConversation();
  input.focus();
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    button.click();
  }
});

// =====================================
// INSTRUCTOR TALKING POINTS
// =====================================
// - Why async/await improves readability
// - Why try/catch is critical for AI apps
// - Why we NEVER expose API keys in frontend
// - How this directly supports the L'Oréal project
// =====================================

/* =====================================
   NEXT STEPS AFTER COMPLETING TODOs:
   1. Test your app with sample queries
   2. Add custom styling to match your concept
   3. OPTIONAL: Display multiple responses (last 3)
   4. OPTIONAL: Add chat bubble styling
   5. OPTIONAL: Add emojis or themed design
===================================== */
