# Smart Classroom

This document tracks all development activities, updates, and decisions made for the **Smart Classroom Web Application** project.

---

## Tech Stack

- **Framework:** [Nuxt 4.1.3](https://nuxt.com/docs/4.x/guide)
- **Build Tool:** Vite in Nuxt
- **Styling:** [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- **Routing:** Built-in [Nuxt routing](https://nuxt.com/docs/4.x/getting-started/routing) based on vue-router
- **Version Control:** Git + GitHub

---

## Quick Start

Run this project locally (Type these into your terminal):
```
npm install
npm run dev
```
or if you are using pnpm (recommended)
```bash
pnpm i
pnpm dev
```

## !!! Adding New Features !!!
DO NOT push directly to 'main' branch
    (This is to protect our past progress so far, and can rollback if things stop working. Basically our "last checkpoint")
Always create a new branch for each new feature, fix or update

1) To create a new branch
```bash
git checkout -b feature/name-of-new-feature
```

2) Ensure you are in the new branch. If yes then can start editing!
```bash
git branch
```

3) When you are done
```bash
git add .
git commit -m "Insert whatever message"
git push -u origin feature/name-of-new-feature
```
For Merging of branches into main, inform in the group chat!
The person responsible for merging will handle it

---

