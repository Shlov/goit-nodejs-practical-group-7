const fs = require("fs/promises");
const path = require("path");

const checkExtension = require("./helpers/checkExtension");
const dataValidation = require("./helpers/dataValidation");

async function createFile(req, res, next) {
  // console.log(req.body)
  const {
    fileName,
    content,
  } = req.body;
  const { error } = dataValidation(req.body);
  if (error) {
      res.status(400).json({message: `Please specify ${error.details[0].context.key} parameter`});
    return;
  }
  const { result, extension: extension } = checkExtension(fileName);
  if (!result) {
    res.status(400).json({message: `Sorry, this application doesn't support ${extension} extension!`});
    return;
  }
  try {
    await fs.writeFile(path.join(__dirname, "./files", fileName), content, "utf-8");
    res.status(201).json({message: 'File was successfully created'})
  } catch (err) {
    (err) => res.status(500).json({message: err});
  }
}


async function getFiles(req, res, next) {
  try {
    const filesArr = await fs.readdir(path.join(__dirname, "./files"));
    if (!filesArr.length) {
      return res.status(404).json({message: 'There are not files in this directory'});
    }
    res.json({
      status: 'success',
      data: filesArr});
  } catch (err) {
    (err) => res.status(500).json({message: err});
  }
}

async function getFile(req, res, next) {
  const fileName = req.params.fileName
  try {
    const filesInfo = await fs.readdir(path.join(__dirname, "./files"));
    if (!filesInfo.length) {
      res.json({message: 'There are not files in this directory'})
      return;
    }
    if (!filesInfo.includes(fileName)) {
      res.json({message: `File with name ${fileName} not found`})
      return;
    }
    const fileStat = await fs.stat(path.join(__dirname, "./files", fileName))
    const objInfo = {
      fileName: path.basename(path.join(__dirname, "./files", fileName)),
      extension: path.extname(path.join(__dirname, "./files", fileName)),
      content: await fs.readFile(path.join(__dirname, "./files", fileName), "utf-8"),
      size: fileStat.size,
      date: fileStat.birthtime.toString(),
    }
    res.json({message: objInfo})
  } catch (err) {
    return (err) => res.status(500).json({message: err});
  }
}

module.exports = {
  createFile,
  getFiles,
  getFile
};
