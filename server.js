import path from 'path'
import cors from 'cors'

import express from 'express'
import cookieParser from 'cookie-parser'

import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    credentials: true
}

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))

// all toys

app.get('/api/toy', (req, res) => {
    const {filterBy = {}} = req.query.params
    // loggerService.info(filterBy)
    toyService.query(filterBy)
        .then((toys) => {
            res.send(toys)
        })
        .catch(err => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
            throw err
        })

}
)

// specific toy

app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then((toy) => {
            res.send(toy)
        })
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

// delete toy

app.delete('/api/toy/:toyId', (req, res) => {
    // const loggedInUser = userService.validateToken(req.cookies.loginToken)
    // loggerService.info('loggedinUser toy delete:', loggedInUser)
    // if (!loggedInUser) {
    //     loggerService.info('cant remove toy (no user)')
    //     return res.status(401).send('cant remove toy')
    // }
    const { toyId } = req.params
    // toyService.remove(toyId, loggedInUser)
    toyService.remove(toyId)
        .then(() => {
            loggerService.info(`Toy ${toyId} removed`)
            res.send('removed')
        })
        .catch((err) => {
            loggerService.error('cannot remove toy', err)
            res.status(400).send('cannot remove toy')
        })
})

// create toy

app.post('/api/toy', (req, res) => {
    const toy = {
        name: req.body.name,
        price: req.body.price,
        labels: req.body.labels,
        inStock: req.body.inStock,
    }
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
}
)

// update toy

app.put('/api/toy/:toyId', (req, res) => {
    const toy = {
        _id: req.body._id,
        name: req.body.name,
        price: req.body.price,
        labels: req.body.labels,
        inStock: req.body.inStock,
    }
    loggerService.info(toy)
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch((err) => {
            loggerService.error('cannot update toy', err)
            res.status(400).send('cannot update toy')
            throw err
        })
})



app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})



const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
