const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('../auth/passport');
const { uploadCsvFile, getCsvFiles, getCsvRows, updateCsvRow , deleteCsvFile, exportCsvFile} = require('../controllers/csvController');

const upload = multer({ dest: 'uploads/' });

// Use passport to protect routes
router.post('/upload',upload.single('file'), passport.authenticate('jwt', { session: false }), uploadCsvFile);
router.get('/files', passport.authenticate('jwt', { session: false }), getCsvFiles);
router.get('/rows/:csvFileId', passport.authenticate('jwt', { session: false }), getCsvRows);
router.put('/rows/:rowId',passport.authenticate('jwt', { session: false }),updateCsvRow);
router.delete('/:fileId', passport.authenticate('jwt', { session: false }), deleteCsvFile);
router.get('/export/:fileId', passport.authenticate('jwt', { session: false }), exportCsvFile);

module.exports = router;
