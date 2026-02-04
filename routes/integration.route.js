const Router = require('express')
const integrationController = require('../controller/integration.controller')
const authMiddleware = require('../middleware/auth.middleware')

const integrationRouter = Router()

integrationRouter.get('/list', integrationController.getAllintegration)
integrationRouter.get('/list/user/:user_id',authMiddleware, integrationController.getIntegrationByUserID)
integrationRouter.post('/create/user', integrationController.createIntegration)
integrationRouter.patch('/update/user/:id', integrationController.updateIntegrationByID)
integrationRouter.delete('/delete/user/:id', integrationController.deleteIntegration)

module.exports = integrationRouter