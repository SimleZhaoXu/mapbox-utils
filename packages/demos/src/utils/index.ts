/*
 * @Author: 汤凡
 * @Date: 2024-07-12 15:35:49
 * @LastEditors: 汤凡
 * @LastEditTime: 2024-07-12 15:35:52
 */
export function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement('a')
  const _body = document.querySelector('body')

  link.href = window.URL.createObjectURL(blob)
  link.download = filename

  // fix Firefox
  link.style.display = 'none'
  _body && _body.appendChild(link)

  link.click()
  _body && _body.removeChild(link)

  window.URL.revokeObjectURL(link.href)
}
