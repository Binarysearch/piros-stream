(docker network create --attachable atenea_network || true ) &&

#(docker container rm piros-stream-test-consumer -f || true ) &&
#(docker container rm piros-stream-test-producer -f || true ) &&
#(docker container rm piros-stream-test-admin -f || true ) &&


docker build --rm -f "Dockerfile" -t piros-stream-test:latest . &&



#docker run -d --name=piros-stream-test-producer -e MODE=producer --network=atenea_network piros-stream-test:latest
docker run -d --name=piros-stream-test-admin -e MODE=admin --network=atenea_network piros-stream-test:latest
#docker run -d --name=piros-stream-test-consumer -e MODE=consumer --network=atenea_network piros-stream-test:latest