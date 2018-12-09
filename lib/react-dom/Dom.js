import { addWindowEventListener } from '../../src/EventProxy';

/**
 * @msg: 设置元素attr属性 
 * @param {string} key 属性的key
 * @param {any} value 属性的值
 * @param {dom} dom 被设置属性的元素 
 * @return: null
 */
function setAttribute(key, value, dom){
  // 将className转为class
  if(key === 'className'){
    key = 'class'
  }

  // 若绑定的类型为function则转化成小写后写入dom属性
  if(typeof value === 'function'){
    // 判断是否挂载事件代理，若无则直接写到dom上
    setFuncBus(key, value, dom)
  } else if (key === 'style'){  // 若key为style，则分类讨论
    // 如果style是字符串则直接写入cssText
    if (typeof value === 'string'){
      dom.style.cssText = value || '';
    } else if (typeof value === 'object'){  // 如果是对象则遍历对象，其中数字需要在后面添加px
      for (let name in value) {
        dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
      }
    }
  } else {  // 若为其他则直接调用原生setAttribute方法
    if (value) {
      dom.setAttribute(key, value);
    } else {  // 如果属性值为空则在dom上删除该属性
      dom.removeAttribute(key, value);
    }
  }
}


/**
 * @msg: 事件代理函数
 * @param {string} key 属性的key
 * @param {any} value 属性的值
 * @param {dom} dom 被设置属性的元素 
 * @return: null
 */
function setFuncBus(key, value, dom) {
  let funcKey = key.toLowerCase();
  let nodeName = dom.nodeName;
  
  if(document.eventBus[funcKey]) {
    document.eventBus[funcKey][nodeName] = value || '';
  } else {
    document.eventBus[funcKey] = {};
    document.eventBus[funcKey][nodeName] = value || '';
  }

  addWindowEventListener(funcKey);
}

export default setAttribute;
