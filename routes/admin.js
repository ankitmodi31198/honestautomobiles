var express = require('express');
var router = express.Router();
var session = require('client-sessions')
var Company = require('../models/companymodel')
var Model = require('../models/modelmodel')
var Varient = require('../models/varientmodel')
var Parts = require('../models/partsmodel')
var Services = require('../models/servicemodel')
var Lubricants = require('../models/lubricantmodel')
// var ObjectId = require('mongoose').Types.ObjectId;
/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.loggedin && req.session.username == "mankit") {
    res.render('admin/adminDashboard', {
        title: 'Admin Dashboard'
    })
} else {
    res.redirect('/staff')
}
})

// get all companies
router.get('/companies', (req, res, next) => {
if (req.session.loggedin && req.session.username == "mankit") {
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
} else {
    res.redirect('/staff')
}
})

// add company
router.post('/addCompany', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
  var c = new Company()

  c.name = req.body.company

  c.save((err, company) => {
      if (err) {
          throw err
      } else {
        res.redirect('back')          
      }
  })
} else {
    res.redirect('/staff')
}
})

// get models of company
router.get('/models/:cid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
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
} else {
    res.redirect('/staff')
}
})

// add model for company
router.post('/addModel/:cid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
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
} else {
    res.redirect('/staff')
}
})

// get all varients for model
router.get('/varients/:mid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
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
} else {
    res.redirect('/staff')
}
})

// add varient for model
router.post('/addVarient/:mid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
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
} else {
    res.redirect('/staff')
}
})

// get all parts
router.get('/parts/:vid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
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
} else {
    res.redirect('/staff')
}
})
// insert part to varient
router.post('/addPart/:vid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
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
} else {
    res.redirect('/staff')
}
})

// update part
router.post('/updatePart/:pid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
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
} else {
    res.redirect('/staff')
}
})

// delete part
router.post('/deletePart/:pid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
    Parts.findByIdAndRemove({
        '_id': req.params.pid
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done)
        res.redirect('back')
    })
} else {
    res.redirect('/staff')
}
})

// get all services
router.get('/services/:vid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
    Varient.findById(req.params.vid, (err, varient) => {
        if (err) {
            throw err
        }
        Services.find({
            'varientId': req.params.vid
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
} else {
    res.redirect('/staff')
}
})

// insert service to varient
router.post('/addService/:vid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
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
} else {
    res.redirect('/staff')
}
})

// delete part
router.post('/deleteService/:sid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
    Services.findByIdAndRemove({
        '_id': req.params.sid
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done)
        res.redirect('back')
    })
} else {
    res.redirect('/staff')
}
})

// get all lubricants
router.get('/lubricants/:vid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
    Varient.findById(req.params.vid, (err, varient) => {
        if (err) {
            throw err
        }
        Lubricants.find({
            varientId: req.params.vid
        }, (err, lubricants) => {
            if (err) {
                throw err
            }
            res.render('admin/lubricants', {
                title: 'lubricants',
                lubricants: lubricants,
                varient: varient
            })
        })
    })
} else {
    res.redirect('/staff')
}
})

// add lubricants to varient
router.post('/addLubricant/:vid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
    var l = new Lubricants()

    l.name = req.body.lubricant
    l.price = req.body.price
    l.quantity = req.body.quantity
    l.labour = req.body.labour
    l.validity = req.body.validity
    l.validityKM = req.body.validityKM
    l.varientId = req.params.vid

    l.save((err, lubricants) => {
        if (err) {
            throw err
        }
        console.log(lubricants)
        res.redirect('back')
    })
} else {
    res.redirect('/staff')
}
})

// delete lubricant
router.post('/deleteLubricant/:lid', (req, res) => {
    if (req.session.loggedin && req.session.username == "mankit") {
    Lubricants.findByIdAndRemove({
        '_id': req.params.lid
    }, (err, done) => {
        if (err) {
            throw err
        }
        console.log(done)
        res.redirect('back')
    })
} else {
    res.redirect('/staff')
}
})

module.exports = router;