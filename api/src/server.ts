import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'

import routes from './shared/routes'
import uploadConfig from './config/upload'
import './shared/database'
import AppError from './shared/errors/AppError'

const app = express()

app.use(express.json())

app.use('/files', express.static(uploadConfig.directory))

app.use(routes)

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .json({ status: 'error', message: error.message })
    }
  }
)

app.listen(3333, () => {
  console.log('Server started on port 3333.')
})
