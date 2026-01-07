<template>
  <div class="game-container">
    <!-- Header -->
    <div class="game-header">
      <h1 class="game-title">🎴 เกมจั่วไพ่</h1>
      <div class="header-controls">
        <!-- ปุ่มเปิด/ปิดเสียง -->
        <button class="icon-button" @click="toggleAudio" :title="audioEnabled ? 'ปิดเสียง' : 'เปิดเสียง'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            :style="{ opacity: audioEnabled ? 1 : 0.3 }">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </button>

        <!-- ปุ่ม Reset -->
        <button class="icon-button" @click="resetDeck" title="สลับไพ่ใหม่">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Deck Area -->
    <div class="deck-area">
      <div :class="['deck-wrapper', { shake: isShaking }]">
        <!-- กองไพ่ -->
        <CardStack v-if="deck.length > 0" :cards="deck" />

        <!-- ไพ่หมดแล้ว -->
        <div v-else class="empty-deck">
          <p>ไพ่หมดแล้ว!</p>
          <button class="reset-button" @click="resetDeck">
            สลับไพ่ใหม่
          </button>
        </div>
      </div>

      <!-- ไพ่ที่จั่วออกมา -->
      <div v-if="currentCard" :class="['revealed-card', { active: isAnimating }]">
        <GameCard :card="currentCard" />
      </div>
    </div>

    <!-- ปุ่มจั่วไพ่ -->
    <button class="draw-button" @click="drawCard" :disabled="deck.length === 0 || isAnimating">
      {{ deck.length === 0 ? "ไพ่หมดแล้ว" : "จั่วไพ่" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import GameCard from "./components/GameCard.vue";
import CardStack from "./components/CardStack.vue";
import { SAMPLE_CARDS } from "./constants/cards";
import { shuffleCards } from "./utils/shuffle";
import { speakText, stopSpeaking } from "./utils/speech";
import type { Card } from "./constants/cards";

// State
const deck = ref<Card[]>(shuffleCards(SAMPLE_CARDS));
const currentCard = ref<Card | null>(null);
const isAnimating = ref(false);
const isShaking = ref(false);
const audioEnabled = ref(true);

// จั่วไพ่
function drawCard() {
  if (deck.value.length === 0 || isAnimating.value) return;

  // Animation: สั่นไพ่ก่อน
  isShaking.value = true;

  setTimeout(() => {
    isShaking.value = false;

    // จั่วไพ่ใบบนสุด
    const drawnCard = deck.value[0];
    currentCard.value = drawnCard;
    isAnimating.value = true;

    // เสียงอ่าน
    if (audioEnabled.value) {
      setTimeout(() => {
        speakText(drawnCard.text, drawnCard.title);
      }, 400);
    }

    // เอาไพ่ออกจาก deck หลัง animation จบ
    setTimeout(() => {
      deck.value = deck.value.slice(1);
      isAnimating.value = false;
    }, 2000);
  }, 300);
}

// Reset deck
function resetDeck() {
  stopSpeaking();
  deck.value = shuffleCards(SAMPLE_CARDS);
  currentCard.value = null;
  isAnimating.value = false;
  isShaking.value = false;
}

// Toggle audio
function toggleAudio() {
  audioEnabled.value = !audioEnabled.value;
  if (!audioEnabled.value) {
    stopSpeaking();
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.game-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    sans-serif;
  gap: 32px;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  gap: 16px;
}

.game-title {
  font-size: 28px;
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.header-controls {
  display: flex;
  gap: 8px;
}

.icon-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.deck-area {
  position: relative;
  width: 320px;
  height: 450px;
}

.deck-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deck-wrapper.shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-8px) rotate(-2deg);
  }

  75% {
    transform: translateX(8px) rotate(2deg);
  }
}

.empty-deck {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: white;
  font-size: 20px;
}

.reset-button {
  padding: 12px 24px;
  border-radius: 999px;
  border: 2px solid white;
  background: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  background: white;
  color: #667eea;
}

.revealed-card {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  transform: translateY(0) rotateY(180deg) scale(0.8);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.revealed-card.active {
  opacity: 1;
  transform: translateY(-30px) rotateY(0deg) scale(1);
  z-index: 100;
}

.draw-button {
  padding: 20px 60px;
  font-size: 24px;
  font-weight: 700;
  border-radius: 999px;
  border: none;
  background: white;
  color: #667eea;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.draw-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.draw-button:active:not(:disabled) {
  transform: translateY(0);
}

.draw-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .game-title {
    font-size: 24px;
  }

  .deck-area {
    width: 280px;
    height: 420px;
  }

  .draw-button {
    padding: 16px 48px;
    font-size: 20px;
  }
}
</style>