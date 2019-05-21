const Joi = require('joi')

module.exports = {
  register (req, res, next){
    const validator = {
        username: Joi.string().regex(
            new RegExp('^[a-zA-Z][a-zA-Z0-9]{3,16}$')
        ),
        password: Joi.string().regex(
            new RegExp('^[a-zA-Z0-9]{8,16}$')
        ),
        name: Joi.string()
    }
    const {error, value} = Joi.validate(req.body, validator)
    if (error) {
        switch (error.details[0].context.key) {
            case 'username':
                res.status(400).send({
                    error: 'Incorrect username: Must contain 4-16 characters with initial character alphabetical'
                })
                break
            case 'password':
                res.status(400).send({
                    error: 'Incorrect password: Must contain 8-16 alphanumeric characters'
                })
                break
            default:
                res.status(400).send({
                    error: 'Invalid registration'
                })
        }
    } else { 
        next()
    }
  },
  login (req, res, next){
    const validator = {
        username: Joi.string().regex(
            new RegExp('^[a-zA-Z][a-zA-Z0-9]{3,16}$')
        ),
        password: Joi.string().regex(
            new RegExp('^[a-zA-Z0-9]{8,16}$')
        )
    }
    const {error, value} = Joi.validate(req.body, validator)
    if (error) {
        switch (error.details[0].context.key) {
            case 'username':
                res.status(400).send({
                    error: 'Incorrect login information'
                })
                break
            case 'password':
                res.status(400).send({
                    error: 'Incorrect login information'
                })
                break
            default:
                res.status(400).send({
                    error: 'Incorrect login information'
                })
            }
    } else { 
        next()
    }
  }
}