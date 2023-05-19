/* ---------------- ONLY PROMISE APPROACH ------------------ */
let valueToShowInsidePromise = 1

let x = (nr) => new Promise((resolve, reject) => {
    if(nr === 1) resolve("works!")
    else reject("rejected!")
})

x(1)
.then(res=> {
console.log(res)
console.log(valueToShowInsidePromise)
return {promiseData: res, promise: x(2)}
})
.then(res => {
console.log("secnd promise data from first promise: "+res.promiseData)
res.promise
.then(res => console.log(res))
.catch(err => console.log("ERROR SEC PROMISE: "+err))
})
.catch(err => console.log("ERROR: "+err))

console.log("PROMISES ARE ALSO ASYNC BY DEFAULT")
/* ---------------- ONLY PROMISE APPROACH ------------------ */

/* ---------------- ASYNC/AWAIT APPROACH ------------------ */
let valueToShowInsidePromise = 1

// without await keyword
/*let x = async (nr) => {
if(nr === 1) return Promise.resolve("works!")
    else return Promise.reject("rejected!")
}*/


function waitForMe(nr, promiseNr){
return new Promise( (res, err) => {
setTimeout(() =>{
if(nr === 1) res("works! "+promiseNr )
else err("rejected! "+promiseNr)
}, 2000)
})
}

function waitForMeDelayed(nr, promiseNr){
return new Promise( (res, err) => {
setTimeout(() =>{
if(nr === 1) res("works! "+promiseNr )
else err("rejected! "+promiseNr)
}, 1000)
})
}

// with await keyword
/*let x = async (nr) => {

// it waits for this instruction to finish before continue
let jForTest = await waitForMe(nr)
return jForTest
}

x(1)
.then(res=> {
console.log(res)
console.log(valueToShowInsidePromise)
return [res, x(2)]
})
.then(res => {
res[1]
.then()
console.log("secnd promise data from first promise: "+res.promiseData)

})
.catch(err => console.log("ERROR: "+err))*/


// with await keyword and more than one promise
let x = async (nr, promiseNr) => {

// it waits for this instruction to finish before continue
let jForTest = (promiseNr === 2)? await waitForMeDelayed(nr, promiseNr): waitForMe(nr, promiseNr)
return jForTest
}

let firstPromise = x(1, 1)
let secPromise = x(1, 2)
let thirdPromise = x(1, 3)

// so for the case that you try to resolve more than one promise it will wait for all of them to finish vbefore sending response
// seems ideal for our db connections dependency

/**
@returns {Array[Resolved Promises]}
*/
async function testAllPromise(){
let proRes = await Promise.all([firstPromise,secPromise,thirdPromise])
return proRes
}

testAllPromise()
.then(res => {
res.forEach(x => console.log(x))
})
.catch(err => console.log(err))

console.log("ASYNC/AWAIT")

/* ---------------- ASYNC/AWAIT APPROACH ------------------ */
