// import React from './react'
// import ReactDOM from './react-dom'
import React from './react'
import ReactDOM from './react-dom'

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    }
  }

  componentWillUpdate() {
    console.log( 'update' );
  }

  componentWillMount() {
    console.log( 'mount' );
  }

  onClick() {
    this.setState({
      num: this.state.num + 1
    });
  }

  render() {
    return (
      <div onClick={ () => this.onClick() }>
          <h1>number: {this.state.num}</h1>
          <button>add</button>
      </div>
    );
  }
}


ReactDOM.render(
  <Counter />,
  document.getElementById('root')
)
// setInterval(() => {
//   const Element = (
//     <h1
//     id="2"
//     onClick={() => console.log(1)}
//     >
//       Hello, Now Time is : 
//       <span style="color: red">{ new Date().toLocaleTimeString()}</span>
//     </h1>
//   )
//   ReactDOM.render(
//     <App />,
//     document.getElementById('root')
//   )
// },10000)



