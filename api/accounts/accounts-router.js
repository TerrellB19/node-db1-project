const router = require('express').Router()
const md = require('./accounts-middleware')
const db = require('../../data/db-config')
const Account = require('./accounts-model')


router.get('/', async (req, res, next) => { 
  try {

      const accounts = await Account.getAll()
      res.json(accounts)

  } catch (err){
    next(err)
  }
})


router.get('/:id', md.checkAccountId, (req, res, next) => { 
    res.json(req.account)
})


router.post('/', md.checkAccountPayload, md.checkAccountNameUnique, async (req, res, next) => {
  
    try {
      const { name, budget } = req.body
      const newAccount = await Account.create({
        name: name.trim(),
        budget: budget
      })  
      res.status(201).json(newAccount)
  } catch (err){
    next(err)
  }
})


router.put('/:id',md.checkAccountId, md.checkAccountPayload, md.checkAccountNameUnique, async (req, res, next) => {
  try {
    const updateAccount = await Account.updateById(req.params.id, req.body)
    res.status(200).json(updateAccount)
  } catch (err){
  next(err)
  }
});


router.delete('/:id', md.checkAccountId, async (req, res, next) => {
  try {
    await Account.deleteById(req.params.id)
    const allAccounts = await Account.getAll()
    res.status(200).json(allAccounts)
  } catch (err){
  next(err)
  }
})



router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
  })
})

module.exports = router;
