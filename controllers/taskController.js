const db = require('../models')

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

        const { creator_id, title, description, dueDate, members } = req.body;

        // mqdrtsh njib id direct b3d l query aya drt bhadi predefined qdrt njib id b3dha
        const task = await Task.create({
            creator_id,
            title,
            description,
            dueDate,
        });
        const taskId =task.id;
        const insertTaskMemberQuery = `
            INSERT INTO user_tasks (user_id,task_id,createdAt,updatedAt)
            VALUES (?,?,NOW(),NOW())
        `;

        for (let index = 0; index < members.length; index++) {
            const member_id = members[index];
            const [userTask] = await sequelize.query(insertTaskMemberQuery, {
                replacements: [member_id,taskId],
                type: QueryTypes.INSERT,
            });
            //res.status(200).send({userTask})
        }


        res.status(200).send({task})
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
        const {title, status, description,taskId } = req.body;

        const insertStepQuery = `
            INSERT INTO Steps (title, status,description,task_id,createdAt,updatedAt)
            VALUES (?, ?, ?,?,NOW(),NOW())
        `;

        const [Step, _] = await sequelize.query(insertStepQuery, {
            replacements: [title, status, description,taskId],
            type: sequelize.QueryTypes.INSERT,
        });

        res.status(200).send({Step})
        console.log("account has been hacked");
    } catch (error) {
        console.error('Error adding Step:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 5.get task steps

const getTaskSteps = async (req, res) => {

    try {
        const task_id = req.params.id
        const query = 'SELECT * FROM steps where task_id=:task_id';
        const steps = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { task_id: task_id },
        });

        res.status(200).send(steps);
        console.log(steps)
    } catch (error) {
        console.error('Error fetching steps:', error);
        res.status(500).send('Internal Server Error');
    }

    

}

// 6.get user tasks

async function getUserTasks(req, res) {
    try {
    const user_id = req.params.id;
    const query = `
        SELECT
        tasks.id as task_id,
        tasks.title,
        tasks.description
        FROM
        user_tasks
        JOIN
        tasks ON user_tasks.task_id = tasks.id
        WHERE
        user_tasks.user_id = :user_id;
    `;

    const [rows] = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { user_id: user_id },
    });

    res.status(200).json(rows);
    console.log(rows);
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

// 7. delete step by id

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
            res.status(200).json(number);
        }
    } catch (error) {
        console.error('Error getting number of done Steps:', error);
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

}