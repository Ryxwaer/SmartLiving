<template>
  <div class="bg-gray-800 min-h-screen flex flex-col">
    <header class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <nuxt-link to="/" class="text-xl font-bold">{{ user }}</nuxt-link>

        <div v-if="refreshToken" class="flex items-center space-x-4">
          <!-- Links to other pages -->
          <nuxt-link v-if="currentRoute !== '/devices'" to="/devices">Select device</nuxt-link>
          <nuxt-link v-if="currentRoute !== '/'" to="/">Dashboard</nuxt-link>

          <!-- Logout button -->
          <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
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
// Set up reactive variables for the route and refreshToken
const router = useRouter();
const route = useRoute();
const currentRoute = ref(route.path);
const refreshToken = useCookie('refreshToken');
const data = useCookie('data');
const user = ref(data.value?.user);

const rippleBackground = ref(null);

// Initialize user data if not already set
if (!user) {
  user.value = 'Login required';
}

// Watch for route changes to update currentRoute
watchEffect(() => {
  currentRoute.value = route.path;
  user.value = data.value ? data.value?.user : 'Login required';
});

// Logout function to clear accessToken and redirect to login
const logout = () => {
  // Clear user data
  refreshToken.value = null;
  data.value = null;
  // Redirect to the login page
  router.push('/login');
}

onMounted(() => {
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
      const isMobile = window.innerWidth <= 768;

      $(rippleBackground.value).ripples({
        resolution: isMobile ? 128 : 320,
        dropRadius: isMobile ? 40 : 32,
        perturbance: isMobile ? 0.05 : 0.1,
      });
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