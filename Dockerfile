FROM node

WORKDIR /myapp

COPY * .

COPY views/ /myapp/views/

RUN npm install


EXPOSE 80

CMD ["npm", "start"]
