// dmi_assessment_data.js

// --- Global Constants ---
const STORAGE_KEY_PREFIX = "dmi_assessment_";
const DEFAULT_DEPARTMENT = "Business Development";

// Standard choices (5 points max per question) are defined once for consistency.
const STANDARD_CHOICES = [
    { value: 1, text: "1. Ad-hoc effort; entirely manual or unstructured." },
    { value: 2, text: "2. Partial documentation or isolated basic automation." },
    { value: 3, text: "3. Standardized/documented processes; 50-75% automated/tracked digitally." },
    { value: 4, text: "4. Full digital workflow; integrated systems, high automation (75%+)." },
    { value: 5, text: "5. Intelligent automation with AI/Predictive analytics; continuous optimization." }
];

// --- Maturity Bands (Same across all departments based on analysis) ---
const MATURITY_BANDS = [
    { name: "Level 1: Ad-hoc (0–25%)", range: [0, 25], description: "Operations are manual and fragmented. No defined service catalogue or workflow automation. Data is inconsistent and not digitized." },
    { name: "Level 2: Basic (26–50%)", range: [26, 50], description: "Some processes are documented, and partial automation exists. Limited integration between systems. Tracking relies on manual follow-up." },
    { name: "Level 3: Managed (51–75%)", range: [51, 75], description: "Processes are standardized and digitally tracked. Policies and contracts are version-controlled. KPIs are monitored periodically." },
    { name: "Level 4: Advanced (76–90%)", range: [76, 90], description: "Processes are integrated across systems. Data, dashboards, and workflows are automated. Compliance alerts and digital audits are operational." },
    { name: "Level 5: Optimized (91–100%)", range: [91, 100], description: "Fully automated and AI-enhanced. Predictive analytics guide decisions. Risk scoring and compliance are real-time. Continuous improvement." }
];

// --- Department-Specific Data Structure ---
const DMI_DATA = {
    "Business Development": {
        maxScore: 80, // 16 questions * 5
        totalQuestions: 16,
        maturityBands: MATURITY_BANDS,
        questions: [
            { id: "BD_Q1", area: "Service Catalogue & Offering Definition", title: "Service Catalogue", text: "Do you maintain a Business Development Service Catalogue describing available services, SLAs, and responsible owners?", choices: STANDARD_CHOICES },
            { id: "BD_Q2", area: "Service Catalogue & Offering Definition", title: "Documentation of BD Services", text: "What percentage of BD services are fully documented with clear scope, owners, KPIs, and workflows?", choices: STANDARD_CHOICES },
            { id: "BD_Q3", area: "Service Automation Coverage", title: "Automation of BD Processes", text: "What percentage of BD processes (CRM data sync, lead scoring, proposal reminders, client follow-ups, reporting) are automated?", choices: STANDARD_CHOICES },
            { id: "BD_Q4", area: "Service Automation Coverage", title: "Workflow Integration", text: "Are BD workflows integrated across CRM, ERP, and analytics platforms (e.g., Salesforce → ERP → Power BI)?", choices: STANDARD_CHOICES },
            { id: "BD_Q5", area: "Workflow, Monitoring & Integration", title: "Performance Monitoring", text: "Are monitoring mechanisms in place for BD performance (pipeline health, conversion rate, client retention)?", choices: STANDARD_CHOICES },
            { id: "BD_Q6", area: "Workflow, Monitoring & Integration", title: "Feedback & Predictive Insights", text: "Do you have feedback loops (e.g., churn alerts, tender outcome prediction, opportunity scoring)?", choices: STANDARD_CHOICES },
            { id: "BD_Q7", area: "Policies & Procedures Documentation Completeness", title: "Policies & Procedures", text: "Are BD policies (governance, data privacy, sales ethics, bid management) documented, approved, and regularly updated?", choices: STANDARD_CHOICES },
            { id: "BD_Q8", area: "Policies & Procedures Documentation Completeness", title: "Documentation Gap Analysis", text: "Do you maintain a gap analysis of documented vs. missing BD procedures?", choices: STANDARD_CHOICES },
            { id: "BD_Q9", area: "Policies & Procedures Documentation Completeness", title: "Policies Accessibility", text: "Are all BD policies accessible through a shared knowledge base (e.g., intranet, SharePoint)?", choices: STANDARD_CHOICES },
            { id: "BD_Q10", area: "Runbooks & Standard Operating Procedures (SOPs)", title: "SOPs/Runbooks Availability", text: "Are SOPs/runbooks available for recurring BD activities (e.g., client onboarding, lead follow-up, CRM data entry)?", choices: STANDARD_CHOICES },
            { id: "BD_Q11", area: "Runbooks & Standard Operating Procedures (SOPs)", title: "SOPs Review & Update", text: "Are SOPs regularly reviewed and updated to reflect new tools, market practices, and lessons learned?", choices: STANDARD_CHOICES },
            { id: "BD_Q12", area: "Compliance & Policy Adoption", title: "Compliance Measurement", text: "Do you measure compliance with BD-related standards (data privacy, customer communication ethics, approval workflows)?", choices: STANDARD_CHOICES },
            { id: "BD_Q13", area: "Compliance & Policy Adoption", title: "Workflow Compliance", text: "What percentage of BD activities follow documented workflows (e.g., lead qualification, proposal approval, client onboarding)?", choices: STANDARD_CHOICES },
            { id: "BD_Q14", area: "Compliance & Policy Adoption", title: "Training & Certification", text: "Are BD staff trained and certified in data privacy, proposal compliance, and CRM usage policies?", choices: STANDARD_CHOICES },
            { id: "BD_Q15", area: "Knowledge Repository & Templates", title: "Knowledge Base Location", text: "Where is the BD knowledge base hosted, and what templates exist (RFP templates, proposal decks, customer profiles, success stories)?", choices: STANDARD_CHOICES },
            { id: "BD_Q16", area: "Knowledge Repository & Templates", title: "Knowledge Materials Update", text: "Are knowledge materials updated after project delivery, client meetings, or bid submissions?", choices: STANDARD_CHOICES }
        ]
    },
    "Product Management": {
        maxScore: 75, // 15 questions * 5
        totalQuestions: 15,
        maturityBands: MATURITY_BANDS,
        questions: [
            { id: "PM_Q1", area: "Service Catalogue & Offering Definition", title: "Service Catalogue Definition", text: "Does the Product Department maintain a formal service catalogue listing all product-related services and their owners?", choices: STANDARD_CHOICES },
            { id: "PM_Q2", area: "Service Catalogue & Offering Definition", title: "Request & Workflow Tracking", text: "How are product requests, enhancements, and releases submitted and tracked?", choices: STANDARD_CHOICES },
            { id: "PM_Q3", area: "Service Automation Coverage", title: "Automation of Product Lifecycle", text: "What percentage of the product lifecycle (requirement → design → release → feedback) is automated?", choices: STANDARD_CHOICES },
            { id: "PM_Q4", area: "Service Automation Coverage", title: "System Integration", text: "Are product systems integrated with development, QA, operations, and client systems?", choices: STANDARD_CHOICES },
            { id: "PM_Q5", area: "Workflow, Monitoring & Integration", title: "Performance Monitoring & Analytics", text: "How is product performance (releases, quality, client satisfaction) monitored?", choices: STANDARD_CHOICES },
            { id: "PM_Q6", area: "Workflow, Monitoring & Integration", title: "Client Feedback Integration", text: "Is client feedback automatically linked to product updates or backlog?", choices: STANDARD_CHOICES },
            { id: "PM_Q7", area: "Policies & Procedures Documentation Completeness", title: "Policy & Governance Documentation", text: "Are product management policies (governance, testing, change control) documented and updated?", choices: STANDARD_CHOICES },
            { id: "PM_Q8", area: "Policies & Procedures Documentation Completeness", title: "Documentation Gap Analysis", text: "Do you maintain a gap analysis of documented vs. missing product procedures?", choices: STANDARD_CHOICES },
            { id: "PM_Q9", area: "Runbooks & Standard Operating Procedures (SOPs)", title: "SOPs/Runbooks Availability", text: "Are SOPs/runbooks available for recurring product management activities (e.g., sprint review, release checklist)?", choices: STANDARD_CHOICES },
            { id: "PM_Q10", area: "Runbooks & Standard Operating Procedures (SOPs)", title: "SOPs Review & Update", text: "Are runbooks tested and updated regularly to reflect new tools, product versions, and lessons learned?", choices: STANDARD_CHOICES },
            { id: "PM_Q11", area: "Compliance & Policy Adoption", title: "Compliance Measurement", text: "Do you measure compliance with product management standards (e.g., ISO 9001, Agile/Scrum governance)?", choices: STANDARD_CHOICES },
            { id: "PM_Q12", area: "Compliance & Policy Adoption", title: "Workflow Compliance", text: "What percentage of product activities (requirements, releases, testing) follow documented workflows?", choices: STANDARD_CHOICES },
            { id: "PM_Q13", area: "Compliance & Policy Adoption", title: "Training & Certification", text: "Are team members trained and certified in Agile, Scrum, product governance, and client communication policies?", choices: STANDARD_CHOICES },
            { id: "PM_Q14", area: "Knowledge Repository & Templates", title: "Knowledge Base Location", text: "Where is the product management knowledge base hosted, and what templates/playbooks exist (e.g., PRD templates, release notes)?", choices: STANDARD_CHOICES },
            { id: "PM_Q15", area: "Knowledge Repository & Templates", title: "Knowledge Materials Update", text: "Are knowledge materials updated after project delivery, client meetings, or bid submissions?", choices: STANDARD_CHOICES }
        ]
    },
    "Marketing": {
        maxScore: 60, // 12 questions * 5
        totalQuestions: 12,
        maturityBands: MATURITY_BANDS,
        questions: [
            { id: "MKT_Q1", area: "Service Catalogue & Offering Definition", title: "Service Catalogue Definition", text: "Do you maintain a Marketing & Communications Service Catalogue describing all available services, SLAs, and responsible owners?", choices: STANDARD_CHOICES },
            { id: "MKT_Q2", area: "Service Catalogue & Offering Definition", title: "Service Documentation Completeness", text: "What percentage of marketing and communication services are fully documented with scope, workflows, owners, KPIs, and SLAs?", choices: STANDARD_CHOICES },
            { id: "MKT_Q3", area: "Service Automation Coverage", title: "Service Automation Coverage", text: "What percentage of marketing operations are automated (e.g., email campaigns, social media scheduling, lead nurturing)?", choices: STANDARD_CHOICES },
            { id: "MKT_Q4", area: "Service Automation Coverage", title: "Workflow Integration", text: "Are marketing and communications workflows integrated across systems (e.g., CRM, ERP, CMS, and analytics platforms)?", choices: STANDARD_CHOICES },
            { id: "MKT_Q5", area: "Workflow, Monitoring & Integration", title: "Performance Monitoring", text: "Are monitoring mechanisms in place for campaign performance, engagement rates, and communication responsiveness?", choices: STANDARD_CHOICES },
            { id: "MKT_Q6", area: "Workflow, Monitoring & Integration", title: "Feedback & Sentiment Insights", text: "Do you have automated systems for collecting and analyzing client feedback and sentiment across channels?", choices: STANDARD_CHOICES },
            { id: "MKT_Q7", area: "Policies & Procedures Documentation Completeness", title: "Brand & Communication Policies", text: "Are brand identity, communication tone, social media usage, and compliance policies documented and updated?", choices: STANDARD_CHOICES },
            { id: "MKT_Q8", area: "Policies & Procedures Documentation Completeness", title: "Policies & Procedures Documentation Completeness", text: "Do you maintain a gap analysis of documented vs. missing marketing and communication procedures?", choices: STANDARD_CHOICES },
            { id: "MKT_Q9", area: "Compliance & Policy Adoption", title: "Policies Accessibility", text: "Are all marketing and communication policies accessible through a shared knowledge base (e.g., intranet, Confluence, or SharePoint)?", choices: STANDARD_CHOICES },
            { id: "MKT_Q10", area: "Runbooks & Standard Operating Procedures (SOPs)", title: "SOPs/Runbooks Availability", text: "Are SOPs/runbooks available for recurring marketing and communication activities (e.g., campaign setup, media release, content approval)?", choices: STANDARD_CHOICES },
            { id: "MKT_Q11", area: "Compliance & Policy Adoption", title: "Compliance & Policy Adoption", text: "What percentage of marketing and communication activities follow documented workflows (e.g., campaign approval, content review)?", choices: STANDARD_CHOICES },
            { id: "MKT_Q12", area: "Knowledge Repository & Templates", title: "Knowledge Repository & Templates", text: "Where is the Marketing & Communications knowledge base hosted, and what templates exist (campaign briefs, content calendars, brand decks)?", choices: STANDARD_CHOICES }
        ]
    }
};