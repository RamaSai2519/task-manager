class ResponseFormatter {
    static format({ data = {}, msg = '', success = true } = {}) {
        return { data, msg, success };
    }
}

module.exports = ResponseFormatter;