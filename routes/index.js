var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/' , (req, res) => {
    
  res.render('website/index', {
      title: 'Home'
  })
})

router.get('/services', (req, res) => {
  res.render('website/services', {
    title: 'Services'
  })
})

router.get('/aboutUs', (req, res) => {
  res.render('website/aboutUs', {
    title: 'About Us'
  })
})

router.get('/contact', (req, res) => {
  res.render('website/contact', {
    title: 'Contact Us'
  })
})

module.exports = router;
