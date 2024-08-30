import { toggleDevice } from './smartLiving/toggle-device';

export default defineEventHandler(async (event) => {
    try {
        const session = await getUserSession(event);
        const accessToken = session.accessToken;
        const { deviceId } = await readBody(event);

        // Step 1: Shut down the server
        const shutdownResponse = await fetch(`${process.env.SERVER_HOST}/shutdown`, { method: 'POST' });

        if (!shutdownResponse.ok && shutdownResponse.status !== 404) {
            console.error('Error shutting down server:', shutdownResponse.status);
            return { status: shutdownResponse.status, message: 'Error shutting down server' };
        }

        // Step 2: Wait for 30 seconds
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Step 3: Toggle the device off
        const toggleDeviceResponse = await toggleDevice(accessToken, deviceId, 0);

        if (!toggleDeviceResponse.ok) {
            return { status: toggleDeviceResponse.status, message: 'Error toggling device off' };
        }

        return { status: 200, message: 'Server shut down and device toggled off' };
    } catch (error) {
        console.error('Error shutting down server and toggling device:', error.message);
        return { status: 500, message: 'Server Error', error: error.message };
    }
});
