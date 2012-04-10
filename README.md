#datafixture.js#

Generates random data based on a defined template model.

**jsfiddle example:**

[http://jsfiddle.net/acatl/QC3Av/](http://jsfiddle.net/acatl/QC3Av/)

# Method: DataFixture.generate

```js
DataFixture.generate(templateObject, numberOfResults);
````

`templateObject`
an object with at least one property.

`numberOfResults`
number of results we want to be generated, if == 0 it outputs an object. if > 0 it outputs an array of objects.

# Examples

## Generate a object with a randomly set numeric property

```js
var template = {
	like: "0...100" /* generate a number between 0 an 100, with no decimals */
};
DataFixture.generate(template, 0);

// possible output
{
	like: 23
}

```

## Generate an Array with a randomly set numeric property

```js
var template = {
	like: "0...100" /* generate a number between 0 an 100, with no decimals */
};
DataFixture.generate(template, 20); /* second parameter indicates the number of elements */

// possible output
[
	{like: 23},
	{like: 3},
	{like: 2},
	{like: 22},
	{like: 10},
	...
]

```


## Generate numbers with decimals

```js
var template = {
	like: "0...100:2" /* generate a number between 0 an 100, with 2 decimals */
};
DataFixture.generate(template, 0);

// possible output
{
	like: 12.69
}

```

## Generate a string from a defined set of values 

```js
var template = {
	names: ["Ian","Polo", "Oscar", "Fabien", "Rafael"] /* Create string with any of the values from the array */
};
DataFixture.generate(template, 0);

// possible output
{
	names: "Rafael"
}

```

## Generate a string from a defined set of values with mixed types 

```js
var template = {
	names: ["Ian",2, 10.4, true, "Andros"] /* Create string with any of the values from the array */
};
DataFixture.generate(template, 0);

// possible output
{
	names: 10.4
}

```

## One level template

```js
var template = {
	values: "0...100:2" /* generate a number between 0 an 100, with 2 decimals */
	names: ["Ian",2, 10.4, true, "Andros"] /* Create string with any of the values from the array */
};
DataFixture.generate(template, 0);

// possible output
{
	value: 45.67,
	names: "Andros"
}

```


## Nested levels template

```js
var template = {
	values: "0...100:2", 
	names: ["Ian",2, 10.4, true, "Andros"], 
	complex: {
		PO:"20000...30000",
		country: ["Mexico", "Canada", "US"]
	}
};
DataFixture.generate(template, 0);

// possible output
{
	names: 10.4,
	values: 13.78,
	complex: {
		PO: 27882,
		country: "Canada"
	}
}

```

## Values of properties can also be functions

```js
var df = DataFixture.generate({
	coordinates:function(){
		return DataFixture.getRandom(0,30) + ":" + DataFixture.getRandom(0,15);
	}
},10);

// possible output
[ { coordinates: '15:7' },
  { coordinates: '14:11' },
  { coordinates: '19:15' },
  { coordinates: '15:9' },
  { coordinates: '17:2' },
  { coordinates: '25:3' },
  { coordinates: '4:1' },
  { coordinates: '12:9' },
  { coordinates: '15:2' },
  { coordinates: '7:8' } ]
```

**enjoy!**

All feedback is welcomed


