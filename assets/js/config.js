// /assets/js/config.js

// --- Global Constants ---
const APP_TITLE = "Tasheer DMI Assessment";
const STORAGE_KEY_PREFIX = "tasheer_dmi_";
const MAX_POSSIBLE_SCORE = 70; // 14 Questions * 5 points
const TOTAL_QUESTIONS = 14;

// --- User Credentials & Roles ---
const USERS = {
    // Admin Account
    'admin': { password: 'adminpassword', department: 'Admin', isAdmin: true },
    
    // Department Accounts (Username: Password: 123)
    'finance': { password: '123', department: 'Finance Department', isAdmin: false },
    'techstrategy': { password: '123', department: 'Tech Strategy & Enterprise Architecture', isAdmin: false },
    'solutiondev': { password: '123', department: 'Solution Development & Delivery', isAdmin: false },
    'platforms': { password: '123', department: 'Platforms & IT Solution Operations', isAdmin: false },
    'infraops': { password: '123', department: 'Infrastructure and Network Operations', isAdmin: false },
    'corporateit': { password: '123', department: 'Corporate IT', isAdmin: false },
    'dataanalytics': { password: '123', department: 'Data Analytics', isAdmin: false },
    'businessex': { password: '123', department: 'Business Excellence Department', isAdmin: false },
    'productdev': { password: '123', department: 'Product & Business Development', isAdmin: false },
    'branchesops': { password: '123', department: 'Branches Operations', isAdmin: false },
    'humancapital': { password: '123', department: 'Human Capital Department', isAdmin: false },
    'grc': { password: '123', department: 'GRC (Governance, Risk & Compliance) Department', isAdmin: false },
    'legal': { password: '123', department: 'Legal & Regulatory Affairs Department', isAdmin: false },
    'internalaudit': { password: '123', department: 'Internal Audit Department', isAdmin: false },
    'cybersecurity': { password: '123', department: 'Cybersecurity Department', isAdmin: false }
};

// --- Standard DMI Questions (14 questions in 7 areas) ---
const STANDARD_CHOICES = [
    { value: 1, text: "1. Ad-hoc effort; entirely manual or unstructured (1 Point)." },
    { value: 2, text: "2. Partial documentation or isolated basic automation (2 Points)." },
    { value: 3, text: "3. Standardized/documented processes; 50-75% automated/tracked digitally (3 Points)." },
    { value: 4, text: "4. Full digital workflow; integrated systems, high automation (75%+) (4 Points)." },
    { value: 5, text: "5. Intelligent automation with AI/Predictive analytics; continuous optimization (5 Points)." }
];

const DMI_QUESTIONS = [
    // Area 1: Service Catalogue & Offering Definition
    { id: "Q1", area: "1. Service Catalogue & Offering Definition", title: "Service Catalogue", text: "Does the department have a clear, formal Service Catalogue showing all the services it provides?", choices: STANDARD_CHOICES },
    { id: "Q2", area: "1. Service Catalogue & Offering Definition", title: "Request & SLA Tracking", text: "How are services requested, tracked, and reported by internal/external users (e.g., through ERP modules, portals, or ticketing systems), and how are SLAs monitored?", choices: STANDARD_CHOICES },
    
    // Area 2: Process Automation & System Integration
    { id: "Q3", area: "2. Process Automation & System Integration", title: "Process Automation Coverage", text: "What percentage of core processes are automated through digital tools (ERP, e-systems, RPA), and what percent are fully digital vs. manual?", choices: STANDARD_CHOICES },
    { id: "Q4", area: "2. Process Automation & System Integration", title: "System Integration", text: "Are core department systems integrated with other major Tasheer systems (Finance, HR, GRC, etc.)?", choices: STANDARD_CHOICES },
    
    // Area 3: Performance & Monitoring
    { id: "Q5", area: "3. Performance & Monitoring", title: "Digital Performance Dashboards", text: "Are digital dashboards or BI tools used to monitor real-time KPIs (e.g., SLA performance, cost efficiency, quality metrics)?", choices: STANDARD_CHOICES },
    { id: "Q6", area: "3. Performance & Monitoring", title: "Predictive Insights", text: "Is data used to create predictive insights, automated alerts, or AI-driven decision support (e.g., risk scoring, demand forecasting, resource optimization)?", choices: STANDARD_CHOICES },
    
    // Area 4: Policy & Procedures Completeness
    { id: "Q7", area: "4. Policy & Procedures Completeness", title: "Policies Documentation", text: "Are all department-specific policies and procedures (e.g., operational governance, ethics, data handling) documented, approved, and regularly updated?", choices: STANDARD_CHOICES },
    { id: "Q8", area: "4. Policy & Procedures Completeness", title: "Document Version Control", text: "Is there a version-controlled digital repository for all critical documents, contracts, and agreements?", choices: STANDARD_CHOICES },
    
    // Area 5: Digital Tools & Capabilities
    { id: "Q9", area: "5. Digital Tools & Capabilities", title: "Tool Utilization (Spend/Demand Analysis)", text: "Does the department use specialized digital tools for complex analytical tasks (e.g., Spend Analysis, Demand Forecasting, Resource Planning)?", choices: STANDARD_CHOICES },
    { id: "Q10", area: "5. Digital Tools & Capabilities", title: "Tool Utilization (Relationship Mgmt)", text: "Are digital tools/systems used to manage key relationships (e.g., Supplier Relationship Management, Customer Relationship Management, Partner Collaboration)?", choices: STANDARD_CHOICES },

    // Area 6: Compliance & Risk Management
    { id: "Q11", area: "6. Compliance & Risk Management", title: "Digital Compliance Tracking", text: "Are compliance audits and regulatory requirements tracked and managed digitally with corrective and preventative action (CAPA) workflows?", choices: STANDARD_CHOICES },
    { id: "Q12", area: "6. Compliance & Risk Management", title: "Digital Risk Register", text: "Is there a digital risk register for department-specific risks (e.g., operational, supplier, security) with alerts and mitigation tracking?", choices: STANDARD_CHOICES },
    
    // Area 7: Knowledge & Talent Management
    { id: "Q13", area: "7. Knowledge & Talent Management", title: "Training & Awareness", text: "Does the department deliver and track digital training programs (LMS-based) for policies, ethics, and system usage, with certification/testing?", choices: STANDARD_CHOICES },
    { id: "Q14", area: "7. Knowledge & Talent Management", title: "Knowledge Repository", text: "Is there a centralized, easily searchable, digital repository for templates, SOPs, lessons learned, and forms?", choices: STANDARD_CHOICES }
];

// --- Maturity Bands ---
const MATURITY_BANDS = [
    { name: "Level 1: Ad-hoc (0–25%)", range: [0, 25], description: "Operations are manual and fragmented. No defined service catalogue or workflow automation. Data is inconsistent and not digitized." },
    { name: "Level 2: Basic (26–50%)", range: [26, 50], description: "Some processes are documented, and partial automation exists. Limited integration between systems. Tracking relies on manual follow-up." },
    { name: "Level 3: Managed (51–75%)", range: [51, 75], description: "Processes are standardized and digitally tracked. Policies and contracts are version-controlled. KPIs are monitored periodically." },
    { name: "Level 4: Advanced (76–90%)", range: [76, 90], description: "Strong automation, end-to-end visibility, governed change control, and compliance tracking. Data is used for strategic decisions." },
    { name: "Level 5: Optimized (91–100%)", range: [91, 100], description: "Fully automated and AI-enhanced. Predictive analytics guide decisions. Continuous process improvement and strategic alignment with corporate digital governance." }
];

// --- Shared Folder Path ---
const EVIDENCE_SHARED_FOLDER_PATH = "file:///C:/folder1";