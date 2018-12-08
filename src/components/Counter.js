import React from '../../lib/react';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    }
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

export default Counter;
