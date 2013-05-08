'use strict';

describe("Datafixture", function() {
    var fixture = {};

    it("should be accesible globally", function () {
        expect(DataFixture).not.toBeUndefined();
    });

    describe("when passing a string pattern as your template", function() {
        it("should return an number if only a number was asked for", function () {
            fixture = DataFixture.generate('2...20');
            expect(fixture).not.toBeLessThan(1);
            expect(fixture).not.toBeGreaterThan(21);
        });

        it("accept '|' for concatenation", function () {
            fixture = DataFixture.generate('some|text| |here');
            expect(fixture).toMatch('sometext here');
        });

        it("should be able to contactenate pattern for ranges", function () {
            fixture = DataFixture.generate("value is|:|1...5");
            var words = fixture.split(':');
            var number = parseInt(words[1],10); 
            expect(words[0]).toEqual('value is');
            expect(number).toBeGreaterThan(0);
            expect(number).toBeLessThan(6);
        });
    });


    describe("when setting fixture count", function() {
        it("should return an object if count parameter is 0", function () {
            fixture = DataFixture.generate({},0);
            expect(fixture).not.toBeUndefined();
            expect(fixture).toMatch({});
        });

        it("should return an object if count property is 0", function () {
            fixture = DataFixture.generate({'#':0});
            expect(fixture.length).toBeUndefined();
            expect(fixture).toMatch({});
        });

        it("should return an array if count parameter is greather than 0", function () {
            fixture = DataFixture.generate({},1);
            expect(fixture.length).toMatch(1);
        });

        it("should return an array if count property is greather than 0", function () {
            fixture = DataFixture.generate({'#':1});
            expect(fixture.length).toMatch(1);
        });

        it("should return an array of variable length if count property follows 'X1...X1+n' pattern", function () {
            fixture = DataFixture.generate({'#':'2...20'});
            expect(fixture.length).toBeGreaterThan(1);
            expect(fixture.length).toBeLessThan(21);
        });
    });

    describe("when defining a number property", function() {
        it("should return property with fixed value if value is fixed {'numeric':5}", function () {
            fixture = DataFixture.generate({'value':5},0);
            expect(fixture.value).toMatch(5);
        });

        it("should return property within range if value follows 'X1...X1+n' pattern", function () {
            fixture = DataFixture.generate({'value':'20...2000'},0);
            expect(fixture.value).toBeGreaterThan(19);
            expect(fixture.value).toBeLessThan(2001);
        });

        it("should return property with decimals if value follows 'X1...X1+n:DX' pattern", function () {
            fixture = DataFixture.generate({'value':'20...2000:3'},0);
            // decimal value could land on .0 so we need to check against less than or equal to
            expect(Math.floor(fixture.value) <= fixture.value).toEqual(true);
        });
    });

    describe("when defining an array property", function() {
        it("should return property with any value of the array", function () {
            var array = ['a',2,'c'];
            fixture = DataFixture.generate({'value':array},0);
            expect(array).toContain(fixture.value);
        });
    });


    describe("when defining a 'lorem' property", function() {
        it("should return property with lorem string", function () {
            fixture = DataFixture.generate({'value':'lorem'},0);
            expect(typeof fixture.value).toEqual('string');
        });

        it("should return property with ranges 1 to 10 words by default", function () {
            fixture = DataFixture.generate({'value':'lorem'},0);
            var words = fixture.value.split(' ').length;
            expect(words).toBeGreaterThan(0);
            expect(words).toBeLessThan(11);
        });

        it("should return property with set range of values if value follows 'lorem:X1...X1+n' pattern", function () {
            fixture = DataFixture.generate({'value':'lorem:1...10'},0);
            var words = fixture.value.split(' ').length;
            expect(words).toBeGreaterThan(0);
            expect(words).toBeLessThan(11);
        });
    });

    describe("when defining a 'plorem' property", function() {

        var getParagraphCount = function(value) {
            var paragraphs = value.split('.');
            var paragraphsCount = paragraphs.length-1;
            var i=0, 
                words=0;

            while(i<paragraphsCount) {
                console.log(i);
                words+=paragraphs[i].split(' ').length;
                console.log(paragraphs[i]);
                console.log("words", paragraphs[i].split(' ').length);
                i++;
            }
            var wordCountAverage = Math.round(words/paragraphsCount);
            return {
                paragraphsCount: paragraphsCount,
                wordCountAverage: wordCountAverage
            }
        }


        it("should return property with plorem string", function () {
            fixture = DataFixture.generate({'value':'plorem'},0);
            expect(typeof fixture.value).toEqual('string');
        });

        it("should return property with ranges 1 to 10 paragraphs and 10 to 20 words each by default", function () {
            fixture = DataFixture.generate({'value':'plorem'},0);

            var stats = getParagraphCount(fixture.value);

            expect(stats.paragraphsCount).toBeGreaterThan(0);
            expect(stats.paragraphsCount).toBeLessThan(11);

            expect(stats.wordCountAverage).toBeGreaterThan(9);
            expect(stats.wordCountAverage).toBeLessThan(21);
        });

        it("should return property with range of specified paragraphs if value follows 'plorem:X1...X1+n' pattern", function () {
            fixture = DataFixture.generate({'value':'plorem:1...4'},0);
            var stats = getParagraphCount(fixture.value);

            expect(stats.paragraphsCount).toBeGreaterThan(0);
            expect(stats.paragraphsCount).toBeLessThan(5);

            expect(stats.wordCountAverage).toBeGreaterThan(9);
            expect(stats.wordCountAverage).toBeLessThan(21);
        });


        it("should return property with range of specified paragraphs and words if value follows 'plorem:X1...X1+n:Y1...Y1+n' pattern", function () {
            fixture = DataFixture.generate({'value':'plorem:1...4:1...4'},0);
            var stats = getParagraphCount(fixture.value);

            expect(stats.paragraphsCount).toBeGreaterThan(0);
            expect(stats.paragraphsCount).toBeLessThan(5);

            expect(stats.wordCountAverage).toBeGreaterThan(0);
            expect(stats.wordCountAverage).toBeLessThan(5);
        });
    });

    describe("when defining a property as an object", function() {
        it("should return property with object", function () {
            fixture = DataFixture.generate({'value':{} },0);
            expect(typeof fixture.value).toEqual('object');
        });

        it("should return property with parsed object", function () {
            fixture = DataFixture.generate({'value':{ 'inner':"1...10"} },0);
            expect(fixture.value.inner).toBeGreaterThan(0);
            expect(fixture.value.inner).toBeLessThan(11);
        });

        it("should return property with parsed object as an array when '#' is declared", function () {
            fixture = DataFixture.generate({'value':{ '#':"1...10"} },0);
            expect(fixture.value.length).toBeGreaterThan(0);
            expect(fixture.value.length).toBeLessThan(11);
        });

        it("should return property with parsed object supporting recursive declaration", function () {
            fixture = DataFixture.generate({'value':{ '#':'1...10', 'inner': { '#': '2...4'}} },0);
            expect(fixture.value[0].inner.length).toBeGreaterThan(1);
            expect(fixture.value[0].inner.length).toBeLessThan(5);
        });
    });

    describe("when defining a parameter with value 'ABC'", function() {
        it("should return property as a string", function () {
            fixture = DataFixture.generate({'value':'ABC'},0);
            expect(typeof fixture.value).toEqual('string');
        });

        it("should return property with random letters by default 3 characters", function () {
            fixture = DataFixture.generate({'value':'ABC'},0);
            expect(fixture.value.length).toEqual(3);
        });

        it("should return property with random letters with fixed length when passed as second parameter 'ABC:N'", function () {
            fixture = DataFixture.generate({'value':'ABC:10'},0);
            expect(fixture.value.length).toEqual(10);
        });

    });

    describe("when defining a parameter with value 'GUID' for 'Globally Unique Identifier' generation", function() {
        it("should return property as a string", function () {
            fixture = DataFixture.generate({'value':'GUID'},0);
            expect(typeof fixture.value).toEqual('string');
        });

        it("should return property with a numeric valid 'GUID'", function () {
            fixture = DataFixture.generate({'value':'GUID'},0);
            var isGUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(fixture.value)
            expect(isGUID).toBeTruthy();
        });
    });

    describe("when defining a string with pipes '|' for concatenation", function() {
        it("should return property as a string", function () {
            fixture = DataFixture.generate({'value':"some| |string"},0);
            expect(typeof fixture.value).toEqual('string');
        });

        it("should be able to contactenate simple strings", function () {
            fixture = DataFixture.generate({'value':"some| |string" },0);
            expect(fixture.value).toEqual('some string');
        });

        describe("when using supported patterns", function() {
            it("should be able to contactenate pattern for ranges", function () {
                fixture = DataFixture.generate({'value':"value is|:|1...5" },0);
                var words = fixture.value.split(':');
                var number = parseInt(words[1],10); 
                expect(words[0]).toEqual('value is');
                expect(number).toBeGreaterThan(0);
                expect(number).toBeLessThan(6);
            });

            it("should be able to contactenate pattern for ABC", function () {
                fixture = DataFixture.generate({'value':"value is|:|ABC:4" },0);
                var words = fixture.value.split(':');
                var pattern = words[1]; 
                expect(words[0]).toEqual('value is');
                expect(pattern.length).toEqual(4);
            });

            it("should be able to contactenate pattern for GUID", function () {
                fixture = DataFixture.generate({'value':"value is|:|GUID" },0);
                var words = fixture.value.split(':');
                var pattern = words[1]; 
                var isGUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(pattern)
                expect(isGUID).toBeTruthy();
            });
        });        
    });

    

});





