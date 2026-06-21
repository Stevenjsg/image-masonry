const API_PEXEL = process.env.PEXEL_API_KEY;
if (!API_PEXEL) {
  throw new Error("Falta la key de Pexel");
}
export default API_PEXEL;

export const getRequest = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: API_PEXEL,
  },
};
