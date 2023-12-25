import React, { Component, createContext, useContext, useEffect, useState, Fragment, useRef } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { API } from "./etc/api";
import './etc/style.css';
import Example404 from "./etc/componenets/404";
import HomePage from "./etc/pages/homepage";
import { getToken, removeUserSession, setUserSession } from "./etc/auth";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, Cog6ToothIcon, DocumentChartBarIcon, MapIcon, QrCodeIcon } from '@heroicons/react/20/solid'
import Test from "./etc/pages/qr";
import { PowerIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { CollectionCustomers, Customers, PendingCustomers } from "./etc/pages/customers";
import ManagePage from "./etc/pages/manage";
const AppContext = createContext();


export default function App() {
    return (<>
        <BrowserRouter>
            <Routes>
                {/* <Route index element={<Navigate to="app" />}></Route> */}
                <Route index element={<HomePage />}></Route>
                <Route path="/app/*" element={<AppCheck />}></Route>
                <Route path="/login" element={<LoginCheck />} />
                <Route path="/logout" element={<LogoutAction />} />
                <Route path="*" element={<Example404 />} />
            </Routes>
        </BrowserRouter>
    </>)
}

function LogoutAction() {
    if (removeUserSession()) {
        return (<Navigate replace to="/" />)
    }
}

function LoginCheck() {
    if (getToken() === null) {
        return <LoginPage />
    } else { return <Navigate replace to="/app" /> }
}

function AppCheck() {
    if (getToken() !== null) {
        return <AppHomeRoutes />
    } else { return <Navigate replace to="/login" /> }
}

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [error__state, _error__state_] = useState(null)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        _error__state_(null)
        e.preventDefault();
        // Perform authentication logic here (e.g., send data to a server, validate credentials)
        console.log('Form submitted with data:', formData);
        // Add your authentication logic here
        API.post('login', formData).then((response) => {
            setUserSession(response.data?.token);
            navigate('/app');
        }).catch(error => {
            _error__state_(`${error?.response?.data}`);
        })
        // // Reset the form after submission
        // setFormData({
        //     username: '',
        //     password: '',
        // });
        // Redirect
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">cAgent <span className="text-xs rounded-lg bg-red-500 p-1 text-white font-light">{import.meta.env.VITE_APP_VERSION}</span></h1>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {error__state && <p className="my-3 text-xs text-red-500 text-center">{error__state}</p>}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="username"
                                type="email"
                                autoComplete="email"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );

}

class AppHomeRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            error: false,
            data: {}
        }
        this.load_data = this.load_data.bind(this);
    }
    load_data() {
        API.get('sync').then(response => {
            this.setState({ loaded: true, error: false, data: response.data })
        }).catch(err => {
            this.setState({ loaded: true, error: true, data: {} })
        })
    }
    componentDidMount() {
        this.load_data();
    }
    render() {
        return (<>
            {!this.state.loaded && !this.state.error && <>Loading..</>}
            {this.state.loaded && !this.state.error && <AppContext.Provider value={this.state.data}>
                <div className="bg-white min-h-screen select-none">
                    <Routes>
                        <Route index element={<AppHome />}></Route>
                        <Route path="collection/:_sid/pending" element={<PendingCustomers />}></Route>
                        <Route path="collection/:_sid/collected" element={<CollectionCustomers />}></Route>
                        <Route path="customers/:_sid/*" element={<Customers />}></Route>
                        <Route path="qr/:_sid" element={<Test />}></Route>
                        <Route path="manage/*" element={<ManagePage />}></Route>
                        <Route path="*" element={<Example404 />} />

                    </Routes>
                    <div className="block p-6 text-xs text-gray-500 text-center dark:text-gray-400"> Version : {import.meta.env.VITE_APP_VERSION}</div>
                </div>
                <p value={JSON.stringify(this.state)} />
            </AppContext.Provider>
            }
            {
                this.state.error && <>
                    Network Error <br />
                    <div className="block p-6 text-xs text-gray-500 text-center dark:text-gray-400"> Version : {import.meta.env.VITE_APP_VERSION}</div>
                </>
            }

        </>);
    }
}
function AppHome() {
    let navigate = useNavigate();
    return (<>
        <div className="flex justify-between px-6 py-4">
            <button onClick={() => {
                navigate('/logout');
            }}>
                <PowerIcon className="text-red-500" width={24} />
            </button>
            <button onClick={() => {
                navigate('/user_setting ');
            }}>
                <UserCircleIcon className="text-red-500" width={24} />
            </button>
        </div>

        <div className="px-4">
            <HomeSelector />
        </div>
    </>)
}


function HomeSelector() {
    const { ServiceAreas } = useContext(AppContext);
    const [service_locations, _service_locations_] = useState(ServiceAreas || []);
    const [service_area, _service_area_] = useState({});
    const [service_date, _service_date_] = useState(sessionStorage.getItem('service_date') || new Date().toISOString().slice(0, 10));
    useEffect(() => {
        let session = sessionStorage.getItem('service_area') || '';
        if (session && session !== '' && session !== null) {
            _service_area_(ServiceAreas.find(a => a.s_id === session));
        } else {
            _service_area_({ s_id: '', name: 'Choose location/servce area' });
        }
    }, [])
    return (
        <>

            <div className="w-full grid grid-cols-6 gap-1">
                <div className="col-span-4">
                    <Listbox value={service_area?.s_id} onChange={(value) => {
                        if (value) {
                            sessionStorage.setItem('service_area', value);
                            _service_area_(ServiceAreas.find(a => a.s_id === value));
                        } else {
                            sessionStorage.removeItem('service_area')
                            _service_area_({ s_id: '', name: 'Choose location/servce area' });
                        }
                    }}>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-xs">
                                <span className="block truncate">{service_area?.name} </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    <Listbox.Option
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                            }`
                                        }
                                        value={''}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    Choose
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                    {service_locations.map((location, key) => (
                                        <Listbox.Option
                                            key={key}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                }`
                                            }
                                            value={location.s_id}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                            }`}
                                                    >
                                                        {location.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
                <div className="col-span-2">
                    <input type="date" value={service_date} onChange={(e) => {
                        if (new Date(e.target.value).getTime() >= new Date().getTime()) {
                            return false;
                        } else {
                            _service_date_(e.target.value);
                            sessionStorage.setItem('service_date', e.target.value);
                        }
                    }}
                        //     onFocus={(e) => { e.target.type = "date" }}
                        //     onBlur={(e) => { e.target.type = "text" }}
                        className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-2 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm" />
                </div>
            </div>
            <div>
                {service_area?.s_id && <AppLocation location={service_area} date={service_date} />}
            </div>

        </>
    )
}

function AppLocation({ location, date }) {
    let service_area = location;
    let [loaded, _loaded_] = useState(false);
    let [error, _error_] = useState(false);
    let [data, _data_] = useState();
    const prevProps = useRef();

    useEffect(() => {
        // This block will run after the component has rendered
        if (prevProps.current) {
            // Compare old and new props
            if (prevProps.current.location !== location || prevProps.current.date !== date) {
                console.log('someProp has changed!');
                // Perform actions based on the prop change
                _data_(null);
                _loaded_(false)
            }
        }
        prevProps.current = { location, date };
        if (service_area && service_area !== '') {
            API.get(`/fetch/${service_area.s_id}?date=${date}`).then((response) => {
                _loaded_(true);
                _data_(response.data);
            }).catch(e => { console.log(e); _error_(`${e}`); _loaded_(true) })
        }
    }, [location, date])
    return (<>
        {loaded && date && data &&
            <div className="pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center content-center">
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-2">
                        <h1 className="text-3xl">₹{data?.balance?.credit || '0.00'}</h1>
                        <h2 className="text-lg">Income</h2>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-2">
                        <h1 className="text-3xl">₹{data?.balance?.debit || '0.00'}</h1>
                        <h2 className="text-lg">Expense</h2>
                    </div>
                    <div className="col-span-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <h2 className="text-3xl"><span>{parseFloat(data?.balance?.credit - data?.balance?.debit).toFixed(2) >= 0 ? "₹" + parseFloat(data?.balance?.credit - data?.balance?.debit).toFixed(2) : "- ₹" + (parseFloat(data?.balance?.credit - data?.balance?.debit).toFixed(2) * -1)}</span> Balance</h2>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <NavLink to={`customers/${service_area.s_id}/`}>
                            <h1 className="text-3xl">{data?.customers || 0}</h1>
                            <h2 className="text-lg">Cutomers</h2>
                        </NavLink>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <NavLink to={`collection/${service_area.s_id}/collected`}>
                            <h1 className="text-3xl">{data?.collection || 0}</h1>
                            <h2 className="text-lg"> Collections</h2>
                        </NavLink>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <NavLink to={`collection/${service_area.s_id}/pending`}>
                            <h1 className="text-3xl">{data?.pending || 0}</h1>
                            <h2 className="text-lg">Pending</h2>
                        </NavLink>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <NavLink to={`transactions/${service_area.s_id}/`}>
                            <h1 className="text-3xl">{data?.balance.transactions || 0}</h1>
                            <h2 className="text-lg">Transactions</h2>
                        </NavLink>
                    </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 text-center my-4">

                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-2">
                        <NavLink to={`qr/${service_area?.s_id}`}>
                            <QrCodeIcon />
                            <h2 className="text-xs">Scan QR</h2>
                        </NavLink>
                    </div>
                    {service_area._owner_uid === data.u_id &&
                        <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-2">
                            <NavLink to={`overview/${service_area?.s_id}`}>
                                <MapIcon />
                                <h2 className="text-xs">Overview</h2>
                            </NavLink>
                        </div>
                    }
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-2">
                        <NavLink to={`reports/${service_area?.s_id}`}>
                            <DocumentChartBarIcon />
                            <h2 className="text-xs">Reports</h2>
                        </NavLink>
                    </div>
                    {service_area._owner_uid === data.u_id &&
                        <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-2">
                            <NavLink to={`manage/${service_area?.s_id}`}>
                                <Cog6ToothIcon />
                                <h2 className="text-xs">Manage</h2>
                            </NavLink>
                        </div>
                    }
                </div>
            </div>

        }
        {
            !loaded && <>Loading..</>
        }
        {
            loaded && error && <>{error}</>
        }

    </>)
}