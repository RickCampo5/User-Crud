const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const bcrypt = require('bcrypt');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req,res,next)=>{
  res.render('signup');
})

router.post('/signup', (req,res,next)=>{
  const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(256));
  req.body.password = hash;
  User.create(req.body)
  .then(user=>
    res.redirect('/')
  )
})

router.post('/', (req,res,next)=>{
  User.findOne({email:req.body.email})
  .then(user=>{
    if(!user) {
      req.body.error = "El Usuario no existe"
      return res.render('index', req.body)
    }
    if (bcrypt.compareSync(req.body.password, user.password)){
      req.session.currentUser = user;
      res.redirect('/board');
    } else{
      req.body.error = "Contraseña Incorrecta"
      res.render('index', req.body)
    }
  })
})

router.get('/logout', (req,res,next)=>{
  req.session.destroy(()=>{
    res.redirect('/');
  })
})

module.exports = router;
