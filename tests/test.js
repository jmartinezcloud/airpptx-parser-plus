"use strict";
var expect = require("chai").expect;
let { AirParser } = require("../js/main.js");

//TO-DO: Write test for each shape and slide number and confirm
let pptParser = new AirParser("./tests/sample");

waitForParsing();

async function waitForParsing() {
	let result = await pptParser.ParsePowerPoint();
	//console.log(JSON.stringify(result));

	var fs = require('fs');
	fs.writeFile('slide.json', JSON.stringify(result, null, 4), 'utf8', function (err) {
		if (err) throw err;
		//console.log('Saved!');
	});
}
