const express = require('express')
const router = express.Router()
const scraperController = require('../controllers/scraperController')

router.post('/join', scraperController.joinScraper)
router.post('/verify', scraperController.verifyScraper)
router.post('/generateToken', scraperController.generateToken)
router.post('/gettokeninfo', scraperController.getTokenDet)
router.get('/*', scraperController.getError)
router.post('/*', scraperController.notAllowed)

module.exports = router