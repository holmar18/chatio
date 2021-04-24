# syntax=docker/dockerfile:1

# Start with an os
FROM node:alpine

# changes current directory so it's does not need to be specified.
WORKDIR /app/Server

# Before installing dependencies add package to WORKINGDIR
COPY ["package.json", "package-lock.json*", "./"]

# install dependencies
RUN npm install

# Expose the port
EXPOSE 5000

# IMG is rdy for node bersion 14.15.2
# copy the code to working directory
COPY . .

# commands the image will run inside the container
CMD [ "node", "chatserver.js" ]