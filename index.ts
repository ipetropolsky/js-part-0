// Test utils
type TTestsResult = boolean | string | Array<string | [string, number]>;

const testBlock = (name: string) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

const areEqual = (a: any, b: any) =>
    typeof a === 'object' && typeof b === 'object' ? JSON.stringify(a) === JSON.stringify(b) : a === b;

const test = (whatWeTest: string, actualResult: TTestsResult, expectedResult: TTestsResult) => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expected:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

// Functions

const getType = (value: any) => typeof value;
const getTypesOfItems = (arr: Array<any>) => arr.map((item) => getType(item));
const allItemsHaveTheSameType = (arr: Array<any>) => new Set(getTypesOfItems(arr)).size === 1;

const getRealType = (value: any) => {
    if (Number.isNaN(value)) {
        return 'NaN';
    } else if (value === null) {
        return 'null';
    } else if (value instanceof Date) {
        return 'date';
    } else if (value instanceof Set) {
        return 'set';
    } else if (Array.isArray(value)) {
        return 'array';
    } else if (value === Infinity) {
        return 'Infinity';
    } else if (value instanceof RegExp) {
        return 'regexp';
    } else if (value instanceof Error) {
        return 'error';
    } else if (value instanceof Map) {
        return 'map';
    }
    return typeof value;
};

const getRealTypesOfItems = (arr: Array<any>) => arr.map((item) => getRealType(item));

const everyItemHasAUniqueRealType = (arr: Array<any>): boolean => new Set(getRealTypesOfItems(arr)).size === arr.length;

const countRealTypes = (arr: Array<any>) => {
    type TValues = {
        [item: string]: number;
    };
    const obj = getRealTypesOfItems(arr)
        .sort()
        .reduce((acc: TValues, item) => ({ ...acc, [item]: (acc[item] || 0) + 1 }), {});
    return Object.entries(obj);
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
// @ts-expect-error: https://github.com/microsoft/TypeScript/issues/27910
test('Values like a number', allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]), true);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    true,
    1,
    'qw',
    [1, 2],
    {},
    undefined,
    null,
    NaN,
    /[123456]/,
    Infinity,
    () => {},
    new Date(),
    new Set(),
    new Error(),
    new Map(),
    BigInt('324248543785632583178241874278124462623'),
    Symbol('1'),
];

test('Check basic types', getTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'object',
    'object',
    'undefined',
    'object',
    'number',
    'object',
    'number',
    'function',
    'object',
    'object',
    'object',
    'object',
    'bigint',
    'symbol',
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'array',
    'object',
    'undefined',
    'null',
    'NaN',
    'regexp',
    'Infinity',
    'function',
    'date',
    'set',
    'error',
    'map',
    'bigint',
    'symbol',
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

// @ts-expect-error: https://github.com/microsoft/TypeScript/issues/27910
test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === 123]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

// Add several positive and negative tests
