const musicBox = document.getElementById('musicBox');
const windButton = document.getElementById('windButton');
const message = document.getElementById('message');
const confettiCanvas = document.getElementById('confettiCanvas');
const circleCanvas = document.getElementById('circleCanvas');
const timerDiv = document.getElementById('timer');
const ctx = confettiCanvas.getContext('2d');
const circleCtx = circleCanvas.getContext('2d');
const winAudio = new Audio('cheering.mp3');
const loseAudio = new Audio('pop-goes-the-weasel.mp3');
const clockAudio = new Audio('my-grandfathers-clock.mp3');
const windUpAudio = new Audio('wind-up.mp3');
let timer;
let fillLevel = 0;
let fillInterval;
let isGameOver = false;

circleCanvas.width = 150;
circleCanvas.height = 150;

clockAudio.loop = true;

function startClockMusic() {
    clockAudio.play();
}

function stopClockMusic() {
    clockAudio.pause();
    clockAudio.currentTime = 0;
}

function startWinSequence() {
    winAudio.play();
    message.textContent = 'YOU WON!';
    startConfetti();
}

function startLoseSequence() {
    loseAudio.play();
    message.textContent = 'Game Over';
    windButton.style.display = 'none';
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Try Again';
    retryButton.onclick = () => {
        windUpAudio.play();
        location.reload();
    };
    document.body.appendChild(retryButton);
}

function startConfetti() {
    const confettiColors = ['#ff0', '#f00', '#0f0', '#00f', '#0ff', '#f0f'];
    const confettiPieces = Array.from({ length: 300 }, () => ({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        r: Math.random() * 10 + 5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speed: Math.random() * 3 + 2
    }));

    function drawConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiPieces.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.y += p.speed;
            if (p.y > confettiCanvas.height) {
                p.y = -p.r;
            }
        });
        requestAnimationFrame(drawConfetti);
    }

    drawConfetti();
}

function updateTimer() {
    let timeLeft = 120; // 2 minutes in seconds
    function tick() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDiv.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            stopClockMusic();
            if (!isGameOver) startLoseSequence();
        }
    }
    tick();
    timer = setInterval(tick, 1000);
}

function drawCircle() {
    const radius = 70;
    const center = { x: circleCanvas.width / 2, y: circleCanvas.height / 2 };

    function updateCircle() {
        circleCtx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);
        circleCtx.beginPath();
        circleCtx.arc(center.x, center.y, radius, -Math.PI / 2, (2 * Math.PI * fillLevel) - Math.PI / 2);
        circleCtx.lineWidth = 10;
        circleCtx.strokeStyle = '#00f';
        circleCtx.stroke();
    }

    function fillCircle() {
        if (fillLevel < 1) {
            fillLevel += 0.02;
            updateCircle();
        }
    }

    function unfillCircle() {
        if (fillLevel > 0) {
            fillLevel -= 0.01;
            updateCircle();
        }
    }

    windButton.addEventListener('mousedown', () => {
        if (fillLevel < 1) fillCircle();
        if (fillLevel >= 1 && !isGameOver) {
            clearInterval(fillInterval);
            startWinSequence();
            isGameOver = true;
        }
    });

    fillInterval = setInterval(unfillCircle, 1000);
}

windButton.addEventListener('click', () => {
    windUpAudio.play();
    if (!timer) updateTimer();
});

window.onload = () => {
    startClockMusic();
    drawCircle();
};
