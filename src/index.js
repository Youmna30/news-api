const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const cors = require('cors')
require('./db/mongoose')

app.use(cors())
app.use(express.json())

app.use(reporterRouter)
app.use(newsRouter)


app.listen(port,()=>{console.log('Server is running')})