import React from '../lib/react';

import Counter from './components/Counter';
import FuncElement from './components/FuncElement';

class App extends React.Component {
  render() {
    return (
      <div>
        <Counter />
        <FuncElement />
        <div>test</div>
      </div>
    )
  }
}

export default App;
