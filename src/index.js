import ReactDOM from '../lib/react-dom';
import React from '../lib/react';
import App from './App';

document.eventBus = {};
window.addEventListener("click", function(e){
  // 获取当前事件所包含的委托元素集合
  let func = document.eventBus['onclick'][e.target.tagName];

  // 如果当前元素被委托则执行
  if(func) {
    func();
  } else {
    // 向上冒泡寻找是否有适合条件的委托函数
    // e.path为层级数组，索引从低到高为 子---->父
    e.path.forEach(item => {
      document.eventBus['onclick'][item.nodeName] ? 
        document.eventBus['onclick'][item.nodeName]() : '';
    });
  }
});

ReactDOM.render(
  <App />,
document.getElementById('root'));
