import axios from "axios"
const BASE_URL_API = import.meta.env.VITE_BASE_URL_API

export const getDokumentasiData = async(token)=>{
    try{
        const response = await axios.get(`${BASE_URL_API}/dokumentasi/index`,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });
        
        return response.data
    }catch(error){
        if (axios.isAxiosError(error)) {
            
            console.error('Error Response:', error.response);
            
            
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Headers:', error.response?.headers);
            console.error('Data:', error.response?.data);
            console.error('URL:', error.config?.url);
            console.error('Method:', error.config?.method);
            } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

export const createDokumentasiData = async(token,data)=>{
    try{
        const response = await axios.post(`${BASE_URL_API}/dokumentasi/add`,data,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });
        return response;
    }catch(error){
        if (axios.isAxiosError(error)) {
            
            console.error('Error Response:', error.response);
            
            
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Headers:', error.response?.headers);
            console.error('Data:', error.response?.data);
            console.error('URL:', error.config?.url);
            console.error('Method:', error.config?.method);
            } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

export const updateDokumentasi = async(token,data,id)=>{
    try{
        const response = await axios.put(`${BASE_URL_API}/dokumentasi/update/${id}`,data,{
            headers:{
                Authorization:`Bearer ${token}`,
                
            }
        });
        return response;
    }catch(error){
        if (axios.isAxiosError(error)) {
            
            console.error('Error Response:', error.response);
            
            
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Headers:', error.response?.headers);
            console.error('Data:', error.response?.data);
            console.error('URL:', error.config?.url);
            console.error('Method:', error.config?.method);
            } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

export const deleteDokumentasi = async(token,id)=>{
    try{
        const response = await axios.delete(`${BASE_URL_API}/dokumentasi/delete/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
             }
        });
    return response;
    }
    catch(error){
        if (axios.isAxiosError(error)) {
            
            console.error('Error Response:', error.response);
            
            
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Headers:', error.response?.headers);
            console.error('Data:', error.response?.data);
            console.error('URL:', error.config?.url);
            console.error('Method:', error.config?.method);
            } else {
            console.error('Unexpected error:', error);
        }
        throw error;

    }
}