/**
 * Module dependencies.
 */

ApiClient = require('../index.js').ApiClient;

const client = new ApiClient({
  'appkey': '24926512', //'23897902',
  'appsecret': 'e365031f074db525ced94d83472dbd40', // '26657347b25d2e4bb454696ae717f988',
  'url': 'http://gw.api.taobao.com/router/rest'
});

//订单列表 简化
/*client.execute('aliexpress.trade.redefining.findorderlistsimplequery', {
    'param1': { page: 1, page_size: 10, create_date_start: '04/01/2018 00:00:00', create_date_end: '04/30/2018 00:00:00' },
    'session': '50002900f28CaWoqa8alzlMPcRofAhBsiqzVjhHR1382dda5G3mwVIkaGghTneF6J01',
  },*/
//商家信息
/*client.execute('aliexpress.merchant.redefining.queryservicescoreinfo', {
    'param1': 'cn1521271509ljsv',
    'param2': 'zh_CN',
    'session': '50002900f28CaWoqa8alzlMPcRofAhBsiqzVjhHR1382dda5G3mwVIkaGghTneF6J01',
  },*/
//
//查询商品每日销量数据
/*client.execute('aliexpress.data.redefining.queryproductsalesinfoeverydaybyid', {
      'current_page': '1',
      'end_date': '2018-06-10',
      'page_size': '10',
      'product_id': '32852900435',
      'start_date': '2018-06-01',
      'session': '50002900f28CaWoqa8alzlMPcRofAhBsiqzVjhHR1382dda5G3mwVIkaGghTneF6J01',
    },*/

//订单详情查询
/*client.execute('aliexpress.trade.redefining.findorderbyid', {
    'param1': { order_id: '92411216931554' },
    'session': '50002900f28CaWoqa8alzlMPcRofAhBsiqzVjhHR1382dda5G3mwVIkaGghTneF6J01',
  },*/


//订单列表
const month = 4

const date1 = `2018-${prevMonth(month)}-10`
var bg = `2018-${nextMonth(date1)}-01`
var end = `2018-${nextMonth(bg)}-01`
  //console.log('date1',date1)
  //console.log('bg',bg)
  //console.log('end',end) 

client.execute('aliexpress.trade.seller.orderlist.get', {
    'param_aeop_order_query': {
      current_page: 1,
      page_size: 200,
      create_date_start: `${date1} 00:00:00`,
      create_date_end: `${end} 00:00:00`,
      order_status_list: ['WAIT_SELLER_SEND_GOODS', 'SELLER_PART_SEND_GOODS', 'WAIT_BUYER_ACCEPT_GOODS', 'IN_ISSUE', 'WAIT_SELLER_EXAMINE_MONEY', 'RISK_CONTROL', 'FINISH', 'FUND_PROCESSING']
        //order_status: []
    },
    'session': '50002900f28CaWoqa8alzlMPcRofAhBsiqzVjhHR1382dda5G3mwVIkaGghTneF6J01',
  },
  function (error, response) {
    if (!error) {
      var arr = response.result.target_list.aeop_order_item_dto
      arr = arr.filter(function (e) { return e.fund_status == 'PAY_SUCCESS' && e.gmt_pay_time >= bg && e.gmt_pay_time < end })
      var amountArr = pushAmount(arr)
        // console.log(`${month}月汇总金额:`, getSum(amountArr))
      console.log(`${month}月订单量:`, amountArr.length)
        //  console.log(JSON.stringify(response));
        // console.log(JSON.stringify(arr));
        // console.log(amountArr)
    } else
      console.log(error);
  }
);

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