import React, {
  Component,
  createContext,
  useContext,
  useEffect,
  useState,
  Fragment,
  useRef,
} from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { API } from "./etc/api";
import "./etc/style.css";
import Example404 from "./etc/components/404";
import HomePage from "./etc/pages/homepage";
import { getToken, removeUserSession, setUserSession } from "./etc/auth";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  
  QrCodeIcon,
} from "@heroicons/react/20/solid";
import Test from "./etc/pages/qr";
import { PowerIcon, UserCircleIcon, ChartPieIcon, DocumentChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Customer, Customers } from "./etc/pages/customers";
import ManagePage from "./etc/pages/manage";

import BottomNav from "./etc/components/bottomnav";


import { Menu } from '@headlessui/react'


const AppContext = createContext();

export default function App() {
  return (
    <>
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
    </>
  );
}

function LogoutAction() {
  if (removeUserSession()) {
    return <Navigate replace to="/" />;
  }
}

function LoginCheck() {
  if (getToken() === null) {
    return <LoginPage />;
  } else {
    return <Navigate replace to="/app" />;
  }
}

function AppCheck() {
  if (getToken() !== null) {
    return <AppHomeRoutes />;
  } else {
    return <Navigate replace to="/login" />;
  }
}

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error__state, _error__state_] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    _error__state_(null);
    e.preventDefault();
    // Perform authentication logic here (e.g., send data to a server, validate credentials)
    console.log("Form submitted with data:", formData);
    // Add your authentication logic here
    API.post("login", formData)
      .then((response) => {
        setUserSession(response.data?.token);
        navigate("/app");
      })
      .catch((error) => {
        _error__state_(`${error?.response?.data}`);
      });
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
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          cAgent{" "}
          <span className="text-xs rounded-lg bg-red-500 p-1 text-white font-light">
            {import.meta.env.VITE_APP_VERSION}
          </span>
        </h1>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error__state && (
          <p className="my-3 text-xs text-red-500 text-center">
            {error__state}
          </p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
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
      data: {},
    };
    this.load_data = this.load_data.bind(this);
  }
  load_data() {
    API.get("sync")
      .then((response) => {
        this.setState({ loaded: true, error: false, data: response.data });
      })
      .catch((err) => {
        this.setState({ loaded: true, error: true, data: {} });
      });
  }
  componentDidMount() {
    this.load_data();
  }
  render() {
    return (
      <>
        {!this.state.loaded && !this.state.error && <>Loading..</>}
        {this.state.loaded && !this.state.error && (
          <AppContext.Provider value={this.state.data}>
            <div className="bg-white min-h-screen select-none">
              <Routes>
                <Route index element={<AppHome />}></Route>
                <Route path=":_sid/customers/*" element={<Customers />}></Route>
                <Route
                  path=":_sid/customer/:_cid/*"
                  element={<Customer />}
                ></Route>
                <Route path="qr/:_sid" element={<Test />}></Route>
                <Route path="manage/*" element={<ManagePage />}></Route>
                <Route path="*" element={<Example404 />} />
              </Routes>
            </div>
            
          </AppContext.Provider>
        )}
        {this.state.error && (
          <>
            Network Error <br />
            <div className="block p-6 text-xs text-gray-500 text-center dark:text-gray-400">
              {" "}
              Version : {import.meta.env.VITE_APP_VERSION}
            </div>
          </>
        )}
      </>
    );
  }
}
function AppHome() {
  let navigate = useNavigate();
  return (
    <>
      <div className="bg-purple-700 fixed top-0 bottom-0 left-0 right-0 min-h-screen min-w-fit">
          <HomeSelector />
      </div>
    </>
  );
}

function HomeSelector() {
  const { ServiceAreas } = useContext(AppContext);
  const [service_area, _service_area_] = useState({});
  const [service_date, _service_date_] = useState(
    sessionStorage.getItem("service_date") ||
      new Date().toISOString().slice(0, 10)
  );
  useEffect(() => {
    let session = sessionStorage.getItem("service_area") || "";
    if (session && session !== "" && session !== null) {
      _service_area_(ServiceAreas.find((a) => a.s_id === session));
    } else {
      _service_area_({ s_id: "", name: "Choose" });
    }
  }, [ServiceAreas, service_area]);
  return (
    <div className="h-full flex flex-col">
      <div className="w-full px-3 py-5 flex justify-between items-center">
        <div className="w-[60%]">
          <Listbox
            value={service_area?.s_id}
            onChange={(value) => {
              if (value) {
                sessionStorage.setItem("service_area", value);
                _service_area_(ServiceAreas.find((a) => a.s_id === value));
              } else {
                sessionStorage.removeItem("service_area");
                _service_area_({ s_id: "", name: "Choose" });
              }
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white/20 py-2 pl-3 pr-3 text-left  focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-xs">
                <span className="block truncate text-white font-semibold">{service_area?.name} </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    className="h-5 w-5 text-white"
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
                <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2  ${
                        active ? "" : "text-gray-900"
                      }`
                    }
                    value={""}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate pl-3 font-medium text-gray-600 uppercase tracking-widest text-xs ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          Choose Service area
                        </span>
                        {/* {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                            <CheckIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
                          </span>
                        ) : null} */}
                      </>
                    )}
                  </Listbox.Option>
                  {ServiceAreas?.map((location, key) => (
                    <Listbox.Option
                      key={key}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-purple-100 text-purple-900"
                            : "text-gray-900"
                        }`
                      }
                      value={location.s_id}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {location.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
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







        <div>
        {/* <NavLink to="/logsout" className="flex items-center gap-1"> */}
            <div>


            {/* <PowerIcon className="text-red-500" width={24} /> */}
                            

            <div className=" text-right">
               
      <Menu as="div" className="relative inline-block text-left">
        
        <div>
          <Menu.Button className="inline-flex items-center w-full justify-center rounded-md py-2 px-3 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            <img className="w-6 h-6 border-2 rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />

            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Menu.Items className="absolute z-10 right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            
        <div className="px-1 py-1 ">
              <Menu.Item>
            
                    <div className="text-sm px-2 py-2">View account</div>
               
                </Menu.Item>
              </div>
            
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <NavLink to="/logout"
                    className={`${
                      active ? 'bg-purple-700 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Logout
                  
                  </NavLink>
                )}
              </Menu.Item>
              
              </div>
              
              </Menu.Items>
     
      </Menu>
      </div>
                            
         
      </div>
         
          {/* </NavLink> */}
          </div>
      </div>








      <div className="bg-white rounded-t-[2rem] overflow-y-auto p-4 h-full">
        <h2 className="font-bold text-xl my-3">👋 welcome back, yasim.</h2>
        <div className="w-2/5">
          <input
            type="date"
            value={service_date}
            onChange={(e) => {
              if (new Date(e.target.value).getTime() >= new Date().getTime()) {
                return false;
              } else {
                _service_date_(e.target.value);
                sessionStorage.setItem("service_date", e.target.value);
              }
            }}
            //     onFocus={(e) => { e.target.type = "date" }}
            //     onBlur={(e) => { e.target.type = "text" }}
            className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-2 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
        </div>
        <div className="pb-48">
          {service_area?.s_id && (
            <AppLocation location={service_area} date={service_date} />
          )}
        </div>
      </div>
    </div>
  );
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
      if (
        prevProps.current.location !== location ||
        prevProps.current.date !== date
      ) {
        console.log("someProp has changed!");
        // Perform actions based on the prop change
        _data_(null);
        _loaded_(false);
      }
    }
    prevProps.current = { location, date };
    if (service_area && service_area !== "") {
      API.get(`/fetch/${service_area.s_id}?date=${date}`)
        .then((response) => {
          _loaded_(true);
          _data_(response.data);
        })
        .catch((e) => {
          console.log(e);
          _error_(`${e}`);
          _loaded_(true);
        });
    }
  }, [location, date, service_area]);
  return (
    <>
      {loaded && date && data && (
        <div className="pt-4 ">
          <div className="border rounded-lg bg-white drop-shadow-xl ">
            <div className="bg-gray-100 py-2.5 px-3  flex items-center justify-between">
              <h6 className="font-semibold text-lg text-gray-800">Day book</h6>
              <button className="bg-slate-200 border border-gray-100 text-gray-900 px-3 pr-4 py-2 rounded-full flex items-center gap-1 text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4
                   h-4
                  "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <p className="leading-tight"> New entry </p>
              </button>
            </div>
            <div className="p-5">
              <div className="flex gap-12">
                <div className="info-number income">
                  <h1 className="text-3xl text-green-600">
                    ₹{data?.balance?.credit || "0.00"}
                  </h1>
                  <h2 className="text-md">Income</h2>
                </div>

                <div className="info-number income">
                  <h1 className="text-3xl text-red-600">
                    ₹{data?.balance?.debit || "0.00"}
                  </h1>
                  <h2 className="text-md">Expense</h2>
                </div>
              </div>

              <div className="mt-6 info-number income">
                <h1 className="text-3xl ">
                  {parseFloat(
                    data?.balance?.credit - data?.balance?.debit
                  ).toFixed(2) >= 0
                    ? "₹" +
                      parseFloat(
                        data?.balance?.credit - data?.balance?.debit
                      ).toFixed(2)
                    : "- ₹" +
                      parseFloat(
                        data?.balance?.credit - data?.balance?.debit
                      ).toFixed(2) *
                        -1}
                </h1>
                <h2 className="text-md">Balance</h2>
              </div>

              <NavLink to={`transactions/${service_area.s_id}/`}>
                <p className="text-lg mt-6">
                  <b>{data?.balance.transactions || 0}</b> transactions
                </p>
              </NavLink>
            </div>
          </div>

          <div className="mt-4 flex gap-2 w-full">
            <NavLink
              to={`${service_area.s_id}/customers/collection`}
              className="bg-gray-100 border border-green-500 bg-green-100 text-green-800 flex-1 p-4  rounded-lg flex gap-2 items-center font-semibold"
            >
                <div className="flex items-center justify-center p-2  text-green-800 rounded-full">

              



              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

                </div>
              Collection <span>({data?.collection || 0})</span>
            </NavLink>



            <NavLink
              to={`${service_area.s_id}/customers/pending`}
              className="bg-gray-100 border border-red-500 bg-red-100 text-red-800 flex-1 p-4  rounded-lg flex gap-2 items-center font-semibold"
            >
                <div className="flex items-center justify-center p-2  text-red-800 rounded-full">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
                </div>
              Pending <span>({data?.pending || 0})</span>
            </NavLink>
            </div>

           


          <div className="FAB fixed bottom-5 shadow-2xl right-2  text-white bg-purple-700 rounded-full px-4  py-2.5 ">
            <NavLink
              to={`qr/${service_area?.s_id}`}
              className="flex items-center gap-2 "
            >
              <QrCodeIcon className="w-8 h-8" />{" "}
              <span className=""> Scan QR </span>
            </NavLink>
          </div>


        <hr className="mt-6 mb-4" />
          <div className="flex justify-between gap-1 my-4">
            <div className=" p-2 flex-1">
              <NavLink className={"flex flex-col items-center"} to={`${service_area.s_id}/customers`}>
                <UserCircleIcon className="w-9 h-9 stroke-1.5 text-purple-900" />
                
           
                <h2 className="text-sm mt-1 text-purple-900 font-semibold">Customers</h2>
              </NavLink>
            </div>
            {service_area._owner_uid === data.u_id && (
              <div className=" p-2 flex-1">
                <NavLink className={"flex flex-col items-center"} to={`overview/${service_area?.s_id}`}>
                  <ChartPieIcon className="w-9 h-9 stroke-1.5 text-purple-900"/>
                  <h2 className="text-sm mt-1 text-purple-900 font-semibold">Overview</h2>
                </NavLink>
              </div>
            )}
            <div className=" p-2 flex-1">
              <NavLink className={"flex flex-col items-center"} to={`reports/${service_area?.s_id}`}>
                <DocumentChartBarIcon className="w-9 h-9 stroke-1.5 text-purple-900"/>
                <h2 className="text-sm mt-1 text-purple-900 font-semibold">Reports</h2>
              </NavLink>
            </div>
            {service_area._owner_uid === data.u_id && (
              <div className=" p-2 flex-1">

               
                <NavLink className={"flex flex-col items-center"} to={`manage/${service_area?.s_id}`}>
                  <Cog6ToothIcon className="w-9 h-9 stroke-1.5 text-purple-900" />
                  <h2 className="text-sm mt-1 text-purple-900 font-semibold">Manage</h2>
                </NavLink>
              </div>
            )}
          </div>

          {/* <BottomNav /> */}
        </div>
      )}
      {!loaded && <>Loading..</>}
      {loaded && error && <>{error}</>}
    </>
  );
}
