import { useCallback, useEffect, useState } from "react";
import * as eventService from "../services/eventService";
import { useLocalStorage } from "react-use";


const useEvent = () => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [token, _] = useLocalStorage("token");

    const getAll = useCallback(async () => {
        try {
            const response = await eventService.getEvents(token);
            setEvents(response.data);
            return response.data;
        } catch (error) {
            throw error?.response?.data?.message || error.message;
        }
    }, []);

    const getPublicEvents = useCallback(async()=>{
        try{
            const response = await eventService.getPublicEvents();
            return response.data;
        }catch(error){
            throw error?.response?.data?.message || error.message;
        }
    });

    const create = useCallback(async (data) => {
        try {
            const response = await eventService.createEvent(data, token);
            await getAll();
            return response.data;
        } catch (error) {
            throw error?.response?.data?.message || error.message;
        }
    });

    const destroyById = useCallback(async (id) => {
        try {
            const response = await eventService.deleteEvent(id, token);
            await getAll();
            return response.data;
        } catch (error) {
            throw error?.response?.data?.message || error.message;
        }
    });

    const updateById = useCallback(async (id, data) => {
        try {
            const response = await eventService.updateEvent(id, data, token);
            await getAll();
            return response.data;
        } catch (error) {
            throw error?.response?.data?.message || error.message;
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            await getAll();
            setLoading(false);
        };
        fetchData();
    }, []);

    return { loading, events, getAll, create, destroyById, updateById,getPublicEvents };
};

export default useEvent;
