export default defineEventHandler(async (event) => {
    try {
        const accessToken = event.context.accessToken;

        const url = `https://px1.tuyaeu.com/homeassistant/skill`;

        const deviceListResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                header: {
                    name: 'Discovery',
                    namespace: 'discovery',
                    payloadVersion: 1,
                },
                payload: {
                    accessToken: accessToken,
                },
            }),
        });

        const deviceData = await deviceListResponse.json();
        /*
        const deviceListResponse = { ok: true };
        const deviceData = {
            payload: {
                devices: [{
                    data: { online: true, state: true },
                    name: 'Smart Socket',
                    icon:
                        'https://images.tuyaeu.com/smart/icon/001451370140532cRrxW/167713133468403946a5f.jpg',
                    id: 'bf45be52d9f1af3590x3db',
                    dev_type: 'switch',
                    ha_type: 'switch'
                }]
            }
        };*/

        if (deviceListResponse.ok && deviceData.payload && deviceData.payload.devices) {
            // cache the device list for 17 minutes
            setCookie(event, 'deviceList', JSON.stringify(deviceData.payload.devices), {
                maxAge: 1020,
            });
            return {
                status: 200,
                devices: deviceData.payload.devices,
            };
        } else {
            console.error('Failed to get device list:', deviceData);
            return { status: 400, message: 'Failed to get device list', error: deviceData };
        }

    } catch (error) {
        console.error('Error getting device list:', error.message);
        return { status: 500, message: 'Server Error', error: error.message };
    }
});