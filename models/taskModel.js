module.exports = (sequelize, DataTypes) => {

    const Task = sequelize.define("task", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        dueDate: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING
        },
        creator_id: {
            type: DataTypes.INTEGER,
            references:{
                model: {tableName: 'users'},
                key: 'id',
            }
        },

    
    });
    

    return Task

}