mkdir tmp

apt-get install -y autoconf automake libtool pkg-config libprotobuf9v5 protobuf-compiler libprotobuf-dev
apt-get install -y libprotobuf10
cd tmp
git clone https://github.com/google/sentencepiece
cd sentencepiece
./autogen.sh
./configure
make -j20
make check
make install
ldconfig -v
cd ..
cd ..
rm -rf tmp
