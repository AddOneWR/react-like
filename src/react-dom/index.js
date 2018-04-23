import render from './Render'

const ReactDOM = {
  render: ( nextElement, container ) => {
      return render( nextElement, container );
  }
}

export default ReactDOM;
