<template>
  <div class="game-container">
    <div class="bg-decoration">
      <div class="noise-overlay"></div>
      <div class="vignette"></div>
      <div v-for="n in 15" :key="n" class="floating-particle" :style="getParticleStyle(n)"></div>
    </div>

    <div :class="['flash-overlay', { active: triggerFlash }]"></div>

    <div class="game-header">
      <h1 class="game-title">
        <div class="logo-wrapper">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="7" y="5" width="14" height="16" rx="2" fill="#ff4757" fill-opacity="0.3" stroke="#ff4757"
              stroke-width="2" />
            <rect x="3" y="3" width="14" height="16" rx="2" fill="#1e3c72" stroke="#ff4757" stroke-width="2" />
            <path d="M7 7h6M7 11h6M7 15h6" stroke="#ff4757" stroke-width="2" stroke-linecap="round" opacity="0.8" />
          </svg>
        </div>
        <span class="text">จั่วไพ่จ้า <small></small></span>
      </h1>

      <div class="header-controls">
        <button class="icon-button" @click="toggleAudio" :class="{ muted: !audioEnabled }" aria-label="Toggle Sound">
          <div class="btn-bg"></div>
          <svg v-if="audioEnabled" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
          </svg>
        </button>

        <button class="icon-button" @click="resetDeck" aria-label="Reset Game">
          <div class="btn-bg"></div>
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      </div>
    </div>

    <div class="stage-area">

      <div :class="['deck-wrapper', { 'shake-hard': isShaking, 'fly-away': isAnimating }]">
        <CardStack v-if="deck.length > 0" :cards="deck" />
        <div v-else class="empty-deck-state">
          <div class="empty-icon">📭</div>
          <p>Deck Empty</p>
        </div>
      </div>

      <div v-if="currentCard" class="reveal-stage" :class="{ active: isAnimating }" @click="closeCard">

        <div class="god-rays-container">
          <div class="god-rays"></div>
        </div>

        <div class="shockwave"></div>

        <div class="card-presentation">
          <GameCard :card="currentCard" />
          <div class="tap-hint">TAP TO DISMISS</div>
        </div>
      </div>

    </div>

    <div class="hud-controls">
      <!-- <div class="card-counter">
        <div class="counter-pill">
          <span class="dot" :class="{ 'blink-red': deck.length <= 3 }"></span>
          CARDS LEFT: {{ deck.length }}
        </div>
      </div> -->

      <button class="draw-button-aaa" @click="drawCard" :disabled="deck.length === 0 || isAnimating"
        :class="{ 'pulse-hint': !isAnimating && deck.length > 0 }">
        <div class="btn-shine"></div>
        <span class="btn-content">
          {{ deck.length === 0 ? "EMPTY" : "DRAW CARD" }}
        </span>
      </button>
    </div>

    <a href="https://instagram.com/suwitleee" target="_blank" class="creator-credit" style="color: white;">
      <span class="credit-label">Created by Suwit 2026</span>
      <div class="credit-name">
        @suwitleee
      </div>
    </a>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import GameCard from "./components/GameCard.vue";
import CardStack from "./components/CardStack.vue";
import { SAMPLE_CARDS } from "./constants/cards";
import { shuffleCards } from "./utils/shuffle";
import { speakText, stopSpeaking } from "./utils/speech";
import type { Card } from "./constants/cards";

// State
const deck = ref<Card[]>(shuffleCards(SAMPLE_CARDS));
const currentCard = ref<Card | null>(null);
const isAnimating = ref(false); // สถานะการเปิดไพ่
const isShaking = ref(false);   // สถานะสั่นกองไพ่
const triggerFlash = ref(false); // สถานะแสงวาบ
const audioEnabled = ref(true);

// Helper สำหรับสุ่มตำแหน่งดาวใน Background
const getParticleStyle = (n: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.5 + 0.2,
    transform: `scale(${Math.random() * 0.5 + 0.5})`
  };
};

// Main Logic: จั่วไพ่แบบ AAA
function drawCard() {
  if (deck.value.length === 0 || isAnimating.value) return;

  // 1. เริ่มสั่น (Charge Up)
  isShaking.value = true;

  // ใช้เวลา 1200ms ตามที่คุณต้องการ
  const TOTAL_PREPARE_TIME = 1200;

  setTimeout(() => {
    // จังหวะนี้คือไพ่กำลังจะระเบิดออกมา
    const drawnCard = deck.value[0];
    currentCard.value = drawnCard;

    // ยิง Flash แสงวาบ
    triggerFlash.value = true;

    // ปิดสถานะสั่น แล้วเปิดสถานะแสดงการ์ดทันที (ห้ามมี Gap)
    isShaking.value = false;
    isAnimating.value = true;

    setTimeout(() => {
      triggerFlash.value = false;

      if (audioEnabled.value) {
        setTimeout(() => {
          speakText(drawnCard.text, drawnCard.title);
        }, 1000);
      }
    }, 200); // ให้ Flash ค้างไว้นิดนึงเพื่อความสะใจ

  }, TOTAL_PREPARE_TIME);
}

function resetDeck() {
  stopSpeaking();
  deck.value = shuffleCards(SAMPLE_CARDS);
  currentCard.value = null;
  isAnimating.value = false;
  isShaking.value = false;
  triggerFlash.value = false;
}

function toggleAudio() {
  audioEnabled.value = !audioEnabled.value;
  if (!audioEnabled.value) stopSpeaking();
}

function closeCard() {
  // Animation ขาออก (ถ้าต้องการ) สามารถใส่เพิ่มได้
  deck.value = deck.value.slice(1);
  isAnimating.value = false;
  currentCard.value = null;
  stopSpeaking();
}
</script>

<style scoped>
/* =========================================
   1. CORE ATMOSPHERE (Background & Vibes)
   ========================================= */
.game-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  background: radial-gradient(circle at 50% 30%, #1e3a8a 0%, #0f172a 60%, #000000 100%);
  display: flex;
  flex-direction: column;
  perspective: 1000px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Texture ผ้าสักหลาด */
.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

/* ขอบมืด */
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: none;
  z-index: 1;
}

/* Particles ลอยไปมา */
.floating-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #60a5fa;
  border-radius: 50%;
  box-shadow: 0 0 10px #60a5fa;
  animation: floatUp 10s linear infinite;
  z-index: 2;
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    transform: translateY(-10vh) scale(1);
    opacity: 0;
  }
}

/* แสงวาบเต็มจอ (The Flash) */
.flash-overlay {
  position: fixed;
  inset: 0;
  background: white;
  opacity: 0;
  pointer-events: none;
  z-index: 999;
  /* อยู่บนสุด */
  transition: opacity 0.1s ease-out;
}

.flash-overlay.active {
  opacity: 1;
}

/* =========================================
   2. HEADER & CONTROLS
   ========================================= */
.game-header {
  position: relative;
  z-index: 50;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.game-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  margin: 0;
}

.game-title .icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.game-title .text {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  background: linear-gradient(to right, #fff, #93c5fd);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 2px 20px rgba(59, 130, 246, 0.5);
}

.icon-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 1.2rem;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.icon-button.muted {
  opacity: 0.5;
}

/* =========================================
   3. STAGE & DECK ANIMATIONS
   ========================================= */
.stage-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}

/* Deck Wrapper */
.deck-wrapper {
  transition: all 0.3s ease;
}

/* Animation: สั่นแรงก่อนเปิด (Charge Up) */
/* --- ปรับปรุงจังหวะการสั่นให้ดูมีพลังขึ้นเรื่อยๆ (Build up) --- */
.shake-hard {
  /* สั่นแบบค่อยๆ แรงขึ้น */
  animation: shakeHeavy 1.2s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shakeHeavy {
  0% {
    transform: translate(0, 0) rotate(0);
  }

  20% {
    transform: translate(-2px, 2px) rotate(-1deg);
  }

  40% {
    transform: translate(-4px, -4px) rotate(1deg) scale(1.05);
  }

  60% {
    transform: translate(5px, 2px) rotate(-2deg) scale(1.1);
    filter: brightness(1.5);
  }

  80% {
    transform: translate(-6px, 5px) rotate(3deg) scale(1.15);
    filter: brightness(1.8);
  }

  100% {
    transform: translate(0, 0) rotate(0) scale(1.2);
    filter: brightness(2);
  }
}

/* --- ปรับจังหวะการ์ดที่เผยออกมา (The Reveal) --- */
.card-presentation {
  position: relative;
  z-index: 10;
  /* เริ่มต้นจากการอยู่ไกลๆ (Z-axis) และมืดๆ */
  transform: scale(0) rotateY(180deg) translateZ(-1000px);
  opacity: 0;
  filter: brightness(5) blur(20px);

  /* เพิ่มเวลา Transition ให้เป็น 1.2s - 1.5s เพื่อให้สอดคล้องกับความ Epic */
  transition:
    transform 1.2s cubic-bezier(0.15, 0.85, 0.35, 1.2),
    opacity 0.6s ease-out,
    filter 1s ease-out;
}

.reveal-stage.active .card-presentation {
  /* พุ่งกลับมาที่ตำแหน่งปกติ พร้อมความนุ่มนวล */
  transform: scale(1.2) rotateY(0deg) translateZ(0);
  opacity: 1;
  filter: brightness(1) blur(0px);
  /* อนิเมชั่นลอยตัวต่อเนื่องหลังจบ Reveal */
  animation: floatingCard 4s ease-in-out 1.2s infinite alternate;
}

/* --- เพิ่มรัศมีแสงกระจาย (Light Burst) หลังการ์ดให้ดูอลังการ --- */
.god-rays-container::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, white 0%, transparent 70%);
  opacity: 0;
  transition: opacity 1s ease-in;
}

.reveal-stage.active .god-rays-container::after {
  animation: lightBurst 1.5s ease-out forwards;
}

@keyframes lightBurst {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(2);
  }
}

/* เมื่อไพ่เปิด Deck จะจางหายไปเล็กน้อย */
.deck-wrapper.fly-away {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease-out;
}

/* Empty State */
.empty-deck-state {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

/* =========================================
   4. REVEAL STAGE (THE HERO)
   ========================================= */
.reveal-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 450px;
  /* ขนาดพื้นที่แสดงผล */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: none;
  /* คลิกทะลุตอนยังไม่ active */
  opacity: 0;
}

.reveal-stage.active {
  opacity: 1;
  pointer-events: auto;
}

/* ตัวการ์ดที่เปิดออกมา */
.card-presentation {
  position: relative;
  z-index: 10;
  transform: scale(0.5) rotateY(180deg);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  /* Spring Effect */
}

.reveal-stage.active .card-presentation {
  transform: scale(1.2) rotateY(0deg);
  opacity: 1;
  animation: floatingCard 3s ease-in-out infinite alternate;
}

@keyframes floatingCard {
  from {
    transform: scale(1.2) translateY(0px) rotate(0deg);
  }

  to {
    transform: scale(1.2) translateY(-15px) rotate(1deg);
  }
}

.tap-hint {
  position: absolute;
  bottom: -40px;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 0.9rem;
  letter-spacing: 2px;
  opacity: 0.7;
  animation: pulse 2s infinite;
}

/* --- Special Effects: God Rays --- */
.god-rays-container {
  position: absolute;
  width: 800px;
  height: 800px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.reveal-stage.active .god-rays-container {
  opacity: 1;
}

.god-rays {
  width: 100%;
  height: 100%;
  background: conic-gradient(from 0deg,
      transparent 0deg,
      rgba(255, 255, 255, 0.1) 20deg,
      transparent 40deg,
      rgba(96, 165, 250, 0.2) 60deg,
      transparent 80deg,
      rgba(255, 255, 255, 0.1) 100deg,
      transparent 120deg);
  border-radius: 50%;
  animation: rotateRays 20s linear infinite;
  mask-image: radial-gradient(circle, transparent 10%, black 100%);
}

@keyframes rotateRays {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* --- Special Effects: Shockwave --- */
.shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0px;
  height: 0px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 50px rgba(96, 165, 250, 0.8);
  opacity: 0;
  z-index: 5;
}

.reveal-stage.active .shockwave {
  animation: shockwaveExplode 0.8s ease-out forwards;
}

@keyframes shockwaveExplode {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
    border-width: 10px;
  }

  100% {
    width: 800px;
    height: 800px;
    opacity: 0;
    border-width: 0px;
  }
}

/* =========================================
   5. HUD CONTROLS (Bottom)
   ========================================= */
.hud-controls {
  position: relative;
  z-index: 50;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Counter */
.counter-pill {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
}

.dot.blink-red {
  background: #ef4444;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0.4;
  }
}

/* AAA DRAW BUTTON */
.draw-button-aaa {
  position: relative;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  /* Gold/Orange */
  border: none;
  padding: 1.2rem 4rem;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  box-shadow:
    0 10px 30px rgba(217, 119, 6, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.draw-button-aaa:hover:not(:disabled) {
  transform: translateY(-5px) scale(1.05);
  box-shadow:
    0 20px 40px rgba(217, 119, 6, 0.6),
    inset 0 2px 0 rgba(255, 255, 255, 0.4);
}

.draw-button-aaa:active:not(:disabled) {
  transform: translateY(-2px) scale(0.98);
}

.draw-button-aaa:disabled {
  background: #334155;
  color: #64748b;
  box-shadow: none;
  cursor: not-allowed;
}

.btn-content {
  position: relative;
  z-index: 2;
  color: white;
  font-size: 1.5rem;
  font-weight: 900;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
}

/* Shine effect on button */
.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: skewX(-20deg);
  transition: 0.5s;
}

.draw-button-aaa:hover .btn-shine {
  left: 150%;
  transition: 0.7s ease-in-out;
}

/* Pulse Hint */
.pulse-hint {
  animation: btnPulse 2s infinite;
}

@keyframes btnPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  }

  70% {
    box-shadow: 0 0 0 20px rgba(245, 158, 11, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .draw-button-aaa {
    padding: 1rem 2.5rem;
    width: 80%;
  }

  .btn-content {
    font-size: 1.2rem;
  }

  .reveal-stage.active .card-presentation {
    transform: scale(1);
  }

  /* ลดขนาดบนมือถือ */
}


/* ===== CREATOR CREDIT (Holographic Style) ===== */
.creator-credit {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-decoration: none;
  z-index: 1000;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.creator-credit:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.credit-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.credit-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(to right, #fff, #60a5fa);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
}

.ig-icon {
  stroke: white;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
}

/* ปรับตำแหน่งบนมือถือ ไม่ให้บังปุ่ม */
@media (max-width: 600px) {
  .creator-credit {
    position: absolute;
    bottom: 10px;
    right: 50%;
    transform: translateX(50%);
    align-items: center;
    width: 100%;
    pointer-events: auto;
  }

  .hud-controls {
    padding-bottom: 4rem;
    margin-bottom: 2rem;
    /* ดันปุ่มขึ้นหลบเครดิต */
  }
}
</style>