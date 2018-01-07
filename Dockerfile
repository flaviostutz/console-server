FROM node:8.6.0
ENV work_dir /usr/src/app/

WORKDIR ${work_dir}

#Optimize building time. Cache npm install on this layer so that it is cached between code updates.
ADD package.json ${work_dir}
RUN npm install

ADD . ${work_dir}
#RUN npm install

CMD ["npm", "test"]
