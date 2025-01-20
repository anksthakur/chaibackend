class ApiError extends Error {
constructor(
    statusCode,
    message = 'API Error',
    errors=[],
    stack = ""
){
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message=message
    this.success= false
    this.errors = errors
    // stack m ki kin kin files m problem hai
    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this,this.constructor)
    }
}
}
export {ApiError}