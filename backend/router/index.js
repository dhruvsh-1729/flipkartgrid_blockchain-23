const router = require("express").Router()
const axios = require("axios")
const {storage, getAESkey} = require("./get_Storage")
const RSA = require("./RSA")
const encryptionKey = require("./encryption")
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const multer = require('multer');
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const { Readable } = require('stream'); 

const pinata = new pinataSDK("5284b7b23e2439ac77fa", "204fe8bf966d0ef42263c5d20ce72b74da0d700d15fbba123dd1d68417855e1a")
const upload = multer().single('document')
router.post('/upload', (req, res) => {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    upload(req, res, async (uploadError) => {
        if (uploadError) {
            console.error('Error uploading:', uploadError);
            return res.status(400).json({ message: 'Error uploading file' });
        }

        console.log('Uploaded file:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileBuffer = req.file.buffer;

        try {
            // Create a readable stream from the Buffer data
            const fileStream = new Readable();
            fileStream.push(fileBuffer);
            fileStream.push(null); // Signal the end of the stream

            // Upload to Pinata IPFS
            const options = {
                pinataMetadata: {
                    name: 'File',
                },
                pinataOptions: {
                    cidVersion: 0,
                },
            };
            const ipfsResponse = await pinata.pinFileToIPFS(fileStream, options);

            res.status(200).json({
                ipfsResponse,
                fileHash: fileBuffer.toString(),
                document: "https://gateway.pinata.cloud/ipfs/"+ipfsResponse.IpfsHash
            });
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
});

router.post("/getDiagnostic", async (req, res) => {
    const storageObj = await storage();
    if (storageObj === undefined  || storageObj.status=== null) {
        return res.status(500).json({
            message: "Could Not access the Contract"
        });
    }
    else{
        const hashedAadhar = crypto.createHash('sha256').update(req.body.aadhar).digest('hex');
        if (!(hashedAadhar in storageObj.patient_diagnosis)){
            return res.status(404).json({
                message: "No Diagnosis Found"
            })
        }
        else{
            const diagnosis_list = storageObj.patient_diagnosis[hashedAadhar]
            const diagnosis_data = []
            for (var i=0; i<diagnosis_list.length; i++){
                diagnosis_data.push(storageObj.diagnosis_list[diagnosis_list[i]])
            }
            return res.status(200).json({
                data: diagnosis_data,
                message: "Success"
            })
        }
    }
})

router.post("/login", async (req, res) => {
    const storageObj = await storage();
    if (storageObj === undefined  || storageObj.status=== null) {
        return res.status(500).json({
            message: "Error"
        });
    }
    else{
        const AadharHash = crypto.createHash('sha256').update(req.body.aadhar).digest('hex');
        
        if (AadharHash in storageObj.patient_info){
            try{   
            const aadhar = req.body.aadhar; 
            const publicKeyinput = JSON.parse(storageObj.public_keys[AadharHash])
            // console.log(publicKeyinput)
            console.log({"pri":req.body.privateKey})
            let intermediate = RSA.decryptMessage(publicKeyinput.RSAencryptedcipherKey, req.body.privateKey)
            
            console.log(intermediate)
            let key = JSON.parse(intermediate)
            console.log(key)
            // conso
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
            let name = decipher.update(storageObj.patient_info[AadharHash].name, 'hex', 'utf-8');
            name += decipher.final('utf-8');

            const decipher2 = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
            let sex = decipher2.update(storageObj.patient_info[AadharHash].sex, 'hex', 'utf-8');
            sex += decipher2.final('utf-8');

            const decipher3 = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
            let age = decipher3.update(storageObj.patient_info[AadharHash].age, 'hex', 'utf-8');
            age += decipher3.final('utf-8');

            const payload = {
                name,age,sex
            }

            const options = {
                expiresIn: '1h'
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET,options)

            return res.status(200).json({
                message: "Success",
                name,
                age,
                sex,
                aadhar,
                token
            })
        }
        catch(err){
            return res.status(500).json({
                // message: "Ferror",
                message: "Incorrect Private Key",
                input: req.body
            })
        }
    }
}
})

router.post("/makeDiagnosis", async (req, res)=>{
    try{
    const AadharHash = crypto.createHash('sha256').update(req.body.aadhar).digest('hex');
    let {key, rsa} = await getAESkey(AadharHash, req.body.privateKey)
    key = JSON.parse(key)
    console.log(typeof(key));

    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let encryptedName = cipher.update(req.body.name, 'utf-8', 'hex');
    encryptedName += cipher.final('hex');

    const cipher2 = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let diagnosis = cipher2.update(req.body.diagnosis, 'utf-8', 'hex');
    diagnosis += cipher2.final('hex');

    const cipher3 = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let DocType = cipher3.update(req.body.docType, 'utf-8', 'hex');
    DocType += cipher3.final('hex');

    const cipher4 = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let DocName = cipher4.update(req.body.docName, 'utf-8', 'hex');
    DocName += cipher4.final('hex');

    const cipher5 = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let document = cipher5.update(req.body.document, 'utf-8', 'hex');
    document += cipher5.final('hex');

    const cipher6 = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let symptoms = cipher6.update(req.body.symptoms, 'utf-8', 'hex');
    symptoms += cipher6.final('hex');

    return res.status(200).json({
        message: "Success",
        name: encryptedName,
        diagnosis: diagnosis,
        DocType: DocType,
        DocName: DocName,
        document: document,
        symptoms: symptoms,
        userAadhar: AadharHash,
        RSAencryptedcipherKey: rsa
    })
    }
    catch (e) {
        return res.status(500).json({
            "message": "Most likely the private key was not valid",
            error: e.message
        });}

})

router.post("/get_diagnosis", async (req, res) => {
    try{
        const storageObj = await storage();
    const Aadhar = crypto.createHash('sha256').update(req.body.aadhar).digest('hex');

    let {key, rsa} = await getAESkey(Aadhar, req.body.privateKey)
    key = JSON.parse(key)

    let doctorAccess = []
    for (doc in storageObj.patient_visibility[Aadhar]){
        if (storageObj.patient_visibility[Aadhar][doc] !== "0"){
            doctorAccess.push(doc)
        }
    }

    let diagnosis_list = [];
    for( var id in storageObj.patient_diagnosis[Aadhar]){
        
        diagnosis_list.push({data: storageObj.diagnosis_list[storageObj.patient_diagnosis[Aadhar][id]], 
        loc: storageObj.patient_diagnosis[Aadhar][id]})
    }

    for(var i=0; i<diagnosis_list.length; i++){
        let curObj = diagnosis_list[i].data;

        for(field in curObj){
            if(field === "patientName" || field === "symptoms" || field === "diagnosis" || field === "docType"|| field==="doctorName"  || field==="document"){
                if (curObj[field] !== "" && curObj[field]!=="Shilpa" && curObj[field]!=="Rudra Pratap Singh"){
                const de = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
                let decrypted = de.update(curObj[field], 'hex', 'utf-8');
                decrypted += de.final('utf-8');
                curObj[field] = decrypted;
                }
            }
        }
        diagnosis_list[i].data = curObj;
    }


    return res.status(200).json({
        data: diagnosis_list,
        message: "Success",
        doctorAccess: doctorAccess
    });

    }
    catch (e) {
        return res.status(500).json({
            message: "Error",
            reference: e 
        });
    }
});


router.post("/get_diagnosis_list", async (req, res) => {
    const Aadhar = req.body.aadhar; // Use req.body.aadhar to access the Aadhar field
    const Storage_URL = process.env.STORAGE_URL;
    const result = await axios.get(Storage_URL);

    if (result.status !== 200) {
        return res.status(500).json({
            message: "Error"
        });
    }

    let diagnosis_list = [];
    for( var key in result.data.patient_diagnosis[Aadhar]){
        diagnosis_list.push({data: result.data.diagnosis_list[result.data.patient_diagnosis[Aadhar][key]], 
        loc: result.data.patient_diagnosis[Aadhar][key]})
    }
    return res.status(200).json({
        data: diagnosis_list,
        message: "Success"
    });
});

router.get("/newUser", (req, res) => {
    const u = RSA.createUser()
    return res.status(200).json({
        private: u.keys.privateKey,
        public: u.keys.publicKey,
        message: "Success"
    })
})

router.get("/getEncryptionKKey", (req, res) => {
    const encryptionKey = crypto.randomBytes(32); // 256 bits = 32 bytes
    return res.status(200).json({
        key: encryptionKey.toString('hex'),
        message: "Success"
    })
})


router.post("/RSAencrypt", (req, res) => {
    const encruptedMessage = RSA.encryptMessage(req.body.message, req.body.publicKey)
    return res.status(200).json({
        data: encruptedMessage,
        message: "Success"
    })
})

router.post("/RSAdecrypt", (req, res) => {
    const decruptedMessage = RSA.decryptMessage(req.body.message, req.body.privateKey)
    return res.status(200).json({
        data: decruptedMessage,
        message: "Success"
    })
})

router.post("/getEncryptedText", (req, res) => {
    const originalMessage = req.body.text;
    const encryptionKey = req.body.key;
    const iv = crypto.randomBytes(16); // Initialization Vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);

    let encrypted = cipher.update(originalMessage, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    // Store the encrypted message and the key in a file
    const encryptedData = {
    iv: iv.toString('hex'),
    encryptedMessage: encrypted
    };

    res.status(200).json({
        data: JSON.stringify(encryptedData, null, 2),
        message: "Success"
    })
})

router.post("/getDecryptedText", (req, res) => {

    const encryptionKey = req.body.key;
    const encryptedData = JSON.parse(req.body.data);

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(encryptedData.iv, 'hex'));
    let decrypted = decipher.update(encryptedData.encryptedMessage, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    res.status(200).json({
        data: decrypted,
        message: "Success"
    })
})

router.post("/register", (req, res) => {
    const shaAadhar = crypto.createHash('sha256').update(req.body.aadhar).digest('hex');
    const u = RSA.createUser();
    const publicKey = u.keys.publicKey;
    const privateKey = u.keys.privateKey;

    const encryptionKey = crypto.randomBytes(32); // 256 bits = 32 bytes
    const iv = crypto.randomBytes(16); // Initialization Vector

    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

    let name = cipher.update(req.body.name, 'utf-8', 'hex');
    name += cipher.final('hex');
    const cipher2 = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

    let sex = cipher2.update(req.body.sex, 'utf-8', 'hex');
    sex += cipher2.final('hex');
    const cipher3 = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let age = cipher3.update(req.body.age, 'utf-8', 'hex');
    age += cipher3.final('hex');

    // const sex = req.body.sex;
    // const dob = req.body.dob;

    const key = {
        encryptionKey: encryptionKey.toString('hex'),
        iv: iv.toString('hex')
    }

    const RSAencryptedcipherKey = RSA.encryptMessage(JSON.stringify(key), publicKey);
    const publicKeyinput = {
        publicKey: publicKey,
        RSAencryptedcipherKey: RSAencryptedcipherKey
    }
    return res.status(200).json({
        aadhar: shaAadhar,
        publicKey: JSON.stringify(publicKeyinput),
        name: name,
        sex: sex, 
        age: age, 
        privateKey: privateKey,
        encryptionKey: encryptionKey.toString('hex'),
        iv: iv.toString('hex'),
        onlyPublicKey: {key:publicKey},
        message: "success"
    })
})

router.post("/getPatientData", (req, res) => {
    const publicKeyjoined = JSON.parse(req.body.publicKey);
    const publicKey = publicKeyjoined.publicKey;
    let key = publicKeyjoined.RSAencryptedcipherKey;
    const privateKey = req.body.privateKey;
    key = JSON.parse(RSA.decryptMessage(key, privateKey));


    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let name = decipher.update(Buffer.from(req.body.name, 'hex'), 'hex', 'utf-8');
    name += decipher.final('utf-8');


    const decipher2 = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let sex = decipher2.update(Buffer.from(req.body.sex, 'hex'), 'hex', 'utf-8');
    sex += decipher2.final('utf-8');

    const decipher3 = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let dob = decipher3.update(Buffer.from(req.body.dob, 'hex'), 'hex', 'utf-8');
    dob += decipher3.final('utf-8');

    return res.status(200).json({
        name: name,
        key: key,
        sex: sex, 
        dob: dob,
        message: "success"
    })
})
router.post("/makeAppointment", async (req, res) => {
    // req.body.doctorAadhar, 
    // req.body.aadhar

    try{
    const storageObj = await storage();
    const Aadhar = crypto.createHash('sha256').update(req.body.aadhar).digest('hex');

    

    let {key, rsa} = await getAESkey(Aadhar, req.body.privateKey)
    key = JSON.parse(key)

    

    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let symptoms = cipher.update(req.body.symptoms, 'utf-8', 'hex');
    symptoms += cipher.final('hex');


    const doctorName = storageObj.doc_info[req.body.doctorAadhar].name;
    const cipher2 = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.encryptionKey, 'hex'), Buffer.from(key.iv, 'hex'));
    let encryptedDoctorName = cipher2.update(doctorName, 'utf-8', 'hex');
    encryptedDoctorName += cipher2.final('hex');


    

    const doctorPublicKey = storageObj.public_keys[req.body.doctorAadhar];
    // console.log(doctorPublicKey);

    let stringkey = JSON.stringify(key);
    const AESencryptForDoctor = RSA.encryptMessage(stringkey, doctorPublicKey);


     return res.status(200).json({
        message: "success",
        AESencryptForDoctor: AESencryptForDoctor,
        symptoms: symptoms,
        rsa: rsa,
        hashedAadhar: Aadhar,
        encryptedDoctorName: encryptedDoctorName
    })
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
            input: req.body
        });
    }
})

router.get('/DoctorList', async (req, res) => {
    const storageObj = await storage();

    let doctorList = [];
    for (let field in storageObj.doc_info){
        doctorList.push({
            name: storageObj.doc_info[field].name,
            aadhar: field ,
            id: field
        })
    }

    return res.status(200).json({
        "data": doctorList,
        "message": "Successfully compiled the list of doctors"
    })
})
module.exports = router