module.exports = (sequelize, DataTypes) => {

    const Step = sequelize.define("step", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true

        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.STRING
        },
        stepNumber: {
            type: DataTypes.INTEGER
        },
        task_id: {
            type: DataTypes.INTEGER,
            references:{
                model: {tableName: 'tasks'},
                key: 'id',
            }
        },

    
    });
    

    return Step

}