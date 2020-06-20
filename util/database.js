// const mysql = require('mysql2');

// // It creates pool which handles multiple requests at a time
// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node-complete',
//     password:'codelove_01'
// });

// module.exports=pool.promise();

//After installing sequelize (--)

const Sequelize = require('sequelize')
const sequelize = new Sequelize('node-complete','root','codelove_01',{
    dialect:'mysql',
    host:'localhost'
});
module.exports=sequelize;