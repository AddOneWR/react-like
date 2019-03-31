import {
  createComponent,
  setComponentProps,
  domDiffMain
} from './Diff';
import { getOwnKey } from '../util/util';
import setAttribute from './Dom';

/**
 * @msg: 入口render方法
 * @param {ReactElement} nextElement 要插入到DOM中的组件
 * @param {DOMElement} container 要插入到的容器
 */
export function render(nextElement, container){
  if(nextElement == null || container == null) return;

  // 获取渲染元素的基本类型
  const type = typeof nextElement;

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

  // 如果为普通元素(即函数组件)，则获取其内一层tag(即其真实dom)
  if(nextElement.tag.tag && typeof nextElement.tag === 'object') {
    nextElement = nextElement.tag;
  }

  // 如果都不是则创建dom
  const dom = document.createElement(nextElement.tag);

  // 设置dom的key用来标识接受事件委托的元素
  dom.key = getOwnKey();

  // 遍历元素attrs并设置到新的dom上
  if(nextElement.attrs){
    Object.keys(nextElement.attrs).map(key => {
      setAttribute(key, nextElement.attrs[key], dom);
    })
  }

  // 递归渲染元素的子元素
  if(nextElement.props){
    // 数组基本类型为object
    if(typeof nextElement.props.children == 'object'){
      nextElement.props.children.forEach(item => {
        render(item, dom);
      })
    } else {
      render(nextElement.props.children, dom);
    }
  }


  let isSame = false;
  // 是否为React组件
  if(nextElement._component){
    // 是否为同一个组件的更新，若是则替换
    if(nextElement._component.isReplace){
      let arr = Array.from(nextElement._component.parentNode.childNodes);
      for(let i = 0 ; i < arr.length ; i++) {
        if(isSameDom(arr[i], dom)) {
          isSame = true;
          return container.replaceChild(dom, nextElement._component.parentNode.children[i]);
        }
      }
    }
  }

  // 如果替换了元素则不添加元素
  !isSame && container.appendChild(dom);
}

/**
 * @msg: 判断是否为同一个元素
 * @param {dom} item 被判断元素
 * @param {dom} dom 比较参照元素
 * @return: Boolean
 */
function isSameDom(item, dom){
  if(item.nodeName !== dom.nodeName) return false;
  let isSame = domDiffMain(item.childNodes, dom.childNodes);
  return isSame;
}

export default render;
