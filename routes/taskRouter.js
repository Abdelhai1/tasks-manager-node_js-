// import controllers tasks
const taskController = require('../controllers/taskController.js')

// router
const router = require('express').Router()

// use routers
router.post('/addTask',  taskController.addTask)
router.get('/allTasks', taskController.getAllTasks)
router.get('/getUserTasks/:token', taskController.getUserTasks)
router.get('/getOneTask/:id', taskController.getOneTask)
router.delete('/deleteTask/:id', taskController.deleteTask)
router.put('/updateTask/:id', taskController.updateTask)
//steps
router.post('/addStep',  taskController.addStep)
router.put('/updateStep/:id', taskController.updateStep)
router.delete('/deleteStep/:id', taskController.deleteStep)

router.get('/getTaskSteps/:id', taskController.getTaskSteps)
router.get('/getNUmberOfDoneSteps/:id', taskController.getNUmberOfDoneSteps)
router.get('/getStepsNumber/:id', taskController.getStepsNumber)
router.get('/getTaskSteps/:id', taskController.getTaskSteps)

module.exports = router