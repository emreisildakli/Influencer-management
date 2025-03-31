import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import InfluencersList from "./pages/InfluencersList";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/influencers" />} />
            <Route path="/influencers" element={<InfluencersList />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
