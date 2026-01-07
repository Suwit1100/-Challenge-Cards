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
      <div v-if="currentCard" :class="['revealed-card', { active: isAnimating }]" @click="closeCard">
        <GameCard :card="currentCard" />

        <div v-if="isAnimating" class="tap-hint">แตะเพื่อปิด</div>
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

// ฟังก์ชันสำหรับปิดไพ่เมื่อคลิก
function closeCard() {
  deck.value = deck.value.slice(1);
  isAnimating.value = false;
  stopSpeaking(); // สั่งให้หยุดพูดเมื่อปิดไพ่ด้วย (ถ้าต้องการ)
}
</script>

<style scoped>
/* ===== Global Styles ===== */
.game-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  padding: 1rem;
  margin: 0;
}

/* ===== Background Decoration ===== */
.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s infinite;
}

.sparkle-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 40%;
  right: 20%;
  animation-delay: 1s;
}

.sparkle-3 {
  top: 60%;
  left: 25%;
  animation-delay: 2s;
}

.sparkle-4 {
  top: 80%;
  right: 30%;
  animation-delay: 1.5s;
}

@keyframes twinkle {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

/* ===== Header ===== */
.game-header {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  z-index: 10;
}

.game-title {
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin: 0;
}

.header-controls {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  position: relative;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  overflow: hidden;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.icon-button:active {
  transform: translateY(0);
}

.button-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.icon-button:hover .button-glow {
  opacity: 1;
}

/* ===== Deck Area ===== */
.deck-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  padding: 2rem 0;
  position: relative;
}

.deck-wrapper {
  position: relative;
  transition: transform 0.2s ease;
  z-index: 1;
}

.deck-wrapper.shake {
  animation: shake 0.3s ease;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px) rotate(-2deg);
  }

  75% {
    transform: translateX(5px) rotate(2deg);
  }
}

.empty-deck {
  text-align: center;
  color: white;
  padding: 2rem;
}

.empty-deck p {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.reset-button {
  position: relative;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.revealed-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.5) rotateY(90deg);
  opacity: 0;
  z-index: 10;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: blur(10px);
}

.revealed-card.active {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.1) rotateY(0deg);
  filter: blur(0px);
  animation: cardReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    cardFloat 2s ease-in-out 0.8s infinite,
    cardGlow 1.5s ease-in-out infinite;
}

@keyframes cardReveal {
  0% {
    transform: translate(-50%, -50%) scale(0.5) rotateY(90deg);
    opacity: 0;
    filter: blur(10px);
  }

  60% {
    transform: translate(-50%, -50%) scale(1.15) rotateY(0deg);
  }

  100% {
    transform: translate(-50%, -50%) scale(1.1) rotateY(0deg);
    opacity: 1;
    filter: blur(0px);
  }
}

@keyframes cardFloat {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1.1) translateY(0px);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.1) translateY(-10px);
  }
}

@keyframes cardGlow {

  0%,
  100% {
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
  }

  50% {
    filter: drop-shadow(0 0 40px rgba(102, 126, 234, 0.8)) drop-shadow(0 0 60px rgba(118, 75, 162, 0.6));
  }
}

/* ===== Draw Button ===== */
.draw-button {
  position: relative;
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.4);
  overflow: hidden;
  z-index: 10;
  margin-bottom: 1rem;
}

.draw-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(245, 87, 108, 0.5);
}

.draw-button:active:not(:disabled) {
  transform: translateY(-1px);
}

.draw-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.button-text {
  position: relative;
  z-index: 2;
}

/* ===== Card Counter ===== */
.card-counter {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
}

.counter-text {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .game-container {
    padding: 0.5rem;
  }

  .game-header {
    margin-bottom: 1rem;
  }

  .deck-area {
    gap: 1rem;
    padding: 1rem 0;
  }

  .draw-button {
    padding: 0.875rem 2.5rem;
    font-size: 1.125rem;
  }

  .icon-button {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .game-title {
    font-size: 1.25rem;
  }

  .draw-button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
  }

  .icon-button {
    width: 36px;
    height: 36px;
  }

  .counter-text {
    font-size: 0.875rem;
  }
}
</style>