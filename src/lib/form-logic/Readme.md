# 表单逻辑层 v 0.7.1

## 1.$store.state数据接口
用于页面渲染的值，绑定在vue组件上的值，存在于$store.state上。

在vue组件中通过表单标识`guid`和控件字段`datafield`可以从`$store.state`中获取到对应的数据。
``` js
this.$store.state.Form.ViewModel[this.bizObjectId][this.dataField]
```
控件数据格式如下：
``` js
{
  value: '',
  visible: true, // 控件是否可见
  valid: {   // 控件校验结果
    // 非空校验, 为true则校验不通过
    empty: true,
    // 自定义校验
    custom: true,
  },
  options: {
    // 通用配置
    Editable: true,
    Required: true,
    Printable: true,
    DisplayName: '单行文本',
    // 控件私有配置, 例如单行文本的
    Mode: { Val: "Email", Text: "邮箱" },
    PlaceHolder: '请输入',
  },
}
```
在控件的vue组件中已经在basecontrol中继承，通过计算属性获取，可以直接使用。
在控件组件中可以：`this.value`或`this.options.Editable`;
```
computed: {
  value: {
    get() {
      // ...
    },
    set(val) {
      // ...
    },
  },
  valid() {

  },
  visible() {
    // ...
  },
  options() {
    // ...
  },
}
```

## 2.业务层控件类的实现
在目录`/lib/form-logic/control-factory/form-control`中定义了所有控件的类，所有控件的类都继承于类`BaseControl`。
每个类需要实现的部分包括构造函数与接口方法。接口方法包括以下四个：
* $emptyVal        当控件为空时，取的默认值
* $valueType       控件的值类型（Number, String, Array, Boolean, Object）
* $initValue       初始化控件的取值和赋值逻辑（get和set），若设置会覆盖默认的get和set
* $setValue        在控件赋值时调用
* $getValue        在控件取值时调用
* $getRuleValue    在控件参与计算规则、隐藏规则的运算时，调用的取值方法
* $validate        控件的自定义校验方法，在业务层校验时调用
* $saveDataField   控件的值被保存/提交时，调用的取值方法
``` js
// FormNumber.js
function FormNumber(options) {
  // 控件的构造函数，需要从options中取值并赋值到options中
  this.options.DecimalPlaces = options.DecimalPlaces;
  // ...
}
 // 控件参与计算时，取的空值
FormNumber.prototype.$emptyVal = '';

// 指定控件的值类型
FormNumber.prototype.$valueType = Number;

// 原型链上的方法不要用箭头函数
// $setValue 在控件赋值的时候调用（用户输入，计算规则触发更改）
FormNumber.prototype.$setValue = function setValue(val) {
  return val;
};

// getValue 在控件取值的时候调用
FormNumber.prototype.$getValue = function getValue(value) {
  return value;
};

// 初始化value，为控件的value字段定义存取器。一般的控件不需要重载
// 如果控件的逻辑十分复杂可以重新定义这个方法
FormNumber.prototype.$initValue = function initValue() {
  let oldValue = this.value;
  defineValueProp(this);
};
FormNumber.prototype.$getRuleValue = function getRuleValue() {
  return this.value;
}
// validate 控件校验时会调用，校验通过返回true
FormNumber.prototype.$validate = function validate() {
  return true;
}
// saveDataField 表单提交时获取当前控件的值的接口
FormNumber.prototype.$saveDataField = function saveDataField() {
  return this.value;
}
```
## 3.渲染层组件重构
所有的控件组件在目录`/src/components/form/common-controls`当中；

所有组件如**FormNumber**、**FormTextBox**都继承（vue mixin）**base-control**，**base-control**在目录`/src/mixinx/`中；


## 4.表单校验
表单校验现在分为：**逻辑层校验** 和 **渲染层校验**。当表单提交时，会首先执行*渲染层*的校验，通过之后会执行*逻辑层*的校验。


#### 渲染层校验
渲染层校验时，会执行每个控件(vue组件)的`validate`方法，默认为定义在`base-controller.js`中的永久返回true的方法，控件可以通过重写这个方法实现校验。**方法要返回一个表示校验是否通过的布尔值**。

#### 逻辑层校验
**必填校验**  控件验证，每个控件会自动在其逻辑层，实现必填非空校验；并在表单提交时调用。
请注意：想判断何时为空，可以在控件中重写`$emptyVal`的变量，默认为空字符串。

如果在页面交互中，想自定义调用非空校验（如文本框失去焦点时），需要手动调用vue组件中的`validateRequired`方法。

**自定义逻辑校验**  如果在逻辑层有自定义的校验，可以重写`$validate`这个接口方法。

在vue组件中判断可以在vue模板中绑定`valid.empty`。这个值会在校验后1s自动重置为false;
``` js
{
  valid: {
    empty: true, // true校验不通过, false校验通过
  }
}
```



