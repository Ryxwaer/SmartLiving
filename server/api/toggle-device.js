export default defineEventHandler(async (event) => {
    console.log('Toggling the device');

    try {
        // Extract the necessary parameters from the request body
        const { deviceId, newStatus } = await readBody(event);

        // Ensure that newStatus is valid (0 for off, 1 for on)
        if (newStatus !== 0 && newStatus !== 1) {
            return { status: 400, message: 'Invalid status value. Use 0 for off and 1 for on.' };
        }

        // Retrieve tokens from cookies
        let accessToken = getCookie(event, 'accessToken');

        // Attempt to toggle the device
        const result = await toggleDevice(accessToken, deviceId, newStatus);
        return result;

    } catch (error) {
        console.error('Error toggling the device:', error.message);
        return { status: 500, message: 'Server Error', error: error.message };
    }
});

export async function toggleDevice(accessToken, deviceId, newStatus) {
    const url = `https://px1.tuyaeu.com/homeassistant/skill`;

    const data = {
        header: {
            name: 'turnOnOff',
            namespace: 'control',
            payloadVersion: 1,
        },
        payload: {
            accessToken: accessToken,
            devId: deviceId,
            value: newStatus,
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok && responseData.header && responseData.header.code === 'SUCCESS') {
            return { status: 200, message: `Device turned ${newStatus === 1 ? 'on' : 'off'} successfully` };
        } else {
            return { status: 400, message: 'Failed to toggle the device', error: responseData };
        }

    } catch (error) {
        console.error('Error in toggleDevice:', error.message);
        throw new Error('Failed to toggle the device');
    }
}