/**
 * js dom
 */

export function  hasClass(elements: Element, cName: string){
  return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") );
}

export function addClass(elements: Element, cName: string){
  if(!hasClass(elements, cName)){
    elements.className += " " + cName;
  }
}

export function removeClass(elements: Element, cName: string){
  if( hasClass( elements,cName ) ){
    elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" )," " );
  }
}
