/*
 * datafixture.js
 *
 * Copyright 2012, Acatl Pacheco
 * Licensed under the MIT License.
 *
 */

var DataFixture = (function() {
	var _rows = 20,
		_template = null,
		_lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque risus turpis, rutrum a mattis a, venenatis ultricies orci. Quisque ultrices arcu sed ipsum tempor nec vehicula massa dictum. Fusce risus orci, adipiscing in consectetur in, gravida eget purus. Praesent elementum auctor elit, et laoreet elit tincidunt a. Vestibulum porta mauris eget purus porttitor viverra vel sed magna. Phasellus et suscipit nunc. Vestibulum sit amet massa quam. Aliquam bibendum placerat orci vitae dictum. Duis et leo pulvinar est iaculis ullamcorper non vitae quam. Donec dictum, odio vitae dignissim consectetur, ante erat auctor quam, et venenatis ligula nunc vel dolor. Phasellus mauris sem, dapibus eu pretium ut, sagittis id orci. Cras pretium, magna gravida accumsan commodo, sem libero porta risus, sit amet tristique felis ipsum varius metus. Duis pharetra nulla sed risus auctor quis scelerisque nulla accumsan. Proin sodales condimentum pretium. Praesent in nulla vel tellus pharetra dignissim id id diam.";

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

	function _parseRange(expression) {
		tokens = [expression, 0];
		if (expression.indexOf(":") != -1) {
			tokens = expression.split(":");
		}
		var ranges = tokens[0].split("...");
		return {
			base: parseFloat(ranges[0]),
			limit: parseFloat(ranges[1]),
			decimals: parseFloat(tokens[1])
		};
	};

	function _parseColumn(columnName, columnValue) {
		var tokens = null;

		if (typeof columnValue == "number") {
			return columnValue;
		}

		if (typeof columnValue == "string") {
			
			if (columnValue.indexOf("lorem") != -1) {
				tokens = [columnValue, "1...10"];
				if (columnValue.indexOf(":") != -1) {
					tokens = columnValue.split(":");
				}
				var ranges = _parseRange(tokens[1]);
				var words = getRandom(ranges.base, ranges.limit, 0);
				var substrings = _lorem.split(" ").slice(0,words);
			    return substrings.join(" ");
			}

			if (columnValue.indexOf("...") != -1) {
				var range = _parseRange(columnValue);
				return parseFloat(getRandom(range.base, range.limit, range.decimals));
			}
		}

		if (typeof columnValue == "function") {
			return columnValue();
		}

		if (typeof columnValue == "object") {
			if (columnValue.hasOwnProperty("length")) {
				return columnValue[getRandom(0, columnValue.length - 1)];
			} else {
				tokens = [columnValue, 0];
				if (columnValue.hasOwnProperty("_rows_") && columnValue.hasOwnProperty("_template_")) {
					tokens[0] = columnValue._template_;
					tokens[1] = columnValue._rows_;
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
