// ========================================
// ЖИВОЙ ФОН С ЧАСТИЦАМИ
// ========================================

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];


// ========================================
// НАСТРОЙКА CANVAS
// ========================================

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createParticles();
}


// ========================================
// СОЗДАНИЕ ЧАСТИЦ
// ========================================

function createParticles() {

    particles = [];

    const amount = window.innerWidth < 700 ? 70 : 140;

    for (let i = 0; i < amount; i++) {

        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            size: Math.random() * 2 + 0.5,

            speedX: (Math.random() - 0.5) * 0.35,
            speedY: (Math.random() - 0.5) * 0.35,

            opacity: Math.random() * 0.7 + 0.2,

            phase: Math.random() * Math.PI * 2
        });
    }
}


// ========================================
// МЫШЬ
// ========================================

const mouse = {
    x: null,
    y: null,
    radius: 180
};


window.addEventListener("mousemove", (event) => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

});


window.addEventListener("mouseleave", () => {

    mouse.x = null;
    mouse.y = null;

});


// ========================================
// РИСУЕМ ЧАСТИЦЫ
// ========================================

function drawParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    particles.forEach((particle) => {

        // Движение
        particle.x += particle.speedX;
        particle.y += particle.speedY;


        // Выход за границы
        if (particle.x < 0) {
            particle.x = canvas.width;
        }

        if (particle.x > canvas.width) {
            particle.x = 0;
        }

        if (particle.y < 0) {
            particle.y = canvas.height;
        }

        if (particle.y > canvas.height) {
            particle.y = 0;
        }


        // Реакция на мышь
        if (mouse.x !== null && mouse.y !== null) {

            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;

            const distance = Math.sqrt(
                dx * dx + dy * dy
            );


            if (distance < mouse.radius) {

                const force =
                    (mouse.radius - distance)
                    / mouse.radius;

                particle.x += dx * force * 0.006;
                particle.y += dy * force * 0.006;
            }
        }


        // Мерцание
        particle.phase += 0.025;

        const opacity =
            particle.opacity +
            Math.sin(particle.phase) * 0.2;


        // Частица
        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(196, 132, 252, ${opacity})`;

        ctx.shadowBlur = 12;

        ctx.shadowColor =
            "rgba(168, 85, 247, 0.9)";

        ctx.fill();
    });


    ctx.shadowBlur = 0;
}


// ========================================
// ЛИНИИ МЕЖДУ ЧАСТИЦАМИ
// ========================================

function drawConnections() {

    const maxDistance = 120;


    for (let i = 0; i < particles.length; i++) {

        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {

            const dx =
                particles[i].x -
                particles[j].x;

            const dy =
                particles[i].y -
                particles[j].y;

            const distance =
                Math.sqrt(
                    dx * dx + dy * dy
                );


            if (distance < maxDistance) {

                const opacity =
                    (1 - distance / maxDistance) * 0.16;


                ctx.beginPath();

                ctx.moveTo(
                    particles[i].x,
                    particles[i].y
                );

                ctx.lineTo(
                    particles[j].x,
                    particles[j].y
                );


                ctx.strokeStyle =
                    `rgba(168, 85, 247, ${opacity})`;

                ctx.lineWidth = 1;

                ctx.stroke();
            }
        }
    }
}


// ========================================
// АНИМАЦИЯ
// ========================================

function animate() {

    drawParticles();

    drawConnections();

    requestAnimationFrame(animate);
}


// ========================================
// ЗАПУСК
// ========================================

resizeCanvas();

animate();


// ========================================
// ИЗМЕНЕНИЕ РАЗМЕРА ОКНА
// ========================================

window.addEventListener(
    "resize",
    resizeCanvas
);