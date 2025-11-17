import { useCallback,useEffect,useState } from "react";
import * as SertifikatService from "../services/sertifikat";

import { useLocalStorage } from "react-use";

const useSertifikat = ()=>{
    const [loading,setLoading] = useState(false);
    const [certificateData, setCertificateData] = useState([]);
    const [token] = useLocalStorage("token");
    


    const getAll= async()=>{
        if (!token) {
            console.log("Token tidak tersedia");
            return;
        }
        setLoading(true);

        const response = await SertifikatService.getCertificateData(token);
        setCertificateData(response.data);
        setLoading(false)
    };

    const create = async(data)=>{
        setLoading(true);
        try{

            if (!token) {
            console.log("Token tidak tersedia");
            return;
        }
            const response = await SertifikatService.createCertificate(token,data);
            getAll();
            setLoading(false);
            return response;
        }catch(error){
            setLoading(false);
            throw error;
        }
        
    }
    const update = async(data,id)=>{
        setLoading(true);
        try{

            if (!token) {
            console.log("Token tidak tersedia");
            return;
        }
            const response = await SertifikatService.updateCertificate(token,data,id);
            getAll();
            setLoading(false);
            return response;
        }catch(error){
            setLoading(false);
            throw error;
            
        }
        
    }

    const deletedata = async(id)=>{
        setLoading(true);
        try{
            if(!token){
                console.log("Token tidak tersedia");
            }
            const response = await SertifikatService.deleteCertificate(token,id);
            setLoading(false);
            getAll();
            return response;

        }catch(error){
            setLoading(false);
            throw error;
        }
    }

    useEffect(()=>{
        
        getAll();
    },[]);

    return {loading,getAll,certificateData,create,update,deletedata};
}

export default useSertifikat;