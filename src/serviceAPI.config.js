const BASEURL = 'http://localhost:3000/'
const URL = {
  getShoppingMallInfo: BASEURL+'api/v0/shop',
  getGoodsInfo: BASEURL+'goods/getGoodsInfo',
  getDetailGoodsInfo: BASEURL+'goods/getDetailGoodsInfo',
  getCategoryList: BASEURL+'goods/getCategoryList',
  getCategorySubList: BASEURL+'goods/getCategorySubList',
  getGoodsListByCategorySubID: BASEURL+'goods/getGoodsListByCategorySubID',
  registerUser: BASEURL+'user/register',   //用户注册接口
  loginUser: BASEURL+'user/login',   //用户注册接口
}

module.exports = URL
