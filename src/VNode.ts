import { isUndef, isText } from './utils'
interface VNode {
  type: string | undefined
  children: Array<VNode>
  props: props
  key: string | undefined
  el: Node | undefined
  text?: string
}
interface props {
  [key: string]: string
}
// 兼容jsx中的map，所以需要flatten map产生的结果是Array<Node>不是Node,Node,Node
function flatten(children) {
  return [].concat.apply([], children)
}
function h(type: string, props: props, ...children: Array<VNode>): VNode {
  props = props || {}
  const key = props.key
  console.log(flatten(children))
  children = flatten(children).map(
    item =>
      isText(item)
        ? {
            type: 'text',
            children: [],
            props: {},
            key: key,
            el: undefined,
            text: item
          }
        : item
  )
  console.log(children)
  return {
    type,
    props,
    children: children,
    key,
    el: undefined
  }
}
export { h, VNode }
