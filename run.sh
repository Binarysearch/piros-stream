(docker network create --attachable atenea_network || true ) &&

(docker container rm piros-stream-test -f || true ) &&


docker build --rm -f "Dockerfile" -t piros-stream-test:latest . &&
docker run --name=piros-stream-test --network=atenea_network piros-stream-test:latest