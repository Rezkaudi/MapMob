FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NG_APP_API_BASE_URL
ENV NG_APP_API_BASE_URL=$NG_APP_API_BASE_URL
RUN npm run build

FROM nginx:alpine AS run
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/mapmob/browser /usr/share/nginx/html
EXPOSE 80
