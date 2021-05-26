// import packages - using ES6 modules instead of CommonJS
import express from 'express'

// define app
const app = express()

// parse JSON bodies
app.use(express.json())

app.listen(3000, () => {
    console.log('RESTful API server running on http://localhost:3000')
})
