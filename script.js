document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const screens = {
        envelope: document.getElementById('envelope-section'),
        hero: document.getElementById('hero'),
        flowers: document.getElementById('flowers'),
        chocolates: document.getElementById('chocolates'),
        tenThings: document.getElementById('ten-things'),
        proposal: document.getElementById('proposal')
    };

    // Smooth Transition Function (Scale + Fade)
    function transition(currentScreen, nextScreen, callback) {
        // 1. Exit current
        currentScreen.classList.add('exiting');

        // 2. Wait for exit animation
        setTimeout(() => {
            currentScreen.classList.remove('active', 'exiting');
            currentScreen.classList.add('hidden');

            // 3. Prep next screen
            nextScreen.classList.remove('hidden');
            nextScreen.classList.add('active'); // Triggers scale(1) opacity: 1

            // Stagger children (if not envelope)
            const children = nextScreen.children;
            Array.from(children).forEach((child, index) => {
                if (nextScreen.id !== 'envelope-section') {
                    child.classList.remove('stagger-1', 'stagger-2', 'stagger-3');
                    void child.offsetWidth; // Reflow
                    if (index === 0) child.classList.add('stagger-1');
                    if (index === 1) child.classList.add('stagger-2');
                    if (index > 1) child.classList.add('stagger-3');
                }
            });

            if (callback) callback();
        }, 600); // 0.6s match CSS
    }

    // 1. Envelope Logic
    const envelopeWrapper = document.getElementById('envelope');

    envelopeWrapper.addEventListener('click', () => {
        if (envelopeWrapper.classList.contains('open')) return;

        envelopeWrapper.classList.add('open');
        document.querySelector('.action-text').style.opacity = '0'; // Hide text immediately

        setTimeout(() => {
            transition(screens.envelope, screens.hero);
        }, 2000);
    });

    // 2. Hero -> Flowers
    document.getElementById('to-flowers-btn').addEventListener('click', () => {
        transition(screens.hero, screens.flowers);
    });

    // 3. Flowers Logic
    const flowerContainer = document.getElementById('flower-bouquet');
    const toChocolatesBtn = document.getElementById('to-chocolates-btn');
    let flowersBloomed = false;

    flowerContainer.addEventListener('click', () => {
        if (flowersBloomed) return;
        flowersBloomed = true;

        // Bloom effect
        const emojis = ['🌸', '🌺', '🌷', '🌻', '🌹', '💐', '🌼'];

        for (let i = 0; i < 15; i++) {
            const flower = document.createElement('div');
            flower.classList.add('flower-pop');
            flower.innerText = emojis[Math.floor(Math.random() * emojis.length)];

            // Random position around center
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;

            flower.style.left = `calc(50% + ${x}px)`;
            flower.style.top = `calc(50% + ${y}px)`;
            flower.style.animationDelay = `${Math.random() * 0.5}s`;

            flowerContainer.appendChild(flower);
        }

        document.querySelector('.flower-center').innerText = '🥰';
        document.querySelector('#flowers .instruction-text').innerText = 'For you!';

        // Show next button
        setTimeout(() => {
            toChocolatesBtn.classList.remove('hidden');
            toChocolatesBtn.style.animation = 'fadeIn 1s forwards';
        }, 1000);
    });

    toChocolatesBtn.addEventListener('click', () => {
        transition(screens.flowers, screens.chocolates);
    });

    // 4. Chocolates Logic
    const chocolateBox = document.getElementById('choco-box');
    const toReasonsBtn = document.getElementById('to-reasons-btn');
    let boxOpen = false;
    let chocolatesEaten = 0;

    chocolateBox.querySelector('.lid').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent box click bubbling if needed
        if (!boxOpen) {
            chocolateBox.classList.add('open');
            boxOpen = true;
            document.querySelector('#chocolates .instruction-text').innerText = 'Eat them! (Click one)';
        }
    });

    const chocos = document.querySelectorAll('.choco');
    chocos.forEach(choco => {
        choco.addEventListener('click', (e) => {
            if (!boxOpen) return;
            e.stopPropagation();

            if (!choco.classList.contains('eaten')) {
                choco.classList.add('eaten');
                chocolatesEaten++;

                if (chocolatesEaten === chocos.length) {
                    document.querySelector('#chocolates .instruction-text').innerText = 'All gone! 😋';
                    toReasonsBtn.classList.remove('hidden');
                    toReasonsBtn.style.animation = 'fadeIn 1s forwards';
                }
            }
        });
    });

    toReasonsBtn.addEventListener('click', () => {
        transition(screens.chocolates, screens.tenThings);
    });

    // 5. 10 Things Logic (Interactive Carousel)
    const nextReasonBtn = document.getElementById('next-reason-btn');
    const cardText = document.getElementById('card-text');
    const cardCounter = document.getElementById('card-counter');
    const loveCard = document.getElementById('love-card');
    const finalBtn = document.getElementById('final-btn');

    let currentThingIndex = 0;
    const things = [
        "Your smile lights up my whole world ✨",
        "You make the best jokes",
        "How you look at me",
        "Your kindness to everyone",
        "You're the smartest person I know 🧠",
        "Cuddles with you are my favorite thing",
        "Your laugh is music to my ears 🎶",
        "You support my dreams 🌟",
        "You're my best friend 👯‍♀️",
        "Simply because you are YOU ❤️"
    ];

    nextReasonBtn.addEventListener('click', () => {
        // Animate Out
        loveCard.classList.add('slide-out-left');

        setTimeout(() => {
            // Update Content
            currentThingIndex++;
            if (currentThingIndex < things.length) {
                cardText.innerText = things[currentThingIndex];
                cardCounter.innerText = `${currentThingIndex + 1} / ${things.length}`;

                // Animate In
                loveCard.classList.remove('slide-out-left');
                loveCard.classList.add('slide-in-right');

                setTimeout(() => {
                    loveCard.classList.remove('slide-in-right');
                }, 400);

                // If last item, change button
                if (currentThingIndex === things.length - 1) {
                    nextReasonBtn.classList.add('hidden');
                    finalBtn.classList.remove('hidden');
                    finalBtn.style.animation = 'fadeIn 1s forwards';
                }
            } else {
                // If somehow clicked past end
                nextReasonBtn.classList.add('hidden');
                finalBtn.classList.remove('hidden');
            }
        }, 400); // Wait for slide out
    });

    finalBtn.addEventListener('click', () => {
        transition(screens.tenThings, screens.proposal);
    });

    // 6. Proposal Logic
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const celebration = document.getElementById('celebration');
    const container = document.querySelector('.container');

    noBtn.addEventListener('mouseover', moveButton);
    // Touch support for interactive mobile
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveButton(); });
    noBtn.addEventListener('click', () => { alert("Please say yes? 🥺"); moveButton(); });

    function moveButton() {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        noBtn.style.zIndex = '100';
    }

    yesBtn.addEventListener('click', () => {
        // Celebration Mode!
        celebration.classList.remove('hidden');
        document.querySelector('.buttons').style.display = 'none';
        document.querySelector('#proposal h2').innerText = "YAY! YAY! YAY! ❤️";

        // Add shake effect
        container.classList.add('shake-it');
        document.body.classList.add('celebration-bg');

        // Intense Confetti
        launchConfetti();

        // Float "Yay" text
        spawnFloatingText();

        // Heart Explosion
        explodeHearts();
    });

    function spawnFloatingText() {
        const phrases = ["Yay!", "Woohoo!", "Love you!", "Forever!", "YES!", "My Valentine!", "❤️", "🥰"];
        const colors = ['#ff0000', '#ff69b4', '#ff1493', '#c9184a', '#800080'];

        let count = 0;
        const interval = setInterval(() => {
            if (count > 30) clearInterval(interval); // Stop after 30 pops

            const el = document.createElement('div');
            el.classList.add('yay-text');
            el.innerText = phrases[Math.floor(Math.random() * phrases.length)];
            el.style.color = colors[Math.floor(Math.random() * colors.length)];

            // Random position
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;

            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.fontSize = `${Math.random() * 2 + 1.5}rem`; // Random size

            document.body.appendChild(el);

            // Clean up DOM
            setTimeout(() => el.remove(), 2000);

            count++;
        }, 100); // New Yay every 100ms
    }

    function explodeHearts() {
        const container = document.createElement('div');
        container.classList.add('heart-explosion');
        document.body.appendChild(container);

        const hearts = ['💖', '💕', '💗', '💓', '💝'];

        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.classList.add('big-heart-particle');
            heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 200 + 100; // Distance
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            heart.style.animationDelay = `${Math.random() * 0.2}s`;

            container.appendChild(heart);
        }

        setTimeout(() => container.remove(), 2000);
    }

    function launchConfetti() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 0 };
        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 80 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#e5989b', '#ffb7c5', '#ffffff', '#ff0000'] }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#e5989b', '#ffb7c5', '#ffffff', '#ff0000'] }));
        }, 200);
    }
});
