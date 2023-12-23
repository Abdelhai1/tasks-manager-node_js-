module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true

        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true

        },
        password: {
            type: DataTypes.STRING
        },
        fullName: {
            type: DataTypes.STRING
        },
        phoneNum: {
            type: DataTypes.STRING,
        }
    
    })

    return User

}