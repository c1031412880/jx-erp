import Layout from "../../layout/Layout";
import Blank from "./router-view";

const materialsManagementRouter = {
  path: '/materials-management',
  name: 'materials-management',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '物资管理',
    icon: 'wuziguanli',
    power: [1],
    code: '10000000',
  },
  children: [
    {
      path: '/basic-nformation',
      name: 'basic-nformation',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '基础信息',
        power: [1],
        code: '10010000'
      },
      children: [
        {
          path: 'supplier-management',
          name: 'supplier-management',
          component: () => import('@/view/materials-management/supplier-management/index'),
          meta: {title: '供应商管理', power: [1],code: '10010100',},
        },
        {
          path: 'materials-manage',
          name: 'materials-manage',
          component: () => import('@/view/materials-management/materials-manage/index'),
          meta: {title: '物资管理', power: [1],code: '10010200',},
        },
      ]
    },
    {
      path: '/store-management',
      name: 'store-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '仓库管理',
        power: [1],
        code: '10020000'
      },
      children: [
        {
          path: 'store-management',
          name: 'store-management',
          component: () => import('@/view/materials-management/store-management/index'),
          meta: {title: '仓库管理', power: [1],code: '10020100',},
        },
        {
          path: 'warehouse-initialization',
          name: 'warehouse-initialization',
          component: () => import('@/view/materials-management/warehouse-initialization/index'),
          meta: {title: '仓库初始化录入', power: [1],code: '10020200',},
        }
      ]
    },
    {
      path: '/purchase-manage',
      name: 'purchase-manage',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '采购管理',
        power: [1],
        code: '10050000'
      },
      children: [
        {
          path: 'purchase-inquiry-manage',
          name: 'purchase-inquiry-manage',
          component: () => import('@/view/materials-management/purchase-manage/purchase-inquiry-manage/index'),
          meta: {title: '采购询价单管理', power: [1],code: '10050100',},
        },
        {
          path: 'purchase-order-manage',
          name: 'purchase-order-manage',
          component: () => import('@/view/materials-management/purchase-manage/purchase-order-manage/index'),
          meta: {title: '采购订单管理', power: [1],code: '10050200',},
        }
      ]
    },
    {
      path: '/inventory-management',
      name: 'inventory-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '库存管理',
        power: [1],
        code: '10030000'
      },
      children: [
        {
          path: 'stock-management',
          name: 'stock-management',
          component: () => import('@/view/materials-management/stock-management/index'),
          meta: {title: '入库管理', power: [1],code: '10030100',},
        },
        {
          path: 'warehouse-warrant',
          name: 'warehouse-warrant',
          component: () => import('@/view/materials-management/stock-management/component/warehouse-warrant'),
          meta: {title: '入库单', power: [1],code: '10030900',},
        },
        {
          path: 'warehouse-leave',
          name: 'warehouse-leave',
          component: () => import('@/view/materials-management/warehouse-management/component/warehouse-leave'),
          meta: {title: '出库单', power: [1],code: '10030800',},
        },
        {
          path: 'warehouse-management',
          name: 'warehouse-management',
          component: () => import('@/view/materials-management/warehouse-management/index'),
          meta: {title: '出库管理', power: [1],code: '10030200',},
        },
        {
          path: 'transfer-order-manage',
          name: 'transfer-order-manage',
          component: () => import('@/view/materials-management/transfer-order-manage/index'),
          meta: {title: '调拨管理', power: [1],code: '10033100',},
        },
        {
          path: 'now-inventory',
          name: 'now-inventory',
          component: () => import('@/view/materials-management/now-inventory/index'),
          meta: {title: '即时库存管理', power: [1],code: '10030300',},
        },
        {
          path: 'stock-lunar-knot-manage',
          name: 'stock-lunar-knot-manage',
          component: () => import('@/view/materials-management/stock-lunar-knot-manage/index'),
          meta: {title: '库存月结管理', power: [1],code: '10030400',},
        },
        {
          path: 'return-stock-manage',
          name: 'return-stock-manage',
          component: () => import('@/view/materials-management/return-stock-manage/index'),
          meta: {title: '退料入库', power: [1],code: '10030500',},
        },
        {
          path: 'inventory-manage',
          name: 'inventory-manage',
          component: () => import('@/view/materials-management/inventory-manage/index'),
          meta: {title: '盘点管理', power: [1],code: '10031000',},
        },
        {
          path: 'large-approval-form',///inventory-management
          name: 'large-approval-form',
          component: () => import('@/view/materials-management/large-approval-form/index'),
          meta: {title: '大额审批单', power: [1],code: '10032000',},
        },
        {
          path: 'material-query',
          name: 'material-query',
          component: () => import('@/view/materials-management/material-query/index'),
          meta: {title: '领退料查询', power: [1],code: '10030700'}
        },
        {
          path: 'monthly-tire-inventory-statistics',
          name: 'monthly-tire-inventory-statistics',
          component: () => import('@/view/materials-management/monthly-tire-inventory-statistics/index'),
          meta: {title: '轮胎月库存统计', power: [1],code: '10031100'}
        },
        {
          path: 'goods-returned-note',
          name: 'goods-returned-note',
          component: () => import('@/view/materials-management/goods-returned-note/index'),
          meta: {title: '退货单', power: [1],code: '10031900'}
        },
        {
          path: 'material-issue-statistics',
          name: 'material-issue-statistics',
          component: () => import('@/view/materials-management/material-issue-statistics/index'),
          meta: {title: '领料出库统计', power: [1],code: '10030600'}
        },
        {
          path: 'material-receiving-and-sending-summary',
          name: 'material-receiving-and-sending-summary',
          component: () => import('@/view/materials-management/material-receiving-and-sending-summary/index'),
          meta: {title: '物料收发汇总表', power: [1],code: '10032100'}
        },
        {
          path: 'branch-material-requisition',
          name: 'branch-material-requisition',
          component: () => import('@/view/materials-management/branch-material-requisition/index'),
          meta: {title: '分公司材料领用报表', power: [1], code: '10032200'}
        },
        {
          path: 'branch-material-requisition-detail',
          name: 'branch-material-requisition-detail',
          component: () => import('@/view/materials-management/branch-material-requisition-detail/index'),
          meta: {title: '分公司材料领用成本明细表', power: [1], code: '10032300'}
        },
        {
          path: 'material-receipt-issue-balance',
          name: 'material-receipt-issue-balance',
          component: () => import('@/view/materials-management/material-receipt-issue-balance/index'),
          meta: {title: '物料收发结存表', power: [1], code: '10032400'}
        },
        {
          path: 'zero-stock-customer',
          name: 'zero-stock-customer',
          component: () => import('@/view/materials-management/zero-stock-customer/index'),
          meta: {title: '零库存客户表', power: [1], code: '10032500'}
        },
        {
          path: 'warehouse-settings',
          name: 'warehouse-settings',
          component: () => import('@/view/materials-management/warehouse-settings/index'),
          meta: {title: '仓库管理设置', power: [1], code: '10032600'}
        }
      ]
    },
    {
      path: '/statistical-form',
      name: 'statistical-form',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '统计报表',
        power: [1],
        code: '10040000'
      },
      children: [
        {
          path: 'material-cost',
          name: 'material-cost',
          component: () => import('@/view/materials-management/material-cost/index'),
          meta: {title: '车辆维修物料费用统计', power: [1],code: '10040100',},
        },
        {
          path: 'tire-delivery-details',
          name: 'tire-delivery-details',
          component: () => import('@/view/materials-management/tire-delivery-details/index'),
          meta: {title: '轮胎出库明细', power: [1],code: '10040200',},
        },
        {
          path: 'vehicle-maintenance-cost-summary',
          name: 'vehicle-maintenance-cost-summary',
          component: () => import('@/view/materials-management/vehicle-maintenance-cost-summary/index'),
          meta: {title: '单车维修费用汇总', power: [1],code: '10040300',},
        },
        {
          path: 'spare-parts-delivery-detail',
          name: 'spare-parts-delivery-detail',
          component: () => import('@/view/materials-management/spare-parts-delivery-detail/index'),
          meta: {title: '维修配件出库明细', power: [1],code: '10040400',},
        },
        {
          path: 'parts-storage-statistics',
          name: 'parts-storage-statistics',
          component: () => import('@/view/materials-management/parts-storage-statistics/index'),
          meta: {title: '配件入库统计', power: [1],code: '10040500',},
        },
        {
          path: 'repair-time-details',
          name: 'repair-time-details',
          component: () => import('@/view/materials-management/repair-time-details/index'),
          meta: {title: '维修工时明细', power: [1],code: '10040600',},
        },
      ]
    },
  ],
}

export default materialsManagementRouter
