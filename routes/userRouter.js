// import controllers tasks, users
const userController = require('../controllers/userController.js')
//const taskController = require('../controllers/taskController')


// router
const router = require('express').Router()


// use routers

router.get('/allUsers', userController.getAllUsers)

router.post('/addfriend',userController.addFriend)

router.get('/getFriends', userController.getFriends)


// task Url and Controller

//router.get('/allTasks', taskController.getAllTasks)
//router.post('/addTask/:id', taskController.addTask)

// get user tasks
//router.get('/getUsertasks/:id', userController.getUserTasks)




// Users router
router.get('/:id', userController.getOneUser)

router.put('/:id', userController.updateUser)

router.delete('/:id', userController.deleteUser)

// number
router.get('/searchUser/:phoneNum', userController.getUserByNumber)

module.exports = router