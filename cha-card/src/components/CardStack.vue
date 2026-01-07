<template>
    <div class="card-stack">
        <!-- แสดง 3 ใบบนสุดที่ซ้อนกัน -->
        <div v-for="(card, index) in visibleCards" :key="`stack-${card.id}-${index}`" class="stack-layer"
            :style="getStackStyle(index)">
            <div class="card-pattern"></div>
        </div>

        <!-- Counter แสดงจำนวนไพ่ -->
        <div v-if="remainingCount > 0" class="card-counter">
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
        transform: `translateY(${index * 3}px) scale(${1 - index * 0.02})`,
        zIndex: props.cards.length - index,
        opacity: 1 - index * 0.15,
    };
}
</script>

<style scoped>
.card-stack {
    position: relative;
    width: 280px;
    height: 400px;
}

.stack-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.card-pattern {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background-image: repeating-linear-gradient(45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.1) 10px,
            rgba(255, 255, 255, 0.1) 20px),
        repeating-linear-gradient(-45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.1) 10px,
            rgba(255, 255, 255, 0.1) 20px);
}

.card-counter {
    position: absolute;
    bottom: -16px;
    right: -16px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 20px;
    color: #667eea;
    z-index: 999;
}

@media (max-width: 640px) {
    .card-stack {
        width: 240px;
        height: 360px;
    }
}
</style>