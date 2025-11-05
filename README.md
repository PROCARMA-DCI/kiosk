# Google Chrome 102

<!-- https://www.slimjet.com/chrome/google-chrome-old-version.php -->

## installed open link

mkdir -p ~/chrome102
cd ~/chrome102

dpkg-deb -x ~/Downloads/google-chrome-stable_current_amd64.deb .

<!-- home -->

~/chrome102/opt/google/chrome/google-chrome --user-data-dir=/tmp/chrome102-profile

<!-- office -->

~/chrome102/run-chrome102.sh
