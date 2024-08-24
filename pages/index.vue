<template>
  <div class="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
  <h2 class="text-2xl font-bold text-center text-gray-800">Selected Device</h2>
  <div v-if="data?.devices?.length > 0">
    <ServerToggleButton :device="data?.devices[0]" />
  </div>
  <p v-else class="text-center text-gray-500">No device found.</p>
</div>
</template>

<script setup>
const router = useRouter();
const data = useCookie('data');

// Check if the user is authenticated by looking for the accessToken cookie
const refreshToken = useCookie('refreshToken')

if (!refreshToken.value || !data.value?.devices) {
  router.push('/login');
}

if (data.value?.devices?.length > 1) {
  router.push('/devices'); // TODO: select one device that stays on the dashboard
}
</script>