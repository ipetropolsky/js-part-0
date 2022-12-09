/*
Здесь большое примечание



*/

const primitive_types = {  // Массив (объект) для провекри однозначных типов
    boolean: true,
    string: "whoo",
    function: () => { },
    undefined: undefined,
    bigint: BigInt(1),
}

const standart_types = Object.assign({}, primitive_types, { // Стандартные типы (включают однозначные)
    number: 123,
    object: {},
    "array/object": [],
    "null/object": null,
});

const real_types = Object.assign({}, primitive_types, {  // Фактические типы (включают однозначные, но не все стандартные)
    number: 123,
    object: {},
    array: [],
    null: null,
    NaN: "a" / 2,
    Infinity: 1 / 0,
    date: new Date,
    regexp: /ab+c/,
    set: new Set([1, 1, 2]),
});



// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
}

const areEqual = (a, b) => {
    //console.log('**********',getRealType(a),getRealType(b));
    if (getRealType(a) == 'array' && getRealType(b) == 'array') { // Если оба элемента массива то сравниваем поэлементно. И надеемся на одномерность
        for (let key in a) {
            return areEqual(a[key], b[key]);
        }
        return true;
    }
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
    let ret = [];
    for (let key in arr) {
        ret[key] = getType(arr[key]);
    }
    return ret;
}

const allItemsHaveTheSameType = (arr) => {
    // Return true if all items of array have the same type
    let types = countRealTypes(arr);
    if (types.length == 1) { return true; } // Типов 1 штука, значит совпало
    if (types.length > 1) { return false; } // Типов несколько - значит разные
    return null; // Типов вообще нету (пустота на входе)
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
    if (real_type in primitive_types) { // Если тип однозначный то сразу вернём
        return real_type;
    }

    let subtypes = [null, null, null, null]; // Не знаю как правильно try функционально оформлять, в php это можно сразу вычислить в массив
    try {
        subtypes[0] = value.length;
    } catch (error) { }
    try {
        subtypes[1] = value.getYear();
    } catch (error) { }
    try {
        subtypes[2] = '' + value.exec("");
    } catch (error) { }
    try {
        subtypes[3] = value.size;
    } catch (error) { }

    real_types_check = { // Локальный массив массивов для сверки дополнительных типов
        number: {
            NaN: isNaN(value),
            Infinity: value > Number.MAX_VALUE,
            number: true,
        },
        object: {
            null: value + '' === 'null',
            array: subtypes[0] > -1,
            date: typeof subtypes[1] == 'number',
            regexp: subtypes[2] == 'null',
            set: typeof subtypes[3] == 'number'
        }
    }
    if (real_type in real_types_check) {
        for (let key in real_types_check[real_type]) {  // TODO  переделать на функциональщину
            if (real_types_check[real_type][key]) {
                return key;
            }
        }
    }

    return real_type; // Хоть чё-то вернём, может угадаем

}

const getRealTypesOfItems = (arr) => {
    // Return array with real types of items of given array
    let ret = [];
    for (let key in arr) {
        ret[key] = getRealType(arr[key]);
    }
    return ret;
};

const everyItemHasAUniqueRealType = (arr) => {
    // Return true if there are no items in array
    // with the same real type
    return countRealTypes(arr).length == arr.length;
};



const countRealTypes = (arr) => {
    // Return an array of arrays with a type and count of items
    // with this type in the input array, sorted by type.
    // Like an Object.entries() result: [['boolean', 3], ['string', 5]]
    let type;
    let ret = [];
    for (let key in arr) {
        type = getRealType(arr[key]);
        ret[type] = type in ret ? ret[type] + 1 : 1;
    }
    let ret2 = [];
    for (let key in real_types) {  // Эта фиговина сортирует по типу (перебираем массив сначала)
        if (ret[key]) {
            ret2.push([key, ret[key]]);
        }
    }
    return ret2;
};

function array_fn_iteration(arr, fn) {  // Функция проверки всех типов
    let params;  //  Массив параметров
    for (let key in arr) {  // Я знаю что эта запись не совсем корректна и совсем не в функциональном стиле
        params = key.split("/"); // разбиваем ключ на пару
        test(params[0][0].toUpperCase() + params[0].slice(1), fn(arr[key]), params[1] ? params[1] : params[0]);
    }
}

// Tests



testBlock("getType");  // Тестируем встроенные типы
array_fn_iteration(standart_types, getType);

testBlock("getRealType"); //  Тестируем расширенные типы
array_fn_iteration(real_types, getRealType);

//console.log(getTypesOfItems(standart_types)); // Тестируем стандартные типы
//console.log(countRealTypes([1,2,3,'4','5',[]])); // Тестируем расширенные типы

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
    false // What the result?
);

test(
    'Values like a number',
    allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]),
    false // What the result?
);

test(
    'Values like an object',
    allItemsHaveTheSameType([{}
        // , Add as many as possible 
    ]),
    true
);

testBlock('getTypesOfItems VS getRealTypesOfItems');
/*
const knownTypes = [
    // Add values of different types like boolean, object, date, NaN and so on
];
//  knownTypes - переделал на переменную - так писать легче
*/

var knownTypes = []; // Значение типов
var knownTypesNames = []; // Наименования этих типов
for (key in primitive_types) { // Заполняем значения и наименования
    knownTypes.push(primitive_types[key]);
    knownTypesNames.push(key);
}

test(
    'Check basic types',
    getTypesOfItems(knownTypes),
    knownTypesNames
);


var knownTypes = []; // Значение типов
var knownTypesNames = []; // Наименования этих типов
for (key in real_types) { // Заполняем значения и наименования
    knownTypes.push(real_types[key]);
    knownTypesNames.push(key);
}

test(
    'Check real types',
    getRealTypesOfItems(knownTypes),
    knownTypesNames,
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

// В этой функции с последовательностью фигово: в реальной жизни порядок может поменятся
// рекомендуется через объекты-массивы задавать такую фигню, например:
//  { 'boolean':3,'null':1,'object':1 }
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
