import { render } from '../src/index'
import { h, VNode } from '../src/VNode'

describe('render', () => {
  it('should have attr', () => {
    const vnode = <div id="app" /> as VNode
    const el = document.createElement('div')
    render({ el, newVNode: vnode })
    expect(vnode.props.id).toBe('app')
    const elm = vnode.el as HTMLElement
    expect(elm.getAttribute('id')).toBe('app')
  })
  it('should have key', () => {
    const vnode = <div key="app" /> as VNode
    const el = document.createElement('div')
    render({ el, newVNode: vnode })
    expect(vnode.key).toBe('app')
  })
  it('should have children', () => {
    const vnode = (
      <div>
        <p>123</p>
        <span>456</span>
      </div>
    ) as VNode
    const el = document.createElement('div')
    render({ el, newVNode: vnode })
    expect(vnode.type).toBe('div')
    expect(vnode.children.length).toBe(2)
    expect(vnode.children[0].type).toBe('p')
    expect(vnode.children[1].type).toBe('span')
  })
  it('should create text node', () => {
    const vnode = <div>hello</div> as VNode
    const el = document.createElement('div')
    render({ el, newVNode: vnode })
    expect(vnode.type).toBe('div')
    expect(vnode.children.length).toBe(1)
    expect(vnode.children[0].type).toBe('text')
    expect(vnode.children[0].text).toBe('hello')
  })
})
