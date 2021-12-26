
function myfunct(value) {
    var div = document.getElementById("div");
    var text = "";

    if (value == 1) text += "true";
    if (value == 2) text += "false";
    if (value == 3) text += "false";

    div.innerHTML = text;
}