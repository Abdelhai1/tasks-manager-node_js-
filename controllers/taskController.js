const db = require('../models')
const jwt = require('jsonwebtoken');

// model
const User = db.users
const Task = db.tasks
const Step = db.steps
const UserTask = db.userTask
// functions

const { sequelize } = require('../models'); // Import the Sequelize instance
const { QueryTypes } = require('sequelize');
//1. Add task

const addTask = async (req, res) => {

    try {

        const { token, title, description,status, dueDate, members } = req.body;

        // mqdrtsh njib id direct b3d l query aya drt bhadi predefined qdrt njib id b3dha

        //Decode the token to get the user ID
        const decodedToken = jwt.decode(token);
        if (!decodedToken || !decodedToken.id) {
            return res.status(400).send('Invalid token or missing user ID');
        }
        const creator_id = decodedToken.id;
        const task = await Task.create({
            creator_id,
            title,
            description,
            status,
            dueDate,
        });
        const taskId =task.id;
        const insertTaskMemberQuery = `
            INSERT INTO user_tasks (user_id,task_id,createdAt,updatedAt)
            VALUES (?,?,NOW(),NOW())
        `;
        const [userTask] = await sequelize.query(insertTaskMemberQuery, {
            replacements: [creator_id,taskId],
            type: QueryTypes.INSERT,
        });
        for (let index = 0; index < members.length; index++) {
            const member_id = members[index];
            const [userTask] = await sequelize.query(insertTaskMemberQuery, {
                replacements: [member_id,taskId],
                type: QueryTypes.INSERT,
            });
            //res.status(200).send({userTask})
        }


        res.status(200).json({ task: [task.dataValues] });
        console.log({ task: [task.dataValues] });

    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 2. Get All tasks

const getAllTasks = async (req, res) => {

    try {
        const query = 'SELECT * FROM tasks';
        const tasks = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

        res.status(200).send(tasks);
        console.log(tasks)
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }

    

}

// 3.delete task

const deleteTask = async (req, res) => {

    try {
        const id = req.params.id;
        // Delete steps associated with the task
        const deleteStepsQuery = 'DELETE FROM steps WHERE task_id = ?';
        await sequelize.query(deleteStepsQuery, {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE,
        });
        // Delete relation between users associated with the task
        const deleteUserTasksQuery = 'DELETE FROM user_tasks WHERE task_id = ?';
        await sequelize.query(deleteUserTasksQuery, {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE,
        });
        //task
        const query = 'DELETE FROM tasks WHERE id = ?';
        const rowsDeleted = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE,
        });

        

        if (rowsDeleted === 0) {
            res.status(404).send('task not found');
        } else {
            res.status(200).send('task is deleted!');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
}


// 4.add step

const addStep = async (req, res) => {

    try {
        const {title, status, description,stepNumber,task_id } = req.body;

        const insertStepQuery = `
            INSERT INTO Steps (title, status,description,stepNumber,task_id,createdAt,updatedAt)
            VALUES (?, ?, ?,?,?,NOW(),NOW())
        `;

        const [Step, _] = await sequelize.query(insertStepQuery, {
            replacements: [title, status, description,stepNumber,task_id],
            type: sequelize.QueryTypes.INSERT,
        });

        res.status(200).send({Step})
    } catch (error) {
        console.error('Error adding Step:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 5.get task steps

const getTaskSteps = async (req, res) => {

    try {
        const task_id = req.params.id
        const query = 'SELECT id as stepId,title,description,stepNumber,status FROM steps where task_id=:task_id';
        const steps = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { task_id: task_id },
        });
        const formattedResponse = { steps: steps }; 
        res.status(200).send(formattedResponse);
        console.log(formattedResponse)
    } catch (error) {
        console.error('Error fetching steps:', error);
        res.status(500).send('Internal Server Error');
    }

    

}

// 6.get user tasks

async function getUserTasks(req, res) {
    try {
        const token = req.params.token;

        const decodedToken = jwt.decode(token);
        if (!decodedToken || !decodedToken.id) {
            return res.status(400).send('Invalid token or missing user ID');
        }
        const uid = decodedToken.id;

        const query = `
            SELECT
                tasks.id as task_id,
                tasks.title,
                tasks.description,
                tasks.dueDate,
                tasks.status
            FROM
                user_tasks
            JOIN
                tasks ON user_tasks.task_id = tasks.id
            WHERE
                user_tasks.user_id = :uid;
        `;

        const rows = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { uid },
        });

        const formattedResponse = { UserTask: rows }; 

        res.status(200).json(formattedResponse);
        console.log(formattedResponse);
    } catch (error) {
        console.error('Error fetching user tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// 7. delete step by id

const deleteStep = async (req, res) => {

    try {
        const id = req.params.id;
        //Step
        const query = 'DELETE FROM steps WHERE id = ?';
        const rowsDeleted = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE,
        });

        if (rowsDeleted === 0) {
            res.status(404).send('Step not found');
        } else {
            res.status(200).send('Step is deleted!');
        }
    } catch (error) {
        console.error('Error deleting Step:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 8. number of done steps

const getNUmberOfDoneSteps = async (req, res) => {

    try {
        const id = req.params.id;
        //Step
        const query = 'SELECT COUNT(*) as number FROM steps WHERE task_id = ? AND status = "done"';
        const number = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.SELECT,
        });

        

        if (number === 0) {
            res.status(404).send('Step not found');
        } else {
            res.status(200).json({number});
            console.log({number});
                }
    } catch (error) {
        console.error('Error getting number of done Steps:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 9. update task


const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const query = `
            UPDATE tasks
            SET title = ?, status = ?, description = ?, dueDate = ? , updatedAt = NOW()
            WHERE id = ?
        `;

        const [rowsUpdated, _] = await sequelize.query(query, {
            replacements: [updatedData.title, updatedData.status, updatedData.description, updatedData.dueDate, id],
            type: sequelize.QueryTypes.UPDATE,
            returning: true,
        });

        if (rowsUpdated === 0) {
            res.status(404).send('task not found');
        } else {
            res.status(200).send('task updated successfully');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 10. getStepsNumber

const getStepsNumber = async (req, res) => {

    try {
        const id = req.params.id;
        //Step
        const query = 'SELECT COUNT(*) as number FROM steps WHERE task_id = ? ';
        const number = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.SELECT,
        });

        

        if (number === 0) {
            res.status(404).send('Steps not found');
        } else {
            res.status(200).json({number});
            console.log({number});

        }
    } catch (error) {
        console.error('Error getting number of done Steps:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 11. get single task

const getOneTask = async (req, res) => {

    try {
        const id = req.params.id;
        const query = 'SELECT id as task_id,title,description,dueDate FROM tasks WHERE id = :id';
        const UserTask = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { id: id },
        });

        if (UserTask.length === 0) {
            res.status(404).send('Task not found');
        } else {
            res.status(200).json({UserTask});
            console.log({UserTask});

        }
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).send('Internal Server Error');
    }

}

// 4. update Step

const updateStep = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const query = `
            UPDATE steps
            SET title = ?, status = ?, description = ?, updatedAt = NOW()
            WHERE id = ?
        `;

        const [rowsUpdated, _] = await sequelize.query(query, {
            replacements: [updatedData.title, updatedData.status, updatedData.description, id],
            type: sequelize.QueryTypes.UPDATE,
            returning: true,
        });

        if (rowsUpdated === 0) {
            res.status(404).send('Step not found');
        } else {
            res.status(200).send('Step updated successfully');
        }
    } catch (error) {
        console.error('Error updating Step:', error);
        res.status(500).send('Internal Server Error');
    }
}
module.exports = {
    addTask,
    getAllTasks,
    deleteTask,
    addStep,
    getTaskSteps,
    getUserTasks,
    deleteStep,
    getNUmberOfDoneSteps,
    updateTask,
    getStepsNumber,
    getOneTask,
    updateStep
}