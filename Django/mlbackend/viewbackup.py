import os
print(os.getcwd())

from django.shortcuts import render , render_to_response , redirect
import csv, io
from django.contrib import messages
from django.contrib.auth.decorators import permission_required
from django.template import Context, loader
from django.http import HttpResponse
import cv2
from django.views.decorators.csrf import csrf_exempt

import requests
from PIL import Image
from django.http import HttpResponse
from django import db
import numpy as np
import cv2
import tensorflow as tf
from timeit import default_timer as timer

from tbpp_model import TBPP512, TBPP512_dense
from tbpp_utils import PriorUtil

from ssd_data import preprocess
from sl_utils import rbox3_to_polygon, polygon_to_rbox, rbox_to_polygon


if __name__ == '__main__':
    Model = TBPP512_dense
    input_shape = (512,512,3)
    weights_path = 'weights.022.h5'
    confidence_threshold = 0.35
    confidence_threshold = 0.25

    sl_graph = tf.Graph()
    with sl_graph.as_default():
        sl_session = tf.Session()
        with sl_session.as_default():
            sl_model = Model(input_shape)
            prior_util = PriorUtil(sl_model)
            sl_model.load_weights(weights_path, by_name=True)

    input_width = 256
    input_height = 32
    weights_path = 'weights.022.h5'
