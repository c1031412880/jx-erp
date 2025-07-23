import httpReq from "../http";

// 收文管理
const DocumentAccept = {
  // 获取全部
  GetAllByPageDocumentAccept: function (params) {
    let url = '/api/ERPWeb/DocumentAccept/GetAllByPage'
    return httpReq(url, 'get', params);
  },
  // 收文查询
  GetByPageDocumentAccept: function(params) {
    let url = '/api/ERPWeb/DocumentAccept/GetByPage'
    return httpReq(url, 'get', params);
  },
  // 新增收文登记
  AddDocumentAccept: function(params) {
    let url = '/api/ERPWeb/DocumentAccept/Add'
    return httpReq(url, 'post', params);
  },
  // 编辑收文登记
  UpdateDocumentAccept: function(params) {
    let url = '/api/ERPWeb/DocumentAccept/Update'
    return httpReq(url, 'post', params);
  },
  // 收文登记审核
  UpdateStateDocumentAccept: function(params) {
    let url = '/api/ERPWeb/DocumentAccept/UpdateState'
    return httpReq(url, 'post', params);
  },
  // 收文登记删除(批量)
  DeleteDocumentAccept: function(params) {
    let url = '/api/ERPWeb/DocumentAccept/Delete'
    return httpReq(url, 'post', params);
  },
  // 获取收文补号
  GetNumberDocumentAccept: function (params) {
    let url = '/api/ERPWeb/DocumentAccept/GetNumber';
    return httpReq(url, 'get', params);
  },
  // 获取所有字号
  GetFontNumberDocumentAccept: function (params) {
    let url = '/api/ERPWeb/DocumentAccept/GetFontNumber';
    return httpReq(url, 'get', params);
  },
  // 收文作废
  UpdateScrapDocumentAccept: function (params) {
    let url = '/api/ERPWeb/DocumentAccept/UpdateScrap';
    return httpReq(url, 'post', params);
  }
}

// 公文流程管理
const DocumentFlow = {
  // 公文审核进度查询
  GetReviewProcessDocumentFlow: function (params) {
    let url = '/api/ERPWeb/DocumentFlow/GetReviewProcess';
    return httpReq(url, 'get', params);
  },
  // 公文流程进度查询
  GetByPageDocumentFlow: function(params) {
    let url = '/api/ERPWeb/DocumentFlow/GetByPage'
    return httpReq(url, 'get', params);
  },
  // 获取我的抄送
  GetReadDocumentFlow: function (params) {
    let url = '/api/ERPWeb/DocumentFlow/GetRead';
    return httpReq(url, 'get', params);
  },
  // 删除抄送
  DelDocumentFlow: function (params) {
    let url = '/api/ERPWeb/DocumentFlow/Del';
    return httpReq(url, 'post', params);
  },
  // 最新删除
  DeleteDocumentFlow: function (params) {
    let url = '/api/ERPWeb/DocumentFlow/Delete';
    return httpReq(url, 'post', params);
  },
}

// 套红模板
const DocumentHead = {
// 获取全部套红模板
  GetAllDocumentHead: function (params) {
    let url = '/api/ERPWeb/DocumentHead/GetAll';
    return httpReq(url, 'get', params);
  },
  // 新增套红模板
  AddDocumentHead: function (params) {
    let url = '/api/ERPWeb/DocumentHead/Add';
    return httpReq(url, 'post', params);
  },
  // 编辑套红模板
  UpdateDocumentHead: function (params) {
    let url = '/api/ERPWeb/DocumentHead/Update';
    return httpReq(url, 'post', params);
  },
  // 删除套红模板
  DeleteDocumentHead: function (params) {
    let url = '/api/ERPWeb/DocumentHead/Delete';
    return httpReq(url, 'post', params);
  },
  // word转pdf(wps)
  GetWpsPdfDocumentHead: function (params) {
    let url = '/api/ERPWeb/DocumentHead/GetWpsPdf';
    return httpReq(url, 'GET', params);
  },
}

// 上传公文库
const DocumentHis = {
  // 分页获取
  GetByPageDocumentHis: function (params) {
    let url = '/api/ERPWeb/DocumentHis/GetByPage'
    return httpReq(url, 'get', params);
  },
  // 新增
  AddDocumentHis: function (params) {
    let url = '/api/ERPWeb/DocumentHis/Add'
    return httpReq(url, 'post', params);
  },
  // 删除
  DeleteDocumentHis: function (params) {
    let url = '/api/ERPWeb/DocumentHis/Delete'
    return httpReq(url, 'post', params);
  },
}

// 发文管理
const DocumentMain = {
  // 获取全部公文
  GetAllByPageDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/GetAllByPage'
    return httpReq(url, 'get', params);
  },
  // 获取发文数据
  GetByPageDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/GetByPage';
    return httpReq(url, 'get', params);
  },
  // 获取详情
  GetByIdDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/GetById';
    return httpReq(url, 'get', params);
  },
  // 新增发文数据
  AddDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/Add';
    return httpReq(url, 'post', params);
  },
  // 编辑发文数据
  UpdateDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/Update';
    return httpReq(url, 'post', params);
  },
  // 编辑公文上传后
  UpdateContentDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/UpdateContent';
    return httpReq(url, 'post', params);
  },
  // 审批发文数据
  UpdateStateDocumentMain: function(params) {
    let url = '/api/ERPWeb/DocumentMain/UpdateState';
    return httpReq(url, 'post', params);
  },
  // 删除发文数据
  DeleteDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/Delete';
    return httpReq(url, 'post', params);
  },
  // 获取发文补号
  GetNumberDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/GetNumber';
    return httpReq(url, 'get', params);
  },
  // 获取所有字号
  GetFontNumberDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/GetFontNumber';
    return httpReq(url, 'get', params);
  },
  // 发文作废
  UpdateScrapDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/UpdateScrap';
    return httpReq(url, 'post', params);
  },
  AddPersonDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/AddPerson';
    return httpReq(url, 'post', params);
  },
  AddCCDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/AddCC';
    return httpReq(url, 'post', params);
  },
  GetCCPersonDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/GetCCPerson';
    return httpReq(url, 'GET', params);
  },
  // 获取草稿
  GetDraftDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/GetDraft';
    return httpReq(url, 'get', params);
  },
  // 保存草稿
  AddDraftDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/AddDraft';
    return httpReq(url, 'post', params);
  },
  // 发文拟稿
  CommitDocumentMain: function (params) {
    let url = '/api/ERPWeb/DocumentMain/Commit';
    return httpReq(url, 'post', params);
  }
}

// 电子印章管理
const DocumentSeal = {
  // 获取全部电子印章
  DocumentSealGetAll: function (params) {
    let url = '/api/ERPWeb/DocumentSeal/GetAll';
    return httpReq(url, 'get', params);
  },
  // 新增电子印章
  DocumentSealAdd: function (params) {
    let url = '/api/ERPWeb/DocumentSeal/Add';
    return httpReq(url, 'post', params);
  },
  // 编辑电子印章
  DocumentSealUpdate: function (params) {
    let url = '/api/ERPWeb/DocumentSeal/Update';
    return httpReq(url, 'post', params);
  },
  // 删除电子印章
  DocumentSealDelete: function (params) {
    let url = '/api/ERPWeb/DocumentSeal/Delete';
    return httpReq(url, 'post', params);
  },
}

// 公文管理
const documents = {
  ...DocumentAccept,
  ...DocumentFlow,
  ...DocumentHead,
  ...DocumentMain,
  ...DocumentSeal,
  ...DocumentHis
}
export default documents
