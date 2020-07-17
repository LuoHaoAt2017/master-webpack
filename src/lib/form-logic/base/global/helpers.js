import FormLogic from '@/lib/form-logic/instance/index';

let timer;

export default {
  // const FormLogic = FormLogicParam;
  // FormLogic.queryCache = {};
  $batchAllField(callback) {
    const instance = this;
    instance.$renderFields.forEach((dataField) => {
      const control = instance[dataField];
      if (control) {
        callback.call(control, dataField, instance[dataField]);
        if (control.controlKey === 'FormGridView') {
          for (const inGridDataField of control.controlFields) {
            const inGridControl = instance[inGridDataField];
            callback.call(inGridControl, inGridDataField, inGridControl);
          }
        }
      }
    });
  },
  $batchAllRendered(callback) {
    const instance = this;
    instance.$renderFields.forEach((dataField) => {
      const control = instance[dataField];
      if (control) {
        callback.call(control, dataField, control);
      }
    });
  },
  $setQueryCache(id, queryItem) {
    const bizObjectId = this.$bizObjectId
    if (!FormLogic.queryCache[bizObjectId]) {
      FormLogic.queryCache[bizObjectId] = {}
    }
    if (bizObjectId && id && queryItem) {
      FormLogic.queryCache[bizObjectId][id] = queryItem
    }
  },
  $getQueryCache(objectId) {
    return objectId && FormLogic.queryCache[this.$bizObjectId] && FormLogic.queryCache[this.$bizObjectId][objectId];
  },
  $errorHandler(errorMsg, error) {
    /* eslint-disable */
    const instance = this;
    console.error(errorMsg);
    console.error(error);
    if (!timer && instance.$$debugMode) {
      timer = window.setTimeout(() => {
        timer = null;
        alert(errorMsg);
      }, 0);
    }
  }
}
