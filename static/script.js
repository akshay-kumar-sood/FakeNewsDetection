// Wait for DOM to load before executing script
document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded!"); // Debugging message

    // Common elements
    const mainContent = document.querySelector('.main-content');
    console.log("Main content element:", mainContent); // Debug log

    // Team Overlay Functionality
    const teamLink = document.querySelector('.sidebar-link[data-tooltip="Team"]');
    const teamOverlay = document.getElementById('teamOverlay');
    const teamBackBtn = document.getElementById('teamBackBtn');
    const teamMembers = document.querySelectorAll('.team-member');

    console.log("Team elements:", { // Debug log
        teamLink,
        teamOverlay,
        teamBackBtn,
        teamMembersCount: teamMembers.length
    });

    // Show team overlay
    teamLink.addEventListener('click', function(e) {
        console.log("Team link clicked"); // Debug log
        e.preventDefault();
        teamOverlay.classList.add('active');
        mainContent.classList.add('blurred');
        
        // Show only the first member initially
        teamMembers.forEach((member, index) => {
            member.classList.remove('active');
            if (index === 0) {
                member.classList.add('active');
            }
        });
    });

    // Hide team overlay
    teamBackBtn.addEventListener('click', function() {
        console.log("Back button clicked"); // Debug log
        teamOverlay.classList.remove('active');
        mainContent.classList.remove('blurred');
        teamMembers.forEach(member => member.classList.remove('active'));
    });

    // Track the highest visible member
    let highestVisibleMember = 0;

    // Click effects for team members
    teamMembers.forEach((member, index) => {
        if (index < teamMembers.length - 1) {
            member.addEventListener('click', () => {
                // Update highest visible member if needed
                if (index + 1 > highestVisibleMember) {
                    highestVisibleMember = index + 1;
                }

                // Show all members up to the highest visible
                for (let i = 0; i <= highestVisibleMember; i++) {
                    teamMembers[i].classList.add('active');
                }
            });
        }
    });

    // Tech Overlay Functionality
    const techLink = document.querySelector('.sidebar-link[data-tooltip="Tech"]');
    const techOverlay = document.getElementById('techOverlay');
    const techBackBtn = document.getElementById('techBackBtn');
    const techSections = document.querySelectorAll('.tech-section');

    console.log("Tech elements:", { // Debug log
        techLink,
        techOverlay,
        techBackBtn,
        techSectionsCount: techSections.length
    });

    // Show tech overlay
    techLink.addEventListener('click', function(e) {
        console.log("Tech link clicked"); // Debug log
        e.preventDefault();
        techOverlay.classList.add('active');
        mainContent.classList.add('blurred');
        
        // Show all tech sections with animation
        techSections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('active');
            }, index * 100); // Stagger the animations
        });
    });

    // Hide tech overlay
    techBackBtn.addEventListener('click', function() {
        console.log("Tech back button clicked"); // Debug log
        techOverlay.classList.remove('active');
        mainContent.classList.remove('blurred');
        techSections.forEach(section => section.classList.remove('active'));
    });

    // Rules Overlay Functionality
    const rulesLink = document.querySelector('.sidebar-link[data-tooltip="About"]');
    const rulesOverlay = document.getElementById('rulesOverlay');
    const rulesBackBtn = document.getElementById('rulesBackBtn');
    const rulesDivs = document.querySelectorAll('.rules-div');

    // Show Rules overlay
    rulesLink.addEventListener('click', function(e) {
        e.preventDefault();
        rulesOverlay.classList.add('active');
        mainContent.classList.add('blurred');
        
        // Show only the first div initially
        rulesDivs[0].classList.add('active');
        // Hide other divs initially
        for(let i = 1; i < rulesDivs.length; i++) {
            rulesDivs[i].classList.remove('active');
        }
    });

    // Hide Rules overlay
    rulesBackBtn.addEventListener('click', function() {
        rulesOverlay.classList.remove('active');
        mainContent.classList.remove('blurred');
        
        // Remove active class from all rules divs
        rulesDivs.forEach(div => {
            div.classList.remove('active');
        });
    });

    // Hover effects for rules divs
    rulesDivs.forEach((div, index) => {
        if (index < rulesDivs.length - 1) { // Don't add hover effect to last div
            div.addEventListener('mouseenter', () => {
                // Show next div and keep it visible
                rulesDivs[index + 1].classList.add('active');
            });
        }
    });

    // Quotes for Rotation
    const quotes = [
        "🔍 Exposing the Lies! 🔍",
        "🔍 Unmasking Fake News! 🔍",
        "✅ Truth or Lie? We Reveal It! ✅",
        "🚫 No Fake, Only Facts! 🚫"
    ];

    let currentQuoteIndex = 0;

    // Function to change quote every 6 seconds
    function changeQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (quoteDisplay) {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            quoteDisplay.textContent = quotes[currentQuoteIndex];
        }
    }
    setInterval(changeQuote, 6000); // Change quote every 6 seconds

    // Function to analyze news
    function analyzeNews() {
        let userInput = document.getElementById("newsInput").value.trim();
        const loader = document.querySelector(".loader");
        const resultBox = document.getElementById("result");
        const resultImgContainer = document.getElementById("resultImageContainer");
        const resultImg = document.getElementById("resultImage");
        const hideResultBtn = document.getElementById("hideResultBtn");
        const predictionResult = document.getElementById("predictionResult");
        const feedbackSection = document.querySelector(".feedback-section");
        const coinFlipContainer = document.querySelector(".coin-flip-container");
        const coin = document.querySelector(".coin");

        if (userInput === "") {
            alert("Please enter a news article!");
            return;
        }

        // Clear old result
        resultBox.style.display = "none";
        predictionResult.style.display = "none";
        if (resultImgContainer) resultImgContainer.style.display = "none";
        if (feedbackSection) feedbackSection.style.display = "none";
        if (resultImg) resultImg.style.display = "none";

        // Show loader and start coin flip
        if (loader) loader.style.display = "block";
        if (coinFlipContainer) {
            coinFlipContainer.style.display = "block";
            coin.classList.add("flipping");
        }

        // Simulate backend request
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: userInput })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response received:", data); // Debug log

            // Wait 3 seconds before showing result
            setTimeout(() => {
                if (loader) loader.style.display = "none";
                if (coinFlipContainer) {
                    coin.classList.remove("flipping");
                    coinFlipContainer.style.display = "none";
                }

                if (resultBox) {
                    resultBox.style.display = "block";

                    if (data.prediction === "Fake") {
                        resultImg.src = "/static/fake.jpg";
                    } else {
                        resultImg.src = "/static/real.jpg";
                    }

                    // Show final result image
                    if (resultImgContainer) resultImgContainer.style.display = "block";
                    if (resultImg) resultImg.style.display = "block";

                    // Show "Hide Result" button
                    if (hideResultBtn) hideResultBtn.style.display = "inline-block";

                    // Show feedback section
                    if (feedbackSection) feedbackSection.style.display = "block";
                }

                // Clear input after result shown
                document.getElementById("newsInput").value = "";

            }, 3000); // Loader shows for 3 seconds
        })
        .catch(error => {
            if (loader) loader.style.display = "none";
            if (coinFlipContainer) coinFlipContainer.style.display = "none";
            console.error("Error:", error);
            alert("Something went wrong! Check console for details.");
        });
    }

    // Add event listener for the button click
    const checkNewsBtn = document.getElementById("checkNewsBtn");
    if (checkNewsBtn) {
        checkNewsBtn.addEventListener("click", analyzeNews);
    } else {
        console.error("Button not found! Check your HTML.");
    }

    // Add event listener for "Enter" key press
    document.getElementById("newsInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent new lines in textarea
            analyzeNews(); // Call the function
        }
    });

    // Add event listener for Hide Result button click
    const hideResultBtn = document.getElementById("hideResultBtn");
    if (hideResultBtn) {
        hideResultBtn.addEventListener("click", function() {
            const resultBox = document.getElementById("result");
            const resultImgContainer = document.getElementById("resultImageContainer");
            
            // Hide both result and image
            resultBox.style.display = "none";
            resultImgContainer.style.display = "none";

            // Hide the "Hide Result" button itself
            hideResultBtn.style.display = "none";
        });
    } else {
        console.error("Hide Result button not found! Check your HTML.");
    }

    // Function to show feedback popup
    function showFeedbackPopup(isPositive) {
        const popup = document.getElementById('feedbackPopup');
        
        // Show/hide positive elements
        document.querySelector('.positive-icon').style.display = isPositive ? 'block' : 'none';
        document.querySelector('.positive-title').style.display = isPositive ? 'block' : 'none';
        document.querySelector('.positive-message').style.display = isPositive ? 'block' : 'none';
        document.querySelector('.positive-emoji').style.display = isPositive ? 'block' : 'none';
        
        // Show/hide negative elements
        document.querySelector('.negative-icon').style.display = isPositive ? 'none' : 'block';
        document.querySelector('.negative-title').style.display = isPositive ? 'none' : 'block';
        document.querySelector('.negative-message').style.display = isPositive ? 'none' : 'block';
        document.querySelector('.negative-emoji').style.display = isPositive ? 'none' : 'block';
        
        popup.style.display = 'flex';
        
        // Close popup when clicking the close button
        document.querySelector('.popup-close').addEventListener('click', function() {
            popup.style.display = 'none';
            document.querySelector('.feedback-section').style.display = 'none';
        });
    }

    // Function to send feedback
    function sendFeedback(feedback) {
        const prediction = document.getElementById('predictionResult').textContent;
        const isPositive = feedback === 'positive';
        
        fetch('/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                feedback: feedback,
                prediction: prediction,
                newsText: document.getElementById('newsInput').value
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Show the appropriate popup
                showFeedbackPopup(isPositive);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error sending your feedback. Please try again.');
        });
    }

    // Add event listeners for feedback buttons
    document.getElementById('thumbsUp').addEventListener('click', () => sendFeedback('positive'));
    document.getElementById('thumbsDown').addEventListener('click', () => sendFeedback('negative'));

    // Instruction Modal Functionality
    const infoButton = document.getElementById("infoButton");
    const instructionModal = document.getElementById("instructionModal");
    const closeModal = document.querySelector(".close-modal");

    if (infoButton && instructionModal && closeModal) {
        // Open modal
        infoButton.addEventListener("click", function() {
            instructionModal.style.display = "block";
            document.body.style.overflow = "hidden";
        });

        // Close modal
        closeModal.addEventListener("click", function() {
            instructionModal.style.display = "none";
            document.body.style.overflow = "";
        });

        // Close modal when clicking outside
        window.addEventListener("click", function(event) {
            if (event.target === instructionModal) {
                instructionModal.style.display = "none";
                document.body.style.overflow = "";
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
