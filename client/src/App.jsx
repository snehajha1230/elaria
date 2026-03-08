// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Home from './pages/Home';
import ComfortSpace from './pages/ComfortSpace';
import CrushNotes from './pages/ComfortElements/CrushNotes';
import SelfDiary from './pages/ComfortElements/SelfDiary';
import QuietLibrary from "./pages/ComfortElements/QuietLibrary";
import AddBook from "./pages/AddPersonal/AddBook";
import SoundCorner from "./pages/ComfortElements/SoundCorner";
import ComfortScreen from "./pages/ComfortElements/ComfortScreen";
import Poetry from "./pages/ComfortElements/Poetry";
import AddTrack from "./pages/AddPersonal/AddTrack";
import AddMedia from "./pages/AddPersonal/AddMedia";
import AddPoem from "./pages/AddPersonal/AddPoem";
import DiagnoseYourself from './pages/Toolkit/DiagnoseYourself';
import Support from "./pages/Support";
import MoodTracker from './pages/Toolkit/MoodTracker';
import Contacts from './pages/Toolkit/Contacts';
import ApplyHelper from "./pages/Community/ApplyHelper";
import HelperDirectory from "./pages/Community/HelperDirectory";
import HelperProfile from "./pages/Community/HelperProfile";
import HelperDashboard from "./pages/Community/HelperDashboard";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ChatWindow from "./pages/Community/ChatWindow";
import NotificationsPage from './pages/Community/NotificationsPage';
import AiCompanion from "./pages/AIBot/AiCompanion";
import TestSocket from "./pages/TestSocket";
import GratitudeJournal from "./pages/Toolkit/GratitudeJournal";
import MindfulnessPage from "./pages/Toolkit/Mindfulness";
import FeatureGuide from "./pages/Toolkit/FeatureGuide";
import Friends from "./pages/ComfortElements/Friends";
import FriendHome from "./pages/ComfortElements/FriendHome";
// import ResetPassword from "./pages/ResetPassword";
import CompleteProfile from "./pages/CompleteProfile";
import OAuthRedirectHandler from './components/OAuthRedirectHandler';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<LandingPage />} />
           <Route path="/testsocket" element={<TestSocket />} />

          {/* Private Routes */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/comfort-space" element={<PrivateRoute><ComfortSpace /></PrivateRoute>} />
          <Route path="/crush-notes" element={<PrivateRoute><CrushNotes /></PrivateRoute>} />
          <Route path="/self-diary" element={<PrivateRoute><SelfDiary /></PrivateRoute>} />
          <Route path="/quiet-library" element={<PrivateRoute><QuietLibrary /></PrivateRoute>} />
          <Route path="/add-book" element={<PrivateRoute><AddBook /></PrivateRoute>} />
          <Route path="/sound-corner" element={<PrivateRoute><SoundCorner /></PrivateRoute>} />
          <Route path="/comfort-screen" element={<PrivateRoute><ComfortScreen /></PrivateRoute>} />
          <Route path="/poetry" element={<PrivateRoute><Poetry /></PrivateRoute>} />
          <Route path="/add-track" element={<PrivateRoute><AddTrack /></PrivateRoute>} />
          <Route path="/add-media" element={<PrivateRoute><AddMedia /></PrivateRoute>} />
          <Route path="/add-poem" element={<PrivateRoute><AddPoem /></PrivateRoute>} />
          <Route path="/diagnose-yourself" element={<PrivateRoute><DiagnoseYourself /></PrivateRoute>} />
          <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
          <Route path="/mood-tracker" element={<PrivateRoute><MoodTracker /></PrivateRoute>} />
          <Route path="/contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
          <Route path="/apply-helper" element={<PrivateRoute><ApplyHelper /></PrivateRoute>} />
          <Route path="/helper-directory" element={<PrivateRoute><HelperDirectory /></PrivateRoute>} />
          <Route path="/helper/:id" element={<HelperProfile />} />
          <Route path="/helper-dashboard" element={<HelperDashboard />} />
          <Route path="/chat/:chatId" element={<PrivateRoute><ChatWindow /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/ai-companion" element={<PrivateRoute><AiCompanion /></PrivateRoute>} />
          <Route path="/gratitude-journal" element={<PrivateRoute><GratitudeJournal /></PrivateRoute>} />
          <Route path="/mindfulness" element={<PrivateRoute><MindfulnessPage /></PrivateRoute>} />
          <Route path="/wellness-tools-guide" element={<PrivateRoute><FeatureGuide /></PrivateRoute>} />
          <Route path="/friendscommunity" element={<PrivateRoute><Friends /></PrivateRoute>} />
          <Route path="/friend-home/:friendId" element={<PrivateRoute><FriendHome /></PrivateRoute>} />
          {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/oauth-callback" element={<OAuthRedirectHandler />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

          
                   
          {/* Catch-all for 404 */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
