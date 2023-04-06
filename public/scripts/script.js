let is_visible = false;

document.getElementById("see").addEventListener("click", () => {
    let input = document.getElementById("password");
    let see = document.getElementById("see");

    if (is_visible) {
        input.type = 'password';
        is_visible = false;
        see.style.color = 'gray';
    }
    else {
        input.type = 'text';
        is_visible = true;
        see.style.color = '#262626';
    }

});


let passInput = document.getElementById("password");

passInput.addEventListener('focus', function () {
    document.getElementById('pass-field').classList.remove('hide');
});

passInput.addEventListener('blur', function () {
    document.getElementById('pass-field').classList.add('hide');
});
passInput.addEventListener("input", () => {
    let input = document.getElementById("password").value;

    input = input.trim();
    document.getElementById("password").value = input;
    if (input.length >= 8) {
        document.getElementById("check0").style.color = "green";
    }
    else {
        document.getElementById("check0").style.color = "red";
    }
    if (input.match(/[A-Z]/)) {
        document.getElementById("check1").style.color = "green";
    }
    else {
        document.getElementById("check1").style.color = "red";
    }
    if (input.match(/[a-z]/)) {
        document.getElementById("check2").style.color = "green";
    }
    else {
        document.getElementById("check2").style.color = "red";
    }
    if (input.match(/[!@#$&*]/)) {
        document.getElementById("check3").style.color = "green";
    }
    else {
        document.getElementById("check3").style.color = "red";
    }
    if (input.match(/[0-9]/)) {
        document.getElementById("check4").style.color = "green";
    }
    else {
        document.getElementById("check4").style.color = "red";
    }
});
