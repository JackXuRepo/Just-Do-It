module.exports = {
  send (req, res) {
    res.send({
      message: `You are now registered, ${req.body.username}!`
    })
  } 
}