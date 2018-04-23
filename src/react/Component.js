import { enqueueSetState } from './StateQueue'
import { renderComponent } from '../react-dom/Diff'

class Component {
  constructor(props){
    this.isComponent = true
    this.isReplace = false
    this.props = props
    this.state = {}
  }

  setState(partialState){
    enqueueSetState(partialState, this)
  }
}

export default Component;