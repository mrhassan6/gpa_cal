function calCGPA(){
    let totalGPA = 0;
    let semesterCount = 0;
    
    for(let i=1; i<=8; i++){
        let gpa = document.getElementById('sem' + i).value;       
        if(gpa){
            gpa = parseFloat(gpa);
            if(gpa >= 0 && gpa <= 4){
                totalGPA += gpa;
                semesterCount++;
            }
        }
    }        
    let cgpa = semesterCount > 0 ? (totalGPA / semesterCount) : 0;
    return {
        gpa: cgpa.toFixed(2),
        semesterCount: semesterCount,
        totalGPA: totalGPA.toFixed(2)
    };
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

function updateHalfMeter(){
    let results=calCGPA(); 
    let gpa=parseFloat(results.gpa);
    document.getElementById('halfGPA').textContent=results.gpa;
    let targetRotation=-90+(gpa/4)*180;
    let needle=document.getElementById('gpaHalfNeedle');
    let currentRotation=-90;
    
    function step(){
        if (currentRotation < targetRotation) {
            currentRotation += 2;
            needle.style.transform = `translateX(-50%) rotate(${currentRotation}deg)`;
            setTimeout(step, 7);
        } else if (currentRotation > targetRotation) {
            currentRotation -= 2;
            needle.style.transform = `translateX(-50%) rotate(${currentRotation}deg)`;
            setTimeout(step, 7);
        }
    }
    step();
}

function updateTopSection(){
    let results=calCGPA(); 
    let gpa=parseFloat(results.gpa);
    let percentage=(gpa/4)*100;
    
    document.getElementById('liveGPA').textContent = results.gpa;
    document.getElementById('livePercentage').textContent = percentage.toFixed(1) + '%';
    document.getElementById('liveGrade').textContent = results.grade;
}

window.onload=function(){
    updateHalfMeter();
    updateTopSection();
};
