import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

async function query(filterBy={txt:''}) {
    try {
        const criteria = {
            title: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('bug')
        var bugs = await collection.find(criteria).toArray()
        return bugs
    } catch (err) {
        logger.error('cannot find bugs', err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const collection = await dbService.getCollection('bug')
        var bug = collection.findOne({ _id: ObjectId(bugId) })
        return bug
    } catch (err) {
        logger.error(`while finding bug ${bugId}`, err)
        throw err
    }
}

async function remove(bugId) {
    try {
        const collection = await dbService.getCollection('bug')
        await collection.deleteOne({ _id: ObjectId(bugId) })
    } catch (err) {
        logger.error(`cannot remove bug ${bugId}`, err)
        throw err
    }
}

async function add(bug) {
    try {
        const collection = await dbService.getCollection('bug')
        await collection.insertOne(bug)
        return bug
    } catch (err) {
        logger.error('cannot insert bug', err)
        throw err
    }
}

async function update(bug) {
    try {
        const bugToSave = {
            title: bug.title,
            importance: bug.importance
        }
        const collection = await dbService.getCollection('bug')
        await collection.updateOne({ _id: ObjectId(bug._id) }, { $set: bugToSave })
        return bug
    } catch (err) {
        logger.error(`cannot update bug ${bugId}`, err)
        throw err
    }
}

async function addBugMsg(bugId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('bug')
        await collection.updateOne({ _id: ObjectId(bugId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add bug msg ${bugId}`, err)
        throw err
    }
}

async function removeBugMsg(bugId, msgId) {
    try {
        const collection = await dbService.getCollection('bug')
        await collection.updateOne({ _id: ObjectId(bugId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add bug msg ${bugId}`, err)
        throw err
    }
}

export const bugService = {
    remove,
    query,
    getById,
    add,
    update,
    addBugMsg,
    removeBugMsg
}
