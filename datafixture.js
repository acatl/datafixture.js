/*
# * datafixture.js
# *
# * Copyright 2012, Acatl Pacheco
# * Licensed under the MIT License.
# *
*/


(function() {
  var DataFixturePlugin, root;

  DataFixturePlugin = (function() {
    var generate, getABC, getDatesRandomData, getGUID, getRandom, getRandomArrayValues, parseTokens, _generateParagraph, _lorem, _loremList, _parseABC, _parseColumn, _parseLorem, _parsePLorem, _parseRange, _parseRangeValue, _parseValue, _rows, _template;

    _rows = 20;
    _template = null;
    _lorem = "lorem ipsum dolor sit amet consectetur adipiscing elit quisque risus turpis rutrum a mattis a venenatis ultricies orci quisque ultrices arcu sed ipsum tempor nec vehicula massa dictum fusce risus orci adipiscing in consectetur in gravida eget purus praesent elementum auctor elit et laoreet elit tincidunt a vestibulum porta mauris eget purus porttitor viverra vel sed magna phasellus et suscipit nunc vestibulum sit amet massa quam aliquam bibendum placerat orci vitae dictum duis et leo pulvinar est iaculis ullamcorper non vitae quam donec dictum odio vitae dignissim consectetur ante erat auctor quam et venenatis ligula nunc vel dolor phasellus mauris sem dapibus eu pretium ut sagittis id orci cras pretium magna gravida accumsan commodo sem libero porta risus sit amet tristique felis ipsum varius metus duis pharetra nulla sed risus auctor quis scelerisque nulla accumsan proin sodales condimentum pretium praesent in nulla vel tellus pharetra dignissim id id diam";
    _loremList = _lorem.split(" ");
    generate = function(template, numberOfRows) {
      var column, dataSet, i, row;

      dataSet = [];
      row = {};
      column = void 0;
      if (typeof template === 'string') {
        return _parseValue(template);
      }
      numberOfRows = template["#"] || numberOfRows || 0;
      if (numberOfRows < 0) {
        numberOfRows = 0;
      }
      numberOfRows = typeof numberOfRows === "string" ? _parseRangeValue(numberOfRows) : numberOfRows;
      if (numberOfRows === 0) {
        row = {};
        for (column in template) {
          if (column !== "#") {
            row[column] = _parseColumn(column, template[column]);
          }
        }
        return row;
      }
      i = 0;
      while (i < numberOfRows) {
        row = {};
        for (column in template) {
          if (column !== "#") {
            row[column] = _parseColumn(column, template[column]);
          }
        }
        dataSet.push(row);
        i++;
      }
      return dataSet;
    };
    _parseRange = function(expression) {
      var ranges, tokens;

      tokens = parseTokens(expression, [0, 0]);
      ranges = tokens[0].split("...");
      return [parseFloat(ranges[0]), parseFloat(ranges[1]), parseFloat(tokens[1])];
    };
    _parseRangeValue = function(columnValue) {
      var range;

      range = _parseRange(columnValue);
      return parseFloat(getRandom(range[0], range[1], range[2]));
    };
    _parseLorem = function(columnValue) {
      var tokens, words;

      tokens = parseTokens(columnValue, "1...10");
      if (columnValue.indexOf(":") !== -1) {
        tokens = columnValue.split(":");
      }
      words = _parseRangeValue(tokens[1]);
      return _generateParagraph(words);
    };
    _parsePLorem = function(columnValue) {
      var output, p, paragraphs, tokens, wordRanges, words;

      tokens = parseTokens(columnValue, ["1...10", "10...20"]);
      paragraphs = _parseRangeValue(tokens[1]);
      wordRanges = tokens[2];
      words = void 0;
      output = "";
      p = 0;
      while (p < paragraphs) {
        words = _parseRangeValue(wordRanges);
        output += _generateParagraph(words) + "." + (p < (paragraphs - 1) ? "\n" : "");
        p++;
      }
      return output;
    };
    _generateParagraph = function(words) {
      var i, output;

      output = "";
      i = 0;
      while (i < words) {
        output += _loremList[getRandom(0, _loremList.length - 1, 0)] + (i < (words - 1) ? " " : "");
        i++;
      }
      return output;
    };
    _parseABC = function(columnValue) {
      var tokens;

      tokens = parseTokens(columnValue, 3);
      return getABC(parseInt(tokens[1], 0));
    };
    _parseValue = function(columnValue) {
      var columnTokens, i, length, output, token;

      columnTokens = columnValue.split("|");
      output = [];
      i = 0;
      length = columnTokens.length;
      while (i < length) {
        token = columnTokens[i];
        i++;
        if (token.indexOf("ABC") !== -1) {
          output.push(_parseABC(token));
          continue;
        }
        if (token.indexOf("plorem") !== -1) {
          output.push(_parsePLorem(token));
          continue;
        }
        if (token.indexOf("lorem") !== -1) {
          output.push(_parseLorem(token));
          continue;
        }
        if (token.indexOf("...") !== -1) {
          output.push(_parseRangeValue(token));
          continue;
        }
        if (token === "GUID") {
          output.push(getGUID());
          continue;
        }
        output.push(token);
      }
      if (output.length === 1) {
        return output[0];
      } else {
        return output.join("");
      }
    };
    _parseColumn = function(columnName, columnValue) {
      var tokens, value;

      tokens = null;
      if (typeof columnValue === "number") {
        return columnValue;
      }
      if (typeof columnValue === "string") {
        return _parseValue(columnValue);
      }
      if (typeof columnValue === "function") {
        return columnValue();
      }
      if (typeof columnValue === "object") {
        if (columnValue.hasOwnProperty("length")) {
          value = columnValue[getRandom(0, columnValue.length - 1)];
          return _parseColumn('', value);
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
    parseTokens = function(value, defaultval) {
      var defaultTokens, i, tokens, val, _i, _len;

      tokens = value.split(":");
      if (!defaultval.hasOwnProperty("length")) {
        defaultval = [defaultval];
      }
      defaultTokens = [value].concat(defaultval);
      for (i = _i = 0, _len = defaultTokens.length; _i < _len; i = ++_i) {
        val = defaultTokens[i];
        if (typeof tokens[i] === "undefined") {
          tokens[i] = val;
        }
      }
      return tokens;
    };
    getRandom = function(base, limit) {
      var floatVal, rndVal;

      floatVal = (arguments.length === 3 ? arguments[2] : 0);
      if (isNaN(limit)) {
        limit = base + 0.9;
      }
      rndVal = base + (Math.random() * (limit - base));
      if (floatVal === 0) {
        return Math.round(rndVal);
      } else {
        return Number(rndVal.toFixed(floatVal));
      }
    };
    getGUID = function() {
      var s4;

      s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      };
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    getABC = function(wordLength) {
      var abc, i, output;

      abc = "abcdefghijkmlnopqrstuvwxyz".split("");
      output = "";
      i = 0;
      while (i < wordLength) {
        output += abc[getRandom(0, abc.length - 1, 0)];
        i++;
      }
      return output;
    };
    getDatesRandomData = function(itemsNumber) {
      var currentDate, data, dateString, i, months, nextDate;

      data = [];
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ags", "Sep", "Oct", "Nov", "Dic"];
      currentDate = new Date();
      i = 0;
      while (i < itemsNumber) {
        nextDate = currentDate.getDate() + i;
        dateString = months[currentDate.getMonth()] + " " + nextDate + "," + currentDate.getFullYear();
        data.push(dateString);
        i++;
      }
      return data;
    };
    getRandomArrayValues = function(arrayNumber, base, limit) {
      var i, values;

      values = [];
      i = 0;
      while (i < arrayNumber) {
        values.push(getRandom(base, limit));
        i++;
      }
      return values;
    };
    return {
      generate: generate,
      getRandom: getRandom,
      getDatesRandomData: getDatesRandomData,
      getRandomArrayValues: getRandomArrayValues
    };
  })();

  root = this;

  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = DataFixturePlugin;
  } else {
    root.DataFixture = DataFixturePlugin;
  }

  /*
  
  # test
  r = DataFixture.generate(
      "#":"0...10"
      n:1
      nn:"1...10000"
      nnn:"1...10000:2"
      l:"lorem"
      p:"plorem:1...10:1...2"
      xx:"1|-|ABC:4|-|lorem:1...3"
      obj:
          "#":3
          name: "lorem:1..3"
  )
  
  console.log r
  */


}).call(this);
