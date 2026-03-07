// const API_BASE_URL = "https://fuznex.onrender.com/api";
const API_BASE_URL = "http://localhost:3000/api";

// --- Watch Token helpers ---

const WATCH_TOKEN_KEY = "fuznex_watch_token";

export function saveWatchToken(token: string) {
    localStorage.setItem(WATCH_TOKEN_KEY, token);
}

export function getWatchToken(): string | null {
    return localStorage.getItem(WATCH_TOKEN_KEY);
}

export function removeWatchToken() {
    localStorage.removeItem(WATCH_TOKEN_KEY);
}

// --- Authenticated fetch helper ---

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const token = getWatchToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    return res;
}

// --- Pairing API ---

export interface PairingCodeResponse {
    code: string;
    expires_at: string;
}

export interface PairingStatusResponse {
    linked: boolean;
    token?: string;
}

export async function requestPairingCode(): Promise<PairingCodeResponse> {
    const res = await fetch(`${API_BASE_URL}/pairing/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Failed to request pairing code: ${res.status}`);
    return res.json();
}

export async function checkPairingStatus(code: string): Promise<PairingStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/pairing/status/${code}`);
    if (!res.ok) throw new Error(`Failed to check pairing status: ${res.status}`);
    return res.json();
}

// --- User Profile API ---

export interface UserProfile {
    user_id: number;
    name: string;
    email: string;
    phone_number: string;
    role: string;
}

export async function fetchUserProfile(): Promise<UserProfile> {
    const res = await authFetch("/users/profile");
    if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
    return res.json();
}

// --- Todos API ---

export interface TodoFromAPI {
    task_id: number;
    user_id: number;
    title: string;
    description: string | null;
    priority: "low" | "medium" | "high";
    due_date: string | null;
    is_completed: boolean;
    completed_at: string | null;
    recurrence: string;
    created_at: string;
    updated_at: string;
}

export async function fetchTodos(): Promise<TodoFromAPI[]> {
    const res = await authFetch("/todos");
    if (!res.ok) throw new Error(`Failed to fetch todos: ${res.status}`);
    return res.json();
}

export async function createTodo(data: {
    title: string;
    description?: string;
    priority?: string;
    due_date?: string;
}): Promise<TodoFromAPI> {
    const res = await authFetch("/todos", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create todo: ${res.status}`);
    return res.json();
}

export async function updateTodo(id: number, data: Partial<TodoFromAPI>): Promise<TodoFromAPI> {
    const res = await authFetch(`/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update todo: ${res.status}`);
    return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
    const res = await authFetch(`/todos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete todo: ${res.status}`);
}

// --- Alarms API ---

export interface AlarmFromAPI {
    alarm_id: number;
    user_id: number;
    alarm_time: string;
    label: string | null;
    is_active: boolean;
    repeat_pattern: string;
}

export async function fetchAlarms(): Promise<AlarmFromAPI[]> {
    const res = await authFetch("/alarms");
    if (!res.ok) throw new Error(`Failed to fetch alarms: ${res.status}`);
    return res.json();
}

export async function createAlarm(data: {
    alarm_time: string;
    label?: string;
    repeat_pattern?: string;
}): Promise<AlarmFromAPI> {
    const res = await authFetch("/alarms", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create alarm: ${res.status}`);
    return res.json();
}

export async function toggleAlarmAPI(id: number): Promise<void> {
    const res = await authFetch(`/alarms/${id}/toggle`, { method: "PUT" });
    if (!res.ok) throw new Error(`Failed to toggle alarm: ${res.status}`);
}

export async function deleteAlarmAPI(id: number): Promise<void> {
    const res = await authFetch(`/alarms/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete alarm: ${res.status}`);
}

// --- Notifications API ---

export interface NotificationFromAPI {
    notification_id: number;
    user_id: number;
    title: string | null;
    message: string | null;
    status: string;
    is_read: boolean;
    is_important: boolean;
    created_at: string;
    reminder_time: string | null;
}

export async function fetchNotifications(): Promise<NotificationFromAPI[]> {
    const res = await authFetch("/notifications");
    if (!res.ok) throw new Error(`Failed to fetch notifications: ${res.status}`);
    return res.json();
}

export async function markNotificationRead(id: number): Promise<void> {
    const res = await authFetch(`/notifications/${id}/read`, { method: "PUT" });
    if (!res.ok) throw new Error(`Failed to mark notification as read: ${res.status}`);
}

export async function deleteNotificationAPI(id: number): Promise<void> {
    const res = await authFetch(`/notifications/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete notification: ${res.status}`);
}

// --- Heartbeat & Logout API ---

export async function sendHeartbeat(): Promise<void> {
    const res = await authFetch("/pairing/heartbeat", { method: "POST" });
    if (!res.ok) throw new Error(`Heartbeat failed: ${res.status}`);
}

export async function logoutWatch(): Promise<void> {
    try {
        await authFetch("/pairing/logout", { method: "POST" });
    } catch {
        // Ignore errors — we're logging out anyway
    }
}

export async function goOffline(): Promise<void> {
    try {
        await authFetch("/pairing/offline", { method: "POST" });
    } catch {
        // Ignore errors
    }
}

// --- Watch AI Chat API ---

export interface WatchChatResponse {
    reply: string;
    action?: {
        type: string;
        command?: string;
        screen?: string;
        query?: string;
        params?: Record<string, any>;
    };
    audio?: string; // base64 MP3 from ElevenLabs
    geminiResponse?: string; // Full Gemini response for phone
}

// Offline fallback for basic commands
function offlineFallback(message: string): WatchChatResponse | null {
    const msg = message.toLowerCase().trim();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    if (msg.includes('time') && !msg.includes('timer')) {
        return { reply: `It's ${timeStr} right now.` };
    }
    if (msg.includes('date') || msg.includes('today') || msg.includes('day is it')) {
        return { reply: `Today is ${dateStr}.` };
    }
    if (msg.includes('play music') || msg.includes('play song')) {
        return { reply: `Playing music for you!`, action: { type: 'navigate', screen: 'music', params: { autoplay: true } } };
    }
    if (msg.includes('pause music') || msg.includes('stop music')) {
        return { reply: `Pausing music.`, action: { type: 'music', command: 'pause' } };
    }
    if (msg.includes('next song') || msg.includes('next track') || msg.includes('change song')) {
        return { reply: `Playing the next song.`, action: { type: 'music', command: 'next' } };
    }
    if (msg.includes('previous song') || msg.includes('previous track')) {
        return { reply: `Going back to the previous song.`, action: { type: 'music', command: 'previous' } };
    }
    if (msg.includes('open music')) {
        return { reply: `Opening music.`, action: { type: 'navigate', screen: 'music' } };
    }
    if (msg.includes('open setting')) {
        return { reply: `Opening settings.`, action: { type: 'navigate', screen: 'settings' } };
    }
    if (msg.includes('show task') || msg.includes('open todo') || msg.includes('my task')) {
        return { reply: `Here are your tasks.`, action: { type: 'navigate', screen: 'todos' } };
    }
    if (msg.includes('show weather') || msg.includes('weather')) {
        return { reply: `Checking weather.`, action: { type: 'navigate', screen: 'weather' } };
    }
    if (msg.includes('open alarm') || msg.includes('set alarm')) {
        return { reply: `Opening alarms.`, action: { type: 'navigate', screen: 'alarms' } };
    }
    return null;
}

// Transcribe audio blob via Groq Whisper
export async function watchTranscribeAudio(audioBlob: Blob): Promise<{ transcript: string }> {
    const token = getWatchToken();
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const res = await fetch(`${API_BASE_URL}/watch/transcribe`, {
        method: "POST",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });
    if (!res.ok) throw new Error(`Transcription failed: ${res.status}`);
    return res.json();
}

// Send text to AI and get response (with optional ElevenLabs audio)
export async function watchChat(message: string, history: any[] = []): Promise<WatchChatResponse> {
    // Try offline first for instant responses
    const offline = offlineFallback(message);
    if (offline) return offline;

    try {
        const now = new Date();
        const clientTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        const clientDate = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        const res = await authFetch("/watch/chat", {
            method: "POST",
            body: JSON.stringify({ message, history, clientTime, clientDate }),
        });
        if (!res.ok) throw new Error(`Watch chat failed: ${res.status}`);
        return res.json();
    } catch (err) {
        return { reply: "I'm offline right now. I can tell you the time, date, or open music/tasks/weather/alarms for you." };
    }
}
