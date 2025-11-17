import axios from "axios"
const BASE_URL_API = import.meta.env.VITE_BASE_URL_API

export const getCertificateData = async (token) =>{
    try{
        const response = await axios.get(`${BASE_URL_API}/sertifikat/index`,{
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

export const createCertificate = async(token,data)=>{
    try{
        const response = await axios.post(`${BASE_URL_API}/sertifikat/add`,data,{
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

export const updateCertificate = async(token,data,id)=>{
    try{
        const response = await axios.put(`${BASE_URL_API}/sertifikat/update/${id}`,data,{
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

export const deleteCertificate = async(token,id)=>{
    try{
        const response = await axios.delete(`${BASE_URL_API}/sertifikat/delete/${id}`,{
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
