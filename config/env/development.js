var port = 1337;

module.exports = {
    port: port,
    db: process.env.MONGO_URL || 'mongodb://mongo/test'
};
