import render from './Render'

/**
 * @msg: 创建组件
 * @param {component} component 组件
 * @param {any} props props
 * @return: ReactComponent
 */
export function createComponent(component, props){
  let instance;

  // 判断是否为class创建的组件
  if (component.prototype && component.prototype.render){
    instance = new component(props);
  } else {
    // 是函数组件，调整constructor
    instance = new component(props);
    instance.constructor = component;
  }

  return instance;
}

/**
 * @msg: 设置组件的props
 * @param {ReactComponent} component 被设置的组件
 * @param {any} props 被设置的props
 * @param {dom} container 要插入到的容器
 * @return: null
 */
export function setComponentProps(component, props, container){
  // 是否没有Base，即是否已经渲染过
  if (!component.base){
    // 是否为初次挂载
    if (component.componentWillMount) 
      component.componentWillMount();
	} else if(component.componentWillReceiveProps){ // 是否接受新的props
		component.componentWillReceiveProps(props);
  }
  
  component.props = props;
  component.parentNode = container;

  renderComponent(component, container);
}

/**
 * @msg: 渲染react组件
 * @param {ReactComponent} component 渲染的组件
 * @param {dom} container 要插入到的容器 
 * @return: null
 */
export function renderComponent(component, container){
  let base;

  // 如果已经渲染并挂载base则检查更新
  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  // 调用组件render
  base = component.render()

  // 如果有base (即非首次渲染
  if (component.base) {
    if (component.componentDidUpdate){
      component.componentDidUpdate();
    }
  } else if(component.componentDidMount) {
    component.componentDidMount();
  }

  // 挂载base，度过首次渲染
  component.base = base;
  base._component = component;

  // 如果container为空则证明是更新组件，将组件parentNode传回render
  if(!container){
    component.isReplace = true
    render(base, component.parentNode)
  }
}
