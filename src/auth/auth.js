export const getAuthHeaders = (username:string, password:string) => {
    const token = btoa(`${username}:${password}`);
    return { Authorization: `Basic ${token}` };
};
