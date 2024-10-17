// juego.js

const canvas = document.getElementById('ruleta');
const ctx = canvas.getContext('2d');
const girarBtn = document.getElementById('girar-btn');
const resultadoDiv = document.getElementById('resultado');

const width = canvas.width = 500;
const height = canvas.height = 500;
const radius = width / 2;
let anguloActual = 0;
let girando = false;

// Configuración de los segmentos/premios
const segmentos = [
    { nombre: "Patadas", color: "#3498db" },
    { nombre: "Premio 2", color: "#2ecc71" },
    { nombre: "Premio 3", color: "#f1c40f" },
    { nombre: "Premio 4", color: "#e67e22" },
    { nombre: "Premio 5", color: "#e74c3c" },
    { nombre: "Premio 6", color: "#9b59b6" },
    { nombre: "Premio 7", color: "#1abc9c" },
    { nombre: "Premio 8", color: "#34495e" },
    { nombre: "Premio 9", color: "#f39c12" },
    { nombre: "Premio 10", color: "#d35400" }
];

const numSegmentos = segmentos.length;
const anguloPorSegmento = (2 * Math.PI) / numSegmentos;

// Dibujar la ruleta
function dibujarRuleta() {
    segmentos.forEach((segmento, i) => {
        const anguloInicio = anguloPorSegmento * i + anguloActual;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, anguloInicio, anguloInicio + anguloPorSegmento);
        ctx.fillStyle = segmento.color;
        ctx.fill();
        ctx.save();
        
        // Añadir texto al segmento
        ctx.translate(radius, radius);
        ctx.rotate(anguloInicio + anguloPorSegmento / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = "#fff";
        ctx.font = 'bold 16px Arial';
        ctx.fillText(segmento.nombre, radius - 20, 10);
        ctx.restore();
    });
}

// Girar la ruleta
girarBtn.addEventListener('click', () => {
    if (girando) return;
    girando = true;
    resultadoDiv.textContent = ''; // Limpiar resultado previo

    let giroCompleto = Math.floor(Math.random() * 360) + 3600; // Giros aleatorios
    let rotacionFinal = anguloActual + (giroCompleto * Math.PI / 180); // Convertir a radianes

    // Animación del giro
    let tiempoGiro = 0;
    const duracion = 5000; // Duración de 5 segundos

    function animarGiro(timestamp) {
        if (!tiempoGiro) tiempoGiro = timestamp;
        const progreso = timestamp - tiempoGiro;

        if (progreso < duracion) {
            const easing = 1 - Math.pow(1 - progreso / duracion, 3); // Desaceleración suave
            anguloActual = rotacionFinal * easing;
            ctx.clearRect(0, 0, width, height);
            dibujarRuleta();
            requestAnimationFrame(animarGiro);
        } else {
            // Asegurarse de que el ángulo final coincida con un segmento correcto
            anguloActual = rotacionFinal % (2 * Math.PI);
            mostrarResultado();
            girando = false;
        }
    }
    requestAnimationFrame(animarGiro);
});

// Mostrar resultado
function mostrarResultado() {
    // El marcador ahora está en 90 grados (π/2 radianes)
    const anguloDetenido = (3.2- anguloActual + Math.PI / 2) % (2 * Math.PI); // 90 grados es π/2 radianes

    // Usamos el ángulo detenido para calcular el índice del segmento ganador
    const indiceGanador = Math.floor(anguloDetenido / anguloPorSegmento);
    const ganador = segmentos[indiceGanador >= 0 ? indiceGanador : numSegmentos + indiceGanador];

    resultadoDiv.textContent = `¡Resultado: ${ganador.nombre}!`;
}

// Dibujar la ruleta inicialmente
dibujarRuleta();

