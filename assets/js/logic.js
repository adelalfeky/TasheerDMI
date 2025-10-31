// /assets/js/logic.js

let liveChartInstance = null;
let finalChartInstance = null;
let adminChartInstance = null;

// --- Security & Session Management ---

/**
 * Checks session and redirects if not logged in.
 * @param {boolean} adminRequired If true, redirects if the user is not an Admin.
 * @param {string} currentPage The name of the current page (e.g., 'index', 'admin').
 */
function checkLoginGuard(adminRequired = false, currentPage = 'index') {
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_PREFIX + 'user'));
    
    if (!user || !USERS[user.username]) {
        if (currentPage !== 'login') {
            window.location.href = 'login.html';
        }
        return false;
    }
    
    if (adminRequired && !user.isAdmin) {
        alert("Access Denied: Only administrators can view this page.");
        window.location.href = 'index.html';
        return false;
    }

    if (currentPage === 'login' && user) {
        // If logged in and on login page, redirect to appropriate dashboard
        window.location.href = user.isAdmin ? 'admin.html' : 'index.html';
        return false;
    }

    return user;
}

/**
 * Handles user login attempt.
 */
function handleLogin() {
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    const user = USERS[username];

    if (user && user.password === password) {
        const userData = {
            username: username,
            department: user.department,
            isAdmin: user.isAdmin
        };
        sessionStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(userData));
        
        if (user.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        errorMessage.textContent = 'Invalid username or password.';
    }
}

/**
 * Logs out the current user and redirects to login page.
 */
function logout() {
    sessionStorage.removeItem(STORAGE_KEY_PREFIX + 'user');
    window.location.href = 'login.html';
}

// --- Assessment Functions (Used by index.html) ---

/**
 * Determines the primary color of the score slice based on the percentage achieved.
 */
function getColorByScore(percentage) {
    if (percentage >= 91) return 'rgba(56, 142, 60, 1)'; // Optimized (Level 5)
    if (percentage >= 76) return 'rgba(0, 77, 156, 1)';  // Advanced (Level 4)
    if (percentage >= 51) return 'rgba(255, 165, 0, 1)'; // Managed (Level 3)
    if (percentage >= 26) return 'rgba(211, 47, 47, 1)'; // Basic (Level 2)
    return 'rgba(211, 47, 47, 1)'; // Ad-hoc (Level 1)
}

/**
 * Calculates and updates the floating live score card.
 */
function updateLiveScore(user) {
    let currentTotalScore = 0;
    let currentAnsweredQuestions = 0;
    
    const storageKey = STORAGE_KEY_PREFIX + user.department.replace(/\s/g, '_');
    const selections = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    DMI_QUESTIONS.forEach(qData => {
        const score = parseInt(selections[qData.id]);
        if (!isNaN(score) && score >= 1 && score <= 5) {
            currentTotalScore += score;
            currentAnsweredQuestions++;
        }
    });

    let livePercentage = (currentTotalScore / MAX_POSSIBLE_SCORE) * 100;
    
    document.getElementById('liveScorePercentage').textContent = livePercentage.toFixed(0) + "%"; 
    document.getElementById('liveScoreStatus').textContent = `${currentAnsweredQuestions} / ${TOTAL_QUESTIONS} Questions Answered`;
    
    generateLiveDoughnutChart(livePercentage);
    
    return { totalScore: currentTotalScore, answeredQuestions: currentAnsweredQuestions };
}

/**
 * Generates a Doughnut Chart for the live score.
 */
function generateLiveDoughnutChart(maturityPercentage) {
    if (liveChartInstance) {
        liveChartInstance.destroy();
    }
    const scoreColor = getColorByScore(maturityPercentage);
    const remainingColor = 'rgba(224, 224, 224, 0.5)';
    const data = {
        datasets: [{
            data: [maturityPercentage, 100 - maturityPercentage],
            backgroundColor: [scoreColor, remainingColor],
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
    const user = checkLoginGuard();
    if (!user) return;

    const storageKey = STORAGE_KEY_PREFIX + user.department.replace(/\s/g, '_');
    let selections = JSON.parse(localStorage.getItem(storageKey)) || {};
    const questionId = selectElement.name;
    const selectedValue = selectElement.value;

    if (selectedValue) {
        selections[questionId] = selectedValue;
    } else {
        delete selections[questionId];
    }

    localStorage.setItem(storageKey, JSON.stringify(selections));
    
    updateLiveScore(user);

    const saveStatus = document.getElementById('saveStatus');
    saveStatus.style.display = 'block';
    setTimeout(() => { saveStatus.style.display = 'none'; }, 1500);
}

/**
 * Builds the HTML form structure.
 */
function buildForm() {
    const form = document.getElementById('assessmentForm');
    let html = '<h2>Please complete all 14 questions below:</h2>';
    let currentArea = null;

    DMI_QUESTIONS.forEach((q, index) => {
        let optionsHtml = q.choices.map(c => 
            `<option value="${c.value}">${c.text}</option>`
        ).join('');

        const qNumber = index + 1;
        let areaRow = (q.area !== currentArea) ? 
            `<h2 class="area-header">${q.area}</h2>` : '';
        currentArea = q.area;

        html += areaRow + `
            <div class="question-block" data-q-id="${q.id}">
                <h3>Q${qNumber}. ${q.title}</h3>
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
function loadAssessment() {
    const user = checkLoginGuard(false, 'index');
    if (!user) return;
    
    document.getElementById('welcomeMessage').textContent = `Welcome, ${user.department}!`;

    buildForm();
    
    const storageKey = STORAGE_KEY_PREFIX + user.department.replace(/\s/g, '_');
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
        const selections = JSON.parse(savedData);
        DMI_QUESTIONS.forEach(q => {
            const selectElement = document.getElementById(`${q.id}_select`);
            if (selectElement && selections[q.id]) {
                selectElement.value = selections[q.id];
            }
        });
    }
    
    updateLiveScore(user);
}

/**
 * Opens the shared folder link in a new window/tab.
 */
function openSharedFolder() {
    window.open(EVIDENCE_SHARED_FOLDER_PATH, '_blank');
}

/**
 * Clears local storage for the current department.
 */
function resetAssessment() {
    if (!confirm("Are you sure you want to reset all answers for this department?")) {
        return;
    }
    const user = checkLoginGuard();
    const storageKey = STORAGE_KEY_PREFIX + user.department.replace(/\s/g, '_');
    localStorage.removeItem(storageKey);
    // Reloads the form
    loadAssessment();
    document.getElementById('reportSection').style.display = 'none';
}

/**
 * Calculates the score and generates the report elements.
 */
function finalizeAssessment() {
    const user = checkLoginGuard();
    const { totalScore, answeredQuestions } = updateLiveScore(user);

    if (answeredQuestions !== TOTAL_QUESTIONS) {
        alert(`Please answer all ${TOTAL_QUESTIONS} questions before generating the final report. You have answered ${answeredQuestions} questions.`);
        return;
    }

    const detailedScoreBody = document.getElementById('detailedScoreBody');
    detailedScoreBody.innerHTML = ''; 
    let currentArea = null;
    const storageKey = STORAGE_KEY_PREFIX + user.department.replace(/\s/g, '_');
    const selections = JSON.parse(localStorage.getItem(storageKey)) || {};

    DMI_QUESTIONS.forEach((qData, index) => {
        const score = parseInt(selections[qData.id]);
        const qNumber = index + 1;

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
        row.insertCell().textContent = `Q${qNumber}`;
        
        const questionCell = row.insertCell();
        questionCell.textContent = qData.text;
        questionCell.classList.add('full-question');

        const scoreCell = row.insertCell();
        scoreCell.textContent = score;
        scoreCell.classList.add('score-value');

        const selectedChoice = qData.choices.find(c => c.value === score);
        const answerCell = row.insertCell();
        answerCell.textContent = selectedChoice ? selectedChoice.text : 'N/A';
    });

    const maturityPercentage = (totalScore / MAX_POSSIBLE_SCORE) * 100;
    const percentageText = maturityPercentage.toFixed(2) + "%";
    
    const level = MATURITY_BANDS.find(band => maturityPercentage >= band.range[0] && maturityPercentage <= band.range[1]);
    const levelName = level ? level.name : 'Unclassified';
    const levelDescription = level ? level.description : 'Please review the score range definitions.';

    document.getElementById('maturityScoreDisplay').textContent = percentageText;
    document.getElementById('totalScoreText').textContent = totalScore;
    document.getElementById('maxScoreText').textContent = MAX_POSSIBLE_SCORE;

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
            backgroundColor: getColorByScore(maturityPercentage),
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
                x: { min: 0, max: 100, title: { display: true, text: 'DMI Percentage' } },
                y: { display: false }
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => context.dataset.label + ': ' + context.parsed.x + '%' } },
                datalabels: { anchor: 'end', align: 'end', formatter: (value) => value + '%', color: '#004d99', font: { weight: 'bold', size: 14 } }
            }
        }
    };

    const ctx = document.getElementById('finalMaturityChart').getContext('2d');
    finalChartInstance = new Chart(ctx, config);
}


// --- Admin Dashboard Functions (Used by admin.html) ---

/**
 * Collects all department scores from Local Storage.
 */
function getAllDepartmentScores() {
    const scores = [];
    let companyTotalScore = 0;
    let departmentsCount = 0;

    for (const [key, user] of Object.entries(USERS)) {
        if (!user.isAdmin) {
            const storageKey = STORAGE_KEY_PREFIX + user.department.replace(/\s/g, '_');
            const selections = JSON.parse(localStorage.getItem(storageKey));
            
            let totalScore = 0;
            let answeredQuestions = 0;
            
            if (selections) {
                DMI_QUESTIONS.forEach(qData => {
                    const score = parseInt(selections[qData.id]);
                    if (!isNaN(score) && score >= 1 && score <= 5) {
                        totalScore += score;
                        answeredQuestions++;
                    }
                });
            }
            
            const percentage = answeredQuestions === TOTAL_QUESTIONS 
                                ? (totalScore / MAX_POSSIBLE_SCORE) * 100 
                                : 0; // Only count fully completed assessments for score averaging, or show 0% if incomplete.
            
            if (answeredQuestions === TOTAL_QUESTIONS) {
                companyTotalScore += percentage;
                departmentsCount++;
            }

            scores.push({
                department: user.department,
                username: key,
                totalScore: totalScore,
                answered: answeredQuestions,
                percentage: percentage.toFixed(2)
            });
        }
    }
    
    const overallDMI = departmentsCount > 0 ? companyTotalScore / departmentsCount : 0;

    return { scores, overallDMI: overallDMI.toFixed(2) };
}

/**
 * Renders the Admin Dashboard elements.
 */
function loadAdminDashboard() {
    const user = checkLoginGuard(true, 'admin');
    if (!user) return;

    document.getElementById('welcomeMessage').textContent = `Welcome, Admin User!`;
    
    const { scores, overallDMI } = getAllDepartmentScores();
    
    document.getElementById('overallDMIValue').textContent = `${overallDMI}%`;
    
    // Render Department List
    const tableBody = document.getElementById('departmentTableBody');
    tableBody.innerHTML = '';
    
    scores.sort((a, b) => b.percentage - a.percentage).forEach(score => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = score.department;
        
        const percentCell = row.insertCell();
        percentCell.textContent = `${score.percentage}%`;
        percentCell.style.color = getColorByScore(parseFloat(score.percentage));
        percentCell.style.fontWeight = 'bold';
        
        row.insertCell().textContent = `${score.answered} / ${TOTAL_QUESTIONS}`;
    });
    
    // Generate Overall Company Chart
    generateAdminChart(scores, overallDMI);
}

/**
 * Generates the Admin Dashboard Bar Chart.
 */
function generateAdminChart(scores, overallDMI) {
    if (adminChartInstance) {
        adminChartInstance.destroy();
    }
    Chart.register(ChartDataLabels);

    const labels = scores.map(s => s.department.split(' ').map(w => w[0]).join('')); // Use initials for labels
    const dataPoints = scores.map(s => parseFloat(s.percentage));
    const colors = dataPoints.map(getColorByScore);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'DMI Score (%)',
            data: dataPoints,
            backgroundColor: colors,
            borderColor: colors.map(c => c.replace(', 1)', ', 0.5)')),
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: { display: true, text: 'Digital Maturity Index (%)' }
                }
            },
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => value > 0 ? value + '%' : '',
                    color: '#333',
                    font: { size: 10, weight: 'bold' }
                },
                title: {
                    display: true,
                    text: `Tasheer Company DMI Average: ${overallDMI}%`,
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    };

    const ctx = document.getElementById('adminDMIChart').getContext('2d');
    adminChartInstance = new Chart(ctx, config);
}