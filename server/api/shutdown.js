export default defineEventHandler(async (event) => {
    try {
        const response = await fetch(`${process.env.SERVER_HOST}/shutdown`, {method: 'POST'});

        if (!response.ok) {
            return { status: response.status, message: 'Error fetching data' };
        }

        return { status: response.status };
    } catch (error) {
        return { status: 500, message: 'Server Error', error: error.message };
    }
});
