/**
 *
 * @param {{ title: string, columns: string[], data: string[] }} props
 * @returns
 */
const Table = ({ columns, data }) => {
    return (
        <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                <thead>
                    <tr>
                        {columns.map((item, index) => (
                            <th key={index}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {item.map((item, index) => (
                                <td key={index}>{item}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
