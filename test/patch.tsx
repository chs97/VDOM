import { render } from '../src/index'
import { h, VNode } from '../src/VNode'
describe('diff and patch', () => {
  it('replace root elm', () => {
    const oldNode = <div /> as VNode
    const newNode = <p /> as VNode
    const el = document.createElement('div')
    render({ el, newVNode: oldNode })
    expect(el.children[0].tagName.toLowerCase()).toBe('div')
    render({ el, newVNode: newNode, oldVNode: oldNode })
    expect(el.children[0].tagName.toLowerCase()).toBe('p')
  })
  it('patch attributes', () => {
    const oldNode = <div className="div" draggable="true" /> as VNode
    const newNode = <div className="new-div" id="div" /> as VNode
    const el = document.createElement('div')
    render({ el, newVNode: oldNode })
    let oldElm = el.children[0]
    expect(oldElm.getAttribute('class')).toBe('div')
    expect(oldElm.getAttribute('draggable')).toBe('true')
    render({ el, newVNode: newNode, oldVNode: oldNode })
    expect(oldElm.getAttribute('class')).toBe('new-div')
    expect(oldElm.getAttribute('id')).toBe('div')
  })
  it('can replace root with children', () => {
    const oldNode = <div className="div" /> as VNode
    const newNode = (
      <ul class="ul" key="key">
        <li class="li" />
        <li class="li" />
      </ul>
    ) as VNode
    const el = document.createElement('div')
    render({ el, newVNode: oldNode })
    let elm = el.children[0]
    expect(elm.getAttribute('class')).toBe('div')
    expect(elm.tagName.toLowerCase()).toBe('div')
    render({ el, newVNode: newNode, oldVNode: oldNode })
    elm = el.children[0]
    expect(elm.tagName.toLowerCase()).toBe('ul')
    expect(elm.children.length).toBe(2)
  })
  it('can remove children', () => {
    const oldNode = (
      <div>
        <p />
        <span />
        <ul />
        <a href="/" />
      </div>
    ) as VNode
    const newNode = (
      <div>
        <p />
        <ul />
      </div>
    ) as VNode
    const el = document.createElement('div')
    render({ el, newVNode: oldNode })
    let elm = el.children[0]
    expect(elm.childNodes.length).toBe(4)
    expect(elm.childNodes[0].nodeName.toLowerCase()).toBe('p')
    expect(elm.childNodes[1].nodeName.toLowerCase()).toBe('span')
    expect(elm.childNodes[2].nodeName.toLowerCase()).toBe('ul')
    expect(elm.childNodes[3].nodeName.toLowerCase()).toBe('a')
    render({ el, newVNode: newNode, oldVNode: oldNode })
    expect(elm.childNodes.length).toBe(2)
    expect(elm.childNodes[0].nodeName.toLowerCase()).toBe('p')
    expect(elm.childNodes[1].nodeName.toLowerCase()).toBe('ul')
  })
  it('can replace a element with same key but different sel', () => {
    const oldNode = (
      <ul>
        <li key={1} />
        <li key={2} />
        <li key={3} />
      </ul>
    ) as VNode
    const newNode = (
      <ul>
        <li key={1} />
        <span key={2} />
        <li key={3} />
      </ul>
    ) as VNode
    const el = document.createElement('div')
    render({ el, newVNode: oldNode })
    let elm = el.children[0]
    expect(elm.childNodes.length).toBe(3)
    expect(elm.childNodes[1].nodeName.toLowerCase()).toBe('li')
    render({ el, newVNode: newNode, oldVNode: oldNode })
    expect(elm.childNodes[1].nodeName.toLowerCase()).toBe('span')
  })
  it('can reverse elements', () => {
    const arr = Array.from({ length: 3 }).map((_, i) => i)
    const oldNode = <ul>{arr.map(i => <li key={i}>{i.toString()}</li>)}</ul> as VNode
    const newNode = <ul>{arr.map(i => <li key={i}>{i.toString()}</li>).reverse()}</ul> as VNode
    const el = document.createElement('div')
    render({ el, newVNode: oldNode })
    render({ el, newVNode: newNode, oldVNode: oldNode })
    let elm = el.children[0]

    const reverseChild = Array.from(elm.childNodes).map(el => parseInt(el.textContent))
    expect(reverseChild).toEqual(arr.reverse())
  })
  it('can reorder elements', () => {
    const oldNode = (
      <div>
        <p />
        <span />
        <ul />
        <a href="/" />
      </div>
    ) as VNode
    const newNode = (
      <div>
        <span />
        <p />
        <a href="/" />
        <ul />
      </div>
    ) as VNode
    const el = document.createElement('div')
    render({ el, newVNode: oldNode })
    let elm = el.children[0]
    expect(elm.childNodes.length).toBe(4)
    expect(elm.childNodes[0].nodeName.toLowerCase()).toBe('p')
    expect(elm.childNodes[1].nodeName.toLowerCase()).toBe('span')
    expect(elm.childNodes[2].nodeName.toLowerCase()).toBe('ul')
    expect(elm.childNodes[3].nodeName.toLowerCase()).toBe('a')
    render({ el, newVNode: newNode, oldVNode: oldNode })
    expect(elm.childNodes.length).toBe(4)
    expect(elm.childNodes[0].nodeName.toLowerCase()).toBe('span')
    expect(elm.childNodes[1].nodeName.toLowerCase()).toBe('p')
    expect(elm.childNodes[2].nodeName.toLowerCase()).toBe('a')
    expect(elm.childNodes[3].nodeName.toLowerCase()).toBe('ul')
  })
})
