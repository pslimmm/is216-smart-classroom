## Developer Log
* Follow the format strictly for easy navigation of progress

### 23 October
Javier
- added search bar to TA submit, prof Review, Approve & Reject pages
- added a course page
- changed flow such that landing page -> login -> courses -> individualDashboard

### 14 October
Peter
- added authentication using supabase auth
- redesigned the login and registration page
- reworked the role based page access using sessions + role
- added a sidebar for better access to links and cleanliness of the UI overall
- fixed role based routing to allow nested routes like /ta/submit
- reworked alerts to allow for dynamic assignment of alert classes (success/danger)

### 10 October

Peter
- merged fix/nuxt-rewrite into main
- rewrote the codebase using Nuxt 4. This is to allow serverless functions within the same app,  automatic page routing, and auto import of all modules throughout the app
- rewrote the scripts in Vue files to use Composition API (Vue 3) instead of Options API (Vue 2) in order to future-proof code and have easier access to documentation and debugging
- renamed all files and routes so it matches the desired routes in the website and general naming conventions for routes
- added error.vue for custom error messages
- added middleware/role.js to manage all authorized routes for each role
- added composables/useRole.js to allow for global access of the "role" state
- added components/Navbar.vue, simplifying the previous role-based navbars implemented by Vinz enhancing component reusability
- created dev-logs.txt to separate app information in README.md and developer logs

Javier
- created Pages under branch feature/submit-classpart
      SubmitPage.vue
      RejectedPage.vue
      ReviewPage.vue
      ApprovedPage.vue
- linked all Pages via Vue Router
- verified nagivation routes /ta/submit, /prof/review, /prof/approve, /prof/rejected
- added button linking new sites from TA and prof navbars
- added new folder store with logs.js to locally add logs (to be removed once implement DB)

### 9 October
--
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
