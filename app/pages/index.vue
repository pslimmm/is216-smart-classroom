<script setup>

</script>

<!-- Will work on this again, ran out of creativity -->

<template>
  <main>
    <header class="border-bottom bg-gradient-primary">
      <div class="container d-flex justify-content-start align-items-center py-5 gap-3">
        <i class="bi bi-mortarboard text-white display-1"></i>
        <h1 class="display-1 text-white fw-bold pt-1">Smart Classroom</h1>
      </div>
    </header>
    
    <section class="pt-3 pb-4 mb-1 bg-body-secondary">
      <div class="container">
        <h1 class="display-4 fw-bold my-3">
          Empower Your Learning with <span class="text-primary">Smart Classroom</span>
        </h1>
        <p class="fs-3 lead text-secondary my-5">
          Join thousands of students and educators in a revolutionary learning experience. Expert-led courses, flexible
          schedules, and interactive content designed for your success.
        </p>

        <div class="d-flex flex-wrap gap-3 my-5">
          <NuxtLink to="/auth" class="btn btn-primary btn-lg px-4 py-3">Get Started</NuxtLink>
          <NuxtLink to="/" class="btn btn-outline-primary btn-lg px-4 py-3">Watch Demo</NuxtLink>
        </div>

        <div class="row text-center g-3 mb-4">
          <div class="col-md-4">
            <div class="fs-2 fw-bold text-body mb-1">50K+</div>
            <div class="text-secondary">Active Students</div>
          </div>
          <div class="col-md-4">
            <div class="fs-2 fw-bold text-body mb-1">1000+</div>
            <div class="text-secondary">Courses</div>
          </div>
          <div class="col-md-4">
            <div class="fs-2 fw-bold text-body mb-1">98%</div>
            <div class="text-secondary">Success Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Option 1 -->
    <!-- <section class="px-3 py-4 mt-3">
    <div>
      <div class="container bg-body-secondary rounded-4" style="transform: rotate(90deg);"></div>
      <div class="p-4 p-md-5 rounded-4 text-white bg-gradient-primary">

        <div class="d-flex align-items-start gap-4 p-3 bg-white bg-opacity-10 rounded-3 mb-4">
          <div class="bg-white bg-opacity-50 p-3 rounded-2">
            <i class="bi bi-people display-4 text-primary"></i>
          </div>
          <div>
            <h4 class="fw-bold fs-3 text-white mb-1">Professors</h4>
            <ul class="text-white-50 fs-5 mb-0">
              <li>Review and approve participations</li>
              <li>Track class engagement</li>
            </ul>
          </div>
        </div>

        <div class="d-flex align-items-start gap-4 p-3 bg-white bg-opacity-10 rounded-3 mb-4">
          <div class="bg-white bg-opacity-50 p-3 rounded-2">
            <i class="bi bi-graph-up-arrow display-4 text-success"></i>
          </div>
          <div>
            <h4 class="fw-bold fs-3 text-white mb-1">Students</h4>
            <ul class="text-white-50 fs-5 mb-0">
              <li>Record class participations</li>
              <li>Track your grade projections</li>
            </ul>
          </div>
        </div>

        <div class="d-flex align-items-start gap-4 p-3 bg-white bg-opacity-10 rounded-3">
          <div class="bg-white bg-opacity-50 p-3 rounded-2">
            <i class="bi bi-award display-4 text-warning"></i>
          </div>
          <div>
            <h4 class="fw-bold fs-3 text-white mb-1">Teaching Assistant</h4>
            <ul class="text-white-50 fs-5 mb-0">
              <li>Record student participations</li>
              <li>Assist with tracking</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </section> -->

    <!-- Option 2 -->
    <section class="px-3 pt-4 mt-5">
      <div class="container bg-body-secondary rounded-4" style="transform: rotate(3deg);">
        <div class="p-4 p-md-5 rounded-4 text-white bg-gradient-primary" style="transform: rotate(-3deg);">

          <div class="d-flex align-items-start gap-4 p-3 bg-white bg-opacity-10 rounded-3 mb-4">
            <div class="bg-white bg-opacity-25 p-3 rounded-2">
              <i class="bi bi-people display-4 text-white"></i>
            </div>
            <div>
              <h4 class="fw-bold fs-3 text-white mb-1">Professors</h4>
              <ul class="text-white-50 fs-5 mb-0">
                <li>Review and approve participations</li>
                <li>Track class engagement</li>
              </ul>
            </div>
          </div>

          <div class="d-flex align-items-start gap-4 p-3 bg-white bg-opacity-10 rounded-3 mb-4">
            <div class="bg-white bg-opacity-25 p-3 rounded-2">
              <i class="bi bi-graph-up-arrow display-4 text-success"></i>
            </div>
            <div>
              <h4 class="fw-bold fs-3 text-white mb-1">Students</h4>
              <ul class="text-white-50 fs-5 mb-0">
                <li>Record class participations</li>
                <li>Track your grade projections</li>
              </ul>
            </div>
          </div>

          <div class="d-flex align-items-start gap-4 p-3 bg-white bg-opacity-10 rounded-3">
            <div class="bg-white bg-opacity-25 p-3 rounded-2">
              <i class="bi bi-award display-4 text-warning"></i>
            </div>
            <div>
              <h4 class="fw-bold fs-3 text-white mb-1">Teaching Assistant</h4>
              <ul class="text-white-50 fs-5 mb-0">
                <li>Record student participations</li>
                <li>Assist with tracking</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  </main>
</template>
