function post() {
    const date = document.querySelector("#datapicker").value;
    const person = document.querySelector("#person").value;
    console.log(`Date ${date} Person ${person}`);
    //fetch kureła stolików
    const response = await fetch('localhost:3000/book/tables');
    const myJson = await response.json();
    console.log(JSON.stringify(myJson));
}