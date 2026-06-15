import EventProduct from '../components/EventProduct';
import { productData } from '../assets/assets';

const Events = () => {
    const products = productData.filter(product => product.event);

    return (
        <div className="py-10 bg-gray-50">
            <h1 className="text-center text-3xl font-bold mb-8">Current Flash Events</h1>

            <div className="flex flex-col gap-8">
                {products.map((product, index) => (
                    <EventProduct key={`${product.id}-${index}`} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Events;