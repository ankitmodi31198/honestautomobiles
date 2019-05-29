var express = require('express');
var router = express.Router();
var session = require('client-sessions')
var CustomerInfo = require('../models/customerinfomodel')

// get dashboard
router.get('/dashboard', (req, res) => {
    res.render('staff/dashboard', {
        title: 'Dashboard'
    })
})

// get search page
router.get('/search', (req, res) => {
    res.render('staff/search', {
        title: 'Search Vehcile'
    })
})

router.post('/checkVehicle', (req, res) => {
    var vehicleNumber = req.body.vehicleNumber

    CustomerInfo.findOne({
        'vehicleInfo.vehicleNumber': vehicleNumber
    }, (err, data) => {
        if (err) {
            throw err
        }

        if (data) {
            // redirect to allocate page
        } else {
            // redirect to register page
            req.session.vehicleNumber = vehicleNumber
            res.redirect('/staff/customerRegistration')
        }
    })
})

router.get('/customerRegistration', (req, res) => {
    res.render('staff/customerRegistration', {
        title: 'Customer Registration',
        vehicleNumber: req.session.vehicleNumber
    })
})

module.exports = router;