window.addEventListener("DOMContentLoaded", async (event) => {
    console.log("DOM fully loaded and parsed");
    await getDataFromServer(1);
});
document.querySelector("#exitBtn").addEventListener("click", () => {
    window.location.href = "/front-end/course-list/courses-list.html";
});
let success = false;
function myfunct() {
    const answer1 = document.querySelector("#answer1");
    const answer2 = document.querySelector("#answer2");
    const answer3 = document.querySelector("#answer3");
    const progress = document.querySelector("#progress");
    if (answer1.checked == true) {
        if (answer1.getAttribute("correct") == "true") {
            alert("Chính xác");
        } else alert("Sai");
        success = true;
        progress.style.width = `calc(100% / ${
            sessionStorage.getItem("totalQuestions") /
            sessionStorage.getItem("number")
        })`;
        return;
    }
    if (answer2.checked == true) {
        if (answer2.getAttribute("correct") == "true") {
            alert("Chính xác");
        } else alert("Sai");
        success = true;
        return;
    }
    if (answer3.checked == true) {
        if (answer3.getAttribute("correct") == "true") {
            alert("Chính xác");
        } else alert("Sai");
        success = true;
        return;
    }
    if (
        answer1.checked == false &&
        answer2.checked == false &&
        answer3.checked == false
    ) {
        alert("VUi lòng chọn câu trả lời");
        return;
    }
}
var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:

    if (n == x.length - 1) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
}

async function nextPrev() {
    if (
        sessionStorage.getItem("number") <
        sessionStorage.getItem("totalQuestions")
    ) {
        if (success == true)
            await getDataFromServer(
                parseInt(sessionStorage.getItem("number")) + 1
            );
        else alert("Bạn chưa hoàn thành câu hỏi!");
    } else {
        try {
            const response = await axios.post(
                "http://localhost:2709/progress/" +
                    sessionStorage.getItem("lessonId"),
                {},
                { headers: { token: sessionStorage.getItem("token") } }
            );
            if (response.data.success) {
                alert("Bạn đã hoàn thành khóa học.");
                window.location.href =
                    "/front-end/course-list/courses-list.html";
            }
        } catch (error) {
            alert(error.response.data.userMsg);
        }
    }
}
const renderData = (data) => {
    document.querySelector("#question_content").innerHTML =
        data.question.content;
    document
        .querySelector("#answer1")
        .setAttribute("correct", data.answer[0].correct);
    document.querySelector("#answer1_value").innerHTML = data.answer[0].content;
    document
        .querySelector("#answer2")
        .setAttribute("correct", data.answer[1].correct);
    document.querySelector("#answer2_value").innerHTML = data.answer[1].content;
    document
        .querySelector("#answer3")
        .setAttribute("correct", data.answer[2].correct);
    document.querySelector("#answer3_value").innerHTML = data.answer[2].content;
};
const getDataFromServer = async (number) => {
    try {
        const level_slug = sessionStorage.getItem("level_slug");
        const lesson_slug = sessionStorage.getItem("lesson_slug");
        const response = await axios.get(
            `http://localhost:2709/learn/${level_slug}/${lesson_slug}/${number}`,
            { headers: { token: sessionStorage.getItem("token") } }
        );
        const resMsg = response.data;
        if (resMsg.success) {
            console.log(resMsg.data);
            sessionStorage.setItem("number", parseInt(resMsg.data.number));
            sessionStorage.setItem(
                "totalQuestions",
                parseInt(resMsg.data.totalQuestions)
            );
            success = false;
            renderData(resMsg.data);
            document.querySelector("#answer1").checked = true;
        }
    } catch (error) {
        console.log(error);
        // alert(error);
    }
};
