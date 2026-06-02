import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading } from "../redux/slices/loadingSlice";

const Loading = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, loadingMessage, redirectUrl } = useSelector((state) => state.loading);

    useEffect(() => {
        if (redirectUrl) {
            const timer = setTimeout(() => {
                dispatch(hideLoading());
                navigate(redirectUrl);
            }, 3000); // 3 seconds redirect

            return () => clearTimeout(timer);
        }
    }, [redirectUrl, navigate, dispatch]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary"></div>
            <p className="mt-4 text-text/70 text-sm">{loadingMessage}</p>
            {redirectUrl && (
                <p className="mt-2 text-xs text-text/50">
                    Redirecting in 3 seconds...
                </p>
            )}
        </div>
    );
};

export default Loading;