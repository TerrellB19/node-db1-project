const db = require('../../data/db-config')

const Account = require('./accounts-model')

exports.checkAccountPayload = (req, res, next) => {
  // DO YOUR MAGIC
  // Note: you can either write "manual" validation logic
  // or use the Yup library (not currently installed)
  try {
    //
    const { name , budget } = req.body
    if (name === undefined || budget === undefined){
      return res.status(400).json({ message: "name and budget are required" })
    } else if (name.trim().length < 3 || name.trim().length > 100) {
      return res.status(400).json({ message: "name of account must be between 3 and 100" })
    } else if (typeof budget != 'number' || isNaN(budget)){
      return res.status(400).json({ message: "budget of account must be a number" })
    }else if (budget < 0 || budget > 1000000){
      return res.status(400).json({ message: "budget of account is too large or too small" })
    } else {
      return next()
    }


  } catch(err){
    next(err)
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    //
    const name = req.body.name
    const exsists = await db('accounts').where('name', name.trim()).first()

    if(exsists){
      res.status(400).json({
        message: 'that name is taken'
      })
    } else {
      next()
    }
      
     
  } catch(err){
    next(err)
  }
}

exports.checkAccountId = async (req, res, next) => {
  try{
    const accounts = await Account.getById(req.params.id)
      if( !accounts ) {     
        return res.status(404).json({
          message: 'account not found'
        }) 
    } else {
      req.account = accounts
      
      return next()
    }
       
  }catch(err) {
    next(err)
  }
}
