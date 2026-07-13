import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const SellerInbox = () => {
    const navigate = useNavigate()
    const { seller } = useSelector((state) => state.seller);

    const [conversation, setConversation] = useState([])
    const [active, setActive] = useState(0)
    const [opoen, setOpen] = useState(false)


    const getSellerMessages = async () => {
        try {
            const { data } = await axios.get(`/api/conversation/get-seller-conversation/${seller._id}`);
            if (data.success) {
                setConversation(data.conversations)
                console.log(data);
            } else {
                toast.error(data.message);

            }
        } catch (error) {
            toast.error(error?.message || "Invalid coupon code!");
        }
    }


    useEffect(() => {
        if (seller?._id) {
            getSellerMessages()
        }
    }, [seller])

    const handleClick = async (id) => {
        navigate(`/conversation/${id}`)
    }

    return (
        <section className='w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded'>
            <h1 className='text-center text-[30px] py-3'>All messages</h1>

            {/* All messages list */}
            {conversation.map((item, index) => (
                <div key={index}
                    onClick={() => { setActive(index); handleClick(item._id) }}
                    className={`w-full flex p-3 px-3 my-3 ${active === index ? "bg-gray-400" : "bg-transparent"} cursor-pointer`}>
                    <div className="relative">
                        <img src="https://res.cloudinary.com/dhlfmjd3y/image/upload/v1783239186/waleed-webdev-1778590877743-265038543_as3uq9.png" alt="Profile pic" className='w-26.25 h-12.5 rounded-full' />
                        <div className='w-3 h-3 bg-green-400 rounded-full absolute top-0.5 right-0.5'></div>
                    </div>
                    <div className='pl-3 '>
                        <h1 className='text-[10px]'>Waleed</h1>
                        <p className="text-[16px] text-[#000c]">You: Yeah I am good Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore tempora ipsam, aut voluptas ut odio sit delectus ex sint. Ad dignissimos enim nostrum doloremque sit laudantium delectus tempora nihil quis.</p>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default SellerInbox
