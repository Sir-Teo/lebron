document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer
    const fadeElems = document.querySelectorAll('.fade-on-scroll, .fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    fadeElems.forEach(elem => observer.observe(elem));

    // Stats Counter Animation
    const stats = [
        { id: 'points', value: 50473 },
        { id: 'rings', value: 4 },
        { id: 'mvps', value: 4 },
        { id: 'allstar', value: 21 }
    ];

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            stats.forEach(stat => {
                animateValue(stat.id, 0, stat.value, 2500); // Slower animation
            });
            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Movie Mode Logic
    const playBtn = document.getElementById('play-movie-btn');
    if (playBtn) {
        playBtn.addEventListener('click', startMovie);
    }

    async function startMovie() {
        // Change UI to indicate playing
        const originalText = playBtn.innerHTML;
        playBtn.innerHTML = '<i class="fas fa-video"></i> NOW PLAYING...';
        playBtn.style.opacity = '0.5';
        document.body.style.cursor = 'wait';

        // Scroll to Intro
        const main = document.getElementById('main-content');
        if (main) {
            main.scrollIntoView({ behavior: 'smooth' });
            await wait(4000); // Intro reading time
        }

        // Get all timeline items and sections
        const timelineItems = document.querySelectorAll('.timeline-item');
        for (const item of timelineItems) {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await wait(6000); // Time to read card
        }

        // Highlights
        const highlights = document.querySelector('.highlights-section');
        if (highlights) {
            highlights.scrollIntoView({ behavior: 'smooth', block: 'start' });
            await wait(6000);
        }

        // Key Games
        const keyGames = document.querySelector('.key-games-section');
        if (keyGames) {
            keyGames.scrollIntoView({ behavior: 'smooth', block: 'start' });
            await wait(7000);
        }

        // Trophy Room
        const trophy = document.querySelector('.trophy-room');
        if (trophy) {
            trophy.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await wait(4000);
        }

        // Legacy
        const legacy = document.querySelector('.legacy-section');
        if (legacy) {
            legacy.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await wait(5000);
        }

        // Quotes
        const quotes = document.querySelector('.quotes-section');
        if (quotes) {
            quotes.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await wait(4000);
        }

        // Stats
        if (statsSection) {
            statsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await wait(5000); // Allow animation to play
        }

        // Footer
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset
        await wait(2000);
        playBtn.innerHTML = '<i class="fas fa-redo"></i> REPLAY THE FILM';
        playBtn.style.opacity = '1';
        document.body.style.cursor = 'default';
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
