module.exports = {
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'This is my secret'
  }
}