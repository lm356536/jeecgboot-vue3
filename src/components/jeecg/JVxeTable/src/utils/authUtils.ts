/* JVxeTable 行编辑 权限 */
import { usePermissionStoreWithOut } from '/@/store/modules/permission';

const permissionStore = usePermissionStoreWithOut();

/**
 * JVxe 专用，获取权限
 * @param prefix
 */
export function getJVxeAuths(prefix) {
  prefix = getPrefix(prefix);
  const { authList, allAuthList } = permissionStore;
  const authsMap = new Map<string, typeof allAuthList[0]>();
  if (!prefix || prefix.length == 0) {
    return authsMap;
  }
  // 将所有vxe用到的权限取出来
  for (const auth of allAuthList) {
    if (auth.status == '1' && auth.action.startsWith(prefix)) {
      authsMap.set(auth.action, { ...auth, isAuth: false });
    }
  }
  // 设置是否已授权
  for (const auth of authList) {
    const getAuth = authsMap.get(auth.action);
    if (getAuth != null) {
      getAuth.isAuth = true;
    }
  }
  return authsMap;
}

/**
 * 获取前缀
 * @param prefix
 */
export function getPrefix(prefix: string) {
  if (prefix && !prefix.endsWith(':')) {
    return prefix + ':';
  }
  return prefix;
}
