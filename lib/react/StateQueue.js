import { renderComponent } from '../react-dom/Diff'

const batchingUpdates = []; // 等待更新队列
const dirtyComponent = []; // 已经更新完队列

let isbatchingUpdates = false; // 组件是否处于更新状态

/**
 * @msg: 模拟延时setState，使用promise将执行放到本次循环结束
 * @param {function} fn 待执行函数
 * @return: Promise
 */
function callbackQueue(fn){
  return Promise.resolve().then(fn);
}

/**
 * @msg: 处理State更新队列
 * @param {object} partialState 上次State(即更新前当前状态)
 * @param {ReactComponent} component 执行更新的组件
 * @return: null
 */
export function enqueueSetState(partialState, component){
  // 若非更新状态则调用更新函数
  if(!isbatchingUpdates){
    callbackQueue(flushBatchedUpdates);
  }

  // 设置此时为更新状态
  isbatchingUpdates = true;

  // 将当前状态和组件推入更新队列
  batchingUpdates.push({
    partialState,
    component
  });

  // 已更新完队列中没有当前组件
  if(!dirtyComponent.some(item => item === component)){
    dirtyComponent.push(component);
  }
}

/**
 * @msg: 处理具体State更新业务
 * @return: null
 */
function flushBatchedUpdates(){
  let queueItem, componentItem;

  // 取出待更新队列头并
  while(queueItem = batchingUpdates.shift()){
    const { partialState, component } = queueItem;

    // 获取其前一个状态
    if(!component.prevState){
      component.prevState = Object.assign({}, partialState);
    }

    // 判断是否为函数，若为函数则调用并将状态合并
    if(typeof partialState == 'function'){
      Object.assign(component.state, partialState(component.prevState, component.props));
    } else {
      Object.assign(component.state, partialState);
    }

    // 将前一状态设为当前状态
    component.prevState = component.state;
  }

  // 不断取出已更新队列进行渲染，contaienr为空说明为更新组件
  while(componentItem = dirtyComponent.shift()){
    renderComponent(componentItem);
  }

  // 终止更新状态
  isbatchingUpdates = false;
}

export default enqueueSetState;
