const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
let names = [];

// Cargar nombres desde el archivo
fetch('names.txt')
    .then(response => response.text())
    .then(data => {
        names = data.split('\n').filter(name => name.trim() !== '');
        drawRoulette();
    });

// Función para dibujar la ruleta
function drawRoulette(rotation = 0) {
    const numSegments = names.length;
    const segmentSize = 2 * Math.PI / numSegments;
    const radius = Math.min(canvas.width, canvas.height) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar los segmentos de la ruleta
    for (let i = 0; i < numSegments; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            radius,
            i * segmentSize + rotation,
            (i + 1) * segmentSize + rotation
        );
        ctx.closePath();

        // Cambiar colores a rojo y negro, y hacer el primer segmento verde oscuro
        if (i === 0) {
            ctx.fillStyle = '#008000'; // Verde oscuro para el primer segmento
        } else {
            ctx.fillStyle = i % 2 === 0 ? '#ff0000' : '#000000'; // Rojo y negro
        }
        ctx.fill();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((i + 0.5) * segmentSize + rotation);
        
        // Establecer el color del texto en blanco
        ctx.fillStyle = '#ffffff'; // Color blanco para el texto
        ctx.font = '16px sans-serif';
        ctx.fillText(names[i], radius / 2, 0);
        ctx.restore();
    }

    // Dibujar la flecha en color blanco y orientada correctamente
    ctx.fillStyle = '#ffffff'; // Color de la flecha
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 30); // Parte superior del canvas
    ctx.lineTo(canvas.width / 2 - 10, 10); // Esquina izquierda de la flecha
    ctx.lineTo(canvas.width / 2 + 10, 10); // Esquina derecha de la flecha
    ctx.closePath();
    ctx.fill();
}

// Cargar los sonidos
const spinAudio = new Audio('audio/codigo2.mp3'); // Ruta al archivo de audio de la ruleta
const winAudio = new Audio('audio/buleria.mp3'); // Ruta al archivo de audio del ganador

spinButton.addEventListener('click', () => {
    // Reproducir el sonido de la ruleta al girar
    spinAudio.play().catch(error => {
        console.error("Error al reproducir el audio:", error);
    });

    const targetRotation = Math.random() * 2 * Math.PI;
    const numSpins = 10;
    const totalTime = 5000;
    let startTime;

    function spin(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = elapsed / totalTime;
        const currentRotation = progress * (numSpins * 2 * Math.PI + targetRotation);

        drawRoulette(currentRotation);

        if (progress < 1) {
            requestAnimationFrame(spin);
        } else {
            // Calcular el índice del ganador basado en la rotación final
            const numSegments = names.length;
            const segmentSize = 2 * Math.PI / numSegments;
            const normalizedRotation = currentRotation % (2 * Math.PI);
            const winningSegmentIndex = Math.floor((normalizedRotation + Math.PI / numSegments) / segmentSize) % numSegments; // Ajuste para la posición de la flecha
            const winner = names[winningSegmentIndex];

            // Reproducir el sonido del ganador
            winAudio.play().catch(error => {
                console.error("Error al reproducir el audio del ganador:", error);
            });

            alert(`¡El ganador es ${winner}!`);

            // Redibujar la ruleta con la flecha en la posición correcta
            drawRoulette(currentRotation);
        }
    }
    requestAnimationFrame(spin);
});