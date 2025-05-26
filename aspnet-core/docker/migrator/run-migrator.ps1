docker-compose -f docker-compose.migrator.yml up -d
docker logs -f czjarvismigrator_container
docker container rm czjarvismigrator_container