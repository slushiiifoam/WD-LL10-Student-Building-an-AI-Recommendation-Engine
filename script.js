/* ====================================================
   LiveLab 10 – GlowGuide Demo Script
   Focus: Advanced APIs + Error Handling
   Instructor is not coding but is primarily
    explaining the code structure and best practices.
======================================================== */

// STEP 1: Select DOM Elements
const button = document.getElementById("askBtn");
const input = document.getElementById("userInput");
const responseDiv = document.getElementById("response");

// STEP 2: Add Event Listener
button.addEventListener("click", async () => {
  const userQuestion = input.value.trim();

  if (!userQuestion) {
    responseDiv.textContent = "Please enter a question first.";
    return;
  }

  responseDiv.textContent = "Thinking...";

  // STEP 3: API Call with async/await + try/catch
  try {
    const res = await fetch("YOUR_CLOUDFLARE_WORKER_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userQuestion })
    });

    // STEP 4: Handle non-200 responses
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    // Adjust depending on Worker response format
    responseDiv.textContent = data.reply || "No response received.";

  } catch (error) {
    console.error("Error:", error);
    responseDiv.textContent = "Oops! Something went wrong. Please try again.";
  }
});

/* =====================================
   INSTRUCTOR TALKING POINTS:
   - Why async/await improves readability
   - Why try/catch is critical for AI apps
   - Why we NEVER expose API keys in frontend
   - How this directly supports the L'Oréal project
===================================== */
