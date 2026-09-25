# 🌱 VoluntALIA - Frontend

Este es el **frontend** de VoluntALIA, la aplicación de gestión de voluntarios.  
Construida con **React**, se conecta a la API de VoluntALIA para mostrar y administrar información de voluntarios de manera sencilla y rápida.

---

## 🚀 Tecnologías utilizadas
- React
- Typescript / TSX
- tailwindcss
- Axios para consumir la API

---

## ⚙️ Requisitos previos
Antes de iniciar, asegúrate de tener instalado:

1. [Node.js](https://nodejs.org/) (v20.17.0) 

---

## ⚙️ Instalación y ejecución

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Ejecuta la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```

3. Abre tu navegador en:
   ```
   http://localhost:8080
   ```
   (puerto configurado en `vite.config.ts`; usa el que indique tu terminal si lo has cambiado)

---

## 📌 Notas
- Asegúrate de que la **API de VoluntALIA** esté corriendo antes de usar el frontend para que pueda conectarse correctamente.
- La URL de la API se configura por entorno: `.env.development` (apunta directo a `http://localhost:4000`) y `.env.production` (usa la ruta relativa `/api`, que Nginx redirige al contenedor de la API — ver `nginx.conf`).

## 🚀 Levantar todo el stack con un solo comando (alternativa)

Hay un `docker-compose.yml` en la raíz del workspace (un nivel por encima de este repo) que levanta Postgres, la API, este frontend y el servidor de archivos juntos:

```bash
cd ..
docker-compose up --build
```

El frontend queda disponible en `http://localhost:8081` (servido por Nginx, build de producción). Para desarrollo con hot-reload sigue usando `npm run dev` como se indica arriba.

---

