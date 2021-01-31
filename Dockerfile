FROM node

RUN mkdir -p /home/senki

ADD . /home/senki

WORKDIR /home/senki

RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run build

ENV HOST 0.0.0.0
ENV PORT 8081

EXPOSE 8081

CMD ["cd", "./build", "&&", "npx", "server", "-p", "8081"]