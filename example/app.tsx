import { render as r, h } from '../src/index'
import { VNode } from '../src/VNode'

function a() {
  console.log(123)
}
function List() {
  return (
    <div>
      {[1, 2, 3].map(item => <p>{item}</p>)}
      <p id="123" className="12" onClick={a}>
        aaa
      </p>
      <ul>
        <li>asd</li>
        <li>1</li>
        asd
      </ul>
    </div>
  )
}
interface Config {
  sel: string
  data: () => Object
  init?: () => void
  render: () => VNode
}
// 需要拷贝一个副本，否则会发生循环set
function observe(observer: object, data: object, callback) {
  const keys = Object.keys(data)
  Object.defineProperties(
    observer,
    keys.reduce((obj, key) => {
      obj[key] = {
        get() {
          return data[key]
        },
        set(val: any) {
          // console.log(val)
          data[key] = val
          callback()
        }
      }
      return obj
    }, {})
  )
}
function vdom({ sel, data, init, render }: Config) {
  init = init || function() {}
  this.$data = Object.create(null)
  this.rootElm = document.getElementById(sel)
  this._genVNode = render.bind(this.$data)
  this.rerender = function() {
    const newVNode = this._genVNode()
    const oldVNode = this.oldVNode
    r({ el: this.rootElm, newVNode, oldVNode })
    this.oldVNode = newVNode
  }
  observe(this.$data, data(), this.rerender.bind(this))
  this.rerender()
  init.call(this.$data)
}

const app = new vdom({
  sel: 'app',
  render() {
    const lis = this.data.map((v, i) => <li key={i.toString()}>{v}</li>)
    return (
      <ul onClick={a}>
        {lis}
        {List()}
      </ul>
    )
  },
  data() {
    return {
      data: [1, 3, 4]
    }
  },
  init() {
    let count = 0
    const data = [1, 4, 9, 16]
    // setInterval(() => {
    //   this.data = [count++, ...data].sort((a, b) => a - b)
    // }, 1000)
  }
})

// const oldNode = <div className="div" draggable="true" /> as VNode
// const newNode = <div className="new-div" id="div" /> as VNode
// const el = document.createElement('div')
// r({ el, newVNode: oldNode })
// r({ el, newVNode: newNode, oldVNode: oldNode })
// const oldNode = (
//   <div>
//     <p />
//     <span>123</span>
//     <ul />
//     <a href="/" />
//   </div>
// ) as VNode
// const newNode = (
//   <div>
//     <p />
//     <ul />
//   </div>
// ) as VNode
// console.log(oldNode, newNode)
// const el = document.getElementById('app')
// r({ el, newVNode: oldNode })
// r({ el, newVNode: newNode, oldVNode: oldNode })
