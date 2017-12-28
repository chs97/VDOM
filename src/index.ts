import { h, VNode } from './VNode'
import { isUndef, isDef } from './utils'
import { createElm, setProp } from './element'
interface render {
  el: Node
  newVNode: VNode
  oldVNode?: VNode
}

function sameVnode(newNode: VNode, oldNode: VNode) {
  // console.log(newNode, oldNode)
  return newNode.key === oldNode.key && newNode.type === oldNode.type
}

function createKeyToOldCh(oldCh: Array<VNode>, start: number, end: number) {
  let key
  const map = {}
  for (let i = start; i <= end; i++) {
    key = oldCh[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}

function findIdxInOld(Node: VNode, oldCh: Array<VNode>, start: number, end: number) {
  for (let i = start; i <= end; i++) {
    const n = oldCh[i]
    if (isDef(n) && sameVnode(Node, n)) return i
  }
}

function patchChildren(newCh: Array<VNode>, oldCh: Array<VNode>, parentElm: Node) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartNode = oldCh[0]
  let newStartNode = newCh[0]
  let oldEndNode = oldCh[oldEndIdx]
  let newEndNode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartNode)) {
      oldStartNode = oldCh[++oldStartIdx] //oldNode已经被移动
    } else if (isUndef(oldEndNode)) {
      oldEndNode = oldCh[--oldEndIdx] //oldNode已经被移动
    } else if (sameVnode(newStartNode, oldStartNode)) {
      // startNode 相似 不需要移动
      patchNode(newStartNode, oldStartNode)
      newStartNode = newCh[++newStartIdx]
      oldStartNode = oldCh[++oldStartIdx]
    } else if (sameVnode(newEndNode, oldEndNode)) {
      // endNode 相似 不需要移动
      patchNode(newEndNode, oldEndNode)
      newEndNode = newCh[--newEndIdx]
      oldEndNode = oldCh[--oldEndIdx]
    } else if (sameVnode(newStartNode, oldEndNode)) {
      patchNode(newStartNode, oldEndNode) //先把子树patch再移动
      parentElm.insertBefore(oldEndNode.el, oldStartNode.el)
      newStartNode = newCh[++newStartIdx]
      oldEndNode = oldCh[--oldEndIdx]
    } else if (sameVnode(newEndNode, oldStartNode)) {
      patchNode(newEndNode, oldStartNode)
      parentElm.insertBefore(oldStartNode.el, oldEndNode.el.nextSibling)
      newEndNode = newCh[--newEndIdx]
      oldStartNode = oldCh[++oldStartIdx]
    } else {
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldCh(oldCh, oldStartIdx, oldEndIdx)
      idxInOld = isDef(newStartNode.key) ? oldKeyToIdx[newStartNode.key] : findIdxInOld(newStartNode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) {
        // node 不存在，创建
        const el = createElm(newStartNode)
        insert(parentElm, el, oldStartNode.el)
      } else {
        let vnodeToMove = oldCh[idxInOld]
        if (sameVnode(newStartNode, vnodeToMove)) {
          patchNode(newStartNode, vnodeToMove)
          oldCh[idxInOld] = undefined //移动后删除
          parentElm.insertBefore(vnodeToMove.el, oldStartNode.el)
        } else {
          // key相同但是不同element
          const el = createElm(newStartNode)
          insert(parentElm, el, oldStartNode.el)
        }
      }
      newStartNode = newCh[++newStartIdx]
    }
  }
  if (oldStartIdx > oldEndIdx) {
    // oldNode 列表扫描完，还没添加完
    const refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].el
    // newCh[newEndIdx].el.nextSibling
    addVNodes(parentElm, refElm, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    removeNodes(oldCh, oldStartIdx, oldEndIdx)
  }
}
function removeNodes(oldCh: Array<VNode>, start: number, end: number) {
  for (let i = start; i <= end; i++) {
    if (isDef(oldCh[i])) removeNode(oldCh[i].el)
  }
}
function removeNode(el: Node) {
  const parentElm = el.parentNode
  if (isDef(parentElm)) {
    parentElm.removeChild(el)
  }
}
function addVNodes(parentElm: Node, refElm: Node, VNodes: Array<VNode>, start: number, end: number) {
  for (let i = start; i <= end; i++) {
    const el = createElm(VNodes[i])
    parentElm.insertBefore(el, refElm)
  }
}
function insert(parent: Node, elm: Node, ref: Node) {
  if (isDef(parent)) {
    if (isDef(ref)) {
      if (ref.parentNode === parent) {
        parent.insertBefore(elm, ref)
      }
    } else {
      parent.appendChild(elm)
    }
  }
}
function patchProps(newVNode: VNode, oldVNode: VNode) {
  const newProps = newVNode.props
  const oldProps = oldVNode.props
  const elm = oldVNode.el as HTMLElement
  Object.keys(newProps).map(key => {
    if (isUndef(oldProps[key])) {
      setProp(elm, key, newProps[key])
    }
  })
  Object.keys(oldProps).map(key => {
    if (isDef(newProps[key])) {
      // console.log(elm, key)
      setProp(elm, key, newProps[key])
    } else {
      elm.removeAttribute(key)
    }
  })
}
function patchNode(newVNode: VNode, oldVNode: VNode) {
  const elm = (newVNode.el = oldVNode.el)
  const oldCh = oldVNode.children
  const newCh = newVNode.children
  if (newVNode.type !== 'text') {
    if (isDef(oldCh) && isDef(newCh)) {
      patchChildren(newCh, oldCh, elm)
    } else if (isDef(newCh)) {
      if (oldVNode.type === 'text') elm.textContent = '' // 清空node的text
      addVNodes(elm, null, newCh, 0, newCh.length - 1)
    } else if (isDef(oldCh)) {
      // 新node的children为空,移除子节点
      removeNodes(oldCh, 0, oldCh.length - 1)
    }
  } else if (newVNode.type === 'text' && oldVNode.type === 'text') {
    // 文本节点
    if (newVNode.text === oldVNode.text) return
    elm.textContent = newVNode.text
  }
  patchProps(newVNode, oldVNode)
}
function render({ el, newVNode, oldVNode }: render) {
  if (isUndef(oldVNode)) {
    el.appendChild(createElm(newVNode))
    // console.log(newVNode)
  } else if (sameVnode(newVNode, oldVNode)) {
    patchNode(newVNode, oldVNode)
  } else {
    removeNode(oldVNode.el)
    el.appendChild(createElm(newVNode))
  }
}
export { render, h }
