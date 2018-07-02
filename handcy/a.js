var month6orderid = require('./dataorderid').month6orderid
var month6fright = require('./datafreght').month6freght
var arr = []
for (let i = 0; i < month6orderid.length; i++) {
  for (let j = 0; j < month6fright.length; j++)
    if (month6orderid[i].order_id === month6fright[j].order_id) {
      if(month6fright[j].amount>0)
      arr.push({ order_id: month6orderid[i].order_id, cost: month6fright[j].amount,wlid: month6fright[j].online_logistics_id})
    }
}
//console.log(JSON.stringify(arr))
let sum = 0;
for (let i = 0; i < arr.length; i++) {
  sum += arr[i].cost
}
console.log(sum / 100)
//const result = month6fright.filter(word => word.order_id == '92776627764361');