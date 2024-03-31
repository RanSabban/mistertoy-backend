import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getBugs, getBugById, addBug, updateBug, removeBug, addBugMsg, removeBugMsg } from './bug.controller.js'

export const bugRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

bugRoutes.get('/', log, getBugs)
bugRoutes.get('/:id', getBugById)
bugRoutes.post('/', requireAuth, addBug)
bugRoutes.put('/:id', requireAuth, updateBug)
bugRoutes.delete('/:id', requireAuth, removeBug)
// router.delete('/:id', requireAuth, requireAdmin, removeBug)

bugRoutes.post('/:id/msg', requireAuth, addBugMsg)
bugRoutes.delete('/:id/msg/:msgId', requireAuth, removeBugMsg)