// chatbot/static/script.js
class Chatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadGreeting();
        this.updateStatus('Ready');
    }
    
    setupEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input focus
        this.messageInput.addEventListener('focus', () => {
            this.messageInput.parentElement.style.borderColor = '#4f46e5';
        });
        
        this.messageInput.addEventListener('blur', () => {
            this.messageInput.parentElement.style.borderColor = '#e5e7eb';
        });
    }
    
    async loadGreeting() {
        try {
            const response = await fetch('/greeting');
            const data = await response.json();
            this.addMessage('bot', data.greeting);
        } catch (error) {
            console.error('Error loading greeting:', error);
            this.addMessage('bot', '🤖 Welcome to the Freelance Bid Prediction Chatbot!\n\nI\'ll help you predict freelance bid outcomes by collecting information about your project.\n\nLet\'s get started!');
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isLoading) return;
        
        // Add user message to chat
        this.addMessage('user', message);
        this.messageInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        this.setLoading(true);
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            if (response.ok) {
                this.addMessage('bot', data.response);
                this.updateStatus('Ready');
            } else {
                this.addMessage('bot', `❌ Error: ${data.response || 'Something went wrong'}`);
                this.updateStatus('Error');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage('bot', '❌ Sorry, I encountered an error. Please try again.');
            this.updateStatus('Error');
        } finally {
            this.setLoading(false);
        }
    }
    
    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Format message content
        const formattedContent = this.formatMessage(content);
        messageDiv.innerHTML = formattedContent;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(content) {
        // Convert markdown-style formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/⚠️/g, '<span class="emoji">⚠️</span>')
            .replace(/✅/g, '<span class="emoji">✅</span>')
            .replace(/❌/g, '<span class="emoji">❌</span>')
            .replace(/🎯/g, '<span class="emoji">🎯</span>')
            .replace(/🎉/g, '<span class="emoji">🎉</span>')
            .replace(/🔄/g, '<span class="emoji">🔄</span>')
            .replace(/🤖/g, '<span class="emoji">🤖</span>');
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        this.messageInput.disabled = loading;
        
        if (loading) {
            this.sendButton.innerHTML = '<div class="loading"></div>';
            this.updateStatus('Processing...');
        } else {
            this.sendButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
            `;
        }
    }
    
    updateStatus(status) {
        const statusText = this.statusIndicator.querySelector('.status-text');
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        
        statusText.textContent = status;
        
        // Update status dot color based on status
        statusDot.className = 'status-dot';
        if (status === 'Error') {
            statusDot.style.background = '#ef4444';
        } else if (status === 'Processing...') {
            statusDot.style.background = '#f59e0b';
        } else {
            statusDot.style.background = '#10b981';
        }
    }
}

// Quick message functions
function sendQuickMessage(message) {
    const chatbot = window.chatbot;
    if (chatbot && !chatbot.isLoading) {
        chatbot.messageInput.value = message;
        chatbot.sendMessage();
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new Chatbot();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.chatbot) {
        window.chatbot.scrollToBottom();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.chatbot) {
        window.chatbot.scrollToBottom();
    }
});