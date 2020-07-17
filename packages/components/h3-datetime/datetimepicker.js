/* eslint-disable */
import Scroller from '../../utils/picker/anima-scroller';
import { isToday, generateRange, each, trimZero, addZero, getMaxDay,
  parseRow, parseDate, getElement, toElement, removeElement } from './util';
import { hasClass } from '../../utils/class';
import dom from '../../utils/dom';
import { getYears, getMonths, getDays } from './makedata';

const isBrowser = typeof window === 'object';

const MASK_TEMPLATE = '<div class="dp-mask"></div>';

const TEMPLATE = `<div class="dp-container">
  <div class="dp-header">
    <div class="dp-item h3-datetime-title" data-role="title"></div>
    <div class="dp-item dp-left h3-datetime-cancel" data-role="cancel">cancel</div>
    <div class="dp-item dp-left h3-datetime-clear" data-role="clear"></div>
    <div class="dp-item dp-right h3-datetime-current" data-role="current">current</div>
    <div class="dp-item dp-right h3-datetime-confirm" data-role="confirm">done</div>
  </div>
  <div class="dp-content">
    <div class="dp-item" data-role="year"></div>
    <div class="dp-item" data-role="month"></div>
    <div class="dp-item" data-role="day"></div>
    <div class="dp-item" data-role="hour"></div>
    <div class="dp-item" data-role="minute"></div>
  </div>
</div>`;

const SHOW_ANIMATION_TIME = 200;
const SHOW_CONTAINER_TIME = 300;

const TYPE_MAP = {
  year: ['YYYY'],
  month: ['MM', 'M'],
  day: ['DD', 'D'],
  hour: ['HH', 'H'],
  minute: ['mm', 'm'],
};

let MASK = null;

let CURRENT_PICKER;

const NOW = new Date();

const DEFAULT_CONFIG = {
  template: TEMPLATE,
  trigger: null,
  output: null,
  currentYear: NOW.getFullYear(),
  currentMonth: NOW.getMonth() + 1,
  minYear: 2000,
  maxYear: 2030,
  minHour: 0,
  maxHour: 23,
  hourList: null,
  minuteList: null,
  startDate: null,
  endDate: null,
  yearRow: '{value}',
  monthRow: '{value}',
  dayRow: '{value}',
  hourRow: '{value}',
  minuteRow: '{value}',
  format: 'YYYY-MM-DD',
  value: `${NOW.getFullYear()}-${NOW.getMonth() + 1}-${NOW.getDate()}`,
  onSelect: () => {

  },
  onConfirm() {},
  onClear() {},
  onShow() {},
  onHide() {},
  confirmText: 'ok',
  clearText: '',
  cancelText: 'cancel',
  currentText: '',
  title: '',
  destroyOnHide: false,
  renderInline: false,
  computeHoursFunction: null,
  computeDaysFunction: null,
  isOneInstance: false,
};

function renderScroller(el, d, value, fn) {
  const data = d.map((one) => {
    const tmp = one;
    tmp.value += '';
    return tmp;
  });
  return new Scroller(el, {
    data,
    defaultValue: `${value}`,
    onSelect: fn,
  });
}

function showMask() {
  if (!isBrowser) {
    return;
  }

  if (!MASK) {
    MASK = toElement(MASK_TEMPLATE);
    document.body.appendChild(MASK);

    MASK.addEventListener('click', () => {
      if (CURRENT_PICKER) {
        CURRENT_PICKER.hide('cancel');
      }
    }, false);
  }

  MASK.style.display = 'block';

  setTimeout(() => {
    if (MASK) {
      MASK.style.opacity = 0.5;
    }
  }, 0);
}

function hideMask() {
  if (!MASK) {
    return;
  }

  MASK.style.opacity = 0;

  setTimeout(() => {
    if (MASK) {
      MASK.style.display = 'none';
    }
  }, SHOW_ANIMATION_TIME);
}


function DatetimePicker(config) {
  const self = this;
  self.config = {};
  self.value = config.value || '';
  each(DEFAULT_CONFIG, (key, val) => {
    self.config[key] = config[key] || val;
  });
  this.renderInline = self.config.renderInline;

  if (config.defaultSelectedValue && !config.value) {
    self.config.value = config.defaultSelectedValue;
  }

  if (typeof this.config.startDate === 'string') {
    this.config.startDate = new Date(this.config.startDate.replace(/-/g, '/'));
  }

  if (typeof this.config.endDate === 'string') {
    this.config.endDate = new Date(this.config.endDate.replace(/-/g, '/'));
  }

  if (this.config.startDate && !this.config.endDate) {
    this.config.endDate = new Date('2030/12/31');
  }

  if (!this.config.startDate && this.config.endDate) {
    this.config.startDate = new Date(`${this.config.minYear}/01/01`);
  }

  // this.config.onSelect = () => {
  //   const val = self.getValue();
  //   self.find('[data-role=title]').innerText = val;
  // };

  this.reMakeData = !!this.config.startDate && !!this.config.endDate;

  if (!this.renderInline) {
    const trigger = self.config.trigger;

    this.triggerHandler = function (e) {
      e.preventDefault();
      self.show(self.value);
    };
    if (trigger && isBrowser) {
      const t = getElement(trigger);
      self.trigger = t;
      this.trigger = t;
      if (this.trigger) {
        this.trigger.addEventListener('click', this.triggerHandler, false);
      }
    }
  }
}

DatetimePicker.prototype = {

  $show(newValueMap) {
    const self = this;
    self.$setText();
    self.container.style.display = 'block';

    if (this.renderInline) {
      self.container.classList.add('h3-datetime-view');
    }

    each(TYPE_MAP, (type) => {
      if (self[`${type}Scroller`]) {
        self[`${type}Scroller`].select(trimZero(newValueMap[type]), false);
      }
    });

    setTimeout(() => {
      self.container.style['-webkit-transform'] = 'translateY(0)';
      self.container.style.transform = 'translateY(0)';
    }, 0);
    this.addPreventBodyScrollEvent();
  },
  preventBodyScroll(e) {
    const targetCls = 'dp-content';
    if (!hasClass(e.target, targetCls)) {
      const targetParent = dom.parents(e.target, targetCls);
      if (!targetParent) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  },
  addPreventBodyScrollEvent() {
    document.addEventListener('touchmove', this.preventBodyScroll, false);
  },
  removePreventBodyScrollEvent() {
    document.removeEventListener('touchmove', this.preventBodyScroll, false);
  },

  show(value) {
    if (!isBrowser) {
      return;
    }

    const self = this;
    const config = self.config;
    if (config.isOneInstance) {
      if (document.querySelector('#h3-datetime-instance')) {
        return;
      }
      self.willShow = true;
    }
    CURRENT_PICKER = self;
    const valueMap = parseDate(config.format, value || config.value);
    self.valueMap = valueMap;
    const newValueMap = {};

    each(TYPE_MAP, (type, list) => {
      newValueMap[type] = list.length === 1 ? valueMap[list[0]] :
        (valueMap[list[0]] || valueMap[list[1]]);
    });

    if (self.container) {
      self.$show(newValueMap);
    } else {
      const container = toElement(config.template);
      self.container = container;
      if (config.isOneInstance) {
        container.id = 'h3-datetime-instance';
      }
      if (!self.renderInline) {
        document.body.appendChild(container);

        self.container.style.display = 'block';
      } else {
        document.querySelector(self.config.trigger).appendChild(container);
      }

      each(TYPE_MAP, (type) => {
        const div = self.find(`[data-role=${type}]`);
        if (newValueMap[type] === undefined) {
          removeElement(div);
          return;
        }
        let data;
        if (type === 'day') {
          data = self.$makeData(type, trimZero(newValueMap.year), trimZero(newValueMap.month));
        } else if (type === 'hour') {
          data = self.$makeData(type, trimZero(newValueMap.year),
            trimZero(newValueMap.month), trimZero(newValueMap.day));
        } else {
          data = self.$makeData(type);
        }

        self[`${type}Scroller`] = renderScroller(div, data, trimZero(newValueMap[type]), (currentValue) => {
          setTimeout(() => {
            config.onSelect.call(self, type, currentValue, self.getValue());
          }, 0);
          if (type === 'year' || type === 'month' || type === 'day') {
            if (self.hourScroller) {
              self.$setHourScroller(self.yearScroller.value,
                self.monthScroller.value, self.dayScroller.value, self.hourScroller.value);
            }
          }
          let currentDay;
          if (type === 'year') {
            const currentMonth = self.monthScroller ? self.monthScroller.value :
              config.currentMonth;
            self.$setMonthScroller(currentValue, currentMonth);
            if (self.dayScroller) {
              currentDay = self.dayScroller.value;
              self.$setDayScroller(currentValue, currentMonth, currentDay);
            }
          } else if (type === 'month') {
            const currentYear = self.yearScroller ? self.yearScroller.value :
              config.currentYear;
            if (self.dayScroller) {
              currentDay = self.dayScroller.value;
              self.$setDayScroller(currentYear, currentValue, currentDay);
            }
          }
        });
      });

      if (!self.renderText && !self.renderInline) {
        if (self.config.confirmText) {
          self.find('[data-role=confirm]').innerText = self.config.confirmText;
        }

        if (self.config.cancelText) {
          self.find('[data-role=cancel]').innerText = self.config.cancelText;
        }
        if (self.config.currentText) {
          self.find('[data-role=current]').innerText = self.config.currentText;
        }
        if (self.config.clearText) {
          self.find('[data-role=clear]').innerText = self.config.clearText;
        }
        if (self.config.value) {
          self.find('[data-role=title]').innerText = self.config.title;
        }
        self.renderText = true;
      }

      this.$show(newValueMap);

      self.find('[data-role=cancel]').addEventListener('click', (e) => {
        e.preventDefault();
        self.hide('cancel');
      }, false);

      self.find('[data-role=confirm]').addEventListener('click', (e) => {
        e.preventDefault();
        self.confirm();
      }, false);

      if (self.config.clearText) {
        self.find('[data-role=clear]').addEventListener('click', (e) => {
          e.preventDefault();
          self.clear();
        }, false);
      }
      if (self.config.currentText) {
        self.find('[data-role=current]').addEventListener('click', (e) => {
          e.preventDefault();
          self.confirmNow();
        }, false);
      }
    }

    if (!this.renderInline) {
      showMask();
      config.onShow.call(self);
    }
  },

  $setText() {
    if (typeof V_LOCALE !== 'undefined' && V_LOCALE === 'MULTI' && !this.config.renderInline) { // eslint-disable-line
      const trigger = this.trigger;
      if (trigger) {
        const confirmText = trigger.getAttribute('data-confirm-text');
        const cancelText = trigger.getAttribute('data-cancel-text');
        this.find('[data-role=confirm]').innerText = confirmText;
        this.find('[data-role=cancel]').innerText = cancelText;
      }
    }
  },

  $makeData(type, year, month, day) {
    const config = this.config;
    const valueMap = this.valueMap;
    const list = TYPE_MAP[type];
    let data = [];
    let min;
    let max;

    if (type === 'year') {
      min = config.minYear;
      max = config.maxYear;
      if (this.reMakeData) {
        const { minYear, maxYear } = getYears(this.config.startDate, this.config.endDate);
        min = minYear;
        max = maxYear;
      }
    } else if (type === 'month') {
      min = 1;
      max = 12;
      if (this.reMakeData) {
        const { minMonth, maxMonth } = getMonths(this.config.startDate,
          this.config.endDate, this.yearScroller.value * 1);
        min = Math.max(min, minMonth);
        max = Math.min(max, maxMonth);
      }
    } else if (type === 'day') {
      min = 1;
      max = getMaxDay(year, month);
      if (this.reMakeData) {
        const { minDay, maxDay } = getDays(this.config.startDate,
          this.config.endDate, this.yearScroller.value * 1, this.monthScroller.value * 1);
        min = Math.max(min, minDay);
        max = Math.min(max, maxDay);
      }
    } else if (type === 'hour') {
      min = this.config.minHour;
      max = this.config.maxHour;
    } else if (type === 'minute') {
      min = 0;
      max = 59;
    }
    for (let i = min; i <= max; i += 1) {
      let name;
      if (type === 'year') {
        name = parseRow(config.yearRow, i);
      } else {
        const val = valueMap[list[0]] ? addZero(i) : i;
        name = parseRow(config[`${type}Row`], val);
      }
      data.push({
        name,
        value: i,
      });
    }
    if (type === 'hour' && this.config.hourList) {
      data = this.config.hourList.map(hour => ({
        name: parseRow(config.hourRow, hour),
        value: Number(hour),
      }));
    }

    if (type === 'day' && this.config.computeDaysFunction) {
      const rs = this.config.computeDaysFunction({
        year,
        month,
        min,
        max,
      }, generateRange);
      if (rs) {
        data = rs.map(d => ({
          name: parseRow(config.dayRow, addZero(d)),
          value: Number(d),
        }));
      }
    }

    if (type === 'hour' && this.config.computeHoursFunction) {
      const isTodayVal = isToday(new Date(`${year}/${month}/${day}`), new Date());
      const rs = this.config.computeHoursFunction(`${year}-${month}-${day}`, isTodayVal, generateRange);
      data = rs.map(hour => ({
        name: parseRow(config.hourRow, hour),
        value: Number(hour),
      }));
    }

    if (type === 'minute' && this.config.minuteList) {
      data = this.config.minuteList.map(minute => ({
        name: parseRow(config.minuteRow, minute),
        value: Number(minute),
      }));
    }
    return data;
  },

  // after year change
  $setMonthScroller(currentValue, month) {
    if (!this.monthScroller) {
      return;
    }
    const self = this;
    this.monthScroller.destroy();
    const div = self.find('[data-role=month]');
    self.monthScroller = renderScroller(div, self.$makeData('month'), month, (curVal) => {
      self.config.onSelect.call(self, 'month', curVal, self.getValue());
      const currentYear = self.yearScroller ? self.yearScroller.value : self.config.currentYear;
      if (self.dayScroller) {
        const currentDay = self.dayScroller.value;
        self.$setDayScroller(currentYear, curVal, currentDay);
      }
      if (self.yearScroller && self.monthScroller && self.hourScroller) {
        self.$setHourScroller(currentYear, curVal,
          self.dayScroller.value, self.hourScroller.value);
      }
    });
  },

  $setDayScroller(year, month, day) {
    if (!this.dayScroller) {
      return;
    }
    const self = this;
    let tmpDay = day;
    const maxDay = getMaxDay(year, month);
    if (day > maxDay) {
      tmpDay = maxDay;
    }
    self.dayScroller.destroy();
    const div = self.find('[data-role=day]');
    self.dayScroller = renderScroller(div, self.$makeData('day', year, month), tmpDay, (currentValue) => {
      self.config.onSelect.call(self, 'day', currentValue, self.getValue());
      if (self.hourScroller) {
        self.$setHourScroller(year, month, currentValue, self.hourScroller.value);
      }
    });
  },

  $setHourScroller(year, month, day, hour) {
    if (!this.hourScroller) {
      return;
    }
    const self = this;
    self.hourScroller.destroy();
    const div = self.find('[data-role=hour]');
    self.hourScroller = renderScroller(div, self.$makeData('hour', year, month, day), hour ||
     '', (currentValue) => {
      self.config.onSelect.call(self, 'hour', currentValue, self.getValue());
    });
  },

  find(selector) {
    return this.container.querySelector(selector);
  },

  hide(type) {
    if (!this.container) {
      return;
    }
    const self = this;
    self.container.style.removeProperty('transform');
    self.container.style.removeProperty('-webkit-transform');

    setTimeout(() => {
      if (self.container) {
        self.container.style.display = 'none';
        self.removePreventBodyScrollEvent();
      }
    }, SHOW_CONTAINER_TIME);

    hideMask();

    self.config.onHide.call(self, type);
    if (self.config.destroyOnHide) {
      setTimeout(() => {
        self.destroy();
      }, 500);
    }
  },

  select(type, value) {
    this[`${type}Scroller`].select(value, false);
  },

  destroy() {
    const self = this;
    if (this.trigger) {
      this.trigger.removeEventListener('click', this.triggerHandler, false);
    }
    if (!self.config.isOneInstance && !self.willShow) {
      removeElement(MASK);
      MASK = null;
    }
    removeElement(self.container);
    self.container = null;
  },

  getValue() {
    const self = this;
    const config = self.config;

    let value = config.format;

    function formatValue(scroller, expr1, expr2) {
      if (scroller) {
        const val = scroller.value;
        if (expr1) {
          value = value.replace(new RegExp(expr1, 'g'), addZero(val));
        }
        if (expr2) {
          value = value.replace(new RegExp(expr2, 'g'), trimZero(val));
        }
      }
    }

    each(TYPE_MAP, (key, list) => {
      formatValue(self[`${key}Scroller`], list[0], list[1]);
    });

    return value;
  },

  confirm() {
    const value = this.getValue();
    this.value = value;

    if (this.config.onConfirm.call(this, value) === false) {
      return;
    }

    this.hide('confirm');
  },

  confirmNow() {
    const myDate = new Date();
    let fmt = this.config.format;
    let value = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()} ${myDate.getHours()}:${myDate.getMinutes()}`;

    if (fmt === 'HH:mm') {
      value = `${myDate.getHours()}:${myDate.getMinutes()}`;
    }else if(fmt === 'HH:mm:ss'){
      value = `${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`;
    }
    if (this.config.onConfirm.call(this, value) === false) {
      return;
    }

    this.hide('confirm');
  },

  clear() {
    if (this.config.onClear.call(this, null) === false) {
      return;
    }
    this.hide('clear');
  },
};

export default DatetimePicker;
