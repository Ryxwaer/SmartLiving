// /server/api/auth.js
export default defineEventHandler(async (event) => {
    try {
        // Extract the necessary parameters from the request body
        const { email, password } = await readBody(event);

        // Construct the URL based on the region
        let baseurl = "https://px1.tuyaeu.com/homeassistant/";

        const url = `${baseurl}auth.do`;

        // Set the headers for the POST request
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        // Prepare the form data
        const data = new URLSearchParams({
            userName: email,
            password: password,
            countryCode: "EU",
            bizType: "smart_life",
            from: 'tuya',
        });

        // Make the POST request to authenticate the user
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: data,
        });

        const authData = await response.json();

        if (response.ok && authData.access_token) {
            // Store tokens in some server-side session or respond with them
            const accessToken = authData.access_token;
            const refreshToken = authData.refresh_token;
            const expiresIn = authData.expires_in;

            // Fetch the list of devices using the retrieved access token
            const deviceListResponse = await fetch(`${baseurl}skill`, {
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
                setCookie(event, 'deviceList', JSON.stringify(deviceData.payload.devices), {
                    maxAge: 1020,
                });
                await setUserSession(event, {
                    accessToken: accessToken,
                    expiresAt: Date.now() + authData.expires_in,
                    refreshToken: authData.refresh_token,
                    user: {
                        email: email,
                        userName: email.substring(0, email.indexOf('@')),
                    },
                    loggedInAt: new Date().toISOString(),
                    selectedDevice: deviceData.payload.devices,
                });
                
                return {
                    status: 200,
                    message: 'Login successful',
                    //selected: deviceData.payload.devices,
                };
            } else {
                return {
                    status: 500,
                    message: 'Failed to retrieve devices',
                };
            }
        } else {
            return {
                status: 400,
                message: authData.errorMsg || 'Failed to authenticate user',
            };
        }
    } catch (error) {
        console.error('Error during authentication:', error.message);
        return { status: 500, message: 'Server Error', error: error.message };
    }
});
