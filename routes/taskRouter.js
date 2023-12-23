// import controllers tasks
const taskController = require('../controllers/taskController.js')

// router
const router = require('express').Router()

// use routers
router.post('/addTask',  taskController.addTask)
router.get('/allTasks', taskController.getAllTasks)

//steps
router.post('/addStep',  taskController.addStep)

router.delete('/:id', taskController.deleteTask)



module.exports = router