// 存放事件
export default document.eventBus = {};

export function addWindowEventListener(funcKey) {
  let listenName = funcKey.replace('on', '');
  funcKey = funcKey.toLowerCase();

  // 根据eventbus避免全局事件重复注册
  (!document.eventBus[funcKey] || Object.keys(document.eventBus[funcKey]).length < 2 ) ? 
  window.addEventListener(listenName, function(e){
    // 获取当前事件所包含的委托元素集合
    let func = document.eventBus[funcKey][e.target.tagName];
  
    // 如果当前元素被委托则执行
    if(func) {
      func();
    } else {
      // 向上冒泡寻找是否有适合条件的委托函数
      // e.path为层级数组，索引从低到高为 子---->父
      e.path.forEach(item => {
        document.eventBus[funcKey][item.nodeName] ? 
          document.eventBus[funcKey][item.nodeName]() : '';
      });
    }
  }) : null;
}
