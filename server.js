var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
var geojsonvt = require("geojson-vt");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 7070;
var router = express.Router();

router.get("/",function(req,res){
	res.json({
		status: true,
		data: {
			"nama_aplikasi": "NodeGeoParser",
			"versi": "0.0.1"
		}
	});
});

router.get("/ambil_tiles",function(req,res){
	var get = req.query;
	if(get.file && get.x && get.y && get.z) {
		var path = __dirname + "/assets/geojson/" + get.file;
		fs.readFile(path,"utf-8",function(err,data){
			if(err) res.json({status:false,message: err});
			var geojson = JSON.parse(data);
			var tiles = geojsonvt(geojson,{
				extent: 4096,
				debug: 1
			});
			var x = parseInt(get.x);
			var y = parseInt(get.y);
			var z = parseInt(get.z);
			res.json(tiles.getTile(x,y,z));
		});
	} else {
		res.json({
			status: false,
			message: "Lengkapi paramter"
		});
	}
});

app.use("/api",router);
app.listen(port);

console.log("-------------------------------------------------------------------------------------------");
console.log("NodeJSGeoParser v0.0.1");
console.log("Running di PORT : " + port);
console.log("-------------------------------------------------------------------------------------------");
console.log("Akses : http://localhost:" + port + "/api/ambil_tiles?file={file_path}&x={x}&y={y}&z={z}");
console.log("Request Method : GET");
console.log("Parameter : file,x,y,z");
console.log("GeoJSON Folder : ./assets/geojson/");
console.log("-------------------------------------------------------------------------------------------");