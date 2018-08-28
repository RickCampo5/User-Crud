const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const bcrypt   = require('bcrypt');

function isLogged(req,res,next){
  if(!req.session.currentUser){
    res.redirect('/');
  }else{
    next();
  }
}

router.get('/', isLogged, (req,res)=>{
  res.render('board', req.session.currentUser);
})

router.get('/edit/:id', isLogged, (req,res)=>{
  res.render('edit', req.session.currentUser);
})

router.get('/delete', isLogged, (req,res)=>{
  User.findOneAndRemove({username:req.session.currentUser.username})
  .then(user=>{
    req.session.destroy(()=>{
      res.redirect('/');
    })
  })
})

router.post('/edit/:id', isLogged, (req,res)=>{
  if(req.body.password !== ""){
    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(256));
    req.body.password = hash;
  }else{
    req.body.password = req.session.currentUser.password;
  }
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then(user=>{
    req.session.currentUser = user
    res.redirect('/board');
  })
})

module.exports = router;