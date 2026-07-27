document.addEventListener('DOMContentLoaded', () => {
    const subjectCards = document.querySelectorAll('.subject-card');
    const gpaDisplay = document.getElementById('total-gpa');
    const percentDisplay = document.getElementById('total-percentage');
    const gradeDisplay = document.getElementById('total-grade');
    const gpaMeter = document.getElementById('gpa-meter');

    let currentGPA = 0;
    let currentPercentage = 0;

    subjectCards.forEach(card => {
        const inputs = card.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calculateFinalScores);
        });
    });

    function getGrade(gpa){
        gpa = parseFloat(gpa);
        gpa = parseFloat(gpa.toFixed(2));
        
        if(gpa >= 3.95 && gpa <= 4.00) return 'A+';
        else if(gpa >= 3.71 && gpa <= 3.94) return 'A';
        else if(gpa >= 2.86 && gpa <= 3.70) return 'B'; 
        else if(gpa >= 2.29 && gpa <= 2.85) return 'C';  
        else if(gpa >= 2.00 && gpa <= 2.28) return 'D';  
        else if(gpa < 2) return 'F';
        return '-';
    }

    function animateValue(element, start, end, duration, isPercent = false) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
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
        let totalGPA = 0;
        let validSemesters = 0;

        subjectCards.forEach(card => {
            const gpaInput = card.querySelector('.gpa-input');
            
            // STRICT DECIMAL LOCK: Prevents entering more than 2 digits after the dot
            if (gpaInput.value.includes('.')) {
                let parts = gpaInput.value.split('.');
                if (parts[1].length > 2) {
                    gpaInput.value = parts[0] + '.' + parts[1].substring(0, 2);
                }
            }

            let gpa = parseFloat(gpaInput.value);

            if (gpaInput.value !== '' && !isNaN(gpa)) {
                if (gpa > 4.0) {
                    gpa = 4.0;
                    gpaInput.value = 4.0;
                }
                if (gpa < 0) {
                    gpa = 0;
                    gpaInput.value = 0;
                }
                
                totalGPA += gpa;
                validSemesters++;
            }
        });

        let targetCGPA = 0;
        let targetPercentage = 0;
        let targetGrade = '-';

        if (validSemesters > 0) {
            targetCGPA = totalGPA / validSemesters;
            targetPercentage = (targetCGPA / 4.0) * 100;
            targetGrade = getGrade(targetCGPA);
        }

        if (targetCGPA !== currentGPA) {
            animateValue(gpaDisplay, currentGPA, targetCGPA, 1000);
            currentGPA = targetCGPA;
        }

        if (targetPercentage !== currentPercentage) {
            animateValue(percentDisplay, currentPercentage, targetPercentage, 1000, true);
            currentPercentage = targetPercentage;
        }

        if (gradeDisplay.textContent !== targetGrade) {
            gradeDisplay.style.transform = 'scale(1.3)';
            setTimeout(() => {
                gradeDisplay.textContent = targetGrade;
                gradeDisplay.style.transform = 'scale(1)';
            }, 150);
        }

        const degrees = (targetCGPA / 4.0) * 360;
        gpaMeter.style.background = `conic-gradient(from 0deg, #3b82f6 0deg, #8b5cf6 ${degrees}deg, #e2e8f0 ${degrees}deg)`;
    }
});
