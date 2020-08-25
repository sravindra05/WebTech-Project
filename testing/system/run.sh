#tar xzvf geckodriver.tar.gz
#chmod +x geckodriver
#export PATH=`pwd`:$PATH
echo "Attempting to access Dashboard without logging in"
python3 jump_to_dash.py
echo "Attempting to Sign up"
python3 signup.py
echo "Attempting to Sign up with the same user name"
python3 signup.py
echo "Attempting to use wrong credentials to login"
python3 invalidlogin.py
echo "Attempting a valid login"
python3 validlogin.py
echo "Set of tests that deal with file uploads"
python3 uploadfile.py
echo "Set of tests that deal with file view"
python3 view_test.py
echo "Set of tests that deal with plotting graphs"
python3 plot_test.py
echo "Set of tests that deal with models"
python3 model_create.py
echo "File deletion"
python3 deletefile.py
