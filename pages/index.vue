<template>
  <div class="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-center text-gray-800">Selected Device</h2>
    <div v-if="session?.selectedDevice?.length > 0">
      <ServerToggleButton :device="session?.selectedDevice[0]" />
    </div>
    <p v-else class="text-center text-gray-500">No device found.</p>
  </div>
</template>

<script setup>
const { loggedIn, session } = useUserSession();
const router = useRouter();

// Check if the user is not logged in, redirect to the login page
if (!loggedIn.value) {
  router.push('/login');
} else {
  // Check if session and selectedDevice are defined and if selectedDevice has more than one item
  if (session.value?.selectedDevice?.length > 1) {
    router.push('/devices');
  }
}
</script>
