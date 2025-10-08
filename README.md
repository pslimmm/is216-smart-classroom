# Smart Classroom Developer Log

This document tracks all development activities, updates, and decisions made for the **Smart Classroom Web Application** project.

---

## Tech Stack

- **Framework:** Nuxt 4.1.3
- **Build Tool:** Vite
- **Styling:** Bootstrap 5
- **Routing:** Built-in Nuxt routing based on vue-router
- **Version Control:** Git + GitHub

---

## Quick Start

Run this project locally (Type into your terminal):
npm install
npm run dev

## !!! Adding New Features !!!
DO NOT push directly to 'main' branch
    (This is to protect our past progress so far, and can rollback if things stop working. Basically our "last checkpoint")
Always create a new branch for each new feature, fix or update

1) To create a new branch
git checkout -b feature/name-of-new-feature

2) Ensure you are in the new branch. If yes then can start editing!
git branch

3) When you are done
git add .
git commit -m "Insert whatever message"
git push -u origin feature/name-of-new-feature

For Merging of branches into main, inform in the group chat!
The person responsible for merging will handle it

---

## Developer Log
* Follow the format strictly for easy navigation of progress

### 10 October

Peter
- xyz


Vinz
- xyz


Javier
- xyz


Chun Wai
- xyz


Yichen
- xyz



### 9 October

Peter
- xyz


Vinz
- xyz


Javier
- xyz


Chun Wai
- xyz


Yichen
- xyz



### 8 October

Peter
- Merged feature/new-pages into main

Vinz
- Added Bootstrap 5 integration
- Added Navbar for WelcomePage.vue
- Added Role-based NavBars:
    ProfNavBar.vue → for professor pages (ProfDashboard.vue, ProfReportDashboard.vue)
    TANavBar.vue → for TA pages (TeachingAssistantDashboard.vue, TAReports.vue)
    StudentNavBar.vue → for student pages (StudentDashboard.vue, MarketPlace.vue)
    All Navbars share consistent design (dark theme, sticky-top, responsive)
- Edited index.html → changed page title to Smart Classroom



### 7 October

Peter
- Created base folder structure:
- Initialized Vite + Vue project
- Setup .gitignore and repository configuration

Vinz
- Created Pages under branch feature/new-pages
    WelcomePage.vue
    LoginPage.vue
    RegisterPage.vue
    ProfDashboard.vue
    ProfReportDashboard.vue
    TeachingAssistantDashboard.vue
    StudentDashboard.vue
- Linked all Pages via Vue Router
- Verified navigation routes /, /login, /register, /prof, /ta, /student

* Pages functional but incomplete — to be redesigned for UI consistency
* Added inline comments for clarity and logic explanation