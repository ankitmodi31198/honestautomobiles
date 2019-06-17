var express = require('express');
var router = express.Router();
var session = require('client-sessions')

// login user staff.js
router.get('/', (req, res) => {

    if (req.cookies['jcps_staffname']) {
        res.redirect('/staff/dashboard')
    } else if(req.cookies['jcps_adminname']) {
        res.redirect('/admin')
    } else {
        res.render('login', {
            title: 'Login user'
        })
    }
})

router.post('/loginUser', (req, res) => {
    var username = req.body.username
    var pwd = req.body.password

   if(username ===  "bhiren" && pwd == "admin123")
    {
        res.cookie('jcps_staffname', username, {maxAge: 3*24*60*60*1000})
        res.redirect('/staff/dashboard')
    }
    if(username ===  "mankit" && pwd == "admin123")
    {
        res.cookie('jcps_adminname', username, {maxAge: 3*24*60*60*1000})
        res.redirect('/admin')
    }
    else
    {
        res.redirect('/login')
    }
})

module.exports = router;