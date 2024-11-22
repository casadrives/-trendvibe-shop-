<template>
  <div class="chat-widget" :class="{ 'chat-widget--open': isOpen }">
    <!-- Chat Button -->
    <button 
      class="chat-widget__button"
      @click="toggleChat"
      :class="{ 'has-notification': hasNewMessage }"
    >
      <i class="fas fa-comments" v-if="!isOpen"></i>
      <i class="fas fa-times" v-else></i>
      <span class="sr-only">Customer Support</span>
    </button>

    <!-- Chat Window -->
    <div class="chat-widget__window" v-show="isOpen">
      <div class="chat-widget__header">
        <div class="chat-widget__agent">
          <div class="chat-widget__avatar">
            <img src="../assets/ai-avatar.png" alt="AI Assistant">
          </div>
          <div class="chat-widget__info">
            <h3>AI Support Assistant</h3>
            <span class="chat-widget__status">Online</span>
          </div>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="chat-widget__messages" ref="messageContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="[
            'chat-widget__message',
            `chat-widget__message--${message.type}`
          ]"
        >
          <div class="chat-widget__bubble">
            <p v-if="message.type === 'ai' && message.isTyping">
              <span class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </p>
            <template v-else>
              {{ message.text }}
              <small class="chat-widget__time">{{ formatTime(message.timestamp) }}</small>
            </template>
          </div>

          <!-- Quick Replies -->
          <div 
            v-if="message.quickReplies && message.type === 'ai'"
            class="chat-widget__quick-replies"
          >
            <button
              v-for="(reply, replyIndex) in message.quickReplies"
              :key="replyIndex"
              class="chat-widget__quick-reply"
              @click="sendQuickReply(reply)"
            >
              {{ reply }}
            </button>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-widget__input">
        <form @submit.prevent="sendMessage">
          <input
            type="text"
            v-model="newMessage"
            placeholder="Type your message..."
            :disabled="isProcessing"
          >
          <button 
            type="submit"
            :disabled="!newMessage.trim() || isProcessing"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ChatWidget',
  
  setup() {
    const store = useStore()
    const isOpen = ref(false)
    const messages = ref([])
    const newMessage = ref('')
    const isProcessing = ref(false)
    const hasNewMessage = ref(false)
    const messageContainer = ref(null)

    // Initial greeting
    const greetUser = async () => {
      const currentHour = new Date().getHours()
      let greeting = 'Hello'
      
      if (currentHour < 12) greeting = 'Good morning'
      else if (currentHour < 18) greeting = 'Good afternoon'
      else greeting = 'Good evening'

      const initialMessage = {
        type: 'ai',
        text: `${greeting}! I'm your AI shopping assistant. How can I help you today?`,
        timestamp: new Date(),
        quickReplies: [
          'Track my order',
          'Product recommendations',
          'Return policy',
          'Shipping information'
        ]
      }
      
      messages.value.push(initialMessage)
    }

    // Format timestamp
    const formatTime = (timestamp) => {
      return new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(timestamp)
    }

    // Toggle chat window
    const toggleChat = () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        hasNewMessage.value = false
        if (messages.value.length === 0) {
          greetUser()
        }
      }
    }

    // Send message
    const sendMessage = async () => {
      if (!newMessage.value.trim() || isProcessing.value) return

      // Add user message
      messages.value.push({
        type: 'user',
        text: newMessage.value,
        timestamp: new Date()
      })

      // Clear input
      const userMessage = newMessage.value
      newMessage.value = ''

      // Show typing indicator
      messages.value.push({
        type: 'ai',
        isTyping: true,
        timestamp: new Date()
      })

      isProcessing.value = true

      try {
        // Get AI response
        const response = await store.dispatch('chat/sendMessage', userMessage)
        
        // Remove typing indicator
        messages.value = messages.value.filter(m => !m.isTyping)

        // Add AI response
        messages.value.push({
          type: 'ai',
          text: response.text,
          timestamp: new Date(),
          quickReplies: response.quickReplies
        })
      } catch (error) {
        console.error('Failed to get AI response:', error)
        messages.value = messages.value.filter(m => !m.isTyping)
        messages.value.push({
          type: 'ai',
          text: 'I apologize, but I\'m having trouble responding right now. Please try again later.',
          timestamp: new Date()
        })
      } finally {
        isProcessing.value = false
      }
    }

    // Handle quick replies
    const sendQuickReply = (reply) => {
      newMessage.value = reply
      sendMessage()
    }

    // Scroll to bottom when new messages arrive
    watch(() => messages.value.length, async () => {
      await nextTick()
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    })

    // Show notification when chat is closed and new message arrives
    watch(() => messages.value.length, (newLength, oldLength) => {
      if (!isOpen.value && newLength > oldLength) {
        hasNewMessage.value = true
      }
    })

    return {
      isOpen,
      messages,
      newMessage,
      isProcessing,
      hasNewMessage,
      messageContainer,
      toggleChat,
      sendMessage,
      sendQuickReply,
      formatTime
    }
  }
}
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chat-widget__button {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: var(--primary-color);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.chat-widget__button:hover {
  transform: scale(1.1);
}

.chat-widget__button.has-notification::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #f97316;
  border-radius: 50%;
  border: 2px solid white;
}

.chat-widget__window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.chat-widget__header {
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: 1rem 1rem 0 0;
}

.chat-widget__agent {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-widget__avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  background: white;
}

.chat-widget__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-widget__info h3 {
  margin: 0;
  font-size: 1rem;
}

.chat-widget__status {
  font-size: 0.875rem;
  opacity: 0.8;
}

.chat-widget__messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-widget__message {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-widget__message--user {
  align-items: flex-end;
}

.chat-widget__bubble {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
}

.chat-widget__message--user .chat-widget__bubble {
  background: var(--primary-color);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.chat-widget__message--ai .chat-widget__bubble {
  background: #f1f5f9;
  color: #1e293b;
  border-bottom-left-radius: 0.25rem;
}

.chat-widget__time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-left: 0.5rem;
}

.chat-widget__quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.chat-widget__quick-reply {
  background: white;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-widget__quick-reply:hover {
  background: var(--primary-color);
  color: white;
}

.chat-widget__input {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.chat-widget__input form {
  display: flex;
  gap: 0.5rem;
}

.chat-widget__input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.chat-widget__input button {
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.chat-widget__input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.typing-indicator {
  display: flex;
  gap: 0.25rem;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
