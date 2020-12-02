// console.dir(1111);
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var mysql = require('mysql');
var app = http.createServer(function(request,response){
    var url = request.url;

    if (request.method == 'GET') {
        if(request.url == '/'){

            url = '/src/index.html';
        }

        if(request.url == '/favicon.ico'){
            return response.writeHead(404);
        }

        response.writeHead(200);
        response.end(fs.readFileSync(__dirname + url));

    }

    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            console.dir(post);

            if(request.url == '/save_data'){
                saveData(post);
                response.writeHead(200);
                console.dir(response);
                response.write('11');
                response.end();
                return;
            }


            if(request.url == '/get_data'){

                // saveData(post);
                // return;
                var result = getData(post,function(result){
                    response.writeHead(200);
                    response.write(JSON.stringify(result));
                    response.end();
                });

                return;
            }

            // use post['blah'], etc.
        });
    }



});
app.listen(3000);



var getData = function(param,callback){

    var connection = mysql.createConnection({
        host     : 'localhost',    // 호스트 주소
        port     : '3307',
        user     : 'roll',           // mysql user
        password : '1234',       // mysql password
        database : 'rollingrole'         // mysql 데이터베이스
    });
    connection.connect();
    connection.query('select * from groups',function (error, results, fields) {
            if (error) throw error;

            callback(results);
            // console.dir(results);
            // return results;
            // console.log('The solution is: ', results[0].solution);
        });
    connection.end();
}

var saveData = function(param){
    var connection = mysql.createConnection({
        host     : 'localhost',    // 호스트 주소
        port     : '3307',
        user     : 'roll',           // mysql user
        password : '1234',       // mysql password
        database : 'rollingrole'         // mysql 데이터베이스
    });
    connection.connect();
    connection.query('insert into groups ( group_info) values ( "222")',//("'+param.name+'")',
        function (error, results, fields) {
            if (error) throw error;
            console.dir(results);
            // console.log('The solution is: ', results[0].solution);
        });
    connection.end();
}