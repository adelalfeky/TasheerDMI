// dmi_assessment_data.js
// WARNING: This file contains the core logic and question data. 
// Do not share or expose this file directly to external parties.

const MAX_SCORE_PER_QUESTION = 5;
const TOTAL_QUESTIONS = 14;
const MAX_POSSIBLE_SCORE = TOTAL_QUESTIONS * MAX_SCORE_PER_QUESTION;
const STORAGE_KEY = 'dmiAssessmentSelections';

// Maturity Bands based on your data:
const maturityBands = [
    { range: [0, 25], name: "Level 1: Ad-hoc", description: "Procurement is manual and fragmented. No defined service catalogue or workflow automation. Policies and supplier data are inconsistent and not digitized." },
    { range: [26, 50], name: "Level 2: Basic", description: "Some processes are documented, and partial automation exists. Limited integration. Vendor tracking and approvals rely on manual follow-up." },
    { range: [51, 75], name: "Level 3: Managed", description: "Procurement is standardized and digitally tracked through ERP or e-Procurement tools. Policies and contracts are version-controlled. KPIs are monitored periodically." },
    { range: [76, 90], name: "Level 4: Advanced", description: "Procurement is integrated across systems. Dashboards and workflows are automated. SLA tracking, digital audits, and compliance alerts are operational." },
    { range: [91, 100], name: "Level 5: Optimized", description: "Procurement is fully automated and AI-enhanced. Predictive analytics guide sourcing decisions. Risk scoring and compliance are real-time." }
];

// Full set of questions and choices, structured with their Areas
const DMI_QUESTIONS = [
    {
        id: "Q1", area: "1. Service Catalogue", title: "Service Catalogue & Offering Definition",
        text: "Does the Procurement Department have a clear list (Service Catalogue) showing all the services it provides (e.g., vendor registration, sourcing, tenders, contracts)?",
        choices: [
            { value: 1, text: "1. Working on a service catalogue." },
            { value: 2, text: "2. Services are listed informally or partially documented." },
            { value: 3, text: "3. A basic service catalogue exists but is not updated or published." },
            { value: 4, text: "4. A formal, published service catalogue exists and is used by departments." },
            { value: 5, text: "5. Service catalogue is digital, integrated with ERP/ticketing, and regularly reviewed." }
        ]
    },
    {
        id: "Q2", area: "1. Service Catalogue", title: "Service Request & SLA Tracking",
        text: "How are procurement services requested, tracked, and reported by internal departments, and how are SLAs monitored?",
        choices: [
            { value: 1, text: "1. Manual email or paper-based requests, no SLA tracking." },
            { value: 2, text: "2. Basic tracking through Excel or manual logs." },
            { value: 3, text: "3. Requests handled via ERP or portal, limited SLA visibility." },
            { value: 4, text: "4. Fully digital workflow with SLA dashboards and reports." },
            { value: 5, text: "5. AI-driven ticketing and predictive SLA performance analytics." }
        ]
    },
    {
        id: "Q3", area: "2. Process Automation & System Integration", title: "Process Automation",
        text: "Which procurement processes (PR→PO→GR→Invoice) are automated through ERP or e-Procurement tools, and what percentage of transactions are fully digital vs. manual?",
        choices: [
            { value: 1, text: "1. Entirely manual process." },
            { value: 2, text: "2. Some steps (e.g., PR→PO) automated; rest manual." },
            { value: 3, text: "3. Most steps automated through ERP, occasional manual workarounds." },
            { value: 4, text: "4. Fully automated procurement cycle through ERP/e-Procurement tools." },
            { value: 5, text: "5. End-to-end automation with AI validation, exception handling, and RPA bots." }
        ]
    },
    {
        id: "Q4", area: "2. Process Automation & System Integration", title: "System Integration",
        text: "Are procurement systems integrated with Finance, HR, GRC, or Asset Management systems?",
        choices: [
            { value: 1, text: "1. No integration with other departments/systems." },
            { value: 2, text: "2. Occasional, manual data transfer between systems." },
            { value: 3, text: "3. Basic, one-way integration with Finance (e.g., PO to GL)." },
            { value: 4, text: "4. Bi-directional integration with key systems (Finance, HR) via batch or light API." },
            { value: 5, text: "5. Real-time bi-directional integration across all relevant core systems via APIs." }
        ]
    },
    {
        id: "Q5", area: "3. Data & Analytics", title: "Spend Analytics",
        text: "Is there an automated system for analyzing spend data (e.g., categories, savings, tail spend) to inform strategies?",
        choices: [
            { value: 1, text: "1. Manual data extraction and reporting in Excel." },
            { value: 2, text: "2. Basic reports generated from ERP, requiring manual cleanup." },
            { value: 3, text: "3. Dedicated spend cube tool with basic category visibility." },
            { value: 4, text: "4. Advanced spend analysis tool with clean data, dashboards, and opportunity identification." },
            { value: 5, text: "5. AI-driven predictive spend analysis integrated with budgeting and forecasting." }
        ]
    },

    {
        id: "Q6", area: "4. Sourcing & Contract Management", title: "E-Sourcing & Tendering",
        text: "How are Sourcing (RFQ/RFP) and Tendering activities managed and tracked?",
        choices: [
            { value: 1, text: "1. Manual paper-based process." },
            { value: 2, text: "2. Documents managed via email/shared drive." },
            { value: 3, text: "3. E-sourcing tool used for basic bid collection and comparison." },
            { value: 4, text: "4. Digital platform with automated bid analysis and supplier communication." },
            { value: 5, text: "5. Digital platform with automated bid analysis, real-time negotiation support, and AI-driven supplier selection." }
        ]
    },
    {
        id: "Q7", area: "4. Sourcing & Contract Management", title: "Contract Management",
        text: "How are contracts managed (drafting, storage, version control, obligation tracking, and renewal)?",
        choices: [
            { value: 1, text: "1. Contracts stored in shared folders; no system for versioning or tracking." },
            { value: 2, text: "2. Central repository established but manual version control." },
            { value: 3, text: "3. CLM system used for basic document storage and access control." },
            { value: 4, text: "4. Digital CLM solution with automated versioning and basic obligation/renewal alerts." },
            { value: 5, text: "5. Digital CLM solution with automated obligation tracking, AI-driven risk scoring, and automated renewal alerts." }
        ]
    },
    {
        id: "Q8", area: "5. Supplier Management", title: "Supplier Relationship Management (SRM)",
        text: "How is supplier data (onboarding, performance, compliance) managed and monitored?",
        choices: [
            { value: 1, text: "1. Supplier data is manually collected and stored in Excel." },
            { value: 2, text: "2. Basic vendor master data in ERP, but performance tracking is manual." },
            { value: 3, text: "3. Digital vendor portal for self-service registration; performance tracked in a basic system." },
            { value: 4, text: "4. Digital SRM platform with real-time performance dashboards and compliance tracking." },
            { value: 5, text: "5. Digital SRM platform with real-time performance dashboards, AI-driven risk monitoring, and automated onboarding/offboarding." }
        ]
    },
    {
        id: "Q9", area: "6. GRC & Risk", title: "Policy & Compliance Management",
        text: "Are procurement policies, ethics, and anti-fraud guidelines digitally accessible, managed, and monitored for compliance?",
        choices: [
            { value: 1, text: "1. Policies are only available on paper or shared drive; no systematic compliance monitoring." },
            { value: 2, text: "2. Policies are digital, but adherence is manually checked post-transaction." },
            { value: 3, text: "3. Compliance checks integrated into key transaction workflows (e.g., approval limits)." },
            { value: 4, text: "4. Digital GRC platform with automated policy enforcement and continuous monitoring." },
            { value: 5, text: "5. Digital GRC platform with automated policy enforcement, continuous monitoring, and real-time compliance alerts." }
        ]
    },
    {
        id: "Q11", area: "6. GRC & Risk", title: "Cybersecurity & Data Protection",
        text: "Are procurement systems and data protected according to established corporate cybersecurity standards?",
        choices: [
            { value: 1, text: "1. Basic protection with no specific procurement system controls." },
            { value: 2, text: "2. Standard corporate security applied; data is backed up manually." },
            { value: 3, text: "3. Systems follow security policies; regular vulnerability assessments are performed." },
            { value: 4, text: "4. Advanced security architecture, continuous threat monitoring, and automated access controls." },
            { value: 5, text: "5. AI-enhanced security posture with behavioral analytics and automated incident response." }
        ]
    },
    {
        id: "Q12", area: "6. GRC & Risk", title: "Audit Management",
        text: "How are internal and external audits for procurement managed, tracked, and followed up on (CAPA)?",
        choices: [
            { value: 1, text: "1. Manual audit process using paper or Excel." },
            { value: 2, text: "2. Audits recorded digitally but follow-ups are manual." },
            { value: 3, text: "3. Audit workflows tracked through a basic system (e.g., shared ticketing)." },
            { value: 4, text: "4. Full digital workflow with CAPA tracking and dashboards." },
            { value: 5, text: "5. AI-driven audit management with predictive non-compliance detection." }
        ]
    },
    {
        id: "Q13", area: "6. GRC & Risk", title: "Risk Register",
        text: "Is there a digital risk register for supplier/procurement risks with alerts and mitigation tracking?",
        choices: [
            { value: 1, text: "1. Manual and not formal risk register." },
            { value: 2, text: "2. Manual register in Excel." },
            { value: 3, text: "3. Digital register without alerts." },
            { value: 4, text: "4. Integrated risk register with alerts and tracking." },
            { value: 5, text: "5. AI-enabled risk register with predictive risk scoring and dashboards." }
        ]
    },
    {
        id: "Q14", area: "7. Tools & Training", title: "Knowledge Repository",
        text: "Is there a centralized digital repository for templates, SOPs, and vendor forms?",
        choices: [
            { value: 1, text: "1. Files scattered in local drives." },
            { value: 2, text: "2. Shared folder without version control." },
            { value: 3, text: "3. Central repository with limited access control." },
            { value: 4, text: "4. Version-controlled digital repository with access tracking." },
            { value: 5, text: "5. Intelligent knowledge portal with search, tagging, and update automation." }
        ]
    }
];