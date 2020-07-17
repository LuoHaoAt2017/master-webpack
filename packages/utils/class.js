
export function hasClass(node, className) {
  if (node.classList) {
    return node.classList.contains(className);
  }
  const originClass = node.className;
  const originClasstemp = ` ${originClass} `;
  const classNametemp = ` ${className} `;
  return originClasstemp.indexOf(classNametemp) > -1;
}

export function addClass(node, className) {
  if (node.classList) {
    node.classList.add(className);
  } else if (!hasClass(node, className)) {
    node.className = `${node.className} ${className}`;
  }
}

export function removeClass(node, className) {
  if (node.classList) {
    node.classList.remove(className);
  } else if (hasClass(node, className)) {
    const originClass = node.className;
    const originClasstemp = ` ${originClass} `;
    const classNametemp = ` ${className} `;
    node.className = originClasstemp.replace(classNametemp, '');
  }
}

