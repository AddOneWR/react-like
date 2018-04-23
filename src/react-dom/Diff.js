import Component from '../react/Component'
import render from './Render'


export function createComponent(component, props){
  let instance;
  if(component.prototype && component.prototype.render){
    instance = new component(props)
  }else{
    instance = new component(props)
    instance.constructor = component
    instance.render = function() {
      return this.constructor(props)
    }
  }

  return instance;
}

export function setComponentProps(component, props, container){
  if (!component.base){
    if (component.componentWillMount) 
      component.componentWillMount();
	}else if(component.componentWillReceiveProps){
		component.componentWillReceiveProps(props);
  }
  
  component.props = props;
  component.parentNode = container

  renderComponent(component, container)
}

export function renderComponent(component, container){
  let base;

  // console.log(component)

  if ( component.base && component.componentWillUpdate ) {
    component.componentWillUpdate();
  }

  base = component.render()

  if (component.base) {
    if (component.componentDidUpdate){
      component.componentDidUpdate();
    }
  }else if(component.componentDidMount) {
    component.componentDidMount();
  }

  component.base = base;
  base._component = component;

  if(!container){
    component.isReplace = true
    render(base, component.parentNode)
  }
}


// export function diff(nextElement, dom, container){
//  const result = diffNode(nextElement, dom)
// }

// function diffNode(nextElement, dom){

//   let node = dom;

//   if(nextElement == undefined || nextElement == null || typeof nextElement === 'boolean'){
//     nextElement = ''
//   }

//   if(typeof nextElement === 'number'){
//     nextElement = String(nextElement)
//   }

//   if(typeof nextElement === 'string'){
//     if(dom && dom.nodeType === 3){
//       if(dom.textContent !== nextElement){
//         dom.textContent = nextElement
//       }
//     }else{
//       node = document.createTextNode(nextElement)
//       if (dom && dom.parentNode) {
//         dom.parentNode.replaceChild(node, dom)
//       }
//     }
    
//     return node;
//   }

//   if(!dom || !isSameNode(nextElement, dom)){

//   }
// }

// function isSameNode(nextElement, dom){
//   if(typeof nextElement === 'string' || typeof nextElement === 'number'){
//     return dom.nodeType === 3;
//   }

//   if(typeof nextElement.tag === 'string'){
//     return dom.nodeName.toLowerCase() === nextElement.tag.toLowerCase();
//   }

//   return dom && dom._component && dom._component.constructor === nextElement.tag;
// }


