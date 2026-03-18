const express = require('express');
const router = express.Router();

const { 
    ambilAntrian, 
    getSemuaAntrian, 
    panggilPasien, 
    selesaikanAntrian 
} = require('../controllers/queueController');

router.post('/', ambilAntrian);
router.get('/', getSemuaAntrian);

router.put('/:id/call', panggilPasien);
router.put('/:id/done', selesaikanAntrian);

module.exports = router;