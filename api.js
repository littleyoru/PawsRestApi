// import packages - using ES6 modules instead of CommonJS
import express from 'express'

// routes
import index from './routes/index.js'
import user from './routes/user.js'

// import env from './env.json'

// define app/server
const app = express()

// load JSON parser for bodies
app.use(express.json())

// set port 3000 as default if it is not specified in env
app.set('port', process.env.PORT || 3000)

// Load routes
app.use('/', index)
app.use('/user', user)

// Catch 404 and forwards to error handler
app.use(function(req, res, next) {
  // next(createError(404))
  var err = new Error('Not found')
  err.status = 404
  next(err)
})

// Error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })


// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500)
//     res.json({
//       message: err.message,
//       error: err
//     })
//   })
//   // app.use(errorHandler())
// }

// production error handler
// no stacktraces leaked to user
// app.use((err, req, res, next) => {
//   res.status(err.status || 500)
//   res.json({
//     message: err.message,
//     error: {}
//   })
// })


app.listen(3000, () => {
  console.log('RESTful API server running on http://localhost:3000')
})
