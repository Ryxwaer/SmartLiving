<template>
  <div class="bg-gray-800 min-h-screen flex flex-col">
    <header class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <AuthState v-slot="{ loggedIn, user }">
          <nuxt-link to="/" class="text-xl font-bold">{{ loggedIn ? user.userName : 'Login required' }}</nuxt-link>

          <div v-if="loggedIn" class="flex items-center space-x-4">
            <!-- Links to other pages -->
            <nuxt-link v-if="route.path !== '/devices'" to="/devices"> Select device </nuxt-link>
            <!-- <nuxt-link v-if="currentRoute !== '/'" to="/">Dashboard</nuxt-link> -->

            <!-- Logout button -->
            <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </div>
        </AuthState>
      </div>
    </header>

    <div class="page-background flex-1 flex items-start justify-center p-12 md:p-20 lg:p-32" ref="rippleBackground">
      <slot />
    </div>

    <footer class="bg-gray-800 text-white p-4 mt-6">
      <div class="container mx-auto text-center">
        © 2024 Server on/off controller
      </div>
    </footer>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

const { loggedIn, user, session, clear } = useUserSession();

const rippleBackground = ref(null);

// Logout function to clear accessToken and redirect to login
const logout = () => {
  const deviceList = useCookie('deviceList');
  deviceList.value = null;
  clear();
  // Redirect to the login page
  router.push('/login');
};

onMounted(() => {
  if (loggedIn) {
    // Extend session expiration by 1 month (in milliseconds)
    session.expiresAt = Date.now() + 60 * 60 * 24 * 30 * 1000;
  }

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  loadScript('/js/jquery.ripples.js')
    .then(() => {
      const $rippleBackground = $(rippleBackground.value);
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth <= 768;

      $rippleBackground.ripples({
        resolution: isMobile ? 128 : 320,
        dropRadius: isMobile ? 40 : 32,
        perturbance: isMobile ? 0.05 : 0.1,
      });

      // Function to generate random positions within the viewport
      const getRandomPosition = () => {
        const x = Math.random() * viewportWidth;
        const y = Math.random() * viewportHeight;
        return { x, y };
      };

      // Trigger two drops after initializing the ripple effect
      const drop1 = getRandomPosition();
      const drop2 = getRandomPosition();

      // Trigger the drops (x, y, radius, strength)
      $rippleBackground.ripples('drop', drop1.x, drop1.y, isMobile ? 35 : 50, isMobile ? 0.015 : 0.02);
      setTimeout(() => {
        $rippleBackground.ripples('drop', drop2.x, drop2.y, isMobile ? 15 : 50, isMobile ? 0.03 : 0.02);
      }, 300);
    })
    .catch(error => console.error('Failed to load the ripples script:', error));
});
</script>

<style scoped>
.page-background {
  background-image: url('/bg.png');
  background-size: cover;
  background-position: center;
}
</style>