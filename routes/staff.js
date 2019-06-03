var express = require('express');
var router = express.Router();
var session = require('client-sessions')
var Company = require('../models/companymodel')
var Model = require('../models/modelmodel')
var Varient = require('../models/varientmodel')
var CustomerInfo = require('../models/customerinfomodel')
var Parts = require('../models/partsmodel')
var Services = require('../models/servicemodel')
var Lubricants = require('../models/lubricantmodel')
var UniqueNumber = require('unique-number')
var uniqueNumber = new UniqueNumber();
var ObjectId = require('mongoose').Types.ObjectId;

var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'vgecit2020@gmail.com',
//       pass: '16017011600132'
//     }
// });

// get dashboard
router.get('/dashboard', (req, res) => {
    CustomerInfo.count({
        'jobcardInfo.status': 'arrival'
    }, (err, arrivalCount) => {
        if (err) {
            throw err
        }
        CustomerInfo.count({
            'jobcardInfo.status': 'pending'
        }, (err, pendingCount) => {
            if (err) {
                throw err
            }
            CustomerInfo.count({
                'jobcardInfo.status': 'repaired'
            }, (err, repairedCount) => {
                if (err) {
                    throw err
                }
                res.render('staff/dashboard', {
                    title: 'Dashboard',
                    arrivalCount: arrivalCount,
                    pendingCount: pendingCount,
                    repairedCount: repairedCount
                })
            })
        })        
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
    }, (err, customer) => {
        if (err) {
            throw err
        }

        if (customer) {
            // redirect to allocate page
            req.session.registeredCustomerId = customer._id
            res.redirect('/staff/pastHistory/'+customer._id)
        } else {
            // redirect to register page
            req.session.vehicleNumber = vehicleNumber
            res.redirect('/staff/customerRegistration')
        }
    })
})

router.get('/customerRegistration', (req, res) => {
    Company.find({}, (err, companies) => {
        if (err) {
            throw err
        }
        res.render('staff/customerRegistration', {
            title: 'Customer Registration',
            vehicleNumber: req.session.vehicleNumber,
            companies: companies
        })
    })
})

router.post('/addCustomer', (req, res) => {

    Company.findById(req.body.vehicle_company, (err, company) => {
        if (err) {
            throw err
        }
        var companyName = company.name

        Model.findById(req.body.company_model, (err, model) => {
            if (err) {
                throw err
            }
            var modelName = model.name

            Varient.findById(req.body.model_varient, (err, varient) => {
                if (err) {
                    throw err
                }
                    var varientName = varient.name

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
                    customer.vehicleInfo.company.companyId = req.body.vehicle_company
                    customer.vehicleInfo.company.name = companyName
                    customer.vehicleInfo.model.modelId = req.body.company_model
                    customer.vehicleInfo.model.name = modelName
                    customer.vehicleInfo.varient.varientId = req.body.model_varient
                    customer.vehicleInfo.varient.name = varientName

                    customer.save((err, done) => {
                        if (err) {
                            throw err
                        }

                        req.session.registeredCustomerId = done._id
                        res.redirect('/staff/customerVerification')
                    })
                })
            })            
        })    
})

router.get('/customerVerification', (req, res) => {
    var customerId = req.session.registeredCustomerId    
    CustomerInfo.findById(customerId, (err, customer) => {
        if (err) {
            throw err
        }      
        var companyId = new ObjectId(customer.vehicleInfo.company.companyId)
        var modelId = new ObjectId(customer.vehicleInfo.model.modelId)
        var varientId = new ObjectId(customer.vehicleInfo.varient.varientId)      
        Company.findOne({
            _id: companyId
        }, (err, company) => {
            if (err) {
                throw err
            }
            Model.findOne({
                _id: modelId
            }, (err, model) => {
                if (err) {
                    throw err
                }
                Varient.findOne({
                    _id: varientId
                }, (err, varient) => {
                    if (err) {
                        throw err
                    }
                    res.render('staff/customerVerification', {
                        title: 'Customer Verification',
                        customer: customer,
                        company: company,
                        model: model,
                        varient: varient
                    })
                })
            })
        })
    })
})

router.post('/updateCustomer/:cid', (req, res) => {
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $set: {
            'name': req.body.customer_name,
            'contact.email': req.body.customer_email,
            'contact.phone': req.body.customer_contact,
            'customerType': req.body.customer_type,
            'documents.aadhaarNumber': req.body.customer_aadhaar,
            'documents.licenseNumber': req.body.customer_license,
            'address.address': req.body.customer_address,
            'address.city': req.body.customer_city,
            'address.state': req.body.customer_state,
            'address.pincode': req.body.pincode,
            'vehicleInfo.vehicleNumber': req.body.vehicle_number,
            'vehicleInfo.VIN': req.body.vin_number,
            'vehicleInfo.engineNumber': req.body.engine_number,
            'vehicleInfo.fuelType': req.body.fuel_type,
            'vehicleInfo.interiorColor': req.body.interior_color,
            'vehicleInfo.exteriorColor': req.body.exterior_color,
            'documents.rcNumber': req.body.customer_rc,
            'vehicleInfo.vehicleType': req.body.vehicle_type
        }
    }, {
        upsert: true
    }, (err, done) => {
        if (err) {
            throw err
        }

        console.log(done)
        res.redirect('back')
    })
})

router.get('/updateArrival/:cid', (req, res) => {
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $set: {
            'jobcardInfo.status': 'arrival',                    
            'jobcardInfo.jobcardNumber': uniqueNumber.generate() 
        }
    }, (err, done) => {
        if (err) {
            throw err
        }
        res.redirect('/staff/dashboard')
    })    
})

router.get('/getModelsByCompanyId/:cid', (req, res) => {
    Model.find({
        companyId: req.params.cid
    }, (err, models) => {
        if (err) {
            throw err
        }
        res.send(models)
    })
})

router.get('/getVarientsByModelId/:mid', (req, res) => {
    Varient.find({
        modelId: req.params.mid
    }, (err, varients) => {
        if (err) {
            throw err
        }
        res.send(varients)
    })
})

router.get('/arrivalCars', (req, res) => {
    CustomerInfo.find({
        'jobcardInfo.status': 'arrival'
    }, (err, customer) => {
        if (err) {
            throw err
        }
        res.render('staff/arrivalCars', {
            title: 'arrival Cars',
            customer: customer
        })
    })
})

router.get('/dentImage/:cid/:jcn', (req, res) => {
    // res.render('staff/dentImage', {
    //     title: 'Dent Image',
    //     jobcardNo: req.params.jcn
    // })
    res.redirect('/staff/jobcardForm/'+req.params.cid+'/'+req.params.jcn)
})

// router.post('/saveCarImage/:jcn', (req, res) => {
//     var file = req.files.carimage
//     file.mv('/images/dentimages/'+req.params.jcn, (err) => {
//         if (err) {
//             res.status(500).send(err+' | Your image has not been uploaded, go to the previous page...');
//         } else {            
//             res.send('done')
//         }
//     });
// })

router.get('/jobcardForm/:cid/:jcn', (req, res) => {
    CustomerInfo.findOne({
        '_id': req.params.cid,
        'jobcardInfo.status': 'arrival'
    }, (err, customer) => {
        if (err) {
            throw err
        }
        var today = new Date()

        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        res.render('staff/jobcardForm', {
            title: 'Jobcard Form',
            customer: customer,
            arrivalDate: dd+'-'+mm+'-'+yyyy,
            arrivalTime: today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()
        })
    })
})

router.get('/addComplain/:complain/:cid', (req, res) => {
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $push: {
            'jobcardInfo.customerComplain': {
                'complain': req.params.complain
            }
        }
    }, {
        upsert: true
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done)
        CustomerInfo.findById(req.params.cid, (err, customer) => {
            if (err) {
                throw err
            }
            res.send(customer.jobcardInfo.customerComplain)
        })
    })
})

router.get('/removeComplain/:complain/:cid', (req, res) => {
    console.log(req.params.complain)
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $pull: {
            'jobcardInfo.customerComplain': {
                'complain': req.params.complain
            }
        }
    }, {
        upsert: true
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done)
        CustomerInfo.findById(req.params.cid, (err, customer) => {
            if (err) {
                throw err   
            }
            res.send(customer.jobcardInfo.customerComplain)
        })
    })
})

router.get('/addSolution/:solution/:price/:cid', (req, res) => {
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $push: {
            'jobcardInfo.advisorSolution': {
                'description': req.params.solution,
                'price': req.params.price
            }
        }
    }, {
        upsert: true
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done)
        CustomerInfo.findById(req.params.cid, (err, customer) => {
            if (err) {
                throw err
            }
            console.log(customer.jobcardInfo.advisorSolution)
            res.send(customer.jobcardInfo.advisorSolution)
        })
    })
})

router.get('/removeSolution/:solution/:cid', (req, res) => {
    console.log(req.params.solution)
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $pull: {
            'jobcardInfo.advisorSolution': {
                'description': req.params.solution
            }
        }
    }, {
        upsert: true
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done)
        CustomerInfo.findById(req.params.cid, (err, customer) => {
            if (err) {
                throw err   
            }
            res.send(customer.jobcardInfo.advisorSolution)
        })
    })
})

router.post('/saveJobcardForm/:cid', (req, res) => {
    console.log(req.body.carPerfume)
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $set: {            
            'jobcardInfo.workType': req.body.work_type,
            'jobcardInfo.arrival.date': req.body.arrival_date,
            'jobcardInfo.arrival.time': req.body.arrival_time,
            'jobcardInfo.delivery.date': req.body.delivery_date,
            'jobcardInfo.delivery.time': req.body.delivery_time,
            'jobcardInfo.runningKM': req.body.running_km,
            'jobcardInfo.availableFuel': req.body.available_fuel,
            'jobcardInfo.jobcardNumber': req.body.jobcard_number,
            'jobcardInfo.accessories': {
                'serviceBook': req.body.serviceBook,
                'toolKit': req.body.toolKit,
                'spareWheel': req.body.spareWheel,
                'jack': req.body.jack,
                'jackHandle': req.body.jackHandle,
                'carPerfume': req.body.carPerfume,
                'clock': req.body.clock,
                'stereo': req.body.stereo,
                'CDPlayer': req.body.CDPlayer,
                'mouthPieces': req.body.mouthPieces,
                'CDChanger': req.body.CDChanger,
                'idols': req.body.idols,
                'wheelCover': req.body.wheelCover,
                'wheelCap': req.body.wheelCap,
                'mudFlaps': req.body.mudFlaps,
                'dickyMat': req.body.dickyMat,
                'cigaretteLighter': req.body.cigaretteLighter,
                'speakerRR': req.body.speakerRR,
                'speakerFR': req.body.speakerFR,
                'tweeters': req.body.tweeters,
                'exlWarranty': req.body.exlWarranty
            },                
            'jobcardInfo.status': 'pending'                           
        }
    }, {
        upsert: true 
    }, (err, done) => {
        if (err) {
            throw err
        }
        res.redirect('/staff/jobcardview/'+done._id)
    })
})

router.get('/jobcardview/:cid', (req, res) => {
    CustomerInfo.findOne({
        _id: req.params.cid
    }, (err, customer) => {
        if (err) {
            throw err
        }
        Company.findOne({
            _id: customer.vehicleInfo.companyId
        }, (err, company) => {
            if (err) {
                throw err
            }
            Model.findOne({
                _id: customer.vehicleInfo.modelId
            }, (err, model) => {
                if (err) {
                    throw err
                }
                res.render('staff/jobcardview', {
                    title: 'Jobcard View',
                    customer: customer,
                    company: company,
                    model: model
                })
            })
        })        
    })
})

router.get('/pendingCars', (req, res) => {
    CustomerInfo.find({
        'jobcardInfo.status': 'pending'
    }, (err, customers) => {
        if (err) {
            throw err
        }
        res.render('staff/pendingCars', {
            title: 'Pending Cars',
            customers: customers,
        })
    })
})

router.get('/addJobs/:cid', (req, res) => {
    CustomerInfo.findById(req.params.cid, (err, customer) => {
        if (err) {
            throw err
        }
        Parts.find({
            'varientId': customer.vehicleInfo.varient.varientId
        }, (err, parts) => {
            if (err) {
                throw err
            }
            Services.find({
                'varientId': customer.vehicleInfo.varient.varientId
            }, (err, services) => {
                if (err) {
                    throw err
                }
                Lubricants.find({
                    'varientId': customer.vehicleInfo.varient.varientId
                }, (err, lubricants) => {
                    if (err) {
                        throw err
                    }
                    res.render('staff/addJobs', {
                        title: 'Add Jobs',
                        customer: customer,
                        parts: parts,
                        services: services,
                        lubricants: lubricants
                    })
                })
            })
        })
    })  
})

// ajax for adding part
router.post('/addPart/:pid/:pp/:prf/:cid', (req, res) => {
    Parts.findById(req.params.pid, (err, part) => {
        if (err) {
            throw err
        }
        CustomerInfo.findByIdAndUpdate(req.params.cid, {
            $push: {
                'jobcardInfo.parts': {
                    'name': part.name,
                    'partId': req.params.pid,
                    'price': req.params.pp,
                    'quantity': part.quantity,
                    'repairFlag': req.params.prf,
                    'status': 'pending',
                    'labour': part.labour                  
                }
            }
        }, {
            upsert: true
        }, (err, done) => {
            if (err) {
                throw err
            }
            CustomerInfo.findById(req.params.cid, (err, customer) => {
                if (err) {
                    throw err
                }
                res.send(customer.jobcardInfo.parts)
            })
        })
    })
})

// jash's
// ajax add lubricant
router.post('/addLubricant/:lid/:cid', (req, res) => {
    var lid = req.params.lid
    var cid = req.params.cid

    Lubricants.findById(lid, (err, lubricant) => {
        if (err) {
            throw err
        }
        CustomerInfo.findByIdAndUpdate(cid, {
            $push: {
                'jobcardInfo.lubricants': {
                    'name': lubricant.name,
                    'lubricantId': req.params.lid,
                    'price': lubricant.price,
                    'status': 'pending',
                    'labour': lubricant.labour 
                }
            }
        }, {
            upsert: true
        }, (err, done) => {
            if (err) {
                throw err
            }
            console.log(done)
            CustomerInfo.findById(cid, (err, customer) => {
                if (err) {
                    throw err
                }
                res.send(customer.jobcardInfo.lubricants)
            })
        })
    })
})

// ajax for add service
router.post('/addService/:sid/:cid', (req, res) => {
    var sid = req.params.sid
    var cid = req.params.cid
    
    Services.findById(sid, (err, service) => {
        if (err) {
            throw err
        }
        CustomerInfo.findByIdAndUpdate(cid, {
            $push: {
                'jobcardInfo.services': {
                    'name': service.name,
                    'serviceId': sid,
                    'details': service.details,
                    'price': service.price,
                    'status': 'pending',
                    'labour': service.labour
                }
            }
        }, {
            upsert: true
        }, (err, done) => {
            if (err) {
                throw err
            }
            console.log(done)
            CustomerInfo.findById(cid, (err, customer) => {
                if (err) {
                    throw err
                }
                res.send(customer.jobcardInfo.services)
            })
        })
    })
})

// ajax for removing part
router.post('/removeLubricant/:lid/:cid', (req, res) => {
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $pull: {
            'jobcardInfo.lubricants': {
                'lubricantId': req.params.lid
            }
        }
    }, {
        upsert: true
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done.jobcardInfo.lubricants)
        CustomerInfo.findById(req.params.cid, (err, customer) => {
            if (err) {
                throw err
            }
            res.send(customer.jobcardInfo.lubricants)
        })
    })
})

// ajax for removing part
router.post('/removePart/:pid/:cid', (req, res) => {
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $pull: {
            'jobcardInfo.parts': {
                'partId': req.params.pid
            }
        }
    }, {
        upsert: true
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done.jobcardInfo.parts)
        CustomerInfo.findById(req.params.cid, (err, customer) => {
            if (err) {
                throw err
            }
            res.send(customer.jobcardInfo.parts)
        })
    })
})
// ajax for removing service
router.post('/removeService/:sid/:cid', (req, res) => {
    var sid = req.params.sid
    var cid = req.params.cid

    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $pull: {
            'jobcardInfo.services': {
                'serviceId': sid
            }
        }
    }, {
        upsert: true
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done.jobcardInfo.services)
        CustomerInfo.findById(cid, (err, customer) => {
            if (err) {
                throw err
            }
            res.send(customer.jobcardInfo.services)
        })
    })
})

router.get('/viewStatus/:cid', (req, res) => {
    var pendingParts = []
    var completedParts = []
    var pendingServices = []
    var completedServices = []
    var pendingLubricants = []
    var completedLubricants = []
    CustomerInfo.findById(req.params.cid, (err, customer) => {
        if (err) {
            throw err
        }
        for (let index = 0; index < customer.jobcardInfo.parts.length; index++) {
            if(customer.jobcardInfo.parts[index].status == 'pending') {
                pendingParts.push(customer.jobcardInfo.parts[index])
            }
            if(customer.jobcardInfo.parts[index].status == 'completed') {
                completedParts.push(customer.jobcardInfo.parts[index])
            }
        } 
        for (let index = 0; index < customer.jobcardInfo.services.length; index++) {
            if(customer.jobcardInfo.services[index].status == 'pending') {
                pendingServices.push(customer.jobcardInfo.services[index])
            }
            if(customer.jobcardInfo.services[index].status == 'completed') {
                completedServices.push(customer.jobcardInfo.services[index])
            }
        } 
        for (let index = 0; index < customer.jobcardInfo.lubricants.length; index++) {
            if(customer.jobcardInfo.lubricants[index].status == 'pending') {
                pendingLubricants.push(customer.jobcardInfo.lubricants[index])
            }
            if(customer.jobcardInfo.lubricants[index].status == 'completed') {
                completedLubricants.push(customer.jobcardInfo.lubricants[index])
            }
        } 
        res.render('staff/viewStatus', {
            title: 'View Status',
            pendingParts: pendingParts,
            completedParts: completedParts,
            pendingServices: pendingServices,
            completedServices: completedServices,
            pendingLubricants: pendingLubricants,
            completedLubricants: completedLubricants
        })
    })
})

router.get('/updateStatus/:cid', (req, res) => {
    var pendingParts = []
    var pendingLubricants = []
    var pendingServices = []

    CustomerInfo.findById(req.params.cid, (err, customer) => {
        if (err) {
            throw err
        }
        // console.log(customer.jobcardInfo.parts.length)
        // console.log(customer.jobcardInfo.parts[0].status)
        for (let index = 0; index < customer.jobcardInfo.parts.length; index++) {
            if(customer.jobcardInfo.parts[index].status == 'pending') {
                pendingParts.push(customer.jobcardInfo.parts[index])
            }
        } 
        for (let index = 0; index < customer.jobcardInfo.services.length; index++) {
            if(customer.jobcardInfo.services[index].status == 'pending') {
                pendingServices.push(customer.jobcardInfo.services[index])
            }
        } 
        for (let index = 0; index < customer.jobcardInfo.lubricants.length; index++) {
            if(customer.jobcardInfo.lubricants[index].status == 'pending') {
                pendingLubricants.push(customer.jobcardInfo.lubricants[index])
            }
        } 
        res.render('staff/updateStatus', {
            title: 'Update Status',
            pendingParts: pendingParts,
            pendingServices: pendingServices,
            pendingLubricants: pendingLubricants,
            customerId: customer._id
        })
    })
})

router.post('/updateStatus/:cid', (req, res) => {
    var parts = req.body.parts
    var lubricants = req.body.lubricants
    var services = req.body.services

    console.log(parts)
    console.log(lubricants)

    if (parts != null) {
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            console.log(part)
    
            CustomerInfo.findOneAndUpdate({
                '_id': req.params.cid,
                'jobcardInfo.parts.partId': part
            }, {
                'jobcardInfo.parts.$.status': 'completed'
            }, (err, done) => {
                if (err) {
                    throw err
                }        
            })
        }
    }
    if (lubricants != null) {
        for (let i = 0; i < lubricants.length; i++) {
            const lubricant = lubricants[i];
            console.log(lubricant)
    
            CustomerInfo.findOneAndUpdate({
                '_id': req.params.cid,
                'jobcardInfo.lubricants.lubricantId': lubricant
            }, {
                'jobcardInfo.lubricants.$.status': 'completed'
            }, (err, done) => {
                if (err) {
                    throw err
                }        
            })
        }
    }
    if (services != null) {
        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            console.log(service)
    
            CustomerInfo.findOneAndUpdate({
                '_id': req.params.cid,
                'jobcardInfo.services.serviceId': service
            }, {
                'jobcardInfo.services.$.status': 'completed'
            }, (err, done) => {
                if (err) {
                    throw err
                }        
            })
        }
    }
    
    CustomerInfo.count({
        'jobcardInfo.parts.status': 'pending'
    }, (err, pendingPartCount) => {
        if (err) {
            throw err
        }
        CustomerInfo.count({
            'jobcardInfo.lubricants.status': 'pending'
        }, (err, pendingLubricantCount) => {
            if (err) {
                throw err
            }
            CustomerInfo.count({
                'jobcardInfo.services.status': 'pending'
            }, (err, pendingServiceCount) => {
                if (err) {
                    throw err
                }
                if (pendingPartCount === 0  && pendingLubricantCount === 0 && pendingServiceCount === 0) {
                    CustomerInfo.findOneAndUpdate({
                        _id: req.params.cid
                    }, {
                        'jobcardInfo.status': 'repaired'
                    }, (err, done) => {
                        if (err) {
                            throw err
                        }
                        
                        
                        var partsTotalPrice = parseInt(0)
                        var servicesTotalPrice = parseInt(0)
                        var lubricantsTotalPrice = parseInt(0)
                        var totalPrice = parseInt(0)
                        var partLabour = parseInt(0)
                        var serviceLabour = parseInt(0)
                        var lubricantLabour = parseInt(0)
                        CustomerInfo.findById(req.params.cid, (err, customer) => {
                            if (err) {
                                throw err
                            }
                            
                            for (let i = 0; i < customer.jobcardInfo.parts.length; i++) {
                                partsTotalPrice = partsTotalPrice + parseInt(customer.jobcardInfo.parts[i].price);  
                                if (customer.jobcardInfo.parts[i].repairFlag === "0") {
                                    partLabour = partLabour + customer.jobcardInfo.parts[i].labour
                                }          
                            }
                            for (let i = 0; i < customer.jobcardInfo.services.length; i++) {
                                servicesTotalPrice = servicesTotalPrice + parseInt(customer.jobcardInfo.services[i].price); 
                                serviceLabour = serviceLabour + customer.jobcardInfo.services[i].labour           
                            }
                            for (let i = 0; i < customer.jobcardInfo.lubricants.length; i++) {
                                lubricantsTotalPrice = lubricantsTotalPrice + parseInt(customer.jobcardInfo.lubricants[i].price);   
                                lubricantLabour = lubricantLabour + parseInt(customer.jobcardInfo.lubricants[i].labour)         
                            }
                            totalPrice = partsTotalPrice + servicesTotalPrice + lubricantsTotalPrice + partLabour + serviceLabour + lubricantLabour      
                            
                            CustomerInfo.findByIdAndUpdate(req.params.cid, {
                                $set: {
                                    'jobcardInfo.payment.total': totalPrice,
                                    'jobcardInfo.payment.final': totalPrice
                                }
                            }, (err, done) => {
                                if (err) {
                                    throw err
                                }
                                res.redirect('/staff/dashboard')
                            })                        
                        })
                    })
                } else {
                    res.redirect('back')
                }
            })            
        })
    })
})

router.post('/addDiscount/:cid', (req, res) => {
    var type = req.body.type
    var disc = req.body.discount

    if (type === "cash") {
        CustomerInfo.findById(req.params.cid, (err, c) => {
            if (err) {
                throw err
            }
            CustomerInfo.findByIdAndUpdate(req.params.cid, {
                $set: {
                    'jobcardInfo.payment.final': c.jobcardInfo.payment.total - disc,
                    'jobcardInfo.payment.discount.type': type,
                    'jobcardInfo.payment.discount.amount': disc,                
                }
            }, (err, done) => {
                if (err) {
                    throw err
                }
                res.redirect('/staff/repairedView/'+c._id)
            })
        })
    }
    if (type === "percentage") {
        CustomerInfo.findById(req.params.cid, (err, c) => {
            if (err) {
                throw err
            }
            var pdisc = (c.jobcardInfo.payment.total)*(disc/100)
            CustomerInfo.findByIdAndUpdate(req.params.cid, {
                $set: {
                    'jobcardInfo.payment.final': c.jobcardInfo.payment.total - pdisc,
                    'jobcardInfo.payment.discount.type': type,
                    'jobcardInfo.payment.discount.amount': pdisc,                
                }
            }, (err, done) => {
                if (err) {
                    throw err
                }
                res.redirect('/staff/repairedView/'+c._id)
            })
        })
    }
})

router.post('/addPendingPayment/:cid', (req, res) => {
    CustomerInfo.findByIdAndUpdate(req.params.cid, {
        $set: {
            'jobcardInfo.payment.pending.amount': req.body.pp
        }
    }, (err, done) => {
        if (err) {
            throw err
        }
        res.redirect('/staff/repairedView/'+req.params.cid)
    })
})

router.get('/repairedCars', (req, res) => {
    CustomerInfo.find({
        'jobcardInfo.status': 'repaired'
    }, (err, customers) => {
        if (err) {
            throw err
        }
        res.render('staff/repairedCars', {
            title: 'Repaired Cars',
            customers: customers
        })
    })
})

// By Ankit @3/6/19
router.get('/repairedView/:cid', (req, res) => {
    var partsTotalPrice = parseInt(0)
    var servicesTotalPrice = parseInt(0)
    var lubricantsTotalPrice = parseInt(0)
    var totalPrice = parseInt(0)
    var partLabour = parseInt(0)
    var serviceLabour = parseInt(0)
    var lubricantLabour = parseInt(0)
    CustomerInfo.findById(req.params.cid, (err, customer) => {
        if (err) {
            throw err
        }
        
        for (let i = 0; i < customer.jobcardInfo.parts.length; i++) {
            partsTotalPrice = partsTotalPrice + parseInt(customer.jobcardInfo.parts[i].price);  
            if (customer.jobcardInfo.parts[i].repairFlag === "0") {
                partLabour = partLabour + customer.jobcardInfo.parts[i].labour
            }          
        }
        for (let i = 0; i < customer.jobcardInfo.services.length; i++) {
            servicesTotalPrice = servicesTotalPrice + parseInt(customer.jobcardInfo.services[i].price); 
            serviceLabour = serviceLabour + customer.jobcardInfo.services[i].labour           
        }
        for (let i = 0; i < customer.jobcardInfo.lubricants.length; i++) {
            lubricantsTotalPrice = lubricantsTotalPrice + parseInt(customer.jobcardInfo.lubricants[i].price);   
            lubricantLabour = lubricantLabour + parseInt(customer.jobcardInfo.lubricants[i].labour)         
        }
        totalPrice = partsTotalPrice + servicesTotalPrice + lubricantsTotalPrice + partLabour + serviceLabour + lubricantLabour      

        res.render('staff/repairedView', {
            title: 'repaired View',
            customer: customer,
            totalPrice: totalPrice
        })
    })
})

// ankit @3/6/2019
router.get('/bill/:cid', (req, res) => {
    CustomerInfo.findById(req.params.cid, (err, customer) => {
        if (err) {
            throw err
        }
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        } 

        if(mm<10) {
            mm = '0'+mm
        } 
        todayDate = dd + '/' +mm + '/' + yyyy;
        res.render('staff/bill', {
            title: 'Bill',
            customer: customer,
            todayDate: todayDate
        })
    })
})

router.post('/closeCar', (req, res) => {
    var cid = req.body.customerId

    CustomerInfo.findById(cid, (err, customer) => {
        if (err) {
            throw err
        }
        CustomerInfo.findByIdAndUpdate(cid, {
            $push: {
                'history': customer.jobcardInfo
            }
        }, {
            upsert: true
        }, (err, done) => {
            if (err) {
                throw err
            }
            CustomerInfo.findByIdAndUpdate(cid, {
                $unset: {
                    'jobcardInfo': true
                }
            }, {
                upsert: true
            }, (err, done) => {
                if (err) {
                    throw err
                }
                res.redirect('/staff/dashboard')
            })
        })
    })
})

router.get('/pastHistory/:cid', (req, res) => {
    CustomerInfo.findById(req.params.cid, (err, customer) => {
        if (err) {
            throw err
        }
        res.render('staff/pastHistory', {
            title: 'History',
            customer: customer
        })
    })
})

router.get('/pastHistoryView/:cid/:hindex', (req, res) => {
    var cid = new ObjectId(req.params.cid)
    CustomerInfo.findOne({
        '_id': cid
    }, (err, customer) => {
        if (err) {
            throw err
        }        
        res.render('staff/pastHistoryView', {
            title: 'History',
            customer: customer,
            history: customer.history[req.params.hindex],
            hindex: req.params.hindex
        })
    })
})

router.get('/mail', (req, res) => {
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'convorangroot.gh05@gmail.com',
        pass: 'convogh05'
    }
    });

    var mailOptions = {
    from: 'convorangroot.gh05@gmail.com',
    to: 'ankitmodi31198@gmail.com',
    subject: 'Sending Email using Node.js',
    html: '<h1>Welcome</h1><p>That was easy!</p>',
    attachments: [
        {   // utf-8 string as an attachment
            filename: 'text1.pdf',
        }]
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
})

module.exports = router;