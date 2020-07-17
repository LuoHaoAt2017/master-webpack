export interface RenderType {
  props: object;
  on: EventType;
}
export interface EventType {
  click?: Function;
  change?: Function;
  touchstart?: Function;
  touchmove?: Function;
  touchend?: Function;
  input?: Function;
  focus?: Function;
  blur?: Function;
}
export interface AttrContentType {
  name: string; // 控件值
  type: number; // 控件属性的类型
  value?: any; // 控件默认值
  list?: object | [];
  label?: string; // 标签文本
  attrType?: any; // 弹窗类型
  content?: string; // boolean值的内容，用于Checkbox和RadioBox的
  inVisible?: boolean; // 属性是否可见
  stringType?: string; // 文本格式
  options?: H3.LightApp.AttibuteOptions; // 所有的类型配置函数
}
export interface ControlAttrType {
  attrContent: AttrContentType;
  attrOptions?: AttrOptionsType;
}
export interface AttrOptionsType {
  defaultValue?: any;
}
