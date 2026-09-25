document.addEventListener('DOMContentLoaded', () => {
    // Navigation active state handling (basic based on URL)
    const currentUrl = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentUrl) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // Slider Logic for Featured Works (Home Page)
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (sliderTrack && prevBtn && nextBtn) {
        const getScrollAmount = () => {
            const item = sliderTrack.querySelector('.slider-item');
            if (!item) return 350;
            const style = window.getComputedStyle(sliderTrack);
            const gap = parseFloat(style.gap) || 0;
            return item.offsetWidth + gap;
        };

        let isDown = false;
        let startX;
        let startScrollLeft;

        const handleWrap = () => {
            const scrollAmount = getScrollAmount();
            if (sliderTrack.scrollLeft <= 0) {
                sliderTrack.prepend(sliderTrack.lastElementChild);
                sliderTrack.scrollLeft += scrollAmount;
                if (isDown) startScrollLeft += scrollAmount;
            } else if (Math.abs(sliderTrack.scrollWidth - sliderTrack.clientWidth - sliderTrack.scrollLeft) <= 1) {
                sliderTrack.appendChild(sliderTrack.firstElementChild);
                sliderTrack.scrollLeft -= scrollAmount;
                if (isDown) startScrollLeft -= scrollAmount;
            }
        };

        nextBtn.addEventListener('click', () => {
            handleWrap();
            sliderTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            handleWrap();
            sliderTrack.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        sliderTrack.addEventListener('scroll', handleWrap);

        sliderTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderTrack.style.cursor = 'grabbing';
            startX = e.pageX - sliderTrack.offsetLeft;
            startScrollLeft = sliderTrack.scrollLeft;
        });
        
        sliderTrack.addEventListener('mouseleave', () => {
            isDown = false;
            sliderTrack.style.cursor = 'grab';
        });
        
        sliderTrack.addEventListener('mouseup', () => {
            isDown = false;
            sliderTrack.style.cursor = 'grab';
        });
        
        sliderTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderTrack.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            sliderTrack.scrollLeft = startScrollLeft - walk;
        });
    }

    // Add random floating animations to doodles
    const doodles = document.querySelectorAll('.doodle');
    doodles.forEach(doodle => {
        // Randomize animation delay and duration slightly
        const delay = Math.random() * 2;
        const duration = 3 + Math.random() * 2;
        
        doodle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
    });

    // Add keyframes for float if not in CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(-1deg); }
        }
    `;
    document.head.appendChild(style);

    // --- Project Details Modal Logic ---
    const modal = document.getElementById('projectModal');
    if (modal) {
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        const modalPrevBtn = document.getElementById('modalPrevBtn');
        const modalNextBtn = document.getElementById('modalNextBtn');
        const modalImageContainer = document.getElementById('modalImageContainer');
        const modalInner = document.querySelector('.project-modal-inner');
        const modalWrapper = modal.querySelector('.project-modal-wrapper');

        let workCards = Array.from(document.querySelectorAll('.works-grid .work-card'));
        if (workCards.length === 0) {
            workCards = Array.from(document.querySelectorAll('.slider-track .slider-item'));
        }
        let currentProjectIndex = -1;

        // Open Modal Function
        const openModal = (index) => {
            if (index < 0 || index >= workCards.length) return;
            currentProjectIndex = index;
            
            // Reset scroll position
            modalInner.scrollTop = 0;
            
            // Set modal wrapper border color
            if (index === 5) {
                modalWrapper.style.background = 'var(--pure-black)'; // Black for Borrowed Time
            } else {
                modalWrapper.style.background = ''; // Revert to CSS default
            }

            // Set Image
            modalImageContainer.innerHTML = ''; // Clear previous images
            if (index === 5) {
                const img = document.createElement('img');
                img.src = 'Comic jpeg.jpg';
                img.alt = 'Comic Project Details';
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.borderBottomLeftRadius = '16px';
                img.style.borderBottomRightRadius = '16px';
                modalImageContainer.appendChild(img);
            } else if (index === 6) {
                modalImageContainer.style.height = 'auto';

                const descriptionImage = document.createElement('img');
                descriptionImage.src = 'hologram description.jpg';
                descriptionImage.alt = 'Hologram project description';
                descriptionImage.style.width = '100%';
                descriptionImage.style.height = 'auto';
                descriptionImage.style.display = 'block';
                modalImageContainer.appendChild(descriptionImage);

                const video = document.createElement('video');
                video.src = 'hologram prot.mp4';
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.style.width = '100%';
                video.style.height = 'auto';
                video.style.display = 'block';
                modalImageContainer.appendChild(video);

                const exhibitionImage = document.createElement('img');
                exhibitionImage.src = 'holo exhi.png';
                exhibitionImage.alt = 'Hologram exhibition';
                exhibitionImage.style.width = '100%';
                exhibitionImage.style.height = 'auto';
                exhibitionImage.style.display = 'block';
                modalImageContainer.appendChild(exhibitionImage);
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        // Attach Click Listeners to Cards
        workCards.forEach((card, index) => {
            card.style.cursor = 'pointer'; // Make it obvious it's clickable
            // Add hover scale effect dynamically to whole card
            card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-4px)'; card.style.transition = 'transform 0.2s'; });
            card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; });
            
            card.addEventListener('click', () => {
                const href = card.getAttribute('data-href');
                if (href) {
                    window.location.href = href;
                    return;
                }
                openModal(index);
            });
        });

        // Close listeners
        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(); // Close if clicked on overlay
            }
        });

        // Navigation Listeners
        modalPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentProjectIndex > 0) {
                openModal(currentProjectIndex - 1);
            } else {
                openModal(workCards.length - 1);
            }
        });

        modalNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentProjectIndex < workCards.length - 1) {
                openModal(currentProjectIndex + 1);
            } else {
                openModal(0);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') modalPrevBtn.click();
            if (e.key === 'ArrowRight') modalNextBtn.click();
        });
    }
});
