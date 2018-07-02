/**
 * async await + promise resolve 同步写法实现异步操作
 * reduce 求和, filter筛选, forEach 循环
 * created by 龙鸿轩 2018.06.16
 */

ApiClient = require('../index.js').ApiClient;
var async = require("async");
const client = new ApiClient({
  'appkey': '24926512',
  'appsecret': 'e365031f074db525ced94d83472dbd40',
  'url': 'http://gw.api.taobao.com/router/rest'
});

//订单列表, 要做哪个月, month就写几
const month = 6
const date1 = `2018-${prevMonth(month)}-10`
var bg = `2018-${nextMonth(date1)}-01`
var end = `2018-${nextMonth(bg)}-01`
var totalArr = []
var total_page = 0
const len = 4
  //var month6orderid = require('./data6')

function getlist(i) {
  client.execute('aliexpress.logistics.redefining.getonlinelogisticsinfo', {
      current_page: i, //1开始
      page_size: 50, //上限是50
      gmt_create_start_str: `${bg} 00:00:00`,
      gmt_create_end_str: `${end} 00:00:00`,
      'session': '50002900f28CaWoqa8alzlMPcRofAhBsiqzVjhHR1382dda5G3mwVIkaGghTneF6J01',
    },
    function (error, response) {
     //  console.log(JSON.stringify(response))
      // console.log('\n')
      if (!error) {
        total_page = response.total_page - 1
          //console.log(total_page, i)
        if (response.result_list.result) {
          var arr = response.result_list.result
          for (let i = 0; i < arr.length; i++) {
            if(arr[i].logistics_fee.cent>0)
            totalArr.push({ order_id: arr[i].order_id, amount: arr[i].logistics_fee.cent,online_logistics_id:arr[i].online_logistics_id })
          }
          //console.log(`len的长度不够`, i)
          if (i == total_page) {
            console.log(`当前时间:`, new Date().toLocaleString())
            console.log(`总数组`, JSON.stringify(totalArr))
          }
        }
      } else
        console.log(error);
    }
  );
}

var start = async function () {
  for (var i = 1; i < len; i++) { //从1开始
    //console.log(`当前是第${i}次等待..`);
    await sleep(500, i);
  }
};

var sleep = function (time, i) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
      getlist(i)
    }, time);
  })
};
start();


function pushAmount(arr) {
  var newarr = []
  arr.forEach(function (e) { newarr.push(e.pay_amount.amount) })
  return newarr
}
//求和
function getSum(arr) {
  return arr.reduce(function (previous, current) {
    return parseFloat(previous) + parseFloat(current);
  });
}

//获取下个月
function nextMonth(date1) {
  var month = date1.substr(5, 2)
  var nextmonth = '0' + (parseInt(month.substr(1, 1)) + 1)
  if (month === '09')
    nextmonth = '10'
  if (month === '10')
    nextmonth = '11'
  if (month === '11')
    nextmonth = '12'
  return nextmonth
}

//获取上个月
function prevMonth(date1) {
  var month = date1
  var nextmonth = '0' + (parseInt(month) - 1)
  if (month === 11)
    nextmonth = '10'
  if (month === 12)
    nextmonth = '11'
  return nextmonth
}