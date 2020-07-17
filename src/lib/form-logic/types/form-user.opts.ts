import BaseOptions from './base-options';

/**人员 单/多选 */
export default class FormUserOptions extends BaseOptions{

  /**是否是人员单选 */
  ismultiple: boolean = false;

  /**选择范围 */
  unitselectionrange: string = '';

  /**是否可选部门组织 */
  orgunitvisible: boolean = false;

  /**是否可选人 */
  uservisible: boolean = false;

  /**启动表单相关权限控制 */
  isrelatedmember: string = '';

  /**人员关联填充 */
  mappingcontrols: string = '';

  /**是否缓存 */
  usedatacache: string = '';

  /**是否显示离职人员 */
  showunactive: boolean = false;

  /**是否默认当前人员 */
  showcuruser: boolean = false;

  merge (dataset: any) {
    // 转换属性的类型
    this.uservisible =
      dataset.uservisible === 'true' || dataset.uservisible === null || (dataset.uservisible === true || false);

    this.orgunitvisible = dataset.orgunitvisible === 'true';

    this.showunactive = dataset.showunactive === 'true';

    this.ismultiple = dataset.ismultiple === 'true';

    this.showcuruser = this.showcuruser && (dataset.showcuruser === 'true' || dataset.showcuruser === true);

    // this.uservisible = this.uservisible;
  }

  mergeJson(json) {
    // TODO 暂时这样处理, 为了临时兼容疾风
    this.merge(json);
    switch(this.controlKey) {
      case 'FormMultiUser':
        this.ismultiple = true;
      case 'FormUser': // eslint-disable-line
      case 'FormCreater':
      case 'FormOwner':
        this.uservisible = true;
        this.orgunitvisible = false;
        break;
      case 'FormMultiDepartment':
        this.ismultiple = true;
      case 'FormDepartment': // eslint-disable-line
      case 'FormOwnerDepartment':
        this.uservisible = false;
        this.orgunitvisible = true;
        break;
    }
    const keyMap = {
      'FormCreater': 'FormUser',
      'FormUser': 'FormUser',
      'FormOwner': 'FormUser',
      'FormDepartment': 'FormUser',
      'FormOwnerDepartment': 'FormUser',
      'FormMultiUser': 'FormMultiUser',
      'FormMultiDepartment': 'FormMultiUser',
    }
    this.controlKey = keyMap[this.controlKey];
    this.controlkey = keyMap[this.controlKey];
  }
}
