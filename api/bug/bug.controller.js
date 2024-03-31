import { bugService } from './bug.service.js'
import { logger } from '../../services/logger.service.js'

export async function getBugs(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
        }
        logger.debug('Getting Bugs', filterBy)
        const bugs = await bugService.query(filterBy)
        res.json(bugs)
    } catch (err) {
        logger.error('Failed to get bugs', err)
        res.status(500).send({ err: 'Failed to get bugs' })
    }
}

export async function getBugById(req, res) {
    try {
        const bugId = req.params.id
        const bug = await bugService.getById(bugId)
        res.json(bug)
    } catch (err) {
        logger.error('Failed to get bug', err)
        res.status(500).send({ err: 'Failed to get bug' })
    }
}

export async function addBug(req, res) {
    const { loggedinUser } = req

    try {
        const bug = req.body
        bug.owner = loggedinUser
        const addedBug = await bugService.add(bug)
        res.json(addedBug)
    } catch (err) {
        logger.error('Failed to add bug', err)
        res.status(500).send({ err: 'Failed to add bug' })
    }
}

export async function updateBug(req, res) {
    try {
        const bug = req.body
        const updatedBug = await bugService.update(bug)
        res.json(updatedBug)
    } catch (err) {
        logger.error('Failed to update bug', err)
        res.status(500).send({ err: 'Failed to update bug' })
    }
}

export async function removeBug(req, res) {
    try {
        const bugId = req.params.id
        await bugService.remove(bugId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove bug', err)
        res.status(500).send({ err: 'Failed to remove bug' })
    }
}

export async function addBugMsg(req, res) {
    const { loggedinUser } = req
    try {
        const bugId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await bugService.addBugMsg(bugId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update bug', err)
        res.status(500).send({ err: 'Failed to update bug' })
    }
}

export async function removeBugMsg(req, res) {
    const { loggedinUser } = req
    try {
        const bugId = req.params.id
        const { msgId } = req.params

        const removedId = await bugService.removeBugMsg(bugId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove bug msg', err)
        res.status(500).send({ err: 'Failed to remove bug msg' })
    }
}