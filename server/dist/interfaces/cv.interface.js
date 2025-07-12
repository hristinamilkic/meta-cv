"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sum(...numbers) {
    let result = 0;
    for (let i = 0; i < numbers.length; i++) {
        result += numbers[i];
    }
    return result;
}
const numbers = [1, 2, 3, 4, 5];
console.log(sum(...numbers));
//# sourceMappingURL=cv.interface.js.map