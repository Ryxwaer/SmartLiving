export default defineEventHandler(async (event) => {
    try {
        if (!event) {
            return { status: 400, message: 'Bad Request' };
        }

        // Retrieve tokens from session
        const session = await getUserSession(event);
        let accessToken = session?.accessToken;
        const refreshToken = session?.refreshToken;

        // Check if the access token is missing or expired
        if (!accessToken) {
            if (!refreshToken) {
                return { status: 401, message: 'Unauthorized. Refresh token is missing.' };
            }
            try {
                // Refresh the access token
                const newToken = await refreshAccessToken(refreshToken);
                if (newToken) {
                    console.log('Token refreshed.');
                    accessToken = newToken.access_token;

                    // Update session with the new access token and expiration
                    session.accessToken = newToken.access_token;
                    session.expiresAt = Date.now() + newToken.expires_in * 1000;

                    await replaceUserSession(event, session);

                    return { status: 200, message: 'Token refreshed.' };
                } else {
                    console.error('Failed to refresh access token.');
                    return { status: 401, message: 'Failed to refresh access token. Please log in again.' };
                }
            } catch (error) {
                return { status: 401, message: 'Failed to refresh access token. Please log in again.' };
            }
        }

        return { status: 200, message: 'Token is valid.' };
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        return { status: 500, message: 'Server Error', error: error.message };
    }
});

export async function attemptToRefreshToken(session) {
    let accessToken = session?.accessToken;
    const refreshToken = session?.refreshToken;

    // Check if the access token is missing or expired
    if (!accessToken) {
        if (!refreshToken) {
            return null;
        }
        try {
            // Refresh the access token
            const newToken = await refreshAccessToken(refreshToken);
            if (newToken) {
                accessToken = newToken.access_token;

                // Update session with the new access token and expiration
                session.accessToken = newToken.access_token;
                session.expiresAt = Date.now() + newToken.expires_in * 1000;

                await replaceUserSession(event, session);
            }
        } catch (error) {
            return null;
        }
    }

    return accessToken;
}

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
            // Return refreshed access token
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