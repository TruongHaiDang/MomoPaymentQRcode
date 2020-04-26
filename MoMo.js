const uuidv1 = require('uuidv1');
const express = require('express');
const route = express();
const axios = require('axios');
//parameters send to MoMo get get payUrl
var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
var hostname = "https://test-payment.momo.vn"
var path = "/gw_payment/transactionProcessor"
var partnerCode = "MOMOMFJP20200425"
var accessKey = "BELdW8aFphuSECof"
var serectkey = "EH3Xf2oPIN6FeEGBvbax07BRUYAEA0Ej"
var orderInfo = "pay with MoMo"
var returnUrl = "https://momo.vn/return"
var notifyurl = "https://momo.vn/notify"
var amount = "50000"
var orderId = uuidv1()
var requestId = uuidv1()
var requestType = "captureMoMoWallet"
var extraData = "merchantName=[autosalingmachine01];merchantId=[MOMOMFJP20200425]" //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store

//before sign HMAC SHA256 with format
//partnerCode=$partnerCode&accessKey=$accessKey&requestId=$requestId&amount=$amount&orderId=$oderId&orderInfo=$orderInfo&returnUrl=$returnUrl&notifyUrl=$notifyUrl&extraData=$extraData
var rawSignature = "partnerCode="+partnerCode+"&accessKey="+accessKey+"&requestId="+requestId+"&amount="+amount+"&orderId="+orderId+"&orderInfo="+orderInfo+"&returnUrl="+returnUrl+"&notifyUrl="+notifyurl+"&extraData="+extraData
//puts raw signature
console.log("--------------------RAW SIGNATURE----------------")
console.log(rawSignature)
//signature
const crypto = require('crypto');
var signature = crypto.createHmac('sha256', serectkey)
                  .update(rawSignature)
                  .digest('hex');
console.log("--------------------SIGNATURE----------------")
console.log(signature)
console.log("--------------------PAYURL----------------")
//json object send to MoMo endpoint
var body = JSON.stringify({
    partnerCode : partnerCode,
    accessKey : accessKey,
    requestId : requestId,
    amount : amount,
    orderId : orderId,
    orderInfo : orderInfo,
    returnUrl : returnUrl,
    notifyUrl : notifyurl,
    extraData : extraData,
    requestType : requestType,
    signature : signature,
})

axios.post(endpoint, body)
  .then(function (response) {
    console.log(response.data.payUrl);
    axios.post(notifyurl, body)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error.message);
          });
  })
  .catch(function (error) {
    console.log(error.message);
  });