// dmi_assessment_logic.js

let liveChartInstance = null;
let finalChartInstance = null;
let currentDepartment = DEFAULT_DEPARTMENT; // Loads default from dmi_assessment_data.js

// --- Shared Folder Path Constant ---
// The requested path is set to the local folder: C:/folder1
const EVIDENCE_SHARED_FOLDER_PATH = "file:///C:/folder1"; 
// -----------------------------------

// Define internal colors (hidden from HTML)
const CHART_COLORS = {
    score_red: 'rgba(211, 47, 47, 1)',      
    score_orange: 'rgba(255, 165, 0, 1)',   
    score_blue: 'rgba(0, 77, 156, 1)',      
    score_green: 'rgba(56, 142, 60, 1)',    
    remaining: 'rgba(224, 224, 224, 0.5)'  
};

/**
 * NEW FUNCTION: Handles the department switch, reloads the form, and updates the URL.
 */
function switchDepartment(department) {
    if (department && DMI_DATA[department]) {
        currentDepartment = department;
        
        // Update URL hash to remember selection on refresh
        window.location.hash = department.replace(/\s/g, '_');
        
        // Reset and rebuild the form with the new department's data
        document.getElementById('assessmentForm').innerHTML = '';
        document.getElementById('reportSection').style.display = 'none';
        
        loadSelections(); 
        
        // Update the department title
        document.getElementById('departmentTitle').textContent = `${department} DMI Assessment`;
    }
}

/**
 * Utility function to get the data object for the current department.
 */
function getCurrentDepartmentData() {
    return DMI_DATA[currentDepartment];
}

/**
 * Opens the shared folder link in a new window/tab.
 */
function openSharedFolder() {
    window.open(EVIDENCE_SHARED_FOLDER_PATH, '_blank');
}

/**
 * Determines the primary color of the score slice based on the percentage achieved.
 */
function getColorByScore(percentage) {
    if (percentage >= 65) return CHART_COLORS.score_green;
    if (percentage >= 60) return CHART_COLORS.score_blue;
    if (percentage >= 21) return CHART_COLORS.score_orange;
    return CHART_COLORS.score_red;
}

/**
 * Calculates and updates the floating live score card.
 */
function updateLiveScore() {
    const { questions, maxScore, totalQuestions } = getCurrentDepartmentData();
    let currentTotalScore = 0;
    let currentAnsweredQuestions = 0;
    
    // Use department-specific storage key
    const storageKey = STORAGE_KEY_PREFIX + currentDepartment.replace(/\s/g, '_');
    const selections = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    questions.forEach(qData => {
        const score = parseInt(selections[qData.id]);
        if (!isNaN(score)) {
            currentTotalScore += score;
            currentAnsweredQuestions++;
        }
    });

    let livePercentage = (currentTotalScore / maxScore) * 100;
    
    document.getElementById('liveScorePercentage').textContent = livePercentage.toFixed(0) + "%"; 
    document.getElementById('liveScoreStatus').textContent = `${currentAnsweredQuestions} / ${totalQuestions} Questions Answered`;
    
    generateLiveDoughnutChart(livePercentage);
    
    return { totalScore: currentTotalScore, answeredQuestions: currentAnsweredQuestions, maxScore, totalQuestions };
}

/**
 * Generates a Doughnut Chart for the live score.
 */
function generateLiveDoughnutChart(maturityPercentage) {
    if (liveChartInstance) {
        liveChartInstance.destroy();
    }
    const scoreColor = getColorByScore(maturityPercentage);
    const data = {
        datasets: [{
            data: [maturityPercentage, 100 - maturityPercentage],
            backgroundColor: [scoreColor, CHART_COLORS.remaining],
            borderWidth: 0,
        }]
    };
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '80%', 
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    };
    const ctx = document.getElementById('liveMaturityChart').getContext('2d');
    liveChartInstance = new Chart(ctx, config);
}

/**
 * Saves the current form selection to Local Storage AND updates the live score.
 */
function saveSelection(selectElement) {
    const storageKey = STORAGE_KEY_PREFIX + currentDepartment.replace(/\s/g, '_');
    let selections = JSON.parse(localStorage.getItem(storageKey)) || {};
    const questionId = selectElement.name;
    const selectedValue = selectElement.value;

    if (selectedValue) {
        selections[questionId] = selectedValue;
    } else {
        delete selections[questionId];
    }

    localStorage.setItem(storageKey, JSON.stringify(selections));
    
    updateLiveScore();

    const saveStatus = document.getElementById('saveStatus');
    saveStatus.style.display = 'block';
    setTimeout(() => { saveStatus.style.display = 'none'; }, 1500);
}

/**
 * Builds the HTML form structure based on the DMI_QUESTIONS array for the current department.
 */
function buildForm() {
    const { questions } = getCurrentDepartmentData();
    const form = document.getElementById('assessmentForm');
    let html = '';

    questions.forEach((q, index) => {
        let optionsHtml = q.choices.map(c => 
            `<option value="${c.value}">${c.text}</option>`
        ).join('');

        // Use the index as Q-Number if ID is complex, or Q.id if preferred
        const qNumber = `Q${index + 1}`;
        let areaRow = (index === 0 || q.area !== questions[index - 1].area) ? 
            `<h2 class="area-header">${q.area}</h2>` : '';

        html += areaRow + `
            <div class="question-block" data-q-id="${q.id}">
                <h3>${qNumber}. ${q.title}</h3>
                <p id="${q.id}_text">${q.text}</p>
                <select id="${q.id}_select" name="${q.id}" class="level-select" onchange="saveSelection(this)">
                    <option value="">-- Select a Maturity Level (1-5) --</option>
                    ${optionsHtml}
                </select>
            </div>
        `;
    });
    form.innerHTML = html;
}

/**
 * Loads saved selections from Local Storage and initializes the form/score.
 */
function loadSelections() {
    if (typeof DMI_DATA === 'undefined') {
        alert("Error: Missing 'dmi_assessment_data.js' file. Please ensure it is linked and contains data.");
        return;
    }
    
    // Check URL hash for department preference
    const hash = window.location.hash.slice(1).replace(/_/g, ' ');
    if (hash && DMI_DATA[hash]) {
        currentDepartment = hash;
    }
    
    // Update the dropdown to reflect the current department
    document.getElementById('departmentSelector').value = currentDepartment;
    document.getElementById('departmentTitle').textContent = `${currentDepartment} DMI Assessment`;
    
    const { questions } = getCurrentDepartmentData();
    
    buildForm();
    
    const storageKey = STORAGE_KEY_PREFIX + currentDepartment.replace(/\s/g, '_');
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
        const selections = JSON.parse(savedData);
        
        questions.forEach(q => {
            const selectElement = document.getElementById(`${q.id}_select`);
            if (selectElement && selections[q.id]) {
                selectElement.value = selections[q.id];
            }
        });
    }
    
    updateLiveScore();
}

/**
 * Calculates the score and generates the report elements.
 */
function finalizeAssessment() {
    const { totalScore, answeredQuestions, maxScore, totalQuestions } = updateLiveScore();
    const { questions, maturityBands } = getCurrentDepartmentData();

    if (answeredQuestions !== totalQuestions) {
        alert(`Please answer all ${totalQuestions} questions before generating the final report. You have answered ${answeredQuestions} questions.`);
        return;
    }

    const detailedScoreBody = document.getElementById('detailedScoreBody');
    detailedScoreBody.innerHTML = ''; 
    let currentArea = null;
    const storageKey = STORAGE_KEY_PREFIX + currentDepartment.replace(/\s/g, '_');
    const selections = JSON.parse(localStorage.getItem(storageKey)) || {};

    questions.forEach((qData, index) => {
        const score = parseInt(selections[qData.id]);
        const qNumber = `Q${index + 1}`;

        if (qData.area !== currentArea) {
            currentArea = qData.area;
            const areaRow = detailedScoreBody.insertRow();
            areaRow.classList.add('area-row');
            const areaCell = areaRow.insertCell();
            areaCell.colSpan = 4; 
            areaCell.textContent = currentArea;
            areaCell.classList.add('area-cell');
        }

        const row = detailedScoreBody.insertRow();
        row.insertCell().textContent = qNumber;
        
        const questionCell = row.insertCell();
        questionCell.textContent = qData.text;
        questionCell.classList.add('full-question');

        const scoreCell = row.insertCell();
        scoreCell.textContent = score;
        scoreCell.classList.add('score-value');

        const selectedChoice = qData.choices.find(c => c.value === score);
        const answerCell = row.insertCell();
        answerCell.textContent = selectedChoice ? selectedChoice.text : 'Error: Answer text missing.';
    });

    const maturityPercentage = (totalScore / maxScore) * 100;
    const percentageText = maturityPercentage.toFixed(2) + "%";
    
    const level = maturityBands.find(band => maturityPercentage >= band.range[0] && maturityPercentage <= band.range[1]);
    const levelName = level ? level.name : 'Unclassified';
    const levelDescription = level ? level.description : 'Please review the score range definitions.';

    document.getElementById('maturityScoreDisplay').textContent = percentageText;
    document.getElementById('totalScoreText').textContent = totalScore;
    document.getElementById('maxScoreText').textContent = maxScore;

    const levelTextElement = document.getElementById('maturityLevelText');
    levelTextElement.innerHTML = `<strong>${levelName}</strong><p>${levelDescription}</p>`;
    
    document.getElementById('reportSection').style.display = 'block';
    document.getElementById('reportSection').scrollIntoView({ behavior: 'smooth' });

    generateFinalBarChart(maturityPercentage.toFixed(2));
}

/**
 * Generates a Horizontal Bar Chart for the final report.
 */
function generateFinalBarChart(maturityPercentage) {
    if (finalChartInstance) {
        finalChartInstance.destroy();
    }
    Chart.register(ChartDataLabels);

    const data = {
        labels: ['DMI Percentage'],
        datasets: [{
            label: 'Achieved Maturity',
            data: [maturityPercentage],
            backgroundColor: 'var(--secondary-green)',
            borderColor: 'var(--secondary-green)',
            borderWidth: 1,
            barThickness: 50, 
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            scales: {
                x: { min: 0, max: 100, title: { display: true, text: 'DMI Percentage' }, grid: { display: true } },
                y: { display: false }
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => context.dataset.label + ': ' + context.parsed.x + '%' } },
                datalabels: {
                    anchor: 'end', align: 'end',
                    formatter: (value) => value + '%',
                    color: 'var(--primary-blue)',
                    font: { weight: 'bold', size: 14 }
                }
            }
        }
    };

    const ctx = document.getElementById('finalMaturityChart').getContext('2d');
    finalChartInstance = new Chart(ctx, config);
}

// Attach the main initialization function to the window load event
window.onload = loadSelections;