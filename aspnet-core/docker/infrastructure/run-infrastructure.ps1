docker network rm Cz.Jarvis

docker network create Cz.Jarvis
docker-compose -f docker-compose.infrastructure.yml up -d

docker logs -f mysqlDb_container
