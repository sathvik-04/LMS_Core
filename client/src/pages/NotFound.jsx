import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="error-area section--padding text-center">
            <div className="container">
                <div className="error-content">
                    <img src="/images/404-img.png" alt="404" className="img-fluid pb-4" style={{ maxWidth: 400 }}
                        onError={e => { e.target.style.display = 'none'; }} />
                    <h2 className="fs-100 text-color font-weight-bold lh-1 pb-3">404</h2>
                    <h3 className="fs-30 pb-3">Oops! Page Not Found</h3>
                    <p className="pb-4">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                    <Link to="/" className="btn theme-btn"><i className="la la-home mr-1"></i> Go to Home</Link>
                </div>
            </div>
        </section>
    );
}
