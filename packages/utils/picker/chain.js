import filter from 'array-filter';

const Manager = class {
  constructor(data, count, fixedColumns) {
    this.data = data;
    this.count = count;
    if (fixedColumns) {
      this.fixedColumns = fixedColumns;
    }
  }

  getChildren(value) {
    return filter(this.data, one => one.parent === value);
  }

  getFirstColumn() {
    return filter(this.data, one => !one.parent || one.parent === 0 || one.parent === '0');
  }

  getPure(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  getColumns(value) {
    // check is data contains the values
    let val = value;
    if (val.length > 0) {
      const matchCount = this.getPure(this.data)
        .filter(item => this.getPure(val).indexOf(item.value) > -1).length;
      if (matchCount < this.getPure(val).length) {
        val = [];
      }
    }
    const datas = [];
    const max = this.fixedColumns || 8;
    for (let i = 0; i < max; i += 1) {
      if (i === 0) {
        datas.push(this.getFirstColumn());
      } else if (!val[i]) {
        if (typeof datas[i - 1][0] === 'undefined') {
          break;
        } else {
          const topValue = datas[i - 1][0].value;
          datas.push(this.getChildren(topValue));
        }
      } else {
        datas.push(this.getChildren(val[i - 1]));
      }
    }
    const list = datas.filter(item => item.length > 0);
    // correct the column
    this.count = list.length;
    return list;
  }
};

export default Manager;
