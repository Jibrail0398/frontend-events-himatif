import { useCallback, useEffect, useState } from "react";
import * as keuanganService from "../services/keuanganService";

const useKeuangan = () => {
    const [loading, setLoading] = useState(true);
    const [keuangan, setKeuangan] = useState([]);

    const getAll = useCallback(async () => {
        const response = await keuanganService.getKeuangan();
        setKeuangan(response.data);
        setLoading(false);
    }, []);

    const getById = useCallback(async (id) => {
        //
    }, []);

    useEffect(() => {
        getAll();
    }, []);

    return { loading, keuangan, getById, getAll };
};

export default useKeuangan;
