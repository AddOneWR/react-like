// 存放事件
export default document.eventBus = {};

/**
 * @msg: 添加全局事件委托
 * @param {string} funcKey 委托事件名  
 * @return: null
 */
export function addWindowEventListener(funcKey) {
  let listenName = funcKey.replace('on', '');
  funcKey = funcKey.toLowerCase();

  // 根据eventbus避免全局事件重复注册
  (!document.eventBus[funcKey] || Object.keys(document.eventBus[funcKey]).length < 2 ) ? 
  window.addEventListener(listenName, function(e){
    // 判断当前元素是否为被委托事件
    let func = document.eventBus[funcKey][e.target.key];
  
    // 如果当前元素被委托则执行
    if(func) {
      func();
    } else {
      // 向上冒泡寻找是否有适合条件的委托函数
      // e.path为层级数组，索引从低到高为 子---->父
      e.path.forEach(item => {
        document.eventBus[funcKey][item.key] ? 
          document.eventBus[funcKey][item.key]() : '';
      });
    }
  }) : null;
}
