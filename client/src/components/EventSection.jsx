import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../redux/actions/eventAction';
import EventProduct from './EventProduct';

const EventSection = () => {
    const dispatch = useDispatch();
    const { allEvents } = useSelector((state) => state.event);

    useEffect(() => {
        dispatch(getAllEvents());
    }, [dispatch]);


    return (
        <section className="bg-white flex flex-col items-center justify-center px-4 py-16">
            <div className="max-w-7xl mx-auto items-start mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-dark">
                    Event <span className="text-primary">Products</span>
                </h1>
                <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
                {allEvents?.map((product, index) => (
                    <EventProduct key={product._id} product={product} />
                )) || <p>No events available.</p>}
            </div>
        </section>
    );
};

export default EventSection;