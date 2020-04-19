const autoCatch = (handlers) => {
    if (typeof handlers === 'function') return auto(handlers)

    return Object.keys(handlers).reduce((autoHandlers, key) => {
        autoHandlers[key] = auto(handlers[key])
        return autoHandlers
    }, {})
};

const auto = (handler) => {
    return async (req, res, next) =>
        Promise.resolve(handler(req, res, next)).catch(next)
};

module.exports = autoCatch