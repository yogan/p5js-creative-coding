FROM nginx:alpine
LABEL org.opencontainers.image.source="https://github.com/yogan/p5js-creative-coding"
COPY ./dist /usr/share/nginx/html
