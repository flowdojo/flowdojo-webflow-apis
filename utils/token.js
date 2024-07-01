const getTokenFromHeader = (req) => req.headers.authorization.split(" ")[1]


module.exports = {
  getTokenFromHeader
}