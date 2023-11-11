
const getToken = () => {
    return localStorage.getItem("token") || null;
};
const setUserSession = (token) => {
    localStorage.setItem("token", token);
    return true
};
const removeUserSession = () => {
    localStorage.removeItem("token");
    return true
};




export {
    getToken, setUserSession, removeUserSession
}