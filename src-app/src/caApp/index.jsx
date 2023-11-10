import React, { Component, createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { API } from "./etc/api";

import { Dropdown } from 'primereact/dropdown';
        
const AppContext = createContext();


export default function App() {
    return (<>
        <BrowserRouter>
            <Routes>
                {/* <Route index element={<Navigate to="app" />}></Route> */}
                <Route index element={<HomePage />}></Route>
                <Route path="/app/*" element={<AppHomeRoutes />}></Route>
                <Route path="/login" element={<LoginCheck />} />
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

        // Reset the form after submission
        setFormData({
            username: '',
            password: '',
        });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );

}

function HomePage() {
    return (
        <>
            Version : {import.meta.env.VITE_APP_VERSION}<br />
            <NavLink to="/login">Login</NavLink>

        </>
    )
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
                <span className="p-float-label">
                    <Dropdown inputId="dd-city" value={service_area || ''} onChange={(e) =>{
                          if (e.value) {
                            sessionStorage.setItem('service_area', e.value);
                        }
                        _service_area_(e.value);
    
                    }} options={service_locations} optionLabel="name" optionValue="s_id" className="w-full md:w-14rem p-inputtext-sm" />
                    <label htmlFor="dd-city">Select a City</label>
                </span>
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