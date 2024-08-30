<template>
  <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="email" type="email" id="email" placeholder="Email" required
          class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input v-model="password" type="password" id="password" placeholder="Password" required
          class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" :disabled="loading"
        class="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
        <svg v-if="loading" class="animate-spin h-5 w-5 mr-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span v-else>Login</span>
      </button>
    </form>
  </div>
</template>

<script setup>
const { fetch } = useUserSession();

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const login = async () => {
  loading.value = true; // Start loading indication

  try {
    const { data: response } = await useFetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ email: email.value, password: password.value }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.value.status !== 200) {
      throw new Error(response.value.message);
    }

    await fetch(); // Fetch session data

    router.push('/'); // Redirect to the dashboard
  } catch (error) {
    alert(error);
  } finally {
    loading.value = false; // Stop loading indication
  }
}
</script>
