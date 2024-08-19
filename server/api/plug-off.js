export default defineEventHandler(async (event) => {
    console.log('Fetching data from server');
    try {
        const response = await fetch(process.env.SERVER_HOST);

        // wait for 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));

        if (!response.ok) {
            return { status: response.status, message: 'Error fetching data' };
        }

        return { status: response.status };
    } catch (error) {
        return { status: 500, message: 'Server Error', error: error.message };
    }
});
