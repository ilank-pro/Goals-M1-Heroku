# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh.template /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE $PORT
CMD ["/docker-entrypoint.sh"] 