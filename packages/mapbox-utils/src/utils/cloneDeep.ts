const JS_DATA_TYPE = {
  OBJECT: '[object Object]',
  ARRAY: '[object Array]',
  FUNCTION: '[object Function]',
  MAP: '[object Map]',
  SET: '[object Set]',
  DATE: '[object Date]',
  REGEXP: '[object RegExp]'
}

const COPIER_HANDLER = {
  [JS_DATA_TYPE.OBJECT]: objectCopier,
  [JS_DATA_TYPE.ARRAY]: arrayCopier,
  [JS_DATA_TYPE.MAP]: mapCopier,
  [JS_DATA_TYPE.SET]: setCopier,
  [JS_DATA_TYPE.FUNCTION]: functionCopier,
  [JS_DATA_TYPE.DATE]: dateCopier,
  [JS_DATA_TYPE.REGEXP]: regExpCopier
}

const globalMap = new WeakMap()

/**
 * 深拷贝
 * @param data 被拷贝的数据
 * @returns 拷贝数据
 */
export default function deepClone(data: any) {
  // 普通类型数据则直接返回
  if (!isInstanceOf(data, Object)) return data
  // 循环引用处理
  if (globalMap.has(data)) return globalMap.get(data)

  // 1. 创建对应类型的空白数据
  let clone = getRelativeEmptyData(data)
  globalMap.set(data, clone)

  const copierHandler: Function =
    COPIER_HANDLER[getType(data)] ??
    function () {
      return data
    }

  clone = copierHandler(clone, data)

  return clone
}

/**
 * 对象拷贝
 * @param clone 拷贝对象
 * @param data 被拷贝的对象
 * @returns 拷贝对象
 */
function objectCopier(clone: Record<any, any>, data: Record<any, any>): Record<any, any> {
  Object.keys(data).forEach((key: string) => (clone[key] = deepClone(data[key])))
  return clone
}

/**
 * 数组拷贝
 * @param clone 拷贝数组
 * @param data 被拷贝的数组
 * @returns 拷贝数组
 */
function arrayCopier(clone: any[], data: any[]): any[] {
  data.forEach((item) => clone.push(deepClone(item)))
  return clone
}

/**
 * 映射数据拷贝
 * @param clone 拷贝映射数据
 * @param data 被拷贝的映射数据
 * @returns 拷贝映射数据
 */
function mapCopier(clone: Map<any, any>, data: Map<any, any>): Map<any, any> {
  data.forEach((val, key) => clone.set(key, deepClone(val)))
  return clone
}

/**
 * 集合数据拷贝
 * @param clone 拷贝集合数据
 * @param data 被拷贝的集合数据
 * @returns 拷贝集合数据
 */
function setCopier(clone: Set<any>, data: Set<any>): Set<any> {
  data.forEach((val) => clone.add(deepClone(val)))
  return clone
}

/**
 * 函数拷贝
 * @param clone 拷贝函数
 * @param data 被拷贝的函数
 * @returns 拷贝函数
 */
function functionCopier(clone: Function, data: Function): Function {
  clone = function (this: any, ...args: any) {
    return data.call(this, ...args)
  }
  return clone
}

/**
 * 日期数据拷贝
 * @param clone 拷贝日期数据
 * @param data 被拷贝的日期数据
 * @returns 拷贝日期数据
 */
function dateCopier(clone: Date | number, data: Date | number): Date {
  clone = new Date(data)
  return clone
}

/**
 * 正则拷贝
 * @param clone 拷贝正则
 * @param data 被拷贝的正则
 * @returns 拷贝正则
 */
function regExpCopier(clone: RegExp, data: RegExp): RegExp {
  clone = new RegExp(data.source, data.flags)
  return clone
}

function getType(data: any): string {
  return Object.prototype.toString.call(data)
}

function isInstanceOf(item: any, target: any): boolean {
  return item instanceof target
}

/**
 * 获取对应类型的空白数据
 * @param data 被克隆的数据
 * @returns 对应类型的空白数据
 */
function getRelativeEmptyData(data: any) {
  const Ctor = data.constructor
  return new Ctor()
}
