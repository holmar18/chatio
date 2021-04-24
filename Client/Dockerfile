# Start with an os
FROM node:alpine

# changes current directory so it's does not need to be specified.
WORKDIR /app/Client

# Before installing dependencies add package to WORKINGDIR
COPY ["package.json", "package-lock.json*", "./"]

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/Client/node_modules/.bin:$PATH

# install dependencies
RUN npm install

# IMG is rdy for node bersion 14.15.2
# copy the code to working directory
COPY . .

# commands the image will run inside the container
CMD [ "npm", "start" ]