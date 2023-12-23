module.exports = (sequelize, DataTypes) => {

    const UserTAsk = sequelize.define("user_task", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        
    
    });
    

    return UserTAsk

}