export const VALIDATE_FAILED = Symbol();
/**
 * 一次性验证主表单和所有的次表单(新版本)
 * @param form 主表单 form 对象
 * @param cases 接收一个数组，每项都是一个JEditableTable实例
 * @returns {Promise<any>}
 */
export async function validateFormModelAndTables(validate, formData, cases, autoJumpTab?) {
  if (!(validate && typeof validate === 'function')) {
    throw `validate 参数需要的是一个方法，而传入的却是${typeof validate}`;
  }
  let dataMap = {};
  const values = await new Promise((resolve, reject) => {
    // 验证主表表单
    validate()
      .then(() => {
        resolve(formData);
      })
      .catch(() => {
        reject({ error: VALIDATE_FAILED });
      });
  });
  Object.assign(dataMap, { formValue: values });
  // 验证所有子表的表单
  const subData = await validateTables(cases, autoJumpTab);
  // 合并最终数据
  dataMap = Object.assign(dataMap, { tablesValue: subData });
  return dataMap;
}
/**
 * 验证并获取一个或多个表格的所有值
 * @param cases 接收一个数组，每项都是一个JEditableTable实例
 * @param autoJumpTab 是否自动跳转到报错的tab
 */
export function validateTables(cases, autoJumpTab = true) {
  if (!(cases instanceof Array)) {
    throw `'validateTables'函数的'cases'参数需要的是一个数组，而传入的却是${typeof cases}`;
  }
  return new Promise((resolve, reject) => {
    const tablesData: any = [];
    let index = 0;
    if (!cases || cases.length === 0) {
      resolve(tablesData);
    }
    (function next() {
      const vm = cases[index];
      vm.value.validateTable().then((errMap) => {
        // 校验通过
        if (!errMap) {
          tablesData[index] = { tableData: vm.value.getTableData() };
          // 判断校验是否全部完成，完成返回成功，否则继续进行下一步校验
          if (++index === cases.length) {
            resolve(tablesData);
          } else next();
        } else {
          // 尝试获取tabKey，如果在ATab组件内即可获取
          let paneKey;
          const tabPane = getVmParentByName(vm.value, 'ATabPane');
          if (tabPane) {
            paneKey = tabPane.$.vnode.key;
            // 自动跳转到该表格
            if (autoJumpTab) {
              const tabs = getVmParentByName(tabPane, 'Tabs');
              tabs && tabs.setActiveKey && tabs.setActiveKey(paneKey);
            }
          }
          // 出现未验证通过的表单，不再进行下一步校验，直接返回失败
          reject({ error: VALIDATE_FAILED, index, paneKey, errMap });
        }
      });
    })();
  });
}

export function getVmParentByName(vm, name) {
  const parent = vm.$parent;
  if (parent && parent.$options) {
    if (parent.$options.name === name) {
      return parent;
    } else {
      const res = getVmParentByName(parent, name);
      if (res) {
        return res;
      }
    }
  }
  return null;
}
