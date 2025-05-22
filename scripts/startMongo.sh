#!/bin/bash

# Start MongoDB server as a background process
~/mongodb/bin/mongod --dbpath ~/data/db --fork --logpath ~/data/mongodb.log

echo "MongoDB started! To stop it, run: scripts/stopMongo.sh"