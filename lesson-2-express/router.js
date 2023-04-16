const express = require('express');
const {
  createFile,
  getFiles,
  getFile
} = require('./files')

const router = express.Router();

router.get('/', getFiles);
router.post('/', createFile);
router.get('/:fileName', getFile);

module.exports = router;
