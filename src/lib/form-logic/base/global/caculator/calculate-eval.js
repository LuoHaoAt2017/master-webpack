export default {
  eval(str) {
    let result = this.evalRecursion(str);
    if (typeof result === 'string') {
      result = result.replace(/"/g, '');
    }
    return result;
  },

  evalRecursion(strParam) {
    let str = strParam;
    const isRetStr = str.match(new RegExp(/^".+"$/g)) != null;
    if (isRetStr === true) {
      str = str.replace(/^"|"$/g, '');
    }
    const bracketsList = this.matchOutBrackets(str);
    for (let i = 0; i < bracketsList.length; i += 1) {
      const newCalc = bracketsList[i];
      const calcStr = this.evalRecursion(newCalc.str.replace(/^\(|\)$/g, ''));
      str = str.replace(newCalc.str, calcStr);
    }
    const errorObj = [];
    let tIndex = new Date().getTime();

    // 除
    while (true) {
      const multObj = this.matchExp(str, '/');
      if (multObj == null) {
        break;
      }
      const v = this.executeDivi(multObj.firstValue, multObj.secondValue);
      if (v === 'NaN') {
        const t = `T${tIndex}`;
        tIndex += 1;
        errorObj.push({
          Name: t,
          Exp: multObj.str,
        });
        str = str.replace(multObj.str, t);
      } else {
        str = str.replace(multObj.str, v);
      }
    }

    // console.log("c:"+str);

    // 乘
    while (true) {
      const multObj = this.matchExp(str, '*');
      if (multObj == null) {
        break;
      }
      const v = this.executeMult(multObj.firstValue, multObj.secondValue);

      if (v === 'NaN') {
        const t = `T${tIndex}`;
        tIndex += 1;
        errorObj.push({
          Name: t,
          Exp: multObj.str,
        });
        str = str.replace(multObj.str, t);
      } else {
        // str = str.replace(multObj.firstValue+"*"+multObj.secondValue, v)
        str = str.replace(multObj.str, v);
      }
      // console.log("d:"+str);
    }


    // 加
    while (true) {
      const multObj = this.matchExp(str, '+');
      if (multObj == null) {
        break;
      }
      const v = this.executeAddi(multObj.firstValue, multObj.secondValue);
      if (v === 'NaN' || Number.isNaN(Number(v))) {
        const t = `T${tIndex}`;
        tIndex += 1;
        errorObj.push({
          Name: t,
          Exp: multObj.str,
        });
        str = str.replace(multObj.str, t);
      } else {
        str = str.replace(multObj.str, v);
      }
    }

    // console.log("e:"+str);

    // 减
    while (true) {
      const multObj = this.matchExp(str, '-');
      if (multObj == null) {
        break;
      }
      const v = this.executeSubt(multObj.firstValue, multObj.secondValue);
      if (v === 'NaN') {
        const t = `T${tIndex}`;
        tIndex += 1;
        errorObj.push({
          Name: t,
          Exp: multObj.str,
        });
        str = str.replace(multObj.str, t);
      } else {
        str = str.replace(multObj.str, v);
      }
    }
    for (let i = errorObj.length - 1; i >= 0; i -= 1) {
      const ex = errorObj[i];
      str = str.replace(ex.Name, ex.Exp);
    }

    // 连等
    while (1) {
      // var multObj = str.match(/\d*={2,3}\d*/g);
      const multObj = str.match(/\S*={2,3}\S*/g);
      if (multObj == null) {
        break;
      }
      let replaceTemp = multObj[0];
      if (multObj[0].indexOf('"=="') > 0 || multObj[0].indexOf('"==="') > 0) {
        replaceTemp = `"${replaceTemp}"`;
      }
      const v = eval(replaceTemp);
      str = str.replace(multObj[0], v);
    }


    // console.log("f:"+str);


    if (isRetStr === true) {
      try {
        return eval(`"${str}"`);
      } catch (e) {
        // continue regardless of error
      }
      try {
        return eval(str);
      } catch (e) {
        // continue regardless of error
      }
      return str;
    }
    if (str.match(/(^true$)|(^false$)/g)) {
      return str === 'true';
    }
    if (!Number.isNaN(Number(str))) {
      return Number(str);
    }
    try {
      let evalTemp = eval(str);
      if (typeof evalTemp === 'string') {
        evalTemp = `"${eval(str)}"`;
      }
      return evalTemp;
    } catch (e) {
      // continue regardless of error
    }
    return str;
  },
  matchOutBrackets(param) {
    let f = param;
    const h = [];
    if (f == null) {
      return h;
    }
    if (typeof f !== 'string') {
      f += '';
    }
    const d = f.split('');
    let a = 0;
    let g = false;
    let b = -1;
    for (let c = 0; c < d.length; c += 1) {
      if (d[c] === '(') {
        a += 1;
        g = true;
        if (b === -1) {
          b = c;
        }
      }
      if (d[c] === ')') {
        a -= 1;
      }
      if (g === true && a === 0) {
        const e = {};
        e.str = f.substring(b, c + 1);
        e.firstIndex = b;
        e.lastIndex = c + 1;
        h.push(e);
        b = -1;
        g = false;
        a = 0;
      }
    }
    return h;
  },
  matchExp(t, f) {
    let j = null;
    let l = t;
    if (l == null) {
      return null;
    }
    if (typeof l !== 'string') {
      l += '';
    }
    const k = l.split('');
    let c = 0;
    let b = 0;
    let g = '';
    let e = '';
    let a = '';
    let d = false;
    for (let h = 0; h <= k.length; h += 1) {
      if (k[h] === '+' || k[h] === '-' || k[h] === '*' || k[h] === '/' || k[h] === '%' || h === k.length) {
        if (a === '' && k[h] === '-') {
          a += k[h];
          continue;
        }
        if (d === true) {
          e = a;
          b = h;
          j = {};
          j.firstIndex = c;
          j.secondIndex = b;
          // j.str = l.substring(c, b);
          j.str = g + f + e;
          j.firstValue = Number(g);
          j.secondValue = Number(e);
          break;
        }
        if (k[h] == null) {
          break;
        }
        if (k[h] === f) {
          d = true;
          g = a;
          a = '';
        } else {
          a = '';
          c = -1;
        }
      } else {
        a += k[h];
        if (c === -1) {
          c = h;
        }
      }
    }
    return j;
  },
  executeAddi(arg1, arg2) {
    let r1;
    let r2;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    const m = 10 ** Math.max(r1, r2);
    return this.numToString((this.evalRecursion(`${arg1}*${m}`) + this.evalRecursion(`${arg2}*${m}`)) / m);
  },
  executeSubt(arg1, arg2) {
    let r1;
    let r2;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    const m = 10 ** Math.max(r1, r2);
    const n = (r1 >= r2) ? r1 : r2;
    return this.numToString(((this.evalRecursion(`${arg1}*${m}`) - this.evalRecursion(`${arg2}*${m}`)) / m).toFixed(n));
  },
  executeMult(arg1, arg2) {
    let a = 0;
    const f = arg1.toString();
    const c = arg2.toString();
    try {
      a += f.split('.')[1].length;
    } catch (g) {
      //
    }
    try {
      a += c.split('.')[1].length;
    } catch (g) {
      // continue regardless of error
    }
    return this.numToString((Number(f.replace('.', '')) * Number(c.replace('.', ''))) / (10 ** a));
  },
  executeDivi(arg1, arg2) {
    let t1 = 0;
    let t2 = 0;
    try {
      t1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      // continue regardless of error
    }
    try {
      t2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      // continue regardless of error
    }
    const r1 = Number(arg1.toString().replace('.', ''));
    const r2 = Number(arg2.toString().replace('.', ''));
    return this.executeMult(this.numToString(r1 / r2), (10 ** (t2 - t1)).toString);
  },

  numToString(n) {
    let d;
    let l;
    let r;
    let len;
    let lArr;
    if (typeof n === 'number') {
      d = n.toString();
      if (d.indexOf('e') !== -1) {
        // l: 1234564120000.0000000
        l = d.split('e')[0]; //    1.23456412e+20   1.23456412e-20
        // +20
        r = d.split('e')[1]; // 1.23456412e+20   1.23456412e-20
        // 20
        len = parseInt(r.substring(2, r.length - 1), 10);
        // +20
        if (r.indexOf('+') !== -1) {
          // 1.2345.6412000000000000000000000000
          l += '00000000000000000000000000000000000000';

          // 1          2345664120000000
          lArr = l.split('.');
          // 12345664120000000000000
          l = lArr[0] + lArr[1].substring(0, len);
          return l;
        } else if (l.indexOf('-') !== 1) {
          // 000000000000000001.23456412e+20
          l = `00000000000000000000000000000000000000${l}`;
          // 000000000000000001    23456412e+20
          lArr = l.split('.');
          //
          const str = lArr[0].substring(lArr[0].length - len, lArr[0].length) + lArr[1];
          l = `0.${str}`;
          return l;
        }
        return d;
      }
      return n.toString();
    }
    return n;
  },
};
