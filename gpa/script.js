document.addEventListener('DOMContentLoaded', () => {
    const subjectCards = document.querySelectorAll('.subject-card');
    const gpaDisplay = document.getElementById('total-gpa');
    const percentDisplay = document.getElementById('total-percentage');
    const gradeDisplay = document.getElementById('total-grade');
    const gpaMeter = document.getElementById('gpa-meter');

    // State variables to track previous values for smooth animation
    let currentGPA = 0;
    let currentPercentage = 0;

    subjectCards.forEach(card => {
        const inputs = card.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calculateFinalScores);
        });
    });

function getGP(marks){
    marks=Math.floor(marks);
    if(marks>=85 && marks<=100){
        return 4.0;
    }else{
        switch(marks){
            case 84: return 3.94; case 83: return 3.88;
            case 82: return 3.82; case 81: return 3.77;
            case 80: return 3.71; case 79: return 3.65;
            case 78: return 3.60; case 77: return 3.54;
            case 76: return 3.48; case 75: return 3.43;
            case 74: return 3.37; case 73: return 3.31;
            case 72: return 3.25; case 71: return 3.20;
            case 70: return 3.14; case 69: return 3.08;
            case 68: return 3.03; case 67: return 2.97;
            case 66: return 2.91; case 65: return 2.86;
            case 64: return 2.80; case 63: return 2.74;
            case 62: return 2.68; case 61: return 2.63;
            case 60: return 2.57; case 59: return 2.51;
            case 58: return 2.46; case 57: return 2.40;
            case 56: return 2.34; case 55: return 2.29;
            case 54: return 2.23; case 53: return 2.17;
            case 52: return 2.11; case 51: return 2.06;
            case 50: return 2.00; default: return 0.0;
        }   
    }
}

function getGrade(gpa){
    gpa=parseFloat(gpa);
    gpa=parseFloat(gpa.toFixed(2));
    
    if(gpa>=3.95 && gpa<=4.00) return 'A+';
    else if(gpa>=3.71 && gpa<=3.94) return 'A';
    else if(gpa>=2.86 && gpa<=3.70) return 'B'; 
    else if(gpa>=2.29 && gpa<=2.85) return 'C';  
    else if(gpa>=2.00 && gpa<=2.28) return 'D';  
    else if(gpa<2) return 'F';
}
    // Advanced Smooth Number Counter Animation
    function animateValue(element, start, end, duration, isPercent = false) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function for smooth stop
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentVal = (start + (end - start) * easeOutQuart).toFixed(2);
            
            element.innerHTML = currentVal + (isPercent ? '' : '');
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function calculateFinalScores() {
        let totalCredits = 0;
        let totalQualityPts = 0;
        let totalMarks = 0;
        let validSubjects = 0;

        subjectCards.forEach(card => {
            const chInput = card.querySelector('.ch-input');
            const marksInput = card.querySelector('.marks-input');
            const gpLabel = card.querySelector('.live-gp');

            // Get raw values
            let ch = parseFloat(chInput.value);
            let marks = parseFloat(marksInput.value);

            // Cap Credit Hours (Max 4, Min 0)
            if (!isNaN(ch)) {
                if (ch > 4) ch = 4;
                if (ch < 0) ch = 0;
                chInput.value = ch; // Updates the input box automatically
            } else {
                ch = 0;
            }

            // Cap Marks (Max 100, Min 0) and Round Decimals
            if (marksInput.value !== '' && !isNaN(marks)) {
                marks = Math.round(marks); // Rounds decimals to nearest integer
                
                if (marks > 100) marks = 100;
                if (marks < 0) marks = 0;
                marksInput.value = marks; // Updates the input box automatically
                
                const gp = getGP(marks);
                
                gpLabel.textContent = gp.toFixed(2);
                totalCredits += ch;
                totalQualityPts += (gp * ch);
                totalMarks += marks;
                validSubjects++;
            } else {
                gpLabel.textContent = "0.00";
            }
        });

        let targetGPA = 0;
        let targetPercentage = 0;
        let targetGrade = '-';

        if (validSubjects > 0 && totalCredits > 0) {
            targetGPA = totalQualityPts / totalCredits;
            targetPercentage = totalMarks / validSubjects;
            targetGrade = getGrade(targetGPA);
        }

        // Animate Numbers if they changed
        if (targetGPA !== currentGPA) {
            animateValue(gpaDisplay, currentGPA, targetGPA, 1000);
            currentGPA = targetGPA;
        }

        if (targetPercentage !== currentPercentage) {
            animateValue(percentDisplay, currentPercentage, targetPercentage, 1000, true);
            currentPercentage = targetPercentage;
        }

        // Pop Animation for Grade
        if (gradeDisplay.textContent !== targetGrade) {
            gradeDisplay.style.transform = 'scale(1.3)';
            setTimeout(() => {
                gradeDisplay.textContent = targetGrade;
                gradeDisplay.style.transform = 'scale(1)';
            }, 150);
        }

        // Smooth transition for the circular meter based on target GPA
        const degrees = (targetGPA / 4.0) * 360;
        gpaMeter.style.background = `conic-gradient(from 0deg, #3b82f6 0deg, #8b5cf6 ${degrees}deg, #e2e8f0 ${degrees}deg)`;
    }
});
