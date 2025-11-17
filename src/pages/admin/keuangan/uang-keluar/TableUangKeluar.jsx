import TableSearch from "../../../../components/TableSearch";
import { ButtonGroup, Button } from "react-bootstrap";

const TableUangKeluar = ({ uangKeluar, handleDelete, handleEdit, handleDetail, handleShowBukti, formatDateID }) => {
    return (
        <TableSearch
            defaultOrder={{ column: 0, order: "desc" }}
            className="mt-4"
            header={["ID", "Nominal", "Keperluan", "Tanggal", "Created At", "Aksi"].map((text, i) => (
                <th key={i}>{text}</th>
            ))}
            body={uangKeluar.map((item) => (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.jumlah_pengeluaran}</td>
                    <td>{item.alasan_pengeluaran}</td>
                    <td>{item.tanggal_pengeluaran}</td>
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

export default TableUangKeluar;
