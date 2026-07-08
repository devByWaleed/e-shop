import EventProduct from '../components/EventCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllEvents } from '../redux/actions/eventAction';

const Events = () => {
    const { eventSuccess, eventLoading, event,
        shopEvents, allEvents, eventError,
    } = useSelector((state) => state.event);
    const { seller } = useSelector((state) => state.seller);

    const dispatch = useDispatch();

    useEffect(() => {
        if (seller?._id) {
            dispatch(getAllEvents())
        }
    }, [seller?._id, dispatch])

    return (
        <div className="py-10 bg-gray-50">
            <h1 className="text-center text-3xl font-bold mb-8">Current Flash Events</h1>

            <div className="flex flex-col gap-8">
                {allEvents?.map((product, index) => (
                    <EventProduct key={product._id} product={product} />
                )) || <p>Loading events...</p>}
            </div>
        </div>
    );
};

export default Events;