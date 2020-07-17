import ObjectAssign from 'object-assign';
import Datetime from '../../components/h3-datetime/datetimepicker';
/* just for importing style and avoid less-loader issue */
import DatetimeComponent from '../../components/h3-datetime/index'; // eslint-disable-line

const libs = {
  show(options = {}) {
    options = ObjectAssign({
      destroyOnHide: true,
      isOneInstance: true,
    }, options);
    const datetime = new Datetime(options);
    libs.datetime = datetime;
    datetime.show();
  },
  hide() {
    if (libs.datetime) {
      libs.datetime.hide();
    }
  },
};

export default {
  install(Vue) {
    if (!Vue.$h3) {
      Vue.$h3 = {
        datetime: libs,
      };
    } else {
      Vue.$h3.datetime = libs;
    }
    if (!Vue.prototype.$h3) {
      Vue.prototype.$h3 = {
        datetime: libs,
      };
    } else {
      Vue.prototype.$h3.datetime = libs;
    }
  },
};

