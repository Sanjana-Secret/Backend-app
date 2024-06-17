export const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes (you can customize this)
    console.error("Error", err);

    // Set a default status code and message
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Check for specific error types and handle them
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = 'Not Found';
    }

    // Respond with the appropriate status code and error message
    res.status(statusCode).json({ status: "failure", message: message });

    // Example: throwing an error forcefully
    // throw new Error('This is a forcefully thrown error!');
};