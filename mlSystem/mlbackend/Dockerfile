# Base Image
FROM python:3.6

# create and set working directory
RUN mkdir /app
WORKDIR /app

# Add current directory code to working directory
ADD . /app/

# set default environment variables
ENV PYTHONUNBUFFERED 1
ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive

# set project environment variables
# grab these via Python's os.environ
# these are 100% optional here
ENV PORT=8000

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        tzdata \
        python3-setuptools \
        python3-pip \
        python3-dev \
        python3-venv \
        git \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# install environment dependencies
RUN pip3 install --upgrade pip
RUN pip3 install pipenv

RUN pip3 install requests
RUN pip3 install urllib3

RUN pip3 install Cython
RUN pip3 install numpy
RUN pip3 install tensorflow==1.12.0
RUN pip3 install opencv-python
RUN pip3 install gunicorn

RUN git clone https://github.com/thtrieu/darkflow.git \
    && cd darkflow \
    && pip install .

RUN pip3 install keras==2.2.4
RUN pip3 install Pillow
RUN pip3 install django-cors-headers
RUN pip3 install tqdm


# Install project dependencies

EXPOSE 8000
CMD gunicorn mlbackend.wsgi:application --bind 0.0.0.0:$PORT --timeout 90
