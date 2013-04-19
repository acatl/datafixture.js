###
# * datafixture.js
# *
# * Copyright 2012, Acatl Pacheco
# * Licensed under the MIT License.
# *
###

DataFixturePlugin = do ->
    _rows = 20
    _template = null
    _lorem = "lorem ipsum dolor sit amet consectetur adipiscing elit quisque risus turpis rutrum a mattis a venenatis ultricies orci quisque ultrices arcu sed ipsum tempor nec vehicula massa dictum fusce risus orci adipiscing in consectetur in gravida eget purus praesent elementum auctor elit et laoreet elit tincidunt a vestibulum porta mauris eget purus porttitor viverra vel sed magna phasellus et suscipit nunc vestibulum sit amet massa quam aliquam bibendum placerat orci vitae dictum duis et leo pulvinar est iaculis ullamcorper non vitae quam donec dictum odio vitae dignissim consectetur ante erat auctor quam et venenatis ligula nunc vel dolor phasellus mauris sem dapibus eu pretium ut sagittis id orci cras pretium magna gravida accumsan commodo sem libero porta risus sit amet tristique felis ipsum varius metus duis pharetra nulla sed risus auctor quis scelerisque nulla accumsan proin sodales condimentum pretium praesent in nulla vel tellus pharetra dignissim id id diam"
    _loremList = _lorem.split(" ")

    # _lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque risus turpis, rutrum a mattis a, venenatis ultricies orci. Quisque ultrices arcu sed ipsum tempor nec vehicula massa dictum. Fusce risus orci, adipiscing in consectetur in, gravida eget purus. Praesent elementum auctor elit, et laoreet elit tincidunt a. Vestibulum porta mauris eget purus porttitor viverra vel sed magna. Phasellus et suscipit nunc. Vestibulum sit amet massa quam. Aliquam bibendum placerat orci vitae dictum. Duis et leo pulvinar est iaculis ullamcorper non vitae quam. Donec dictum, odio vitae dignissim consectetur, ante erat auctor quam, et venenatis ligula nunc vel dolor. Phasellus mauris sem, dapibus eu pretium ut, sagittis id orci. Cras pretium, magna gravida accumsan commodo, sem libero porta risus, sit amet tristique felis ipsum varius metus. Duis pharetra nulla sed risus auctor quis scelerisque nulla accumsan. Proin sodales condimentum pretium. Praesent in nulla vel tellus pharetra dignissim id id diam.";
    generate = (template, numberOfRows) ->
        dataSet = []
        row = {}
        column = undefined
        numberOfRows = template["#"] or numberOfRows        
        numberOfRows = if typeof numberOfRows is "string" then _parseRangeValue(numberOfRows) else numberOfRows
        if numberOfRows is 0
            row = {}
            for column of template
                row[column] = _parseColumn(column, template[column]) if column isnt "#"
            return row
        i = 0

        while i < numberOfRows
            row = {}
            for column of template
                row[column] = _parseColumn(column, template[column]) if column isnt "#"
            dataSet.push row
            i++
        dataSet

    _parseRange = (expression) ->
        tokens = parseTokens expression, [0, 0]
        ranges = tokens[0].split("...")

        [
            parseFloat(ranges[0]),
            parseFloat(ranges[1]),
            parseFloat(tokens[1])
        ]

    _parseRangeValue = (columnValue) ->
        range = _parseRange(columnValue)
        parseFloat getRandom(range[0], range[1], range[2])

    _parseLorem = (columnValue) ->
        tokens = parseTokens columnValue, "1...10"
        tokens = columnValue.split(":")  unless columnValue.indexOf(":") is -1
        words = _parseRangeValue(tokens[1])
        _generateParagraph words

    _parsePLorem = (columnValue) ->
        tokens = parseTokens columnValue, ["1...10", "10...20"]
        paragraphs = _parseRangeValue(tokens[1])
        wordRanges = tokens[2]
        words = undefined
        output = ""
        p = 0

        while p < paragraphs
            words = _parseRangeValue(wordRanges)
            output += _generateParagraph(words) + "." + ((if p < (paragraphs - 1) then "\n" else ""))
            p++
        output

    _generateParagraph = (words) ->
        output = ""
        i = 0

        while i < words
            output += _loremList[getRandom(0, _loremList.length, 0)] + ((if i < (words - 1) then " " else ""))
            i++
        output
    _parseABC = (columnValue) ->
        tokens = parseTokens columnValue, 3
        getABC parseInt(tokens[1], 0)

    _parseValue = (columnValue) ->
        columnTokens = columnValue.split("|")
        output = []
        i = 0
        length = columnTokens.length
        
        while i < length
            token = columnTokens[i]
            i++
            unless token.indexOf("ABC") is -1
                output.push _parseABC(token)
                continue
            unless token.indexOf("plorem") is -1
                output.push _parsePLorem(token)
                continue
            unless token.indexOf("lorem") is -1
                output.push _parseLorem(token)
                continue
            unless token.indexOf("...") is -1
                output.push _parseRangeValue(token)
                continue
            if token is "GUID"
                output.push getGUID()
                continue
            output.push token
            

        (if output.length is 1 then output[0] else output.join(""))
    
    _parseColumn = (columnName, columnValue) ->
        tokens = null
        return columnValue  if typeof columnValue is "number"
        return _parseValue(columnValue)  if typeof columnValue is "string"
        return columnValue()  if typeof columnValue is "function"
        if typeof columnValue is "object"
            if columnValue.hasOwnProperty("length")
                return columnValue[getRandom(0, columnValue.length - 1)]
            else
                tokens = [columnValue, 0]
                if columnValue.hasOwnProperty("_rows_") and columnValue.hasOwnProperty("_template_")
                    tokens[0] = columnValue._template_
                    tokens[1] = columnValue._rows_
                return generate(tokens[0], tokens[1])
        columnValue
    
    parseTokens = (value, defaultval) -> 
        tokens = value.split(":")
        defaultval = [defaultval] unless defaultval.hasOwnProperty("length") 
        defaultTokens = [value].concat(defaultval)
        for val, i in defaultTokens
            if typeof tokens[i] is "undefined"
               tokens[i] = val  
        tokens

    #function to get random number upto m
    getRandom = (base, limit) ->
        floatVal = (if arguments.length is 3 then arguments[2] else 0)
        limit = base+0.9 if isNaN(limit)
        rndVal = base + (Math.random() * (limit - base))
        (if floatVal is 0 then Math.round(rndVal) else Number(rndVal.toFixed(floatVal)))
    
    # credit: http://note19.com/2007/05/27/javascript-guid-generator/
    getGUID = ->
        S4 = ->
            # 65536 
            Math.floor(Math.random() * 0x10000).toString 16

        S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
    getABC = (wordLength) ->
        abc = ("abcdefghijkmlnopqrstuvwxyz").split("")
        output = ""
        i = 0

        while i < wordLength
            output += abc[getRandom(0, abc.length - 1, 0)]
            i++
        output
    
    #Ozipi's additions https://github.com/ozipi
    getDatesRandomData = (itemsNumber) ->
        data = []
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ags", "Sep", "Oct", "Nov", "Dic"]
        currentDate = new Date()
        i = 0

        while i < itemsNumber
            nextDate = currentDate.getDate() + i
            dateString = months[currentDate.getMonth()] + " " + nextDate + "," + currentDate.getFullYear()
            data.push dateString
            i++
        data
    
    #Ozipi's additions https://github.com/ozipi
    getRandomArrayValues = (arrayNumber, base, limit) ->
        values = []
        i = 0

        while i < arrayNumber
            values.push getRandom(base, limit)
            i++
        values


    generate: generate
    getRandom: getRandom
    getDatesRandomData: getDatesRandomData
    getRandomArrayValues: getRandomArrayValues

# web
window.DataFixture = DataFixturePlugin if window

# nodejs module
exports.generate = DataFixture.generate  unless typeof exports is "undefined"

###

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
###

