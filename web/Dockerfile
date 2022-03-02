FROM nginx:1.17.1-alpine
COPY /src /usr/share/nginx/html
COPY /ssl /etc/nginx
COPY nginx_docker.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
