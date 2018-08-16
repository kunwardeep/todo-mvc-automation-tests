FROM node:8.11.4

# Install tools & libs to compile everything
RUN apt-get update && apt-get install -y && apt-get clean

COPY . /todo-mvc-automation-tests
WORKDIR /todo-mvc-automation-tests
RUN npm install
