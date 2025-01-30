import { initScrollAnimations, initSectionReveal } from './animations.js';
import { initSmoothScroll, initMobileMenu, initActiveNavigation } from './navigation.js';

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initSectionReveal();
    initSmoothScroll();
    initMobileMenu();
    initActiveNavigation();
});