class ExpressError extends Error {
    constructor(status, message) {
        super();
        console.log("error class working");
        this.status = status;
        this.message = message;
    }
}

module.exports = ExpressError;
    