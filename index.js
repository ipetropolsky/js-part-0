// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
}

const areEqual = (a, b) => {
    return a === b;
    // Compare arrays of primitives
    // Remember: [] !== []
}

const test = (whatWeTest, actualResult, expectedResult) => {
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
}


// Functions 

const getType = (value) => {
    // Return string with a native JS type of value
    return typeof value;

}

const getTypesOfItems = (arr) => {
    // Return array with types of items of given array

}

const allItemsHaveTheSameType = (arr) => {
    // Return true if all items of array have the same type
};

const getRealType = (value) => {
    // Return string with a “real” type of value.
    // For example:
    //     typeof new Date()       // 'object'
    //     getRealType(new Date()) // 'date'
    //     typeof NaN              // 'number'
    //     getRealType(NaN)        // 'NaN'
    // Use typeof, instanceof and some magic. It's enough to have
    // 12-13 unique types but you can find out in JS even more :)
    let real_type = typeof value;

    if (['boolean','string','function','undefined','bigint'].includes(real_type)) {
        return real_type;
    }
    if (real_type === 'number') {
        if (isNaN(value)) {
            return 'NaN';
        }
        if(value > Number.MAX_VALUE){
            return 'Infinity';
        }
        return real_type
    }
    if (real_type === 'object') {
        let value2 = value + '';
        if (value2 === 'null') {
            return 'null';
        }
        let len='year';
        try{
            len=value.length;
        }catch(error){}
        if (len > -1){
            return 'array';
        }
        try{
            len = value.getYear();
        }catch(error){}
        if(typeof len == 'number'){
            return 'date';
        }
        try{
            len=''+value.exec("");
        }catch(error){}
        if(len == 'null'){
            return 'regexp';
        }
        try{
            len=value.size;
        }catch(error){}
        if(typeof len == 'number'){
            return 'set';
        }

    }
    return real_type;
}

const getRealTypesOfItems = (arr) => {
    // Return array with real types of items of given array
};

const everyItemHasAUniqueRealType = (arr) => {
    // Return true if there are no items in array
    // with the same real type
};

const countRealTypes = (arr) => {
    // Return an array of arrays with a type and count of items
    // with this type in the input array, sorted by type.
    // Like an Object.entries() result: [['boolean', 3], ['string', 5]]
};


standart_types = {  // Массив (объект) для провекри реальных типов
    "boolean": true,
    "number": 123,
    "string": "whoo",
    "array/object": [],
    "object": {},
    "function": () => { },
    "undefined": undefined,
    "null/object": null,
}

extended_types = Object.assign({}, standart_types, {
    "array": [],
    "null": null,
    "NaN": "a" / 2,
    "Infinity": 1 / 0,
    "date": new Date,
    "regexp": /ab+c/,
    "set": new Set([1,1,2]),
    "bigint": BigInt(1),
});

delete extended_types["array/object"];  // Это лишние для расширенных
delete extended_types["null/object"];


function array_fn_iteration (array, fn){  // Функция проверки всех типов
    let params;  //  Массив параметров
    for ( let key in array ) {  // Я знаю что эта запись не совсем корректна и совсем не в функциональном стиле
        params = key.split("/"); // разбиваем ключ на пару
        test(params[0][0].toUpperCase() + params[0].slice(1), fn(array[key]), params[1]?params[1]:params[0]);
    }    
}

// Tests

testBlock("getType");  // Тестируем встроенные типы
array_fn_iteration (standart_types, getType);

testBlock("getRealType"); //  Тестируем расширенные типы
array_fn_iteration (extended_types, getRealType);


testBlock('allItemsHaveTheSameType');

test(
    'All values are numbers',
    allItemsHaveTheSameType([11, 12, 13]),
    true
);

test(
    'All values are strings',
    allItemsHaveTheSameType(['11', '12', '13']),
    true
);

test(
    'All values are strings but wait',
    allItemsHaveTheSameType(['11', new String('12'), '13']),
    // What the result?
);

test(
    'Values like a number',
    allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]),
    // What the result?
);

test(
    'Values like an object',
    allItemsHaveTheSameType([{}/* , Add as many as possible */]),
    true
);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    // Add values of different types like boolean, object, date, NaN and so on
];

test(
    'Check basic types',
    getTypesOfItems(knownTypes),
    [
        // What the types?
    ]
);

test(
    'Check real types',
    getRealTypesOfItems(knownTypes),
    [
        'boolean',
        'number',
        'string',
        'array',
        'object',
        'function',
        'undefined',
        'null',
        'NaN',
        'Infinity',
        'date',
        'regexp',
        'set',
        'bigint',
        // What else?
    ]
);

testBlock('everyItemHasAUniqueRealType');

test(
    'All value types in the array are unique',
    everyItemHasAUniqueRealType([
        true,
        123,
        '123',
    ]),
    true
);

test(
    'Two values have the same type',
    everyItemHasAUniqueRealType([
        true,
        123,
        '123' === 123,
    ]),
    false
);

test(
    'There are no repeated types in knownTypes',
    everyItemHasAUniqueRealType(knownTypes),
    true
);


testBlock('countRealTypes');

test(
    'Count unique types of array items',
    countRealTypes([
        true,
        null,
        !null,
        !!null,
        {},
    ]),
    [
        ['boolean', 3],
        ['null', 1],
        ['object', 1],
    ]
);

test(
    'Counted unique types are sorted',
    countRealTypes([
        {},
        null,
        true,
        !null,
        !!null,
    ]),
    [
        ['boolean', 3],
        ['null', 1],
        ['object', 1],
    ]
);

// Add several positive and negative tests
