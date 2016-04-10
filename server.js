var http = require('http');
var https = require('https');
var fs = require("fs");
var url = require("url");
var mustache = require('mustache');
var port = process.env.PORT || 1337;
var ROOT = "html/";
var qstring = require('querystring');
function getStock(stock, res){
	console.log(stock);
	if(stock==null){
		return;
	}
	/*var options={
		host:'www.quandl.com',
		path:'/api/v3/datasets/WIKI/'+stock+'.json?api_key=Crmtgo5-xyWmC7Ft63_H&start_date=2012-11-01&end_date=2012-11-30'
	};
	console.log("SET OPTIONS");
	https.request(options,function(stockResponse){
		console.log("HERE");
		console.log(stockResponse);
	return stockResponse;
	});*/
	var stockData = '';
	var link ='https://www.quandl.com/api/v3/datasets/WIKI/'+stock+'.json?api_key=Crmtgo5-xyWmC7Ft63_H';
	console.log(link);
	https.get(link, function (res3) {
        var body = '';
        res3.on('data', function (chunk) {
            body += chunk;
        });
		res3.on('end', function () {
			 var json = JSON.parse(body);
			 console.log(json.dataset.data);
	        sendRequest(res,json);
       });
		
      
    });
    
}
function sendRequest(res,stockData){
		fs.readFile("html/index.mustache", function(err,data){
		if(err){
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		}
		res.writeHead(200, { 'Content-Type': 'text/html' });
		var rendered =mustache.render(data.toString(),stockData);
  		res.end(rendered);
	});

}
http.createServer(function(req, res) {
	var stockData="";
	if(req.method =="POST"){
			var reqData = '';
			req.on('data',function(chunk){
				reqData += chunk;
			});
			req.on('end',function(){
				var postParam = qstring.parse(reqData);
				stockData = getStock(postParam.stock, res);
			});
		}else{
			sendRequest(res,"");
		}
}).listen(port);