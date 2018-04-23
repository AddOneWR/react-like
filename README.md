## 背景

之前自学了一阵子`React`源码([文章](https://addonedn.github.io/2018/04/18/React%E6%BA%90%E7%A0%81%E9%98%85%E8%AF%BB-1%E7%99%BD%E8%AF%9D/))，感觉自己对`Component`和`setState`,所以这里决定写一个`React-Like`项目加深一下对`React`的理解

## 开始

> 项目使用了`transform-react-jsx`来进行`JSX`和`JS`的转换

### 组件

既然是写`React`，那就先定义一下`React`基本结构

```Javascript
// src/react/index.js
import Component from './Component.js'
import createElement from './CreateReactElement.js'

const React = {
    Component,
    createElement
}

export default React;
```

其中`Component`为基本组件作为父类,`createElement`来创建组件

```Javascript
// src/react/Component.js
import { enqueueSetState } from './StateQueue'

class Component {
  constructor(props){
    this.isComponent = true // 是否为组件
    this.isReplace = false // 是否是更新的组件
    this.props = props
    this.state = {}
  }

  setState(partialState){
    enqueueSetState(partialState, this)
  }
}

export default Component;
```

这里进行了一些基本的初始化, 还定义了`setState`方法，其中调用了`enqueueSetState`(后话)进行组件更新

```Javascript
// src/react/CreateReactElement.js

function createElement(tag, attrs, children){

  var props = {}
  var attrs = attrs || {}

  const childrenLength = arguments.length - 2;
  
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return {
    tag,
    attrs,
    props,
    key: attrs.key || null
  }
}

export default createElement;
```

这里同样进行一些初始化操作，但是对传进来的`children`进行了特殊的处理，利用`arguments`获得`children`长度，之后决定是转化成数组还是直接写到`porps`上去，最后将所有属性作为对象返回，当用户创建`React`对象时会自动调用这个函数

### 渲染

同样我们先定义一个`ReactDom`对象

```Javascript
// src/react-dom/index.js

import render from './Render'

const ReactDOM = {
  render: ( nextElement, container ) => {
      return render( nextElement, container );
  }
}

export default ReactDOM;
```

在这里定义了一个大名鼎鼎的`render`函数，传入两个参数分别为当前的元素和要插入的容器，然后调用`Render`文件中的`render`方法

```Javascript
// src/react-dom/Render.js

import {
  createComponent,
  setComponentProps
} from './Diff'
import setAttribute from './Dom'

/**入口render方法
 * @param {ReactElement} nextElement 要插入到DOM中的组件
 * @param {DOMElement} container 要插入到的容器
 */
export function render(nextElement, container){

  if(nextElement == null || container == null) return;

  if(nextElement.isComponent){
    const component = nextElement;

    if (component._container) {
      if (component.componentWillUpdate){
        component.componentWillUpdate();
      } else if (component.componentWillMount) {
        component.componentWillMount();
      }
    }

    component._container = container;

    nextElement = component.render()
  }

  const type = typeof nextElement

  if(type === 'string' || type === 'number'){
    let textNode = document.createTextNode(nextElement);
    return container.appendChild(textNode);
  }

  if(typeof nextElement.tag === 'function'){
    let component = createComponent(nextElement.tag, nextElement.attrs)
    setComponentProps(component,nextElement.attrs, container)
    return render(component.base, container);
  }

  const dom = document.createElement(nextElement.tag)

  if(nextElement.attrs){
    Object.keys(nextElement.attrs).map(key => {
      setAttribute(key, nextElement.attrs[key], dom)
    })
  }

  if(nextElement.props){
    if(typeof nextElement.props.children == 'object'){
      nextElement.props.children.forEach(item => {
        render(item, dom)
      })
    }else{
      render(nextElement.props.children, dom)
    }
  }

  if(nextElement._component){
    if(nextElement._component.isReplace){
      var arr = Array.from(nextElement._component.parentNode.childNodes)
      arr.map((item,index) => {
        if(isSameDom(item,dom)){
          return container.replaceChild(dom, nextElement._component.parentNode.children[index])
        }
      })
    }
  }
  return container.appendChild(dom)
}

function isSameDom(item, dom){
  return (item.nodeName == dom.nodeName && item.nodeType == dom.nodeType && item.nextSibling == dom.nextSibling)
}

export default render;
```

代码比较长，我们这里分段分析一下

```Javascript
const type = typeof nextElement

if(type === 'string' || type === 'number'){
  let textNode = document.createTextNode(nextElement);
  return container.appendChild(textNode);
}
```

如果元素类型为`string`或`number`则直接创建`TextNode`并直接`append`到`container`中里

```Javascript
if(typeof nextElement.tag === 'function'){
  let component = createComponent(nextElement.tag, nextElement.attrs)
  setComponentProps(component,nextElement.attrs, container)
  return render(component.base, container);
}
```

如果元素的`tag`类型为`function`即为`React`组件，则调用`Diff`中的方法来创建组件(后话)

```Javascript
const dom = document.createElement(nextElement.tag)

if(nextElement.attrs){
  Object.keys(nextElement.attrs).map(key => {
    setAttribute(key, nextElement.attrs[key], dom)
  })
}
```

如果都不是的话即为普通元素，则直接调用`document.createElement`创建`Dom`，之后遍历`attrs`调用`setAttribute`来设置属性，`Object.keys`将对象转化成数组方便遍历，接下来我们看一下`setAttribute`方法

```Javascript
function setAttribute(key, value, dom){
  if(key === 'className'){
    key = 'class'
  }

  if(typeof value === 'function'){
    dom[key.toLowerCase()] = value || '';
  }else if(key === 'style'){
    if(typeof value === 'string'){
      dom.style.cssText = value || '';
    }else if(typeof value === 'object'){
      for (let name in value) {
        dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
      }
    }
  }else{
    if(value){
      dom.setAttribute(key, value);
    }else{
      dom.removeAttribute(key, value);
    }
  }
}

export default setAttribute;
```

+ 先将`className`转化为`class`
+ 若绑定的类型为`function`则转化成小写后写入`dom`属性
+ 若`key`为`style`，则分类讨论，若属性为`string`则写入`cssText`，若为`object`则判断其是否为`number`，若是则自动在后面添加`px`，然后写入`style`
+ 若为其他则直接调用原生`setAttribute`方法
+ 若属性值为空则在`dom`上删除该属性

```Javascript
if(nextElement.props){
  if(typeof nextElement.props.children == 'object'){
    nextElement.props.children.forEach(item => {
      render(item, dom)
    })
  }else{
    render(nextElement.props.children, dom)
  }
}
```

顺着`render`往下看，这里遍历元素的子元素递归渲染

```Javascript
if(nextElement._component){
  if(nextElement._component.isReplace){
    var arr = Array.from(nextElement._component.parentNode.childNodes)
    arr.map((item,index) => {
      if(isSameDom(item,dom)){
        return container.replaceChild(dom, nextElement._component.parentNode.children[index])
      }
    })
  }
}
return container.appendChild(dom)
```

最后判断两次`render`的组件是否为同一个，若为同一个则调用`replaceChild`方法进行替换，否则`appendChild`到容器中

> 未完待续


