# Tasheer DMI - Copilot Instructions

This document provides essential context for AI coding agents working in the Tasheer Digital Maturity Index (DMI) assessment project.

## Project Overview

Tasheer DMI is a web-based assessment tool for measuring digital maturity across different departments. The application features:
- Department-specific assessment questionnaires
- Real-time scoring and progress tracking
- Detailed final reports with maturity levels
- Local storage persistence

## Architecture & Key Components

### Core Files Structure
```
index.html                 # Login page & entry point
scripts/
  login_auth.js           # Authentication logic
  styles.css             # Global styles
pages/
  [department]/          # Department-specific assessment pages
    dmi_assessment_data.js    # Question data & scoring config
    dmi_assessment_logic.js   # Assessment engine
    dmi_assessment_styles.css # Department UI styles
```

### Data Flow
1. Users authenticate via `login_auth.js` with department-specific credentials
2. Department data loads from `dmi_assessment_data.js` (questions, scoring rules)
3. `dmi_assessment_logic.js` handles form generation, scoring, and reporting
4. User responses persist in LocalStorage with key pattern: `dmi_assessment_[department]`

## Key Patterns & Conventions

### Department Integration
- New departments are added to `DMI_DATA` object in `dmi_assessment_data.js`
- Each department follows standard structure with `maxScore`, `totalQuestions`, and `questions` array
- Questions are grouped by `area` for consistent UI organization

### Scoring System
- Each question uses `STANDARD_CHOICES` (1-5 scale)
- Maturity bands defined in `MATURITY_BANDS` constant:
  - Level 1: Ad-hoc (0-25%)
  - Level 2: Basic (26-50%)
  - Level 3: Managed (51-75%)
  - Level 4: Advanced (76-90%)
  - Level 5: Optimized (91-100%)

### UI/UX Patterns
- Live score updates on every question answer
- Area headers group related questions
- Consistent question structure: title, text, 5-point scale choices
- Progress tracking via answered/total questions count

## Common Development Tasks

### Adding New Department
1. Add department config to `DMI_DATA` in `dmi_assessment_data.js`
2. Create credentials in `login_auth.js` USERS array
3. Create department folder under `pages/`
4. Copy and customize assessment HTML template

### Modifying Questions
- Questions are defined in department-specific `dmi_assessment_data.js`
- Each question requires: `id`, `area`, `title`, `text`, and `choices`
- Use `STANDARD_CHOICES` for consistent scoring

### Local Development
- No build process required - pure HTML/JS/CSS
- Use local file server for testing
- LocalStorage persists between sessions