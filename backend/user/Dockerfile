FROM python:latest
WORKDIR /
COPY . /
COPY ../requirements /tmp/
RUN pip3 install -r /tmp/requirements
EXPOSE 80
