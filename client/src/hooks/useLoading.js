import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/slices/loadingSlice';

const useLoading = () => {
    const dispatch = useDispatch();

    const withLoading = async (asyncFunction, options = {}) => {
        const { message = "Processing...", redirectUrl = null } = options;

        try {
            dispatch(showLoading({ message, redirectUrl }));
            const result = await asyncFunction();
            dispatch(hideLoading());
            return result;
        } catch (error) {
            dispatch(hideLoading());
            throw error;
        }
    };

    return { withLoading };
};

export default useLoading;