
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { SignIn } from './Pages/SignIn'
import { SignUp } from './Pages/SignUp'
import { Movies } from './Pages/Movies'
import { CreateReview } from './Pages/CreateReview'
import { EditReview } from './Pages/EditReview'
import { MyReviews } from './Pages/MyReviews'
import { ShareReviews } from './Pages/ShareReviews'

function App() {

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/movies" element={<Movies/>} />
      <Route path="/create-review" element={<CreateReview/>} />
      <Route path="/edit-review" element={<EditReview/>} />
      <Route path="/my-reviews" element={<MyReviews/>} />
      <Route path="/share-reviews" element={<ShareReviews/>} />
    </Routes>
  )
}

export default App
