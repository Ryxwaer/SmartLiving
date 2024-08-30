export default defineEventHandler(async (event) => {
    if (event.path.startsWith('/api/smartLiving')) {
        const session = await getUserSession(event);
        if (!session) {
            console.error('Unauthorized request');
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
            });
        }

        if (session.expiresAt < Date.now()) {
            try {
                const newToken = await refreshAccessToken(session.refreshToken);

                if (newToken) {
                    // Update session with new accessToken and expiresAt
                    session.accessToken = newToken.access_token;
                    session.expiresAt = Date.now() + newToken.expires_in * 1000; // expires_in is usually in seconds

                    // Persist the updated session
                    await updateUserSession(event, session);

                } else {
                    throw new Error('Failed to refresh token');
                }
            } catch (error) {
                console.error('Token refresh failed:', error.message);
                throw createError({
                    statusCode: 401,
                    statusMessage: 'Unauthorized',
                });
            }
        }
        
        // Store the updated or valid access token in the context
        event.context.accessToken = session.accessToken;
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