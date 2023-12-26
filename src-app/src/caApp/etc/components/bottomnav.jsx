
import { NavLink } from 'react-router-dom'

export default function BottomNav() {



  
  return (
    
    <div className="bottom-nav py-4 bg-[#242626] text-white fixed left-0 right-0 bottom-0 w-full">
    <div className="flex justify-around nav-actions-panel">


    <NavLink to="/" className={(({ isActive }) => isActive ? 'selected' : '')}>
      <div className="nav-element flex flex-col items-center">
        <div className="nav-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill=""
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.79 22.75H6.21C3.47 22.75 1.25 20.52 1.25 17.78V10.37C1.25 9.01 2.09 7.3 3.17 6.46L8.56 2.26C10.18 1 12.77 0.940005 14.45 2.12L20.63 6.45C21.82 7.28 22.75 9.06 22.75 10.51V17.79C22.75 20.52 20.53 22.75 17.79 22.75ZM9.48 3.44L4.09 7.64C3.38 8.2 2.75 9.47 2.75 10.37V17.78C2.75 19.69 4.3 21.25 6.21 21.25H17.79C19.7 21.25 21.25 19.7 21.25 17.79V10.51C21.25 9.55001 20.56 8.22 19.77 7.68L13.59 3.35C12.45 2.55 10.57 2.59 9.48 3.44Z"
              fill='#6C6C6C'
              
            />
            <path
              d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18C12.75 18.41 12.41 18.75 12 18.75Z"
              fill='#6C6C6C'

            />
          </svg>
        </div>
        <p className="text-xs mt-1 text-[#6C6C6C]">home</p>
      </div>
      </NavLink>
      


      <NavLink to="/prices" className={(({ isActive }) => isActive ? 'selected' : '')}>

      <div className="nav-element flex flex-col items-center">
        <div className="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill="#6C6C6C"/>
<path d="M7.33011 15.24C7.17011 15.24 7.01011 15.19 6.87011 15.08C6.54011 14.83 6.48011 14.36 6.73011 14.03L9.11011 10.94C9.40011 10.57 9.81011 10.33 10.2801 10.27C10.7401 10.21 11.2101 10.34 11.5801 10.63L13.4101 12.07C13.4801 12.13 13.5501 12.13 13.6001 12.12C13.6401 12.12 13.7101 12.1 13.7701 12.02L16.0801 9.04001C16.3301 8.71001 16.8101 8.65001 17.1301 8.91001C17.4601 9.16001 17.5201 9.63001 17.2601 9.96001L14.9501 12.94C14.6601 13.31 14.2501 13.55 13.7801 13.6C13.3101 13.66 12.8501 13.53 12.4801 13.24L10.6501 11.8C10.5801 11.74 10.5001 11.74 10.4601 11.75C10.4201 11.75 10.3501 11.77 10.2901 11.85L7.91011 14.94C7.78011 15.14 7.56011 15.24 7.33011 15.24Z" fill="#6C6C6C"/>
</svg>

        </div>
        <p className="text-xs mt-1 text-[#6C6C6C]">prices</p>
      </div>
      </NavLink>




    <NavLink to="/profile" className={(({ isActive }) => isActive ? 'selected' : '')}>

      <div className="nav-element flex flex-col items-center">
        <div className="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.1596 11.62C12.1296 11.62 12.1096 11.62 12.0796 11.62C12.0296 11.61 11.9596 11.61 11.8996 11.62C8.99963 11.53 6.80963 9.25 6.80963 6.44C6.80963 3.58 9.13963 1.25 11.9996 1.25C14.8596 1.25 17.1896 3.58 17.1896 6.44C17.1796 9.25 14.9796 11.53 12.1896 11.62C12.1796 11.62 12.1696 11.62 12.1596 11.62ZM11.9996 2.75C9.96963 2.75 8.30963 4.41 8.30963 6.44C8.30963 8.44 9.86963 10.05 11.8596 10.12C11.9096 10.11 12.0496 10.11 12.1796 10.12C14.1396 10.03 15.6796 8.42 15.6896 6.44C15.6896 4.41 14.0296 2.75 11.9996 2.75Z" fill="#6C6C6C"/>
<path d="M12.1696 22.55C10.2096 22.55 8.23961 22.05 6.74961 21.05C5.35961 20.13 4.59961 18.87 4.59961 17.5C4.59961 16.13 5.35961 14.86 6.74961 13.93C9.74961 11.94 14.6096 11.94 17.5896 13.93C18.9696 14.85 19.7396 16.11 19.7396 17.48C19.7396 18.85 18.9796 20.12 17.5896 21.05C16.0896 22.05 14.1296 22.55 12.1696 22.55ZM7.57961 15.19C6.61961 15.83 6.09961 16.65 6.09961 17.51C6.09961 18.36 6.62961 19.18 7.57961 19.81C10.0696 21.48 14.2696 21.48 16.7596 19.81C17.7196 19.17 18.2396 18.35 18.2396 17.49C18.2396 16.64 17.7096 15.82 16.7596 15.19C14.2696 13.53 10.0696 13.53 7.57961 15.19Z" fill="#6C6C6C"/>
</svg>

        </div>
        <p className="text-xs mt-1 text-[#6C6C6C]">profile</p>
      </div>
      </NavLink>

      
    </div>
  </div>
  )
}
