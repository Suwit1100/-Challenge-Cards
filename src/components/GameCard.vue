<template>
    <div class="card">
        <div class="card-inner">
            <!-- ด้านหน้า (แสดงข้อมูล) -->
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
    width: 280px;
    height: 400px;
    perspective: 1000px;
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

/* ด้านหน้าไพ่ */
.card-front {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
    overflow: hidden;
}

.card-pattern {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
    position: relative;
}

/* Background subtle pattern */
.card-pattern::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image:
        repeating-linear-gradient(0deg,
            #000 0px,
            #000 1px,
            transparent 1px,
            transparent 20px),
        repeating-linear-gradient(90deg,
            #000 0px,
            #000 1px,
            transparent 1px,
            transparent 20px);
}

/* Content */
.card-content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    z-index: 2;
}

/* Header */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.card-category {
    font-size: 0.75rem;
    font-weight: 600;
    color: #667eea;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: rgba(102, 126, 234, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
}

.card-icon {
    font-size: 1.25rem;
    color: #667eea;
    opacity: 0.6;
}

/* Body */
.card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

.card-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 1rem 0;
    line-height: 1.3;
}

.card-text {
    font-size: 1rem;
    line-height: 1.6;
    color: #4a5568;
    margin: 0;
}

/* Footer */
.card-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
}

.card-decoration {
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #667eea, transparent);
    border-radius: 10px;
}

/* Shine effect */
.card-pattern::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 70%);
    transform: rotate(45deg);
    animation: shine 3s infinite;
}

@keyframes shine {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }

    100% {
        transform: translateX(100%) translateY(100%) rotate(45deg);
    }
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
    .card {
        width: 240px;
        height: 340px;
    }

    .card-content {
        padding: 1.5rem;
    }

    .card-title {
        font-size: 1.5rem;
    }

    .card-text {
        font-size: 0.9rem;
    }

    .card-category {
        font-size: 0.7rem;
    }
}

@media (max-width: 480px) {
    .card {
        width: 200px;
        height: 280px;
    }

    .card-content {
        padding: 1.25rem;
    }

    .card-title {
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
    }

    .card-text {
        font-size: 0.85rem;
        line-height: 1.5;
    }

    .card-category {
        font-size: 0.65rem;
        padding: 0.2rem 0.6rem;
    }

    .card-icon {
        font-size: 1rem;
    }
}
</style>