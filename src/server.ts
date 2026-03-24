import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { Sequelize } from 'sequelize-typescript'
import { db } from './conifg/db'
import budgetRouter from './routes/budgetRouter'

async function connectDB() {
      try{
            await db.authenticate()
            db.sync({alter: true})
            console.log(colors.blue.bold('Conexión existosa a la BD'))
      }catch(error){
            //console.log(error)
            console.log(colors.red.bold('Falló la conexión a la BD'))
      }
}

connectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/budgets', budgetRouter)



export default app