FROM nginx:latest as builder
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
COPY nginx.conf /etc/nginx/nginx.conf
RUN nginx -v 2>&1 | tee /etc/nginx/nginx_version

FROM alpine:latest
ENV TZ=Asia/Tokyo
RUN apk --no-cache add tzdata nodejs npm tcpdump
WORKDIR /app
COPY --from=builder /usr/sbin/nginx /usr/sbin/nginx
COPY --from=builder /etc/nginx /etc/nginx

# めんどくさいのでここでマルチステージビルド先で実行
COPY package.json /app
COPY server.js /app
RUN npm install
EXPOSE 80
CMD [ "node", "server.js" ]
