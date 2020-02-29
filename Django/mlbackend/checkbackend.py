import os
import time
import matplotlib.pyplot as plt

# to read images from urls
import urllib
import urllib.request
import PIL
from PIL import Image

import tensorflow as tf
print(tf.__version__)
import numpy as np
import cv2
from timeit import default_timer as timer

# textbox++ models
from tbpp_model import TBPP512, TBPP512_dense
from tbpp_utils import PriorUtil

# ssd for help
from ssd_data import preprocess
from sl_utils import rbox3_to_polygon, polygon_to_rbox, rbox_to_polygon


import urllib
import urllib.request
import PIL
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
import requests
from ssd_data import preprocess
import numpy as np
# Starting the model here.

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
    

start_time = time.time()

# Final TextBox++ Code : (Works on just image)
input_size = input_shape[:2]
print(input_size)

#urlImage = 'http://answers.opencv.org/upfiles/logo_2.png'
#img = Image.open(urllib.request.urlopen(urlImage))

url = "http://localhost:4000/img/user1_1.png"
response = requests.get(url)
img = Image.open(BytesIO(response.content))
print(img.size)
img_h = img.size[0]
img_w = img.size[1]
print(img_h)
print(img_w)


img1 = np.copy(img)
img2 = np.zeros_like(img)

# model to predict
x = np.array([preprocess(img, input_size)])

print(x.shape)

elapsed_time = time.time() - start_time
print("Performace measure : "+str(elapsed_time))

#Model start
start_time = time.time()
with sl_graph.as_default():
    with sl_session.as_default():
        y = sl_model.predict(x)

elapsed_time = time.time() - start_time
print("Performace measure : "+str(elapsed_time))
#Model end


start_time = time.time()
result = prior_util.decode(y[0], confidence_threshold)

if len(result) > 0:
    bboxs = result[:,0:4]
    quads = result[:,4:12]
    rboxes = result[:,12:17]

    boxes = np.asarray([rbox3_to_polygon(r) for r in rboxes])

    xy = boxes
    xy = xy * [img_w, img_h]
    xy = np.round(xy)
    xy = xy.astype(np.int32)

    cv2.polylines(img1, tuple(xy), True, (0,0,255))

    rboxes = np.array([polygon_to_rbox(b) for b in np.reshape(boxes, (-1,4,2))])
    bh = rboxes[:,3]
    rboxes[:,2] += bh * 0.1
    rboxes[:,3] += bh * 0.2
    boxes = np.array([rbox_to_polygon(f) for f in rboxes])

    boxes = np.flip(boxes, axis=1) # TODO: fix order of points, why?
    boxes = np.reshape(boxes, (-1, 8))

    boxes_mask_a = np.array([b[2] > b[3] for b in rboxes]) # width > height, in square world
    boxes_mask_b = np.array([not (np.any(b < 0) or np.any(b > 512)) for b in boxes]) # box inside image
    boxes_mask = np.logical_and(boxes_mask_a, boxes_mask_b)

    boxes = boxes[boxes_mask]
    rboxes = rboxes[boxes_mask]
    xy = xy[boxes_mask]

    if len(boxes) == 0:
        boxes = np.empty((0,8))

# draw

cv2.rectangle(img1, (0,0), (50, 17), (255,255,255), -1)
cv2.imwrite('assets/Testout_img.jpg', img1)
print("DONE!")
plt.imshow(img1)
plt.show()
elapsed_time = time.time() - start_time
print("Performace measure : "+str(elapsed_time))
