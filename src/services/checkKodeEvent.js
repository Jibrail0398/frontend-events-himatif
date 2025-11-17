import axios from 'axios';
import { error } from 'jquery';
const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;

export const checkingEventCode = async(event_code) =>{
    try{
        const response = await axios.post(`${BASE_URL_API}/pendaftaran-panitia/${event_code}`);
        throw error;


    }catch(error){
        if(error.response.status !== 404){
            return true
        }else{
            return false
        }
    }
}