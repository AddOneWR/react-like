function setAttribute(key, value, dom){
  if(key === 'className'){
    key = 'class'
  }

  if(typeof value === 'function'){
    dom[key.toLowerCase()] = value || '';
  }else if(key === 'style'){
    if(typeof value === 'string'){
      dom.style.cssText = value || '';
    }else if(typeof value === 'object'){
      for (let name in value) {
        dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
      }
    }
  }else{
    if(value){
      dom.setAttribute(key, value);
    }else{
      dom.removeAttribute(key, value);
    }
  }
}

export default setAttribute;