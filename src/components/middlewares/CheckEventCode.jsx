import { showEventbyCode } from "../../services/eventService";

export async function CheckEventCode({params}){
    const { kodeEvent } = params;
    const location = new URL(window.location.href);
    
    let eventDetails;

    
    try {
        
        eventDetails = await showEventbyCode(kodeEvent); 
    } catch (e) {
        
        if (e.response && e.response.status === 404) {
            console.log(`Event inaugurasi ini tidak ditemukan (404)`);
            throw new Error(`Event inaugurasi ini tidak ditemukan`);
        }
        
        console.error(`Gagal mengambil data event: ${e.message}`);
        throw new Error(`Gagal mengambil data event.`);
    }

    
    let registerStatus = null;

    
    if(location.pathname.includes('pendaftaranPeserta')){
        registerStatus = eventDetails.data.event.status_pendaftaran_peserta;
        
    } else if(location.pathname.includes('pendaftaranPanitia')){
        
        registerStatus = eventDetails.data.event.status_pendaftaran_panitia;
    }

    if(registerStatus === 'tutup'){
        throw new Error(`Pendaftaran telah ditutup`);
    }
    
    
    return eventDetails;
}

export default CheckEventCode;