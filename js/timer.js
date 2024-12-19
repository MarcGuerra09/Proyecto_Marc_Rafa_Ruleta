function actualizaReloj() {
    const momentoActual = new Date();
    const hora = momentoActual.getHours().toString().padStart(2, '0');
    const minuto = momentoActual.getMinutes().toString().padStart(2, '0');
    const segundo = momentoActual.getSeconds().toString().padStart(2, '0');
    const horaImprimible = `${hora}:${minuto}:${segundo}`;
    document.getElementById('horaActual').innerHTML = horaImprimible;
    setTimeout(actualizaReloj, 1000);
}

function setAlarm() {
    const alarmInput = document.getElementById("alarmTime");
    const alarmTime = alarmInput.value;

    if (alarmTime === "") {
        alert("Por favor, introduce una hora válida.");
        return;
    }

    const now = new Date();
    const alarm = new Date(now.toDateString() + " " + alarmTime);

    if (isNaN(alarm.getTime())) {
        alert("Formato de hora inválido. Utiliza el formato 'HH:MM'.");
        return;
    }

    const timeRemaining = alarm.getTime() - now.getTime() + 1000;

    if (timeRemaining <= 0) {
        alert("Hora de alarma inválida. Asegúrate de que sea en el futuro.");
        return;
    }

    const audio = new Audio('audio/burrito2.mp3');
    setTimeout(() => {
        audio.play();
        alert("¡Alarma sonando!");
    }, timeRemaining);
}