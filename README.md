# FuzNex Watch Interface

The **FuzNex Watch Interface** is a web-based smartwatch simulation that acts as the **primary voice interaction device** for the FuzNex AI assistant system.

The watch captures user voice input and sends it to the **FuzNex Backend Master Router**, which intelligently routes the request to the best AI model.

---

## 🧠 How the AI System Works

The watch records audio and sends it to the backend.

The backend then performs:

1. Speech-to-Text
2. Intent Classification
3. AI Routing

Example pipeline:
```text
User Voice
       ↓
MediaRecorder (Watch)
       ↓
Backend API
       ↓
Groq Whisper (Speech → Text)
       ↓
Groq Llama (Intent Classification)
       ↓
Routing Decision
├── Watch Action
├── Simple Query
└── Complex Query → Gemini
       ↓
ElevenLabs (Voice Response)
```

---

## 🚀 Features

- Cross-browser voice recording using **MediaRecorder**
- AI voice assistant interface
- Automatic recording timeout (6 seconds)
- Real-time countdown UI
- Smart command routing
- Direct hardware-style actions
- Music control system
- Offline fallback commands

---

## 🎵 Supported Voice Commands

Music controls:

- Play music
- Pause music
- Next song
- Previous song
- Toggle shuffle
- Toggle repeat

System queries:

- What time is it
- Open music
- Basic app navigation

---

## 🛠 Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **MediaRecorder API**
- **TailwindCSS**
- **REST API Integration**

Backend AI stack:

- Groq Whisper
- Groq Llama
- Google Gemini
- ElevenLabs

---

## 📂 Project Structure

```text
watch/
├── src/
│   ├── api/
│   │   └── api.ts
│   │
│   ├── components/
│   │   ├── watch/
│   │   │   ├── AIChat.tsx
│   │   │   ├── MusicScreen.tsx
│   │   │   └── ...
│   │   │
│   │   └── SmartWatch.tsx
│   │
│   └── App.tsx
│
└── package.json
```

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
or
```text
http://localhost:5174
```
(depending on the Vite configuration)

---

## 🔗 Backend Requirement

The watch requires the **FuzNex Backend Master Router** to be running.

Default backend:

```text
http://localhost:3000
```

---

## 📌 Roadmap

- Improved smartwatch UI
- Voice animation feedback
- Device command expansion
- Watch-to-phone response synchronization
- Native smartwatch deployment

---

## 🧑‍💻 Part of the FuzNex Project

FuzNex is a **multi-assistant AI system** designed to combine multiple AI models into one unified intelligent assistant.

The smartwatch acts as a **minimal voice interface**, while the phone provides **advanced visualization and interaction capabilities**.

---

## 📜 License

This project is part of the **FuzNex AI Assistant System** currently under development.
