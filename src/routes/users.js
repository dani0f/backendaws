const express = require('express');
const user = require('../models/Users');
const router = express.Router();
const UserSchema = require('../models/Users')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//grabbing user info
router.get('/user', (req, res, next) => {
  let token = req.headers.token; //token
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({
      title: 'unauthorized'
    })
    //token is valid
    UserSchema.findOne({ _id: decoded.userId }, (err, user) => {
      return res.status(200).json({
        title: 'user grabbed',
        user: {
          username: user.username,
          name: user.name,
          accessLevel : user.accessLevel,
          _id:user._id
        }
      })
    })

  })
})

router.post('/login', (req, res, next) => {
  UserSchema.findOne({ username: req.body.username }, (err, user) => {
    if (err) return res.status(500).json({
      title: 'server error',
      error: err
    })
    if (!user) {
      return res.status(401).json({
        title: 'user not found',
        error: 'Invalid username or password'
      })
    }
    //incorrect password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        tite: 'login failed',
        error: 'Invalid username or password'
      })
    }
    //IF ALL IS GOOD create a token and send to frontend
    let token = jwt.sign({ userId: user._id}, 'secretkey');
    return res.status(200).json({
      title: 'login sucess',
      token: token
    })
  })
})


router.get('/', async (req,res) => {
   const users = await UserSchema.find();
   res.json(users);
});

router.get('/:id', async (req,res) => {
    const users = await UserSchema.findById(req.params.id);
    res.json(users);
});

router.post('/',async (req,res) =>{
    console.log("create user :",req.body.username)
    const newUser = new UserSchema({
    username: req.body.username,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 10),
    accessLevel: req.body.accessLevel    
    })
    newUser.save(err => {
    if (err) {
      return res.status(400).json({
        title: 'error',
        error: 'username in use'
      })
    }
    return res.status(200).json({
      title: 'create user success'
    })
  })
});
router.put('/:id', async (req,res) =>{
  console.log("edit userid:",req.params.id)
  const pss = req.body.password;
  if (pss == ""){
    try {
      await UserSchema.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        name: req.body.name,
        accessLevel: req.body.accessLevel });           
    } catch (error) {
    }
 
  }
  else{
    try {
      await UserSchema.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10),
        accessLevel: req.body.accessLevel });       
    } catch (error) {
    }
  }
  res.json({
    status: 'user Update'
  })
});
router.delete('/:id',async (req, res) =>{
  console.log("delete userid:",req.params.id)
  try {
    await UserSchema.findByIdAndRemove(req.params.id);
  } catch (error) {
  }
    res.json({
        status: 'user Removed'
    })
});

module.exports = router;
