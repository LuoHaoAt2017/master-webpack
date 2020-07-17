import init from './constructor';
import actionMixin from './action';
import helpersMixin from '../base/global/helpers';
import { lifestateMixin } from '../base/global/lifestate';
import config from './config';
import { applyMixins } from '../utils';

function FormLogic (options) {
  init(this, options);
}

FormLogic.config = config;
FormLogic.version = 'v1.6.0-beta';
FormLogic.queryCache = {};

FormLogic.prototype.$$debugMode = config.debugMode;

applyMixins(FormLogic, [actionMixin, helpersMixin, lifestateMixin]);

export default FormLogic;
