const getToken = () => {
    return localStorage.getItem("token") || null;
};
const setUserSession = (token) => {
    localStorage.setItem("token", token);
};
const removeUserSession = () => {
    localStorage.removeItem("token");
};
export {
    getToken, setUserSession, removeUserSession
}