//api/smartLiving/deviceList.js
export default defineEventHandler(async (event) => {
    try {
        const accessToken = getCookie(event, 'accessToken');

        const url = `https://px1.tuyaeu.com/homeassistant/skill`;

        // set cookie from res header
        const setCookie = (event, name, value, options) => {
            const cookie = `${name}=${value}`;
            event.res.setHeader('Set-Cookie', [cookie]);
        };

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