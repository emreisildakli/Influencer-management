import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000"
});

export const getInfluencerList = (query: string) => {
  return instance.get(`/influencers?name=${query}`);
};

export const createInfluencer = (request: {
  name: string;
  lastName: string;
  accounts: { tiktok: Array<string>; instagram: Array<string> };
}) => {
  return instance.post("/influencers", request);
};

export const deleteInfluencer = (id: string) => {
  return instance.delete(`/influencers/${id}`);
};
