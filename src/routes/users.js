const express = require('express');
const user = require('../models/Users');
const router = express.Router();
const UserSchema = require('../models/Users')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//grabbing user info
router.get('/user', (req, res, next) => {
  console.log(req.headers.token)
  let token = req.headers.token; //token
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({
      title: 'unauthorized'
    })
    //token is valid
    UserSchema.findOne({ _id: decoded.userId }, (err, user) => {
      console.log(user)
      if (err) return console.log(err)
      return res.status(200).json({
        title: 'user grabbed',
        user: {
          username: user.username,
          name: user.name,
          accessLevel : user.accessLevel
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
        error: 'invalid credentials'
      })
    }
    //incorrect password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        tite: 'login failed',
        error: 'invalid credentials'
      })
    }
    //IF ALL IS GOOD create a token and send to frontend
    console.log("login")
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
    const newUser = new UserSchema({
    username: req.body.username,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 10)
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
    await UserSchema.findByIdAndUpdate(req.params.id , req.body);
    res.json({
        status: 'user Update'
    })

});
router.delete('/:id',async (req, res) =>{
    await UserSchema.findByIdAndRemove(req.params.id);
    res.json({
        status: 'user Removed'
    })
});

module.exports = router;