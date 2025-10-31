// dmi_assessment_logic.js

let liveChartInstance = null;
let finalChartInstance = null;

// --- Shared Folder Path Constant ---
// The requested path is now set to the local folder: C:/folder1
const EVIDENCE_SHARED_FOLDER_PATH = "file:///C:/folder1"; 
// -----------------------------------

// Define the colors and bands for the chart based on the score (internal constant)
const CHART_COLORS = {
    // Colors based on user's request
    score_red: 'rgba(211, 47, 47, 1)',      // Red (0-20%)
    score_orange: 'rgba(255, 165, 0, 1)',   // Orange (21-59%)
    score_blue: 'rgba(0, 77, 156, 1)',      // Blue (60-64%)
    score_green: 'rgba(56, 142, 60, 1)',    // Green (65%+)
    remaining: 'rgba(224, 224, 224, 0.5)'  // Light gray for remaining portion
};

/**
 * NEW FUNCTION: Opens the shared folder link in a new window/tab.
 */
function openSharedFolder() {
// The link is hidden here, using the requested C:/folder1 path.
    //const EVIDENCE_SHARED_FOLDER_PATH = "C:/folder1"; 
   // window.open(EVIDENCE_SHARED_FOLDER_PATH, '_blank');

 <a href="https://tasheer.sharepoint.com/sites/DMI/Shared Documents" target="_blank" class="btn">
    📂 Access Shared Folder
  </a>
}

/**
 * Determines the primary color of the score slice based on the percentage achieved against MAX_POSSIBLE_SCORE.
 * @param {number} percentage The calculated DMI percentage.
 * @returns {string} The CSS color string.
 */
function getColorByScore(percentage) {
    if (percentage >= 65) {
        return CHART_COLORS.score_green;
    } else if (percentage >= 60) {
        return CHART_COLORS.score_blue;
    } else if (percentage >= 21) {
        return CHART_COLORS.score_orange;
    } else if (percentage >= 0) {
        return CHART_COLORS.score_red;
    }
    return CHART_COLORS.remaining; 
}

/**
 * Calculates and updates the floating live score card.
 * Uses MAX_POSSIBLE_SCORE (70) as the denominator for the percentage.
 * @returns {object} {totalScore, answeredQuestions}
 */
function updateLiveScore() {
    let currentTotalScore = 0;
    let currentAnsweredQuestions = 0;
    // STORAGE_KEY comes from dmi_assessment_data.js
    const selections = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    
    // DMI_QUESTIONS comes from dmi_assessment_data.js
    DMI_QUESTIONS.forEach(qData => {
        const score = parseInt(selections[qData.id]);
        if (!isNaN(score)) {
            currentTotalScore += score;
            currentAnsweredQuestions++;
        }
    });

    // Percentage is based on the Max Possible Score for the WHOLE ASSESSMENT (70).
    // MAX_POSSIBLE_SCORE comes from dmi_assessment_data.js
    let livePercentage = (currentTotalScore / MAX_POSSIBLE_SCORE) * 100;
    
    // Update the live score display elements (must be done by logic, not HTML)
    document.getElementById('liveScorePercentage').textContent = livePercentage.toFixed(0) + "%"; 
    // TOTAL_QUESTIONS comes from dmi_assessment_data.js
    document.getElementById('liveScoreStatus').textContent = `${currentAnsweredQuestions} / ${TOTAL_QUESTIONS} Questions Answered`;
    
    // Generate the Doughnut Chart
    generateLiveDoughnutChart(livePercentage);
    
    return { totalScore: currentTotalScore, answeredQuestions: currentAnsweredQuestions };
}

/**
 * Generates a Doughnut Chart for the live score with dynamic colors.
 * @param {number} maturityPercentage The calculated DMI percentage of the whole project.
 */
function generateLiveDoughnutChart(maturityPercentage) {
    if (liveChartInstance) {
        liveChartInstance.destroy();
    }

    const scoreColor = getColorByScore(maturityPercentage);
    const data = {
        labels: ['Achieved Score', 'Max Remaining Score'],
        datasets: [{
            data: [maturityPercentage, 100 - maturityPercentage],
            backgroundColor: [scoreColor, CHART_COLORS.remaining],
            borderColor: [scoreColor, CHART_COLORS.remaining],
            borderWidth: 0,
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%', 
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    };

    const ctx = document.getElementById('liveMaturityChart').getContext('2d');
    liveChartInstance = new Chart(ctx, config);
}

/**
 * Saves the current form selection to Local Storage AND updates the live score.
 */
function saveSelection(selectElement) {
    let selections = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const questionId = selectElement.name;
    const selectedValue = selectElement.value;

    if (selectedValue) {
        selections[questionId] = selectedValue;
    } else {
        delete selections[questionId];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    
    updateLiveScore();

    const saveStatus = document.getElementById('saveStatus');
    saveStatus.style.display = 'block';
    setTimeout(() => {
        saveStatus.style.display = 'none';
    }, 1500);
}

/**
 * Builds the HTML form structure based on the DMI_QUESTIONS array.
 */
function buildForm() {
    const form = document.getElementById('assessmentForm');
    let html = '';

    DMI_QUESTIONS.forEach(q => {
        let optionsHtml = q.choices.map(c => 
            `<option value="${c.value}">${c.text}</option>`
        ).join('');
        // The onchange event calls a function defined in this logic file
        html += `
            <div class="question-block" data-q-id="${q.id}">
                <h3>${q.id}. ${q.title}</h3>
                <p id="${q.id}_text">${q.text}</p>
                <select id="${q.id}_select" name="${q.id}" class="level-select" onchange="saveSelection(this)">
                    <option value="">-- Select a Maturity Level (1-5) --</option>
                    ${optionsHtml}
                </select>
            </div>
        `;
    });
    form.innerHTML += html;
}

/**
 * Loads saved selections from Local Storage and initializes the form/score.
 */
function loadSelections() {
    // Check if the secure data file loaded
    if (typeof DMI_QUESTIONS === 'undefined' || typeof MAX_POSSIBLE_SCORE === 'undefined') {
        alert("Error: Missing 'dmi_assessment_data.js' file. Please ensure it is linked and contains data.");
        return;
    }
    buildForm();
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        const selections = JSON.parse(savedData);
        
        const questionElements = document.querySelectorAll('.level-select');
        questionElements.forEach(selectElement => {
            const questionId = selectElement.name;
            if (selections[questionId]) {
                selectElement.value = selections[questionId];
            }
        });
    }
    
    // Initial load of the live score
    updateLiveScore();
}

/**
 * Calculates the score and generates the report elements.
 */
function finalizeAssessment() {
    const { totalScore, answeredQuestions } = updateLiveScore();

    if (answeredQuestions !== TOTAL_QUESTIONS) {
        alert(`Please answer all ${TOTAL_QUESTIONS} questions before generating the final report. You have answered ${answeredQuestions} questions.`);
        return;
    }

    const detailedScoreBody = document.getElementById('detailedScoreBody');
    detailedScoreBody.innerHTML = ''; 
    let currentArea = null;

    const selections = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    DMI_QUESTIONS.forEach(qData => {
        const score = parseInt(selections[qData.id]);

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
        
        row.insertCell().textContent = qData.id;
        
        const questionCell = row.insertCell();
        questionCell.textContent = qData.text;
        questionCell.classList.add('full-question');

        if (!isNaN(score)) {
            
            const scoreCell = row.insertCell();
            scoreCell.textContent = score;
            scoreCell.classList.add('score-value');

            const selectedChoice = qData.choices.find(c => c.value === score);
            const answerText = selectedChoice ? selectedChoice.text : 'Error: Answer text missing.';

            const answerCell = row.insertCell();
            answerCell.textContent = answerText;
        } else {
            row.insertCell().textContent = 'N/A';
            row.insertCell().textContent = 'Question Not Answered';
        }
    });


    // Calculate Final Maturity Percentage (based on MAX POSSIBLE SCORE)
    const maturityPercentage = (totalScore / MAX_POSSIBLE_SCORE) * 100;
    const percentageText = maturityPercentage.toFixed(2) + "%";
    
    // maturityBands comes from dmi_assessment_data.js
    const level = maturityBands.find(band => maturityPercentage >= band.range[0] && maturityPercentage <= band.range[1]);
    const levelName = level ? level.name : 'Unclassified';
    const levelDescription = level ? level.description : 'Please review the score range definitions.';

    // Display results
    document.getElementById('maturityScoreDisplay').textContent = percentageText;
    document.getElementById('totalScoreText').textContent = totalScore;
    document.getElementById('maxScoreText').textContent = MAX_POSSIBLE_SCORE;

    const levelTextElement = document.getElementById('maturityLevelText');
    levelTextElement.innerHTML = `
        <strong>${levelName}</strong>
        <p>${levelDescription}</p>
    `;
    
    document.getElementById('reportSection').style.display = 'block';
    
    document.getElementById('reportSection').scrollIntoView({ behavior: 'smooth' });

    generateFinalBarChart(maturityPercentage.toFixed(2));
}

/**
 * Generates a Horizontal Bar Chart for the final report.
 * @param {number} maturityPercentage The calculated DMI percentage.
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
            indexAxis: 'y', 
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: 'DMI Percentage'
                    },
                    grid: {
                        display: true 
                    }
                },
                y: {
                    display: false 
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.x + '%';
                        }
                    },
                    bodyFont: {
                        family: 'Segoe UI'
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value, context) => {
                        return value + '%';
                    },
                    color: 'var(--primary-blue)',
                    font: {
                        weight: 'bold',
                        size: 14,
                        family: 'Segoe UI'
                    }
                }
            }
        }
    };

    const ctx = document.getElementById('finalMaturityChart').getContext('2d');
    finalChartInstance = new Chart(ctx, config);
}

// Attach the main initialization function to the window load event
window.onload = loadSelections;