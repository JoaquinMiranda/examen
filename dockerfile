# Usamos una imagen base de Node.js
FROM node:16

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos los archivos de configuración y paquetes
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# Construimos la aplicación
RUN npm run build

# Exponemos el puerto en el que se ejecutará NestJS (por defecto es el 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]