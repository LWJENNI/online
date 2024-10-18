
if ("script" == "script") {

    let lists;

    function finish(data) {
        return new Promise((resolve, reject) => {
            const version = data.version;
            const currentDate = new Date();
            const formattedCurrentDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '.');

            const startDate = data.date[0];
            const endDate = data.date[1];

                lists = data.list;
                document.getElementById("version").innerHTML = `<div class="contentv"><p>Version Patch: ${version} <br>Date: ${formattedCurrentDate} </p></div>`;
                resolve(lists);
                const size = lists.length;
                document.getElementById("info").innerHTML = "date: " + startDate + " " + endDate + " " + formattedCurrentDate + "<br> patch: " + version + "<br> Size L: " + size;
        });
    }

    const send = 'https://raw.githubusercontent.com/LWJENNI/online/main/date.json';

    fetch(send)
        .then(response => response.json())
        .then(data => finish(data))
        .then(() => {
            main();
        })
        .catch(error => console.error(error));

    //             MAIN               //

    function main() {
        document.getElementById('date').addEventListener('change', updateContent);


        function updateContent() {
            const dayValue = document.getElementById('date').value;
            createScheduleTable(dayValue);
        }

        function translateDay(day) {
            const dayTranslations = {
                "Monday": "Понеділок",
                "Tuesday": "Вівторок",
                "Wednesday": "Середа",
                "Thursday": "Четвер",
                "Friday": "П'ятниця"
            };
            return dayTranslations[day] || day;
        }

        function createScheduleTable(dayName) {
            const schedule = lists[0].class7;
            let html = "";

            switch (dayName) {
                case "online":
                    const now = new Date();
                    const dayOfWeek = now.toLocaleString('en-EN', { weekday: 'long' });
                    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // hh:mm
                    if (dayOfWeek === "Saturday" || dayOfWeek === "Sunday") {
                        html += `<div><div id="error"><h2>Упс! В розкладі немає інформації про даний день: ${dayOfWeek}.</h2></div></div>`;
                        document.getElementById("schedule").innerHTML = html;
                        break;
                    }
                    const lesson = schedule[dayOfWeek];
                    html += `<div class='day-schedule ${dayOfWeek}'><h3>${translateDay(dayOfWeek)}</h3>`;
                    for (json of lesson) {
                        html += `
                            <div class="lesson">
                            <div id="time">${json.time}</div>
                            <button class="text" data-lesson='${json.text}' data-teacher='${json.teacher}' data-time='${json.time}' data-duration='${json.middlelesson}' data-link='${json.link}'>${json.text}</button>
                            <div class="fake-info" style="display: none;"></div>
                            </div>
                        `;

                    }
                    html += `</div>`;
                    document.getElementById("schedule").innerHTML = html;
                    infolesson();
                    break;

                case "all":

                    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                    for (day of days) {
                        if (schedule.hasOwnProperty(day)) {
                            html += `<div class='day-schedule ${day}'><h3>${translateDay(day)}</h3>`;
                            for (json of schedule[day]) {
                                html += `
                            <div class="lesson">
                            <div id="time">${json.time}</div>
                            <button class="text" data-lesson='${json.text}' data-teacher='${json.teacher}' data-time='${json.time}'  data-duration='${json.middlelesson}' data-link='${json.link}'>${json.text}</button>
                            <div class="fake-info" style="display: none;"></div>
                            </div>
                            `;
                            }
                            html += `</div>`;
                            document.getElementById("schedule").innerHTML = html;
                        }
                    }
                    infolesson();
                    break;

                default:
                    if (dayName !== "online" && dayName !== "all") {
                        const lesson = schedule[dayName];
                        html += `<div class='day-schedule ${dayName}'><h3>${translateDay(dayName)}</h3>`;
                        for (json of lesson) {
                            html += `
                            <div class="lesson">
                            <div id="time">${json.time}</div>
                            <button class="text" data-lesson='${json.text}' data-teacher='${json.teacher}' data-time='${json.time}'  data-duration='${json.middlelesson}' data-link='${json.link}'>${json.text}</button>
                            <div class="fake-info" style="display: none;"></div>
                            </div>
                        `;

                        }
                        html += `</div>`;
                        document.getElementById("schedule").innerHTML = html;
                        infolesson();
                        break;
                    }
            }


        }

        createScheduleTable("all");
        startCurrentLessonCheck();
    }



    //             MAIN               //




    function infolesson() {
        const buttons = document.querySelectorAll('.text');
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                const lesson = this.getAttribute('data-lesson');
                const teacher = this.getAttribute('data-teacher');
                const time = this.getAttribute('data-time');
                const duration = this.getAttribute('data-duration');
                const link = this.getAttribute('data-link');

                const [startHour, startMinute] = time.split(':').map(Number);
                const durationMinutes = parseInt(duration);
                const endTime = new Date();
                endTime.setHours(startHour, startMinute + durationMinutes, 0, 0);

                const endHour = String(endTime.getHours()).padStart(2, '0');
                const endMinute = String(endTime.getMinutes()).padStart(2, '0');

                const fakeInfoDiv = this.nextElementSibling;

                if (fakeInfoDiv.style.display === 'none' || fakeInfoDiv.style.display === '') {
                    let html = `<div style="color: rgb(36, 41, 74);">`;
                    html += `<h2>Урок: ${lesson}</h2>`;
                    if (teacher != "none") { html += `<p><strong>Вчитель:</strong> ${teacher}</p>`; } else { html += `<p>Вчителя немає</p>`; }
                    if (duration != "none") { html += `<p><strong>Тривалість:</strong> ${duration}</p>`; } else { html += `<p>Немає інформації</p>`; }
                    html += `<p><strong>Урок:</strong> ${time} - ${endHour}:${endMinute}</p>`;
                    if (link != "none") {
                        html += `<a href="${link}" target="_blank" style="color: rgb(40, 47, 96); text-decoration: underline;">Перейти до уроку</a>`;
                    } else {
                        html += `<p style="color: rgb(40, 47, 96);">Посилання немає</p>`;
                    }
                    html += `<p></p>`;
                    html += `</div>`;
                    fakeInfoDiv.innerHTML = html;
                    fakeInfoDiv.style.display = 'block';
                } else {
                    fakeInfoDiv.style.display = 'none';
                }
            });
        });
    }
    function getCurrentLesson() {
        const now = new Date();
        const dayOfWeek = now.toLocaleString('en-EN', { weekday: 'long' });
        const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // hh:mm
        const lessonsToday = lists[0].class7[dayOfWeek];

        if (lessonsToday) {
            for (const lesson of lessonsToday) {
                const [lessonHour, lessonMinute] = lesson.time.split(':').map(Number);
                const lessonStart = new Date(now);
                lessonStart.setHours(lessonHour, lessonMinute, 0, 0);

                const durationMinutes = parseInt(lesson.middlelesson) || 0;
                const lessonEnd = new Date(lessonStart.getTime() + durationMinutes * 60000);

                const currentDateTime = new Date(now);
                const currentHour = currentTime.split(':').map(Number);
                currentDateTime.setHours(currentHour[0], currentHour[1], 0, 0);

                if (currentDateTime >= lessonStart && currentDateTime < lessonEnd) {
                    return `Зараз урок: ${lesson.text}`;
                }
            }
        }
        return `Немає`;
    }

    function startCurrentLessonCheck() {
        function checkLesson() {
            document.getElementById("content").innerHTML = getCurrentLesson();

            const now = new Date();
            const secondsToWait = 60 - now.getSeconds();
            setTimeout(checkLesson, secondsToWait * 1000);
        }
        checkLesson();
    }
}
