# WebTech-Project
## Getting Started - Noob manual API version
Steps:
1. Install Docker on your device
2. Install all the necessary dependencies to run the APIs `pip3 install flask flask_api flask_cors requests pymongo numpy pandas`
3. Install npm and nodejs
4. Run `npm start` inside the frontend directory
5. Pull mongo image from DockerHub `docker pull mongo`
6. Run docker container for mongo `docker run -p 27017:27017 mongo`
7. Inside the backend directory run:
* `python3 uac/uac.py`
* `python3 user/user.py`
