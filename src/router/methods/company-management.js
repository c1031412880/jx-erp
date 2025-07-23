import Layout from "../../layout/Layout";
import Blank from "./router-view";

const companyManagementRouter = {
  path: '/company-management',
  name: 'company-management',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '企业管理',
    icon: 'warehouse-management',
    power: [1],
    code: '9000000',
  },
  children: [
    {
      path: '/meeting-room-management-main',
      name: 'meeting-room-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '会议室管理',
        power: [1],
        code: '9010000'
      },
      children: [
        {
          path: 'meeting-room-management',
          name: 'meeting-room-management',
          component: () => import('@/view/company-management/meeting-room-management/index'),
          meta: {title: '会议室管理', power: [1],code: '9010100'},
        },
        {
          path: 'meeting-room-book',
          name: 'meeting-room-book',
          component: () => import('@/view/company-management/meeting-room-book/index'),
          meta: {title: '会议室预定', power: [1],code: '9010200'},
        },
      ]
    },
    {
      path: '/utility-vehicle-management-main',
      name: 'utility-vehicle-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '公车管理',
        power: [1],
        code: '9020000'
      },
      children: [
        // {
        //   path: 'utility-vehicle-management',
        //   name: 'utility-vehicle-management',
        //   component: () => import('@/view/company-management/utility-vehicle-management/index'),
        //   meta: {title: '公车管理', power: [1],code: '9020100'},
        // },
        {
          path: 'utility-vehicle-book',
          name: 'utility-vehicle-book',
          component: () => import('@/view/company-management/utility-vehicle-book/index'),
          meta: {title: '公车借记', power: [1],code: '9020200'},
        },
        {
          path: 'utility-vehicle-rule',
          name: 'utility-vehicle-rule',
          component: () => import('@/view/company-management/utility-vehicle-rule/index'),
          meta: {title: '公车提醒规则设置', power: [1],code: '9020300'},
        },
      ]
    },
    {
      path: '/water-electricity-management-main',
      name: 'water-electricity-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '水电管理',
        power: [1],
        code: '9030000'
      },
      children: [
        {
          path: 'electricity-management',
          name: 'electricity-management',
          component: () => import('@/view/company-management/electricity-management/index'),
          meta: {title: '电费管理', power: [1],code: '9030100'},
        },
        {
          path: 'water-management',
          name: 'water-management',
          component: () => import('@/view/company-management/water-management/index'),
          meta: {title: '水费管理', power: [1],code: '9030200'},
        },
      ]
    },
    {
      path: '/rental-management-main',
      name: 'rental-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '租赁管理',
        power: [1],
        code: '9040000'
      },
      children: [
        {
          path: 'customer-management',
          name: 'customer-management',
          component: () => import('@/view/company-management/customer-management/index'),
          meta: {title: '客户管理', power: [1],code: '9040100'},
        },
        {
          path: 'renting-house-management',
          name: 'renting-house-management',
          component: () => import('@/view/company-management/renting-house-management/index'),
          meta: {title: '租房管理', power: [1],code: '9040200'},
        },
        {
          path: 'contract-management',
          name: 'contract-management',
          component: () => import('@/view/company-management/contract-management/index'),
          meta: {title: '合同管理', power: [1],code: '9040300'},
        },
        {
          path: 'advertising-source-management',
          name: 'advertising-source-management',
          component: () => import('@/view/company-management/advertising-source-management/index'),
          meta: {title: '广告源管理', power: [1],code: '9040400'},
        }
      ]
    },
    {
      path: '/party-building-management-main',
      name: 'party-building-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '党建管理',
        power: [1],
        code: '9050000'
      },
      children: [
        {
          path: 'party-organization-management',
          name: 'party-organization-management',
          component: () => import('@/view/company-management/party-organization-management/index'),
          meta: {title: '党组织管理', power: [1],code: '9050100'},
        },
        {
          path: 'party-members-archives-management',
          name: 'party-members-archives-management',
          component: () => import('@/view/company-management/party-members-archives-management/index'),
          meta: {title: '党员档案管理', power: [1],code: '9050200'},
        },
        {
          path: 'party-fee-management',
          name: 'party-fee-management',
          component: () => import('@/view/company-management/party-fee-management/index'),
          meta: {title: '党费管理', power: [1],code: '9050300'},
        },
        {
          path: 'honor-wall',
          name: 'honor-wall',
          component: () => import('@/view/company-management/honor-wall/index'),
          meta: {title: '荣誉墙', power: [1],code: '9050400'},
        },
        {
          path: 'party-organize-activities-management',
          name: 'party-organize-activities-management',
          component: () => import('@/view/company-management/party-organize-activities-management/index'),
          meta: {title: '党组织活动管理', power: [1],code: '9050500'},
        },
        {
          path: 'development-party-members-management',
          name: 'development-party-members-management',
          component: () => import('@/view/company-management/development-party-members-management/index'),
          meta: {title: '发展党员管理', power: [1],code: '9050600'},
        }
      ]
    },
    {
      path: '/guild-membership-management-main',
      name: 'guild-membership-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '工会管理',
        power: [1],
        code: '9060000'
      },
      children: [
        {
          path: 'guild-membership-management',
          name: 'guild-membership-management',
          component: () => import('@/view/company-management/guild-membership-management/index'),
          meta: {title: '工会会员管理', power: [1],code: '9060100'},
        },
        {
          path: 'guild-membership-application-form',
          name: 'guild-membership-application-form',
          component: () => import('@/view/company-management/guild-membership-application-form/index'),
          meta: {title: '工会会员申请表', power: [1],code: '9060200'},
        },
        {
          path: 'guild-membership-audit',
          name: 'guild-membership-audit',
          component: () => import('@/view/company-management/guild-membership-audit/index'),
          meta: {title: '工会会员审核', power: [1],code: '9060300'},
        },
        {
          path: 'union-employee-information-management',
          name: 'union-employee-information-management',
          component: () => import('@/view/company-management/union-employee-information-management/index'),
          meta: {title: '工会人员信息管理', power: [1],code: '9060400'},
        }
      ]
    },
    {
      path: '/assets-management-main',
      name: 'assets-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '资产管理',
        power: [1],
        code: '9070000'
      },
      children: [
        {
          path: 'asset-information-management',
          name: 'asset-information-management',
          component: () => import('@/view/company-management/asset-information-management/index'),
          meta: {title: '资产信息管理', power: [1],code: '9070100'},
        },
        {
          path: 'asset-classification',
          name: 'asset-classification',
          component: () => import('@/view/company-management/asset-classification/index'),
          meta: {title: '资产分类', power: [1],code: '9070200'},
        },
        {
          path: 'fixed-assets-management',
          name: 'fixed-assets-management',
          component: () => import('@/view/company-management/fixed-assets-management/index'),
          meta: {title: '固定资产管理', power: [1],code: '9070300'},
        },
        {
          path: 'assets-purchase-application',
          name: 'assets-purchase-application',
          component: () => import('@/view/company-management/assets-purchase-application/index'),
          meta: {title: '采购申请单', power: [1],code: '9070400'},
        },
        {
          path: 'asset-storage-management',
          name: 'asset-storage-management',
          component: () => import('@/view/company-management/asset-storage-management/index'),
          meta: {title: '资产入库管理', power: [1],code: '9070500'},
        },
        {
          path: 'asset-repair-management',
          name: 'asset-repair-management',
          component: () => import('@/view/company-management/asset-repair-management/index'),
          meta: {title: '资产报修管理', power: [1],code: '9070600'},
        },
        {
          path: 'asset-retirement-management',
          name: 'asset-retirement-management',
          component: () => import('@/view/company-management/asset-retirement-management/index'),
          meta: {title: '资产报废管理', power: [1],code: '9070700'},
        },
        {
          path: 'supplier-managenment',
          name: 'supplier-managenment',
          component: () => import('@/view/company-management/supplier-managenment/index'),
          meta: {title: '供应商管理', power: [1],code: '9070800'},
        },
      ]
    },
    {
      path: '/taxi-management-main',
      name: 'taxi-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '出租车管理',
        power: [1],
        code: '9'
      },
      children: [
        {
          path: 'taxi-driver-management',
          name: 'taxi-driver-management',
          component: () => import('@/view/company-management/taxi-driver-management/index'),
          meta: {title: '出租车驾驶员档案', power: [1],code: '9080100'},
        },
        {
          path: 'taxi-archives-management',
          name: 'taxi-archives-management',
          component: () => import('@/view/company-management/taxi-archives-management/index'),
          meta: {title: '出租车档案', power: [1],code: '9080200'},
        }
      ]
    },
    {
      path: '/goods-management-main',
      name: 'goods-management-main',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '物品管理',
        power: [1],
        code: '9090000'
      },
      children: [
        {
          path: 'goods-information-management',
          name: 'goods-information-management',
          component: () => import('@/view/company-management/goods-information-management/index'),
          meta: {title: '物品管理', power: [1],code: '9090100'},
        }
      ]
    },
    {
      path: '/news-information-management',
      name: 'news-information-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '公司新闻',
        power: [1],
        code: '9091000'
      },
      children: [
        {
          path: 'news-management',
          name: 'news-management',
          component: () => import('@/view/main-Interface-entrance/news-management/index'),
          meta: {title: '公司新闻', power: [1],code: '9091100'},
        },
        {
          path: 'base-dynamic',
          name: 'base-dynamic',
          component: () => import('@/view/main-Interface-entrance/base-dynamic/index'),
          meta: {title: '基层动态', power: [1],code: '9091200'},
        }
      ]
    },
    {
      path: 'activities-management',
      name: 'activities-management',
      component: () => import('@/view/company-management/activities-management/index'),
      meta: {title: '活动管理', power: [1],code: '9100000'}
    },
    {
      path: '/card-issuance-management',
      name: 'card-issuance-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '自行车发卡管理',
        power: [1],
        code: '9110000'
      },
      children: [
        {
          path: 'daily-report-filling',
          name: 'daily-report-filling',
          component: () => import('@/view/company-management/bicycle-managenment/daily-report-filling/index'),
          meta: {title: '每日报表填写', power: [1],code: '9110100'},
        },
        {
          path: 'card-detailed-list',
          name: 'card-detailed-list',
          component: () => import('@/view/company-management/bicycle-managenment/card-detailed-list/index'),
          meta: {title: '明细列表', power: [1],code: '9110200'},
        },
      ]
    },
    {
      path: 'expiration-reminder',
      name: 'expiration-reminder',
      component: () => import('@/view/company-management/expiration-reminder/index'),
      meta: {title: '合同到期提醒', power: [1],code: '9120000'}
    },
    {
      path: '/card-ic-management',
      name: 'card-ic-management',
      component: Blank,
      alwaysShow: true,
      meta: {
        title: '自行车IC卡管理',
        power: [1],
        code: '9130000'
      },
      children: [
        {
          path: 'bicycle-ic-management',
          name: 'bicycle-ic-management',
          component: () => import('@/view/company-management/bicycle-ic-management/index'),
          meta: {title: 'IC卡管理', power: [1],code: '9130100'},
        },
        {
          path: 'bicycle-ic-refund',
          name: 'bicycle-ic-refund',
          component: () => import('@/view/company-management/bicycle-ic-refund/index'),
          meta: {title: '自行车IC卡退款、注销', power: [1],code: '9130200'}
        },
        {
          path: 'bicycle-ic-cancel',
          name: 'bicycle-ic-cancel',
          component: () => import('@/view/company-management/bicycle-ic-cancel/index'),
          meta: {title: 'IC卡注销明细', power: [1],code: '9130300'}
        }
      ]
    }
  ],
}

export default companyManagementRouter
