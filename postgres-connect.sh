echo "Please, enter user name: "
read userName

echo "Please, enter database name: "
read dbName

docker exec -it $(docker ps -aqf "name=postgres_db") psql -U ${userName} -d ${dbName}
