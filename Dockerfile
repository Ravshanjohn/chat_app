FROM node:lts-alpine 

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY frontend/package*.json frontend/
RUN npm install --prefix frontend

COPY backend/package*.json backend/
RUN npm install --prefix backend

COPY backend ./backend/

COPY frontend ./frontend/
RUN npm run build --prefix frontend

EXPOSE 3000

CMD ["npm", "start"]
