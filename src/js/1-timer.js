import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateTimePicker = document.querySelector("#datetime-picker");
const btn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate <= new Date()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",});
                btn.disabled = true;
            } else {
                userSelectedDate = selectedDate;
                btn.disabled = false;
            }
    },
};
flatpickr(dateTimePicker, options);

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function updateTime({ days, hours, minutes, seconds }) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

function startTimer() {
    const endTimer = userSelectedDate.getTime();
  
    timerId = setInterval(() => {
      const currentTime = Date.now();
      const timeDifference = endTimer - currentTime;
  
      if (timeDifference <= 0) {
        clearInterval(timerId);
        updateTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        iziToast.success({
          title: "Complete",
          message: "The countdown has ended!",
        });
        dateTimePicker.disabled = false;
        btn.disabled = true;
        return;
      }
  
      const timeComponents = convertMs(timeDifference);
      updateTime(timeComponents);
    }, 1000);
  
    dateTimePicker.disabled = true;
    btn.disabled = true;
  }

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }

btn.addEventListener("click", startTimer);
