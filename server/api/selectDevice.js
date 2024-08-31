export default defineEventHandler(async (event) => {
    try {
        const session = await getUserSession(event);
        const { device } = await readBody(event);

        session.selectedDevice = [device];

        // set device as selected
        await replaceUserSession(event, session)

        return { status: 200, message: 'Device selected' };
    } catch (error) {
        console.error('Error:', error.message);
        return { status: 500, message: 'Server Error', error: error.message };
    }
});
