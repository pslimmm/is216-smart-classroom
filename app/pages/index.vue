<script setup>

const { role } = useRole();

</script>

<!-- Will work on this again, ran out of creativity -->

<template>
  <section class="bg-primary bg-gradient-primary text-white py-5 px-3 text-center">
    <div class="container">
      <div class="mb-4 d-flex justify-content-center">
        <svg width="80" height="80" fill="currentColor" class="bi bi-mortarboard"></svg>
      </div>
      <!-- graduation hat bootstrap icon -->
      <i class="bi bi-mortarboard" style="font-size: 5rem;"></i>
      <h1 class="display-4 fw-bold mb-4">Smart Classroom</h1>
      <p class="lead mb-4 mx-auto" style="max-width: 720px;">
        Transform class participation into achievement. Track, reward, and motivate students with our comprehensive
        classroom management platform.
      </p>
      <NuxtLink to="/auth" class="btn btn-success btn-lg px-4 py-3">Get Started</NuxtLink>
    </div>
  </section>

  <section class="py-5 px-3">
    <div class="container">
      <h2 class="text-center display-5 fw-bold mb-5">Features for Everyone</h2>
      <div class="row g-4">

        <!-- Card: Professors -->
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border rounded">
            <div class="card-body text-center p-4">
              <div class="mb-3 d-flex justify-content-center">
                <!-- professor bootstrap icon -->
                <i class="bi bi-people text-primary display-3"></i>
              </div>
              <h5 class="card-title fw-bold mb-3">For Professors</h5>
              <ul class="list-unstyled text-muted text-start">
                <li>• Review and approve participations</li>
                <li>• Award coins to students</li>
                <li>• Create marketplace rewards</li>
                <li>• Track class engagement</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Card: Students -->
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border rounded">
            <div class="card-body text-center p-4">
              <div class="mb-3 d-flex justify-content-center">
                <!-- student bootstrap icon -->
                <i class="bi bi-graph-up-arrow text-success display-3"></i>
              </div>
              <h5 class="card-title fw-bold mb-3">For Students</h5>
              <ul class="list-unstyled text-muted text-start">
                <li>• Record class participations</li>
                <li>• Track your grade projections</li>
                <li>• Earn coins for engagement</li>
                <li>• Claim exciting rewards</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Card: TAs -->
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border rounded">
            <div class="card-body text-center p-4">
              <div class="mb-3 d-flex justify-content-center">
                <!-- ta bootstrap icon -->
                <i class="bi bi-award text-warning display-3"></i>
              </div>
              <h5 class="card-title fw-bold mb-3">For TAs</h5>
              <ul class="list-unstyled text-muted text-start">
                <li>• Record student participations</li>
                <li>• Monitor class activity</li>
                <li>• Assist with tracking</li>
                <li>• Support student success</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Need to see if still want to keep this, seems redundant with Get Started at the beginning -->
  <!-- maybe add something different? -->

  <!-- <section class="bg-success text-white py-5 px-3 text-center">
    <div class="container">
      <h2 class="display-6 fw-bold mb-4">Ready to Transform Your Classroom?</h2>
      <a href="/auth" class="btn btn-light btn-lg px-4 py-3">Sign Up Now</a>
    </div>
  </section> -->
</template>
