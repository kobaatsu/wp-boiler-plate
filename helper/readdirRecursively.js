const { readdir } = require('fs/promises')

module.exports = async function readdirRecursively(dir, files = []) {
  const dirents = await readdir(dir, { withFileTypes: true })
  const dirs = []
  for (const dirent of dirents) {
    if (dirent.isDirectory()) dirs.push(`${dir}/${dirent.name}`)
    if (dirent.isFile()) files.push(`${dir}/${dirent.name}`)
  }
  for (const d of dirs) {
    files = await readdirRecursively(d, files)
  }
  return files
}
