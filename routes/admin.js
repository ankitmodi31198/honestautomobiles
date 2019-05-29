var express = require('express');
var router = express.Router();
var Company = require('../models/companymodel')
var Model = require('../models/modelmodel')
var Varient = require('../models/varientmodel')
var Parts = require('../models/partsmodel')
// var Services = require('../models/servicemodel')
// var Lubricants = require('../models/lubricantmodel')
// var ObjectId = require('mongoose').Types.ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/adminDashboard', {
        title: 'Admin Dashboard'
    })
});

// get all companies
router.get('/companies', (req, res, next) => {
    Company.find({}, (err, companies) => {
        if (err) {
            throw err;
        } else {
            res.render('admin/companies', {
                title: 'Companies',
                companies: companies
            });
        }
    })
})

// add company
router.post('/addCompany', (req, res) => {
  var c = new Company()

  c.name = req.body.company

  c.save((err, company) => {
      if (err) {
          throw err
      } else {
        res.redirect('back')          
      }
  })
})

// get models of company
router.get('/models/:cid', (req, res) => {
    Company.findById(req.params.cid, (err, company) => {
        if (err) {
            throw err
        }
        Model.find({
            companyId: req.params.cid
        }, (err, models) => {
            if (err) {
                throw err
            } else {
                res.render('admin/models', {
                    title: 'Models',
                    company: company,
                    models: models
                })
            }
        })
    })
})

// add model for company
router.post('/addModel/:cid', (req, res) => {
    var model = req.body.model

    var m = new Model()

    m.name = model
    m.companyId = req.params.cid

    m.save((err, model) => {
        if (err) {
            throw err
        }
        console.log(model)
        res.redirect('back')
    })
})

// get all varients for model
router.get('/varients/:mid', (req, res) => {
    Model.findById(req.params.mid, (err, model) => {
        if (err) {
            throw err
        }
        Varient.find({
            modelId: req.params.mid
        }, (err, varients) => {
            if (err) {
                throw err
            }
            res.render('admin/varients', {
                title: 'Varients',
                varients: varients,
                model: model
            })
        })
    })
})

// add varient for model
router.post('/addVarient/:mid', (req, res) => {
    var varient = req.body.varient

    var v = new Varient()

    v.name = varient
    v.modelId = req.params.mid

    v.save((err, varient) => {
        if (err) {
            throw err
        }
        console.log(varient)
        res.redirect('back')
    })
})

// get all parts
router.get('/parts/:vid', (req, res) => {
    Varient.findById(req.params.vid, (err, varient) => {
        if (err) {
            throw err
        }
        Parts.find({
            varientId: req.params.vid
        }, (err, parts) => {
            if (err) {
                throw err
            }
            res.render('admin/parts', {
                title: 'parts',
                parts: parts,
                varient: varient
            })
        })
    })
})

// insert part to varient
router.post('/addPart/:vid', (req, res) => {
    var p = new Parts()

    p.name = req.body.part
    p.price = req.body.price
    p.quantity = req.body.quantity
    p.labour = req.body.labour
    p.varientId = req.params.vid

    p.save((err, part) => {
        if (err) {
            throw err
        }
        console.log(part)
        res.redirect('back')
    })
})

// update part
router.post('/updatePart/:pid', (req, res) => {
    Parts.findByIdAndUpdate(req.params.pid, {
        $set: {
            name: req.body.part,
            price: req.body.price,
            quantity: req.body.quantity,
            labour: req.body.labour
        }
    }, {
        upsert: true
    }, (err, part) => {
        if (err) {
            throw err
        }
        res.redirect('back')
    })
})

// delete part
router.post('/deletePart/:pid', (req, res) => {
    Parts.findByIdAndRemove({
        _id: req.params.pid
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done)
        res.redirect('back')
    })
})

// get all services
router.get('/services/:vid', (req, res) => {
    Varient.findById(req.params.vid, (err, varient) => {
        if (err) {
            throw err
        }
        Services.find({
            varientId: req.params.vid
        }, (err, services) => {
            if (err) {
                throw err
            }
            res.render('admin/services', {
                title: 'services',
                services: services,
                varient: varient
            })
        })
    })
})

// insert service to varient
router.post('/addService/:vid', (req, res) => {
    var s = new Services()

    s.name = req.body.service
    s.price = req.body.price
    s.details = req.body.details
    s.validity = req.body.validity
    s.validityKM = req.body.validityKM
    s.varientId = req.params.vid

    s.save((err, service) => {
        if (err) {
            throw err
        }
        console.log(service)
        res.redirect('back')
    })
})

// // get all lubricants
// router.get('/lubricants/:vid', (req, res) => {
//     Varient.findById(req.params.vid, (err, varient) => {
//         if (err) {
//             throw err
//         }
//         Lubricants.find({
//             varientId: req.params.vid
//         }, (err, lubricants) => {
//             if (err) {
//                 throw err
//             }
//             res.render('admin/lubricants', {
//                 title: 'lubricants',
//                 lubricants: lubricants,
//                 varient: varient
//             })
//         })
//     })
// })

// // insert lubricants to varient
// router.post('/addLubricant/:vid', (req, res) => {
//     var l = new Lubricants()

//     l.name = req.body.lubricants
//     l.price = req.body.price
//     l.quantity = req.body.quantity
//     l.labour = req.body.labour
//     l.validity = req.body.validity
//     l.validityKM = req.body.validityKM
//     l.varientId = req.params.vid

//     l.save((err, lubricants) => {
//         if (err) {
//             throw err
//         }
//         console.log(lubricants)
//         res.redirect('back')
//     })
// })

module.exports = router;