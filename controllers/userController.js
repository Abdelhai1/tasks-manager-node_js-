const db = require('../models')
const jwt = require('jsonwebtoken');




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
        const { email, password, fullName,phoneNum} = req.body;
        const existingUser = await User.findOne({where: {email: email,},})

        if(existingUser){
            return res.status(400).json({msg : "User with same email already exists!"});
        }
        const hashedPass = await bcryptjs.hash(password,8)
        const query = `
            INSERT INTO users (email, password, fullName,phoneNum,createdAt, updatedAt)
            VALUES (:email, :password, :fullName, NOW(), NOW())
        `;
        
        const values = { email,password: hashedPass, fullName,phoneNum };

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

        const response = { users: users }; // Wrap users array under the "users" key
        res.status(200).json(response);
        console.log(response);
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
        const token = req.params.token;
        const updatedData = req.body;

        // Decode the token to get the user ID
        const decodedToken = jwt.decode(token);
        if (!decodedToken || !decodedToken.id) {
            return res.status(400).send('Invalid token or missing user ID');
        }
        const id = decodedToken.id;
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
        const token = req.params.token;

        // Decode the token to get the user ID
        const decodedToken = jwt.decode(token);
        if (!decodedToken || !decodedToken.id) {
            return res.status(400).send('Invalid token or missing user ID');
        }
        const id = decodedToken.id;

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
        const { email, password } = req.body;
        const query = 'SELECT * FROM users WHERE email = :email';
        const [user] = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: { email: email },
        });

        if (!user) {
            return res.status(404).send('User does not exist!');
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(404).json({ msg: 'Incorrect password!' });
        }

        const token = jwt.sign({ id: user.id }, 'passwordKey');
        res.json({ token, ...user });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
};



// 7.add friend

const addFriend = async (req, res) => {
    try {
        const { token, friend_id } = req.body;

        // Decode the token and check if it's valid
        const decodedToken = jwt.decode(token);

        if (!decodedToken || !decodedToken.id) {
            return res.status(400).send('Invalid token or missing user ID');
        }

        const member_id = decodedToken.id;

        const query = `
        INSERT INTO friends (member_id, friend_id, createdAt, updatedAt)
        VALUES (?, ?, NOW(), NOW())
        `;

        const [friends, __] = await sequelize.query(query, {
            replacements: [member_id, friend_id],
            type: sequelize.QueryTypes.INSERT,
            raw: true,
        });

        res.status(200).send('Friend added successfully');

    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 8.search user with number


const getUserByNumber = async (req, res) => {

    try {
        const phoneNum = req.params.phoneNum;
        const query = 'SELECT id,email,fullName,phoneNum FROM users WHERE phoneNum = :phoneNum';
        const user = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { phoneNum: phoneNum },
        });

        if (user.length === 0) {
            res.status(404).send('User not found');
        } else {
            const response = { users: [user[0]] }; // Wrap user object under the "user" key
            res.status(200).json(response);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }

}

// 8.get user friends
const getFriends = async (req, res) => {
    try {
        const { token } = req.body;

        // Decode the token and check if it's valid
        const decodedToken = jwt.decode(token);

        if (!decodedToken || !decodedToken.id) {
            return res.status(400).send('Invalid token or missing user ID');
        }

        const member_id = decodedToken.id

        const query = `
        SELECT *
        FROM friends JOIN users
        ON friends.friend_id = users.id OR friends.member_id = users.id
        WHERE (friends.member_id = :member_id OR friends.friend_id = :member_id)
        AND users.id !=  :member_id
        `;

        const friends = await sequelize.query(query, {
            replacements: { member_id },
            type: sequelize.QueryTypes.SELECT,
        });
        const friendsArray = friends.map(friend => ({
            id: friend.id,
            fullName: friend.fullName,
            email: friend.email,
            
        }));
        const result = {friends:friendsArray}
        res.status(200).json(result);

    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser,
    signIn,
    addFriend,
    getUserByNumber,
    getFriends,
}