Lanxar contenedor de docker postgres

````
docker compose up -d

docker ps
````


Conectarse usando un cliente CLI a postgres
````
docker exec -it postgres_5433 psql -U admin -d appdb
````