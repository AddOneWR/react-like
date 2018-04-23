import render from './Render'

const ReactDOM = {
  render: ( nextElement, container ) => {
      container.innerHTML = '';
      return render( nextElement, container );
  }
}

export default ReactDOM;
