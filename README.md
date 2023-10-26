# custom-nginx

Nginx イメージをカスタマイズする

## コマンド

### dev: Docker Compose

```shell
### docker compose を起動
$ make docker/up

### nginx コンテナに入る
$ make exec/nginx
```

### prd: Kubernetes

```shell
### Production 用イメージをビルド
$ make build/prd

### DockerHub にログイン
$ make docker/login

### DockerHub に Push
$ make docker/push
```
