function createElement(tag, attrs, children){

  var props = {}
  var attrs = attrs || {}

  const childrenLength = arguments.length - 2;
  
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return {
    tag,
    attrs,
    props,
    key: attrs.key || null
  }
}

export default createElement;