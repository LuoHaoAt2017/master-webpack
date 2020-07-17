import Stack from './stack';
import CalcEval from './calculate-eval';
import math from '../../../instance/calculator/function';

export function parseExpression(expression) {
  // 输入的表达式每一个运算数和运算符之间都会是空格分割
  // 先将表达式分割成数组并去掉空的
  let items = expression.split(' ');
  items = items.filter(item => item !== '');
  const outItems = []; // 输出队列
  const stack = new Stack(); // 保存运算符的栈
  const reg = /\d/; // 匹配0-9之间的数字
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (reg.test(item)) {
      // 操作数直接输出
      outItems.push(item);
      continue;
    }
    if (item === '(') {
      // 左括号直接入栈
      stack.push(item);
    } else if (item === ')') {
      // 右括号弹出栈中运算符，直到遇到左括号
      while (stack.store.length > 0 && stack.store[stack.top - 1] !== '(') {
        outItems.push(stack.pop());
      }
      // 弹出左括号
      stack.pop();
    } else if (item === '+' || item === '-') {
      // 如果栈顶不是左括号则将栈中运算符出栈，最后再入栈
      while (stack.store.length > 0 && stack.store[stack.top - 1] !== '(') {
        outItems.push(stack.pop());
      }
      stack.push(item);
    } else if (item === '*' || item === '/') {
      // 如果栈顶元素是左括号，直接入栈
      // 如果栈顶元素优先级比当前运算符高则先出栈再入栈
      if (stack.store.length === 0 || stack.store[stack.top - 1] === '(') {
        stack.push(item);
      } else {
        while (stack.store.length > 0 && (stack.store[stack.top - 1] === '*' || stack.store[stack.top - 1] === '/')) {
          outItems.push(stack.pop());
        }
        stack.push(item);
      }
    }
  }
  while (stack.store.length > 0) {
    outItems.push(stack.pop());
  }
  return outItems;
}
export function calcExpression(expression) {
  const cal = CalcEval;
  const stack = new Stack();
  const items = parseExpression(expression);
  let p = 0;
  let s = 0;
  let str = '';
  const reg = /\d/;
  for (let i = 0; i < items.length; i += 1) {
    if (reg.test(items[i])) {
      stack.push(items[i]);
    } else {
      switch (items[i]) {
        case '-':
          p = stack.pop();
          s = stack.pop();
          str = `${s}-${p}`;
          stack.push(cal.eval(str));
          break;
        case '+':
          p = stack.pop();
          s = stack.pop();
          str = `${s}+${p}`;
          stack.push(cal.eval(str));
          break;
        case '*':
          p = stack.pop();
          s = stack.pop();
          str = `${s}*${p}`;
          stack.push(cal.eval(str));
          break;
        case '/':
          p = stack.pop();
          s = stack.pop();
          str = `${s}/${p}`;
          if (p === '0' || p === 0) {
            stack.push(0);
          } else {
            stack.push(cal.eval(str));
          }
          break;
        default:
      }
    }
  }
  return stack.store[0];
}
export function getRuleResult(calcRule) {
  const resRule = `${calcRule}`.replace(/\$\.fn/g, 'this.fn');
  const context = { fn: math };
  const fn = new Function(`return ${resRule}`);
  const result = fn.call(context);
  return result;
}
export function calculateFn(rules) {
  let rule = rules;
  const functionExpression = []; // 方法表达式
  const functionValue = []; // 方法计算值
  let startIndex = 0;
  while (rule.indexOf('$.fn.', startIndex) > -1) {
    const fnIndex = rule.indexOf('$.fn.', startIndex);
    let leftBracket = rule.indexOf('(', fnIndex + 1); // 左括号位置
    let rightBracket = rule.indexOf(')', leftBracket + 1); // 右括号位置
    leftBracket = rule.indexOf('(', leftBracket + 1); // 下一个左括号位置
    while (leftBracket > -1 && rightBracket > leftBracket) {
      rightBracket = rule.indexOf(')', rightBracket + 1);
      leftBracket = rule.indexOf('(', leftBracket + 1);
    }
    // 截取fnIndex到rightBracket之间的字符串为函数体
    // 先把函数计算出来，再替换到表达式中
    const fn = rule.slice(fnIndex, rightBracket + 1);
    const val = getRuleResult(fn);
    functionExpression.push(fn);
    functionValue.push(val);
    startIndex = rightBracket + 1;
  }
  for (let i = 0; i < functionExpression.length; i += 1) {
    rule = rule.replace(functionExpression[i], functionValue[i]);
  }
  return rule;
}
