<template>
  <div class="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
    <p class="text-lg font-semibold text-gray-800 mb-4">{{ device.name }}</p>
    
    <button @click="selectDevice" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-300">
      Select
    </button>
    
    <div class="text-sm text-gray-500 mt-2">Status: {{ isOn ? 'On' : 'Off' }}</div>

    <!-- Barely visible details button -->
    <button @click="showDetails" class="text-xs text-gray-400 underline mt-2 focus:outline-none">
      Details
    </button>

    <!-- Modal for displaying the JSON details -->
    <div v-if="isModalVisible">
      <div @click="closeModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
        <div 
          @click.stop 
          class="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-full sm:max-w-3xl w-full mx-4 sm:mx-0 z-50 max-h-[80vh]">
          <h3 class="text-lg font-bold mb-4">Device Details</h3>
          <pre class="text-xs bg-gray-100 p-2 rounded break-words overflow-auto">{{ formattedDevice }}</pre>
          <!-- Right-aligned Red Close Button -->
          <div class="flex justify-end mt-4">
            <button @click="closeModal" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transition ease-in-out duration-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from '#app';

const props = defineProps({
  device: {
    type: Object,
    required: true,
  }
});

const isOn = ref(props.device.data.state);
const isModalVisible = ref(false);

// Method to toggle the visibility of the modal
const showDetails = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

// Computed property to format the device JSON
const formattedDevice = computed(() => {
  return JSON.stringify(props.device, null, 2); // Pretty-print JSON with 2-space indentation
});

const router = useRouter();

const selectDevice = async () => {
  try {
    // Get cookie data
    const data = useCookie('data');
    // Set data.selected to the selected device
    data.value.selected = [props.device];

    // Redirect to dashboard
    router.push('/');

  } catch (error) {
    alert('An error occurred while selecting the device');
    console.error('Error selecting device:', error);
  }
};
</script>
