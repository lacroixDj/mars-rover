#!/bin/bash

# This script makes it easier to build and run the Dockerized app
# Author: Frank Lacroix <lacroixDj@gmail.com>

echo "--> Stoping container (if any): docker stop martian-robots "
docker stop martian-robots
echo

echo "--> Removing container (if any): docker rm -f martian-robots " 
docker rm -f martian-robots
echo

echo "--> Building the container image: docker build -t lacroixdj/martian-robots:latest . "
docker build -t lacroixdj/martian-robots:1.0 -t lacroixdj/martian-robots:latest .
echo

echo "--> Running the container in detached mode:  docker run --name martian-robots -d lacroixdj/martian-robots:latest"
docker run --name martian-robots --restart always lacroixdj/martian-robots:latest
echo

echo "--> Runing tests: docker exec martian-robots npm test "
docker exec -d martian-robots npm test
echo

echo "--> Inspecting logs output: docker logs martian-robots "
docker logs martian-robots
echo

echo "--> Verifying the container is actually running: docker ps | grep martian-robots "
docker ps | grep martian-robots
echo

echo "--> /End."