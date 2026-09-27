import axios from "axios";

const urlExternaBase = "https://jsonplaceholder.typicode.com";



const apiExternas = axios.create({
    baseURL: urlExternaBase,
    headers: {
        "Content-Type": "application/json"
    }
});


// apiExternas.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });



apiExternas.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);



export const obtenerUsuariosExternosServices = async () => {
    const response = await apiExternas.get("/users");
    return response.data;
}


export const obtenerUsuarioExternosPorIdServices = async (userId) => {
    const response = await apiExternas.get(`/user/${userId}`);
    return response.data;
}






