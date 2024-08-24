export default defineEventHandler(async (event) => {
    try {
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
                if (accessToken) {
                    console.log('Token refreshed.');
                    setCookie(event, 'accessToken', accessToken.access_token, {
                        httpOnly: true,
                        maxAge: accessToken.expires_in / 1000 - 33
                    });
                    return { status: 200, message: 'Token refreshed.' };
                }
                else {
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

export async function attemptToRefreshToken(accessToken, refreshToken) {
    // Check if the access token is missing or expired
    if (!accessToken) {
        if (!refreshToken) {
            return null;
        }
        try {
            // Refresh the access token
            accessToken = await refreshAccessToken(refreshToken);
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
            // return refreshed access token
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