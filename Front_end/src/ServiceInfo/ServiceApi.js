import axios from "axios";

const API_BASE = "/api/services";

export const getAllServices = () =>
  axios.get(API_BASE); 