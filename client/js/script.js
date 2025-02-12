//this file is the front end that connects to back end 


document.addEventListener('DOMContentLoaded', function() {
    // Menu and Navbar Toggle
    let menu = document.querySelector('#menu-btn');
    let navbar = document.querySelector('.navbar');

    menu.onclick = () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    };

    window.onscroll = () => {
        menu.classList.remove('fa-times');
        navbar.classList.remove('active');
    };

    // Swiper Configuration
    var swiper = new Swiper(".review-slider", {
        spaceBetween: 20,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 7500,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 2
            }
        },
    });

    // Load existing reviews from MongoDB, this is the get request 
    fetch('http://localhost:5001/api/reviews')
        .then(response => response.json())
        .then(data => {
            data.forEach(review => appendReview(review));
        });

    // Form Submission
    document.getElementById('reviewForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const reviewerName = document.getElementById('reviewerName').value;
        const cafeName = document.getElementById('cafeName').value;
        const reviewContent = document.getElementById('reviewContent').value;
        const reviewImage = document.getElementById('reviewImage').files[0];
        const reviewRating = document.getElementById('reviewRating').value;

        if (reviewerName && cafeName && reviewContent && reviewImage && reviewRating) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const review = {
                    reviewerName,
                    cafeName,
                    reviewContent,
                    reviewImage: event.target.result,  // Base64 image
                    reviewRating
                };

                // Send review data to the server
                fetch('http://localhost:5001/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(review)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Review submitted:', data);
                    appendReview(data);  // Display the newly submitted review
                    document.getElementById('reviewForm').reset();  // Reset the form
                })
                .catch(error => {
                    console.error('Error submitting review:', error);
                    alert('Failed to submit review. Please try again.');
                });
            };
            reader.readAsDataURL(reviewImage);
        } else {
            alert('Please fill out all fields and upload an image.');
        }
    });

    // Append Review Function
    function appendReview(review) {
        const starsHTML = Array.from({ length: review.reviewRating }, () => '<i class="fas fa-star"></i>').join('');
        formattedDate = new Date().toLocaleDateString();
        const reviewHTML = `
            <div class="swiper-slide box" id="review-${review._id}">
                <i class="fas fa-quote-left"></i>
                <i class="fas fa-quote-right"></i>
                <img src="${review.reviewImage}" alt="Review Image">
                <div class="stars">
                    ${starsHTML}
                </div>
                <p>${review.reviewContent}</p>
                <h3>${review.cafeName}</h3>
                <span>${review.reviewerName}</span>
                <span class="review-date">${formattedDate}</span>

                <button class="delete-btn" data-id="${review._id}">Delete</button> <!-- Add Delete Button -->
            </div>
        `;
    
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.insertAdjacentHTML('beforeend', reviewHTML);
    
        // Attach delete button event listener
        const deleteButton = document.querySelector(`#review-${review._id} .delete-btn`);
        deleteButton.addEventListener('click', function () {
            deleteReview(review._id);
        });
    
        swiper.update(); // Update Swiper after adding the new review
    }

    function deleteReview(reviewId) {
        fetch(`http://localhost:5001/api/reviews/${reviewId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete review');
                }
                // Remove the review from the DOM
                const reviewElement = document.getElementById(`review-${reviewId}`);
                if (reviewElement) {
                    reviewElement.remove();
                    swiper.update(); // Update Swiper after removing the slide
                }
            })
            .catch((error) => {
                console.error('Error deleting review:', error);
                alert('Failed to delete review. Please try again.');
            });
    }

});



