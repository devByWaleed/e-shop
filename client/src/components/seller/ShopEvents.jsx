import React from "react";
import { useNavigate } from "react-router-dom";

// Tried in order, so it works whichever date field names your Event model uses
const START_KEYS = ["start_Date", "startDate", "start_date"];
const END_KEYS = ["Finish_Date", "finishDate", "finish_Date", "endDate", "end_Date"];

const readDate = (event, keys) => {
    for (const key of keys) {
        if (event?.[key]) {
            const date = new Date(event[key]);
            if (!Number.isNaN(date.getTime())) return date;
        }
    }
    return null;
};

const formatDate = (date) =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });


const EventCard = ({ event, now }) => {
    const navigate = useNavigate();

    const start = readDate(event, START_KEYS);
    const end = readDate(event, END_KEYS);
    const isUpcoming = Boolean(start && start > now);
    const image = event.images?.[0];

    const price = event.discountPrice ?? event.originalPrice;
    const hasDiscount =
        event.originalPrice && event.discountPrice &&
        Number(event.originalPrice) > Number(event.discountPrice);

    const openEvent = () => {
        navigate(`/events/${encodeURIComponent(event.category || "all")}/${event._id}`);
    };

    return (
        <div
            onClick={openEvent}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col"
        >
            {/* Image + status badge */}
            <div className="relative w-full h-44 bg-gray-100">
                {image && (
                    <img src={image} alt={event.name} className="w-full h-full object-cover" />
                )}
                <span
                    className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${isUpcoming ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                        }`}
                >
                    {isUpcoming ? "Upcoming" : "Running"}
                </span>
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col gap-2 grow">
                <h3 className="font-semibold text-gray-900 text-[15px] line-clamp-1">{event.name}</h3>

                {event.description && (
                    <p className="text-gray-500 text-sm line-clamp-2">{event.description}</p>
                )}

                {(start || end) && (
                    <p className="text-xs text-gray-400">
                        {start ? formatDate(start) : ""}
                        {start && end ? " to " : ""}
                        {end ? formatDate(end) : ""}
                    </p>
                )}

                {price !== undefined && price !== null && (
                    <div className="flex items-center gap-2 mt-auto pt-2">
                        <span className="text-base font-semibold text-gray-900">${price}</span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">${event.originalPrice}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


const ShopEvents = ({ events = [], loading = false, error = null }) => {
    const now = new Date();

    // "Running" means not finished yet. Events without an end date are kept.
    const runningEvents = events.filter((event) => {
        const end = readDate(event, END_KEYS);
        return !end || end >= now;
    });

    if (loading && events.length === 0) {
        return <p className="text-gray-500 py-8 text-center">Loading events...</p>;
    }

    if (error && events.length === 0) {
        return <p className="text-red-500 py-8 text-center">{error}</p>;
    }

    if (runningEvents.length === 0) {
        return <p className="text-gray-500 py-8 text-center">No running events for this shop right now.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {runningEvents.map((event) => (
                <EventCard key={event._id} event={event} now={now} />
            ))}
        </div>
    );
};

export default ShopEvents;