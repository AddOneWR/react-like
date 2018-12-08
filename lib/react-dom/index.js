import render from './Render'

const ReactDOM = {
  /**
   * @msg: 渲染元素
   * @param {dom} nextElement 被渲染的元素
   * @param {dom} container 插入的元素 
   * @return: 
   */
  render: ( nextElement, container ) => {
    return render( nextElement, container );
  }
}

export default ReactDOM;
