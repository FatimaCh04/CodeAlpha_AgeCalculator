// DOM Elements
const dobInput = document.getElementById('dob-input');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const resultsContainer = document.getElementById('results');
const errorMessage = document.getElementById('error-message');
const currentDateDisplay = document.querySelector('#current-date-display span');

const resultYears = document.getElementById('result-years');
const resultMonths = document.getElementById('result-months');
const resultDays = document.getElementById('result-days');

// Set today's date on load
const today = new Date();

// Format date for display (e.g., "15 Oct 2023")
const options = { day: 'numeric', month: 'short', year: 'numeric' };
currentDateDisplay.textContent = today.toLocaleDateString('en-US', options);

// Set max date attribute to today to prevent selecting future dates in the calendar picker
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const formattedToday = `${yyyy}-${mm}-${dd}`;
dobInput.setAttribute('max', formattedToday);

// Calculate Age Function
function calculateAge() {
    // Reset previous states
    errorMessage.style.display = 'none';
    errorMessage.classList.remove('shake');
    resultsContainer.classList.remove('show');

    // Validate Input
    if (!dobInput.value) {
        showError('Please select your Date of Birth.');
        return;
    }

    // Parse input date (extract parts to avoid timezone shift issues)
    const [birthYear, birthMonth, birthDay] = dobInput.value.split('-').map(Number);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

    // Validate if future date (just in case they bypass HTML max attribute)
    if (birthDate > today) {
        showError('Date of birth cannot be in the future.');
        return;
    }

    // Calculate exact age
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust if days are negative
    if (days < 0) {
        months--;
        // Get the number of days in the previous month
        // month index is 0-based, so today.getMonth() gives current month. Passing 0 for day gives last day of prev month.
        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += previousMonth.getDate();
    }

    // Adjust if months are negative
    if (months < 0) {
        years--;
        months += 12;
    }

    // Display Results with a slight delay for smooth UI feel
    setTimeout(() => {
        // Animate numbers from 0 (optional, but a nice touch)
        animateValue(resultYears, 0, years, 1000);
        animateValue(resultMonths, 0, months, 1000);
        animateValue(resultDays, 0, days, 1000);
        
        resultsContainer.classList.add('show');
    }, 100);
}

// Show error with shake animation
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Trigger reflow to restart animation
    void errorMessage.offsetWidth; 
    errorMessage.classList.add('shake');
}

// Reset Function
function resetCalculator() {
    dobInput.value = '';
    errorMessage.style.display = 'none';
    resultsContainer.classList.remove('show');
    
    // Reset text content immediately
    resultYears.textContent = '0';
    resultMonths.textContent = '0';
    resultDays.textContent = '0';
}

// Animate numbers counting up
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function (easeOutExpo) for smoother slow down at the end
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end; // Ensure exact final value
        }
    };
    window.requestAnimationFrame(step);
}

// Event Listeners
calculateBtn.addEventListener('click', calculateAge);
resetBtn.addEventListener('click', resetCalculator);

// Allow pressing Enter key to calculate
dobInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        calculateAge();
    }
});
