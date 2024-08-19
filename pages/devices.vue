<template>
    <div class="min-h-screen bg-gray-50 p-4 sm:p-8">
        <h1> Select one for dasboard </h1>
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Your Devices</h1>
            <div v-if="devices.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <SelectDevice v-for="device in devices" :key="device.id" :device="device" />
            </div>
            <p v-else class="text-center text-gray-500">No devices found.</p>
        </div>
    </div>
</template>

<script setup>

const router = useRouter()
const devices = useCookie('devices')

onMounted(() => {
    // Check if the user is authenticated by looking for the accessToken cookie
    const refreshToken = useCookie('refreshToken')

    if (!refreshToken.value || !devices.value) {
        router.push('/')
    }

    console.log(`devices: ${devices.value}`)
})
</script>