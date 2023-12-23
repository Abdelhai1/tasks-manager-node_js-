const db = require('../models')



// create main Model
const User = db.users
//const Task = db.tasks

const { sequelize } = require('../models'); // Import the Sequelize instance
const { QueryTypes } = require('sequelize');
const bcryptjs = require('bcryptjs')
// main work





// 1. signup



const addUser = async (req, res) => {
    try {
        const { email, password, fullName} = req.body;
        const existingUser = await User.findOne({where: {email: email,},})

        if(existingUser){
            return res.status(400).json({msg : "User with same email already exists!"});
        }
        const hashedPass = await bcryptjs.hash(password,8)
        const query = `
            INSERT INTO users (email, password, fullName,createdAt, updatedAt)
            VALUES (:email, :password, :fullName, NOW(), NOW())
        `;
        
        const values = { email,password: hashedPass, fullName };

        // Execute the raw SQL query
        const [user] = await sequelize.query(query, {
            replacements: values,
            type: QueryTypes.INSERT,
            raw: true,
        });

        console.log('User:', user);

        res.status(200).json({ user }); // Send the user data as JSON
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
};







// 2. get all users

const getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const users = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

        res.status(200).send(users);
        console.log(users)
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};

// 3. get single user

const getOneUser = async (req, res) => {

    try {
        const id = req.params.id;
        const query = 'SELECT * FROM users WHERE id = :id';
        const user = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { id: id },
        });

        if (user.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send(user[0]);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }

}

// 4. update User

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const query = `
            UPDATE users
            SET phoneNum = ? , updatedAt = NOW()
            WHERE id = ?
        `;

        const [rowsUpdated, _] = await sequelize.query(query, {
            replacements: [updatedData.phoneNum, id],
            type: sequelize.QueryTypes.UPDATE,
            returning: true,
        });

        if (rowsUpdated === 0) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send('User updated successfully');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 5. delete user by id

const deleteUser = async (req, res) => {

    try {
        const id = req.params.id;

        // Delete tasks associated with the user
        const deleteTasksQuery = 'DELETE FROM tasks WHERE creator_id = ?';
        await sequelize.query(deleteTasksQuery, {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE,
        });
        // Delete the user Tasks relation
        const deleteUserTasksQuery = 'DELETE FROM user_tasks WHERE user_id = ?';
        await sequelize.query(deleteUserTasksQuery, {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE,
        });
        //user
        const query = 'DELETE FROM users WHERE id = ?';
        const rowsDeleted = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE,
        });

        

        if (rowsDeleted === 0) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send('User is deleted!');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
}



// 6.sign in


const signIn = async (req, res) => {

    try {
        const {email,password} = req.body
        const query = 'SELECT * FROM users WHERE email = :email';
        const user = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { email: email },
        });

        if (user.length === 0) {
            res.status(404).send('User does not exist!');
        } else {
            const isMatch = bcryptjs.compare(password,user.password)
            if(!isMatch){
                return res.status(404).json({msg :'incorrect password!'});
            }
            const token = jwt.sign({id:user.id}, "passwordKey")
            res.json({token , ...user._doc})
            
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }

}


// 7.add friend

const addFriend = async (req, res) => {
    try {
        const {member_id,friend_id} = req.body;

        const query = `
        INSERT INTO friends (member_id, friend_id,createdAt, updatedAt)
        VALUES (?,?, NOW(), NOW())
        `;

        const [friends, __] = await sequelize.query(query, {
            replacements: [member_id,friend_id],
            type: sequelize.QueryTypes.INSERT,
            raw: true,
        });
            res.status(200).send('Friend added successfully');
        
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser,
    signIn,
    addFriend,
}