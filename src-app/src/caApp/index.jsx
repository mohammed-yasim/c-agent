import React, { Component, createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { API } from "./etc/api";
import './etc/style.css';
import Example404 from "./etc/componenets/404";
import HomePage from "./etc/pages/homepage";
import { getToken, setUserSession } from "./etc/auth";

const AppContext = createContext();


export default function App() {
    return (<>
        <BrowserRouter>
            <Routes>
                {/* <Route index element={<Navigate to="app" />}></Route> */}
                <Route index element={getToken() === null ? <HomePage /> : <Navigate replace to="/app" />}></Route>
                <Route path="/app/*" element={getToken() !== null ? <AppHomeRoutes /> : <Navigate replace to="/login" />}></Route>
                <Route path="/login" element={<LoginCheck />} />
                <Route path="*" element={<Example404 />} />
            </Routes>
        </BrowserRouter>
    </>)
}

function LoginCheck() {
    return (<>
        <LoginPage />
    </>)
}

function LoginPage() {
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
        setUserSession('username');
        // Reset the form after submission
        setFormData({
            username: '',
            password: '',
        });
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
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
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            {this.state.loaded && !this.state.error && <AppContext.Provider value={this.state.data}>
                Version : {import.meta.env.VITE_APP_VERSION}
                <Routes>
                    <Route index element={<AppHome />}></Route>
                </Routes>
                <textarea value={JSON.stringify(this.state)} />
            </AppContext.Provider>
            }
        </>);
    }
}
function AppHome() {

    return (<>
        <HomeSelector />
    </>)
}
function HomeSelector() {
    const { ServiceAreas } = useContext(AppContext);
    const [service_locations, _service_locations_] = useState(ServiceAreas || []);
    const [service_area, _service_area_] = useState(null);
    useEffect(() => {

        let session = sessionStorage.getItem('service_area') || '';
        if (session && session !== '' && session !== null) {
            _service_area_(session);
        }
    }, [])
    return (
        <>
            <div>
                <select value={service_area || ''} onChange={(e) => {
                    if (e.target.value) {
                        sessionStorage.setItem('service_area', e.target.value);
                    }
                    _service_area_(e.target.value);

                }}>
                    <option value={''}>choose location/servce area</option>
                    {service_locations.map((location, key) => {
                        return (
                            <option key={key} value={location.s_id}>{location.name}</option>
                        )
                    })}
                </select>
            </div>
            <div>
                {service_area && <>
                    <AppLocation location={ServiceAreas.find(a => a.s_id === service_area)} />
                </>}
            </div>

        </>
    )
}

function AppLocation({ location }) {
    let service_area = location;
    let [loaded, _loaded_] = useState(false)
    useEffect(() => {
        if (service_area && service_area !== '') {
            API.get(`/fetch/${service_area.s_id}`).then((response) => {
                _loaded_(true);
            }).catch(e => { console.log(e) })
        }
    }, [location])
    return (<>
        {loaded &&
            <div>
                {service_area.name}
                <hr />
                <div>
                    <div>Credit</div>
                    <div>Debit</div>
                    <div>Balance</div>
                </div>
                <div>
                    <div>
                        <NavLink to={`${location}/collect-monthly`}> Monthly Collection (Pending)</NavLink>
                    </div>
                </div>

            </div>
        }
    </>)
}