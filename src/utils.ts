function isUndef(v: any): boolean {
  return v === undefined || v === null
}
function isString(v: any): boolean {
  return typeof v === 'string'
}
function isText(v: any): boolean {
  return typeof v === 'string' || typeof v === 'number'
}
function isDef(v: any) {
  return v !== undefined && v !== null
}
export { isUndef, isString, isText, isDef }
