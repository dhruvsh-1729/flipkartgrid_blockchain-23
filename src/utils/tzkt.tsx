// TODO 8 - Fetch storage of the Lottery by completing fetchStorage
import axios from "axios";

export const fetchnameageStorage = async()=> {
    const res = await axios.get(
        "https://api.ghostnet.tzkt.io/v1/contracts/KT1E8nSeznAvcq6kWFe36nPuduzSWhpeRekg/storage"
    )
    return res.data;
};


export const fetchtransactions = async()=> {
    const res = await axios.get(
        "https://api.ghostnet.tzkt.io/v1/contracts/KT1G83zKWfv3ZoqhB4av3Vaq9kNQqrBySwuZ/storage"
    )
    return res.data;
};