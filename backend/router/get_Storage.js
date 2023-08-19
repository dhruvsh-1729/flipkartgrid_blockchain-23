const axios = require("axios")
const RSA = require("./RSA")
async function storage(){
    const res = await axios.get(
        // "https://api.ghostnet.tzkt.io/v1/contracts/KT1Jaa9gds336gNj5nUasV8hA6vXkn1Q45vi/storage"
        "https://api.ghostnet.tzkt.io/v1/contracts/KT192LPKjKUjBH4UVmJeShjecGyG2sTq5BvC/storage"
    )
    return res.data;
};

async function getAESkey(shaAadhar, RSAprivateKey){
    const store = await storage();
    const rsa = JSON.parse(store.public_keys[shaAadhar]).RSAencryptedcipherKey
    const key = RSA.decryptMessage(rsa, RSAprivateKey)
    // console.log(AES_KEY)
    return {key, rsa}
}

module.exports = {storage, getAESkey};