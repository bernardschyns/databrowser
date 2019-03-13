//toplace queryFilterSearch
// .map(
//     (a, i) => {
//         let columnDef = {}
//         let indexKeyList = listeKeys.indexOf(a.name)
//         if (!(indexKeyList == -1)) {
//             Object.keys(liste[a.name]).map(key => columnDef[key] = liste[a.name][key])
//         }
//         if (counterFilter !== 0 ) {
//             switch (statusDetected) {
//                 case (true): {
//                     statusDetected = (statusDetected) ? false : true
//                     queryFilter = `${queryFilter} AND (`
//                     break
//                 }
//                 case (false): {
//                     switch (a.kind) {
//                         case ('alias'): { break }
//                         default: {
//                             switch (a.name) {
//                                 case ('ID'): { break }
//                                 case ('status'):
//                                     {
//                                         queryFilter = `${queryFilter} AND`
//                                         break
//                                     }
//                                 default: {
//                                     queryFilter = `${queryFilter} OR`

//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }

//         switch (a.kind) {
//             case ('alias'): { break }
//             default: {
//                 switch (a.name) {
//                     case ('ID'): { break }
//                     case ('status'):
//                         {
//                             statusDetected = (statusDetected) ? false : true
//                             queryFilter = `${queryFilter} ${a.name} = true`
//                             counterFilter++
//                             break
//                         }

//                     default: {
//                         queryFilter = `${queryFilter} ${a.name} == :1`
//                         counterFilter++
//                     }
//                 }
//             }
//         }
//         if (counterFilter== counter+1 ) {
//             queryFilter = `${queryFilter})`
//         }
//         if (a.name == "ordre") {
//             columnDef["hide"] = true;
//         }
//         if (!columndragged) {
//             columnDef["rowDrag"] = true;
//             columndragged = true
//         }
//         if (a.kind == 'alias') {
//             columnDef["cellEditor"] = 'aliasEditorComponent';
//             // columnDef["cellEditorParams"] =function(params) {
//             //     var selectedCountry = 'Ireland'
//             //     if (selectedCountry==='Ireland') {
//             //         return {
//             //             values: ['Dublin','Cork','Galway']
//             //         };
//             //     } else {
//             //         return {
//             //             values: ['New York','Los Angeles','Chicago','Houston']
//             //         };
//             //     }
//             // }
//         }
//         if (a.kind == "calculated"
//             // || a.kind == "alias"
//         ) columnDef["editable"] = false
//         columnDef["headerName"] = a.name;
//         columnDef["field"] = a.name
//         switch (a.type) {
//             case 'bool': {
//                 columnDef["cellRenderer"] = "boolEditorComponent"
//                 columnDef["width"] = 40;
//                 break
//             }
//             case 'string': {
//                 if (myClassName == "WakandaLogin") {
//                     switch (a.name) {
//                         case 'html':
//                         case 'cssForm':
//                         case 'html':
//                         case 'cssStructure':
//                         case 'script':
//                             columnDef["cellEditor"] = "textEditorComponent"
//                             break
//                     }
//                 }
//                 break
//             }
//             case 'number':
//             case 'long': {
//                 columnDef["filter"] = "agNumberColumnFilter"
//                 columnDef["filterParams"] = {
//                     filterOptions: ["equals", "lessThan", "greaterThan"],
//                     newRowsAction: "keep"
//                 }
//                 columnDef["cellEditor"] = "numericEditorComponent"

//                 if (a.name == "total" || a.name == "sousTotal" || a.name == "prix" || a.name == "salary") {
//                     columnDef["cellRenderer"] = "numberFormatterComponent"
//                 } else {
//                     columnDef["valueParser"] = this.numberParser
//                 }
//                 break
//             }
//             case 'image': {
//                 columnDef["cellRenderer"] = this.countryCellRenderer
//                 columnDef["cellEditor"] = "photoEditorComponent"
//                 break
//             }
//             case 'date': {
//                 columnDef["cellEditor"] = "dateEditorComponent"
//                 columnDef["cellRenderer"] = this.dateCellRenderer
//                 break
//             }
//             case 'object': {
//                 columnDef["valueFormatter"] = this.objectCellRenderer
//                 columnDef["valueSetter"] = this.valueSetter
//                 columnDef["cellEditor"] = "textEditorComponent"
//                 break
//             }
//         }
//         return columnDef
//     }
// );