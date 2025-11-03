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

// Global Variables
let currentUser = null;
let currentHub = 'main';
let currentApp = null;
let autopilotActive = false;
let audioContext = null;
let analyser = null;
let microphone = null;
let userTokens = 0;
let messageCount = 0;
let aiAssistantActive = true;

// Voice UI Variables
let voiceRecognition = null;
let voiceSynthesis = window.speechSynthesis;
let elevenLabsApiKey = null; // Will be set from user config

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
        currentUser.tokens = 1000;
    } else {
        currentUser.isAdmin = false;
        currentUser.tokens = 10;
    }
    
    userTokens = currentUser.tokens;
    
    // Hide auth section and show main app
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Update user info in header
    document.getElementById('userAvatar').src = currentUser.picture;
    updateTokenDisplay();
    
    // Save to localStorage
    localStorage.setItem('infinityUser', JSON.stringify(currentUser));
    
    console.log('User signed in:', currentUser);
    showWelcomeMessage();
    initializeVoiceUI();
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
    speak(`Welcome to Infinity, ${currentUser.name}! You have ${userTokens} Infinity Tokens. Type "ti rigers" in chat to earn 1 token per reply!`);
}

function updateTokenDisplay() {
    const display = document.getElementById('tokenDisplay');
    if (display) {
        display.textContent = `Tokens: ${userTokens.toFixed(1)}`;
    }
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
        updateTokenDisplay();
        initializeVoiceUI();
    }
});

// SPA Navigation
function showHub(hubName) {
    // Hide all sections
    document.getElementById('mainHub').style.display = 'none';
    document.getElementById('portalHub').style.display = 'none';
    document.getElementById('marketplaceHub').style.display = 'none';
    document.getElementById('socializerHub').style.display = 'none';
    document.getElementById('appContent').style.display = 'none';
    
    // Show selected hub
    currentHub = hubName;
    document.getElementById(hubName + 'Hub').style.display = 'block';
    
    awardTokenForHardWork('hub_navigation');
    speak(`Entering ${hubName} hub`);
}

function backToMainHub() {
    document.getElementById('portalHub').style.display = 'none';
    document.getElementById('marketplaceHub').style.display = 'none';
    document.getElementById('socializerHub').style.display = 'none';
    document.getElementById('appContent').style.display = 'none';
    document.getElementById('mainHub').style.display = 'block';
    currentHub = 'main';
    currentApp = null;
}

function backToHub() {
    document.getElementById('appContent').style.display = 'none';
    document.getElementById(currentHub + 'Hub').style.display = 'block';
    currentApp = null;
}

function loadApp(appName) {
    currentApp = appName;
    document.getElementById('portalHub').style.display = 'none';
    document.getElementById('marketplaceHub').style.display = 'none';
    document.getElementById('socializerHub').style.display = 'none';
    document.getElementById('appContent').style.display = 'block';
    
    const container = document.getElementById('appContainer');
    container.innerHTML = getAppContent(appName);
    
    awardTokenForHardWork('app_load');
    speak(`Loading ${appName} app`);
    
    // Initialize app-specific functionality
    initializeApp(appName);
}

// Voice UI System
function initializeVoiceUI() {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        voiceRecognition = new SpeechRecognition();
        voiceRecognition.continuous = false;
        voiceRecognition.interimResults = false;
        voiceRecognition.lang = 'en-US';
        
        voiceRecognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            handleVoiceCommand(transcript);
        };
        
        console.log('Voice UI initialized');
    }
    
    // Check for ElevenLabs API key in localStorage
    elevenLabsApiKey = localStorage.getItem('elevenLabsApiKey');
}

function speak(text) {
    if (voiceSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        voiceSynthesis.speak(utterance);
    }
}

function startVoiceListening() {
    if (voiceRecognition) {
        voiceRecognition.start();
        speak('Listening');
    }
}

function stopVoiceListening() {
    if (voiceRecognition) {
        voiceRecognition.stop();
    }
}

function handleVoiceCommand(command) {
    console.log('Voice command:', command);
    const lowerCommand = command.toLowerCase();
    
    // Check for ti rigers
    if (lowerCommand.includes('ti rigers')) {
        userTokens += 1;
        currentUser.tokens = userTokens;
        localStorage.setItem('infinityUser', JSON.stringify(currentUser));
        updateTokenDisplay();
        speak(`You earned 1 token! You now have ${userTokens} tokens.`);
        return;
    }
    
    // Navigation commands
    if (lowerCommand.includes('portal')) {
        showHub('portal');
    } else if (lowerCommand.includes('marketplace')) {
        showHub('marketplace');
    } else if (lowerCommand.includes('socializer')) {
        showHub('socializer');
    } else if (lowerCommand.includes('home') || lowerCommand.includes('main')) {
        backToMainHub();
    } else {
        speak('Command not recognized. Try saying portal, marketplace, socializer, or home.');
    }
}

// Token System
function awardTokenForHardWork(action) {
    userTokens += 0.5;
    currentUser.tokens = userTokens;
    localStorage.setItem('infinityUser', JSON.stringify(currentUser));
    updateTokenDisplay();
    console.log(`Token awarded for ${action}. Total: ${userTokens.toFixed(1)}`);
}

function checkForTiRigers(message) {
    if (message.toLowerCase().includes('ti rigers')) {
        userTokens += 1;
        currentUser.tokens = userTokens;
        localStorage.setItem('infinityUser', JSON.stringify(currentUser));
        updateTokenDisplay();
        return true;
    }
    return false;
}

// App Content Generator
function getAppContent(appName) {
    const apps = {
        calculator: `
            <h2>🔢 Calculator</h2>
            <div style="max-width: 400px; margin: 0 auto; padding: 20px; background: white; border-radius: 12px;">
                <div id="calcDisplay" style="background: #f8f9fa; padding: 20px; font-size: 32px; text-align: right; border-radius: 8px; margin-bottom: 16px; min-height: 60px;">0</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    <button class="calc-btn" onclick="calcInput('7')">7</button>
                    <button class="calc-btn" onclick="calcInput('8')">8</button>
                    <button class="calc-btn" onclick="calcInput('9')">9</button>
                    <button class="calc-btn" onclick="calcInput('/')">/</button>
                    <button class="calc-btn" onclick="calcInput('4')">4</button>
                    <button class="calc-btn" onclick="calcInput('5')">5</button>
                    <button class="calc-btn" onclick="calcInput('6')">6</button>
                    <button class="calc-btn" onclick="calcInput('*')">*</button>
                    <button class="calc-btn" onclick="calcInput('1')">1</button>
                    <button class="calc-btn" onclick="calcInput('2')">2</button>
                    <button class="calc-btn" onclick="calcInput('3')">3</button>
                    <button class="calc-btn" onclick="calcInput('-')">-</button>
                    <button class="calc-btn" onclick="calcInput('0')">0</button>
                    <button class="calc-btn" onclick="calcInput('.')">.</button>
                    <button class="calc-btn" onclick="calcEqual()">=</button>
                    <button class="calc-btn" onclick="calcInput('+')">+</button>
                </div>
                <button class="btn-secondary" style="width: 100%; margin-top: 10px;" onclick="calcClear()">Clear</button>
                <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="startVoiceListening()">🎤 Voice Input</button>
            </div>
        `,
        
        alarm: `
            <h2>⏰ Smart Alarm Clock</h2>
            <div style="max-width: 500px; margin: 0 auto; padding: 20px; background: white; border-radius: 12px;">
                <div style="text-align: center; font-size: 64px; color: #0070ba; margin: 20px 0;" id="currentTime"></div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Set Alarm</h3>
                    <input type="time" id="alarmTime" style="width: 100%; padding: 12px; font-size: 18px; border: 2px solid #0070ba; border-radius: 8px;">
                    <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="setAlarm()">Set Alarm</button>
                    <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="startVoiceListening()">🎤 Set with Voice</button>
                </div>
                <div id="alarmList"></div>
            </div>
            <script>
                setInterval(() => {
                    const now = new Date();
                    document.getElementById('currentTime').textContent = now.toLocaleTimeString();
                }, 1000);
            </script>
        `,
        
        bible: `
            <h2>📖 Bible Verse Infinity</h2>
            <p style="text-align: center; color: #6c757d;">Rogers-analyzed divine messages with time-date correlation</p>
            <div style="max-width: 600px; margin: 20px auto; padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #0070ba 0%, #003087 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: white; margin-bottom: 10px;">Today's Verse</h3>
                    <p style="font-size: 18px; font-style: italic;">"Your country is desolate, your cities are burned with fire: your land, strangers devour it in your presence, and it is desolate, as overthrown by strangers." - Isaiah 1:7</p>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h4 style="color: #0070ba;">Rogers Analysis</h4>
                    <p>This verse speaks to transparency and truth - revealing what has been hidden. In the context of Infinity, it represents our mission to expose corruption and bring light to darkness, including revelations about corporate manipulation and technological control.</p>
                </div>
                <button class="btn-primary" style="width: 100%; margin-top: 20px;" onclick="getNewVerse()">Get New Verse</button>
                <button class="btn-secondary" style="width: 100%; margin-top: 10px;" onclick="speakVerse()">🔊 Read Aloud</button>
            </div>
        `,
        
        pets: `
            <h2>🐾 Pet Care Manager</h2>
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3>Add Pet</h3>
                    <input type="text" id="petName" placeholder="Pet name..." style="width: 100%; padding: 12px; margin: 8px 0; border: 2px solid #d9d9d9; border-radius: 8px;">
                    <select id="petType" style="width: 100%; padding: 12px; margin: 8px 0; border: 2px solid #d9d9d9; border-radius: 8px;">
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Bird</option>
                        <option>Fish</option>
                        <option>Other</option>
                    </select>
                    <button class="btn-primary" onclick="addPet()">Add Pet</button>
                </div>
                <div id="petList"></div>
            </div>
        `,
        
        therapy: `
            <h2>💪 Physical Therapy & Exercise</h2>
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="background: white; padding: 20px; border-radius: 12px;">
                    <h3>Exercise Routines</h3>
                    <div class="exercise-card">
                        <h4>Stretching Routine</h4>
                        <p>10 minutes • Flexibility</p>
                        <button class="btn-primary">Start Routine</button>
                    </div>
                    <div class="exercise-card">
                        <h4>Strength Training</h4>
                        <p>20 minutes • Building strength</p>
                        <button class="btn-primary">Start Routine</button>
                    </div>
                    <div class="exercise-card">
                        <h4>Recovery Exercises</h4>
                        <p>15 minutes • Post-injury recovery</p>
                        <button class="btn-primary">Start Routine</button>
                    </div>
                </div>
            </div>
        `,
        
        garden: `
            <h2>🌱 Garden & Seed Swapping</h2>
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3>My Garden</h3>
                    <button class="btn-primary" onclick="addPlant()">Add Plant</button>
                    <div id="gardenList" style="margin-top: 20px;"></div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px;">
                    <h3>Seed Exchange Network</h3>
                    <p>Connect with other gardeners to swap seeds</p>
                    <button class="btn-secondary">Browse Available Seeds</button>
                </div>
            </div>
        `,
        
        trade: `
            <h2>🏪 Infinity Token Trading</h2>
            <p style="text-align: center; color: #0070ba; font-weight: bold;">NO USD ACCEPTED - Tokens Only</p>
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3>List Item for Sale</h3>
                    <input type="text" placeholder="Item name..." style="width: 100%; padding: 12px; margin: 8px 0; border: 2px solid #d9d9d9; border-radius: 8px;">
                    <textarea placeholder="Description..." style="width: 100%; padding: 12px; margin: 8px 0; border: 2px solid #d9d9d9; border-radius: 8px; min-height: 100px;"></textarea>
                    <input type="number" placeholder="Price in tokens..." style="width: 100%; padding: 12px; margin: 8px 0; border: 2px solid #d9d9d9; border-radius: 8px;">
                    <button class="btn-primary">List Item</button>
                </div>
                <div id="marketplace Grid"></div>
            </div>
        `,
        
        clothing: `
            <h2>👔 Clothing Design Studio</h2>
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="background: white; padding: 20px; border-radius: 12px;">
                    <h3>Design Your Clothing</h3>
                    <p>AI-powered design assistance</p>
                    <canvas id="designCanvas" width="600" height="400" style="border: 2px solid #0070ba; border-radius: 8px; display: block; margin: 20px auto;"></canvas>
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button class="btn-primary">Save Design</button>
                        <button class="btn-secondary">Get AI Suggestions</button>
                        <button class="btn-secondary">List for Sale</button>
                    </div>
                </div>
            </div>
        `,
        
        foodtextile: `
            <h2>🌾 Food & Textiles Trading Platform</h2>
            <p style="text-align: center;">Global network for fair trade</p>
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div class="trade-category">
                        <h3>Food Products</h3>
                        <button class="btn-primary">Browse</button>
                    </div>
                    <div class="trade-category">
                        <h3>Textiles</h3>
                        <button class="btn-primary">Browse</button>
                    </div>
                    <div class="trade-category">
                        <h3>Raw Materials</h3>
                        <button class="btn-primary">Browse</button>
                    </div>
                </div>
            </div>
        `,
        
        glass: `
            <h2>🏺 Infinity Glass Packaging</h2>
            <p style="text-align: center;">Standardized eco-friendly packaging system</p>
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px;">
                <h3>Standard Sizes</h3>
                <div style="display: grid; gap: 15px;">
                    <div class="glass-size">Small: 250ml</div>
                    <div class="glass-size">Medium: 500ml</div>
                    <div class="glass-size">Large: 1000ml</div>
                    <div class="glass-size">XL: 2000ml</div>
                </div>
                <button class="btn-primary" style="margin-top: 20px;">Order Packaging</button>
            </div>
        `,
        
        banned: `
            <h2>⚠️ Truth & Transparency Database</h2>
            <p style="text-align: center; color: #dc3545; font-weight: bold;">Exposing Corruption and Protecting Consumers</p>
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #856404;">⚡ Breaking Investigation</h3>
                    <h4>Tesla Driverless Vehicle Brain Chip Technology</h4>
                    <p>Investigation reveals potential use of aluminum oxide chips in autonomous vehicle control systems. Designs from 2-1 years ago show concerning implementation details.</p>
                    <button class="btn-primary">Read Full Report</button>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px;">
                    <h3>Report Database</h3>
                    <button class="btn-secondary">Submit New Report</button>
                    <div id="reportsList" style="margin-top: 20px;"></div>
                </div>
            </div>
        `,
        
        leather: `
            <h2>🧤 Leather Craft Hub</h2>
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div class="craft-section">
                        <h3>Tutorials</h3>
                        <p>Step-by-step leather crafting guides</p>
                        <button class="btn-primary">Browse Tutorials</button>
                    </div>
                    <div class="craft-section">
                        <h3>Patterns</h3>
                        <p>Downloadable pattern library</p>
                        <button class="btn-primary">View Patterns</button>
                    </div>
                    <div class="craft-section">
                        <h3>Marketplace</h3>
                        <p>Buy and sell leather goods</p>
                        <button class="btn-primary">Visit Marketplace</button>
                    </div>
                </div>
            </div>
        `,
        
        locals: `
            <h2>📍 Locals Chat</h2>
            <p style="text-align: center;">Connect with people in your area</p>
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3>Find Your Local Chat</h3>
                    <input type="text" id="zipCode" placeholder="Enter your zip code..." maxlength="5" style="width: 100%; padding: 12px; font-size: 18px; border: 2px solid #0070ba; border-radius: 8px;">
                    <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="findLocalChat()">Find Chat Room</button>
                </div>
                <div id="localChatRoom" class="chat-container" style="display: none;">
                    <div id="localMessages" class="chat-messages"></div>
                    <div class="chat-input-box">
                        <input type="text" id="localChatInput" placeholder="Type your message...">
                        <button class="btn-primary" onclick="sendLocalMessage()">Send</button>
                    </div>
                </div>
            </div>
        `,
        
        videogame: `
            <h2>🎮 Video Game Generator</h2>
            <p style="text-align: center;">AI-powered video game creation</p>
            <div style="max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px;">
                <h3>Describe Your Game</h3>
                <textarea id="gameIdea" placeholder="Describe your game idea..." style="width: 100%; min-height: 150px; padding: 15px; border: 2px solid #0070ba; border-radius: 8px; font-size: 16px;"></textarea>
                <div style="margin: 20px 0;">
                    <label>Genre:</label>
                    <select style="width: 100%; padding: 12px; border: 2px solid #d9d9d9; border-radius: 8px; margin-top: 8px;">
                        <option>Action</option>
                        <option>Adventure</option>
                        <option>RPG</option>
                        <option>Puzzle</option>
                        <option>Strategy</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="generateGame()">Generate Game</button>
                <div id="gamePreview" style="margin-top: 30px;"></div>
            </div>
        `,
        
        diy: `
            <h2>🔨 DIY Modeling Hub</h2>
            <p style="text-align: center;">Instructables-style project sharing</p>
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3>Create New Project</h3>
                    <button class="btn-primary">Start Project Guide</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div class="project-card">
                        <h4>Woodworking</h4>
                        <p>125 projects</p>
                        <button class="btn-secondary">Browse</button>
                    </div>
                    <div class="project-card">
                        <h4>Electronics</h4>
                        <p>89 projects</p>
                        <button class="btn-secondary">Browse</button>
                    </div>
                    <div class="project-card">
                        <h4>Crafts</h4>
                        <p>203 projects</p>
                        <button class="btn-secondary">Browse</button>
                    </div>
                </div>
            </div>
        `,
        
        school: `
            <h2>🎓 Infinity School</h2>
            <p style="text-align: center;">Lifelong learning from newborn to elderly</p>
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div class="age-group">
                        <h3>Early Childhood</h3>
                        <p>Ages 0-5</p>
                        <button class="btn-primary">Enter</button>
                    </div>
                    <div class="age-group">
                        <h3>Elementary</h3>
                        <p>Ages 6-12</p>
                        <button class="btn-primary">Enter</button>
                    </div>
                    <div class="age-group">
                        <h3>Teen</h3>
                        <p>Ages 13-18</p>
                        <button class="btn-primary">Enter</button>
                    </div>
                    <div class="age-group">
                        <h3>Adult</h3>
                        <p>Ages 19-65</p>
                        <button class="btn-primary">Enter</button>
                    </div>
                    <div class="age-group">
                        <h3>Senior</h3>
                        <p>Ages 65+</p>
                        <button class="btn-primary">Enter</button>
                    </div>
                </div>
            </div>
        `,
        
        channel: `
            <h2>📺 Channel Generator</h2>
            <p style="text-align: center;">Merit-based TV programming with AI analysis</p>
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
                    <h3>Submit Your Audition</h3>
                    <form>
                        <input type="text" placeholder="Your name..." style="width: 100%; padding: 12px; margin: 8px 0; border: 2px solid #d9d9d9; border-radius: 8px;">
                        <select style="width: 100%; padding: 12px; margin: 8px 0; border: 2px solid #d9d9d9; border-radius: 8px;">
                            <option>Educational</option>
                            <option>Entertainment</option>
                            <option>Documentary</option>
                            <option>Mystery</option>
                            <option>Adventure</option>
                        </select>
                        <textarea placeholder="Describe your programming idea..." style="width: 100%; min-height: 150px; padding: 12px; margin: 8px 0; border: 2px solid #d9d9d9; border-radius: 8px;"></textarea>
                        <button type="button" class="btn-primary">Submit Audition</button>
                    </form>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
                    <h3>How It Works</h3>
                    <ol style="color: #6c757d; padding-left: 20px;">
                        <li>Submit your audition and program idea</li>
                        <li>AI analyzes your content and merit</li>
                        <li>Get assigned to appropriate digital channel</li>
                        <li>Build audience through quality content</li>
                        <li>Earn Infinity Tokens for engagement</li>
                    </ol>
                </div>
            </div>
        `
    };
    
    return apps[appName] || '<h2>App content loading...</h2>';
}

// Initialize app-specific features
function initializeApp(appName) {
    // App-specific initialization code
    if (appName === 'alarm') {
        // Start clock
        setInterval(() => {
            const timeEl = document.getElementById('currentTime');
            if (timeEl) {
                const now = new Date();
                timeEl.textContent = now.toLocaleTimeString();
            }
        }, 1000);
    }
}

// Calculator functions
let calcCurrentInput = '';
function calcInput(val) {
    calcCurrentInput += val;
    document.getElementById('calcDisplay').textContent = calcCurrentInput || '0';
}
function calcClear() {
    calcCurrentInput = '';
    document.getElementById('calcDisplay').textContent = '0';
}
function calcEqual() {
    try {
        calcCurrentInput = eval(calcCurrentInput).toString();
        document.getElementById('calcDisplay').textContent = calcCurrentInput;
        awardTokenForHardWork('calculation');
    } catch (e) {
        document.getElementById('calcDisplay').textContent = 'Error';
        calcCurrentInput = '';
    }
}

// Helper functions for various apps
function setAlarm() {
    const time = document.getElementById('alarmTime').value;
    if (time) {
        alert(`Alarm set for ${time}`);
        speak(`Alarm set for ${time}`);
        awardTokenForHardWork('alarm_set');
    }
}

function getNewVerse() {
    speak('Loading new verse');
    awardTokenForHardWork('bible_reading');
}

function speakVerse() {
    speak('Your country is desolate, your cities are burned with fire: your land, strangers devour it in your presence, and it is desolate, as overthrown by strangers. Isaiah 1:7');
}

function addPet() {
    const name = document.getElementById('petName').value;
    const type = document.getElementById('petType').value;
    if (name) {
        alert(`Added ${type}: ${name}`);
        speak(`Added ${type} named ${name}`);
        awardTokenForHardWork('pet_added');
    }
}

function addPlant() {
    speak('Adding plant to your garden');
    awardTokenForHardWork('garden_activity');
}

function findLocalChat() {
    const zip = document.getElementById('zipCode').value;
    if (zip && zip.length === 5) {
        document.getElementById('localChatRoom').style.display = 'block';
        speak(`Connecting to chat room for zip code ${zip}`);
        awardTokenForHardWork('local_chat_join');
    }
}

function sendLocalMessage() {
    const input = document.getElementById('localChatInput');
    const message = input.value.trim();
    if (message) {
        checkForTiRigers(message);
        input.value = '';
        awardTokenForHardWork('chat_message');
    }
}

function generateGame() {
    const idea = document.getElementById('gameIdea').value;
    if (idea) {
        speak('Generating your game with AI');
        awardTokenForHardWork('game_generation');
        userTokens += 2; // Bonus for creation
        updateTokenDisplay();
    }
}

console.log('Infinity SPA Platform Loaded - Powered by Rogers Core System with Voice UI');


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
