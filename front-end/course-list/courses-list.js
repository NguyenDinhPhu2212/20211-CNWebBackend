import { url, isLogin, getProfile } from "../js/header.js";

var course = "co-ban";
if (isLogin()) {
    document.querySelector("#avatar").src = sessionStorage.getItem("filename");
    const profile = await getProfile();

    //set listener
    document.getElementsByName("tabs").forEach((e) => {
        e.addEventListener("change", getAllLessons(e.value));
    });

    if (sessionStorage.getItem("level")) {
        course = sessionStorage.getItem("level");
    }

    await getAllLessons(course);
}

async function getAllLessons(course) {
    sessionStorage.setItem("level", course);
    const response = await fetch(url + "learn/" + course, {
        method: "GET",
        withCredentials: true,
        headers: {
            token: sessionStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    if (data["success"]) {
        showLessonsList(data["data"], course);
    }
}
function showLessonsList(data, course) {
    var courseEle = document.getElementsByClassName(course)[0];
    courseEle.innerHTML = "";
    if (data.length !== 0) {
        data.forEach((element) => {
            var lessonEle = document.createElement("div");
            lessonEle.className = "lesson";

            //create lesson index div
            var lesson_index = document.createElement("div");
            lesson_index.className = "lesson_index";
            var aEle = document.createElement("div");
            aEle.addEventListener("click", (e) => {
                sessionStorage.setItem("lesson_slug", element["slug"]);
                sessionStorage.setItem("level_slug", element["level"]);
                sessionStorage.setItem("lessonId", element._id);
                window.location.href = "/front-end/lesson/lesson.html";
            });
            aEle.innerText = element["number"];
            lesson_index.appendChild(aEle);

            //create name div
            var lesson_name = document.createElement("div");
            lesson_name.className = "lesson_name";
            lesson_name.innerText = element["name"];

            //append to lesson div
            lessonEle.appendChild(lesson_index);
            lessonEle.appendChild(lesson_name);

            if (element["complete"] == false) {
                lessonEle.firstChild.classList.add("none");
            }
            courseEle.appendChild(lessonEle);
        });
    }
}
