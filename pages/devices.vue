<template>
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Your Devices</h1>

        <!-- Show error message if there's an error -->
        <p v-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</p>

        <!-- Show devices if fetched successfully -->
        <div v-else-if="newDevices?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <SelectDeviceButton v-for="device in newDevices" :key="device.id" :device="device" />
        </div>

        <!-- Show no devices message if no devices are found -->
        <p v-else class="text-center text-gray-500">No devices found.</p>
    </div>
</template>

<script setup>
//pages/devices.vue
const router = useRouter();
const data = useCookie('data');
const devices = ref(data.value?.selected);

// Check if the user is authenticated by looking for the accessToken cookie
const refreshToken = useCookie('refreshToken');

if (!refreshToken.value || !devices.value) {
    router.push('/login');
}

const newDevices = ref([]);
const errorMessage = ref('');
const deviceListCookie = useCookie('deviceList');

// Fetch devices from the server only if the deviceList cookie is not present.
// If the cookie is present, use its value instead.
if (deviceListCookie.value) {
    newDevices.value = deviceListCookie.value;
    console.log('Using devices from cookie:', newDevices.value);
} else {
    try {
        const { data: fetchedData } = await useFetch('/api/smartLiving/deviceList', { method: 'POST', credentials: 'include' });
        console.log(`fetchedData: ${JSON.stringify(fetchedData)}`);

        if (fetchedData.value.error) {
            errorMessage.value = fetchedData.value.error;
        } else {
            newDevices.value = fetchedData.value.devices;
            deviceListCookie.value = JSON.stringify(fetchedData.value.devices); // Store in cookie for future use
        }
    } catch (error) {
        errorMessage.value = `Error: ${error.message || 'Unknown error occurred'}`;
        console.error('Error fetching devices:', error);
    }
}
</script>