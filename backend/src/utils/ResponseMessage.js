class ResponseMessage {
    constructor() {}
    create(_success, _data, _userMessage = "", _devMessage = "") {
        return {
            success: _success,
            data: _data,
            userMsg: _userMessage,
            devMsg: _devMessage,
        };
    }
}
module.exports = new ResponseMessage();
