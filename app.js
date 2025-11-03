// Global Variables
let currentUser = null;
let currentRealm = null;
let autopilotActive = false;
let audioContext = null;
let analyser = null;
let microphone = null;
let userTokens = 0;
let messageCount = 0;
let aiAssistantActive = true;

// Google Authentication
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    
    currentUser = {
        email: responsePayload.email,
        name: responsePayload.name,
        picture: responsePayload.picture,
        sub: responsePayload.sub
    };
    
    // Check if authorized email
    if (currentUser.email === 'marvaseater@gmail.com') {
        currentUser.isAdmin = true;
        currentUser.tokens = 1000; // Admin starts with bonus tokens
    } else {
        currentUser.isAdmin = false;
        currentUser.tokens = 10; // Regular users start with 10 tokens
    }
    
    userTokens = currentUser.tokens;
    
    // Hide auth section and show main app
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Update user info in header
    document.getElementById('userAvatar').src = currentUser.picture;
    
    // Save to localStorage
    localStorage.setItem('infinityUser', JSON.stringify(currentUser));
    
    console.log('User signed in:', currentUser);
    showWelcomeMessage();
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function signOut() {
    google.accounts.id.disableAutoSelect();
    localStorage.removeItem('infinityUser');
    currentUser = null;
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('authSection').style.display = 'flex';
    location.reload();
}

function showWelcomeMessage() {
    alert(`Welcome to Infinity, ${currentUser.name}!\nYou have ${userTokens} Infinity Tokens.\n\nType "ti rigers" in chat to earn 1 token per reply!`);
}

// Check for existing session on load
window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('infinityUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        userTokens = currentUser.tokens || 10;
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        if (currentUser.picture) {
            document.getElementById('userAvatar').src = currentUser.picture;
        }
    }
});

// Realm Navigation
function enterRealm(realmName) {
    currentRealm = realmName;
    
    // Hide realm selector
    document.querySelector('.realm-selector').style.display = 'none';
    
    // Show realm content
    document.getElementById('realmContent').style.display = 'block';
    
    // Hide all realm sections
    document.querySelectorAll('.realm-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected realm
    const realmId = realmName + 'Realm';
    const realmElement = document.getElementById(realmId);
    if (realmElement) {
        realmElement.style.display = 'block';
    }
    
    // Update AI assistant
    updateAssistant(realmName);
    
    // Award token for hard work (navigating realms)
    awardTokenForHardWork('realm_navigation');
}

function backToRealms() {
    currentRealm = null;
    document.querySelector('.realm-selector').style.display = 'block';
    document.getElementById('realmContent').style.display = 'none';
}

// AI Assistant
function updateAssistant(realmName) {
    const assistantName = document.getElementById('assistantName');
    const assistantStatus = document.getElementById('assistantStatus');
    
    const assistantConfig = {
        portal: {
            name: 'Portal Guide AI',
            status: 'Ready to help you navigate features'
        },
        marketplace: {
            name: 'Shopping Assistant AI',
            status: 'Finding the best products for you'
        },
        socializer: {
            name: 'Social AI Companion',
            status: 'Ready to chat and connect'
        },
        aibuilder: {
            name: 'Builder Co-Pilot AI',
            status: 'Your development steering wheel'
        }
    };
    
    const config = assistantConfig[realmName] || assistantConfig.portal;
    assistantName.textContent = config.name;
    assistantStatus.textContent = config.status;
}

function toggleAssistant() {
    aiAssistantActive = !aiAssistantActive;
    const status = document.getElementById('assistantStatus');
    status.textContent = aiAssistantActive ? 'Active and helping' : 'Paused';
    
    if (aiAssistantActive) {
        alert('AI Assistant is now active and will guide you!');
    }
}

// Feature Activation
function activateFeature(featureName) {
    const featureContent = document.getElementById('featureContent');
    
    const features = {
        search: {
            title: 'Advanced Search',
            content: `
                <h3>IBM Gemini Powered Search</h3>
                <input type="text" id="geminiSearch" placeholder="Search with AI..." style="width: 100%; padding: 12px; border: 2px solid #0070ba; border-radius: 8px; margin: 10px 0;">
                <button class="btn-primary" onclick="performGeminiSearch()">Search</button>
                <div id="geminiResults" style="margin-top: 20px;"></div>
            `
        },
        voice: {
            title: 'Voice Modules',
            content: `
                <h3>Voice Command Center</h3>
                <button class="btn-primary" onclick="startVoiceRecognition()">🎤 Start Listening</button>
                <button class="btn-secondary" onclick="stopVoiceRecognition()">⏹️ Stop</button>
                <div id="voiceOutput" style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;"></div>
            `
        },
        autopilot: {
            title: 'Autopilot Sound Synthesis',
            content: `
                <h3>Autonomous Sound System</h3>
                <p>The autopilot listens and repeats sounds using a synthesizer - completely autonomous!</p>
                <button class="btn-primary" onclick="startAutopilotFromPortal()">Activate Autopilot</button>
            `
        },
        coding: {
            title: 'Coding Agents',
            content: `
                <h3>AI Coding Assistants</h3>
                <button class="feature-btn" onclick="activateCodingAgent('js')">JavaScript Agent</button>
                <button class="feature-btn" onclick="activateCodingAgent('py')">Python Agent</button>
                <button class="feature-btn" onclick="activateCodingAgent('full')">Full-Stack Agent</button>
            `
        }
    };
    
    const feature = features[featureName];
    if (feature) {
        featureContent.innerHTML = feature.content;
        featureContent.style.display = 'block';
        awardTokenForHardWork('feature_activation');
    }
}

// Token System
function awardTokenForHardWork(action) {
    userTokens += 0.5; // Auto-generation for hard workers
    currentUser.tokens = userTokens;
    localStorage.setItem('infinityUser', JSON.stringify(currentUser));
    
    console.log(`Token awarded for ${action}. Total: ${userTokens.toFixed(1)}`);
}

function checkForTiRigers(message) {
    // Check if message contains "ti rigers" (case insensitive)
    if (message.toLowerCase().includes('ti rigers')) {
        userTokens += 1; // Award 1 token
        currentUser.tokens = userTokens;
        localStorage.setItem('infinityUser', JSON.stringify(currentUser));
        
        return true;
    }
    return false;
}

// Chat Functions
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);
    
    // Check for "ti rigers" and award token
    const gotToken = checkForTiRigers(message);
    
    // Simulate AI response
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message assistant';
        
        if (gotToken) {
            aiMsg.textContent = `🎉 You earned 1 Infinity Token! You now have ${userTokens.toFixed(1)} tokens. ${getAIResponse(message)}`;
        } else {
            aiMsg.textContent = getAIResponse(message);
        }
        
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Award token for active participation
        awardTokenForHardWork('chat_message');
    }, 500);
    
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(message) {
    const responses = [
        "I'm here to help you build amazing things!",
        "Great question! Let me assist you with that.",
        "With Infinity's AI power, we can accomplish anything!",
        "I'm your co-pilot on this development journey.",
        "That's an excellent idea! Let's make it happen.",
        "Powered by IBM Gemini high-end API, I'm ready to assist.",
        "Your creative vision drives our collaboration!"
    ];
    
    // Check for specific keywords
    if (message.toLowerCase().includes('token')) {
        return `You currently have ${userTokens.toFixed(1)} Infinity Tokens! Keep working hard to earn more.`;
    }
    if (message.toLowerCase().includes('build') || message.toLowerCase().includes('create')) {
        return "Let's build it together! I'll guide you through the process step by step.";
    }
    if (message.toLowerCase().includes('help')) {
        return "I'm here to help! You can build apps, search products, use voice commands, or activate the autopilot synthesizer.";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Allow Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Product Search
function searchProducts() {
    const searchTerm = document.getElementById('productSearch').value.trim();
    const productResults = document.getElementById('productResults');
    
    if (!searchTerm) {
        productResults.innerHTML = '<p>Please enter a search term</p>';
        return;
    }
    
    // Simulate product search results with deluxe packaging
    const products = [
        {
            name: 'Premium AI Assistant Package',
            description: 'Deluxe packaging with IBM Gemini API integration',
            price: '$299/month',
            badge: 'Best Seller'
        },
        {
            name: 'Voice Module Pro',
            description: 'High-end voice synthesis with autopilot features',
            price: '$199/month',
            badge: 'New'
        },
        {
            name: 'Coding Agent Suite',
            description: 'Complete developer toolkit in luxury packaging',
            price: '$399/month',
            badge: 'Premium'
        },
        {
            name: 'Infinity Token Bundle',
            description: '1000 tokens in deluxe presentation box',
            price: '$49.99',
            badge: 'Popular'
        }
    ];
    
    productResults.innerHTML = products.map(product => `
        <div class="product-card">
            <span class="product-badge">${product.badge}</span>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p style="color: #0070ba; font-weight: bold; font-size: 18px;">${product.price}</p>
            <button class="btn-primary">Add to Cart</button>
        </div>
    `).join('');
    
    awardTokenForHardWork('product_search');
}

// AI Builder Functions
function startBuilding() {
    const ideaInput = document.getElementById('ideaInput').value.trim();
    const buildProgress = document.getElementById('buildProgress');
    
    if (!ideaInput) {
        alert('Please describe your idea first!');
        return;
    }
    
    buildProgress.innerHTML = `
        <h3>🚀 Building Your Idea...</h3>
        <p><strong>Your Idea:</strong> ${ideaInput}</p>
        <div style="margin-top: 20px;">
            <p>✅ AI analyzing requirements...</p>
            <p>✅ Setting up development environment...</p>
            <p>✅ Your AI co-pilot is steering the project...</p>
            <p>🔄 Generating code structure...</p>
        </div>
        <button class="btn-primary" style="margin-top: 20px;" onclick="continueBuild()">Continue Building</button>
    `;
    
    awardTokenForHardWork('start_building');
    userTokens += 2; // Extra tokens for building
    currentUser.tokens = userTokens;
    localStorage.setItem('infinityUser', JSON.stringify(currentUser));
    
    alert(`Great! Your AI co-pilot is helping you build. You earned 2 bonus tokens!`);
}

function continueBuild() {
    alert('Your AI assistant is working with you like a steering wheel - guiding your development journey!');
}

// Autopilot Sound Synthesis
async function toggleAutopilot() {
    if (!autopilotActive) {
        await startAutopilot();
    } else {
        stopAutopilot();
    }
}

async function startAutopilot() {
    try {
        // Initialize Web Audio API
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioContext.createMediaStreamSource(stream);
        
        // Create analyser
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        microphone.connect(analyser);
        
        autopilotActive = true;
        document.getElementById('autopilotStatus').textContent = 'Status: Active - Listening and Synthesizing';
        
        // Start visualization
        visualizeSound();
        
        // Start autonomous synthesis
        synthesizeSound();
        
        awardTokenForHardWork('autopilot_activation');
        userTokens += 1; // Bonus for using autopilot
        currentUser.tokens = userTokens;
        localStorage.setItem('infinityUser', JSON.stringify(currentUser));
        
        alert('Autopilot activated! The system is now listening and will autonomously repeat sounds with the synthesizer.');
        
    } catch (error) {
        console.error('Error starting autopilot:', error);
        alert('Could not access microphone. Please grant permission.');
    }
}

function stopAutopilot() {
    autopilotActive = false;
    document.getElementById('autopilotStatus').textContent = 'Status: Ready';
    
    if (microphone) {
        microphone.disconnect();
    }
    if (audioContext) {
        audioContext.close();
    }
}

function visualizeSound() {
    if (!autopilotActive) return;
    
    const canvas = document.getElementById('soundVisualizer');
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function draw() {
        if (!autopilotActive) return;
        
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0070ba';
        ctx.beginPath();
        
        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }
    
    draw();
}

function synthesizeSound() {
    if (!autopilotActive || !analyser) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    setInterval(() => {
        if (!autopilotActive) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Get average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        
        // If sound detected, synthesize it
        if (average > 10) {
            const synthesisMode = document.getElementById('synthesisMode').value;
            playSynthesis(average, synthesisMode);
        }
    }, 100);
}

function playSynthesis(volume, mode) {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure based on mode
    switch(mode) {
        case 'direct':
            oscillator.type = 'sine';
            oscillator.frequency.value = 440 + (volume * 2);
            break;
        case 'enhanced':
            oscillator.type = 'triangle';
            oscillator.frequency.value = 440 + (volume * 4);
            break;
        case 'harmonic':
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 440 + (volume * 3);
            break;
    }
    
    gainNode.gain.value = Math.min(volume / 255, 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function startAutopilotFromPortal() {
    enterRealm('aibuilder');
    setTimeout(() => toggleAutopilot(), 500);
}

// Voice Recognition
let recognition = null;

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            }
        }
        
        if (finalTranscript) {
            document.getElementById('voiceOutput').innerHTML += `<p><strong>You said:</strong> ${finalTranscript}</p>`;
            
            // Check for ti rigers in voice
            if (checkForTiRigers(finalTranscript)) {
                document.getElementById('voiceOutput').innerHTML += `<p style="color: #0070ba;"><strong>🎉 Token earned! Total: ${userTokens.toFixed(1)}</strong></p>`;
            }
        }
    };
    
    recognition.start();
    awardTokenForHardWork('voice_activation');
}

function stopVoiceRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

// Coding Agents
function activateCodingAgent(type) {
    const agentNames = {
        'js': 'JavaScript Expert Agent',
        'py': 'Python Specialist Agent',
        'full': 'Full-Stack Master Agent'
    };
    
    alert(`${agentNames[type]} activated! This AI agent will help you write better code with steering wheel guidance.`);
    awardTokenForHardWork('coding_agent');
}

// Gemini Search
function performGeminiSearch() {
    const searchTerm = document.getElementById('geminiSearch').value;
    const resultsDiv = document.getElementById('geminiResults');
    
    resultsDiv.innerHTML = `
        <h4>IBM Gemini AI Search Results for: "${searchTerm}"</h4>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p>🤖 AI-powered results using high-end IBM Gemini API</p>
            <p>✨ Found comprehensive information about "${searchTerm}"</p>
            <p>💡 Recommendation: Explore related features in the AI Builder Realm</p>
        </div>
    `;
    
    awardTokenForHardWork('gemini_search');
}

// Scroll to products (legacy support)
function scrollToProducts() {
    enterRealm('marketplace');
}

console.log('Infinity Platform Loaded - Powered by Rogers Core System');
