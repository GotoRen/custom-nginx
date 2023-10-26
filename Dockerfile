FROM nginx:latest as builder
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
COPY nginx.conf /etc/nginx/nginx.conf

FROM alpine:latest
ENV TZ=Asia/Tokyo
RUN apk --no-cache add tzdata tshark vim
WORKDIR /usr/src/app
COPY --from=builder /usr/sbin/nginx /usr/sbin/nginx
COPY --from=builder /etc/nginx /etc/nginx
COPY package.json /usr/src/app
COPY server.js /usr/src/app

RUN apk add nginx curl nodejs npm tshark
RUN npm install
RUN nginx -v 2>&1 | tee /etc/nginx/nginx_version

EXPOSE 8080

CMD [ "node", "server.js" ]
