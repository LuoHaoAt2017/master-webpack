export default class Stack {
  constructor() {
    this.store = [];
    this.top = 0;
  }

  push(ele) {
    this.store[this.top] = ele;
    this.top += 1;
  }
  pop() {
    this.top -= 1;
    const top = this.top;
    if (top >= 0) {
      const val = this.store[top];
      this.store.splice(this.top, 1);
      return val;
    }
    return '';
  }
}