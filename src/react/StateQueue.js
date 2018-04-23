import { renderComponent } from '../react-dom/Diff'

const batchingUpdates = []
const dirtyComponent = []
var isbatchingUpdates = false

function callbackQueue(fn){
  return Promise.resolve().then(fn);
}

export function enqueueSetState(partialState, component){
  if(!isbatchingUpdates){
    callbackQueue(flushBatchedUpdates)
  }

  isbatchingUpdates = true

  batchingUpdates.push({
    partialState,
    component
  })

  if(!dirtyComponent.some(item => item === component)){
    dirtyComponent.push(component)
  }
}

function flushBatchedUpdates(){
  let queueItem, componentItem;
  while(queueItem = batchingUpdates.shift()){
    const { partialState, component } = queueItem;

    if(!component.prevState){
      component.prevState = Object.assign({}, partialState)
    }

    if(typeof partialState == 'function'){
      Object.assign(component.state, partialState(component.prevState, component.props))
    }else{
      Object.assign(component.state, partialState)
    }

    component.prevState = component.state
  }

  while(componentItem = dirtyComponent.shift()){
    renderComponent(componentItem)
  }

  isbatchingUpdates = false
}

export default enqueueSetState;