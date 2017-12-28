import { VNode } from './VNode'

function setProp(target: HTMLElement, attr: string, value: any) {
  if (attr === 'className') attr = 'class'
  if (attr === 'onClick') {
    target.addEventListener('click', value)
    return
  }
  target.setAttribute(attr, value)
}

function setProps(target: HTMLElement, props: object) {
  Object.keys(props).map(key => setProp(target, key, props[key]))
}

function createElm(vnode: VNode): Node {
  if (vnode.type === 'text') {
    const el = document.createTextNode(vnode.text)
    vnode.el = el
    return el
  }
  const el = document.createElement(vnode.type)
  // console.log(vnode.type, el)
  setProps(el, vnode.props)
  vnode.el = el
  vnode.children.map(createElm).forEach(child => el.appendChild(child))
  return el
}
export { createElm, setProp }
