import { useCallback, useEffect, useState } from "react";
import * as keuanganService from "../services/keuanganService";
import { useLocalStorage } from "react-use";

const useUangMasuk = () => {
    const [loading, setLoading] = useState(true);
    const [uangMasuk, setUangMasuk] = useState([]);
    const [token, _] = useLocalStorage("token");

    const getAll = useCallback(async () => {
        setLoading(true);

        const response = await keuanganService.getAllUangMasuk(token);
        setUangMasuk(response.data);

        setLoading(false);
    }, []);

    const getById = useCallback(async (id) => {
        // Fetch by ID logic here
        return uangMasuk.find((item) => item.id === id);
    }, []);

    const create = useCallback(async (data) => {
        try {
            const response = await keuanganService.createUangMasuk(data, token);
            getAll();
            return response;
        } catch (error) {
            throw error;
        }
    }, []);

    const update = useCallback(async (id, data) => {
        return await keuanganService.updateUangMasuk(id, data, token);
    });

    const deleteById = useCallback(async (id) => {
        return await keuanganService.deleteUangMasuk(id, token);
    });

    useEffect(() => {
        getAll();
    }, []);

    return { loading, uangMasuk, getAll, getById, create, update, deleteById };
};

export default useUangMasuk;
