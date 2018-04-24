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
