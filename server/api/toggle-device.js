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
        const refreshToken = getCookie(event, 'refreshToken');

        // Check if the access token is missing or expired
        if (!accessToken) {
            if (!refreshToken) {
                return { status: 401, message: 'Unauthorized. Refresh token is missing.' };
            }
            try {
                // Refresh the access token
                accessToken = await refreshAccessToken(refreshToken);
            } catch (error) {
                return { status: 401, message: 'Failed to refresh access token. Please log in again.' };
            }
        }

        // Attempt to toggle the device
        const result = await toggleDevice(accessToken, deviceId, newStatus);
        return result;

    } catch (error) {
        console.error('Error toggling the device:', error.message);
        return { status: 500, message: 'Server Error', error: error.message };
    }
});

async function toggleDevice(accessToken, deviceId, newStatus) {
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

async function refreshAccessToken(refreshToken) {
    const refreshUrl = `https://px1.tuyaeu.com/homeassistant/access.do`;

    try {
        const response = await fetch(refreshUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
        });

        const refreshData = await response.json();

        if (response.ok && refreshData.access_token) {
            // Update the access token cookie
            useCookie('accessToken').value = refreshData.access_token;

            return refreshData.access_token;
        } else {
            console.error('Failed to refresh access token:', refreshData);
            throw new Error('Failed to refresh access token');
        }

    } catch (error) {
        console.error('Error in refreshAccessToken:', error.message);
        throw new Error('Failed to refresh access token');
    }
}
