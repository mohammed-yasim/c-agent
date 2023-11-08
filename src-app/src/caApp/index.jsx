import React, { Component, createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { API } from "./etc/api";

const AppContext = createContext();


export default function App() {
    return (<>
        <BrowserRouter>
            <Routes>
                {/* <Route index element={<Navigate to="app" />}></Route> */}
                <Route index element={<>
            Version : {import.meta.env.VITE_APP_VERSION}
                </>}></Route>
                <Route path="/app/*" element={<AppHomeRoutes />}></Route>
            </Routes>
        </BrowserRouter>
    </>)
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