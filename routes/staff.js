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

router.post('/addCustomer', (req, res) => {

    var customer = new CustomerInfo()

    customer.name = req.body.customer_name
    customer.contact.phone = req.body.customer_contact
    customer.contact.email = req.body.customer_email
    customer.address.address = req.body.customer_address
    customer.address.city = req.body.customer_city
    customer.address.state = req.body.customer_state
    customer.address.pincode = req.body.pincode
    customer.documents.aadhaarNumber = req.body.customer_aadhaar
    customer.documents.rcNumber = req.body.customer_rc
    customer.documents.licenseNumber = req.body.customer_license
    customer.customerType = req.body.customer_type

    customer.vehicleInfo.vehicleNumber = req.body.vehicle_number
    customer.vehicleInfo.VIN = req.body.vin_number
    customer.vehicleInfo.engineNumber = req.body.engine_number
    customer.vehicleInfo.fuelType = req.body.fuel_type
    customer.vehicleInfo.vehicleType = req.body.vehicle_type
    customer.vehicleInfo.interiorColor = req.body.interior_color
    customer.vehicleInfo.exteriorColor = req.body.exterior_color

    customer.save((err, done) => {
        if (err) {
            throw err
        }

        console.log('done')
    })
})

module.exports = router;