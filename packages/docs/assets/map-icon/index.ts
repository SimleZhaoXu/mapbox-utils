const iconList: Array<{ name: string; path: string }> = []
const modules: any = import.meta.globEager('./*.png')
for (const key in modules) {
  const reg = /([a-z0-9-]*)\.png/
  iconList.push({
    name: reg.exec(key)![1],
    path: modules[key].default
  })
}
export default iconList
