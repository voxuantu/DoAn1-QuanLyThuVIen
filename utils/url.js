const path = require('path')

function getEncodedMessageUrl(url, mess){
  let query = `?type=${encodeURIComponent(mess.type)}&title=${encodeURIComponent(mess.title)}&text=${encodeURIComponent(mess.text)}`
  return url+query
}
// format input {message: '', type: ''}
module.exports = {
  getEncodedMessageUrl
}