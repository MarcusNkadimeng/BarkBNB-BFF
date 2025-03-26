#!/bin/bash

database="barkBNBdb"

echo "Configuring databse: $database"

dropdb -U node_user barkBNBdb
createdb -U node_user barkBNBdb

psql -U node_user barkBNBdb < ./bin/sql/pets.sql

echo "Configured $database"