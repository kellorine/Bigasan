// Enhanced scroll animations with intersection observer
export const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation
                // animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animations
    document.querySelectorAll('.skill-item, .contact-item').forEach(element => {
        animateOnScroll.observe(element);
    });

    // Parallax effect for about section
    const parallaxElements = document.querySelectorAll('.about-image');
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    });
};

// Smooth reveal animation for sections
export const initSectionReveal = () => {
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const revealSection = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealSection.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('section:not(.hero)').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        revealSection.observe(section);
    });
};