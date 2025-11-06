<script setup>

</script>

<!-- Will work on this again, ran out of creativity -->

<template>
  <main>
    <header class="border-bottom bg-navy">
      <div class="container hero-header py-5 text-white">
        <i class="bi bi-mortarboard hero-icon" aria-hidden="true"></i>
        <h1 class="hero-title fw-bold pt-1 mb-0">ClassParti</h1>
      </div>
    </header>
    
    <section class="pt-3 pb-4 mb-1 bg-body-secondary">
      <div class="container">
        <h1 class="hero-heading fw-bold my-3">
          Empower Your Learning with <span class="text-navy">ClassParti</span>
        </h1>
        <p class="hero-lead text-secondary my-5">
          Join thousands of students and educators in a revolutionary learning experience. Expert-led courses, flexible
          schedules, and interactive content designed for your success.
        </p>

        <div class="d-flex flex-wrap gap-3 my-5">
          <NuxtLink to="/auth" class="btn btn-navy fw-semibold btn-lg px-4 py-3">Get Started</NuxtLink>
          <NuxtLink to="/" class="btn btn-outline-navy fw-semibold btn-lg px-4 py-3">Watch Demo</NuxtLink>
        </div>

        <div class="row text-center g-3 mb-4">
          <div class="col-12 col-md-4">
            <div class="hero-metric fw-bold text-body mb-1">50K+</div>
            <div class="text-secondary">Active Students</div>
          </div>
          <div class="col-12 col-md-4">
            <div class="hero-metric fw-bold text-body mb-1">1000+</div>
            <div class="text-secondary">Courses</div>
          </div>
          <div class="col-12 col-md-4">
            <div class="hero-metric fw-bold text-body mb-1">98%</div>
            <div class="text-secondary">Success Rate</div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-3 pt-4 mt-5">
      <div class="container position-relative overflow-hidden">
        <div class="hero-tilt bg-body-secondary rounded-4">
          <div class="hero-tilt-inner p-4 p-md-5 rounded-4 text-white bg-navy">

          <div class="d-flex flex-column flex-md-row align-items-start gap-4 p-3 bg-white bg-opacity-10 rounded-3 mb-4">
            <div class="icon-tile">
              <i class="bi bi-people text-navy"></i>
            </div>
            <div class="flex-grow-1">
              <h4 class="fw-bold text-white mb-1">Professors</h4>
              <ul class="text-white hero-list mb-0">
                <li>Review and approve participations</li>
                <li>Track class engagement</li>
              </ul>
            </div>
          </div>

          <div class="d-flex flex-column flex-md-row align-items-start gap-4 p-3 bg-white bg-opacity-10 rounded-3 mb-4">
            <div class="icon-tile">
              <i class="bi bi-graph-up-arrow text-success"></i>
            </div>
            <div class="flex-grow-1">
              <h4 class="fw-bold text-white mb-1">Students</h4>
              <ul class="text-white hero-list mb-0">
                <li>Record class participations</li>
                <li>Track your grade projections</li>
              </ul>
            </div>
          </div>

          <div class="d-flex flex-column flex-md-row align-items-start gap-4 p-3 bg-white bg-opacity-10 rounded-3">
            <div class="icon-tile">
              <i class="bi bi-award text-warning"></i>
            </div>
            <div class="flex-grow-1">
              <h4 class="fw-bold text-white mb-1">Teaching Assistant</h4>
              <ul class="text-white hero-list mb-0">
                <li>Record student participations</li>
                <li>Assist with tracking</li>
              </ul>
            </div>
          </div>

          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.hero-icon {
  font-size: clamp(3rem, 6vw, 4.75rem);
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
}

.hero-heading {
  font-size: clamp(2.25rem, 4vw, 3.25rem);
  text-wrap: balance;
}

.hero-lead {
  font-size: clamp(1.25rem, 2.2vw, 1.75rem);
  max-width: 60ch;
}

.hero-metric {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.hero-tilt {
  border-radius: 1.5rem;
  transform: none;
  transition: transform 0.4s ease;
}

.hero-tilt-inner {
  border-radius: inherit;
  transform: none;
}

.icon-tile {
  background: rgba(255, 255, 255, 0.75);
  padding: var(--space-2);
  border-radius: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
}

.icon-tile i {
  line-height: 1;
}

.hero-list {
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  padding-left: 1.25rem;
}

@media (min-width: 768px) {
  .hero-tilt {
    transform: rotate(2.75deg);
  }

  .hero-tilt-inner {
    transform: rotate(-2.75deg);
  }
}
</style>
