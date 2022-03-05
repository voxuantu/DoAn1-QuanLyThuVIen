const res = require("express/lib/response")
const jwt = require("jsonwebtoken")

const authPage = () => {
    try {
        var token = req.params.token
        var ketqua = jwt.verify(token, process.env.SECRET)
    } catch (error) {
        return res.json('ban can phai login')
    }
    
}