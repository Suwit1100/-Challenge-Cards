<template>
    <div class="card">
        <div class="card-inner">
            <!-- ด้านหน้า (หงาย) -->
            <div class="card-front">
                <div class="card-pattern">
                    <div class="card-content">
                        <div class="card-header">
                            <div class="card-category">{{ card.category }}</div>
                            <div class="card-icon">✦</div>
                        </div>
                        <div class="card-body">
                            <h2 class="card-title">{{ card.title }}</h2>
                            <p class="card-text">{{ card.text }}</p>
                        </div>
                        <div class="card-footer">
                            <div class="card-decoration"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ด้านหลัง (แสดงข้อมูล) -->
            <div class="card-back">
                <div class="card-back-content">
                    <div class="back-pattern"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Card } from "../constants/cards";

defineProps<{
    card: Card;
}>();
</script>

<style scoped>
.card {
    width: 320px;
    height: 450px;
    perspective: 1000px;
    cursor: pointer;
}

.card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover .card-inner {
    transform: translateY(-8px);
}

.card-front,
.card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 24px;
    overflow: hidden;
}

.card-front {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.card-pattern {
    width: 100%;
    height: 100%;
    position: relative;
    background-image:
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        repeating-linear-gradient(45deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.03) 20px,
            rgba(255, 255, 255, 0.03) 40px);
}

.card-content {
    width: 100%;
    height: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 1;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.card-category {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
    background: rgba(255, 255, 255, 0.15);
    padding: 6px 14px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-icon {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.6);
    animation: float 3s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

.card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    padding: 20px 0;
}

.card-title {
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.2;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
    margin: 0;
}

.card-text {
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
}

.card-footer {
    display: flex;
    justify-content: center;
}

.card-decoration {
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%);
    border-radius: 2px;
}

.card-back {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    transform: rotateY(180deg);
    box-shadow: 0 20px 60px rgba(245, 87, 108, 0.4);
}

.card-back-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.back-pattern {
    width: 80%;
    height: 80%;
    background-image:
        repeating-linear-gradient(45deg,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(255, 255, 255, 0.1) 2px,
            transparent 2px,
            transparent 12px),
        repeating-linear-gradient(-45deg,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(255, 255, 255, 0.1) 2px,
            transparent 2px,
            transparent 12px);
    border-radius: 16px;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 640px) {
    .card {
        width: 280px;
        height: 400px;
    }

    .card-content {
        padding: 24px;
    }

    .card-title {
        font-size: 26px;
    }

    .card-text {
        font-size: 15px;
    }

    .card-category {
        font-size: 10px;
        padding: 5px 12px;
    }
}
</style>