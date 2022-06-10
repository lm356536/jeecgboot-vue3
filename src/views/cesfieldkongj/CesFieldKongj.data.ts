import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
    {
    title: '用户名',
    align:"center",
    sorter: true,
    dataIndex: 'name'
   },
   {
    title: '下拉框',
    align:"center",
    sorter: true,
    dataIndex: 'sex_dictText'
   },
   {
    title: 'radio',
    align:"center",
    dataIndex: 'radio_dictText'
   },
   {
    title: 'checkbox',
    align:"center",
    dataIndex: 'checkbox_dictText'
   },
   {
    title: '下拉多选',
    align:"center",
    dataIndex: 'selMut_dictText'
   },
   {
    title: '下拉搜索',
    align:"center",
    dataIndex: 'selSearch_dictText'
   },
   {
    title: '生日',
    align:"center",
    dataIndex: 'birthday',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '图片',
    align:"center",
    dataIndex: 'pic',
    customRender:render.renderImage,
   },
   {
    title: '文件',
    align:"center",
    dataIndex: 'files',
    slots: { customRender: 'fileSlot' },
   },
   {
    title: 'markdown',
    align:"center",
    dataIndex: 'remakr'
   },
   {
    title: '富文本',
    align:"center",
    dataIndex: 'fuwenb',
    slots: { customRender: 'htmlSlot' },
   },
   {
    title: '选择用户',
    align:"center",
    dataIndex: 'userSel_dictText'
   },
   {
    title: '选择部门',
    align:"center",
    dataIndex: 'depSel_dictText'
   },
   {
    title: 'double数字',
    align:"center",
    dataIndex: 'dnum'
   },
   {
    title: '打卡时间',
    align:"center",
    dataIndex: 'ccc'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "所属部门",
      field: "sysOrgCode",
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "用户名",
      field: "name",
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "下拉框",
      field: "sex",
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sex"
      },
      colProps: {span: 6},
 	},
	{
      label: "打卡时间",
      field: "ccc",
      component: 'DatePicker',
      componentProps: {
         showTime:true
       },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '用户名',
    field: 'name',
    component: 'Input',
  },
  {
    label: '下拉框',
    field: 'sex',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sex"
     },
  },
  {
    label: 'radio',
    field: 'radio',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sex"
     },
  },
  {
    label: 'checkbox',
    field: 'checkbox',
    component: 'JMultiSelectTag',//TODO  暂无该组件
    componentProps:{
        dictCode:"sex"
     },
  },
  {
    label: '下拉多选',
    field: 'selMut',
    component: 'JMultiSelectTag',//TODO  暂无该组件
    componentProps:{
        dictCode:"sex"
     },
  },
  {
    label: '下拉搜索',
    field: 'selSearch',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_user,username,username"
    },
  },
  {
    label: '生日',
    field: 'birthday',
    component: 'DatePicker',
  },
  {
    label: '图片',
    field: 'pic',
     component: 'JImageUpload',
     componentProps:{
      },
  },
  {
    label: '文件',
    field: 'files',
    component: 'JUpload',
    componentProps:{
     },
  },
  {
    label: 'markdown',
    field: 'remakr',
    component: 'JMarkdownEditor',//注意string转换问题
  },
  {
    label: '富文本',
    field: 'fuwenb',
    component: 'JCodeEditor', //TODO String后缀暂未添加
  },
  {
    label: '选择用户',
    field: 'userSel',
    component: 'JSelectUserByDept',
    componentProps:{
        labelKey:'realname',
     },
  },
  {
    label: '选择部门',
    field: 'depSel',
     component: 'JSelectDept',
  },
  {
    label: 'double数字',
    field: 'dnum',
    component: 'InputNumber',
  },
  {
    label: '打卡时间',
    field: 'ccc',
    component: 'Input',
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
