import { useEffect,useState } from "react";
import { useLocalStorage } from "react-use";
import * as PresensiService from "../services/presensiService";

const useDaftarHadir = ()=>{
    const [token] = useLocalStorage("token");
    const [loading, setLoading] = useState(false);
    const [peserta, setPeserta] = useState([]);
    const [panitia, setPanitia] = useState([]);


    const getAll = async(key,value)=>{

        let url = "";

        if(key === undefined || value === undefined){
            url += `/kehadiran-peserta/index`;
            

        }else{

            if(key.length != value.length){
                throw error("Panjang key dan value harus sama");
            }

            const params = new URLSearchParams();

            for(let i=0; i<value.length;i++){
                params.append(key[i], value[i]);
            }

            url+=`/kehadiran-peserta/index?${params.toString()}`;

        }

        try{
            setLoading(true);
            const response = await PresensiService.getDaftarHadirPeserta(url,token);
            const allPeserta = response.data.map((item)=>{
                return item.peserta;
            }); 

            setPeserta(allPeserta);
            
            
            

        }catch(error){
            throw error;
        }finally{
            setLoading(false);
        }

        
    }

    const getAllPanitia = async(key,value)=>{
        let url = "";

        if(key === undefined || value === undefined){
            url += `/kehadiran-panitia/index`;
            

        }else{

            if(key.length != value.length){
                throw error("Panjang key dan value harus sama");
            }

            const params = new URLSearchParams();

            for(let i=0; i<value.length;i++){
                params.append(key[i], value[i]);
            }

            url+=`/kehadiran-peserta/index?${params.toString()}`;

        }

        try{
            setLoading(true);
            const response = await PresensiService.getDaftarHadirPanitia(url,token);
            const allPanitia = response.data.map((item)=>{
                return item.peserta;
            }); 

            setPanitia(allPanitia);


        }catch(error){
            throw error;
        }finally{
            setLoading(false);
        }
    }

    return {loading,peserta,panitia,getAll,getAllPanitia};

}

export default useDaftarHadir;