echo "Please, enter container id: "
read dockerId

docker exec -it ${dockerId} mongo
