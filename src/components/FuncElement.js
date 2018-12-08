import React from '../../lib/react';

const Element = (
  <h1
    id="2"
    onClick={() => console.log(1)}
  >
    Hello, Now Time is : 
    <span style="color: red">{ new Date().toLocaleTimeString()}</span>
  </h1>
)

export default Element;
