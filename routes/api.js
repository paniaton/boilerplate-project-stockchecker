/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var mongoose = require('mongoose');
const fetch = require('node-fetch');
require('dotenv').config()

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.connect(CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(ok => console.log(`Connected to MongoDB!`))
  .catch(error => console.log(error));

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      let stock = req.query.stock

        /*
        request('https://repeated-alpaca.glitch.me/v1/stock/'+stock+'/quote',(err,resp,body) =>{
          if(err){
            res.status(404)
            .type('error')
            .send('No pudo borrar los libros');
          }
          let stockJson = JSON.parse(body);
          res.json({stockData:{stock:stockJson.symbol,price:stockJson.close,likes:1}})
        })
        */
        if(!Array.isArray(stock)){
          getStock(stock)
          .then(stockDataFetched => {
            res.json({stockData:{stock:stockDataFetched.symbol,price:stockDataFetched.close,likes:1}})
          }).catch(err => {res.status(404)
                          .type('error')
                          .send('No pudo borrar los libros')
                  })
        }else{
          let stock1Prom = getStock(stock[0])
          let stock2Prom = getStock(stock[1])
          
          Promise.all([stock1Prom,stock2Prom])
          .then(stocksDataFetched => { 
            res.json({stockData:
                [{stock:stocksDataFetched[0].symbol,price:stocksDataFetched[0].close,likes:1},
                {stock:stocksDataFetched[1].symbol,price:stocksDataFetched[1].close,likes:1}]
              })
          }).catch(err => {res.status(404)
                .type('error')
                .send('No pudo borrar los libros')
              })
        }
        //console.log(stock1);
        //res.json({"stockData":{"stock":"GOOG","price":1110.71,"likes":1}})
    });
    
    async function getStock(stockName){
      let fetchStock = await fetch('https://repeated-alpaca.glitch.me/v1/stock/'+stockName+'/quote')
      let fetchResponse = await fetchStock.json();
      return fetchResponse;
    }
};
