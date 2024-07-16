import alarm01 from './alarm-01.png'
import alarm01active from './alarm-01-active.png'

const iconList: Array<{ name: string; path: string }> = []
const modules: any = [alarm01, alarm01active]

for (const key in modules) {
  const reg = /([a-z0-9-]*)\.png/
  const match = reg.exec(key);
  if (match && match[1]) { // 添加检查以确保 match[1] 存在
    iconList.push({
      name: match[1], // 移除不必要的索引访问操作符 !
      path: modules[key].default // 假设每个模块都有一个 default 导出
    });
  }
}
export default iconList
