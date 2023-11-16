import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API } from "../api";
import { PhoneIcon, PhoneXMarkIcon } from "@heroicons/react/20/solid";

function CustomersTemplate({ data }) {
    console.log(data)
    return (<li
        key={data?.u_id}
        className="bg-white p-4 rounded-md shadow-md flex items-center justify-between"
    >
        {/* Customer details */}
        <div>
            <h2 className="text-lg font-semibold">{data.name}</h2>
            <p className="text-gray-500">{data?.address}</p>
            <p className="text-gray-500">{data?.contact_no}</p>
            <p className="text-gray-500">{data?.address}</p>
        </div>

        {/* Action buttons (e.g., call, message) */}
        <div className="flex space-x-4">
            <button
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                onClick={() => handleCall(data?.contact_no)}
            >
                <PhoneIcon width={24} />
            </button>
            <button
                className="bg-green-500 text-white px-3 py-1 rounded-md"            >
                Manage
            </button>
        </div>
    </li>)
}

function Customers() {
    let { _sid } = useParams();
    let [data, _data_] = useState({})
    useEffect(() => {
        API.get(`/customers/${_sid}/`).then((response) => {
            _data_(response.data);
        })
    }, [_sid])

    const [searchTerm, setSearchTerm] = useState('');

    // Filter customers based on the search term
    const filtered_data = data?.customers?.filter((customer) => {
        // Customize the fields you want to include in the search
        const searchableFields = ['name', 'address', 'contact_no', 'whatsapp_no', 'email', 'mobile','reg_no'];
        return searchableFields.some((field) =>
            String(customer[field]).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (<div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-500 p-4 text-white text-center">
            <h1 className="text-2xl font-bold">Customers</h1>
            <input
                type="text"
                className="p-2 mt-2 w-full border rounded-md text-gray-600"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </header>

        {/* Main content */}
        <main className="p-4">
            {/* List of customers */}
            <ul className="grid grid-cols-1 gap-2">

                {data?.customers && filtered_data?.map((customer, key) => {
                    return <CustomersTemplate key={key} data={customer} />
                })}
            </ul>


        </main>
    </div>
    )
}


// Function to handle the "Call" action (replace with actual implementation)
const handleCall = (phoneNumber) => {
    console.log(`Calling ${phoneNumber}`);
};

// Function to handle the "Message" action (replace with actual implementation)
const handleMessage = (phoneNumber) => {
    console.log(`Sending message to ${phoneNumber}`);
};



export { Customers }


