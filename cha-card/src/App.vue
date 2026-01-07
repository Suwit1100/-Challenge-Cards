<template>
  <div class="game-container">
    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="sparkle sparkle-1"></div>
      <div class="sparkle sparkle-2"></div>
      <div class="sparkle sparkle-3"></div>
      <div class="sparkle sparkle-4"></div>
    </div>

    <!-- Header -->
    <div class="game-header">
      <h1 class="game-title">🎴 เกมจั่วไพ่</h1>
      <div class="header-controls">
        <!-- ปุ่มเปิด/ปิดเสียง -->
        <button class="icon-button" @click="toggleAudio" :title="audioEnabled ? 'ปิดเสียง' : 'เปิดเสียง'">
          <span class="button-glow"></span>
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
          <span class="button-glow"></span>
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
            <span class="button-glow"></span>
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
      <span class="button-glow"></span>
      <span class="button-text">{{ deck.length === 0 ? "ไพ่หมดแล้ว" : "จั่วไพ่" }}</span>
    </button>

    <!-- Card Counter -->
    <div class="card-counter">
      <span class="counter-text">เหลือ {{ deck.length }} ใบ</span>
    </div>
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
  position: relative;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
  gap: 40px;
  overflow: hidden;
}

/* พื้นหลังเหมือนผ้า */
.game-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px);
  opacity: 0.5;
  pointer-events: none;
}

/* Background Decoration - ประกายดาว */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 20px 4px rgba(255, 255, 255, 0.8);
  animation: twinkle 3s ease-in-out infinite;
}

.sparkle-1 {
  top: 15%;
  left: 20%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 30%;
  right: 15%;
  animation-delay: 1s;
}

.sparkle-3 {
  bottom: 25%;
  left: 15%;
  animation-delay: 2s;
}

.sparkle-4 {
  bottom: 40%;
  right: 25%;
  animation-delay: 1.5s;
}

@keyframes twinkle {

  0%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  gap: 16px;
  z-index: 10;
}

.game-title {
  font-size: 32px;
  color: white;
  font-weight: 800;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.header-controls {
  display: flex;
  gap: 12px;
}

.icon-button {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.icon-button svg {
  position: relative;
  z-index: 2;
}

.button-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease-out;
  pointer-events: none;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.icon-button:hover .button-glow {
  width: 120px;
  height: 120px;
  opacity: 1;
}

.icon-button:active {
  transform: scale(0.95);
}

.deck-area {
  position: relative;
  width: 320px;
  height: 450px;
  z-index: 10;
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
    transform: translateX(-10px) rotate(-3deg);
  }

  75% {
    transform: translateX(10px) rotate(3deg);
  }
}

.empty-deck {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.reset-button {
  position: relative;
  padding: 14px 32px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: white;
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.reset-button:hover .button-glow {
  width: 200px;
  height: 200px;
  opacity: 1;
}

.revealed-card {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  transform: translateY(0) rotateY(180deg) scale(0.8);
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.revealed-card.active {
  opacity: 1;
  transform: translateY(-40px) rotateY(0deg) scale(1.05);
  z-index: 100;
}

.draw-button {
  position: relative;
  padding: 24px 72px;
  font-size: 28px;
  font-weight: 800;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  color: #1e3c72;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 2px;
  overflow: hidden;
  z-index: 10;
}

.button-text {
  position: relative;
  z-index: 2;
}

.draw-button:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.draw-button:hover:not(:disabled) .button-glow {
  width: 300px;
  height: 300px;
  opacity: 1;
}

.draw-button:active:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
}

.draw-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.card-counter {
  position: relative;
  padding: 12px 28px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  z-index: 10;
}

.counter-text {
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 640px) {
  .game-container {
    padding: 20px 16px;
    gap: 32px;
  }

  .game-title {
    font-size: 26px;
  }

  .icon-button {
    width: 44px;
    height: 44px;
  }

  .deck-area {
    width: 280px;
    height: 400px;
  }

  .draw-button {
    padding: 20px 56px;
    font-size: 24px;
  }

  .card-counter {
    padding: 10px 24px;
  }

  .counter-text {
    font-size: 16px;
  }
}

@media (max-width: 380px) {
  .game-title {
    font-size: 22px;
  }

  .deck-area {
    width: 240px;
    height: 360px;
  }

  .draw-button {
    padding: 18px 48px;
    font-size: 20px;
  }
}
</style>