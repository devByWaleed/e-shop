import { useState } from 'react';
import EventProduct from '../components/EventProduct';
import { productData } from '../assets/assets';

const Events = () => {
    // Initialize state directly with your dummy data array
    const [eventProducts] = useState(productData);

    return (
        <div className="py-10 bg-gray-50">
            <h1 className="text-center text-3xl font-bold mb-8">Current Flash Events</h1>

            <div className="flex flex-col gap-8">
                {eventProducts && eventProducts.map((product, index) => (
                    // FIXED: Changed product._id to product.id to match your mock data array keys
                    <EventProduct key={`${product.id || index}-${index}`} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Events;