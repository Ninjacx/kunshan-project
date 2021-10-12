/**
 * @name publicFn
 * @description 请求结束处理一些回调等 
 * @author Sky
 */

successResult = (res, data, msg, resFn) => {
  if(resFn){
    resFn()
  }else{
    res.status(200)
    res.json({ code: 200, msg , data: JSON.parse(JSON.stringify(data))});
  }
},
// 参数再外面拼接的回调
successRes = (res, data, msg, resFn) => {
  if(resFn){
    resFn()
  }else{
    res.status(200)
    res.json({ code: 200, msg , data });
  }
},
  setCatch = (res, errorMsg, resFn) => {
    var msg = errorMsg || '请稍后再试' 
    if(resFn){
      resFn()
    }else{
      res.status(500)
      res.json({ code: -1, msg });
    }
  },

module.exports = {successResult, setCatch};