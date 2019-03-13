export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}
export function keepKeysOfEntity(myResult,nodeData) {
    let myNewValue = {};
    let entitySave = {};
    Object.keys(myResult).map(key => entitySave[key] = nodeData[key]);
    return entitySave;
}
export function arr_diff(a1, a2) {
    var a = [], diff = {};
    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        }
        else {
            a[a2[i]] = true;
        }
    }
    for (var k in a) {
        diff[k] = null;
    }
    return diff;
}
export function concatForEntity(res, myArraytoKeep) {
    let myNewValue = {};
    Object.keys(myArraytoKeep).map(key => res[key] = myArraytoKeep[key]);
    return res;
}
export interface QueryOption {
    select?: string;
    filter?: string;
    params?: string[];
    pageSize?: number;
    start?: number;
    orderBy?: string;
    method?: string;
    emMethod?: string;
}
export function mapFilterSorter(paramsAgGrid, queryFilter): QueryOption {

    let myParams = {
        filter: filter(paramsAgGrid.filterModel, queryFilter),
        start: paramsAgGrid.startRow,
        pageSize: paramsAgGrid.paginationPageSize,
        orderBy: orderBy(paramsAgGrid.sortModel)
    }
    return myParams
}
function orderBy(sortModel) {
    let orderBy: string = ""
    var orderByPresent = sortModel && Object.keys(sortModel).length > 0;
    let myKeys = Object.keys(sortModel)
    if (!orderByPresent) {
        return "";
    }
    for (var i = 0; i < Object.keys(sortModel).length; i++) {
        let myKey = myKeys[i]
        let myorderBy = sortModel[myKey]
        //il me semble qu'il n'y a jamais qu'une seule key
        orderBy = orderBy + myorderBy.colId + ' ' + myorderBy.sort
    }
    return orderBy
}
function filter(filterModel, queryFilter) {

    let filter: string = ""
    var filterPresent = filterModel && Object.keys(filterModel).length > 0;
    let myKeys = Object.keys(filterModel)
    if (!filterPresent) {
        return (queryFilter) ? queryFilter : "";
    }
    for (var i = 0; i < Object.keys(filterModel).length; i++) {
        let $op = '', $eq = '', $start = '', $stop = ''
        if (i > 0) $op = ' AND '
        let myKey = myKeys[i]
        let myFilter = filterModel[myKey]
        //c'est ici qu'on gère les conditions
        if (Object.keys(myFilter).indexOf("condition1") !== -1) {
            let myNewFilter = myFilter.condition1
            //on calcule le comparateur par rapport au type de filterModel
            $eq = filterComparateur(myNewFilter.type)
            $start = filterStart(myNewFilter.type)
            $stop = filterStop(myNewFilter.type)
            filter = filter + $op + myKey + $eq + $stop + myNewFilter.filter + $start;
            $op = " " + myFilter.operator + " "
            myNewFilter = myFilter.condition2
            $eq = filterComparateur(myNewFilter.type)
            $start = filterStart(myNewFilter.type)
            $stop = filterStop(myNewFilter.type)
            filter = filter + $op + myKey + $eq + $stop + myNewFilter.filter + $start;
        } else {
            //on calcule le comparateur par rapport au type de filterModel
            $eq = filterComparateur(myFilter.type)
            $start = filterStart(myFilter.type)
            $stop = filterStop(myFilter.type)
            filter = filter + $op + myKey + $eq + $stop + myFilter.filter + $start;
        }
    }
    filter = (queryFilter) ? `(${filter}) AND ${queryFilter}` : filter
    return filter
}
function filterComparateur(type): string {

    switch (type) {
        case 'contains':
        case 'startsWith':
        case 'equals':
        case 'endsWith':
            return '=='
        case 'notEqual':
        case 'notContains':
            return '!=='
        case 'lessThan':
            return '<='
        case 'greaterThan':
            return '>='
        case 'default':
            return '=='
    }
}
function filterStart(type): string {
    switch (type) {
        case 'contains':
        case 'startsWith':
            return '*'
        default:
            return ''
    }
}
function filterStop(type): string {
    switch (type) {
        case 'contains':
        case 'endsWith':
            return '*'
        default:
            return ''
    }
}