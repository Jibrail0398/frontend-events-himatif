/**
 * Alert Basic
 * @param {{ type: string, message: string }} props type: success, info, warning, danger. message: alert message
 */
const AlertBasic = ({ type, message }) => {
    return (
        <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
};

export default AlertBasic;
