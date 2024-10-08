<template>
  <div class="text-center text-gray-600"> {{ device.name }} </div>
  <div class="flex justify-center items-center w-full mt-4">
    <div v-if="status !== 'success'" class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    <div v-else class="flex flex-col items-center">
      <button @click="toggleServer" :class="[
        supermicro.status === 200 ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700',
        'text-white font-bold py-3 px-6 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-300'
      ]">
        {{ supermicro.status === 200 ? 'Shut Down Server' : 'Start Server' }}
      </button>
      <p v-if="supermicro.status === 200" class="text-green-600 font-bold mt-2">Server is running</p>
      <p v-else class="text-red-600 font-bold mt-2">Server is not running</p>
      <p class="text-gray-500 text-sm mt-2">{{ supermicro }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    required: true,
  }
})

const { data: supermicro, status, refresh } = useFetch('/api/status', {
  method: 'GET',
  pick: ['status'],
  lazy: true,
});

const toggleServer = async () => {
  const serverRunning = supermicro.value.status === 200;
  console.log(`Toggling server from: ${serverRunning}`);
  try {
    if (serverRunning === true) {
      // refresh accessToken if needed
      $fetch('/api/refreshToken', { method: 'POST' });
      // Shutdown the server and power off smart plug
      $fetch('/api/shutdown', { method: 'POST', body: JSON.stringify({ deviceId: props.device.id }) });
      status.value = 'shutting_down';
      setTimeout(() => {
        refresh();
      }, 26000);

    } else {
      status.value = 'starting';
      // Power on the smart plug (Replace with actual API call)
      $fetch('/api/smartLiving/toggle-device', {
        method: 'POST',
        body: JSON.stringify({
          deviceId: props.device.id,
          newStatus: 1
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      // run refresh interval in 10000ms 10 times or until supermicro.value.status = !serverRunning
      let attempts = 0;
      const maxAttempts = 10;
      const interval = setInterval(async () => {
        await refresh();
        attempts += 1;

        if (supermicro.value.status != 200 == serverRunning || attempts >= maxAttempts) {
          clearInterval(interval);
        }
        else {
          status.value = 'starting';
        }
      }, 10000);
    }
  } catch (error) {
    alert('Failed to toggle server');
    console.error('Error toggling server:', error);
  }
};
</script>
