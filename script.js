document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation
    const fadeElems = document.querySelectorAll('.fade-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    fadeElems.forEach(elem => observer.observe(elem));

    // Stats Counter Animation
    const stats = [
        { id: 'points', value: 50000 },
        { id: 'rings', value: 4 },
        { id: 'mvps', value: 4 },
        { id: 'allstar', value: 21 }
    ];

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            stats.forEach(stat => {
                animateValue(stat.id, 0, stat.value, 2000);
            });
            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });

    statsObserver.observe(document.querySelector('.stats-section'));

    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
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
});
