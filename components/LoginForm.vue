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
        <button type="submit"
          class="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
          Login
        </button>
      </form>
    </div>
</template>

<script setup>
// /components/LoginForm.vue
const { fetch } = useUserSession();

const email = ref('');
const password = ref('');

const login = async () => {
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

    await fetch();

    // Redirect to the dashboard
    useRouter().push('/');
  } catch (error) {
    alert(error);
  }
}
</script>