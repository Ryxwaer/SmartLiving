export default defineEventHandler(async (event) => {
    console.log('refreshToken middleware');
    // Check if the request path starts with /api/smartLiving
    if (event.path.startsWith('/api/smartLiving')) {
        const accessToken = getCookie(event, 'accessToken');
        const refreshToken = getCookie(event, 'refreshToken');

        // Check if accessToken is missing or expired
        if (!accessToken) {
            if (refreshToken) {
                try {
                    const newToken = await refreshAccessToken(refreshToken);

                    if (newToken) {
                        setCookie(event, 'accessToken', newToken.access_token, {
                            httpOnly: false,
                            maxAge: newToken.expires_in / 1000 - 30,
                        });
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                } catch (error) {
                    // Handle failure by returning a 401 Unauthorized error
                    throw createError({
                        statusCode: 401,
                        statusMessage: 'Unauthorized',
                    });
                }
            } else {
                // No refresh token available, return a 401 Unauthorized error
                throw createError({
                    statusCode: 401,
                    statusMessage: 'Unauthorized',
                });
            }
        }
    }

    // Proceed with the request if the token is valid or refreshed
});

async function refreshAccessToken(refreshToken) {
    const baseUrl = `https://px1.tuyaeu.com/homeassistant/access.do`;

    const url = new URL(baseUrl);
    url.searchParams.append('grant_type', 'refresh_token');
    url.searchParams.append('refresh_token', refreshToken);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const refreshData = await response.json();

        if (response.ok && refreshData.access_token) {
            // Return the refreshed access token
            return refreshData;
        } else {
            console.error('Failed to refresh access token:', refreshData);
            throw new Error('Failed to refresh access token');
        }

    } catch (error) {
        console.error('Error in refreshAccessToken:', error.message);
        throw new Error('Failed to refresh access token');
    }
}
