<template>
    <div class="card-stack">
        <!-- แสดง 3 ใบบนสุดที่ซ้อนกัน -->
        <div v-for="(card, index) in visibleCards" :key="`stack-${card.id}-${index}`" class="stack-layer"
            :style="getStackStyle(index)">
            <div class="card-pattern"></div>
        </div>

        <!-- Counter แสดงจำนวนไพ่ -->
        <div v-if="remainingCount > 0" class="card-counter-badge">
            <span>{{ remainingCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Card } from "../constants/cards";

const props = defineProps<{
    cards: Card[];
}>();

// แสดงแค่ 3 ใบบนสุด
const visibleCards = computed(() => props.cards.slice(0, 3));

const remainingCount = computed(() => props.cards.length);

function getStackStyle(index: number) {
    return {
        transform: `translateY(${index * 4}px) translateX(${index * 2}px) scale(${1 - index * 0.03})`,
        zIndex: props.cards.length - index,
        opacity: 1 - index * 0.2,
    };
}
</script>

<style scoped>
.card-stack {
    position: relative;
    width: 280px;
    height: 400px;
    perspective: 1000px;
}

.stack-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.card-pattern {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: linear-gradient(135deg, #e8d5b7 0%, #b8a88a 100%);
    position: relative;
    overflow: hidden;
}

/* ลายไพ่แบบตาราง */
.card-pattern::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
        repeating-linear-gradient(45deg,
            rgba(139, 119, 101, 0.1) 0px,
            rgba(139, 119, 101, 0.1) 10px,
            transparent 10px,
            transparent 20px),
        repeating-linear-gradient(-45deg,
            rgba(139, 119, 101, 0.1) 0px,
            rgba(139, 119, 101, 0.1) 10px,
            transparent 10px,
            transparent 20px);
}

/* เงาและไฮไลท์ */
.card-pattern::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 100%);
}

/* Counter Badge */
.card-counter-badge {
    position: absolute;
    bottom: -15px;
    right: -15px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    border: 3px solid rgba(255, 255, 255, 0.5);
}

.card-counter-badge span {
    font-size: 1.25rem;
    font-weight: 700;
    color: #667eea;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Hover Effect */
.card-stack:hover .stack-layer:first-child {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
    .card-stack {
        width: 240px;
        height: 340px;
    }

    .card-counter-badge {
        width: 45px;
        height: 45px;
        bottom: -12px;
        right: -12px;
    }

    .card-counter-badge span {
        font-size: 1.125rem;
    }
}

@media (max-width: 480px) {
    .card-stack {
        width: 200px;
        height: 280px;
    }

    .card-counter-badge {
        width: 40px;
        height: 40px;
        bottom: -10px;
        right: -10px;
    }

    .card-counter-badge span {
        font-size: 1rem;
    }
}
</style>