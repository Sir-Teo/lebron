document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer with stagger effect
    const fadeElems = document.querySelectorAll('.fade-on-scroll, .fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                } else {
                    entry.target.classList.add('visible');
                }
                // Unobserve after animation for better performance
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

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
        // Add keyboard shortcut hint
        playBtn.setAttribute('title', 'Press to start cinematic journey');
    }

    let isPlayingMovie = false;

    async function startMovie() {
        if (isPlayingMovie) return;
        isPlayingMovie = true;

        // Change UI to indicate playing
        const originalText = playBtn.innerHTML;
        playBtn.innerHTML = '<i class="fas fa-video"></i> NOW PLAYING...';
        playBtn.disabled = true;
        playBtn.setAttribute('aria-label', 'Movie is playing');
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
        playBtn.innerHTML = '<i class="fas fa-redo"></i> REPLAY THE JOURNEY';
        playBtn.disabled = false;
        playBtn.setAttribute('aria-label', 'Replay the cinematic journey');
        playBtn.setAttribute('title', 'Watch again');
        document.body.style.cursor = 'default';
        isPlayingMovie = false;
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Add smooth scroll behavior for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add visual feedback for card interactions
    const cards = document.querySelectorAll('.highlight-card, .game-card, .trophy-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Lazy load images with fade-in effect
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease-in';

                    // Set image source and fade in when loaded
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }

                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });

                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Add performance monitoring (optional)
    if ('PerformanceObserver' in window) {
        try {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // Log slow images for debugging (console only, not user-facing)
                    if (entry.duration > 1000) {
                        console.log(`Slow resource: ${entry.name} took ${entry.duration}ms`);
                    }
                }
            });
            perfObserver.observe({ entryTypes: ['resource'] });
        } catch (e) {
            // Silently fail if PerformanceObserver has issues
        }
    }
});

// Scroll Progress Indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Back to Top Button
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.setAttribute('title', 'Back to top');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    // Press 'H' to go home
    if (e.key === 'h' || e.key === 'H') {
        if (!e.target.matches('input, textarea')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// Add loading state removal
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.querySelector('.loading');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }
    }, 300);
});

// Add visual feedback for external links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('aria-label', link.textContent + ' (opens in new tab)');
    }
});

// Enhanced stat cards with hover effect
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.05) rotateY(5deg)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Add subtle parallax effect to hero
if (window.innerWidth > 768) {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.transform = 'translateY(' + (scrolled * 0.5) + 'px)';
                hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        });
    }
}

// Add smooth reveal for images
const revealImages = document.querySelectorAll('.timeline-img img, .highlight-card img');
const imageRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }, 100);
            imageRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

revealImages.forEach(img => imageRevealObserver.observe(img));

// Console Easter Egg
console.log('%c👑 THE KING 👑', 'font-size: 40px; font-weight: bold; color: #FDB927; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cLeBron James - 41 years young and still dominating!', 'font-size: 14px; color: #552583;');
console.log('%cBuilt with 💛 for educational purposes', 'font-size: 12px; color: #888;');
