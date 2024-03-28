import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = getDefaultFilter()) {
    // addfilters
    const {sortBy} = filterBy
    let toysToReturn = toys
    if (filterBy.name) {
        const regex = new RegExp(filterBy.name, 'i')
        toysToReturn = toysToReturn.filter(toy => regex.test(toy.name))
      }
      if (filterBy.price) {
        toysToReturn = toysToReturn.filter(toy => toy.price >= filterBy.price)
      }
      if (filterBy.stock === 'stock') {
        toysToReturn = toysToReturn.filter(toy => toy.inStock)
      }
      if (filterBy.stock === 'notstock') {
        toysToReturn = toysToReturn.filter(toy => !toy.inStock)
      }
      if (filterBy.label && filterBy.label !== 'all') {
        toysToReturn = toysToReturn.filter(toy => toy.labels.includes(filterBy.label))
      }
      if (sortBy.createdAt){
        toysToReturn = toysToReturn.sort((toyA,toyB) => (toyA.createdAt - toyB.createdAt) * sortBy.createdAt)
      }
      if (sortBy.name){
        toysToReturn = toysToReturn.sort((toyA,toyB) => toyA.name.localeCompare(toyB.name) * sortBy.name)
      }
      if (sortBy.price){
        toysToReturn = toysToReturn.sort((toyA,toyB) => (toyA.price - toyB.price) * sortBy.price)
      }


    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No such toy')
    const toy = toys[idx]
    // if (!loggedinUser.isAdmin && toy.owner._id !== loggedinUser.id) {
    //     return Promise.reject('Not your toy')
    // }
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        if (!toyToUpdate) return Promise.reject('cannot find this toy')
        // if (!loggedInUser.isAdmin && toyToUpdate.owner._id !== loggedinUser._id) {
        //     return Promise.reject('Not your toy')
        // }
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toy = toyToUpdate
    }
    else {
        toy._id = utilService.makeId()
        // toy.owner = {
        //     fullname: loggedInUser.fullname,
        //     _id: loggedInUser._id,
        //     isAdmin: loggedInUser.isAdmin
        // }
        toys.push(toy)
    }
    return _saveToysToFile().then(() => toy)
}





function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}


function getDefaultFilter() {
    return {

    }
}

