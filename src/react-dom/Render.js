import {
  createComponent,
  setComponentProps
} from './Diff';

import setAttribute from './Dom';

/**
 * @msg: 入口render方法
 * @param {ReactElement} nextElement 要插入到DOM中的组件
 * @param {DOMElement} container 要插入到的容器
 */
export function render(nextElement, container){

  if(nextElement == null || container == null) return;

  // 获取渲染元素的基本类型
  const type = typeof nextElement

  // 如果渲染元素为string或者number则直接创建文本节点
  if(type === 'string' || type === 'number'){
    let textNode = document.createTextNode(nextElement);
    return container.appendChild(textNode);
  }

  // 如果渲染元素的tag类型为function， 即其为React组件，则调用diff中的createComponent方法
  // 一般React组件最外层tag即为function
  if(typeof nextElement.tag === 'function'){
    let component = createComponent(nextElement.tag, nextElement.attrs);

    setComponentProps(component, nextElement.attrs, container);

    return render(component.base, container);
  }


  // 如果都不是则创建dom
  const dom = document.createElement(nextElement.tag)

  // 遍历元素attrs并设置到新的dom上
  if(nextElement.attrs){
    Object.keys(nextElement.attrs).map(key => {
      setAttribute(key, nextElement.attrs[key], dom)
    })
  }

  // 递归渲染元素的子元素
  if(nextElement.props){
    // 数组基本类型为object
    if(typeof nextElement.props.children == 'object'){
      nextElement.props.children.forEach(item => {
        render(item, dom)
      })
    } else {
      render(nextElement.props.children, dom)
    }
  }

  // 是否为React组件
  if(nextElement._component){
    // 是否为同一个组件的更新，若是则替换
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

/**
 * @msg: 判断是否为同一个元素
 * @param {dom} item 被判断元素
 * @param {dom} dom 比较参照元素
 * @return: Boolean
 */
function isSameDom(item, dom){
  return (item.nodeName == dom.nodeName && item.nodeType == dom.nodeType && item.nextSibling == dom.nextSibling)
}

export default render;
