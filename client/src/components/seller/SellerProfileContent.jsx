import React from 'react'
import { AiOutlineMoneyCollect } from 'react-icons/ai'

const SellerProfileContent = () => {
    return (
        <section className='w-full p-8'>
            <h3 className='text-[22px] pb-2'>Overview</h3>

            <div className='w-full block 800px:flex items-center justify-between'>
                <div className="w-full mb-4800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">

                        <AiOutlineMoneyCollect
                            size={30}
                            className='mr-2'
                            fill='#00000005'
                        />
                        <h3 className='text-[18px] leading-5 font-[400px] text-zinc-900'>
                            Account Balance <span className='text-[16px]'>with 10% service charge</span>
                        </h3>

                    </div>
                    <h5 className='pt-2 pl-9 text-[22px] font-medium'>${100}</h5>

                    {/* <Link to="/"></Link> */}
                </div>


                <div className="w-full mb-4800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">

                        <AiOutlineMoneyCollect
                            size={30}
                            className='mr-2'
                            fill='#00000005'
                        />
                        <h3 className='text-[18px] leading-5 font-[400px] text-zinc-900'>
                            All Orders
                        </h3>

                    </div>
                    <h5 className='pt-2 pl-9 text-[22px] font-medium'>${100}</h5>

                    {/* <Link to="/"></Link> */}
                </div>


                <div className="w-full mb-4800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">

                        <AiOutlineMoneyCollect
                            size={30}
                            className='mr-2'
                            fill='#00000005'
                        />
                        <h3 className='text-[18px] leading-5 font-[400px] text-zinc-900'>
                            Account Balance <span className='text-[16px]'>with 10% service charge</span>
                        </h3>

                    </div>
                    <h5 className='pt-2 pl-9 text-[22px] font-medium'>${100}</h5>

                    {/* <Link to="/"></Link> */}
                </div>
            </div>

        </section>
    )
}

export default SellerProfileContent
