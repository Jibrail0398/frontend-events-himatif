import { useEffect } from "react";
import $ from "jquery";

// ✅ Import DataTables Bootstrap 5
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

/**
 * TableSearch Component
 * @param {{ header, body, defaultOrder: { column: number, order: string }, className?: string }} props order: { column: 0, order: "asc" | "desc" }
 */
const TableSearch = ({ header, body, defaultOrder = { column: 0, order: "asc" }, className }) => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const tableId = `table-${randomId}`;

    useEffect(() => {
        const table = $(`#${tableId}`).DataTable({ order: [[defaultOrder.column, defaultOrder.order]] });

        return () => {
            table.destroy();
        };
    }, []);

    return (
        <div className={className + " table-responsive"}>
            <table id={tableId} className="table table-striped" style={{ width: "100%" }}>
                <thead>
                    <tr>{header}</tr>
                </thead>
                <tbody>{body}</tbody>
            </table>
        </div>
    );
};

export default TableSearch;
