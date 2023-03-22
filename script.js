const passwordFeild = document.querySelector("[data-passwordDisplay]")
const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNum]") 
const copybtn = document.querySelector("[data-copybtn]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercheck = document.querySelector("#uppercase")
const lowercheck= document.querySelector("#lowercase")
const numbercheck = document.querySelector("#number")
const symbolcheck= document.querySelector("#symbol")
const indicator = document.querySelector("[data-indicator]")
const generate = document.querySelector(".generate-btn")
const allcheckbox = document.querySelectorAll('input[type=checkbox]')


let password = "" ;
let passwordLength = 10 ; 
let checkCount = 0 ; 
let symbols = "!@#$%^&*(){[}]|\?><~`+-_='"

handleSlider() ; 

function handleSlider(){
    inputSlider.value = passwordLength
    lengthDisplay.innerText = passwordLength ;  
}

function generateRandInt(min , max){
    return Math.floor(Math.random() * (max - min) ) + min ;  
}

function generateRandNumber(){
    return generateRandInt(0,9) ; 
}

function generateLowerCase(){
    return String.fromCharCode(generateRandInt(97, 122)) ; 
}

function generateUpperCase(){
    return String.fromCharCode(generateRandInt(65, 90 )) ; 
}
function setIndicator(color){
    indicator.style.backgroundcolor= color ; 
    indicator.style.boxShadow = color ; 
    
}

function generateSymbols(){
    return symbols.charAt(generateRandInt(0,symbols.length) ); 
}

function calcStrength(){
    let hasUpper= false ; 
    let hasLower = false ; 
    let hasNumbers = false ; 
    let hasSymbols = false ; 
    if(uppercheck.checked) hasUpper = true ; 
    if(lowercheck.checked) hasLower = true ; 
    if(numbercheck.checked) hasNumbers = true ; 
    if(symbolcheck.checked) hasSymbols = true ; 

    if(hasUpper && hasLower && (hasNumbers && hasSymbols) && passwordLength >= 9){
        setIndicator("#05cf57") ; 
    }
    else if(hasLower && (hasNumbers || hasSymbols) && passwordLength >= 8){
        setIndicator("#29f87d") ; 
    }
    else if(hasLower && hasNumbers && passwordLength >=8){
        setIndicator("#D3f2e0") ;
    }
    else{
        setIndicator("red") ; 
    }
}

async function copyContent(){
    navigator.clipboard.writeText(passwordFeild.value) ; 

    try {
        await navigator.clipboard.writeText(passwordFeild.value) ;
        copyMsg.innerText = "copied" ;
    }
    catch(e){
        copyMsg.innerText = "Failed" ; 
    }

    setTimeout( () => {
        copyMsg.classList.add('active') ; 
    } , 3000)
}

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value ;
    handleSlider() ;  
} )

function handleChange(){
    checkCount = 0; 
    allcheckbox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++ ;
        }
    })

    if(passwordLength < checkCount){
        passwordLength = checkCount ; 
        handleSlider() ; 
    }
}

allcheckbox.forEach((element) => {
    element.addEventListener('change' , handleChange)
})

function  shufflePassword(array){
    for(i= array.length -1 ; i>0 ; i--){
        const j = Math.floor(Math.random()* (i+1)) ;
        const temp = array[i] ; 
        array[i] = array[j] ; 
        array[j] = temp ;
    }

    let str = "" ; 
    array.forEach(e=>{
        str +=e ;
    })

    return str ; 
}

generate.addEventListener('click' , (e)=>{
    password =""
    passwordFeild.value =password ;  
    if(checkCount ==0){
        return ;
    }

    if(passwordLength < checkCount){
        //
        passwordLength = checkCount ; 
        handleSlider() ; 
    }

    let funArr = [] ;
    
    if(uppercheck.checked){
       funArr.push(generateUpperCase) ;
    }
    if(lowercheck.checked){
       funArr.push(generateLowerCase) ;
    }
    if(numbercheck.checked){
       funArr.push(generateRandNumber) ;
     }
    if(symbolcheck.checked){
        funArr.push(generateSymbols) ;
     }

     for(i =0 ; i< funArr.length ; i++){
        password += funArr[i]() ; 
     }

     for(i = 0 ; i<passwordLength - funArr.length ; i++){
        let randInt = generateRandInt(0,funArr.length) ;
        password +=  funArr[randInt]() ; 
    }


    password = shufflePassword(Array.from(password)) ; 

    passwordFeild.value = password ;  
    calcStrength() ; 
})

copybtn.addEventListener('click' ,(e)=>{
    if(passwordFeild.value){
        copyContent() ; 
    }
})
