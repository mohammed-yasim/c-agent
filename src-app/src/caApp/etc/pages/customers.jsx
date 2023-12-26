import { useEffect, useState } from "react"
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom"
import { API } from "../api";
import { PaperAirplaneIcon, PencilSquareIcon, PhoneIcon, PhoneXMarkIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";


function Customer() {
    return (
        <Routes>
            <Route index element={<ViewCustomer />}></Route>
            <Route path="edit" element={<EditCustomer />}></Route>
            <Route path="create-bill" element={<CreateBill />}></Route>
            <Route path="collect-payment" element={<CollectPayment />}></Route>
        </Routes>
    )
}

function CreateBill() {
    return (<div className="h-full bg-gray-100 relative">
        {/* Header */}
        <header className="bg-blue-500 p-4 text-white text-center sticky top-0">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-3">Create Bill<Link to="./../" replace={true}> <XCircleIcon className="w-6" /> </Link></h1>
        </header>

        {/* Main content */}
        <main className="p-4">
        </main>
    </div>)
}
function CollectPayment() {
    return (<div className="h-full bg-gray-100 relative">
        {/* Header */}
        <header className="bg-blue-500 p-4 text-white text-center sticky top-0">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-3">Collect Payment <Link to="./../" replace={true}> <XCircleIcon className="w-6" /> </Link></h1>
        </header>

        {/* Main content */}
        <main className="p-4">
        </main>
    </div>)
}

function ViewCustomer() {
    let { _sid, _cid } = useParams();
    let [data, _data_] = useState({})
    useEffect(() => {
        API.get(`/customers/${_sid}/${_cid}`).then((response) => {
            _data_(response.data);
        })
    }, [_sid])
    return (
        <div className="h-full bg-gray-100 relative">
            {/* Header */}
            <header className="bg-blue-500 p-4 text-white text-center sticky top-0">
                <h1 className="text-2xl font-bold flex items-center justify-center gap-3">View Customer <Link to="edit" replace={true}> <PencilSquareIcon className="w-6" /> </Link></h1>
            </header>

            {/* Main content */}
            <main className="p-4">
                <div className="flex justify-between pb-4">
                    <Link to="create-bill">Create Bill</Link>
                    <Link to="collect-payment">Collect Payment</Link>
                </div>
                {data?.c_id && <CustomerInfoComponent customerData={data} />}
            </main>
        </div>)
}

const CustomerInfoComponent = ({ customerData }) => {
    const {
        name,
        address,
        contact_no,
        whatsapp_no,
        email,
        mobile,
        customer_invoices,
        customer_receipts,
        credit,
        debit,
    } = customerData;

    return (
        <div className="bg-gray-200 p-4 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2">{name}</h2>
            <div className="mb-2">
                <p className="text-gray-600 mb-1">Address: {address}</p>
                <p className="text-gray-600 mb-1">Contact No: {contact_no}</p>
                <p className="text-gray-600 mb-1">WhatsApp No: {whatsapp_no}</p>
                <p className="text-gray-600 mb-1">Email: {email}</p>
                <p className="text-gray-600 mb-1">Mobile: {mobile}</p>
            </div>
            <div className="mb-4">
                <p className="text-gray-600 mb-1">Credit: {credit}</p>
                <p className="text-gray-600 mb-1">Debit: {debit}</p>
            </div>
            <h3 className="text-xl font-bold mb-2">Invoices:</h3>
            <ul>
                {customer_invoices.map((invoice) => (
                    <li key={invoice.i_id} className="mb-2">
                        <p className="text-gray-600 mb-1">Invoice No: {invoice._no}</p>
                        <p className="text-gray-600 mb-1">Type: {invoice._type}</p>
                        <p className="text-gray-600 mb-1">Description: {invoice._desc}</p>
                        <p className="text-gray-600 mb-1">Amount: {invoice.amount}</p>
                        <p className="text-gray-600 mb-1">Date: {invoice.date}</p>
                    </li>
                ))}
            </ul>
            <h3 className="text-xl font-bold mb-2">Receipts:</h3>
            <ul>
                {customer_receipts.map((receipt) => (
                    <li key={receipt.i_id} className="mb-2">
                        <p className="text-gray-600 mb-1">Invoice No: {receipt._no}</p>
                        <p className="text-gray-600 mb-1">Type: {receipt._type}</p>
                        <p className="text-gray-600 mb-1">Description: {receipt._desc}</p>
                        <p className="text-gray-600 mb-1">Amount: {receipt.amount}</p>
                        <p className="text-gray-600 mb-1">Date: {receipt.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};


function EditCustomer() {
    let { _sid, _cid } = useParams();
    let [data, _data_] = useState({})
    let navigate = useNavigate();
    useEffect(() => {
        API.get(`/edit-customer/${_sid}/${_cid}`).then((response) => {
            _data_(response.data);
        })
    }, [_sid])
    const submitForm = (formData) => {
        API.put(`/edit-customer/${_sid}/${_cid}`, formData).then((response) => {
            console.log(response.data)
            navigate(`./../`, { replace: true })
        })
    }
    return (
        <div className="h-full bg-gray-100 relative">

            {/* Header */}
            <header className="bg-blue-500 p-4 text-white text-center sticky top-0">
                <h1 className="text-2xl font-bold flex items-center justify-center gap-3">Edit Customer <Link to="./../" replace={true}> <XCircleIcon className="w-6" /> </Link></h1>
            </header>

            {/* Main content */}
            <main className="p-4">
                {data?.c_id && <AddCustomerForm edit={true} data={data} submitForm={submitForm} />}
            </main>
        </div>)
}


function Customers() {
    return (<Routes>
        <Route index element={<AllCustomers />} />
        <Route path="add" element={<AddCustomer />}></Route>
        <Route path="pendings" element={<PendingCustomers />} />
        <Route path="collection" element={<CollectionCustomers />} />
    </Routes>)
}


// Function to handle the "Call" action (replace with actual implementation)
const handleCall = (phoneNumber) => {
    console.log(`Calling ${phoneNumber}`);
    window.open(`tel:${phoneNumber}`, '_self');
};

// Function to handle the "Message" action (replace with actual implementation)
const handleMessage = (phoneNumber, message) => {
    console.log(`Sending message to ${phoneNumber}`);
    alert(`currently not available`);
};

function CustomersTemplate({ data, replace = false, to = null, message = `` }) {
    // console.log(data)
    return (<li key={data?.u_id}>
        <div className="bg-white p-3 rounded-md shadow-md flex items-center justify-between">
            {/* Customer details */}
            <Link to={to || ''} replace={!to ? true : replace}>
                <div>
                    <h2 className="text-lg font-semibold">{data.name}</h2>
                    <p className="text-gray-500">{data?.address}</p>
                    <p className="text-gray-500">{data?.contact_no}</p>
                    <p className="text-gray-500">{data?.whatsapp_no}</p>
                </div>
            </Link>
            {/* Action buttons (e.g., call, message) */}
            <div className="flex flex-col gap-1">
                {data?.date && <p className="text-center">Due on : <br />{new Date(data?.date).toISOString().slice(0, 10)}</p>}
                {data.credit !== null && data.debit !== null && <p className="text-center">{data?.credit > data?.debit ? <span className="text-red-500">₹{data?.credit - data?.debit}</span> : <span className="text-green-500">₹{data?.debit - data?.credit}</span>}</p>}
                <div className="flex flex-row gap-1">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-md">
                        <PhoneIcon width={20} onClick={() => { handleCall(data?.contact_no) }} />
                    </span> <span className="bg-green-500 text-white px-3 py-1 rounded-md">
                        <PaperAirplaneIcon onClick={() => { handleMessage(data?.whatsapp_no, message) }} width={20} />
                    </span>
                </div>
            </div>
        </div>
    </li>)
}

function AllCustomers() {
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
        const searchableFields = ['name', 'address', 'contact_no', 'whatsapp_no', 'email', 'mobile', 'reg_no'];
        return searchableFields.some((field) =>
            String(customer[field]).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (<div className="h-full bg-gray-100 relative">
        {/* Header */}
        <header className="bg-blue-500 p-4 text-white text-center sticky top-0">
            <h1 className="text-2xl font-bold">Customers</h1>
            <div className="flex flex-row items-center justify-center">
                <input
                    type="text"
                    className="p-2 mt-2 w-full border rounded-md text-gray-600"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Link className="pl-2" to="add"><PlusCircleIcon width={32} /> </Link>
            </div>
        </header>

        {/* Main content */}
        <main className="p-4">
            {/* List of customers */}
            <ul className="grid grid-cols-1 gap-2">

                {data?.customers && filtered_data?.map((customer, key) => {
                    return <CustomersTemplate to={`./../customer/${customer?.c_id}`} key={key} data={customer} />
                })}
            </ul>


        </main>
    </div>
    )
};

function PendingCustomers() {
    let { _sid } = useParams();
    let [data, _data_] = useState({});
    const [service_date, _service_date_] = useState(sessionStorage.getItem('service_date') || new Date().toISOString().slice(0, 10));
    useEffect(() => {
        API.get(`/customers-pending/${_sid}?date=${service_date}`).then((response) => {
            _data_(response.data);
        })
    }, [_sid])

    const [searchTerm, setSearchTerm] = useState('');

    // Filter customers based on the search term
    const filtered_data = data?.customers?.filter((customer) => {
        // Customize the fields you want to include in the search
        const searchableFields = ['name', 'address', 'contact_no', 'whatsapp_no', 'email', 'mobile', 'reg_no'];
        return searchableFields.some((field) =>
            String(customer[field]).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (<div className="h-full bg-gray-100 relative">
        {/* Header */}
        <header className="bg-blue-500 p-4 text-white text-center sticky top-0">
            <h1 className="text-2xl font-bold">Pending : {service_date}</h1>
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

                {data?.customers && filtered_data?.slice().sort((a, b) => new Date(a.date) - new Date(b.date))?.map((customer, key) => {
                    return <CustomersTemplate to={`./../../customer/${customer?.c_id}`} key={key} data={customer} />
                })}
            </ul>


        </main>
    </div>
    )
};

function CollectionCustomers() {
    let { _sid } = useParams();
    let [data, _data_] = useState({});
    const [service_date, _service_date_] = useState(sessionStorage.getItem('service_date') || new Date().toISOString().slice(0, 10));
    useEffect(() => {
        API.get(`/customers-collection/${_sid}?date=${service_date}`).then((response) => {
            _data_(response.data);
        })
    }, [_sid])

    const [searchTerm, setSearchTerm] = useState('');

    // Filter customers based on the search term
    const filtered_data = data?.customers?.filter((customer) => {
        // Customize the fields you want to include in the search
        const searchableFields = ['name', 'address', 'contact_no', 'whatsapp_no', 'email', 'mobile', 'reg_no'];
        return searchableFields.some((field) =>
            String(customer[field]).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (<div className="h-full bg-gray-100 relative">
        {/* Header */}
        <header className="bg-blue-500 p-4 text-white text-center sticky top-0">
            <h1 className="text-2xl font-bold">Collections : {service_date}</h1>
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

                {data?.customers && filtered_data?.slice().sort((a, b) => new Date(a.date) - new Date(b.date))?.map((customer, key) => {
                    return <CustomersTemplate key={key} data={customer} to={`./../../customer/${customer?.c_id}`} />
                })}
            </ul>


        </main>
    </div>
    )
};

const AddCustomerForm = ({ edit = false, data = {
    name: '',
    address: '',
    contact_no: '',
    whatsapp_no: '',
},
    submitForm = (formData) => { console.log(formData) }
}) => {
    const [formData, setFormData] = useState(data);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm(formData)
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                {/* Address */}
                <div className="mb-4">
                    <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        rows="4"
                    ></textarea>
                </div>

                {/* Contact Number */}
                <div className="mb-4">
                    <label htmlFor="contact_no" className="block text-gray-700 font-semibold mb-2">
                        Contact Number
                    </label>
                    <input
                        type="tel"
                        id="contact_no"
                        name="contact_no"
                        value={formData.contact_no}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* WhatsApp Number */}
                <div className="mb-4">
                    <label htmlFor="whatsapp_no" className="block text-gray-700 font-semibold mb-2">
                        WhatsApp Number
                    </label>
                    <input
                        type="tel"
                        id="whatsapp_no"
                        name="whatsapp_no"
                        value={formData.whatsapp_no}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                {/* Submit button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    {edit ? "Save" : "Add"}
                </button>
            </form>
        </div>
    );
};

function AddCustomer() {
    let { _sid } = useParams();
    let navigate = useNavigate();
    const submitForm = (formData) => {
        API.post(`/add-customer/${_sid}`, formData).then((response) => {
            console.log(response.data)
            navigate(`./../../customer/${response.data?.c_id}`, { replace: true })
        })
    }
    return (
        <div className="h-full bg-gray-100 relative">
            {/* Header */}
            <header className="bg-blue-500 p-4 text-white text-center sticky top-0">
                <h1 className="text-2xl font-bold">Add New Customer</h1>
            </header>
            {/* Main content */}
            <main className="p-4">
                <AddCustomerForm edit={false} submitForm={submitForm} />
            </main>
        </div>
    )
}


export { Customers, Customer }


