class T {
    constructor() {
    }

    testFunction() {
        console.log("aaa");
    }
}
const tt = new T();
tt.testFunction();
console.log(tt);
console.log(tt.testFunction);
console.log(T);
console.log(T.testFunction);

for (const key in tt) {
    console.log(key);
}