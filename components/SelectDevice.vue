<template>
  <div class="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
    <p class="text-lg font-semibold text-gray-800 mb-4">{{ device.name }}</p>
    <button @click="toggleDevice" :class="[
      isOn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700',
      'text-white font-bold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-300'
    ]">
      {{ isOn ? 'Turn Off' : 'Turn On' }}
    </button>
    <div class="text-sm text-gray-500 mt-2">Status: {{ isOn ? 'On' : 'Off' }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  device: {
    type: Object,
    required: true,
  }
})

const isOn = ref(props.device.data.state)

const toggleDevice = async () => {
  try {
    const newStatus = !isOn.value
    const response = await useFetch('/api/toggle-device', {
      method: 'POST',
      body: JSON.stringify({
        deviceId: props.device.id,
        newStatus: newStatus ? 1 : 0
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      isOn.value = newStatus
    } else {
      alert(`Failed to toggle device: ${response.value.message}`)
    }
  } catch (error) {
    alert('An error occurred while toggling the device')
    console.error('Error toggling device:', error)
  }
}
</script>