// --- SISTEM STATUS PET ---
let stats = { energy: 100, fun: 100, hunger: 100 };
const pet = document.getElementById('virtual-pet');
const statusText = document.getElementById('pet-status-text');

function updateHUD() {
    ['energy', 'fun', 'hunger'].forEach(stat => {
        document.getElementById(`${stat}-fill`).style.width = `${stats[stat]}%`;
        document.getElementById(`${stat}-val`).innerText = `${stats[stat]}%`;
    });
    
    // Perubahan visual jika status rendah (kecuali sedang fokus)
    if (!isFocusing) {
        if (stats.energy < 30 || stats.hunger < 30) {
            pet.style.background = 'linear-gradient(135deg, #ff5e62, #ff9966)'; // Merah
            statusText.innerText = "Lelah / Lapar...";
            statusText.style.color = "#ff5e62";
        } else {
            pet.style.background = 'linear-gradient(135deg, var(--secondary), var(--primary))'; // Normal
            statusText.innerText = "Siap Belajar!";
            statusText.style.color = "var(--secondary)";
        }
    }
}

// Drain status 1% setiap 1 menit
setInterval(() => {
    stats.energy = Math.max(0, stats.energy - 1);
    stats.fun = Math.max(0, stats.fun - 1);
    stats.hunger = Math.max(0, stats.hunger - 1);
    updateHUD();
}, 60000); 

// --- SISTEM TO-DO LIST ---
function addTask() {
    const input = document.getElementById('new-task');
    if(input.value.trim() === '') return;
    
    const ul = document.getElementById('task-list');
    const li = document.createElement('li');
    li.innerHTML = `<label><input type="checkbox" onchange="completeTask(this)"> ${input.value}</label>`;
    ul.appendChild(li);
    input.value = '';
}

function completeTask(checkbox) {
    const li = checkbox.parentElement.parentElement;
    if (checkbox.checked) {
        li.classList.add('completed');
        // Reward karena menyelesaikan tugas!
        stats.energy = Math.min(100, stats.energy + 10);
        stats.hunger = Math.min(100, stats.hunger + 15);
        stats.fun = Math.min(100, stats.fun + 5);
        updateHUD();
        triggerAIResponse("Aku baru saja menyelesaikan satu tugas!");
    } else {
        li.classList.remove('completed');
    }
}

// --- SISTEM POMODORO TIMER ---
let timer;
let timeLeft = 25 * 60; // 25 Menit
let isFocusing = false;
const display = document.getElementById('timer-display');
const btnStart = document.getElementById('btn-start');

function updateTimerDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    display.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isFocusing) return;
    isFocusing = true;
    btnStart.innerText = "Berjalan...";
    
    // Aktifkan Mode Fokus pada Pet (Pakai kacamata!)
    pet.classList.add('focus-mode');
    statusText.innerText = "Mode Fokus Aktif!";
    statusText.style.color = "var(--primary)";
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            completePomodoro();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    isFocusing = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    btnStart.innerText = "Fokus";
    
    // Matikan Mode Fokus
    pet.classList.remove('focus-mode');
    updateHUD(); // Kembalikan warna/teks sesuai status
}

function completePomodoro() {
    resetTimer();
    stats.fun = Math.min(100, stats.fun + 20); // Tambah fun banyak karena selesai belajar
    updateHUD();
    triggerAIResponse("Pomodoro selesai!");
}

// --- SISTEM AI CHAT ---
const chatBox = document.getElementById('chat-box');

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;
    
    appendMessage(text, 'user');
    input.value = '';
    triggerAIResponse(text);
}

async function triggerAIResponse(text) {
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        appendMessage(data.response, 'ai');
    } catch (error) {
        console.error("Error:", error);
    }
}

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerHTML = `<b>${sender === 'ai' ? 'Pet' : 'Kamu'}:</b> ${text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}