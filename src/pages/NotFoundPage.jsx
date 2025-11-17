const NotFoundPage = () => {
    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100">
            {/* 404 Error Text */}
            <div className="text-center">
                <div className="error mx-auto" data-text={404}>
                    404
                </div>
                <p className="lead text-gray-800 mb-5">Page Not Found</p>
                <p className="text-gray-500 mb-0">Halaman yang anda cari tidak ditemukan.</p>
            </div>
        </div>
    );
};

export default NotFoundPage;
