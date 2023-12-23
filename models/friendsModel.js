module.exports = (sequelize, DataTypes) => {

    const Friends = sequelize.define("friends", {
        member_id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
        },
        friend_id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
        },
    
    });
    

    return Friends

}