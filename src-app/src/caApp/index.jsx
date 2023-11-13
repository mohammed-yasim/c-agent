import React, { Component, createContext, useContext, useEffect, useState, Fragment } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { API } from "./etc/api";
import './etc/style.css';
import Example404 from "./etc/componenets/404";
import HomePage from "./etc/pages/homepage";
import { getToken, removeUserSession, setUserSession } from "./etc/auth";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform authentication logic here (e.g., send data to a server, validate credentials)
        console.log('Form submitted with data:', formData);
        // Add your authentication logic here
        setUserSession(formData.username);
        // Reset the form after submission
        setFormData({
            username: '',
            password: '',
        });
        // Redirect
        navigate('/app');
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">cAgent <span className="text-xs rounded-lg bg-red-500 p-1 text-white font-light">{import.meta.env.VITE_APP_VERSION}</span></h1>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                <div className="bg-white min-h-screen">
                    <Routes>
                        <Route index element={<AppHome />}></Route>
                    </Routes>
                </div>
                {/* <textarea value={JSON.stringify(this.state)} /> */}
            </AppContext.Provider>
            }
            {
                this.state.error && <>
                    Network Error</>
            }

        </>);
    }
}
function AppHome() {
    let navigate = useNavigate();
    return (<>
        <div className="p-4">
            <HomeSelector />
            <button onClick={() => {
                navigate('/logout');
            }}>
                Logout
            </button>
        </div>
    </>)
}

const people = [
    { name: 'Wade Cooper' },
    { name: 'Arlene Mccoy' },
    { name: 'Devon Webb' },
    { name: 'Tom Cook' },
    { name: 'Tanya Fox' },
    { name: 'Hellen Schmidt' },
]

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

            <div className="w-full grid grid-cols-3">
                <div className="col-span-2">
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
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                <span className="block truncate">{service_area.name} </span>
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
                <div className="">
                    <input type="date" value={service_date} onChange={(e) => {
                        if (new Date(e.target.value).getTime() >= new Date().getTime()) {
                            alert("The Date must be Bigger or Equal to today date");
                            return false;
                        } else {
                            _service_date_(e.target.value);
                            sessionStorage.setItem('service_date', e.target.value);
                        }
                    }} className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm" />
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
    let [loaded, _loaded_] = useState(false)
    useEffect(() => {
        if (service_area && service_area !== '') {
            API.get(`/fetch/${service_area.s_id}?date=${date}`).then((response) => {
                _loaded_(true);
            }).catch(e => { console.log(e) })
        }
    }, [location,date])
    return (<>
        {loaded && date &&
            <div>
                <div className="px-2">
                    {service_area.name} on {date}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-2">
                        <h1 className="text-4xl">₹0.00</h1>
                        <h2 className="text-lg">Income</h2>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-2">
                        <h1 className="text-4xl">₹0.00</h1>
                        <h2 className="text-lg">Expense</h2>
                    </div>
                    <div className="col-span-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <h2 className="text-3xl"><span>₹0.00</span> Balance</h2>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <h1 className="text-4xl">0</h1>
                        <h2 className="text-lg">Pending</h2>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <h1 className="text-4xl">0</h1>
                        <h2 className="text-lg"> Collections</h2>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <h1 className="text-4xl">0</h1>
                        <h2 className="text-lg">Cutomers</h2>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 p-4">
                        <h1 className="text-4xl">0</h1>
                        <h2 className="text-lg">Invoices</h2>
                    </div>
                </div>
            </div>
        }
        {
            !loaded && <>Loading..</>
        }
    </>)
}