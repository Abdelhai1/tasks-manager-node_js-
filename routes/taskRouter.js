// import controllers tasks
const taskController = require('../controllers/taskController.js')

// router
const router = require('express').Router()

// use routers
router.post('/addTask',  taskController.addTask)
router.get('/allTasks', taskController.getAllTasks)
router.get('/getUserTasks/:id', taskController.getUserTasks)
//steps
router.post('/addStep',  taskController.addStep)

router.delete('/:id', taskController.deleteTask)

router.get('/getTaskSteps/:id', taskController.getTaskSteps)


module.exports = router