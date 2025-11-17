import { useEffect,useState } from "react";
import* as DokumentasiService from "../services/dokumentasi";
import { useLocalStorage } from "react-use";
import { error } from "jquery";

const useDokumentasi = ()=>{

    const [loading,setLoading] = useState(false);
    const [dokumentasiData,setDokumentasiData] = useState([]);
    const [token] = useLocalStorage("token");


    const getAll= async()=>{
        if (!token) {
            console.log("Token tidak tersedia");
            return;
        }
        setLoading(true);
        try{

            const response = await DokumentasiService.getDokumentasiData(token);
            setDokumentasiData(response.data);
        }catch(e){

            setLoading(false)
            throw error;
        }
        
        setLoading(false)
    }

    const create = async(data)=>{
        setLoading(true);
        try{

            if (!token) {
            console.log("Token tidak tersedia");
            return;
        }
            const response = await DokumentasiService.createDokumentasiData(token,data);
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
            const response = await DokumentasiService.updateDokumentasi(token,data,id);
            
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
            const response = await DokumentasiService.deleteDokumentasi(token,id);
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

    return {loading,getAll,dokumentasiData,create,update,deletedata};
};
export default useDokumentasi;