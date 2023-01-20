const {
    Readable
} = require('stream');
var axios = require('axios');
const FormData = require('form-data');

const saveImagePinata = async (img, fieldName) => {
    let stream;
    try {
        stream = Readable.from(img.buffer);
        stream.path = fieldName;
    } catch (e) {
        console.log(`error creating stream: ${e}`);
        return false;
    }

    var data = new FormData();
    data.append('file', stream);
    data.append('pinataOptions', '{"cidVersion": 0}');

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT}`,
            ...data.getHeaders()
        },
        data: data
    };

    const pinRes = await axios(config);

    return `https://gateway.pinata.cloud/ipfs/${pinRes.data.IpfsHash}`
}

module.exports = { saveImagePinata }