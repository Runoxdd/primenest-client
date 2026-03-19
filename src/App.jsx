import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import { Layout, RequireAuth, RequireAdmin } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import AssistantPage from "./routes/assistantPage/assistantPage";
import AboutPage from "./routes/aboutPage/AboutPage";
import ContactPage from "./routes/contactPage/ContactPage";
import MessagesPage from "./routes/messagesPage/MessagesPage";
import AdminPage from "./routes/adminPage/AdminPage";
import { listPageLoader, profilePageLoader, singlePageLoader, messagesLoader } from "./lib/loaders";
import { Suspense } from "react";

// Loading fallback component for Suspense
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="loader-spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/list", element: <ListPage />, loader: listPageLoader },
        { path: "/:id", element: <SinglePage />, loader: singlePageLoader },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/about", element: <AboutPage /> },
        { path: "/contact", element: <ContactPage /> },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        { path: "/profile", element: <ProfilePage />, loader: profilePageLoader },
        { path: "/profile/update", element: <ProfileUpdatePage /> },
        { path: "/add", element: <NewPostPage /> },
        { path: "/edit/:id", element: <NewPostPage />, loader: singlePageLoader }, // EDIT ROUTE
        { path: "/assistant", element: <AssistantPage /> },
        { 
          path: "/messages", 
          element: (
            <Suspense fallback={<PageLoader />}>
              <MessagesPage />
            </Suspense>
          ), 
          loader: messagesLoader 
        },
      ],
    },
    {
      path: "/",
      element: <RequireAdmin />,
      children: [
        { path: "/admin", element: <AdminPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;