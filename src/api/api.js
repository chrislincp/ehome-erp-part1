import axios from 'axios';

// let base = 'http://www.ehometd.com/api';
let base = '/api'

//  Login
export const requestLogin = params => { return axios.post(`${base}/User/login.php`, params).then(res => res.data) };


// 用户中心
// 排行
export const productsRank = params => { return axios.get(`${base}/Avatar/productsRank.php`, { params: params }); };

// 方案
export const schemeNotice = params => { return axios.get(`${base}/Avatar/scheme/schemeNotice.php`, { params: params }); };
export const getSchemes = params => { return axios.get(`${base}/Avatar/scheme/getSchemes.php`, { params: params }); };
export const schemeUpload = params => { return axios.get(`${base}/Avatar/scheme/schemeUpload.php`, { params: params }); };
export const addScheme = params => { return axios.post(`${base}/Avatar/scheme/addScheme.php`, params).then(res => res.data) };
export const editScheme = params => { return axios.post(`${base}/Avatar/scheme/editScheme.php`, params).then(res => res.data) };
export const removeScheme = params => { return axios.get(`${base}/Avatar/scheme/removeScheme.php`, { params: params }); };
export const removeCustomerScheme = params => { return axios.post(`${base}/Avatar/scheme/removeCustomerScheme.php`, params).then(res => res.data) };
// 素材
export const getMaterials = params => { return axios.get(`${base}/Avatar/material/getMaterials.php`, { params: params }); };
export const editMaterial = params => { return axios.post(`${base}/Avatar/material/editMaterial.php`, params).then(res => res.data) };
export const removeMaterial = params => { return axios.get(`${base}/Avatar/material/removeMaterial.php`, { params: params }); };
// 客户
export const getCustomers = params => { return axios.get(`${base}/Avatar/customer/getCustomers.php`, { params: params }); };
export const getOrderList = params => { return axios.get(`${base}/Avatar/customer/getOrderList.php`, { params: params }); };
export const getCustomerProducts = params => { return axios.get(`${base}/Avatar/customer/getCustomerProducts.php`, { params: params }); };
export const getCustomerSchemes = params => { return axios.get(`${base}/Avatar/customer/getCustomerSchemes.php`, { params: params }); };
export const addCustomer = params => { return axios.post(`${base}/Avatar/customer/addCustomer.php`, params).then(res => res.data) };
export const editCustomer = params => { return axios.post(`${base}/Avatar/customer/editCustomer.php`, params).then(res => res.data) };
export const orderAudit = params => { return axios.post(`${base}/Avatar/customer/orderAudit.php`, params).then(res => res.data) };
export const sendMsg = params => { return axios.get(`${base}/Avatar/msg/industrySMS.php`, { params: params }); };
export const removeCustomer = params => { return axios.get(`${base}/Avatar/customer/removeCustomer.php`, { params: params }); };

// 收藏
export const collection = params => { return axios.post(`${base}/Avatar/collect.php`, params).then(res => res.data) };
export const getMySchemesCollect = params => { return axios.get(`${base}/Avatar/scheme/getMySchemesCollect.php`, { params: params }); };
//Users

export const getUserListPage = params => { return axios.get(`${base}/User/users.php`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/User/remove.php`, { params: params }); };

// export const batchRemoveUser = params => { return axios.get(`${base}/User/batchremove`, { params: params }); };

export const editUser = params => { return axios.post(`${base}/User/edit.php`, params).then(res => res.data) };

export const addUser = params => { return axios.post(`${base}/User/add.php`, params).then(res => res.data) };




//   Catg 请求列表

export const getCatgList = params => { return axios.get(`${base}/Catg/index`, { params: params }); };

export const addCatg = params => { return axios.post(`${base}/Catg/add`, params).then(res => res.data) };

export const editCatg = params => { return axios.post(`${base}/Catg/edit`, params).then(res => res.data) };

export const detailCatg = params => { return axios.get(`${base}/Catg/detail`, { params: params }); };



// product 产品请求列表
export const getNav = params => { return axios.get(`${base}/Pro/proNav.php`, { params: params }); };

export const getProductList = params => { return axios.get(`${base}/Pro/proList.php`, { params: params }); };

export const getPriceForm = params => { return axios.get(`${base}/Pro/proPrice.php`, { params: params }); };
export const getMainImage = params => { return axios.get(`${base}/Pro/getMainImage.php`, { params: params }); };

export const saveProducts = params => { return axios.post(`${base}/Pro/saveProducts.php`, params).then(res => res.data) };
// schemes 方案请求列表
export const getSchemeList = params => { return axios.get(`${base}/Sch/schList.php`, { params: params }); };
export const getModelList = params => { return axios.get(`${base}/Sch/modelList.php`, { params: params }); };
export const getFilter = params => { return axios.get(`${base}/Sch/filter.php`, { params: params }); };
export const collectScheme = params => { return axios.post(`${base}/Sch/collectScheme.php`, params).then(res => res.data) };


// 数据
export const referrer = params => { return axios.get(`${base}/Data/referrer.php`, { params: params }); };
export const dataDelete = params => { return axios.get(`${base}/Data/delete.php`, { params: params }); };
export const getSales = params => { return axios.get(`${base}/Data/getSales.php`, { params: params }); };
export const getSurveyUsers = params => { return axios.get(`${base}/Data/getSurveyUsers.php`, { params: params }); };
export const surveySubmit = params => { return axios.post(`${base}/Data/surveySubmit.php`, params).then(res => res.data) };
