const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");
const checkExtension = require("./helpers/checkExtension");
const dataValidation = require("./helpers/dataValidation");

async function createFile(fileName, content) {
  const data = {
    fileName,
    content,
  };
  const { error } = dataValidation(data);
  if (error) {
    console.log(
      chalk.red(`Please specify ${error.details[0].context.key} parameter`));
    return;
  }
  const { result, extension: extension } = checkExtension(fileName);
  if (!result) {
    console.log(
      chalk.red(
        `Sorry, this application doesn't support ${extension} extension!`
      )
    );
    return;
  }
  try {
    await fs.writeFile(path.join(__dirname, "./files", fileName), content, "utf-8");
    console.log(chalk.blue(`File was successfully created`));
  } catch (error) {
    console.log(error);
  }
}

async function getFiles() {
  try {
    const filesArr = await fs.readdir(path.join(__dirname, "./files"));
    if (!filesArr.length) {
      return console.log(chalk.yellow('There are not files in this directory'));
    }
    console.log(filesArr);
  } catch (err) {
    (err) => console.log(err)
  }
}

async function getFile(fileName) {
  try {
    const filesInfo = await fs.readdir(path.join(__dirname, "./files"));
    if (!filesInfo.length) {
      console.log(chalk.yellow('There are not files in this directory'));
      return;
    }
    if (!filesInfo.includes(fileName)) {
      console.log(chalk.yellow(`File with name ${fileName} not found`));
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
    console.dir(objInfo)
  } catch (err) {
    return console.log(err);
  }
}

module.exports = {
  createFile,
  getFiles,
  getFile,
};
