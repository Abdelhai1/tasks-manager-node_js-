const {createPool} = require('mysql')

const pool = createPool({
    host:'localhost',
    user:'root',
    password:'',
    connectionLimit:10,
})

pool.query('select * from car.car_model where id_car_model = 22490' , (err , res) =>{
    return console.log(res)
})