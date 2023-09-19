const express = require('express')
const router = express.Router()
const linksController = require('../controllers/linksController')

router.post('/get', linksController.get)
router.post('/add', linksController.add)
router.get('/*', linksController.getError)
router.post('/*', linksController.notAllowed)

module.exports = router