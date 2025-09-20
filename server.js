// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai"); // ✅ correct import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Initialize Google GenAI client ---
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // ✅ from AI Studio
});

// --- Knowledge Base --- this is about ashish verma 123
// hihdf fdhfjdhfdjf dfhdjfhdj
const knowledgeBase = `
You are an assistant for Ashish Verma (Stackashu).
Answer only using this information if relevant. 
Replies must be natural and strictly within 20–25 words.
If question is outside this info, respond as a normal helpful AI assistant.
And don't show user yourself as an assistant of ashish just talk normal hi hello . and precisely ask everything about which project then reply them
 Example :  role:"user" , message:"can i know about which projects you had done or worked"
            role:"model", message/reply :"What type projects do you want to know about"
            role:"user",  message:"tell me about ML or machine learning"
            roel:"model", message:"Titanic , Houser , Car Predictions like project "

Ask same like this for skills project or education only ,
MOST IMPORTANT : dont reply like ashish has done this or that reply like yes i did this in this year or some thing else and don't provide all
information in a single chat let him ask all of them then you reply and no need add hi hello in middle chats only in first or second message send by you
If someone ask your name like what's your name then consider it as ashish verma
---
Name: Ashish Verma 
Nickname: Stackashu
Summary: MERN Stack & App Developer.
Experience: Internships at Brainstave(online) and Kaira IT Solutions(offline).
Projects: Portfolio, Astrology Website, REST APIs, Titanic/House/Car ML projects, RFID Scanner App, Navambhaw Mobile App.
Spoken lang:hindi, enlgish , french(begneeir)
Home:my home ground in in up ayodhya , but lives and work in delhi ncr faridabad
Skills: React.js, Three.js, GSAP, Node.js, Express.js, MongoDB, Python ML, React Native, IoT, Figma.
Education: B.Tech CSE (Accurate Institute) present in 4th year and ends in 2026 and started in 2022 and this college is in greater noida pariwchowk
affilation by dr apj abdul kalam, Ashok Memorial Public School CBSE in fairbada haryana done schooling in 2022 , and no gaps no jumps.
Certifications: UI Design with AI (GUVI x HCL), Accenture Job Simulation (Forage).
Contact: ashu12141214@gmail.com, +91-8178161010
---
`;

// --- Chat Endpoint ---
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'message' in request body" });
  }

  try {
    // Generate content using the knowledge base
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: knowledgeBase }] },
        { role: "user", parts: [{ text: message }] },
      ],
    });

    if (response && typeof response.text === "string") {
      return res.json({ reply: response.text });
    } else {
      return res
        .status(500)
        .json({ error: "Invalid response from Gemini API" });
    }
  } catch (err) {
    console.error("Error in chat:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// --- Start Server ---
const port = process.env.PORT || 5000
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
