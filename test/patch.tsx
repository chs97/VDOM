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
    render({ el: el, newVNode: newNode, oldVNode: oldNode })
    expect(elm.childNodes.length).toBe(2)
    expect(elm.childNodes[0].nodeName.toLowerCase()).toBe('p')
    expect(elm.childNodes[1].nodeName.toLowerCase()).toBe('ul')
  })
})
