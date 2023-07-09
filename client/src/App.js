import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/Home/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import SinglePost from './pages/SinglePost'
import NewPost from './pages/NewPost'
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route index path="/" element={<HomePage/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/blog/:slug" element={<SinglePost />} />
          <Route path="/newPost" element={<NewPost />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Toaster/>
    </div>
  );
}

export default App;
