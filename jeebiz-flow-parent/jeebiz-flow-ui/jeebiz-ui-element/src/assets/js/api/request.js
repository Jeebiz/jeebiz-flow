// 封装axios
import axios from 'axios'
import { Message } from 'element-ui';
import router from '../../../router/index.js';
// import webUrl from "../http/config";
const toLogin = () => {
  router.replace({
      path: '/',
  });
}

const statusMap	= [{
    "400"  :"错误请求",
    "401"  :"请求要求身份验证",
    "403"  :"请求被拒绝",
    "404"  :"请求的资源或接口不存在",
    "405"  :"客户端请求中的方法被禁止",
    "406"  :"服务器无法根据客户端请求的内容特性完成请求",
    "407"  :"要求进行代理身份验证",
    "408"  :"服务器等候请求时发生超时",
    "409"  :"服务器找不到请求的地址",
    "410"  :"服务器找不到请求的地址" ,
    "411"  :"服务器拒绝接受不带Content-Length请求头的客户端请求",
    "412"  :"客户端请求信息的先决条件错误",
    "413"  :"服务器无法处理请求，因为请求实体过大，超出服务器的处理能力" ,
    "415"  :"服务器无法处理请求附带的媒体格式",
    "416"  :"客户端请求的范围无效",
    "417"  :"服务器无法满足Expect的请求头信息",
    "422"  :"无法处理的请求实体",
    "423"  :"当前资源被锁定 ",
    "424"  :"依赖导致的失败",
    "426"  :"客户端应当切换到TLS/1.0",
    "428"  :"要求先决条件",
    "429"  :"太多请求",
    "431"  :"请求头字段太大" ,
    "451"  :"该请求因法律原因不可用",
    "500"  :"服务器内部错误，无法完成请求",
    "501"  :"服务器不支持请求的功能，无法完成请求",
    "502"  :"错误网关",
    "503"  :"服务器目前无法使用（由于超载或停机维护）",
    "504"  :"网关访问超时",
    "505"  :"HTTP 版本不受支持",
    "506"  :"服务器内部配置错误" ,
    "507"  :"服务器无法存储完成请求所必须的内容",
    "508"  :"服务器存储空间不足",
    "509"  :"服务器达到带宽限制",
    "510"  :"获取资源所需要的策略并没有没满足",
    "511"  :"要求网络认证",
    "10009":"用户凭证已过期",
    "10022":"Token缺失",
    "10023":"Token已过期",
    "10024":"Token已失效",
    "10025":"Token错误",
    "10026":"临时授权码过期",
    "10027":"第三方授权服务端异常",
    "10028":"临时授权码错误",
    "10110":"不允许访问（功能未授权）",
    "10111":"请求失败",
    "10112":"数据为空",
    "10113":"参数类型不匹配",
    "10114":"缺少矩阵变量",
    "10115":"缺少URI模板变量",
    "10116":"缺少Cookie变量",
    "10117":"缺少请求头",
    "10118":"缺少参数",
    "10119":"缺少请求对象",
    "10120":"参数规则不满足",
    "10121":"参数绑定错误",
    "10122":"参数解析错误",
    "10123":"参数验证失败",
    "10201":"服务器：运行时异常",
    "10202":"服务器：空值异常",
    "10203":"服务器：数据类型转换异常",
    "10204":"服务器：IO异常",
    "10205":"服务器：未知方法异常",
    "10206":"服务器：非法参数异常",
    "10207":"服务器：数组越界异常",
    "10208":"服务器：网络异常"
}]


 const errorHandle = (error) => {
    //这边处理特殊状态请求 比如说token过期等
    // 状态码判断
    // switch (status) {
    //   // 401: 未登录状态，跳转登录页
    //   case 401:
    //       toLogin();
    //       break;
    //   // 403 token过期
    //   // 清除token并跳转登录页
    //   case 403:

    //       break;
    //   // 404请求不存在
    //   case 404:
    //       Message.error('请求的资源或接口不存在');
    //       break;
    //   default:
    //       console.log(status);
    //   }

        const message = error.data.msg || error.data.message || statusMap[0][error.status] || '服务请求异常'
        // Message.error(message);
        console.log('Error',message)
         //处理token过期问题
        if(error.data.code==10022||error.data.code==10023||error.data.code==10024||error.data.code==10025 || error.data.code==10111){
          router.replace({
            path: '/',
          });
        }

    }





// 一些请求的基本配置
axios.defaults.withCredentials=true;
// 输出方法
export default function request(url, data = {}, method = 'post',download) {
  let token =  localStorage.getItem('token');
  let service;


  service = axios.create({
    headers: {
       'Content-Type': 'application/json',
       'X-Authorization':token?token:'',
    },
    timeout: 60000 // 超时时间 1分钟
  });


  return new Promise((resolve, reject) => {
    const options = {
      url,
      method
    };
    if(download){
      options.responseType="blob"
    }
    if (method.toLowerCase() === 'get') {
      options.params = data
    } else {
      options.data = data
    }
    service(options)
      .then(res => {//成功回调
        if(download){
          resolve(res);
        }else {
          resolve(res.data)
        }
      })
      .catch(error => {// 失败回调
        reject(error);
        if (error.response) {
          errorHandle(error.response);
        }else {
          console.log('Error', error.message);
        }
      })
  })
}
