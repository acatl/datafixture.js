/*
 * datafixture.js
 *
 * Copyright 2012, Acatl Pacheco
 * Licensed under the MIT License.
 *
 */

var DataFixture = (function() {
	var _rows = 20,
		_template = null;

	function generate(template, numberOfRows) {

		var dataSet = [],
			row = {},
			column;

		_rows = numberOfRows;

		if (numberOfRows == 0) {
			row = {};
			for (column in template) {
				row[column] = _parseColumn(column, template[column]);
			}

			return row;
		}

		for (var i = 0; i < numberOfRows; i++) {
			row = {};
			for (column in template) {
				row[column] = _parseColumn(column, template[column]);
			}
			dataSet.push(row);
		}
		return dataSet;
	};

	function _parseColumn(columnName, columnValue) {
		var tokens = null;

		if (typeof columnValue == "number") {
			return columnValue;
		}

		if (typeof columnValue == "string") {
			if (columnValue.indexOf("...") != -1) {
				//range
				tokens = [columnValue, 0];
				if (columnValue.indexOf(":") != -1) {
					tokens = columnValue.split(":");
				}
				var ranges = tokens[0].split("...");
				return parseFloat(getRandom(parseFloat(ranges[0]), parseFloat(ranges[1]), tokens[1]));
			}
		}

		if (typeof columnValue == "function") {
			return columnValue();
		}

		if (typeof columnValue == "object") {
			if (columnValue.hasOwnProperty("length")) {
				return columnValue[getRandom(0, columnValue.length - 1)];
			} else {
				tokens = [columnValue, _rows];
				if (columnValue.hasOwnProperty("rows") && columnValue.hasOwnProperty("template")) {
					tokens[0] = columnValue.template;
					tokens[1] = columnValue.rows;
				}
				return generate(tokens[0], tokens[1]);
			}
		}

		return columnValue;
	};

	//function to get random number upto m

	function getRandom(base, limit) {
		var floatVal = arguments.length == 3 ? arguments[2] : 0;
		var rndVal = base + (Math.random() * (limit - base));
		return floatVal == 0 ? Math.round(rndVal) : Number(rndVal.toFixed(floatVal));
	};

	//Ozipi's additions https://github.com/ozipi
	function getDatesRandomData(itemsNumber) {
		var data = [];
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ags', 'Sep', 'Oct', 'Nov', 'Dic'];
		var currentDate = new Date();

		for (var i = 0; i < itemsNumber; i++) {
			var nextDate = currentDate.getDate() + i;
			var dateString = months[currentDate.getMonth()] + ' ' + nextDate + ',' + currentDate.getFullYear();
			data.push(dateString);
		}
		return data;
	};
	
	//Ozipi's additions https://github.com/ozipi
	function getRandomArrayValues(arrayNumber, base, limit) {
		var values = [];
		for (var i = 0; i < arrayNumber; i++) {
			values.push(getRandom(base, limit));
		};

		return values;
	};

	return {
		generate: generate,
		getRandom: getRandom,
		getDatesRandomData: getDatesRandomData,
		getRandomArrayValues: getRandomArrayValues
	};

})();

