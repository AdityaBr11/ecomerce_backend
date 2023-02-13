class ErrorHandler extends Error{
    constructor (message,statusCode){
        super(message);
        this.statusCode=statusCode||500

        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports=ErrorHandler

//this file is used to stop the repeation of msg and status code in products controller by using middleware
