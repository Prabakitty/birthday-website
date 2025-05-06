document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 3 seconds
    setTimeout(function() {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loading-screen').style.display = 'none';
            // Try to play music (may require user interaction on some browsers)
            const music = document.getElementById('birthdayMusic');
            music.volume = 0.3;
            const playPromise = music.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play prevented. User needs to interact first.");
                });
            }
        }, 1000);
    }, 3000);

    // Initialize all effects
    initConfetti();
    initHeartCursor();
    initFloatingHearts();
    initLoveMeter();
    initMemoryCards();
    initTimeline();
    initMessageTyping();
    initScrollDown();

    // Observe elements for scroll animations
    initScrollObservers();
});

/* ========== CUSTOM CURSOR ========== */
function initHeartCursor() {
    const heartCursor = document.querySelector('.heart-cursor');
    
    document.addEventListener('mousemove', (e) => {
        heartCursor.style.left = `${e.clientX}px`;
        heartCursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('click', () => {
        document.body.classList.add('heart-cursor-active');
        setTimeout(() => {
            document.body.classList.remove('heart-cursor-active');
        }, 300);
        
        // Create a small heart explosion on click
        createHeartExplosion({clientX: event.clientX, clientY: event.clientY}, 5);
    });
}

/* ========== FLOATING HEARTS BACKGROUND ========== */
function initFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const colors = ['#ff6b8b', '#ff8e53', '#ffcc00', '#ff6b6b', '#ff8e8e'];
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        // Random properties
        const size = Math.random() * 15 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        const left = Math.random() * 100;
        const opacity = Math.random() * 0.7 + 0.3;
        
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.background = color;
        heart.style.left = `${left}%`;
        heart.style.opacity = opacity;
        heart.style.animation = `heartRain ${duration}s linear ${delay}s infinite`;
        heart.style.setProperty('--heart-color', color);
        
        heart.addEventListener('animationiteration', () => {
            heart.style.left = `${Math.random() * 100}%`;
        });
        
        container.appendChild(heart);
    }
    
    // Create multiple hearts
    for (let i = 0; i < 20; i++) {
        createHeart();
    }
}

/* ========== LOVE METER INTERACTION ========== */
function initLoveMeter() {
    const meterFill = document.getElementById('meter-fill');
    const heartBtn = document.getElementById('heart-btn');
    const meterText = document.querySelector('.meter-text');
    let fillLevel = 0;
    const messages = [
        "A little...",
        "More than yesterday...",
        "So much!",
        "To the moon and back!",
        "Infinity and beyond!",
        "The universe isn't big enough to measure!"
    ];
    
    heartBtn.addEventListener('click', () => {
        if (fillLevel < 100) {
            fillLevel += 10;
            if (fillLevel > 100) fillLevel = 100;
            
            meterFill.style.width = `${fillLevel}%`;
            
            // Update message based on fill level
            let messageIndex;
            if (fillLevel <= 20) messageIndex = 0;
            else if (fillLevel <= 40) messageIndex = 1;
            else if (fillLevel <= 60) messageIndex = 2;
            else if (fillLevel <= 80) messageIndex = 3;
            else if (fillLevel <= 99) messageIndex = 4;
            else messageIndex = 5;
            
            meterText.textContent = messages[messageIndex];
            
            // Create small heart animation
            createClickHeart(heartBtn);
            
            // Full meter celebration
            if (fillLevel >= 100) {
                createHeartExplosion(heartBtn.getBoundingClientRect(), 30);
                setTimeout(() => {
                    meterText.innerHTML = "I LOVE YOU! <span class='heart-pulse'>❤️</span>";
                }, 1000);
            }
        }
    });
}

/* ========== MEMORY CARDS ========== */
function initMemoryCards() {
    let audio = new Audio();
    let currentPlayingButton = null;
    let currentPlayingIndex = -1;

    const memories = [
        {
            image: 'images/memory5.jpeg',
            date: 'March 09, 2023',
            title: 'Where Our Journey Began 💖',
            description: 'It was at <del>my</del> our sister’s wedding where our story began. Amidst all the celebrations, smiles, and blessings, fate brought us together.',
            music: 'music/Paarthen.mp3'
        },
        {
            image: 'images/memory6.jpeg',
            date: 'Feb 17, 2025',
            title: 'Our Engagement Ring 💍',
            description: 'That peaceful day in the park, holding your hand and sliding on our engagement ring.',
            music: 'music/enthan uyire.mp3'
        },
        {
            image: 'images/memory4.jpeg',
            date: 'March 19, 2025',
            title: "Always Yours 💕",
            description: 'The warmth of your hand in mine, the silent promise of forever.',
            music: 'music/memory5.mp3'
        },
        {
            image: 'images/memory3.jpeg',
            date: 'April 17, 2025',
            title: 'A Day in the Park, A Memory Forever ♾️',
            description: 'Another peaceful day, another special memory. Sitting side by side in the park, sharing smiles and silence — moments like these are the real treasures of our journey.',
            music: 'music/enthan uyire.mp3'
        },
        {
            image: 'images/ice.jpeg',
            date: 'April 17, 2025',
            title: 'Two Ice Creams, One Sweet Moment 🩷',
            description: 'That day in the park, with laughter in our hearts and ice creams in hand, felt like the simplest and purest kind of happiness. Just you, me, and a little sweetness shared under the sky.',
            music: 'music/memory4.mp3'
        },
        
        {
            image: 'images/birthday.jpeg',
            date: 'Today',
            title: 'Your Special Day 💖',
            description: 'Another year of your beautiful life, another year I get to love you.',
            music: 'music/memory6.mp3'
        },
    ];

    const memoryGrid = document.querySelector('.memory-grid');

    memories.forEach((memory, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="memory-image" style="background-image: url('${memory.image}')"></div>
            <div class="memory-content">
                <div class="memory-date">${memory.date}</div>
                <h3 class="memory-title">${memory.title}</h3>
                <p class="memory-desc">${memory.description}</p>
                <button class="play-pause-btn" data-index="${index}">▶️</button>
            </div>
        `;
        memoryGrid.appendChild(card);

        const playPauseButton = card.querySelector('.play-pause-btn');

        playPauseButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop card click effect

            if (currentPlayingIndex === index) {
                // Pause if clicking the same button
                if (!audio.paused) {
                    audio.pause();
                    playPauseButton.textContent = "▶️";
                } else {
                    audio.play();
                    playPauseButton.textContent = "⏸️";
                }
            } else {
                // Different memory clicked
                if (!audio.paused) {
                    audio.pause();
                }
                if (currentPlayingButton) {
                    currentPlayingButton.textContent = "▶️"; // Reset old button
                }
                audio.src = memory.music;
                audio.play();
                playPauseButton.textContent = "⏸️";
                currentPlayingButton = playPauseButton;
                currentPlayingIndex = index;
            }
        });
    });
}

/* ========== TIMELINE ========== */
function initTimeline() {
    const timelineData = [
        {
            date: 'June 2022',
            title: 'The Day We Met',
            content: 'I still remember what you were wearing and how your laugh made me feel instantly comfortable.'
        },
        {
            date: 'August 2022',
            title: 'First "I Love You"',
            content: 'We were at the park when it started raining, and in that moment I knew I never wanted to be with anyone else.'
        },
        {
            date: 'November 2022',
            title: 'Meeting the Parents',
            content: 'You were so nervous but they loved you immediately - how could they not?'
        },
        {
            date: 'February 2023',
            title: 'Our First Vacation',
            content: 'Two weeks in Bali where we discovered that we travel perfectly together.'
        },
        {
            date: 'Today',
            title: 'Your Birthday',
            content: 'The day the world became a better place because you were born.'
        }
    ];

    const timeline = document.querySelector('.timeline');
    
    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-date">${item.date}</div>
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            </div>
        `;
        
        if (index % 2 === 0) {
            timelineItem.classList.add('left');
        } else {
            timelineItem.classList.add('right');
        }
        
        timeline.appendChild(timelineItem);
    });
}

/* ========== TYPED MESSAGE ========== */
function initMessageTyping() {
    const message = `On this special day, I want you to know how incredibly grateful I am to have you in my life. Your smile brightens my darkest days, your laugh is my favorite melody, and your love is the greatest gift I've ever received. 

Every moment with you feels like a beautiful dream I never want to wake from. You've brought so much joy, love, and meaning into my life, and I promise to spend every day making you as happy as you've made me.

Happy birthday to the most amazing woman I know. May this year bring you all the happiness, success, and love you deserve. I can't wait to create more beautiful memories together. I love you more than words can express.`;
    
    let i = 0;
    const speed = 20; // typing speed in ms
    const typedMessage = document.querySelector('.typed-message');
    
    function typeWriter() {
        if (i < message.length) {
            // Add the next character
            typedMessage.innerHTML += message.charAt(i);
            i++;
            
            // Random chance to create a floating heart near the text
            if (i % 30 === 0) {
                createFloatingHeartNearElement(typedMessage);
            }
            
            setTimeout(typeWriter, speed);
        }
    }
    
    // Start typing when message section is in view
    const messageSection = document.querySelector('.message-section');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(typeWriter, 500);
            observer.unobserve(messageSection);
        }
    }, { threshold: 0.1 });
    
    observer.observe(messageSection);
}

/* ========== SCROLL DOWN BUTTON ========== */
function initScrollDown() {
    document.querySelector('.scroll-down').addEventListener('click', function() {
        window.scrollBy({
            top: window.innerHeight - 100,
            behavior: 'smooth'
        });
        
        // Create a heart trail effect
        createHeartTrail(
            window.scrollY + window.innerHeight / 2,
            window.scrollY + window.innerHeight
        );
    });
}

/* ========== SCROLL OBSERVERS ========== */
function initScrollObservers() {
    // Observe memory cards
    document.querySelectorAll('.memory-card').forEach(card => {
        observeElement(card, () => {
            card.classList.add('visible');
        });
    });
    
    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observeElement(item, () => {
            item.classList.add('visible');
        });
    });
}

function observeElement(element, callback) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            callback();
            observer.unobserve(element);
        }
    }, { threshold: 0.1 });
    
    observer.observe(element);
}

/* ========== HEART EFFECTS ========== */
function createClickHeart(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width/2;
    const y = rect.top + rect.height/2;
    
    const heart = document.createElement('div');
    heart.className = 'heart-explosion';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.animation = `heartFloat ${Math.random()*2 + 1}s ease-out forwards`;
    heart.style.setProperty('--tx', `${Math.random()*40 - 20}px`);
    heart.style.setProperty('--ty', `${-Math.random()*60 - 40}px`);
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

function createHeartExplosion(position, count = 20) {
    const colors = ['#ff6b8b', '#ff8e53', '#ffcc00', '#ff6b6b', '#ff8e8e'];
    const centerX = position.left || position.clientX;
    const centerY = position.top || position.clientY;
    
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-explosion';
        
        const size = Math.random() * 15 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 1 + 0.5;
        
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.background = color;
        heart.style.left = `${centerX}px`;
        heart.style.top = `${centerY}px`;
        heart.style.opacity = '1';
        
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        heart.style.setProperty('--end-x', `${endX}px`);
        heart.style.setProperty('--end-y', `${endY}px`);
        heart.style.setProperty('--heart-color', color);
        heart.style.animation = `heartExplode ${duration}s ease-out forwards`;
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }
}

function createFloatingHeartNearElement(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    
    const size = Math.random() * 15 + 10;
    const colors = ['#ff6b8b', '#ff8e53', '#ffcc00', '#ff6b6b', '#ff8e8e'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 8 + 4;
    
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.background = color;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.position = 'fixed';
    heart.style.animation = `heartFloatUp ${duration}s ease-out forwards`;
    heart.style.setProperty('--heart-color', color);
    heart.style.setProperty('--tx', `${Math.random()*40 - 20}px`);
    heart.style.setProperty('--ty', `${-Math.random()*200 - 100}px`);
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

function createHeartTrail(startY, endY) {
    const heartCount = 15;
    const delayBetween = 100; // ms
    
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-explosion';
            
            const size = Math.random() * 10 + 5;
            const colors = ['#ff6b8b', '#ff8e53', '#ffcc00', '#ff6b6b', '#ff8e8e'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = window.innerWidth / 2 + (Math.random() * 100 - 50);
            const y = startY + (endY - startY) * (i / heartCount);
            const duration = 1.5;
            
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.background = color;
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.opacity = '0.7';
            heart.style.animation = `heartFloatUp ${duration}s ease-out forwards`;
            heart.style.setProperty('--tx', `${Math.random()*20 - 10}px`);
            heart.style.setProperty('--ty', `${-Math.random()*50 - 50}px`);
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, duration * 1000);
        }, i * delayBetween);
    }
}

/* ========== CONFETTI EFFECT ========== */
function initConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    const confettiPieces = [];
    const colors = ['#ff6b8b', '#ff8e53', '#ffcc00', '#4ecdc4', '#45b7d1'];
    
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 10 + 5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.speed = Math.random() * 3 + 2;
            this.rotationSpeed = Math.random() * 5 - 2.5;
            this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
            this.wobble = Math.random() * 10;
            this.wobbleSpeed = Math.random() * 0.1;
            this.wobbleOffset = Math.random() * Math.PI * 2;
        }
        
        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            this.wobbleOffset += this.wobbleSpeed;
            this.x += Math.sin(this.wobbleOffset) * this.wobble;
            
            if (this.y > canvas.height) {
                this.y = -this.size;
                this.x = Math.random() * canvas.width;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            
            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            }
            
            ctx.restore();
        }
    }
    
    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
        confettiPieces.push(new Confetti());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach(piece => {
            piece.update();
            piece.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Burst confetti on click/tap
    document.addEventListener('click', () => {
        for (let i = 0; i < 50; i++) {
            const piece = new Confetti();
            piece.y = canvas.height / 2;
            piece.x = canvas.width / 2;
            confettiPieces.push(piece);
        }
    });
}

/* ========== GIFT BOX FUNCTIONALITY ========== */
function openGift() {
    const giftBox = document.querySelector('.gift-box');
    const giftContent = document.querySelector('.gift-content');
    
    if (giftBox.classList.contains('open')) return;
    
    giftBox.classList.add('open');
    
    // Add gift content
    giftContent.innerHTML = `
        <h3>My Promise to You</h3>
        <p>On your special day, I promise to:</p>
        <ul>
            <li>Love you more each day than the day before</li>
            <li>Make you laugh every chance I get</li>
            <li>Be there for you through all of life's adventures</li>
            <li>Keep surprising you with little moments of joy</li>
            <li>Cherish every second we have together</li>
        </ul>
        <p>And one more thing... <span class="surprise">Check your phone in 3...2...1...</span></p>
    `;
    
    // Create heart explosion
    createHeartExplosion(giftBox.getBoundingClientRect(), 30);
    
    // Trigger a real-world surprise (like sending a text)
    setTimeout(() => {
        // Here you could actually trigger an API call to send a real message
        console.log("Surprise message should be sent now!");
    }, 3000);
}
function initVideoPlayer() {
    const poster = document.getElementById('video-poster');
    const video = document.getElementById('our-video');
    
    poster.addEventListener('click', function() {
      // Hide poster and show video
      poster.style.display = 'none';
      video.style.display = 'block';
      
      // Start playing
      video.play().catch(e => console.log("Playback failed:", e));
      
      // Create heart explosion effect
      createHeartExplosion(poster.getBoundingClientRect(), 20);
    });
    
    // When video ends, show poster again (optional)
    video.addEventListener('ended', function() {
      // video.style.display = 'none';
      // poster.style.display = 'block';
      // Or keep video visible with controls
    });
  }
  
  // Call this in your DOMContentLoaded function
  document.addEventListener('DOMContentLoaded', function() {
    initVideoPlayer();
  });