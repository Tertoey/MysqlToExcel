const mysql = require('mysql2')
const express = require('express')
const dbConnect = require('./mysql/dbConnect')
const dbQuery = require('./mysql/dbQuery')
const {writeToExcel} = require('./excel/excel1')
const app = express()

app.use(express.json()) // for parsing application/json

app.get('/test',(req,res)=>{
    dbConnect.query(dbQuery.Dairy_report,(err,result)=>{
        if(err) return res.json({message:"something went wrong"})
        res.json({data:result})
    })
})

app.get('/select',(req,res)=>{
    const {startTs,endTs} = req.query
    const key = req.query.key.split(',')
    console.log(key)
    dbConnect.query(`SELECT Timestamp,${key.join(', ')} FROM stock WHERE Timestamp >= ? AND Timestamp <= ?`,[startTs, endTs],async(err,result)=>{
        if(err) return res.json({message:"something went wrong",err})
        try{

            for (const data of result){
                await writeToExcel(data)
        }
        res.json({message:"success",result:result})
        }catch(err){
            res.json({message:err})
        }
    })
})

////////////////////////////////////////////////////////////////
// get only last value
// const c = new Map()
// app.get('/par/:id',(req,res)=>{
//     const q = req.params.id
//     const a = {
//         data: q+1,
//         data2: q+2,
//     }
//     c.set('data',a)
//     res.send(a)
// })

// setInterval(()=>{console.log(c.get('data'))},10000)
//////////////////////////////////////////////////////////////////


// Start the server
const port = 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });


