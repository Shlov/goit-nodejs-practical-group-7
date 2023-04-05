const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");
const checkExtention = require("./helpers/checkExtention");
const dataValidation = require("./helpers/dataValidation");

function createFile(fileName, content) {
  const data = {
    fileName,
    content,
  };
  const { error } = dataValidation(data);
  if (error) {
    console.log(
      chalk.red(`Please specify ${error.details[0].context.key} parameter`)
    );
    return;
  }
  const { result, extention } = checkExtention(fileName);
  if (!result) {
    console.log(
      chalk.red(
        `Sorry, this application doesn't support ${extention} extention!`
      )
    );
    return;
  }
  const filePath = path.join(__dirname, "./files", fileName);
  fs.writeFile(filePath, content, "utf-8")
    .then(() => console.log(chalk.blue(`File was sucessfully created`)))
    .catch((error) => console.log(error));
}

function getFiles() {
  fs.readdir(path.join(__dirname, "./files"))
    .then((data) => {
      if (!data.length) {
        console.log(chalk.yellow('There are not files in this directory'));
      }
      return console.log(data);
    })
    .catch((err) => console.log(err));
}

async function getFile(fileName) {
  let objInfo = {};
  const filesInfo = await fs.readdir(path.join(__dirname, "./files"));
  if (!filesInfo.length) {
    console.log(chalk.yellow('There are not files in this directory'));
  }
  if (!filesInfo.includes(fileName)) {
    console.log(chalk.yellow(`File with name ${fileName} not found`));
    return;
  }

  fs.readFile(path.join(__dirname, "./files", fileName), "utf-8")
    .then((data) => {
      objInfo = {
        fileName: path.basename(path.join(__dirname, "./files", fileName)),
        extention: path.extname(path.join(__dirname, "./files", fileName)),
        content: data,
      };
    })
    .then(() => fs.stat(path.join(__dirname, "./files", fileName)))
    .then((stats) =>
      console.log({
        ...objInfo,
        size: stats.size,
        date: stats.birthtime.toString(),
      })
    )
    .catch((err) => console.log(err));
}


module.exports = {
  createFile,
  getFiles,
  getFile,
};
