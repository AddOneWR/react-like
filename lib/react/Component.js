import { enqueueSetState } from './StateQueue'

class Component {
  constructor(props){
    this.isComponent = true;
    this.isReplace = false;
    this.props = props;
    this.state = {};
  }

  /**
   * @msg: React组件状态设置
   * @param {object} partialState 当前状态 
   * @return: null
   */
  setState(partialState){
    enqueueSetState(partialState, this);
  }
}

export default Component;
