import httpReq from '@/api/http'
// 流程管理
import flowManage from "./methods/flowManage";
// 公文管理
import documents from "./methods/documents";
// 机务管理
import maintainManage from "./methods/maintainManage";
// 基础资料
import dataBase from "./methods/dataBase";
// 鉴权
import auth from "./methods/auth";
// 企业管理
import enterpriseManage from "./methods/enterpriseManage";
// 人事管理
import personalManage from "./methods/personalManage";
//报修管理
import maintRepairRecord from "./methods/maintRepairRecord";
//仓库管理
import materialManage from "./methods/materialManage";
// 系统管理
import SystemManage from "./methods/systemManage";
// 安全管理
import SafeManage from "./methods/SafeManage";
// 工作台
import workPlace from "./methods/workPlace";
// 服务管理
import serviceManage from "./methods/serviceManage";
// OA管理
import oaManage from "./methods/oaManage";
// 票务管理
import ticketManage from "./methods/ticketManage";
// 决策分析
import decisionAnalysis from "./methods/decision-analysis";
// 营运管理
import operation from "./methods/operation";

// 中台接口
import dataCenter from "./methods/dataCenter";

const httpRequest = {
  ...flowManage,
  ...documents,
  ...maintainManage,
  ...dataBase,
  ...auth,
  ...enterpriseManage,
  ...personalManage,
  ...maintRepairRecord,
  ...materialManage,
  ...SystemManage,
  ...SafeManage,
  ...workPlace,
  ...serviceManage,
  ...oaManage,
  ...ticketManage,
  ...decisionAnalysis,
  ...dataCenter,
  ...operation
}

const apiHandle = (key, context, {top = false, err = true}) => {
  return new Promise((resolve, reject) => {
    httpRequest[key](context).then(req => {
      if (req.head.result === '200') {
        resolve(req)
        if (top) {
          this.$message({message: req.head.describle, type: 'success'});
        }
      } else {
        reject(req)
        if (err) {
          this.$message({message: req.head.describle, type: 'error'});
        }
      }
    }).catch(err => {
      reject({
        head: {
          describle: err.message,
          result: 500
        }
      })
      if (err) {
        this.$message({message: err.message, type: 'error'});
      }
    })
  })
}

export default httpRequest
