document.getElementById("submit").addEventListener("click",randomnum);
document.getElementById("reset").addEventListener("click",resetopt);
function randomnum(){
    let min=parseInt(document.getElementById("min").value);
    let max=parseInt(document.getElementById("max").value);
    if(min>=max){
        document.getElementById("output").innerHTML="Please enter minimum value less than maximum value";
        return;
    }
    let randomnumber=Math.floor(Math.random() * (max - min) + min);
    document.getElementById("output").innerHTML= `The random number is ${randomnumber}`;

}
function resetopt(){
    document.getElementById("output").innerHTML="";
}