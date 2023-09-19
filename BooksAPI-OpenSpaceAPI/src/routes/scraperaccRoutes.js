const express = require('express')
const router = express.Router()
const scraperaccController = require('../controllers/scraperaccController')

router.post('/join/start', scraperaccController.joinstart)
router.post('/join/verify-jotp', scraperaccController.verifyjotp)
router.post('/join/final-step', scraperaccController.joinfinalstep)
router.get('/join/*', scraperaccController.getError)
router.post('/join/*', scraperaccController.notAllowed)
router.post('/login/start', scraperaccController.loginstart)
router.post('/login/verify-lotp', scraperaccController.verifylotp)
router.get('/login/*', scraperaccController.getError)
router.post('/login/*', scraperaccController.notAllowed)
router.post('/forgot-password/start', scraperaccController.fpstart)
router.post('/forgot-password/verify-fpotp', scraperaccController.verifyfpotp)
router.post('/forgot-password/final-step', scraperaccController.fpfinalstep)

router.post("/generate/token", scraperaccController.genToken)
router.get('/*', scraperaccController.getError)
router.post('/*', scraperaccController.notAllowed)

module.exports = router