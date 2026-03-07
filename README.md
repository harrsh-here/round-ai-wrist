# FuzNex AI Assistant — Watch Interface

🔗 **Live Demo:**  
https://fuznex-wrist.netlify.app/

📱 **Companion Phone App Repository:**  
https://github.com/harrsh-here/fuznex-assistant

---

## 🧠 About FuzNex

FuzNex is an experimental project aimed at building a **customized AI assistant ecosystem for smartwatches**. The FuzNex Watch Interface is a web-based smartwatch simulation that acts as the **primary voice interaction device** for the ecosystem.

Inspired by systems like Google Assistant and Alexa, FuzNex explores a **Master Assistant Hub** that can coordinate multiple AI systems through a single interface. The smartwatch captures user voice input and sends it to the **FuzNex Backend Master Router**, which intelligently routes the request to the best AI model.

Example interaction:
User → "Set an alarm for 5 AM"  
FuzNex Assistant → routes command → Watch Local Action

---

## 🚀 Features

- Cross-browser voice recording using **MediaRecorder**
- AI voice assistant interface with native STT/TTS (Groq Whisper / ElevenLabs)
- Automatic recording timeout (6 seconds) with real-time countdown UI
- Smart command routing (Groq Llama / Gemini)
- Direct hardware-style actions (Alarms, Navigation, System Settings)
- Music control system
- Offline fallback text commands

---

## 🛠 Tech Stack

- **React** 
- **TypeScript**
- **Vite**
- **TailwindCSS** (shadcn/ui)
- **MediaRecorder API**

Backend AI stack:
- Groq Whisper
- Groq Llama
- Google Gemini
- ElevenLabs

---

## ⚙️ Local Development

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run development server

```bash
npm run dev
```

The watch interface runs on:
```text
http://localhost:8080
```

---

## 🔗 Backend Requirement

The watch requires the **FuzNex Backend Master Router** to be running.
Production backend:
```text
https://fuznex.onrender.com/api
```
