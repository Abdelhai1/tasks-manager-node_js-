// import controllers tasks
const taskController = require('../controllers/taskController.js')

// router
const router = require('express').Router()

// use routers
router.post('/addTask',  taskController.addTask)
router.get('/allTasks', taskController.getAllTasks)
router.get('/getUserTasks/', taskController.getUserTasks)
router.delete('/deleteTask/:id', taskController.deleteTask)
router.put('/:id', taskController.updateTask)
//steps
router.post('/addStep',  taskController.addStep)

router.delete('/deleteStep/:id', taskController.deleteStep)

router.get('/getTaskSteps/:id', taskController.getTaskSteps)
router.get('/getNUmberOfDoneSteps/:id', taskController.getNUmberOfDoneSteps)
router.get('/getStepsNumber/:id', taskController.getStepsNumber)
router.get('/getTaskSteps/:id', taskController.getTaskSteps)

module.exports = router