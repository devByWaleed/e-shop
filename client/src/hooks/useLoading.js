import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/slices/loadingSlice';

const useLoading = () => {
    const dispatch = useDispatch();

    const withLoading = useCallback(async (asyncFunction, options = {}) => {
        const { message = "Processing...", redirectUrl = null } = options;

        try {
            dispatch(showLoading({ message, redirectUrl }));
            return await asyncFunction();
        } finally {
            dispatch(hideLoading());
        }
    }, [dispatch]);

    return useMemo(() => ({ withLoading }), [withLoading]);
};

export default useLoading;