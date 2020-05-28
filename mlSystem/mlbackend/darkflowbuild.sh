cd /tmp
git clone https://github.com/thtrieu/darkflow
cd darkflow
virtualenv --python=python3 .venv
source .venv/bin/activate
pip3 install Cython
pip3 install numpy
pip3 install tensorflow
pip3 install opencv-python
pip3 install .
python setup.py build_ext --inplace
