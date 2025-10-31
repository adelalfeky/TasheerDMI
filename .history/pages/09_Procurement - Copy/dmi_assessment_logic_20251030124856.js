// dmi_assessment_logic.js

let liveChartInstance = null;
let finalChartInstance = null;

// --- Shared Folder Path Constant ---
// PLACEHOLDER: Update this variable with your actual UNC path or SharePoint URL.
// UNC Example: "file://///YourServerName/YourShareName/Procurement_DMI_Evidence_Upload"
// Web Example: "https://yourcompany.sharepoint.com/sites/ProcurementDMI/Shared%20Documents/EvidenceUpload"
const EVIDENCE_SHARED_FOLDER_PATH = "file://///[YOUR_SERVER_NAME]/[YOUR_SHARE_NAME]/Procurement_DMI_Evidence_Upload"; 
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
    // Uses the internal constant defined above
    window.open(EVIDENCE_SHARED_FOLDER_PATH, '_blank');
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
// ... (The rest of the logic.js file follows, including updateLiveScore, generateLiveDoughnutChart, saveSelection, buildForm, loadSelections, finalizeAssessment, and generateFinalBarChart)
// ... (The rest of the logic.js file remains the same as the previous step)