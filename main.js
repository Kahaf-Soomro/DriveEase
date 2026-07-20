// =====================================
// DriveEase Frontend Main JavaScript
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // FAQ Accordion
    // ===============================

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {

        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        question.addEventListener("click", () => {

            faqItems.forEach(other => {

                if (other !== item) {
                    other.classList.remove("active");

                    const otherAnswer = other.querySelector(".faq-answer");

                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                }

            });

            item.classList.toggle("active");

            if (item.classList.contains("active")) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }

        });

    });

    // ===============================
    // Smooth Scrolling
    // ===============================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    });

    // ===============================
    // Booking Form
    // ===============================

    const bookingForm = document.querySelector(".booking form");

    if (!bookingForm) return;

    const prices = {

        economy: 3000,
        sedan: 5000,
        suv: 8000,
        luxury: 15000,
        electric: 12000

    };

    bookingForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const pickupLocation =
            document.getElementById("pickup-location").value.trim();

        const dropoffLocation =
            document.getElementById("dropoff-location").value.trim();

        const pickupDate =
            document.getElementById("pickup-date").value;

        const dropoffDate =
            document.getElementById("dropoff-date").value;

        const carType =
            document.getElementById("car-type").value;

        if (
            !pickupLocation ||
            !dropoffLocation ||
            !pickupDate ||
            !dropoffDate ||
            !carType
        ) {

            alert("Please fill in all fields.");

            return;
        }

        const start = new Date(pickupDate);

        const end = new Date(dropoffDate);

        const rentalDays = Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        );

        if (rentalDays <= 0) {

            alert("Drop-off date must be after Pickup date.");

            return;
        }

        const pricePerDay = prices[carType];

        const totalPrice = rentalDays * pricePerDay;

        const bookingId =
            "DE" + Math.floor(1000 + Math.random() * 9000);

        document.getElementById("bookingId").value = bookingId;

        document.getElementById("days").value = rentalDays;

        document.getElementById("pricePerDay").value =
            "Rs. " + pricePerDay;

        document.getElementById("totalPrice").value =
            "Rs. " + totalPrice;

        document.getElementById("customerForm").style.display = "block";

        document.getElementById("customerForm").scrollIntoView({

            behavior: "smooth"

        });

    });
        // ===============================
    // Confirm Booking
    // ===============================

    const confirmButton = document.getElementById("confirmBooking");

    if (confirmButton) {

        confirmButton.addEventListener("click", function () {

            const customerName = document.getElementById("customerName").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const email = document.getElementById("email").value.trim();

            if (!customerName || !phone || !email) {

                alert("Please complete all customer information.");

                return;
            }

            document.getElementById("successBookingId").textContent =
                document.getElementById("bookingId").value;

            document.getElementById("successCustomer").textContent =
                customerName;

            document.getElementById("successPhone").textContent =
                phone;

            document.getElementById("successEmail").textContent =
                email;

            document.getElementById("successDays").textContent =
                document.getElementById("days").value;

            document.getElementById("successPrice").textContent =
                document.getElementById("totalPrice").value;

            document.getElementById("customerForm").style.display = "none";

            document.getElementById("successMessage").style.display = "block";

            document.getElementById("successMessage").scrollIntoView({

                behavior: "smooth"

            });

        });

    }

    // ===============================
    // Book Another Ride
    // ===============================

    const newBookingBtn = document.getElementById("newBookingBtn");

if (newBookingBtn) {

    newBookingBtn.addEventListener("click", function () {

        // Reset booking form
        bookingForm.reset();

        // Reset customer information fields
        document.getElementById("bookingId").value = "";
        document.getElementById("customerName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
        document.getElementById("days").value = "";
        document.getElementById("pricePerDay").value = "";
        document.getElementById("totalPrice").value = "";

        // Hide forms/messages
        document.getElementById("customerForm").style.display = "none";
        document.getElementById("successMessage").style.display = "none";

        // Scroll back to booking form
        bookingForm.scrollIntoView({
            behavior: "smooth"
        });

    });

}

    

    // ===============================
    // Hero Button Scroll
    // ===============================

    const heroButton = document.querySelector(".cta-button");

    if (heroButton) {

        heroButton.addEventListener("click", function (e) {

            e.preventDefault();

            const bookingSection = document.getElementById("booking");

            if (bookingSection) {

                bookingSection.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    }

    // ===============================
    // Featured Car Buttons
    // ===============================

    document.querySelectorAll(".featured-cars .btn-primary").forEach(button => {

        button.addEventListener("click", function () {

            const bookingSection = document.getElementById("booking");

            if (bookingSection) {

                bookingSection.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    });
        // ===============================
    // Testimonials Carousel
    // ===============================

    const track = document.querySelector(".testimonial-track");
    const prevBtn = document.querySelector(".testimonial-prev");
    const nextBtn = document.querySelector(".testimonial-next");

    if (track && prevBtn && nextBtn) {

        const cards = document.querySelectorAll(".testimonial-card");

        let currentIndex = 0;

        function updateCarousel() {

            if (cards.length === 0) return;

            const cardWidth = cards[0].offsetWidth + 30;

            track.style.transform =
                `translateX(-${currentIndex * cardWidth}px)`;

        }

        nextBtn.addEventListener("click", () => {

            if (currentIndex < cards.length - 1) {

                currentIndex++;

            } else {

                currentIndex = 0;

            }

            updateCarousel();

        });

        prevBtn.addEventListener("click", () => {

            if (currentIndex > 0) {

                currentIndex--;

            } else {

                currentIndex = cards.length - 1;

            }

            updateCarousel();

        });

        // Auto Slide Every 5 Seconds
        setInterval(() => {

            if (currentIndex < cards.length - 1) {

                currentIndex++;

            } else {

                currentIndex = 0;

            }

            updateCarousel();

        }, 5000);

        // Recalculate on resize
        window.addEventListener("resize", updateCarousel);

    }

});
