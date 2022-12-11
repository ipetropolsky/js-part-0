// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

const areEqual = (a, b) => {
    if (a instanceof Array && b instanceof Array) {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
    // Compare arrays of primitives
    // Remember: [] !== []
};

const test = (whatWeTest, actualResult, expectedResult) => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expect+ed:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

// Functions

const getType = (value) => {
    return typeof value;
    // Return string with a native JS type of value
};

const getTypesOfItems = (arr) => {
    return arr.map((item) => getType(item));
    // Return array with types of items of given array
};

const allItemsHaveTheSameType = (arr) => {
    return arr.every((item) => getType(item) === getType(arr[0]));
    // Return true if all items of array have the same type
};

const getRealType = (value) => {
    if (value === null) {
        return 'null';
    } else if (getType(value) === 'string') {
        return 'string';
    } else if (getType(value) === 'boolean') {
        return 'boolean';
    } else if (getType(value) === 'bigint') {
        return 'bigint';
    } else if (getType(value) === 'symbol') {
        return 'symbol';
    } else if (value === undefined) {
        return 'undefined';
    } else if (getType(value) === 'number' && isNaN(value)) {
        return 'NaN';
    } else if (value === Infinity) {
        return 'Infinity';
    } else if (getType(value) === 'number') {
        return 'number';
    } else if (`${new Date(value)}` !== 'Invalid Date') {
        return 'date';
    } else if (getType(value) === 'function') {
        return 'function';
    } else if (value instanceof RegExp) {
        return 'regexp';
    } else if (value instanceof Set) {
        return 'set';
    } else if (value instanceof Map) {
        return 'map';
    } else if (value instanceof Array) {
        return 'array';
    } else if (value instanceof Object) {
        return 'object';
    }
    return 'тип не определен';
    // Return string with a “real” type of value.
};

const getRealTypesOfItems = (arr) => {
    return arr.map((item) => getRealType(item));
    // Return array with real types of items of given array
};

const everyItemHasAUniqueRealType = (arr) => {
    if (arr.length === new Set(getRealTypesOfItems(arr)).size) {
        return true;
    }
    return false;
    // Return true if there are no items in array
    // with the same real type
};

const countRealTypes = (arr) => {
    const resObj = {};
    for (let i = 0; i < arr.length; i++) {
        const item = getRealType(arr[i]);
        if (resObj[item]) {
            resObj[item] += 1;
        } else {
            resObj[item] = 1;
        }
    }
    return Object.entries(resObj).sort();
    // Return an array of arrays with a type and count of items
    // with this type in the input array, sorted by type.
    // Like an Object.entries() result: [['boolean', 3], ['string', 5]]
};

// Tests

testBlock('getType');

test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
    'Function',
    getType(() => {}),
    'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');

testBlock('allItemsHaveTheSameType');

test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test('All values are strings but wait', allItemsHaveTheSameType(['11', new String('12'), '13']), false);

test('Values like a number', allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]), true);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    null,
    'string',
    true,
    10n,
    Symbol('id'),
    undefined,
    NaN,
    Infinity,
    1,
    new Date(),
    () => {},
    /\w+/,
    new Set(),
    new Map(),
    [],
    {},
];

test('Check basic types', getTypesOfItems(knownTypes), [
    'object',
    'string',
    'boolean',
    'bigint',
    'symbol',
    'undefined',
    'number',
    'number',
    'number',
    'object',
    'function',
    'object',
    'object',
    'object',
    'object',
    'object',
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'null',
    'string',
    'boolean',
    'bigint',
    'symbol',
    'undefined',
    'NaN',
    'Infinity',
    'number',
    'date',
    'function',
    'regexp',
    'set',
    'map',
    'array',
    'object',
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === 123]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Count unique types of array items', countRealTypes([() => {}, null, new Date(), 3123n, '', '', 342343]), [
    ['bigint', 1],
    ['date', 1],
    ['function', 1],
    ['null', 1],
    ['number', 1],
    ['string', 2],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes(['', null, new Map(), new Set(), undefined]), [
    ['map', 1],
    ['null', 1],
    ['set', 1],
    ['string', 1],
    ['undefined', 1],
]);
