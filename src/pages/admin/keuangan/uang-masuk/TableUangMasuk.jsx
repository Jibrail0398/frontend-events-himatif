import TableSearch from "../../../../components/TableSearch";
import { ButtonGroup, Button } from "react-bootstrap";

const TableUangMasuk = ({ uangMasuk, handleDelete, handleEdit, handleDetail, handleShowBukti, formatDateID }) => {
    return (
        <TableSearch
            defaultOrder={{ column: 0, order: "desc" }}
            className="mt-4"
            header={["ID", "Nominal", "Asal Pemasukan", "Tanggal", "Created At", "Aksi"].map((text, i) => (
                <th key={i}>{text}</th>
            ))}
            body={uangMasuk.map((item) => (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.jumlah_uang_masuk}</td>
                    <td>{item.asal_pemasukan}</td>
                    <td>{item.tanggal_pemasukan}</td>
                    <td>{formatDateID(item.created_at)}</td>
                    <td>
                        <ButtonGroup size="sm">
                            <Button variant="danger" onClick={() => handleDelete(item)}>
                                <i className="fas fa-trash"></i>
                            </Button>
                            <Button variant="primary" onClick={() => handleEdit(item)}>
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Button variant="info" onClick={() => handleDetail(item)}>
                                <i className="fas fa-info-circle"></i>
                            </Button>
                            <Button variant="success" onClick={() => handleShowBukti(item)}>
                                <i className="fas fa-image"></i>
                            </Button>
                        </ButtonGroup>
                    </td>
                </tr>
            ))}
        />
    );
};

export default TableUangMasuk;
