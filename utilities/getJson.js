// Helper function to return status code and json object
const getJson = (res, code, orig, short) => {
    return res.status(code).json({ 
        original_url: orig, 
        short_url: short 
    });
}

module.exports = getJson 
