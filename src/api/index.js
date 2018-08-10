const baseURL = '/ts/';

const axios = require('axios').create({
  baseURL: baseURL,            //api请求的baseURL
  timeout: 0,
  withCredentials: false, // 允许跨域 cookie
  headers: {'content-type': 'application/json'},
  maxContentLength: 2000,
  transformResponse: [function (data) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = {};
    }
    return data;
  }]
})
// get
export const _get = (req) => {
  return axios.get(req.url, {params: req.data})
}
// post
export const _post = (req) => {
  return axios({method: 'post', url: `/${req.url}`, data: req.data})
}


import $ from 'jquery';
import config from '../../config/config'
console.log(process.env.NODE_ENV)
export default {
  request: function getServerData(obj, url, async,callback) {
    console.log(url)
    if(process.env.NODE_ENV!='production'){
      // url = `/ts${url}`;
      url = `/ts${url}`;

      // url = `${config.config.testUrl}${url}`;
    }
    else{
      // url = `${config.config.SWYproductUrl}${url}`;//正式环境
      url=`${config.config.SWYproductUrl}${url}`
      // url=`${config.config.SWYproductUrl}${url}`
      console.log(url)
    }
    console.log(url)
    $.ajax({
      url:url,
      dataType: "json",
      contentType: "application/json;charset=utf-8",
      type:'POST',
      async:async,
      data:JSON.stringify(obj),
      success:function(res){
        console.log(url)
        console.log(res)
        res.code&&callback(res.data)

      }
    })

  }
}
