let staffBtnEl = document.getElementById("staffBtn");
let studentBtnEl = document.getElementById("studentBtn");
let mainLoginContainer = document.getElementById("mainLoginContainer");
let staffLoginContainer = document.getElementById("staffLoginContainer");
let formEl = document.getElementById("myForm");
let userEl = document.getElementById("userId");
let passwordEl = document.getElementById("userPassword");
let userErrMsg = document.getElementById("userIdErrMsg");
let passwordErrMsg = document.getElementById("passWordErrMsg");
let loginBtnEl = document.getElementById("loginBtn");
let prepContianer = document.getElementById("prepContainer");
let uploadContainer = document.getElementById("uploadContainer");
let coreEeeCard = document.getElementById("coreEEE");
let itCard = document.getElementById("it");
let coreEeeContainer = document.getElementById("coreEeeContainer")
let itContainer = document.getElementById("itContainer")
const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileName');
const uploadBtn = document.getElementById('uploadBtn');
staffLoginContainer.classList.add("d-none");
prepContainer.classList.add("d-none");
uploadContainer.classList.add("d-none");
coreEeeContainer.classList.add("d-none");
itContainer.classList.add("d-none");
staffBtnEl.onclick = function() {
    mainLoginContainer.classList.add("d-none");
    staffLoginContainer.classList.remove("d-none");
    uploadContainer.classList.add("d-none");
};
studentBtnEl.onclick = function() {
    mainLoginContainer.classList.add("d-none");
    staffLoginContainer.classList.remove("d-none");
    uploadContainer.classList.add("d-none");
};
loginBtnEl.onclick = function() {
    if (userEl.value === "psgitech" && passwordEl.value === "psgitech") {
        mainLoginContainer.classList.add("d-none");
        staffLoginContainer.classList.add("d-none");
        prepContainer.classList.remove("d-none");
    }
    else if (userEl.value === "staff" && passwordEl.value === "staff") {
        mainLoginContainer.classList.add("d-none");
        staffLoginContainer.classList.add("d-none");
        prepContainer.classList.add("d-none");
        uploadContainer.classList.remove("d-none");
    }
    else if ( userEl.value === "" && passwordEl.value === "") {
        userErrMsg.textContent = "*Required";
        passwordErrMsg.textContent = "*Required";
    }
    else {
        alert("Your userId or password is wrong");
    }
}
userEl.addEventListener("blur", function() {
    let inputValue = userEl.value;
    if ( inputValue === "") {
        userErrMsg.textContent = "*Required";
    }
    else {
        userErrMsg.textContent = "";
    }
});
passwordEl.addEventListener("blur", function() {
    let psValue = passwordEl.value;
    if ( psValue === "") {
        passwordErrMsg.textContent = "*Required";
    }
    else {
        passwordErrMsg.textContent = "";
    }
});
loginBtnEl.addEventListener("click", function(event) {
    event.preventDefault();
    if (userEl.value === "") {
        userErrMsg.textContent = "*Required";
    }
    else {
        userErrMsg.textContent = "";
    }
    if (passwordEl.value === "") {
        passwordErrMsg.textContent = "*Required";
    }
    else {
        passwordErrMsg.textContent = "";
    }
})
itCard.onclick = function() {
    staffLoginContainer.classList.add("d-none");
    prepContainer.classList.add("d-none");
    uploadContainer.classList.add("d-none");
    itContainer.classList.remove("d-none");
    coreEeeContainer.classList.add("d-none");
    mainLoginContainer.classList.add("d-none");
}
coreEeeCard.onclick = function() {
    staffLoginContainer.classList.add("d-none");
    prepContainer.classList.add("d-none");
    uploadContainer.classList.add("d-none");
    itContainer.classList.add("d-none");
    coreEeeContainer.classList.remove("d-none");
    mainLoginContainer.classList.add("d-none");
}
