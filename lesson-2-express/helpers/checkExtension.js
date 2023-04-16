function checkExtension(filename) {
  const EXTENSIONS = ["js", "txt", "json", "xml", "html", "css"];
  const extension = filename.split(".").pop();
  const result = EXTENSIONS.includes(extension);
  return {
    extension: extension,
    result,
  };
}
module.exports = checkExtension;
