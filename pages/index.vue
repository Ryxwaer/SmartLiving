<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Selected Device</h1>
        <div v-if="devices.length > 0" class="flex justify-center">
          <ServerToggleButton :device="devices[0]" />
        </div>
        <p v-else class="text-center text-gray-500">No device found.</p>
      </div>
    </div>
  </template>

<script setup>
const router = useRouter();
const devices = useCookie('devices');

onMounted(() => {
    // Check if the user is authenticated by looking for the accessToken cookie
    const refreshToken = useCookie('refreshToken')

    if (!refreshToken.value || !devices.value) {
        router.push('/login');
    }

    if (devices.value.length > 1) {
        router.push('/devices'); // TODO: select one device that stays on the dashboard
    }
})
</script>