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
var totalAmount = 0
var totalQuant = 0
const len = 7

function getlist(i) {
  client.execute('aliexpress.trade.seller.orderlist.get', {
      'param_aeop_order_query': {
        current_page: i, //1开始
        page_size: 50, //上限是50
        create_date_start: `${date1} 00:00:00`,
        create_date_end: `${end} 00:00:00`,
        order_status_list: ['WAIT_SELLER_SEND_GOODS', 'SELLER_PART_SEND_GOODS', 'WAIT_BUYER_ACCEPT_GOODS', 'IN_ISSUE', 'WAIT_SELLER_EXAMINE_MONEY', 'RISK_CONTROL', 'FINISH', 'FUND_PROCESSING']
          //order_status: []
      },
      'session': '50002900f28CaWoqa8alzlMPcRofAhBsiqzVjhHR1382dda5G3mwVIkaGghTneF6J01',
    },
    function (error, response) {
      if (!error) {
        if (response.result.target_list) {
          var arr = response.result.target_list.aeop_order_item_dto
            //筛选逻辑:当月-10天前下单,当月已付款,付款成功, 且买家未取消订单.
          arr = arr.filter(function (e) {
            return e.fund_status == 'PAY_SUCCESS' &&
              e.gmt_pay_time >= bg &&
              e.gmt_pay_time < end &&
              e.end_reason !== 'buyer_cancel_order'
          })

          //这个数组用于只保留各订单金额
          var amountArr = pushAmount(arr)
          if (amountArr.length) {
            totalAmount += amountArr.length
            totalQuant += getSum(amountArr)
              //console.log(`当前是第${i}页...`)
              //console.log(`arr`, JSON.stringify(response))
          }
        } else {
          if (i == len - 1) {
            console.log(`当前时间:`, new Date().toLocaleString())
            console.log(`${month}月汇总金额:`, totalQuant.toFixed(2))
            console.log(`${month}月订单量:`, totalAmount, '\n')
          }
        }
        //console.log(JSON.stringify(response));
        //console.log(JSON.stringify(arr));
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