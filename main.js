document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (question && answer) {
            question.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-hidden', 'true');
            answer.style.maxHeight = null;

            question.addEventListener("click", () => {
                const expanded = question.getAttribute('aria-expanded') === 'true';
                const willExpand = !expanded;

                // close other FAQ items when opening this one
                if (willExpand) {
                    faqItems.forEach((other) => {
                        if (other === item) return;
                        const oq = other.querySelector('.faq-question');
                        const oa = other.querySelector('.faq-answer');
                        if (oq && oa) {
                            oq.setAttribute('aria-expanded', 'false');
                            oa.setAttribute('aria-hidden', 'true');
                            other.classList.remove('active');
                            oa.style.maxHeight = null;
                        }
                    });
                }

                question.setAttribute('aria-expanded', String(willExpand));
                answer.setAttribute('aria-hidden', String(!willExpand));
                item.classList.toggle("active");

                if (willExpand) {
                    // animate using max-height (fallback CSS also covers this)
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = null;
                }
            });
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                try { history.pushState(null, '', href); } catch (err) { /* ignore */ }
            }
        });
    });

    // Booking form: show simple inline feedback instead of submitting
    const bookingForm = document.querySelector('.booking form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pickup = document.getElementById('pickup-location').value.trim();
            const dropoff = document.getElementById('dropoff-location').value.trim();
            if (!pickup || !dropoff) {
                alert('Please enter pickup and dropoff locations.');
                return;
            }

            const payment = document.getElementById('payment-method');
            const paymentVal = payment ? payment.value : '';
            if (!paymentVal) {
                alert('Please select a payment method.');
                return;
            }

            // reset the form immediately
            bookingForm.reset();

            // remove any existing modal to avoid duplicates
            const existingModal = document.querySelector('.payment-modal-overlay');
            if (existingModal && existingModal.parentNode) existingModal.parentNode.removeChild(existingModal);

            // create full-screen modal overlay
            const overlay = document.createElement('div');
            overlay.className = 'payment-modal-overlay';
            Object.assign(overlay.style, {
                position: 'fixed',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000
            });

            const dialog = document.createElement('div');
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-modal', 'true');
            dialog.className = 'payment-modal';
            Object.assign(dialog.style, {
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '420px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            });

            const title = document.createElement('h2');
            title.textContent = 'Payment successfully';
            Object.assign(title.style, { margin: '0 0 0.75rem' });

            const info = document.createElement('p');
            info.textContent = `Payment method: ${paymentVal.replace(/^[a-z]/, (m) => m.toUpperCase())}`;
            Object.assign(info.style, { margin: '0 0 1rem', color: '#333' });

            const okBtn = document.createElement('button');
            okBtn.textContent = 'OK';
            okBtn.className = 'btn btn-primary';
            Object.assign(okBtn.style, {
                padding: '0.6rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: '#007bff',
                color: '#fff',
                cursor: 'pointer'
            });

            okBtn.addEventListener('click', () => {
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            });

            dialog.appendChild(title);
            dialog.appendChild(info);
            dialog.appendChild(okBtn);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // focus OK button for accessibility
            okBtn.focus();
        });
    }

    // Featured "Book Now" buttons scroll to booking section
    document.querySelectorAll('.featured-cars button.btn-primary').forEach((btn) => {
        btn.addEventListener('click', () => {
            const booking = document.getElementById('booking');
            if (booking) booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Hero CTA button scrolls to booking form
    const heroCta = document.querySelector('.cta-button');
    if (heroCta) {
        heroCta.addEventListener('click', (e) => {
            e.preventDefault();
            const booking = document.getElementById('booking');
            if (booking) booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Autoplay carousel behavior for horizontally scrollable sections
    function setupAutoplay(container, delay = 3000) {
        if (!container) return;
        // only enable when overflow exists
        if (container.scrollWidth <= container.clientWidth) return;

        const firstChild = container.querySelector(':scope > *');
        const childWidth = firstChild ? Math.round(firstChild.getBoundingClientRect().width) : Math.round(container.clientWidth * 0.8);
        const step = childWidth + 16; // approximate gap

        let timer = null;

        const start = () => {
            if (timer) return;
            timer = setInterval(() => {
                // if at end, wrap to start
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 2) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: step, behavior: 'smooth' });
                }
            }, delay);
        };

        const stop = () => {
            if (!timer) return;
            clearInterval(timer);
            timer = null;
        };

        // pause on interaction
        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);
        container.addEventListener('focusin', stop);
        container.addEventListener('focusout', start);
        container.addEventListener('pointerdown', stop);

        // start autoplay
        start();
    }

    // initialize autoplay for featured cars and testimonials
    const featuredContainer = document.querySelector('.featured-cars .grid-container');
    const testimonialsContainer = document.querySelector('.testimonials-container');
    setupAutoplay(featuredContainer, 3000);
    setupAutoplay(testimonialsContainer, 4000);

    // Prev/Next controls behavior
    function setupControls(container) {
        if (!container) return;
        const wrapper = container.closest('.carousel-wrapper');
        if (!wrapper) return;
        const prev = wrapper.querySelector('.carousel-btn.prev');
        const next = wrapper.querySelector('.carousel-btn.next');
        if (!next) return;

        const getStep = () => {
            const first = container.querySelector(':scope > *');
            return first ? Math.round(first.getBoundingClientRect().width) + 16 : Math.round(container.clientWidth * 0.8);
        };

        const updateVisibility = () => {
            const controls = wrapper.querySelector('.carousel-controls');
            if (!controls) return;
            if (container.scrollWidth <= container.clientWidth + 1) {
                controls.style.display = 'none';
                return;
            }

            controls.style.display = 'flex';
            if (prev) {
                prev.style.display = container.scrollLeft <= 1 ? 'none' : 'flex';
            }
            if (next) {
                next.style.display = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1 ? 'none' : 'flex';
            }
        };

        if (prev) {
            prev.addEventListener('click', () => {
                const step = getStep();
                if (container.scrollLeft > 0) {
                    const offset = Math.min(step, container.scrollLeft);
                    container.scrollBy({ left: -offset, behavior: 'smooth' });
                    window.requestAnimationFrame(updateVisibility);
                }
            });
        }

        next.addEventListener('click', () => {
            const step = getStep();
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            if (container.scrollLeft < maxScrollLeft - 1) {
                const remaining = maxScrollLeft - container.scrollLeft;
                if (prev) {
                    prev.style.display = 'flex';
                }
                container.scrollBy({ left: Math.min(step, remaining), behavior: 'smooth' });
                window.requestAnimationFrame(updateVisibility);
            }
        });

        container.addEventListener('scroll', () => {
            // throttle with rAF
            window.requestAnimationFrame(updateVisibility);
        });

        window.addEventListener('resize', updateVisibility);

        // initial
        updateVisibility();
    }

    setupControls(featuredContainer);
    setupControls(testimonialsContainer);

});