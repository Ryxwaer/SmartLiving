//server/middleware/refreshToken.js

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, 'refreshToken');
    // Check if the request path starts with /api/smartLiving
    if (refreshToken && event.path.startsWith('/api/smartLiving')) {
        let accessToken = getCookie(event, 'accessToken');

        // Check if accessToken is missing or expired
        if (!accessToken) {
            if (refreshToken) {
                try {
                    const newToken = await refreshAccessToken(refreshToken);

                    if (newToken) {
                        console.log(`Token refreshed. New access token: ${newToken.access_token}`);
                        accessToken = newToken.access_token
                        setCookie(event, 'accessToken', accessToken, {
                            httpOnly: false,
                            maxAge: newToken.expires_in / 1000 - 30,
                            path: '/',
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
        event.context.accessToken = accessToken;
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
