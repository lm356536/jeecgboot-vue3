import type { Ref, ComponentInternalInstance } from 'vue';
import { unref, isRef } from 'vue';
import { useDefaultEnhanced } from '../hooks/useJVxeComponent';
import { isFunction, isObject, isString } from '/@/utils/is';
import { JVxeTypes } from '../types';
import { JVxeComponent } from '../types/JVxeComponent';
import { componentMap } from '../componentMap';

// 已注册的组件增强
const enhancedMap = new Map<JVxeTypes, JVxeComponent.Enhanced>();

/**
 * 获取某个组件的增强
 * @param type JVxeTypes
 */
export function getEnhanced(type: JVxeTypes | string): JVxeComponent.Enhanced {
  const $type: JVxeTypes = <JVxeTypes>type;
  if (!enhancedMap.has($type)) {
    const defaultEnhanced = useDefaultEnhanced();
    if (componentMap.has($type)) {
      const enhanced = componentMap.get($type)?.enhanced ?? {};
      if (isObject(enhanced)) {
        Object.keys(defaultEnhanced).forEach((key) => {
          const def = defaultEnhanced[key];
          if (enhanced.hasOwnProperty(key)) {
            // 方法如果存在就不覆盖
            if (!isFunction(def) && !isString(def)) {
              enhanced[key] = Object.assign({}, def, enhanced[key]);
            }
          } else {
            enhanced[key] = def;
          }
        });
        enhancedMap.set($type, <JVxeComponent.Enhanced>enhanced);
        return <JVxeComponent.Enhanced>enhanced;
      }
    } else {
      throw new Error(`[JVxeTable] ${$type} 组件尚未注册，获取增强失败`);
    }
    enhancedMap.set($type, <JVxeComponent.Enhanced>defaultEnhanced);
  }
  return <JVxeComponent.Enhanced>enhancedMap.get($type);
}

/** 辅助方法：替换${...}变量 */
export function replaceProps(col, value) {
  if (value && typeof value === 'string') {
    let text = value;
    text = text.replace(/\${title}/g, col.title);
    text = text.replace(/\${key}/g, col.key);
    text = text.replace(/\${defaultValue}/g, col.defaultValue);
    return text;
  }
  return value;
}

type dispatchEventOptions = {
  // JVxeTable 的 props
  props;
  // 触发的 event 事件对象
  $event;
  // 行、列
  row?;
  column?;
  // JVxeTable的vue3实例
  instance?: ComponentInternalInstance;
  // 要寻找的className
  className: string;
  // 重写找到dom后的处理方法
  handler?: Fn;
  // 是否直接执行click方法而不是模拟click事件
  isClick?: boolean;
};

/** 模拟触发事件 */
export function dispatchEvent(options: dispatchEventOptions) {
  const { props, $event, row, column, instance, className, handler, isClick } = options;
  if ((!$event || !$event.path) && !instance) {
    return;
  }
  // alwaysEdit 下不模拟触发事件，否者会导致触发两次
  if (props && props.alwaysEdit) {
    return;
  }
  const getCell = () => {
    const paths: HTMLElement[] = [...($event?.path ?? [])];
    // 通过 instance 获取 cell dom对象
    if (row && column) {
      const selector = `table.vxe-table--body tbody tr[rowid='${row.id}'] td[colid='${column.id}']`;
      const cellDom = instance!.vnode?.el?.querySelector(selector);
      if (cellDom) {
        paths.unshift(cellDom);
      }
    }
    for (const el of paths) {
      if (el.classList?.contains('vxe-body--column')) {
        return el;
      }
    }
    return null;
  };
  const cell = getCell();
  if (cell) {
    window.setTimeout(() => {
      const getElement = () => {
        const classList = className.split(' ');
        if (classList.length > 0) {
          const getClassName = (cls: string) => {
            if (cls.startsWith('.')) {
              return cls.substring(1, cls.length);
            }
            return cls;
          };
          const get = (target, className, idx = 0) => {
            const elements = target.getElementsByClassName(getClassName(className));
            if (elements && elements.length > 0) {
              return elements[idx];
            }
            return null;
          };
          let element: HTMLElement = get(cell, classList[0]);
          for (let i = 1; i < classList.length; i++) {
            if (!element) {
              break;
            }
            element = get(element, classList[i]);
          }
          return element;
        }
        return null;
      };
      const element = getElement();
      if (element) {
        if (isFunction(handler)) {
          handler(element);
        } else {
          // 模拟触发点击事件
          if (isClick) {
            element.click();
          } else {
            element.dispatchEvent($event);
          }
        }
      }
    }, 10);
  } else {
    console.warn('【JVxeTable】dispatchEvent 获取 cell 失败');
  }
}

/** 绑定 VxeTable 数据 */
export function vModel(value, row, column: Ref<any> | string) {
  const property = isRef(column) ? column.value.property : column;
  unref(row)[property] = value;
}
