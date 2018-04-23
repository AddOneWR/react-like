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
      const value = nextElement.attrs[key];

      //转换className
      if(key === 'className'){
        key = 'class'
      }

      //转换监听函数
      if(typeof value === 'function'){
        dom[key.toLowerCase()] = value;
      }else{
        setAttribute(key, nextElement.attrs[key], dom)
      }
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

  // console.log(nextElement)

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